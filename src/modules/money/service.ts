import {createHash,randomUUID} from "node:crypto";
import {and,desc,eq,inArray,isNull,or,sql} from "drizzle-orm";
import {z} from "zod";
import {getDb} from "../../platform/database/client";
import {services,serviceMembers,workspaceCommands} from "../../platform/database/schema";
import {SecurityError} from "../../platform/security/origin";
import {getBalance,postJournal,type LedgerTransaction,type LedgerPosition} from "../ledger/service";
import {ledgerEntries,ledgerJournals} from "../ledger/schema";
import type {MONEY_BUCKETS} from "../ledger/contracts";
import {operatorServiceAccess} from "../operations/schema";
import {requireServiceReader} from "../services/service-reader";
import {requireSandboxParticipant} from "../sandbox/service";
import {evaluate} from "../policy/evaluate";
import {moneyAccounts,moneyAccountServices,moneyCommands,moneyFundingIntents,moneyTopups,moneyWithdrawalIntents,moneyWithdrawals,moneyWithdrawalEvents} from "./schema";
import {moneyCommandSchema,processMoneyWithdrawalSchema,type MoneyCommand,type ProcessMoneyWithdrawal,type MoneyFundingIntent,type MoneyTopupReceipt,type MoneyWithdrawalIntent,type MoneyWithdrawalReceipt,type OwnedMoneyAccount,type MoneyAccountOverview} from "./contracts";
import {formatMoney} from "./format";

export type MoneyAccount=typeof moneyAccounts.$inferSelect;
type Tx=LedgerTransaction;
type MoneyBucket=typeof MONEY_BUCKETS[number];
function id(value:string){const parsed=z.uuid().safeParse(value);if(!parsed.success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return parsed.data.toLowerCase();}
function parse<T>(schema:z.ZodType<T>,raw:unknown){const p=schema.safeParse(raw);if(!p.success)throw new SecurityError("INVALID_REQUEST",422);return p.data;}
async function now(tx:Tx){const r=await tx.execute(sql`select clock_timestamp() as now`);return new Date(r.rows[0]!.now as string|Date);}
async function claimCommand(tx:Tx,personId:string,accountId:string,commandId:string,kind:typeof moneyCommands.$inferInsert.kind,payload:unknown){
 await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"money-command:"+commandId.toLowerCase()},0))`);
 const [legacy]=await tx.select({id:workspaceCommands.commandId}).from(workspaceCommands).where(eq(workspaceCommands.commandId,commandId));
 if(legacy)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);
 const digest=createHash("sha256").update(JSON.stringify({personId,accountId,kind,payload})).digest("hex");
 const [old]=await tx.select().from(moneyCommands).where(eq(moneyCommands.commandId,commandId));
 if(old){if(old.actorId!==personId||old.moneyAccountId!==accountId||old.kind!==kind||old.digest!==digest)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);}
 else await tx.insert(moneyCommands).values({commandId,moneyAccountId:accountId,actorId:personId,kind,digest});
}
export function moneyPosition(moneyAccountId:string,bucket:MoneyBucket="MONEY_AVAILABLE"):LedgerPosition{return {serviceId:null,moneyAccountId:id(moneyAccountId),bucket};}

/** A read cannot create an account, associate services or enlarge access. */
export async function getServiceMoneyAccount(tx:Tx,serviceId:string):Promise<MoneyAccount>{
 const [row]=await tx.select({account:moneyAccounts,service:services,link:moneyAccountServices}).from(moneyAccountServices).innerJoin(moneyAccounts,eq(moneyAccounts.id,moneyAccountServices.moneyAccountId)).innerJoin(services,eq(services.id,moneyAccountServices.serviceId)).where(eq(moneyAccountServices.serviceId,id(serviceId)));
 if(!row||row.account.ownerPersonId!==row.service.primaryPersonId||row.account.serviceKind!==row.service.kind||row.link.serviceKind!==row.service.kind)throw new SecurityError("MONEY_ACCOUNT_UNAVAILABLE",404);
 return row.account;
}
export async function lockMoneyAccount(tx:Tx,moneyAccountId:string){await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"money-account:"+id(moneyAccountId)},0))`);}
/** Acquire before workspace/terminal/command locks, including connected payment/refund callers. */
export async function lockMoneyAccountsForServices(tx:Tx,serviceIds:string[]):Promise<MoneyAccount[]>{
 const discovered:MoneyAccount[]=[];for(const serviceId of [...new Set(serviceIds.map(id))])discovered.push(await getServiceMoneyAccount(tx,serviceId));
 const accounts=[...new Map(discovered.map(account=>[account.id,account])).values()].sort((a,b)=>a.id.localeCompare(b.id));
 for(const account of accounts)await lockMoneyAccount(tx,account.id);
 for(const serviceId of [...new Set(serviceIds.map(id))])await getServiceMoneyAccount(tx,serviceId);
 return accounts;
}
export async function readServiceMoneyAvailable(tx:Tx,serviceId:string){const account=await getServiceMoneyAccount(tx,serviceId);return getBalance(tx,moneyPosition(account.id));}

/** Called only by explicit enrollment commands, inside their creation transaction. */
export async function attachServiceMoneyAccount(tx:Tx,serviceId:string,ownerPersonId:string,kind:"CARDHOLDER"|"MERCHANT",displayName:string,selectedMoneyAccountId?:string):Promise<MoneyAccount>{
 let account:MoneyAccount;
 if(selectedMoneyAccountId){
  await lockMoneyAccount(tx,selectedMoneyAccountId);
  const [selected]=await tx.select().from(moneyAccounts).where(and(eq(moneyAccounts.id,id(selectedMoneyAccountId)),eq(moneyAccounts.ownerPersonId,ownerPersonId))).for("update");
  if(!selected||selected.status!=="ACTIVE"||selected.serviceKind!==kind)throw new SecurityError("MONEY_ACCOUNT_UNAVAILABLE",404);
  const [existing]=await tx.select().from(moneyAccountServices).where(and(eq(moneyAccountServices.moneyAccountId,selected.id),eq(moneyAccountServices.serviceKind,kind)));
  if(existing)throw new SecurityError("MONEY_ACCOUNT_SERVICE_EXISTS",409);
  account=selected;
 }else{const [created]=await tx.insert(moneyAccounts).values({ownerPersonId,displayName,serviceKind:kind}).returning();account=created!;await lockMoneyAccount(tx,account.id);}
 const [service]=await tx.select().from(services).where(eq(services.id,serviceId));
 if(!service||service.primaryPersonId!==ownerPersonId||service.kind!==kind)throw new SecurityError("MONEY_ACCOUNT_UNAVAILABLE",404);
 await tx.insert(moneyAccountServices).values({moneyAccountId:account.id,serviceId,serviceKind:kind});
 return account;
}
async function ownerAccount(tx:Tx,personId:string,accountId:string,action:"money.read"|"money.add"|"money.withdraw",write=false):Promise<MoneyAccount>{
 if(write)await requireSandboxParticipant(tx,personId);else await requireServiceReader(tx,personId);
 if(write)await lockMoneyAccount(tx,accountId);
 const accountQuery=tx.select().from(moneyAccounts).where(eq(moneyAccounts.id,id(accountId)));
 const [account]=write?await accountQuery.for("share"):await accountQuery;
 if(!account)throw new SecurityError("MONEY_ACCOUNT_UNAVAILABLE",404);
 const linkedQuery=tx.select({service:services}).from(moneyAccountServices).innerJoin(services,eq(services.id,moneyAccountServices.serviceId)).innerJoin(serviceMembers,and(eq(serviceMembers.serviceId,services.id),eq(serviceMembers.personId,account.ownerPersonId),eq(serviceMembers.state,"ACCEPTED"))).where(eq(moneyAccountServices.moneyAccountId,account.id));
 const [linked]=write?await linkedQuery.for("share"):await linkedQuery;
 if(!linked||linked.service.primaryPersonId!==account.ownerPersonId||linked.service.kind!==account.serviceKind)throw new SecurityError("MONEY_ACCOUNT_UNAVAILABLE",404);
 const status=account.status==="CLOSED"||linked.service.status==="CLOSED"?"CLOSED":account.status==="SUSPENDED"||linked.service.status==="SUSPENDED"?"SUSPENDED":account.status;
 if(!evaluate({targetKind:"MONEY_ACCOUNT",actorPersonId:personId,ownerPersonId:account.ownerPersonId,moneyAccountId:account.id,resourceMoneyAccountId:account.id,status},action).allowed)throw new SecurityError("MONEY_ACCOUNT_UNAVAILABLE",404);
 return {...account,status};
}
async function accountProjection(tx:Tx,account:MoneyAccount):Promise<OwnedMoneyAccount>{
 const linked=await tx.select({id:services.id,kind:services.kind,displayName:services.displayName}).from(moneyAccountServices).innerJoin(services,eq(services.id,moneyAccountServices.serviceId)).where(eq(moneyAccountServices.moneyAccountId,account.id)).orderBy(services.kind);
 return {id:account.id,displayName:account.displayName,serviceKind:account.serviceKind,currency:"USD",status:account.status,version:account.version,services:linked,available:formatMoney(await getBalance(tx,moneyPosition(account.id))),pendingWithdrawals:formatMoney(await getBalance(tx,moneyPosition(account.id,"MONEY_WITHDRAWAL_PENDING")))};
}
export async function listOwnedMoneyAccounts(personId:string):Promise<OwnedMoneyAccount[]>{return getDb().transaction(async tx=>{
 await requireServiceReader(tx,personId);const rows=await tx.select().from(moneyAccounts).where(and(eq(moneyAccounts.ownerPersonId,personId),sql`${moneyAccounts.status}<>'CLOSED'`)).orderBy(moneyAccounts.createdAt,moneyAccounts.id);
 const result=[];for(const row of rows){try{result.push(await accountProjection(tx,await ownerAccount(tx,personId,row.id,"money.read")));}catch(error){if(!(error instanceof SecurityError&&error.code==="MONEY_ACCOUNT_UNAVAILABLE"))throw error;}}return result;
 },{isolationLevel:"repeatable read"});}
const labels:Record<string,string>={MONEY_FUNDING:"Money added",MONEY_CUTOVER:"Opening balance",CARD_PURCHASE:"Card purchase",CARD_REFUND:"Card refund",MERCHANT_SETTLEMENT:"Payments received",MERCHANT_REFUND:"Payment refunded",MERCHANT_PAYOUT:"Payment deposit received",MONEY_WITHDRAWAL_RESERVE:"Withdrawal requested",MONEY_WITHDRAWAL_RELEASE:"Withdrawal returned"};
async function historyReceiptHrefs(tx:Tx,accountId:string,journals:(typeof ledgerJournals.$inferSelect)[]):Promise<Map<string,string>>{
 const base=`/money-accounts/${accountId}`,result=new Map<string,string>();
 const fundingIds=journals.filter(journal=>journal.kind==="MONEY_FUNDING").map(journal=>journal.id);
 if(fundingIds.length){
  const journalIds=sql.join(fundingIds.map(value=>sql`${value}::uuid`),sql`, `);
  const candidates=await tx.execute(sql`select c.id,c."journalId" from (
   select i.id,t."journalId" from money_funding_intents i join money_topups t on t."commandId"=i."confirmCommandId" and t."moneyAccountId"=i."moneyAccountId" and t."actorId"=i."actorId" and t."amountMinor"=i."amountMinor" join ledger_journals j on j.id=t."journalId" and j."referenceId"=t.id and j.kind='MONEY_FUNDING' where t."journalId" in (${journalIds}) and t."moneyAccountId"=${accountId}::uuid
   union all select i.id,t."journalId" from cardholder_funding_intents i join money_account_services m on m."serviceId"=i."serviceId" join money_topups t on t."commandId"=i."confirmCommandId" and t."moneyAccountId"=m."moneyAccountId" and t."actorId"=i."actorId" and t."amountMinor"=i."amountMinor" join ledger_journals j on j.id=t."journalId" and j."referenceId"=t.id and j.kind='MONEY_FUNDING' where t."journalId" in (${journalIds}) and t."moneyAccountId"=${accountId}::uuid
  ) c where (select count(*) from money_funding_intents where id=c.id)+(select count(*) from cardholder_funding_intents where id=c.id)=1`);
  const byJournal=new Map<string,string[]>();for(const row of candidates.rows){const key=String(row.journalId);byJournal.set(key,[...(byJournal.get(key)??[]),String(row.id)]);}
  for(const [journalId,intents] of byJournal)if(intents.length===1)result.set(journalId,`${base}?task=add&review=${intents[0]}`);
 }
 const withdrawals=journals.filter(journal=>["MONEY_WITHDRAWAL_RESERVE","MONEY_WITHDRAWAL_RELEASE"].includes(journal.kind));
 if(withdrawals.length){
  const ids=withdrawals.map(journal=>journal.id),rows=await tx.select({withdrawal:moneyWithdrawals,intent:moneyWithdrawalIntents,event:moneyWithdrawalEvents}).from(moneyWithdrawals).innerJoin(moneyWithdrawalIntents,and(eq(moneyWithdrawalIntents.id,moneyWithdrawals.intentId),eq(moneyWithdrawalIntents.moneyAccountId,moneyWithdrawals.moneyAccountId),eq(moneyWithdrawalIntents.actorId,moneyWithdrawals.actorId),eq(moneyWithdrawalIntents.amountMinor,moneyWithdrawals.amountMinor),eq(moneyWithdrawalIntents.confirmCommandId,moneyWithdrawals.commandId))).leftJoin(moneyWithdrawalEvents,eq(moneyWithdrawalEvents.withdrawalId,moneyWithdrawals.id)).where(and(eq(moneyWithdrawals.moneyAccountId,accountId),or(inArray(moneyWithdrawals.journalId,ids),inArray(moneyWithdrawalEvents.journalId,ids))));
  for(const row of rows)for(const journal of withdrawals){const matches=journal.referenceId===row.withdrawal.id&&(journal.kind==="MONEY_WITHDRAWAL_RESERVE"?row.withdrawal.journalId===journal.id:row.event?.outcome==="FAILED"&&row.event.journalId===journal.id);if(matches)result.set(journal.id,`${base}?task=withdraw&review=${row.intent.id}`);}
 }
 return result;
}
export async function getMoneyAccountOverview(personId:string,accountId:string,page=0):Promise<MoneyAccountOverview>{
 if(!Number.isSafeInteger(page)||page<0||page>100000)throw new SecurityError("INVALID_REQUEST",422);
 return getDb().transaction(async tx=>{const account=await ownerAccount(tx,personId,accountId,"money.read");
  const entries=await tx.select({entry:ledgerEntries,journal:ledgerJournals}).from(ledgerEntries).innerJoin(ledgerJournals,eq(ledgerJournals.id,ledgerEntries.journalId)).where(and(eq(ledgerEntries.moneyAccountId,account.id),eq(ledgerEntries.bucket,"MONEY_AVAILABLE"))).orderBy(desc(ledgerJournals.createdAt),ledgerJournals.id).limit(51).offset(page*50);
  const pageEntries=entries.slice(0,50),hrefs=await historyReceiptHrefs(tx,account.id,pageEntries.map(row=>row.journal));
  const history:MoneyAccountOverview["history"]=pageEntries.map(({entry,journal})=>({id:journal.id,kind:journal.kind,label:labels[journal.kind]??"Money movement",amount:formatMoney(entry.deltaMinor),createdAt:journal.createdAt.toISOString(),referenceId:journal.referenceId,href:hrefs.get(journal.id)??null}));
  return {...await accountProjection(tx,account),history,page,hasMore:entries.length>50,canAddMoney:account.status==="ACTIVE",canWithdraw:account.status==="ACTIVE"};
 },{isolationLevel:"repeatable read"});
}
function topupProjection(row:typeof moneyTopups.$inferSelect):MoneyTopupReceipt{return {id:row.id,moneyAccountId:row.moneyAccountId,amount:formatMoney(row.amountMinor),source:"SANDBOX_BANK",sourceLabel:"Funding balance",status:"COMPLETED",createdAt:row.createdAt.toISOString(),reference:`ADD-${row.id.slice(0,8).toUpperCase()}`};}
async function readTopups(tx:Tx,accountId:string,topupId:string|null,page=0):Promise<MoneyTopupReceipt[]>{
 const result=await tx.execute(sql`select * from (
  select t.id,t."moneyAccountId",t."amountMinor",t."createdAt" from money_topups t where t."moneyAccountId"=${accountId}::uuid
  union all select t.id,m."moneyAccountId",t."amountMinor",t."createdAt" from cardholder_topups t join money_account_services m on m."serviceId"=t."serviceId" where m."moneyAccountId"=${accountId}::uuid
 ) h where (${topupId}::uuid is null or h.id=${topupId}::uuid) order by h."createdAt" desc,h.id limit 101 offset ${page*100}`);
 return result.rows.map(row=>({id:String(row.id),moneyAccountId:String(row.moneyAccountId),amount:formatMoney(BigInt(row.amountMinor as string|bigint)),source:"SANDBOX_BANK",sourceLabel:"Funding balance",status:"COMPLETED",createdAt:new Date(row.createdAt as string|Date).toISOString(),reference:`ADD-${String(row.id).slice(0,8).toUpperCase()}`}));
}
export async function getMoneyTopup(personId:string,accountId:string,topupId:string):Promise<MoneyTopupReceipt>{return getDb().transaction(async tx=>{await ownerAccount(tx,personId,accountId,"money.read");const [row]=await readTopups(tx,id(accountId),id(topupId));if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return row;});}
export async function getMoneyTopups(personId:string,accountId:string,page=0){if(!Number.isSafeInteger(page)||page<0||page>100000)throw new SecurityError("INVALID_REQUEST",422);return getDb().transaction(async tx=>{await ownerAccount(tx,personId,accountId,"money.read");const rows=await readTopups(tx,id(accountId),null,page);return {topups:rows.slice(0,100),page,hasMore:rows.length>100};});}
async function addFunds(tx:Tx,personId:string,accountId:string,input:MoneyCommand):Promise<MoneyTopupReceipt>{
 await ownerAccount(tx,personId,accountId,"money.add",true);
 const [legacy]=await tx.select().from(workspaceCommands).where(eq(workspaceCommands.commandId,input.commandId));
 if(legacy){const linked=await getServiceMoneyAccount(tx,legacy.serviceId);const [receipt]=await readTopups(tx,accountId,legacy.resourceId);if(legacy.kind!=="funds.add"||legacy.actorId!==personId||linked.id!==accountId||!receipt||receipt.amount.minor!==input.amountMinor)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);return receipt;}
 await claimCommand(tx,personId,accountId,input.commandId,"FUND",{amountMinor:input.amountMinor});
 const [old]=await tx.select().from(moneyTopups).where(eq(moneyTopups.commandId,input.commandId));
 if(old){if(old.actorId!==personId||old.moneyAccountId!==accountId||old.amountMinor!==BigInt(input.amountMinor))throw new SecurityError("IDEMPOTENCY_CONFLICT",409);return topupProjection(old);}
 const at=await now(tx),receiptId=input.commandId.toLowerCase(),amount=BigInt(input.amountMinor);
 const journalId=await postJournal(tx,{businessKey:`money-funding:${input.commandId}`,kind:"MONEY_FUNDING",referenceId:receiptId,occurredAt:at,lines:[{...moneyPosition(accountId,"MONEY_SOURCE"),deltaMinor:-amount},{...moneyPosition(accountId),deltaMinor:amount}]});
 const [row]=await tx.insert(moneyTopups).values({id:receiptId,commandId:input.commandId,moneyAccountId:accountId,actorId:personId,amountMinor:amount,journalId,createdAt:at}).returning();return topupProjection(row!);
}
/** The one active funding writer, also used by canonical fixture preparation. */
export async function addMoneyFunds(personId:string,accountId:string,raw:MoneyCommand){const input=parse(moneyCommandSchema,raw);accountId=id(accountId);return getDb().transaction(tx=>addFunds(tx,personId,accountId,input));}
async function readFundingIntent(tx:Tx,intentId:string){
 const result=await tx.execute(sql`select * from (select id,"moneyAccountId","actorId","amountMinor","confirmCommandId","createdAt" from money_funding_intents where id=${intentId}::uuid union all select i.id,m."moneyAccountId",i."actorId",i."amountMinor",i."confirmCommandId",i."createdAt" from cardholder_funding_intents i join money_account_services m on m."serviceId"=i."serviceId" where i.id=${intentId}::uuid) i`);
 if(result.rows.length>1)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);const row=result.rows[0];if(!row)return null;
 return {id:String(row.id),moneyAccountId:String(row.moneyAccountId),actorId:String(row.actorId),amountMinor:BigInt(row.amountMinor as string|bigint),confirmCommandId:String(row.confirmCommandId),createdAt:new Date(row.createdAt as string|Date)};
}
async function fundingReview(tx:Tx,personId:string,accountId:string,intentId:string):Promise<MoneyFundingIntent>{
 await ownerAccount(tx,personId,accountId,"money.read");const intent=await readFundingIntent(tx,id(intentId));
 if(!intent||intent.moneyAccountId!==accountId||intent.actorId!==personId)throw new SecurityError("RESOURCE_UNAVAILABLE",404);const [topup]=await tx.select().from(moneyTopups).where(eq(moneyTopups.commandId,intent.confirmCommandId));
 const [legacyTopup]=topup?[]:await readTopups(tx,accountId,intent.confirmCommandId);
 return {id:intent.id,moneyAccountId:intent.moneyAccountId,receiptId:intent.confirmCommandId,amount:formatMoney(intent.amountMinor),sourceLabel:"Funding balance",createdAt:intent.createdAt.toISOString(),receipt:topup?topupProjection(topup):legacyTopup??null};
}
export async function prepareMoneyFunding(personId:string,accountId:string,raw:MoneyCommand):Promise<MoneyFundingIntent>{const input=parse(moneyCommandSchema,raw);accountId=id(accountId);return getDb().transaction(async tx=>{
 await ownerAccount(tx,personId,accountId,"money.add",true);const old=await readFundingIntent(tx,input.commandId);
 if(old){if(old.actorId!==personId||old.moneyAccountId!==accountId||old.amountMinor!==BigInt(input.amountMinor))throw new SecurityError("IDEMPOTENCY_CONFLICT",409);return fundingReview(tx,personId,accountId,input.commandId);}
 await claimCommand(tx,personId,accountId,input.commandId,"PREPARE_FUNDING",{amountMinor:input.amountMinor});
 await tx.insert(moneyFundingIntents).values({id:input.commandId,moneyAccountId:accountId,actorId:personId,amountMinor:BigInt(input.amountMinor),confirmCommandId:randomUUID(),createdAt:await now(tx)});
 return fundingReview(tx,personId,accountId,input.commandId);
 });}
export async function getMoneyFundingIntent(personId:string,accountId:string,intentId:string){return getDb().transaction(tx=>fundingReview(tx,personId,id(accountId),id(intentId)));}
export async function confirmMoneyFunding(personId:string,accountId:string,intentId:string):Promise<MoneyTopupReceipt>{accountId=id(accountId);intentId=id(intentId);return getDb().transaction(async tx=>{
 await ownerAccount(tx,personId,accountId,"money.add",true);const intent=await readFundingIntent(tx,intentId);if(!intent||intent.moneyAccountId!==accountId||intent.actorId!==personId)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
 return addFunds(tx,personId,accountId,{commandId:intent.confirmCommandId,amountMinor:intent.amountMinor.toString()});
 });}
async function withdrawalProjection(tx:Tx,row:typeof moneyWithdrawals.$inferSelect):Promise<MoneyWithdrawalReceipt>{const [event]=await tx.select().from(moneyWithdrawalEvents).where(eq(moneyWithdrawalEvents.withdrawalId,row.id));return {id:row.id,intentId:row.intentId,moneyAccountId:row.moneyAccountId,amount:formatMoney(row.amountMinor),destinationLabel:"Withdrawal balance",status:event?.outcome??"PENDING",createdAt:row.createdAt.toISOString(),completedAt:event?.createdAt.toISOString()??null,reference:`OUT-${row.id.slice(0,8).toUpperCase()}`};}
async function withdrawalReview(tx:Tx,personId:string,accountId:string,intentId:string):Promise<MoneyWithdrawalIntent>{await ownerAccount(tx,personId,accountId,"money.read");const [intent]=await tx.select().from(moneyWithdrawalIntents).where(and(eq(moneyWithdrawalIntents.id,id(intentId)),eq(moneyWithdrawalIntents.moneyAccountId,id(accountId)),eq(moneyWithdrawalIntents.actorId,personId)));if(!intent)throw new SecurityError("RESOURCE_UNAVAILABLE",404);const [withdrawal]=await tx.select().from(moneyWithdrawals).where(eq(moneyWithdrawals.intentId,intent.id));return {id:intent.id,moneyAccountId:intent.moneyAccountId,amount:formatMoney(intent.amountMinor),destinationLabel:"Withdrawal balance",createdAt:intent.createdAt.toISOString(),receipt:withdrawal?await withdrawalProjection(tx,withdrawal):null};}
export async function prepareMoneyWithdrawal(personId:string,accountId:string,raw:MoneyCommand):Promise<MoneyWithdrawalIntent>{const input=parse(moneyCommandSchema,raw);accountId=id(accountId);return getDb().transaction(async tx=>{
 await ownerAccount(tx,personId,accountId,"money.withdraw",true);await claimCommand(tx,personId,accountId,input.commandId,"PREPARE_WITHDRAWAL",{amountMinor:input.amountMinor});
 const [old]=await tx.select().from(moneyWithdrawalIntents).where(eq(moneyWithdrawalIntents.id,input.commandId));
 if(old){if(old.actorId!==personId||old.moneyAccountId!==accountId||old.amountMinor!==BigInt(input.amountMinor))throw new SecurityError("IDEMPOTENCY_CONFLICT",409);}else{
  if(await getBalance(tx,moneyPosition(accountId))<BigInt(input.amountMinor))throw new SecurityError("INSUFFICIENT_LEDGER_FUNDS",409);
  await tx.insert(moneyWithdrawalIntents).values({id:input.commandId,moneyAccountId:accountId,actorId:personId,amountMinor:BigInt(input.amountMinor),confirmCommandId:randomUUID(),createdAt:await now(tx)});
 }return withdrawalReview(tx,personId,accountId,input.commandId);
 });}
export async function getMoneyWithdrawalIntent(personId:string,accountId:string,intentId:string){return getDb().transaction(tx=>withdrawalReview(tx,personId,id(accountId),id(intentId)));}
export async function confirmMoneyWithdrawal(personId:string,accountId:string,intentId:string):Promise<MoneyWithdrawalReceipt>{accountId=id(accountId);intentId=id(intentId);return getDb().transaction(async tx=>{
 await ownerAccount(tx,personId,accountId,"money.withdraw",true);const [intent]=await tx.select().from(moneyWithdrawalIntents).where(and(eq(moneyWithdrawalIntents.id,intentId),eq(moneyWithdrawalIntents.moneyAccountId,accountId),eq(moneyWithdrawalIntents.actorId,personId)));if(!intent)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
 await claimCommand(tx,personId,accountId,intent.confirmCommandId,"WITHDRAW",{intentId,amountMinor:intent.amountMinor.toString()});
 const [old]=await tx.select().from(moneyWithdrawals).where(eq(moneyWithdrawals.intentId,intentId));if(old)return withdrawalProjection(tx,old);
 const withdrawalId=randomUUID(),at=await now(tx);const journalId=await postJournal(tx,{businessKey:`money-withdrawal:${intent.confirmCommandId}`,kind:"MONEY_WITHDRAWAL_RESERVE",referenceId:withdrawalId,occurredAt:at,lines:[{...moneyPosition(accountId),deltaMinor:-intent.amountMinor},{...moneyPosition(accountId,"MONEY_WITHDRAWAL_PENDING"),deltaMinor:intent.amountMinor}]});
 const [row]=await tx.insert(moneyWithdrawals).values({id:withdrawalId,intentId,commandId:intent.confirmCommandId,moneyAccountId:accountId,actorId:personId,amountMinor:intent.amountMinor,journalId,createdAt:at}).returning();return withdrawalProjection(tx,row!);
 });}
async function requireWithdrawalOperator(tx:Tx,personId:string,accountId:string){await requireServiceReader(tx,personId);const rows=await tx.select({assignment:operatorServiceAccess,service:services}).from(operatorServiceAccess).innerJoin(moneyAccountServices,eq(moneyAccountServices.serviceId,operatorServiceAccess.serviceId)).innerJoin(services,eq(services.id,operatorServiceAccess.serviceId)).where(and(eq(moneyAccountServices.moneyAccountId,accountId),eq(operatorServiceAccess.personId,personId))).for("share");if(!rows.some(({assignment,service})=>evaluate({targetKind:"OPERATOR_SERVICE",actorPersonId:personId,assignmentPersonId:assignment.personId,serviceId:service.id,resourceServiceId:service.id,state:assignment.state,serviceStatus:service.status,grants:assignment.canProcessDeposits?["support.operator.read","payments.operator.process"]:[]},"payments.operator.process").allowed))throw new SecurityError("ACTION_DENIED",403);}
export async function getMoneyWithdrawalProcessingQueue(personId:string){return getDb().transaction(async tx=>{
 await requireServiceReader(tx,personId);
 const assignments=await tx.select({id:moneyAccountServices.moneyAccountId,service:services,assignment:operatorServiceAccess}).from(operatorServiceAccess).innerJoin(moneyAccountServices,eq(moneyAccountServices.serviceId,operatorServiceAccess.serviceId)).innerJoin(services,eq(services.id,operatorServiceAccess.serviceId)).where(and(eq(operatorServiceAccess.personId,personId),eq(operatorServiceAccess.state,"ACCEPTED"),eq(operatorServiceAccess.canProcessDeposits,true)));
 const eligible=assignments.filter(({assignment,service})=>evaluate({targetKind:"OPERATOR_SERVICE",actorPersonId:personId,assignmentPersonId:assignment.personId,serviceId:service.id,resourceServiceId:service.id,state:assignment.state,serviceStatus:service.status,grants:["support.operator.read","payments.operator.process"]},"payments.operator.process").allowed);
 if(!eligible.length)throw new SecurityError("ACTION_DENIED",403);
 const result=[];
 for(const accountId of [...new Set(eligible.map(a=>a.id))]){const rows=await tx.select({withdrawal:moneyWithdrawals,name:moneyAccounts.displayName}).from(moneyWithdrawals).innerJoin(moneyAccounts,eq(moneyAccounts.id,moneyWithdrawals.moneyAccountId)).leftJoin(moneyWithdrawalEvents,eq(moneyWithdrawalEvents.withdrawalId,moneyWithdrawals.id)).where(and(eq(moneyWithdrawals.moneyAccountId,accountId),isNull(moneyWithdrawalEvents.withdrawalId))).orderBy(moneyWithdrawals.createdAt).limit(100);for(const row of rows)result.push({...await withdrawalProjection(tx,row.withdrawal),accountName:row.name});}
 return result;
},{isolationLevel:"repeatable read"});}
export async function processMoneyWithdrawal(personId:string,withdrawalId:string,raw:ProcessMoneyWithdrawal):Promise<MoneyWithdrawalReceipt>{const input=parse(processMoneyWithdrawalSchema,raw);withdrawalId=id(withdrawalId);return getDb().transaction(async tx=>{
 const [row]=await tx.select().from(moneyWithdrawals).where(eq(moneyWithdrawals.id,withdrawalId));if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);await lockMoneyAccount(tx,row.moneyAccountId);await requireWithdrawalOperator(tx,personId,row.moneyAccountId);await claimCommand(tx,personId,row.moneyAccountId,input.commandId,"WITHDRAWAL_RESULT",{withdrawalId,outcome:input.outcome});
 const [old]=await tx.select().from(moneyWithdrawalEvents).where(or(eq(moneyWithdrawalEvents.withdrawalId,withdrawalId),eq(moneyWithdrawalEvents.commandId,input.commandId)));if(old){if(old.withdrawalId!==withdrawalId||old.actorId!==personId||old.commandId!==input.commandId||old.outcome!==input.outcome)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);return withdrawalProjection(tx,row);}
 const at=await now(tx),journalId=await postJournal(tx,{businessKey:`money-withdrawal-result:${withdrawalId}`,kind:input.outcome==="COMPLETED"?"MONEY_WITHDRAWAL_COMPLETE":"MONEY_WITHDRAWAL_RELEASE",referenceId:withdrawalId,occurredAt:at,lines:[{...moneyPosition(row.moneyAccountId,"MONEY_WITHDRAWAL_PENDING"),deltaMinor:-row.amountMinor},{...moneyPosition(row.moneyAccountId,input.outcome==="COMPLETED"?"MONEY_WITHDRAWN":"MONEY_AVAILABLE"),deltaMinor:row.amountMinor}]});await tx.insert(moneyWithdrawalEvents).values({withdrawalId,commandId:input.commandId,actorId:personId,outcome:input.outcome,journalId,createdAt:at});return withdrawalProjection(tx,row);
 });}

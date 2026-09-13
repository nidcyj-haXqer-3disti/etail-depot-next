import {createHash,randomUUID} from "node:crypto";
import {eq,sql} from "drizzle-orm";
import {afterAll,describe,expect,it} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {serviceMembers,services} from "../../src/platform/database/schema";
import {moneyCommands,moneyFundingIntents,moneyTopups} from "../../src/modules/money/schema";
import {addMoneyFunds,confirmMoneyFunding,confirmMoneyWithdrawal,getMoneyAccountOverview,getMoneyFundingIntent,getMoneyTopup,getMoneyWithdrawalIntent,getServiceMoneyAccount,moneyPosition,prepareMoneyFunding,prepareMoneyWithdrawal,processMoneyWithdrawal} from "../../src/modules/money/service";
import {postJournal} from "../../src/modules/ledger/service";
import {ledgerEntries} from "../../src/modules/ledger/schema";
import {operatorServiceAccess} from "../../src/modules/operations/schema";
import {createPrimaryMerchant} from "../../src/modules/services/create-merchant";
import {createMerchantInvitation} from "../../src/modules/access/merchant-service";
import {acceptInvitation} from "../../src/modules/access/service";
import {createMerchantSettlement,getMerchantOperations} from "../../src/modules/acquiring/operations-service";
import {processNetworkCheckout,startNetworkCheckout} from "../../src/modules/acquiring/network-service";
import {moneyOverviewSchema} from "../../src/shared/money-response";
import {acquiringFixture} from "../helpers/acquiring";
import {cardPerson,cardPrimary} from "../helpers/cardholder";
import {networkCheckoutFixture} from "../helpers/network-checkout";

afterAll(closeDatabase);
const input=(amountMinor="100",commandId=randomUUID())=>({commandId,amountMinor});
async function merchantOwner(){const f=await acquiringFixture(),account=await getDb().transaction(tx=>getServiceMoneyAccount(tx,f.serviceId));return {...f,accountId:account.id};}
async function effects(accountId:string){return {
 commands:await getDb().select().from(moneyCommands).where(eq(moneyCommands.moneyAccountId,accountId)),
 intents:await getDb().select().from(moneyFundingIntents).where(eq(moneyFundingIntents.moneyAccountId,accountId)),
 topups:await getDb().select().from(moneyTopups).where(eq(moneyTopups.moneyAccountId,accountId)),
 entries:await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.moneyAccountId,accountId)),
};}
/** Deliberate historical records for retirement regressions, never an active funding path. */
async function historicalFunding(f:{personId:string;accountId:string},posted=false,confirmCommandId=randomUUID()){
 const command=input(),at=new Date();
 await getDb().transaction(async tx=>{
  const digest=(kind:"PREPARE_FUNDING"|"FUND")=>createHash("sha256").update(JSON.stringify({personId:f.personId,accountId:f.accountId,kind,payload:{amountMinor:command.amountMinor}})).digest("hex");
  await tx.insert(moneyCommands).values({commandId:command.commandId,moneyAccountId:f.accountId,actorId:f.personId,kind:"PREPARE_FUNDING",digest:digest("PREPARE_FUNDING")});
  await tx.insert(moneyFundingIntents).values({id:command.commandId,moneyAccountId:f.accountId,actorId:f.personId,amountMinor:100n,confirmCommandId,createdAt:at});
  if(posted){
   await tx.insert(moneyCommands).values({commandId:confirmCommandId,moneyAccountId:f.accountId,actorId:f.personId,kind:"FUND",digest:digest("FUND")});
   const journalId=await postJournal(tx,{businessKey:`money-funding:${confirmCommandId}`,kind:"MONEY_FUNDING",referenceId:confirmCommandId,occurredAt:at,lines:[{...moneyPosition(f.accountId,"MONEY_SOURCE"),deltaMinor:-100n},{...moneyPosition(f.accountId),deltaMinor:100n}]});
   await tx.insert(moneyTopups).values({id:confirmCommandId,commandId:confirmCommandId,moneyAccountId:f.accountId,actorId:f.personId,amountMinor:100n,journalId,createdAt:at});
  }
 });
 return {...command,confirmCommandId};
}

describe("Merchant funding retirement and payout records",()=>{
 it("denies new funding and old unconfirmed reviews, including concurrent confirmation, without saving another effect",async()=>{
  const f=await merchantOwner(),empty=await effects(f.accountId);
  expect(await getMoneyAccountOverview(f.personId,f.accountId)).toMatchObject({canAddMoney:false,canWithdraw:true,available:{minor:"0"},withdrawals:[],withdrawalsHasMore:false});
  for(const action of [()=>prepareMoneyFunding(f.personId,f.accountId,input()),()=>addMoneyFunds(f.personId,f.accountId,input())])await expect(action()).rejects.toMatchObject({code:"MONEY_ACCOUNT_UNAVAILABLE",status:404});
  expect(await effects(f.accountId)).toEqual(empty);
  const old=await historicalFunding(f),before=await effects(f.accountId);
  expect((await getMoneyFundingIntent(f.personId,f.accountId,old.commandId)).receipt).toBeNull();
  await expect(prepareMoneyFunding(f.personId,f.accountId,input("100",old.commandId))).rejects.toMatchObject({code:"MONEY_ACCOUNT_UNAVAILABLE"});
  const results=await Promise.allSettled([confirmMoneyFunding(f.personId,f.accountId,old.commandId),confirmMoneyFunding(f.personId,f.accountId,old.commandId),addMoneyFunds(f.personId,f.accountId,input("100",old.confirmCommandId))]);
  expect(results).toHaveLength(3);for(const result of results){expect(result.status).toBe("rejected");if(result.status==="rejected")expect(result.reason).toMatchObject({code:"MONEY_ACCOUNT_UNAVAILABLE",status:404});}
  expect(await effects(f.accountId)).toEqual(before);expect((await getMoneyAccountOverview(f.personId,f.accountId)).available.minor).toBe("0");
 });

 it("replays only an exact posted receipt after current authorization, including suspended read access, without writing",async()=>{
  const f=await merchantOwner(),old=await historicalFunding(f,true),before=await effects(f.accountId),receipt=await getMoneyTopup(f.personId,f.accountId,old.confirmCommandId);
  const replay=async()=>{
   expect((await getMoneyFundingIntent(f.personId,f.accountId,old.commandId)).receipt).toEqual(receipt);
   expect((await prepareMoneyFunding(f.personId,f.accountId,input("100",old.commandId))).receipt).toEqual(receipt);
   expect(await confirmMoneyFunding(f.personId,f.accountId,old.commandId)).toEqual(receipt);
   expect(await addMoneyFunds(f.personId,f.accountId,input("100",old.confirmCommandId))).toEqual(receipt);
  };
  await replay();
  expect((await getMoneyAccountOverview(f.personId,f.accountId)).history[0].href).toBe(`/money-accounts/${f.accountId}/add-money?review=${old.commandId}`);
  await expect(addMoneyFunds(f.personId,f.accountId,input("101",old.confirmCommandId))).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
  await getDb().update(services).set({status:"SUSPENDED"}).where(eq(services.id,f.serviceId));await replay();
  expect(await getMoneyAccountOverview(f.personId,f.accountId)).toMatchObject({canAddMoney:false,canWithdraw:false,available:{minor:"100"}});
  const other=await cardPerson("Other receipt viewer");await expect(getMoneyFundingIntent(other,f.accountId,old.commandId)).rejects.toMatchObject({status:404});
  await getDb().update(serviceMembers).set({state:"REVOKED",version:2}).where(eq(serviceMembers.serviceId,f.serviceId));
  for(const action of [()=>getMoneyTopup(f.personId,f.accountId,receipt.id),()=>getMoneyFundingIntent(f.personId,f.accountId,old.commandId),()=>confirmMoneyFunding(f.personId,f.accountId,old.commandId),()=>prepareMoneyFunding(f.personId,f.accountId,input("100",old.commandId)),()=>addMoneyFunds(f.personId,f.accountId,input("100",old.confirmCommandId))])await expect(action()).rejects.toMatchObject({code:"MONEY_ACCOUNT_UNAVAILABLE",status:404});
  expect(await effects(f.accountId)).toEqual(before);
 });

 it("does not attach another account's posted credit to an old merchant review and keeps card funding available",async()=>{
  const card=await cardPrimary("Two-service owner"),cardAccount=await getDb().transaction(tx=>getServiceMoneyAccount(tx,card.serviceId)),merchant=await createPrimaryMerchant(card.personId,{commandId:randomUUID(),displayName:"Separate payment account"}),account=await getDb().transaction(tx=>getServiceMoneyAccount(tx,merchant.serviceId));
  const cardCommand=input(),receipt=await addMoneyFunds(card.personId,cardAccount.id,cardCommand),old=await historicalFunding({personId:card.personId,accountId:account.id},false,cardCommand.commandId),before=await effects(account.id);
  expect((await getMoneyAccountOverview(card.personId,cardAccount.id)).canAddMoney).toBe(true);expect(await addMoneyFunds(card.personId,cardAccount.id,cardCommand)).toEqual(receipt);
  for(const action of [()=>getMoneyFundingIntent(card.personId,account.id,old.commandId),()=>confirmMoneyFunding(card.personId,account.id,old.commandId),()=>prepareMoneyFunding(card.personId,account.id,input("100",old.commandId)),()=>addMoneyFunds(card.personId,account.id,cardCommand)])await expect(action()).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
  expect(await effects(account.id)).toEqual(before);expect((await getMoneyAccountOverview(card.personId,account.id)).available.minor).toBe("0");expect((await getMoneyAccountOverview(card.personId,cardAccount.id)).available.minor).toBe("100");
 });

 it("projects each payout once with its current result, independently of ledger activity and terminal access",async()=>{
  const f=await networkCheckoutFixture(),account=await getDb().transaction(tx=>getServiceMoneyAccount(tx,f.serviceId)),started=await startNetworkCheckout(f.cookie,f.publication.id,{commandId:randomUUID(),instrumentId:"visa"});
  await processNetworkCheckout(f.cookie,f.publication.id,started.id);const operations=await getMerchantOperations(f.personId,f.merchantId);
  await createMerchantSettlement(f.personId,f.merchantId,{commandId:randomUUID(),reviewToken:operations.depositReview!.token});
  const operator=await cardPerson("Payout processor"),terminalUser=await cardPerson("Assigned terminal user"),invitation=await createMerchantInvitation(f.personId,f.merchantId,{commandId:randomUUID(),recipientId:terminalUser,expiresInDays:3});
  await acceptInvitation(terminalUser,invitation.id,{commandId:randomUUID(),expectedVersion:invitation.version});
  await getDb().insert(operatorServiceAccess).values({serviceId:f.serviceId,personId:operator,state:"ACCEPTED",canProcessDeposits:true});
  const receipts=[];for(let i=0;i<51;i++){const review=await prepareMoneyWithdrawal(f.personId,account.id,input("1"));receipts.push(await confirmMoneyWithdrawal(f.personId,account.id,review.id));}
  const completed=await processMoneyWithdrawal(operator,receipts[0].id,{commandId:randomUUID(),outcome:"COMPLETED"}),failed=await processMoneyWithdrawal(operator,receipts[50].id,{commandId:randomUUID(),outcome:"FAILED"});
  const first=await getMoneyAccountOverview(f.personId,account.id),second=await getMoneyAccountOverview(f.personId,account.id,1),all=[...first.withdrawals,...second.withdrawals];
  expect(moneyOverviewSchema.safeParse(first).success).toBe(true);expect(moneyOverviewSchema.safeParse(second).success).toBe(true);
  expect(first.withdrawals).toHaveLength(50);expect(first.withdrawalsHasMore).toBe(true);expect(second.withdrawals).toHaveLength(1);expect(second.withdrawalsHasMore).toBe(false);
  expect(new Set(all.map(row=>row.id)).size).toBe(51);expect(all.map(row=>row.id)).toEqual([...receipts].reverse().map(row=>row.id));
  expect(all.find(row=>row.id===completed.id)).toEqual(completed);expect(all.find(row=>row.id===failed.id)).toEqual(failed);expect(all.filter(row=>row.status==="PENDING")).toHaveLength(49);
  expect((await getMoneyWithdrawalIntent(f.personId,account.id,completed.intentId)).receipt).toEqual(completed);
  expect((await getMoneyWithdrawalIntent(f.personId,account.id,failed.intentId)).receipt).toEqual(failed);
  expect(first.available.minor).toBe("1200");expect(first.pendingWithdrawals.minor).toBe("49");
  expect([...first.history,...second.history].filter(row=>row.referenceId===failed.id)).toHaveLength(2);expect([...first.history,...second.history].filter(row=>row.referenceId===completed.id)).toHaveLength(1);
  expect((await getMoneyAccountOverview(f.personId,account.id,2)).withdrawals).toEqual([]);
  await expect(getMoneyAccountOverview(terminalUser,account.id)).rejects.toMatchObject({code:"MONEY_ACCOUNT_UNAVAILABLE",status:404});
  const other=await merchantOwner();expect((await getMoneyAccountOverview(other.personId,other.accountId)).withdrawals).toEqual([]);await expect(getMoneyWithdrawalIntent(other.personId,other.accountId,completed.intentId)).rejects.toMatchObject({status:404});
  const entries=await getDb().select({total:sql<string>`sum(${ledgerEntries.deltaMinor})::text`}).from(ledgerEntries).where(eq(ledgerEntries.moneyAccountId,account.id));expect(entries[0].total).toBe("1250");
 });
});

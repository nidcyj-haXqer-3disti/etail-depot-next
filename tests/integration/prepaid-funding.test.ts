import {randomUUID} from "node:crypto";
import pg from "pg";
import {and,eq} from "drizzle-orm";
import {afterAll,beforeAll,describe,expect,it} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {permissionGrants} from "../../src/platform/database/schema";
import {ledgerEntries,ledgerJournals} from "../../src/modules/ledger/schema";
import {postJournal} from "../../src/modules/ledger/service";
import {getServiceMoneyAccount,moneyPosition} from "../../src/modules/money/service";
import {moneyTopups} from "../../src/modules/money/schema";
import {cardLimitChanges,cardSpendingLimits} from "../../src/modules/workspace/funding-schema";
import {addCardholderFunds,confirmCardholderFunding,getCardholderFundingIntent,getCardholderFunds,getCardholderTopup,getCardSpending,prepareCardholderFunding,setCardSpendingLimit} from "../../src/modules/workspace/service";
import {cardPrimary,cardPerson,enrollCardholder,issuePracticeCard} from "../helpers/cardholder";

const raw=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-card-funding-integrity"});
beforeAll(()=>raw.connect());afterAll(async()=>{await raw.end();await closeDatabase();});
const input=(amountMinor:string,commandId=randomUUID())=>({commandId,amountMinor,currency:"USD" as const,source:"SANDBOX_BANK" as const});
type Owner=Awaited<ReturnType<typeof cardPrimary>>;
const accountFor=(owner:Owner)=>getDb().transaction(tx=>getServiceMoneyAccount(tx,owner.serviceId));
const balance=(owner:Owner)=>getCardholderFunds(owner.personId,owner.serviceId).then(funds=>funds.available.minor);
async function rawTransaction(work:()=>Promise<unknown>){await raw.query("BEGIN");try{await work();await raw.query("COMMIT");}catch(error){await raw.query("ROLLBACK");throw error;}}

describe("Cardholder funding through the canonical money account",()=>{
 it("creates one exact top-up for simultaneous retries, with one balanced journal",async()=>{
  const owner=await cardPrimary("Concurrent funding owner"),command=input("123456789012");
  const receipts=await Promise.all(Array.from({length:6},()=>addCardholderFunds(owner.personId,owner.serviceId,command)));
  expect(new Set(receipts.map(receipt=>receipt.id)).size).toBe(1);expect(receipts[0]).toMatchObject({amount:{minor:"123456789012",currency:"USD"},serviceId:owner.serviceId,status:"COMPLETED"});
  expect(await balance(owner)).toBe("123456789012");const account=await accountFor(owner),rows=await getDb().select().from(moneyTopups).where(eq(moneyTopups.moneyAccountId,account.id));expect(rows).toHaveLength(1);
  const lines=await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.journalId,rows[0]!.journalId));expect(lines).toHaveLength(2);expect(lines.every(line=>line.moneyAccountId===account.id&&line.serviceId===null&&line.cardId===null&&line.merchantUnitId===null)).toBe(true);expect(lines.reduce((total,line)=>total+line.deltaMinor,0n)).toBe(0n);expect(lines.map(line=>[line.bucket,line.deltaMinor])).toEqual(expect.arrayContaining([["MONEY_SOURCE",-123456789012n],["MONEY_AVAILABLE",123456789012n]]));
  await expect(addCardholderFunds(owner.personId,owner.serviceId,{...command,amountMinor:"123456789013"})).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
  const other=await cardPrimary("Other funding owner");await expect(addCardholderFunds(other.personId,other.serviceId,command)).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});expect(await balance(other)).toBe("0");
 });
 it("retains a durable funding review and confirms its original amount exactly once",async()=>{
  const owner=await cardPrimary("Saved funding owner"),command=input("1723"),review=await prepareCardholderFunding(owner.personId,owner.serviceId,command);
  expect(review).toMatchObject({id:command.commandId,amount:{minor:"1723"},receipt:null});expect(await balance(owner)).toBe("0");expect(await getCardholderFundingIntent(owner.personId,owner.serviceId,review.id)).toEqual(review);expect(await prepareCardholderFunding(owner.personId,owner.serviceId,command)).toEqual(review);
  const receipts=await Promise.all(Array.from({length:4},()=>confirmCardholderFunding(owner.personId,owner.serviceId,review.id)));expect(new Set(receipts.map(receipt=>receipt.id)).size).toBe(1);expect(await balance(owner)).toBe("1723");expect(await getCardholderFundingIntent(owner.personId,owner.serviceId,review.id)).toMatchObject({receipt:receipts[0]});expect(await getCardholderTopup(owner.personId,owner.serviceId,receipts[0]!.id)).toEqual(receipts[0]);
  await expect(prepareCardholderFunding(owner.personId,owner.serviceId,{...command,amountMinor:"1724"})).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
 });
 it("rejects invalid money and keeps card creation separate from funding",async()=>{
  const owner=await cardPrimary("Exact money owner");for(const amount of ["0","-1","01","1.01","1000000000000"]){await expect(addCardholderFunds(owner.personId,owner.serviceId,input(amount))).rejects.toMatchObject({code:"INVALID_REQUEST"});}
  const {card}=await issuePracticeCard(owner.personId,owner.serviceId,owner.personId,"Unfunded card",undefined,"9000");expect(await balance(owner)).toBe("0");expect(await getCardSpending(owner.personId,owner.serviceId,card.id)).toMatchObject({allowance:{minor:"9000"},remaining:{minor:"9000"},available:{minor:"0"}});
  await setCardSpendingLimit(owner.personId,owner.serviceId,card.id,{commandId:randomUUID(),expectedVersion:1,allowanceMinor:"12000"});expect(await balance(owner)).toBe("0");
 });
 it("denies funding, receipt and review access to holders, other owners and revoked owner grants",async()=>{
  const owner=await cardPrimary("Private funding owner"),holder=await cardPerson("Private funding cardholder");await enrollCardholder(owner.personId,owner.serviceId,holder);
  const command=input("1000"),receipt=await addCardholderFunds(owner.personId,owner.serviceId,command),review=await prepareCardholderFunding(owner.personId,owner.serviceId,input("2000"));
  for(const action of ["cardholder.funds.read","cardholder.funds.add","cardholder.limits.manage"])await getDb().insert(permissionGrants).values({serviceId:owner.serviceId,personId:holder,action,state:"ACCEPTED",delegable:true});
  await expect(getCardholderFunds(holder,owner.serviceId)).rejects.toMatchObject({status:403});await expect(getCardholderTopup(holder,owner.serviceId,receipt.id)).rejects.toMatchObject({status:403});await expect(confirmCardholderFunding(holder,owner.serviceId,review.id)).rejects.toMatchObject({status:403});
  const other=await cardPrimary("Other private owner");await expect(getCardholderTopup(other.personId,other.serviceId,receipt.id)).rejects.toMatchObject({status:404});await expect(getCardholderFundingIntent(other.personId,other.serviceId,review.id)).rejects.toMatchObject({status:404});
  await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,owner.serviceId),eq(permissionGrants.personId,owner.personId),eq(permissionGrants.action,"cardholder.funds.add")));
  await expect(addCardholderFunds(owner.personId,owner.serviceId,command)).rejects.toMatchObject({status:403});await expect(confirmCardholderFunding(owner.personId,owner.serviceId,review.id)).rejects.toMatchObject({status:403});expect(await balance(owner)).toBe("1000");
 });
 it("rolls back orphan money journals and receipts whose principal does not match",async()=>{
  const owner=await cardPrimary("Funding provenance owner"),account=await accountFor(owner);let orphan="";
  await expect(getDb().transaction(async tx=>{orphan=await postJournal(tx,{businessKey:`orphan-money:${randomUUID()}`,kind:"MONEY_FUNDING",referenceId:randomUUID(),occurredAt:new Date(),lines:[{...moneyPosition(account.id,"MONEY_SOURCE"),deltaMinor:-500n},{...moneyPosition(account.id),deltaMinor:500n}]});})).rejects.toThrow();
  expect(await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.id,orphan))).toEqual([]);expect(await balance(owner)).toBe("0");
  await expect(getDb().transaction(async tx=>{const receiptId=randomUUID(),at=new Date(),journalId=await postJournal(tx,{businessKey:`mismatch-money:${randomUUID()}`,kind:"MONEY_FUNDING",referenceId:receiptId,occurredAt:at,lines:[{...moneyPosition(account.id,"MONEY_SOURCE"),deltaMinor:-500n},{...moneyPosition(account.id),deltaMinor:500n}]});await tx.insert(moneyTopups).values({id:receiptId,commandId:randomUUID(),moneyAccountId:account.id,actorId:owner.personId,amountMinor:501n,journalId,createdAt:at});})).rejects.toThrow();expect(await balance(owner)).toBe("0");
 });
 it("keeps funding, card allowance history and posted journals immutable",async()=>{
  const owner=await cardPrimary("Immutable funding owner"),review=await prepareCardholderFunding(owner.personId,owner.serviceId,input("7000")),receipt=await confirmCardholderFunding(owner.personId,owner.serviceId,review.id),{card}=await issuePracticeCard(owner.personId,owner.serviceId,owner.personId,"Immutable allowance",undefined,"5000");
  const [topup]=await getDb().select().from(moneyTopups).where(eq(moneyTopups.id,receipt.id)),[history]=await getDb().select().from(cardLimitChanges).where(eq(cardLimitChanges.cardId,card.id));const before=await getCardholderFunds(owner.personId,owner.serviceId);
  const forbidden:Array<[string,unknown[]]>=[
   ['UPDATE money_topups SET "amountMinor"="amountMinor"+1 WHERE id=$1',[receipt.id]],["DELETE FROM money_topups WHERE id=$1",[receipt.id]],
   ['UPDATE money_funding_intents SET "amountMinor"="amountMinor"+1 WHERE id=$1',[review.id]],["DELETE FROM money_funding_intents WHERE id=$1",[review.id]],
   ['UPDATE card_limit_changes SET "allowanceMinor"="allowanceMinor"+1 WHERE id=$1',[history!.id]],["DELETE FROM card_limit_changes WHERE id=$1",[history!.id]],
   ['DELETE FROM card_spending_limits WHERE "serviceId"=$1 AND "cardId"=$2',[owner.serviceId,card.id]],
   ['UPDATE ledger_journals SET digest=$2 WHERE id=$1',[topup!.journalId,"b".repeat(64)]],["DELETE FROM ledger_journals WHERE id=$1",[topup!.journalId]],
   ['UPDATE ledger_entries SET "deltaMinor"="deltaMinor"+1 WHERE "journalId"=$1',[topup!.journalId]],['DELETE FROM ledger_entries WHERE "journalId"=$1',[topup!.journalId]],
  ];
  for(const [query,values] of forbidden)await expect(raw.query(query,values)).rejects.toMatchObject({code:"23514"});
  await expect(rawTransaction(()=>raw.query('UPDATE card_spending_limits SET version=version+1,"allowanceMinor"=6000,"updatedAt"=clock_timestamp() WHERE "serviceId"=$1 AND "cardId"=$2',[owner.serviceId,card.id]))).rejects.toMatchObject({code:"23514"});
  expect(await getCardholderFunds(owner.personId,owner.serviceId)).toEqual(before);expect(await getCardholderFundingIntent(owner.personId,owner.serviceId,review.id)).toMatchObject({receipt});expect(await getDb().select().from(cardSpendingLimits).where(eq(cardSpendingLimits.cardId,card.id))).toMatchObject([{version:1,allowanceMinor:5000n}]);
 });
});

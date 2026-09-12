import {randomUUID} from "node:crypto";
import {and,eq,sql} from "drizzle-orm";
import {afterAll,describe,expect,it} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {cards,serviceActivity,serviceMembers} from "../../src/platform/database/schema";
import {lockMoneyAccountsForServices} from "../../src/modules/money/service";
import {getCardholderDashboard,getCardholderDashboardFocus} from "../../src/modules/workspace/dashboard-service";
import {getHistoricalReport} from "../../src/modules/reports/service";
import {bindCreatedCardRecipient,controlCard,getCardholderFunds,getCardSpending,getWorkspace,purchaseCard,revokeCardRecipient,startCardRequest,submitCardRequest,updateCardRequest} from "../../src/modules/workspace/service";
import {cardPerson,cardPrimary,enrollCardholder,fundCardGroup} from "../helpers/cardholder";

afterAll(closeDatabase);
async function unassigned(owner:{personId:string;serviceId:string},nickname="Shared Visa card",allowanceMinor="2500"){
 const draft=await startCardRequest(owner.personId,owner.serviceId,{commandId:randomUUID()});
 expect(draft.holderId).toBeNull();
 const saved=await updateCardRequest(owner.personId,owner.serviceId,draft.id,{commandId:randomUUID(),expectedVersion:draft.version,holderId:null,nickname,format:"VIRTUAL",allowanceMinor});
 const input={commandId:randomUUID(),expectedVersion:saved.version};
 const issued=await submitCardRequest(owner.personId,owner.serviceId,saved.id,input);
 expect(issued.status).toBe("ISSUED");
 const card=(await getWorkspace(owner.personId,owner.serviceId)).cards.find(card=>card.id===issued.issuedCardId)!;
 return {card,issued,input};
}
async function bind(owner:{personId:string;serviceId:string},cardId:string,recipientId:string){
 return getDb().transaction(async tx=>{
  await lockMoneyAccountsForServices(tx,[owner.serviceId]);
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"workspace:"+owner.serviceId},0))`);
  return bindCreatedCardRecipient(tx,owner.personId,owner.serviceId,cardId,recipientId);
 });
}

describe("card-first recipient assignment",()=>{
 it("creates a zero-money unassigned Visa card without picking an owner or existing holder",async()=>{
  const owner=await cardPrimary("Card-first owner"),holder=await cardPerson("Existing member");
  await enrollCardholder(owner.personId,owner.serviceId,holder);
  const {card,issued,input}=await unassigned(owner,"Unassigned searchable card");
  expect(card).toMatchObject({holderId:null,assignmentState:"UNASSIGNED",network:"VISA",fictional:true,canPurchase:false,canInvite:true,canRevokeAssignment:false,available:{minor:"0"},spending:{allowance:{minor:"2500"}}});
  expect((await getCardholderFunds(owner.personId,owner.serviceId)).available.minor).toBe("0");
  expect((await getWorkspace(holder,owner.serviceId)).cards).toEqual([]);
  const dashboard=await getCardholderDashboard(owner.personId,0,{cardSearch:"searchable",cardScope:"MANAGED"});
  expect(dashboard.cards.map(row=>row.id)).toEqual([card.id]);expect(dashboard.managedCardCount).toBe(1);
  expect(await submitCardRequest(owner.personId,owner.serviceId,issued.id,input)).toMatchObject({issuedCardId:card.id});
  expect(await getDb().select().from(cards).where(eq(cards.serviceId,owner.serviceId))).toHaveLength(1);
  await expect(purchaseCard(owner.personId,owner.serviceId,card.id,{commandId:randomUUID(),expectedVersion:card.version,amountMinor:"1",description:"Not assigned"})).rejects.toMatchObject({code:"ACTION_DENIED"});
 });
 it("binds one exact recipient once without changing freeze, allowance or balance",async()=>{
  const owner=await cardPrimary(),first=await cardPerson("First recipient"),second=await cardPerson("Other recipient");
  await enrollCardholder(owner.personId,owner.serviceId,first);await enrollCardholder(owner.personId,owner.serviceId,second);
  await fundCardGroup(owner.personId,owner.serviceId,"5000");
  const {card}=await unassigned(owner);
  const frozen=await controlCard(owner.personId,owner.serviceId,card.id,{commandId:randomUUID(),expectedVersion:card.version,action:"freeze"});
  const assigned=await bind(owner,card.id,first);
  expect(assigned).toMatchObject({holderId:first,assignmentState:"ACCEPTED",status:"FROZEN",version:frozen.version+1,spending:{allowance:{minor:"2500"},used:{minor:"0"}}});
  expect((await getCardholderFunds(owner.personId,owner.serviceId)).available.minor).toBe("5000");
  expect((await getWorkspace(first,owner.serviceId)).cards.map(row=>row.id)).toEqual([card.id]);
  expect((await getWorkspace(second,owner.serviceId)).cards).toEqual([]);
  await expect(bind(owner,card.id,second)).rejects.toMatchObject({code:"CARD_ALREADY_ASSIGNED"});
  await expect(bind(owner,card.id,first)).rejects.toMatchObject({code:"CARD_ALREADY_ASSIGNED"});
  await expect(getCardholderDashboardFocus(second,card.id)).rejects.toMatchObject({status:404});
 });
 it("removes one card and its data without reviving it when the same holder accepts another card",async()=>{
  const owner=await cardPrimary(),holder=await cardPerson("Revoked recipient");await enrollCardholder(owner.personId,owner.serviceId,holder);
  await fundCardGroup(owner.personId,owner.serviceId,"5000");
  const {card}=await unassigned(owner);const assigned=await bind(owner,card.id,holder);
  const purchased=await purchaseCard(holder,owner.serviceId,card.id,{commandId:randomUUID(),expectedVersion:assigned.version,amountMinor:"100",description:"Private card transaction"});
  const input={commandId:randomUUID(),expectedVersion:purchased.card.version};
  const revoked=await revokeCardRecipient(owner.personId,owner.serviceId,card.id,input);
  expect(revoked).toMatchObject({holderId:holder,assignmentState:"REVOKED",spending:{used:{minor:"100"},remaining:{minor:"2400"}}});
  expect(await revokeCardRecipient(owner.personId,owner.serviceId,card.id,input)).toEqual(revoked);
  expect((await getWorkspace(holder,owner.serviceId)).activity).toEqual([]);
  expect((await getHistoricalReport(holder,owner.serviceId)).activity).toEqual([]);
  await expect(getCardSpending(holder,owner.serviceId,card.id)).rejects.toMatchObject({status:404});
  await expect(purchaseCard(holder,owner.serviceId,card.id,{commandId:randomUUID(),expectedVersion:revoked.version,amountMinor:"1",description:"Removed"})).rejects.toMatchObject({code:"ACTION_DENIED"});
  const next=await unassigned(owner,"Another card");await bind(owner,next.card.id,holder);
  expect((await getWorkspace(holder,owner.serviceId)).cards.map(row=>row.id)).toEqual([next.card.id]);
  expect((await getWorkspace(owner.personId,owner.serviceId)).activity.map(row=>row.id)).toContain(purchased.activity.id);
  expect((await getCardholderFunds(owner.personId,owner.serviceId)).available.minor).toBe("4900");
  await expect(bind(owner,card.id,holder)).rejects.toMatchObject({code:"CARD_ALREADY_ASSIGNED"});
 });
 it("requires current membership, exact owner and service, and disallows person-first issuance",async()=>{
  const owner=await cardPrimary(),other=await cardPrimary(),holder=await cardPerson("Not enrolled");const {card}=await unassigned(owner);
  await expect(bind(owner,card.id,holder)).rejects.toMatchObject({code:"CARDHOLDER_UNAVAILABLE"});
  await expect(bind(other,card.id,other.personId)).rejects.toMatchObject({status:404});
  const draft=await startCardRequest(owner.personId,owner.serviceId,{commandId:randomUUID()});
  await expect(updateCardRequest(owner.personId,owner.serviceId,draft.id,{commandId:randomUUID(),expectedVersion:draft.version,holderId:holder,nickname:"Wrong flow",format:"VIRTUAL",allowanceMinor:"100"})).rejects.toMatchObject({code:"CARD_RECIPIENT_INVITATION_REQUIRED"});
  expect((await getDb().select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,owner.serviceId),eq(serviceMembers.personId,holder))))).toEqual([]);
 });
 it("database identity guard forbids reassignment and cannot reopen revoked cards",async()=>{
  const owner=await cardPrimary(),holder=await cardPerson("Immutable recipient");await enrollCardholder(owner.personId,owner.serviceId,holder);
  const {card}=await unassigned(owner);const assigned=await bind(owner,card.id,holder);
  await expect(getDb().update(cards).set({holderId:owner.personId,version:assigned.version+1}).where(eq(cards.id,card.id))).rejects.toThrow();
  const revoked=await revokeCardRecipient(owner.personId,owner.serviceId,card.id,{commandId:randomUUID(),expectedVersion:assigned.version});
  await expect(getDb().update(cards).set({assignmentState:"ACCEPTED",assignmentRevokedAt:null,version:revoked.version+1}).where(eq(cards.id,card.id))).rejects.toThrow();
  expect(await getDb().select().from(serviceActivity).where(eq(serviceActivity.cardId,card.id))).toEqual([]);
 });
});

import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import {afterAll,beforeAll,describe,expect,it} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {cards,identityBindings,serviceMembers} from "../../src/platform/database/schema";
import {SessionService} from "../../src/modules/identity/session";
import {sessionRepository} from "../../src/platform/database/session-repository";
import {normalizeVerifiedEmail} from "../../src/shared/verified-email";
import {acceptInvitation,createCardInvitation,declineInvitation,getAccessOverview,getCardInvitations,getInvitationForPerson,listInvitationsForPerson,revokeInvitation,revokeMemberAccess} from "../../src/modules/access/service";
import {getResourceInvitation} from "../../src/modules/access/resource-service";
import {resourceInvitationProjectionSchema} from "../../src/shared/resource-invitation-response";
import {serviceInvitations,terminalAssignments} from "../../src/modules/access/schema";
import {createMerchantInvitation} from "../../src/modules/access/merchant-service";
import {createTerminal,getMerchantWorkspace} from "../../src/modules/acquiring/service";
import {getMerchantDashboard} from "../../src/modules/acquiring/dashboard-service";
import {getCardholderFunds,getWorkspace,startCardRequest,submitCardRequest,updateCardRequest} from "../../src/modules/workspace/service";
import {cardPerson,cardPrimary} from "../helpers/cardholder";
import {acquiringFixture} from "../helpers/acquiring";

afterAll(closeDatabase);
const email=()=>`recipient-${randomUUID()}@example.test`;
async function verified(personId:string,address?:string){
 const [binding]=await getDb().select().from(identityBindings).where(eq(identityBindings.personId,personId));
 if(!binding)throw new Error("Verified recipient fixture needs a real identity binding");
 const auth=new SessionService(sessionRepository,{appEnv:"test",publicOrigin:"http://127.0.0.1:3100"});
 await auth.issue({identityId:binding.id,personId},{issuer:binding.issuer,subject:binding.subject,...(address?{verifiedEmail:{emailNormalized:normalizeVerifiedEmail(address)!,provenance:"NETLIFY_USER_CONFIRMED" as const,verifiedAt:new Date(Date.now()-1000).toISOString()}}:{})});
}
async function card(owner:Awaited<ReturnType<typeof cardPrimary>>,name="Private invitation card"){
 const draft=await startCardRequest(owner.personId,owner.serviceId,{commandId:randomUUID()});
 const saved=await updateCardRequest(owner.personId,owner.serviceId,draft.id,{commandId:randomUUID(),expectedVersion:draft.version,holderId:null,nickname:name,format:"VIRTUAL",allowanceMinor:"7250"});
 const issued=await submitCardRequest(owner.personId,owner.serviceId,saved.id,{commandId:randomUUID(),expectedVersion:saved.version});
 if(!issued.issuedCardId)throw new Error("Invitation fixture card must use canonical issuance");return issued.issuedCardId;
}
const decision=(version:number)=>({commandId:randomUUID(),expectedVersion:version});
const offer=(recipientEmail:string)=>({commandId:randomUUID(),recipientEmail,expiresInDays:3 as const});

describe("verified recipient invitations to one resource",()=>{
 it("a forwarded UUID reveals no card details and cannot grant access without the matching verified contact",async()=>{
  const owner=await cardPrimary("Invitation owner"),recipient=await cardPerson("Intended recipient"),stranger=await cardPerson("Forwarded link visitor"),address=email(),cardId=await card(owner);
  const invite=await createCardInvitation(owner.personId,owner.serviceId,cardId,offer(address));
  await verified(stranger,email());
  for(const person of [recipient,stranger]){
   await expect(getInvitationForPerson(person,invite.id)).rejects.toMatchObject({status:404});
   await expect(getResourceInvitation(person,invite.id)).rejects.toMatchObject({status:404});
   await expect(acceptInvitation(person,invite.id,decision(invite.version))).rejects.toMatchObject({status:404});
  }
  expect((await getDb().select().from(cards).where(eq(cards.id,cardId)))[0]).toMatchObject({holderId:null,assignmentState:"UNASSIGNED"});
  expect(await getDb().select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,owner.serviceId),eq(serviceMembers.personId,recipient)))).toEqual([]);
  await verified(recipient,address.toUpperCase());
  const review=resourceInvitationProjectionSchema.parse(await getResourceInvitation(recipient,invite.id));
  expect(review).toMatchObject({id:invite.id,targetKind:"CARD",targetName:"Private invitation card",canRespond:true,hasAccess:false,allowance:{amount:"7250",currency:"USD"},href:`/cardholder-services?view=cards&card=${cardId}`});
  expect(JSON.stringify(review)).not.toMatch(/issuerReference|recipientEmail|serviceId|MONEY_/);
  // GET only reads; ownership and money still have not changed.
  expect((await getCardholderFunds(owner.personId,owner.serviceId)).available.minor).toBe("0");
  expect((await getDb().select().from(cards).where(eq(cards.id,cardId)))[0]!.holderId).toBeNull();
 });
 it("accepts the exact card once with duplicate delivery and lets that holder accept a second card",async()=>{
  const owner=await cardPrimary(),recipient=await cardPerson("Two card recipient"),address=email();await verified(recipient,address);
  const a=await card(owner,"First exact card"),b=await card(owner,"Second exact card");
  const input=offer(address.toUpperCase()),invite=await createCardInvitation(owner.personId,owner.serviceId,a,input);
  expect(invite.recipientEmail).toBe(address);expect((await createCardInvitation(owner.personId,owner.serviceId,a,input)).id).toBe(invite.id);
  const request=decision(invite.version),results=await Promise.all([acceptInvitation(recipient,invite.id,request),acceptInvitation(recipient,invite.id,request)]);
  expect(results.every(row=>row.status==="ACCEPTED"&&row.recipientId===recipient)).toBe(true);
  expect((await getWorkspace(recipient,owner.serviceId)).cards.map(row=>row.id)).toEqual([a]);
  const second=await createCardInvitation(owner.personId,owner.serviceId,b,offer(address));await acceptInvitation(recipient,second.id,decision(second.version));
  expect((await getWorkspace(recipient,owner.serviceId)).cards.map(row=>row.id).sort()).toEqual([a,b].sort());
  expect((await getCardInvitations(owner.personId,a)).canInvite).toBe(false);
  await expect(getCardInvitations(recipient,a)).rejects.toMatchObject({status:403});
  expect((await getResourceInvitation(recipient,invite.id)).hasAccess).toBe(true);
 });
 it("keeps previously revoked cards closed when a fresh exact-card invitation restores membership",async()=>{
  const owner=await cardPrimary(),recipient=await cardPerson("Returning cardholder"),address=email();await verified(recipient,address);
  const oldCard=await card(owner,"Previous card"),oldInvite=await createCardInvitation(owner.personId,owner.serviceId,oldCard,offer(address));await acceptInvitation(recipient,oldInvite.id,decision(oldInvite.version));
  const member=(await getAccessOverview(owner.personId,owner.serviceId)).people.find(row=>row.id===recipient)!;
  await revokeMemberAccess(owner.personId,owner.serviceId,recipient,decision(member.version));
  expect((await getDb().select().from(cards).where(eq(cards.id,oldCard)))[0]).toMatchObject({assignmentState:"REVOKED",holderId:recipient});
  const newCard=await card(owner,"New invitation card"),newInvite=await createCardInvitation(owner.personId,owner.serviceId,newCard,offer(address));await acceptInvitation(recipient,newInvite.id,decision(newInvite.version));
  expect((await getWorkspace(recipient,owner.serviceId)).cards.map(row=>row.id)).toEqual([newCard]);
  expect((await getResourceInvitation(recipient,oldInvite.id)).hasAccess).toBe(false);
  expect((await getCardholderFunds(owner.personId,owner.serviceId)).available.minor).toBe("0");
 });
 it("allows one pending recipient, and a canceled offer cannot accept after a replacement",async()=>{
  const owner=await cardPrimary(),recipient=await cardPerson("Canceled recipient"),address=email();await verified(recipient,address);
  const cardId=await card(owner),invite=await createCardInvitation(owner.personId,owner.serviceId,cardId,offer(address));
  await expect(createCardInvitation(owner.personId,owner.serviceId,cardId,offer(email()))).rejects.toMatchObject({code:"PENDING_INVITATION_EXISTS"});
  await revokeInvitation(owner.personId,owner.serviceId,invite.id,decision(invite.version));
  await expect(acceptInvitation(recipient,invite.id,decision(invite.version))).rejects.toThrow();
  const replacement=await createCardInvitation(owner.personId,owner.serviceId,cardId,offer(address));
  expect(replacement.id).not.toBe(invite.id);expect((await getCardInvitations(owner.personId,cardId)).invitations.filter(row=>row.status==="PENDING")).toHaveLength(1);
  await declineInvitation(recipient,replacement.id,decision(replacement.version));
  expect((await getDb().select().from(cards).where(eq(cards.id,cardId)))[0]!.assignmentState).toBe("UNASSIGNED");
 });
 it("rejects expired invitations and missing current contact proof without assigning a card",async()=>{
  const owner=await cardPrimary(),recipient=await cardPerson("Expired invitation recipient"),address=email();await verified(recipient,address);
  const cardId=await card(owner),invite=await createCardInvitation(owner.personId,owner.serviceId,cardId,offer(address));
  await verified(recipient);
  await expect(getInvitationForPerson(recipient,invite.id)).rejects.toMatchObject({status:404});
  await expect(acceptInvitation(recipient,invite.id,decision(invite.version))).rejects.toMatchObject({status:404});
  await verified(recipient,address);
  // A fixture clock boundary shortens only this persisted offer; no app expiry override exists.
  await getDb().update(serviceInvitations).set({expiresAt:new Date()}).where(eq(serviceInvitations.id,invite.id));
  expect((await getResourceInvitation(recipient,invite.id)).status).toBe("EXPIRED");
  await expect(acceptInvitation(recipient,invite.id,decision(invite.version))).rejects.toMatchObject({code:"INVITATION_EXPIRED"});
  const replacement=await createCardInvitation(owner.personId,owner.serviceId,cardId,offer(address));expect(replacement.id).not.toBe(invite.id);
  expect((await getDb().select().from(cards).where(eq(cards.id,cardId)))[0]!.assignmentState).toBe("UNASSIGNED");
 });
 it("binds to one login when two verified identities compete for the same offered email",async()=>{
  const owner=await cardPrimary(),one=await cardPerson("First verified login"),two=await cardPerson("Second verified login"),address=email();await verified(one,address);await verified(two,address);
  const cardId=await card(owner),invite=await createCardInvitation(owner.personId,owner.serviceId,cardId,offer(address));
  const results=await Promise.allSettled([acceptInvitation(one,invite.id,decision(invite.version)),acceptInvitation(two,invite.id,decision(invite.version))]);
  expect(results.filter(row=>row.status==="fulfilled")).toHaveLength(1);expect(results.filter(row=>row.status==="rejected")).toHaveLength(1);
  const [assigned]=await getDb().select().from(cards).where(eq(cards.id,cardId));expect([one,two]).toContain(assigned!.holderId);
  const loser=assigned!.holderId===one?two:one;
  await expect(getResourceInvitation(loser,invite.id)).rejects.toMatchObject({status:404});
  expect((await listInvitationsForPerson(loser)).some(row=>row.id===invite.id)).toBe(false);
  expect((await listInvitationsForPerson(assigned!.holderId!)).some(row=>row.id===invite.id)).toBe(true);
  expect(await getDb().select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,owner.serviceId),eq(serviceMembers.personId,loser)))).toEqual([]);
 });
 it("serializes owner cancellation with recipient acceptance without partial assignment",async()=>{
  const owner=await cardPrimary(),recipient=await cardPerson("Racing recipient"),address=email();await verified(recipient,address);
  const cardId=await card(owner),invite=await createCardInvitation(owner.personId,owner.serviceId,cardId,offer(address));
  const results=await Promise.allSettled([acceptInvitation(recipient,invite.id,decision(invite.version)),revokeInvitation(owner.personId,owner.serviceId,invite.id,decision(invite.version))]);
  expect(results.filter(row=>row.status==="fulfilled")).toHaveLength(1);
  const [saved]=await getDb().select().from(serviceInvitations).where(eq(serviceInvitations.id,invite.id));const [assigned]=await getDb().select().from(cards).where(eq(cards.id,cardId));
  expect(["ACCEPTED","REVOKED"]).toContain(saved!.status);expect(assigned!.assignmentState).toBe(saved!.status==="ACCEPTED"?"ACCEPTED":"UNASSIGNED");
  expect(assigned!.holderId).toBe(saved!.status==="ACCEPTED"?recipient:null);
 });
 it("an email invitation grants only its terminal and no balance or card access",async()=>{
  const merchant=await acquiringFixture(),recipient=await cardPerson("Terminal email recipient"),stranger=await cardPerson("Other terminal user"),address=email();await verified(recipient,address);await verified(stranger,email());
  const terminal=await createTerminal(merchant.personId,merchant.serviceId,{commandId:randomUUID(),displayName:"Exact shared terminal"});
  const invite=await createMerchantInvitation(merchant.personId,terminal.id,offer(address.toUpperCase()));
  await expect(getResourceInvitation(stranger,invite.id)).rejects.toMatchObject({status:404});
  const review=resourceInvitationProjectionSchema.parse(await getResourceInvitation(recipient,invite.id));expect(review).toMatchObject({targetKind:"MERCHANT_TERMINAL",targetName:"Exact shared terminal",canRespond:true,hasAccess:false,href:`/merchants/${terminal.id}?tab=payments`});
  await acceptInvitation(recipient,invite.id,decision(invite.version));
  const dashboard=await getMerchantDashboard(recipient);expect(dashboard.units.map(row=>row.id)).toEqual([terminal.id]);expect(dashboard.moneyAccounts).toEqual([]);
  await expect(getMerchantWorkspace(recipient,merchant.merchantId)).rejects.toMatchObject({status:404});
  expect(await getDb().select().from(terminalAssignments).where(and(eq(terminalAssignments.terminalId,terminal.id),eq(terminalAssignments.personId,recipient)))).toHaveLength(1);
  expect(await getDb().select().from(serviceMembers).where(eq(serviceMembers.personId,recipient))).toEqual([]);
 });
});


describe("exact invitation receipts beyond the history page",()=>{
 let owner:Awaited<ReturnType<typeof cardPrimary>>,cardId:string,firstInput:ReturnType<typeof offer>,firstId:string;
 beforeAll(async()=>{
  owner=await cardPrimary("Invitation receipt pagination owner");cardId=await card(owner);firstInput=offer(email());
  for(let index=0;index<31;index++){
   const invite=await createCardInvitation(owner.personId,owner.serviceId,cardId,index===0?firstInput:offer(email()));
   if(index===0)firstId=invite.id;
   await revokeInvitation(owner.personId,owner.serviceId,invite.id,decision(invite.version));
  }
 },60_000);
 it("replays the original resource receipt even after it leaves the latest 30 invitations",async()=>{
  const visible=await getCardInvitations(owner.personId,cardId);expect(visible.invitations).toHaveLength(30);expect(visible.invitations.some(row=>row.id===firstId)).toBe(false);
  const retry=await createCardInvitation(owner.personId,owner.serviceId,cardId,firstInput);expect(retry).toMatchObject({id:firstId,cardId,status:"REVOKED"});
  expect(await getDb().select().from(serviceInvitations).where(eq(serviceInvitations.cardId,cardId))).toHaveLength(31);
  expect((await getWorkspace(owner.personId,owner.serviceId)).cards.find(row=>row.id===cardId)).toMatchObject({version:1,holderId:null,assignmentState:"UNASSIGNED"});
  expect((await getCardholderFunds(owner.personId,owner.serviceId)).available.minor).toBe("0");
 });
});

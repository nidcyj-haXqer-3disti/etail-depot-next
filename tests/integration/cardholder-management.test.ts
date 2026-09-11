import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { closeDatabase } from "../../src/platform/database/client";
import { getCardholderDashboard, getCardholderDashboardDetail } from "../../src/modules/workspace/dashboard-service";
import { cancelCardRequest, startCardRequest, submitCardRequest, updateCardRequest } from "../../src/modules/workspace/service";
import { createInvitation,getAccessOverview,revokeInvitation,revokeMemberAccess,updateMemberAccess } from "../../src/modules/access/service";
import { cardholderDashboardQuerySchema, cardholderDashboardSchema } from "../../src/modules/workspace/api-contracts";
import { accessOverviewSchema } from "../../src/modules/access/api-contracts";
import { cardPerson, cardPrimary, enrollCardholder, issuePracticeCard } from "../helpers/cardholder";

afterAll(closeDatabase);
describe("complete Cardholder management projections", () => {
  it("retains drafts, blocked, issued and canceled requests with exact pagination and literal scoped search", async () => {
    const primary=await cardPrimary("Request history primary"),stranger=await cardPrimary("Unrelated request history");
    const issued=await issuePracticeCard(primary.personId,primary.serviceId,primary.personId,"Travel 100% card","2500");
    const cancel=await startCardRequest(primary.personId,primary.serviceId,{commandId:randomUUID()});
    await cancelCardRequest(primary.personId,primary.serviceId,cancel.id,{commandId:randomUUID(),expectedVersion:cancel.version});
    const blocked=await startCardRequest(primary.personId,primary.serviceId,{commandId:randomUUID()});
    await submitCardRequest(primary.personId,primary.serviceId,blocked.id,{commandId:randomUUID(),expectedVersion:blocked.version});
    for(let n=0;n<21;n++)await startCardRequest(primary.personId,primary.serviceId,{commandId:randomUUID()});
    const foreign=await issuePracticeCard(stranger.personId,stranger.serviceId,stranger.personId,"Travel 100% private","900");
    const first=await getCardholderDashboard(primary.personId),second=await getCardholderDashboard(primary.personId,0,{requestPage:1});
    expect(cardholderDashboardSchema.parse(first)).toEqual(first);
    expect(first).toMatchObject({requestCount:24,unfinishedRequestCount:22,requestsHasMore:true,requestPage:0});
    expect(first.requests).toHaveLength(20);
    expect(second.requests).toHaveLength(4);
    expect(second.requestsHasMore).toBe(false);
    expect(new Set([...first.requests,...second.requests].map(row=>row.id)).size).toBe(24);
    expect([...first.requests,...second.requests].map(row=>row.status)).toEqual(expect.arrayContaining(["DRAFT","BLOCKED","ISSUED","CANCELED"]));
    const complete=await getCardholderDashboard(primary.personId,0,{requestStatus:"ISSUED",requestSearch:"100%"});
    expect(complete.requestCount).toBe(1);
    expect(complete.requests).toMatchObject([{id:issued.request.id,issuedCardId:issued.card.id}]);
    expect(JSON.stringify(complete)).not.toContain(foreign.card.id);
    expect((await getCardholderDashboard(primary.personId,0,{requestSearch:"%"})).requestCount).toBe(1);
    expect((await getCardholderDashboard(primary.personId,0,{requestSearch:"not present"})).requestCount).toBe(0);
    expect((await getCardholderDashboard(primary.personId,0,{requestSearch:"Request history primary",requestStatus:"CANCELED"})).requests).toMatchObject([{id:cancel.id,status:"CANCELED"}]);
  },30_000);

  it("shows receipt-backed request history without inventing approval events or duplicating replayed commands", async () => {
    const primary=await cardPrimary("Timeline primary"),secondary=await cardPerson("Timeline secondary");
    await enrollCardholder(primary.personId,primary.serviceId,secondary);
    const draft=await startCardRequest(primary.personId,primary.serviceId,{commandId:randomUUID()});
    const saved=await updateCardRequest(primary.personId,primary.serviceId,draft.id,{commandId:randomUUID(),expectedVersion:draft.version,holderId:secondary,nickname:"Secondary timeline card",format:"VIRTUAL",requestedLimitMinor:"1500"});
    const command={commandId:randomUUID(),expectedVersion:saved.version};
    await submitCardRequest(primary.personId,primary.serviceId,saved.id,command);
    await submitCardRequest(primary.personId,primary.serviceId,saved.id,command);
    const detail=await getCardholderDashboardDetail(primary.personId,{request:draft.id});
    expect(detail?.requestHistory?.events.map(event=>event.label)).toEqual(["Card creation checked","Card details saved","Request started"]);
    expect(detail?.requestHistory?.hasEarlierEvents).toBe(false);
    expect(detail?.requestHistory?.createdAt).toMatch(/^\d{4}-/);
    expect(detail?.workspace.cardRequests.find(row=>row.id===draft.id)).toMatchObject({status:"ISSUED",holderId:secondary});
    expect(JSON.stringify(detail?.requestHistory)).not.toMatch(/digest|password|approved|underwriting/);
    await expect(getCardholderDashboardDetail(secondary,{request:draft.id})).rejects.toMatchObject({status:404});
    expect((await getCardholderDashboard(secondary)).requests).toEqual([]);
  });

  it("exposes all of a named person's cards plus only the primary service's access history", async () => {
    const primary=await cardPrimary("Management primary"),secondary=await cardPerson("Several cards"),foreign=await cardPrimary("Private other primary");
    await enrollCardholder(primary.personId,primary.serviceId,secondary);
    await enrollCardholder(foreign.personId,foreign.serviceId,secondary);
    const first=await issuePracticeCard(primary.personId,primary.serviceId,secondary,"Everyday","1000");
    const second=await issuePracticeCard(primary.personId,primary.serviceId,secondary,"Travel","2500");
    const privateCard=await issuePracticeCard(foreign.personId,foreign.serviceId,secondary,"Outside this group","9900");
    const detail=await getCardholderDashboardDetail(primary.personId,{manage:primary.serviceId});
    expect(detail?.workspace.cards.filter(card=>card.holderId===secondary).map(card=>card.id).sort()).toEqual([first.card.id,second.card.id].sort());
    let access=await getAccessOverview(primary.personId,primary.serviceId);
    expect(accessOverviewSchema.parse(access)).toEqual(access);
    expect(access.history.map(event=>event.label)).toEqual(["Invitation accepted","Invitation created"]);
    expect(JSON.stringify(access)).not.toContain(foreign.serviceId);
    expect(JSON.stringify(detail)).not.toContain(privateCard.card.id);
    const person=access.people.find(person=>person.id===secondary)!;
    const updated=await updateMemberAccess(primary.personId,primary.serviceId,secondary,{commandId:randomUUID(),expectedVersion:person.version,role:"SECONDARY",permissions:["cards.read","cards.hold","activity.read"],delegablePermissions:[]});
    await revokeMemberAccess(primary.personId,primary.serviceId,secondary,{commandId:randomUUID(),expectedVersion:updated.version});
    access=await getAccessOverview(primary.personId,primary.serviceId);
    expect(access.history.slice(0,2).map(event=>event.label)).toEqual(["Cardholder access removed","Access changed"]);
    expect(access.history.every(event=>event.personId===secondary)).toBe(true);
    const retained=await getCardholderDashboardDetail(primary.personId,{manage:primary.serviceId});
    expect(retained?.workspace.cards.filter(card=>card.holderId===secondary)).toHaveLength(2);
    expect(retained?.workspace.cardholderOptions.some(person=>person.id===secondary)).toBe(false);
    await expect(getAccessOverview(secondary,primary.serviceId)).rejects.toMatchObject({status:404});
    await expect(getCardholderDashboardDetail(secondary,{manage:foreign.serviceId})).rejects.toMatchObject({status:403});
  });

  it("rejects invalid request filters rather than silently replacing them", async () => {
    const primary=await cardPrimary();
    await expect(getCardholderDashboard(primary.personId,0,{requestPage:-1})).rejects.toMatchObject({status:422});
    await expect(getCardholderDashboard(primary.personId,0,{requestSearch:"a".repeat(101)})).rejects.toMatchObject({status:422});
    for(const query of [{requestPage:"-1"},{requestStatus:"APPROVED"},{requestSearch:"a".repeat(101)},{requestPage:["0","1"]}])expect(cardholderDashboardQuerySchema.safeParse(query).success).toBe(false);
  });

  it("prioritizes waiting invitations, discloses the bound and returns exact command results outside that bound",async()=>{
    const primary=await cardPrimary("Bounded invitation primary"),waitingPerson=await cardPerson("Waiting recipient"),historyPerson=await cardPerson("Historical recipient");
    const offer=(recipientId:string)=>({commandId:randomUUID(),recipientId,role:"SECONDARY" as const,permissions:["cards.read" as const,"cards.hold" as const],delegablePermissions:[],expiresInDays:7 as const});
    const oldWaiting=await createInvitation(primary.personId,primary.serviceId,offer(waitingPerson));
    for(let index=0;index<100;index++){
      const invitation=await createInvitation(primary.personId,primary.serviceId,offer(historyPerson));
      await revokeInvitation(primary.personId,primary.serviceId,invitation.id,{commandId:randomUUID(),expectedVersion:invitation.version});
    }
    const before=accessOverviewSchema.parse(await getAccessOverview(primary.personId,primary.serviceId));
    expect(before).toMatchObject({invitationTotal:101,pendingInvitationCount:1,invitationsTruncated:true});
    expect(before.invitations).toHaveLength(100);
    expect(before.invitations[0]).toMatchObject({id:oldWaiting.id,status:"PENDING",canRevoke:true});
    const command={commandId:randomUUID(),expectedVersion:oldWaiting.version};
    expect(await revokeInvitation(primary.personId,primary.serviceId,oldWaiting.id,command)).toMatchObject({id:oldWaiting.id,status:"REVOKED"});
    const after=await getAccessOverview(primary.personId,primary.serviceId);
    expect(after).toMatchObject({invitationTotal:101,pendingInvitationCount:0,invitationsTruncated:true});
    expect(after.invitations.some(invitation=>invitation.id===oldWaiting.id)).toBe(false);
    expect(await revokeInvitation(primary.personId,primary.serviceId,oldWaiting.id,command)).toMatchObject({id:oldWaiting.id,status:"REVOKED"});
    await expect(getAccessOverview(waitingPerson,primary.serviceId)).rejects.toMatchObject({status:404});
  },30_000);
});

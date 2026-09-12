import {fundCardGroup} from "../helpers/cardholder";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { serviceMembers, cards } from "../../src/platform/database/schema";
import { getAccessOverview, revokeMemberAccess, createInvitation, acceptInvitation } from "../../src/modules/access/service";
import { getWorkspace, controlCard } from "../../src/modules/workspace/service";
import { getCardholderDirectory } from "../../src/modules/services/service";
import { cardPerson, cardPrimary, enrollCardholder, issuePracticeCard } from "../helpers/cardholder";

afterAll(closeDatabase);
async function fixture() {
  const primary = await cardPrimary(), secondary = await cardPerson("Secondary with own history");
  await enrollCardholder(primary.personId, primary.serviceId, secondary);
  const own = await (async()=>{await fundCardGroup(primary.personId,primary.serviceId,"2000");return issuePracticeCard(primary.personId, primary.serviceId, secondary, "Secondary private card", "123", "1000");})();
  const primaryCard = await (async()=>{return issuePracticeCard(primary.personId, primary.serviceId, primary.personId, "Primary private card", "456", "1000");})();
  return { ...primary, secondary, own, primaryCard };
}

describe("explicit Cardholder member lifecycle", () => {
  it("gives named holders fixed own-card controls while keeping owner cards and money private", async () => {
    const f = await fixture();
    const member = (await getAccessOverview(f.personId, f.serviceId)).people.find(row => row.id === f.secondary)!;
    expect(member).toMatchObject({role:"CARDHOLDER",state:"ACCEPTED",canManage:false,delegablePermissions:[]});
    const own = await getWorkspace(f.secondary, f.serviceId);
    expect(own.cards.map(row => row.id)).toEqual([f.own.card.id]);
    expect(own.cards[0]!.canFreeze).toBe(true);
    expect(own.activity.map(row => row.id)).toEqual([f.own.activity!.id]);
    const frozen=await controlCard(f.secondary,f.serviceId,f.own.card.id,{commandId:randomUUID(),expectedVersion:f.own.card.version,action:"freeze"});
    expect(frozen.status).toBe("FROZEN");
    await controlCard(f.secondary,f.serviceId,f.own.card.id,{commandId:randomUUID(),expectedVersion:frozen.version,action:"unfreeze"});
    await expect(controlCard(f.secondary,f.serviceId,f.primaryCard.card.id,{commandId:randomUUID(),expectedVersion:f.primaryCard.card.version,action:"freeze"})).rejects.toMatchObject({status:403,code:"ACTION_DENIED"});
    await expect(createInvitation(f.secondary,f.serviceId,{commandId:randomUUID(),recipientId:f.personId,expiresInDays:3})).rejects.toMatchObject({status:403});
    expect((await getAccessOverview(f.personId,f.serviceId)).people.find(row=>row.id===f.secondary)?.version).toBe(member.version);
  });

  it("keeps revoked card history reviewable without reviving cards after fresh membership acceptance", async () => {
    const f = await fixture();
    const records = () => getDb().select().from(cards).where(eq(cards.serviceId, f.serviceId)).orderBy(cards.id);
    const before = await records();
    const member = (await getAccessOverview(f.personId, f.serviceId)).people.find(row => row.id === f.secondary)!;
    const revoke = { commandId: randomUUID(), expectedVersion: member.version };
    const revoked = await revokeMemberAccess(f.personId, f.serviceId, f.secondary, revoke);
    expect(revoked).toMatchObject({ state: "REVOKED", permissions: [], version: member.version + 1 });
    expect(await revokeMemberAccess(f.personId, f.serviceId, f.secondary, revoke)).toEqual(revoked);
    expect((await getCardholderDirectory(f.secondary))).toEqual([]);
    await expect(getWorkspace(f.secondary, f.serviceId)).rejects.toMatchObject({ status: 404 });
    const invitation = await createInvitation(f.personId, f.serviceId, { commandId: randomUUID(), recipientId: f.secondary, expiresInDays: 3 });
    expect(invitation).toMatchObject({ status: "PENDING", hasServiceAccess: false });
    await expect(getWorkspace(f.secondary, f.serviceId)).rejects.toMatchObject({ status: 404 });
    const acceptance = { commandId: randomUUID(), expectedVersion: invitation.version };
    const accepted = await acceptInvitation(f.secondary, invitation.id, acceptance);
    expect(accepted).toMatchObject({ status: "ACCEPTED", hasServiceAccess: true });
    expect(await acceptInvitation(f.secondary, invitation.id, acceptance)).toEqual(accepted);
    const current = (await getAccessOverview(f.personId, f.serviceId)).people.find(row => row.id === f.secondary)!;
    expect(current.version).toBe(revoked.version + 1);
    expect((await getWorkspace(f.secondary, f.serviceId)).cards).toEqual([]);
    expect((await getWorkspace(f.secondary, f.serviceId)).activity).toEqual([]);
    await revokeMemberAccess(f.personId, f.serviceId, f.secondary, { commandId: randomUUID(), expectedVersion: current.version });
    expect(await acceptInvitation(f.secondary, invitation.id, acceptance)).toMatchObject({ status: "ACCEPTED", hasServiceAccess: false });
    expect((await getCardholderDirectory(f.secondary))).toEqual([]);
    const after = await records();
    expect(after.find(row=>row.id===f.primaryCard.card.id)).toEqual(before.find(row=>row.id===f.primaryCard.card.id));
    const original=before.find(row=>row.id===f.own.card.id)!;
    expect(after.find(row=>row.id===f.own.card.id)).toMatchObject({...original,assignmentState:"REVOKED",assignmentRevokedAt:expect.any(Date),version:original.version+1});
    expect((await getWorkspace(f.personId,f.serviceId)).activity.some(row=>row.id===f.own.activity!.id)).toBe(true);
  });

  it("keeps the lightweight card directory own-only, and removes the entire group after membership revocation", async () => {
    const f = await fixture();
    const directory = await getCardholderDirectory(f.secondary);
    expect(directory).toHaveLength(1);
    expect(directory[0]!.cards.map(row => row.id)).toEqual([f.own.card.id]);
    for (const value of [f.personId, f.primaryCard.card.id, f.primaryCard.card.nickname, f.primaryCard.activity!.id]) expect(JSON.stringify(directory)).not.toContain(value);
    const member=(await getAccessOverview(f.personId,f.serviceId)).people.find(row=>row.id===f.secondary)!;
    await revokeMemberAccess(f.personId,f.serviceId,f.secondary,{commandId:randomUUID(),expectedVersion:member.version});
    expect(await getCardholderDirectory(f.secondary)).toEqual([]);
    expect((await getDb().select().from(serviceMembers).where(and(eq(serviceMembers.serviceId, f.serviceId), eq(serviceMembers.personId, f.secondary))))[0]!.state).toBe("REVOKED");
  });
});

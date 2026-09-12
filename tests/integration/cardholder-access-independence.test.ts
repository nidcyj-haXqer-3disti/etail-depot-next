import {fundCardGroup,setPersonLimit} from "../helpers/cardholder";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { serviceMembers, cards, permissionGrants } from "../../src/platform/database/schema";
import { getAccessOverview, updateMemberAccess, revokeMemberAccess, createInvitation, acceptInvitation } from "../../src/modules/access/service";
import { getWorkspace, controlCard } from "../../src/modules/workspace/service";
import { getCardholderDirectory } from "../../src/modules/services/service";
import { cardPerson, cardPrimary, enrollCardholder, issuePracticeCard, secondaryPermissions } from "../helpers/cardholder";

afterAll(closeDatabase);
async function fixture() {
  const primary = await cardPrimary(), secondary = await cardPerson("Secondary with own history");
  await enrollCardholder(primary.personId, primary.serviceId, secondary);
  const own = await (async()=>{await fundCardGroup(primary.personId,primary.serviceId,"2000");await setPersonLimit(primary.personId,primary.serviceId,secondary,"1000");return issuePracticeCard(primary.personId,primary.serviceId,secondary,"Secondary private card","123");})();
  const primaryCard = await (async()=>{await setPersonLimit(primary.personId,primary.serviceId,primary.personId,"1000");return issuePracticeCard(primary.personId,primary.serviceId,primary.personId,"Primary private card","456");})();
  return { ...primary, secondary, own, primaryCard };
}

describe("explicit Cardholder member lifecycle", () => {
  it("edits one secondary's explicit grants with retry and optimistic version checks", async () => {
    const f = await fixture();
    const member = (await getAccessOverview(f.personId, f.serviceId)).people.find(row => row.id === f.secondary)!;
    const input = { commandId: randomUUID(), expectedVersion: member.version, role: "SECONDARY" as const, permissions: ["cards.read", "activity.read"] as const, delegablePermissions: [] };
    const command = { ...input, permissions: [...input.permissions] };
    const edited = await updateMemberAccess(f.personId, f.serviceId, f.secondary, command);
    expect(edited).toMatchObject({ role: "SECONDARY", state: "ACCEPTED", version: member.version + 1 });
    expect(await updateMemberAccess(f.personId, f.serviceId, f.secondary, command)).toEqual(edited);
    await expect(updateMemberAccess(f.personId, f.serviceId, f.secondary, { ...command, commandId: randomUUID() })).rejects.toMatchObject({ code: "STALE_VERSION", status: 409 });
    const own = await getWorkspace(f.secondary, f.serviceId);
    expect(own.cards.map(row => row.id)).toEqual([f.own.card.id]);
    expect(own.cards[0]!.canFreeze).toBe(false);
    expect(own.activity.map(row => row.id)).toEqual([f.own.activity!.id]);
    await expect(controlCard(f.secondary, f.serviceId, f.own.card.id, { commandId: randomUUID(), expectedVersion: f.own.card.version, action: "freeze" })).rejects.toMatchObject({ status: 403 });
  });

  it("keeps revoked history reviewable and requires fresh acceptance before restoring current access", async () => {
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
    const invitation = await createInvitation(f.personId, f.serviceId, { commandId: randomUUID(), recipientId: f.secondary, role: "SECONDARY", permissions: secondaryPermissions, delegablePermissions: [], expiresInDays: 3 });
    expect(invitation).toMatchObject({ status: "PENDING", hasServiceAccess: false });
    await expect(getWorkspace(f.secondary, f.serviceId)).rejects.toMatchObject({ status: 404 });
    const acceptance = { commandId: randomUUID(), expectedVersion: invitation.version };
    const accepted = await acceptInvitation(f.secondary, invitation.id, acceptance);
    expect(accepted).toMatchObject({ status: "ACCEPTED", hasServiceAccess: true });
    expect(await acceptInvitation(f.secondary, invitation.id, acceptance)).toEqual(accepted);
    const current = (await getAccessOverview(f.personId, f.serviceId)).people.find(row => row.id === f.secondary)!;
    expect(current.version).toBe(revoked.version + 1);
    expect((await getWorkspace(f.secondary, f.serviceId)).cards.map(row => row.id)).toEqual([f.own.card.id]);
    await revokeMemberAccess(f.personId, f.serviceId, f.secondary, { commandId: randomUUID(), expectedVersion: current.version });
    expect(await acceptInvitation(f.secondary, invitation.id, acceptance)).toMatchObject({ status: "ACCEPTED", hasServiceAccess: false });
    expect((await getCardholderDirectory(f.secondary))).toEqual([]);
    expect(await records()).toEqual(before);
  });

  it("keeps the lightweight card directory own-only, including after card-read revocation", async () => {
    const f = await fixture();
    const directory = await getCardholderDirectory(f.secondary);
    expect(directory).toHaveLength(1);
    expect(directory[0]!.cards.map(row => row.id)).toEqual([f.own.card.id]);
    for (const value of [f.personId, f.primaryCard.card.id, f.primaryCard.card.nickname, f.primaryCard.activity!.id]) expect(JSON.stringify(directory)).not.toContain(value);
    await getDb().update(permissionGrants).set({ state: "REVOKED" }).where(and(eq(permissionGrants.serviceId, f.serviceId), eq(permissionGrants.personId, f.secondary), eq(permissionGrants.action, "cards.read")));
    expect((await getCardholderDirectory(f.secondary))[0]!.cards).toEqual([]);
    expect((await getDb().select().from(serviceMembers).where(and(eq(serviceMembers.serviceId, f.serviceId), eq(serviceMembers.personId, f.secondary))))[0]!.state).toBe("ACCEPTED");
  });
});

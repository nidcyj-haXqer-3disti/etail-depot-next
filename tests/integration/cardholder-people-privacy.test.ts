import {fundCardGroup} from "../helpers/cardholder";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { services, serviceMembers, permissionGrants } from "../../src/platform/database/schema";
import { accessCommands } from "../../src/modules/access/schema";
import { getAccessOverview, revokeMemberAccess, createInvitation, acceptInvitation } from "../../src/modules/access/service";
import { getServiceForPerson } from "../../src/modules/services/service";
import { getWorkspace } from "../../src/modules/workspace/service";
import { cardPerson, cardPrimary, enrollCardholder, issuePracticeCard } from "../helpers/cardholder";

afterAll(closeDatabase);
describe("Cardholder people belong only to the explicit Cardholder service", () => {
  it("hides unrelated Merchant members and rejects injected roles without enrolling an unrelated person", async () => {
    const f = await cardPrimary(), hidden = await cardPerson("Merchant-only person");
    const [merchant] = await getDb().insert(services).values({ kind: "MERCHANT", primaryPersonId: hidden, displayName: "Private merchant" }).returning();
    await getDb().insert(serviceMembers).values({ serviceId: merchant!.id, personId: hidden, state: "ACCEPTED", version: 19 });
    await getDb().insert(permissionGrants).values(["acquiring.read", "payments.read"].map(action => ({ serviceId: merchant!.id, personId: hidden, action, delegable: true })));
    const merchantRows = async () => ({ members: await getDb().select().from(serviceMembers).where(eq(serviceMembers.serviceId, merchant!.id)), grants: await getDb().select().from(permissionGrants).where(eq(permissionGrants.serviceId, merchant!.id)).orderBy(permissionGrants.action) });
    const before = await merchantRows();
    const access = await getAccessOverview(f.personId, f.serviceId), workspace = await getWorkspace(f.personId, f.serviceId);
    expect(access.people.map(row => row.id)).toEqual([f.personId]);
    expect(workspace.people.some(row => row.id === hidden)).toBe(false);
    expect(workspace.cardholderOptions.some(row => row.id === hidden)).toBe(false);
    expect((await getServiceForPerson(f.personId, f.serviceId)).peopleCount).toBe(1);
    const injected={commandId:randomUUID(),recipientId:hidden,expiresInDays:3 as const,role:"OWNER",permissions:["cards.read"]};
    await expect(createInvitation(f.personId,f.serviceId,injected)).rejects.toMatchObject({status:422,code:"INVALID_REQUEST"});
    await expect(revokeMemberAccess(f.personId, f.serviceId, hidden, { commandId: randomUUID(), expectedVersion: 19 })).rejects.toMatchObject({ status: 404, code: "PERSON_UNAVAILABLE" });
    expect(await getDb().select().from(accessCommands).where(eq(accessCommands.serviceId, f.serviceId))).toEqual([]);
    expect(await merchantRows()).toEqual(before);
  });

  it("offers an invitation without manufacturing membership or exposing the recipient's other services", async () => {
    const f = await cardPrimary(), recipient = await cardPrimary("Recipient's separate primary service");
    const input = { commandId: randomUUID(), recipientId: recipient.personId, expiresInDays: 3 as const };
    const invitation = await createInvitation(f.personId, f.serviceId, input);
    expect(await createInvitation(f.personId, f.serviceId, input)).toEqual(invitation);
    expect((await getAccessOverview(f.personId, f.serviceId)).people.map(row => row.id)).toEqual([f.personId]);
    expect(await getDb().select().from(serviceMembers).where(and(eq(serviceMembers.serviceId, f.serviceId), eq(serviceMembers.personId, recipient.personId)))).toEqual([]);
    await expect(acceptInvitation(f.personId, invitation.id, { commandId: randomUUID(), expectedVersion: invitation.version })).rejects.toMatchObject({ status: 404 });
    await acceptInvitation(recipient.personId, invitation.id, { commandId: randomUUID(), expectedVersion: invitation.version });
    const access = await getAccessOverview(f.personId, f.serviceId);
    expect(access.people.find(row => row.id === recipient.personId)).toMatchObject({ role: "CARDHOLDER", state: "ACCEPTED" });
    expect(JSON.stringify(access)).not.toContain(recipient.serviceId);
  });

  it("retains a revoked actual cardholder for review but excludes them from new card selection", async () => {
    const f = await cardPrimary(), secondary = await cardPerson("Retained secondary history");
    await enrollCardholder(f.personId, f.serviceId, secondary);
    const card = await (async()=>{await fundCardGroup(f.personId,f.serviceId,"100");return issuePracticeCard(f.personId, f.serviceId, secondary, "Retained card", "10", "100");})();
    const member = (await getAccessOverview(f.personId, f.serviceId)).people.find(row => row.id === secondary)!;
    await revokeMemberAccess(f.personId, f.serviceId, secondary, { commandId: randomUUID(), expectedVersion: member.version });
    const access = await getAccessOverview(f.personId, f.serviceId), workspace = await getWorkspace(f.personId, f.serviceId);
    expect(access.people.find(row => row.id === secondary)).toMatchObject({ state: "REVOKED", permissions: [], canManage: false, canRevoke: false });
    expect(workspace.people.find(row => row.id === secondary)).toMatchObject({ state: "REVOKED", permissions: [] });
    expect(workspace.cards.map(row => row.id)).toContain(card.card.id);
    expect(workspace.cardholderOptions.some(row => row.id === secondary)).toBe(false);
    await expect(getWorkspace(secondary, f.serviceId)).rejects.toMatchObject({ status: 404 });
  });
});

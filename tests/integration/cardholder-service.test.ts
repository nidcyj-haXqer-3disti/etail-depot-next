import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { cardholderCreationCommands, cards, services, serviceMembers, permissionGrants } from "../../src/platform/database/schema";
import { bindIdentity, createCardholderService, listServicesForPerson } from "../../src/modules/services/service";
import { loadServiceScope } from "../../src/modules/access/scope";
import { cardholderRole, canReadCardholderData } from "../../src/modules/policy/cardholder-scope";
import { evaluate } from "../../src/modules/policy/evaluate";
import { cardPerson, cardPrimary, enrollCardholder } from "../helpers/cardholder";

afterAll(closeDatabase);
const scope = (personId: string, serviceId: string) => getDb().transaction(tx => loadServiceScope(tx, personId, serviceId));

describe("explicit Cardholder services", () => {
  it("binds identity without enrolling and creates one service only through an idempotent command", async () => {
    const subject = randomUUID();
    const bound = await bindIdentity("urn:etail:isolated-fixture", subject, "Identity only");
    expect(await bindIdentity("urn:etail:isolated-fixture", subject)).toEqual(bound);
    expect(await listServicesForPerson(bound.personId)).toEqual([]);
    const personId = await cardPerson("Explicit applicant");
    const input = { commandId: randomUUID(), displayName: "My card service" };
    const first = await createCardholderService(personId, input);
    expect(await createCardholderService(personId, input)).toEqual(first);
    expect(await getDb().select().from(services).where(eq(services.primaryPersonId, personId))).toMatchObject([{ id: first.serviceId, kind: "CARDHOLDER", primaryPersonId: personId }]);
    expect(await getDb().select().from(cardholderCreationCommands).where(eq(cardholderCreationCommands.actorId, personId))).toHaveLength(1);
    expect(await getDb().select().from(cards).where(eq(cards.serviceId, first.serviceId))).toEqual([]);
    await expect(createCardholderService(personId, { ...input, displayName: "Changed replay" })).rejects.toMatchObject({ status: 409, code: "IDEMPOTENCY_CONFLICT" });
    await expect(createCardholderService(personId, { ...input, commandId: randomUUID() })).rejects.toMatchObject({ status: 409, code: "CARDHOLDER_SERVICE_EXISTS" });
    await expect(createCardholderService(await cardPerson("Other actor"), input)).rejects.toMatchObject({ status: 409, code: "IDEMPOTENCY_CONFLICT" });
  });

  it("uses a required named primary and prevents two primary Cardholder services for one person", async () => {
    const primary = await cardPrimary();
    await expect(getDb().insert(services).values({ kind: "CARDHOLDER", primaryPersonId: primary.personId, displayName: "Duplicate" })).rejects.toThrow();
    const unrelated = await cardPerson("Unrelated person");
    const [service] = await getDb().insert(services).values({ kind: "CARDHOLDER", primaryPersonId: unrelated, displayName: "Missing primary membership" }).returning();
    await getDb().insert(serviceMembers).values({ serviceId: service!.id, personId: primary.personId, state: "ACCEPTED" });
    await getDb().insert(permissionGrants).values({ serviceId: service!.id, personId: primary.personId, action: "cards.read" });
    await expect(scope(primary.personId, service!.id)).rejects.toMatchObject({ status: 404 });
  });

  it("derives secondary privacy from the named primary even if broad grants are present", async () => {
    const primary = await cardPrimary(), secondary = await cardPerson("Secondary");
    await enrollCardholder(primary.personId, primary.serviceId, secondary);
    await getDb().insert(permissionGrants).values(["people.read", "people.invite", "cards.create", "cards.request", "cards.manageMembers"].map(action => ({ serviceId: primary.serviceId, personId: secondary, action })));
    const policy = (await scope(secondary, primary.serviceId)).policy;
    expect(cardholderRole(policy)).toBe("CARDHOLDER");
    expect(canReadCardholderData(policy, primary.personId,"ACCEPTED")).toBe(false);
    expect(canReadCardholderData(policy, secondary,"ACCEPTED")).toBe(true);
    for (const action of ["people.read", "people.invite", "cards.create", "cards.request", "cards.manageMembers"]) expect(evaluate(policy, action).allowed).toBe(false);
    expect(await listServicesForPerson(secondary)).toMatchObject([{ id: primary.serviceId, cardholderRole: "CARDHOLDER" }]);
    expect(await getDb().select().from(services).where(eq(services.primaryPersonId, secondary))).toEqual([]);
  });

  it.each(["SUSPENDED", "CLOSED", "PRIMARY_REVOKED"] as const)("fails closed for every secondary when %s without inferring a replacement", async state => {
    const primary = await cardPrimary(), secondary = await cardPerson("Secondary");
    await enrollCardholder(primary.personId, primary.serviceId, secondary);
    if (state === "PRIMARY_REVOKED") await getDb().update(serviceMembers).set({ state: "REVOKED", version: 2 }).where(and(eq(serviceMembers.serviceId, primary.serviceId), eq(serviceMembers.personId, primary.personId)));
    else await getDb().update(services).set({ status: state, version: 2 }).where(eq(services.id, primary.serviceId));
    await expect(scope(secondary, primary.serviceId)).rejects.toMatchObject({ status: 404 });
    expect(await listServicesForPerson(secondary)).toEqual([]);
    expect((await getDb().select().from(services).where(eq(services.id, primary.serviceId)))[0]!.primaryPersonId).toBe(primary.personId);
  });
});

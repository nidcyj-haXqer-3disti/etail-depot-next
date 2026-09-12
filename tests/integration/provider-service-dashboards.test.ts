import {fundCardGroup} from "../helpers/cardholder";
import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import targets from "../../project-targets.json" with { type: "json" };
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { cards, cardRequests, identityBindings, people, permissionGrants, serviceMembers, services } from "../../src/platform/database/schema";
import { sessionRepository } from "../../src/platform/database/session-repository";
import { bindIdentity, createCardholderService } from "../../src/modules/services/service";
import { createPrimaryMerchant } from "../../src/modules/services/create-merchant";
import { merchantSetupEligibility } from "../../src/modules/services/schema";
import { signInWithPassword } from "../../src/modules/identity/password-login";
import { withPasswordAuthentication } from "../../src/modules/identity/password-boundary";
import { SessionService } from "../../src/modules/identity/session";
import { getCardholderDashboard, getCardholderDashboardDetail, getCardholderDashboardFocus } from "../../src/modules/workspace/dashboard-service";
import { getWorkspace, startCardRequest } from "../../src/modules/workspace/service";
import { getMerchantDashboard } from "../../src/modules/acquiring/dashboard-service";
import { getMerchantWorkspace } from "../../src/modules/acquiring/service";
import { listInvitationsForPerson } from "../../src/modules/access/service";
import { terminalAssignments } from "../../src/modules/access/schema";
import { hasOperatorAccess } from "../../src/modules/operations/service";
import { operatorServiceAccess } from "../../src/modules/operations/schema";
import { ledgerEntries } from "../../src/modules/ledger/schema";
import { cardPrimary, issuePracticeCard } from "../helpers/cardholder";
import { acquiringFixture } from "../helpers/acquiring";

const issuer = `${targets.netlify.canonical_origin}/.netlify/identity`;
afterEach(() => vi.unstubAllEnvs());
afterAll(closeDatabase);

function hostedRuntime() {
  // The connection has already been opened by the isolated native test runner.
  // Only runtime policy changes; no hosted database or Identity request is made.
  vi.stubEnv("APP_ENV", "production");
  vi.stubEnv("SITE_ID", targets.netlify.site_id);
  vi.stubEnv("ETAIL_PUBLIC_ORIGIN", targets.netlify.canonical_origin);
  vi.stubEnv("ENABLE_LOCAL_FIXTURE_IDENTITY", "false");
  vi.stubEnv("ENABLE_REAL_MONEY", "false");
}

async function expectNoEnrollment(personId: string) {
  expect(await getDb().select().from(services).where(eq(services.primaryPersonId, personId))).toEqual([]);
  expect(await getDb().select().from(serviceMembers).where(eq(serviceMembers.personId, personId))).toEqual([]);
  expect(await getDb().select().from(permissionGrants).where(eq(permissionGrants.personId, personId))).toEqual([]);
  expect(await getDb().select().from(terminalAssignments).where(eq(terminalAssignments.personId, personId))).toEqual([]);
  expect(await getDb().select().from(operatorServiceAccess).where(eq(operatorServiceAccess.personId, personId))).toEqual([]);
  expect(await getDb().select().from(merchantSetupEligibility).where(eq(merchantSetupEligibility.personId, personId))).toEqual([]);
  expect(await getDb().select().from(cards).where(eq(cards.holderId, personId))).toEqual([]);
  expect(await getDb().select().from(cardRequests).where(eq(cardRequests.holderId, personId))).toEqual([]);
}

describe("verified-provider service dashboard reads", () => {
  it("opens both dashboards and the inbox after first password sign-in without enrolling or granting anything", async () => {
    getDb();
    hostedRuntime();
    const sessions = new SessionService(sessionRepository, { appEnv: "production", publicOrigin: targets.netlify.canonical_origin });
    const subject = randomUUID();
    const provider = {
      passwordLoginAvailability: vi.fn(async () => ({ available: true, reason: "AVAILABLE" as const })),
      verifyPassword: vi.fn(async () => ({ issuer, subject, providerConfirmed: true as const })),
    };
    const cookie = await withPasswordAuthentication(() => signInWithPassword(`synthetic-${subject}@example.test`, "synthetic-provider-verified", null, {
      provider, limiter: { consume: async () => undefined }, bind: bindIdentity, sessions,
    }));
    const header = cookie.split(";", 1)[0]!;
    try {
      const session = await sessions.authenticate(header);
      expect(session).not.toBeNull();
      const personId = session!.personId;
      expect(await getCardholderDashboard(personId)).toMatchObject({ person: { id: personId }, canCreatePrimary: false, profiles: [], primaryService: null, cards: [], cardCount: 0, activity: [], requests: [], cardsHasMore: false });
      expect(await getCardholderDashboardDetail(personId, {})).toBeNull();
      const merchant = await getMerchantDashboard(personId);
      expect(merchant).toMatchObject({ canCreateMerchant: false, merchants: [], moneyAccounts: [], units: [] });
      expect(merchant.views.every(view => view.payments.length === 0 && view.transfers.length === 0)).toBe(true);
      expect(await listInvitationsForPerson(personId)).toEqual([]);
      expect(await hasOperatorAccess(personId)).toBe(false);
      expect(await getDb().select().from(identityBindings).where(and(eq(identityBindings.personId, personId), eq(identityBindings.issuer, "urn:etail:isolated-fixture")))).toEqual([]);
      await expectNoEnrollment(personId);
    } finally {
      await sessions.logout(header);
    }
    expect(await sessions.authenticate(header)).toBeNull();
  });

  it("rejects unknown, unbound, wrong-provider and fixture identities in hosted dashboard reads", async () => {
    const fixture = await bindIdentity("urn:etail:isolated-fixture", randomUUID());
    const wrongProvider = await bindIdentity("https://unrelated.example.test/.netlify/identity", randomUUID());
    const [unbound] = await getDb().insert(people).values({ displayName: "Unbound synthetic person" }).returning();
    hostedRuntime();
    for (const personId of [randomUUID(), unbound!.id, wrongProvider.personId, fixture.personId]) {
      await expect(getCardholderDashboard(personId)).rejects.toMatchObject({ status: 404 });
      await expect(getMerchantDashboard(personId)).rejects.toMatchObject({ status: 404 });
      await expect(listInvitationsForPerson(personId)).rejects.toMatchObject({ status: 404 });
    }
  });

  it("keeps another person's cards, merchants and commands unavailable to the new provider member", async () => {
    const primary = await cardPrimary("Protected synthetic cardholder");
    const issued = await (async()=>{await fundCardGroup(primary.personId,primary.serviceId,"1000");return issuePracticeCard(primary.personId, primary.serviceId, primary.personId, "Protected synthetic card", undefined, "1000");})();
    const merchant = await acquiringFixture();
    const member = await bindIdentity(issuer, randomUUID());
    const serviceIds = [primary.serviceId, merchant.serviceId];
    const protectedRecords = async () => ({
      services: await getDb().select().from(services).where(inArray(services.id, serviceIds)).orderBy(services.id),
      cards: await getDb().select().from(cards).where(inArray(cards.serviceId, serviceIds)).orderBy(cards.id),
      requests: await getDb().select().from(cardRequests).where(inArray(cardRequests.serviceId, serviceIds)).orderBy(cardRequests.id),
      ledger: await getDb().select().from(ledgerEntries).where(inArray(ledgerEntries.serviceId, serviceIds)).orderBy(ledgerEntries.id),
    });
    const before = await protectedRecords();
    hostedRuntime();
    await expect(getCardholderDashboardFocus(member.personId, issued.card.id)).rejects.toMatchObject({ status: 404 });
    await expect(getCardholderDashboardDetail(member.personId, { card: issued.card.id })).rejects.toMatchObject({ status: 404 });
    await expect(getWorkspace(member.personId, primary.serviceId)).rejects.toMatchObject({ status: 404 });
    await expect(getMerchantWorkspace(member.personId, merchant.merchantId)).rejects.toMatchObject({ status: 404 });
    await expect(createCardholderService(member.personId, { commandId: randomUUID() })).rejects.toMatchObject({ status: 403, code: "SANDBOX_START_REQUIRED" });
    await expect(createPrimaryMerchant(member.personId, { commandId: randomUUID(), displayName: "Forbidden synthetic enrollment" })).rejects.toMatchObject({ status: 403, code: "SANDBOX_START_REQUIRED" });
    await expect(startCardRequest(member.personId, primary.serviceId, { commandId: randomUUID() })).rejects.toMatchObject({ status: 404 });
    await expectNoEnrollment(member.personId);
    expect(await protectedRecords()).toEqual(before);
  });
});

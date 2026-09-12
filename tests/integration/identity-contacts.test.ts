import { createHash, randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { bindIdentity, listServicesForPerson } from "../../src/modules/services/service";
import { SessionService } from "../../src/modules/identity/session";
import { sessionRepository } from "../../src/platform/database/session-repository";
import { getDb } from "../../src/platform/database/client";
import { getVerifiedEmails, type ProviderContactObservation } from "../../src/modules/identity/contact-service";
import { identityContinuations, identityVerifiedEmails } from "../../src/modules/identity/contact-schema";
import { sessions } from "../../src/platform/database/schema";
import { resolveAuthNextPath, saveInvitationContinuation } from "../../src/modules/identity/continuation";

const sessionService = () => new SessionService(sessionRepository, { appEnv: "test", publicOrigin: "http://127.0.0.1:3100" });
const emails = (personId: string) => getDb().transaction(tx => getVerifiedEmails(tx, personId));
function contact(subject: string, email: string): ProviderContactObservation {
  return { issuer: "https://contact-provider.example.test/.netlify/identity", subject, verifiedEmail: { emailNormalized: email, provenance: "NETLIFY_USER_CONFIRMED", verifiedAt: new Date(Date.now()-1000).toISOString() } };
}
describe("trusted invitation contacts", () => {
  it("persists the verified contact with its identity/session without merging people or granting a service", async () => {
    const subject = randomUUID(), proof = contact(subject, `recipient-${randomUUID()}@example.test`);
    const identity = await bindIdentity(proof.issuer, subject), other = await bindIdentity(proof.issuer, randomUUID());
    const service = sessionService(), issued = await service.issue(identity, proof);
    expect(await emails(identity.personId)).toEqual([proof.verifiedEmail!.emailNormalized]);
    expect(await emails(other.personId)).toEqual([]);
    expect(await listServicesForPerson(identity.personId)).toEqual([]);
    expect(await service.authenticate(issued.cookie.split(";")[0]!)).toMatchObject(identity);
    const [stored] = await getDb().select().from(identityVerifiedEmails).where(eq(identityVerifiedEmails.identityId, identity.identityId));
    expect(stored).toMatchObject({ emailNormalized: proof.verifiedEmail!.emailNormalized, provenance: "NETLIFY_USER_CONFIRMED", verifiedAt: new Date(proof.verifiedEmail!.verifiedAt) });
    expect(stored!.observedAt.getTime()).toBeGreaterThanOrEqual(stored!.verifiedAt.getTime());
    await service.logout(issued.cookie.split(";")[0]!);
  });
  it("clears obsolete contact proof on a later verified login lacking email proof without refusing the session", async () => {
    const subject=randomUUID(), proof=contact(subject, `old-${randomUUID()}@example.test`), identity=await bindIdentity(proof.issuer,subject), service=sessionService();
    const old = await service.issue(identity,proof);
    const next=await service.issue(identity,{issuer:proof.issuer,subject});
    expect(await emails(identity.personId)).toEqual([]);
    expect(await service.authenticate(next.cookie.split(";")[0]!)).toMatchObject(identity);
    expect(await service.authenticate(old.cookie.split(";")[0]!)).toMatchObject(identity);
    await service.logout(old.cookie.split(";")[0]!);await service.logout(next.cookie.split(";")[0]!);
  });
  it("replaces a changed current provider email and never retains the previous address as claim authority", async () => {
    const subject=randomUUID(), proof=contact(subject,`first-${randomUUID()}@example.test`), identity=await bindIdentity(proof.issuer,subject), service=sessionService();
    const old=await service.issue(identity,proof), changed=contact(subject,`second-${randomUUID()}@example.test`), next=await service.issue(identity,changed);
    expect(await emails(identity.personId)).toEqual([changed.verifiedEmail!.emailNormalized]);
    expect(await emails(identity.personId)).not.toContain(proof.verifiedEmail!.emailNormalized);
    await service.logout(old.cookie.split(";")[0]!);await service.logout(next.cookie.split(";")[0]!);
  });
  it("rolls back both session and contact when proof belongs to a different provider subject", async () => {
    const subject=randomUUID(), proof=contact(subject,`wrong-${randomUUID()}@example.test`), identity=await bindIdentity(proof.issuer,subject);
    await expect(sessionService().issue(identity,{...proof,subject:randomUUID()})).rejects.toMatchObject({code:"INVALID_VERIFIED_CONTACT"});
    expect(await emails(identity.personId)).toEqual([]);
    expect(await getDb().select().from(sessions).where(eq(sessions.identityId,identity.identityId))).toEqual([]);
  });
  it("rejects malformed or future contact proof before session insertion", async () => {
    const subject=randomUUID(), proof=contact(subject,`valid-${randomUUID()}@example.test`), identity=await bindIdentity(proof.issuer,subject);
    for(const verifiedEmail of [{...proof.verifiedEmail!,emailNormalized:"not-an-email"},{...proof.verifiedEmail!,verifiedAt:new Date(Date.now()+86_400_000).toISOString()}]) {
      await expect(sessionService().issue(identity,{...proof,verifiedEmail})).rejects.toMatchObject({code:"INVALID_VERIFIED_CONTACT"});
    }
    expect(await getDb().select().from(sessions).where(eq(sessions.identityId,identity.identityId))).toEqual([]);
  });
});
describe("server-owned invitation continuation", () => {
  it("survives an email callback with only a hashed navigation cookie and grants no identity", async () => {
    const id=randomUUID(), cookie=await saveInvitationContinuation(`/invitations/${id}`);
    expect(cookie).toMatch(/^etail_continue=[A-Za-z0-9_-]{43}; Path=\/; HttpOnly; SameSite=Lax; Max-Age=86400$/);
    const header=cookie!.split(";")[0]!, token=header.split("=")[1]!, tokenHash=createHash("sha256").update(token).digest("hex");
    expect(await resolveAuthNextPath(undefined,header)).toBe(`/invitations/${id}`);
    expect(await resolveAuthNextPath("https://foreign.example",header)).toBe("/services");
    expect(await resolveAuthNextPath(undefined,`${header}; ${header}`)).toBe("/services");
    expect(await resolveAuthNextPath(undefined,`etail_continue=${"a".repeat(43)}`)).toBe("/services");
    expect(await sessionService().authenticate(header)).toBeNull();
    const [row]=await getDb().select().from(identityContinuations).where(and(eq(identityContinuations.tokenHash,tokenHash),eq(identityContinuations.invitationId,id)));
    expect(row).toBeDefined();expect(JSON.stringify(row)).not.toContain(token);
    expect(await saveInvitationContinuation("https://foreign.example")).toBeNull();
  });
});

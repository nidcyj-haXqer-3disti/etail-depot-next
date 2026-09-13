import { describe, expect, it } from "vitest";
import { authNextPath, invitationIdFromNextPath } from "../../src/shared/auth-continuation";
import { normalizeVerifiedEmail } from "../../src/shared/verified-email";
import { registrationSchema, recoveryRequestSchema } from "../../src/modules/identity/email-contracts";
const id = "c735520b-1225-41c9-a2b4-a27705b67c45";
describe("invitation navigation is a locator only", () => {
  it("allows only exact invitation, checkout and services destinations", () => {
    for (const path of ["/services", `/invitations/${id}`, `/checkout/${id}/card`, `/checkout/${id}/card?review=${id}`]) expect(authNextPath(path)).toBe(path);
    expect(invitationIdFromNextPath(`/invitations/${id.toUpperCase()}`)).toBe(id);
  });
  it.each([undefined, null, ["/services"], "https://foreign.example/invitations/" + id, "//foreign.example", `/invitations/${id}?next=https://foreign.example`, `/invitations/${id}#confirmation_token=secret`, `/invitations/${id}/`, `/invitations/%63${id.slice(1)}`, `/invitations/${"-".repeat(36)}`, `/checkout/${id}/card?review=${id}&extra=1`, "/\\foreign.example", "/services\n"])("rejects unsafe, malformed or widened destinations %#", value => {
    expect(authNextPath(value)).toBeNull(); expect(invitationIdFromNextPath(value)).toBeNull();
  });
  it("permits invitation continuation without permitting authority fields or arbitrary provider redirects", () => {
    const base = { email: "person@example.test", password: "long synthetic password" };
    expect(registrationSchema.safeParse({ ...base, nextPath: `/invitations/${id}` }).success).toBe(true);
    expect(recoveryRequestSchema.safeParse({ email: base.email, nextPath: `/invitations/${id}` }).success).toBe(true);
    for (const nextPath of ["https://foreign.example", "/services", `/invitations/${id}?recipient=other`]) expect(registrationSchema.safeParse({ ...base, nextPath }).success).toBe(false);
    expect(registrationSchema.safeParse({ ...base, nextPath: `/invitations/${id}`, verifiedEmail: base.email }).success).toBe(false);
  });
  it("retains an exact Cardholder support case or supported new-question topic after sign-in", () => {
    const cardId = "713af722-e340-471f-b832-937b260a36cc";
    const exact = `/cardholder-services/cards/${cardId}/help?case=${id}`;
    expect(authNextPath(exact)).toBe(exact);
    expect(authNextPath(`/cardholder-services/help?focus=${cardId}&case=${id}`)).toBe(exact);
    for (const topic of ["SERVICE", "ACCESS", "CARD", "TRANSACTION"]) {
      const next = `/cardholder-services/cards/${cardId}/help?new=1&topic=${topic}`;
      expect(authNextPath(next)).toBe(next);
    }
    const accountQuestion = `/cardholder-services/help?context=${id}&topic=SERVICE`;
    expect(authNextPath(accountQuestion)).toBe(accountQuestion);
    for (const nextPath of [exact, accountQuestion]) {
      expect(registrationSchema.safeParse({email:"person@example.test",password:"long synthetic password",nextPath}).success).toBe(false);
      expect(recoveryRequestSchema.safeParse({email:"person@example.test",nextPath}).success).toBe(false);
    }
  });
  it.each([
    `/cardholder-services/help?case=not-a-case`,
    `/cardholder-services/help?case=${id}&case=${id}`,
    "/cardholder-services/help?topic=PAYMENT",
    "/cardholder-services/help?topic=ADMIN",
    "/cardholder-services/help?topic=SERVICE&topic=CARD",
    `/cardholder-services/cards/${id}/activity?case=${id}`,
    `/cardholder-services/cards/${id}?topic=CARD`,
    `/cardholder-services/help?case=${id}&role=OWNER`,
    `/cardholder-services/help?case=${id}&returnTo=https%3A%2F%2Fforeign.example`,
  ])("rejects malformed or widened Cardholder support continuation %#", nextPath => {
    expect(authNextPath(nextPath)).toBeNull();
  });
});
describe("verified email matching normalization", () => {
  it("normalizes case and boundary whitespace but retains exact local-part aliases", () => {
    expect(normalizeVerifiedEmail(" Person.Name+Card@Example.TEST ")).toBe("person.name+card@example.test");
    expect(normalizeVerifiedEmail("personname@example.test")).not.toBe(normalizeVerifiedEmail("person.name@example.test"));
  });
  it.each([null, undefined, "", "invalid", "person@example.test\nother@example.test", "a".repeat(255)+"@example.test"])("rejects invalid contact input %#", value => expect(normalizeVerifiedEmail(value)).toBeNull());
});

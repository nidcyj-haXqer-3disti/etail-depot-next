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
});
describe("verified email matching normalization", () => {
  it("normalizes case and boundary whitespace but retains exact local-part aliases", () => {
    expect(normalizeVerifiedEmail(" Person.Name+Card@Example.TEST ")).toBe("person.name+card@example.test");
    expect(normalizeVerifiedEmail("personname@example.test")).not.toBe(normalizeVerifiedEmail("person.name@example.test"));
  });
  it.each([null, undefined, "", "invalid", "person@example.test\nother@example.test", "a".repeat(255)+"@example.test"])("rejects invalid contact input %#", value => expect(normalizeVerifiedEmail(value)).toBeNull());
});

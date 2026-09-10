import { describe, expect, it } from "vitest";
import { validateLocalDatabaseTarget } from "../../src/platform/database/local-target";

const local = "postgres://etail_local@127.0.0.1:55439/etail_depot_next_services_test";
const ci = "postgresql://etail_ci@127.0.0.1:5432/etail_depot_next_services_test";

describe("isolated database targets", () => {
  it("accepts the exact local cluster and its test database", () => {
    expect(validateLocalDatabaseTarget(local, { ci: false })).toBe(local);
    expect(() => validateLocalDatabaseTarget("postgres://etail_local@127.0.0.1:55439/etail_depot_next_test", {ci:false})).toThrow("ISOLATED_DATABASE_REQUIRED");
    expect(validateLocalDatabaseTarget(local.replace("_test","_preview"), {ci:false})).toBe(local.replace("_test","_preview"));
    expect(() => validateLocalDatabaseTarget(`${local}_preview_v3`, { ci: false })).toThrow("ISOLATED_DATABASE_REQUIRED");
    expect(() => validateLocalDatabaseTarget(`${local}_preview_v2`, { ci: true })).toThrow("ISOLATED_DATABASE_REQUIRED");
    expect(validateLocalDatabaseTarget(local.replace("127.0.0.1", "[::1]"), { ci: false })).toContain("[::1]:55439");
  });

  it("requires an explicit local database", () => {
    expect(() => validateLocalDatabaseTarget(undefined, { ci: false })).toThrow("LOCAL_DATABASE_REQUIRED");
  });

  it.each([
    ["host override", `${local}?host=unrelated.example`],
    ["user override", `${local}?user=postgres`],
    ["certificate file option", `${local}?sslcert=/private/certificate.pem`],
    ["socket host option", `${local}?host=%2Ftmp`],
    ["empty query", `${local}?`],
    ["fragment", `${local}#ignored`],
    ["empty fragment", `${local}#`],
    ["encoded database name", local.replace("etail_depot_next", "etail%5Fdepot_next")],
    ["normalized dot path", local.replace("/etail_depot_next", "/unrelated/../etail_depot_next")],
    ["encoded host", local.replace("127.0.0.1", "127%2e0%2e0%2e1")],
    ["shorthand host", local.replace("127.0.0.1", "127.1")],
    ["remote host", local.replace("127.0.0.1", "example.invalid")],
    ["other protocol", local.replace("postgres:", "https:")],
    ["other port", local.replace(":55439", ":5432")],
    ["other role", local.replace("etail_local@", "postgres@")],
    ["missing role", local.replace("etail_local@", "")],
    ["local password", local.replace("etail_local@", "etail_local:local-fixture@")],
    ["unrelated database", local.replace("etail_depot_next", "unrelated")],
    ["leading whitespace", ` ${local}`],
    ["embedded newline", local.replace("127.0.0.1", "127.0.\n0.1")],
    ["invalid URL", "not-a-url"],
  ])("rejects %s before any connection", (_label, value) => {
    expect(() => validateLocalDatabaseTarget(value, { ci: false })).toThrow("ISOLATED_DATABASE_REQUIRED");
  });

  it("accepts the explicit CI service with optional ephemeral authentication", () => {
    expect(validateLocalDatabaseTarget(ci, { ci: true })).toBe(ci);
    const authenticated = ci.replace("etail_ci@", "etail_ci:ephemeral-ci-fixture@");
    expect(validateLocalDatabaseTarget(authenticated, { ci: true })).toBe(authenticated);
    expect(validateLocalDatabaseTarget(ci.replace(":5432", ":55440"), { ci: true })).toContain(":55440/");
  });

  it.each([
    ["non-test database", ci.replace("_test", "")],
    ["other role", ci.replace("etail_ci@", "postgres@")],
    ["remote client endpoint", ci.replace("127.0.0.1", "172.17.0.2")],
    ["query override", `${ci}?host=example.invalid`],
    ["zero port", ci.replace(":5432", ":0")],
  ])("rejects CI %s", (_label, value) => {
    expect(() => validateLocalDatabaseTarget(value, { ci: true })).toThrow("ISOLATED_DATABASE_REQUIRED");
  });
});

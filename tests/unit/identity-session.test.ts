import { describe, expect, it } from "vitest";
import { SessionService, type SessionRecord, type SessionRepository } from "../../src/modules/identity/session";

class MemorySessions implements SessionRepository {
  records = new Map<string, SessionRecord>();
  async insert(record: SessionRecord) { this.records.set(record.tokenHash, { ...record }); }
  async findByTokenHash(hash: string) { return this.records.get(hash) ?? null; }
  async revokeByTokenHash(hash: string, at: Date) {
    const previous = this.records.get(hash);
    if (previous) {
      for (const record of this.records.values()) {
        if (record.identityId === previous.identityId && record.familyId === previous.familyId && !record.revokedAt) record.revokedAt = at;
      }
    }
  }
  async revokeByIdentity(identityId: string, at: Date) {
    for (const record of this.records.values()) if (record.identityId === identityId) record.revokedAt = at;
  }
  async rotate(oldHash: string, record: SessionRecord, at: Date) {
    const previous = this.records.get(oldHash);
    if (!previous || previous.revokedAt || previous.expiresAt <= at) return false;
    previous.revokedAt = at;
    this.records.set(record.tokenHash, { ...record });
    return true;
  }
}

const identity = { identityId: "identity-alice", personId: "person-alice" };
const cookieHeader = (value: string) => value.split(";")[0]!;

function setup(https = true) {
  const repository = new MemorySessions();
  let now = new Date("2026-09-08T00:00:00Z");
  const service = new SessionService(repository, {
    appEnv: https ? "preview" : "test",
    publicOrigin: https ? "https://fresh-sandbox.example.test" : "http://127.0.0.1:3000",
    ttlSeconds: 3_600,
  }, () => now);
  return { repository, service, advance(seconds: number) { now = new Date(now.getTime() + seconds * 1_000); } };
}

describe("opaque application sessions", () => {
  it("only exposes the opaque credential in a secure host-only HttpOnly cookie", async () => {
    const { service, repository } = setup();
    const issued = await service.issue(identity);
    expect(issued.cookie).toMatch(/^__Host-etail_session=[A-Za-z0-9_-]{43}; Path=\/; HttpOnly; SameSite=Strict; Max-Age=3600; Secure$/);
    expect(issued.cookie).not.toContain("Domain=");
    const token = cookieHeader(issued.cookie).split("=")[1]!;
    expect(JSON.stringify([...repository.records.values()])).not.toContain(token);
    expect(issued.record.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect((await service.authenticate(cookieHeader(issued.cookie)))?.personId).toBe("person-alice");
  });

  it("issues unpredictable independent credentials for the same identity", async () => {
    const { service } = setup();
    const first = await service.issue(identity);
    const second = await service.issue(identity);
    expect(first.cookie).not.toBe(second.cookie);
    expect(first.record.tokenHash).not.toBe(second.record.tokenHash);
    expect(first.record.familyId).not.toBe(second.record.familyId);
  });

  it("rejects forged, malformed, missing, duplicate and expired credentials", async () => {
    const { service, advance } = setup();
    const issued = await service.issue(identity);
    const valid = cookieHeader(issued.cookie);
    for (const invalid of [null, "", "__Host-etail_session=bad", `__Host-etail_session=${"A".repeat(43)}`, `${valid}; ${valid}`]) {
      expect(await service.authenticate(invalid)).toBeNull();
    }
    advance(3_600);
    expect(await service.authenticate(valid)).toBeNull();
  });

  it("revokes logout in the repository before clearing the cookie", async () => {
    const { service } = setup();
    const issued = await service.issue(identity);
    const cookie = cookieHeader(issued.cookie);
    expect(await service.logout(cookie)).toBe("__Host-etail_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure");
    expect(await service.authenticate(cookie)).toBeNull();
  });

  it("rejects future-issued sessions", async () => {
    const { service, advance } = setup();
    const issued = await service.issue(identity);
    advance(-1);
    expect(await service.authenticate(cookieHeader(issued.cookie))).toBeNull();
  });

  it("rotates once atomically and preserves the original authentication expiry", async () => {
    const { service, advance } = setup();
    const issued = await service.issue(identity);
    const old = cookieHeader(issued.cookie);
    advance(600);
    const results = await Promise.all([service.rotate(old), service.rotate(old)]);
    const successes = results.filter((result) => result !== null);
    expect(successes).toHaveLength(1);
    const rotated = successes[0]!;
    expect(rotated.cookie).toContain("Max-Age=3000");
    expect(rotated.record.expiresAt).toEqual(issued.record.expiresAt);
    expect(rotated.record.issuedAt).toEqual(issued.record.issuedAt);
    expect(rotated.record.familyId).toBe(issued.record.familyId);
    expect(await service.authenticate(old)).toBeNull();
    expect(await service.authenticate(cookieHeader(rotated.cookie))).not.toBeNull();
  });

  it("revokes all sessions of one identity without touching another", async () => {
    const { service } = setup();
    const a = await service.issue(identity);
    const b = await service.issue(identity);
    const c = await service.issue({ identityId: "identity-bob", personId: "person-bob" });
    await service.revokeIdentity(identity.identityId);
    expect(await service.authenticate(cookieHeader(a.cookie))).toBeNull();
    expect(await service.authenticate(cookieHeader(b.cookie))).toBeNull();
    expect((await service.authenticate(cookieHeader(c.cookie)))?.personId).toBe("person-bob");
  });

  it("old-cookie logout revokes its rotated replacements without signing out another device", async () => {
    const { service } = setup();
    const original = await service.issue(identity);
    const otherDevice = await service.issue(identity);
    const firstRotation = await service.rotate(cookieHeader(original.cookie));
    const secondRotation = await service.rotate(cookieHeader(firstRotation!.cookie));
    await service.logout(cookieHeader(original.cookie));
    expect(await service.authenticate(cookieHeader(secondRotation!.cookie))).toBeNull();
    expect(await service.authenticate(cookieHeader(otherDevice.cookie))).not.toBeNull();
  });

  it("uses an unprefixed cookie only for an explicitly isolated HTTP origin", async () => {
    const { service } = setup(false);
    const issued = await service.issue(identity);
    expect(issued.cookie).toMatch(/^etail_session=/);
    expect(issued.cookie).not.toContain("; Secure");
    expect(issued.cookie).toContain("HttpOnly");
  });

  it("refuses unbounded expiry configuration", () => {
    expect(() => new SessionService(new MemorySessions(), {
      appEnv: "production", publicOrigin: "https://fresh.example.test", ttlSeconds: 28_801,
    })).toThrow("INVALID_SESSION_TTL");
  });
});

import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { ProviderContactObservation } from "./contact-service";
import {
  assertTrustedOrigin,
  SecurityError,
  type AppEnvironment,
} from "../../platform/security/origin";

export interface SessionRecord {
  tokenHash: string;
  identityId: string;
  personId: string;
  familyId: string;
  issuedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface SessionRepository {
  insert(record: SessionRecord, contact?: ProviderContactObservation): Promise<void>;
  findByTokenHash(hash: string): Promise<SessionRecord | null>;
  /** Revoke this browser session's entire rotation family, including replacements. */
  revokeByTokenHash(hash: string, at: Date): Promise<void>;
  revokeByIdentity(identityId: string, at: Date): Promise<void>;
  /** Atomically revoke the live old session and insert its replacement, or do neither. */
  rotate(oldHash: string, newRecord: SessionRecord, at: Date): Promise<boolean>;
}

interface SessionOptions {
  publicOrigin: string;
  appEnv: AppEnvironment;
  ttlSeconds?: number;
}

interface IssuedSession {
  record: SessionRecord;
  /** Only use as a Set-Cookie response header. Never serialize into a response body. */
  cookie: string;
}

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const DEFAULT_TTL_SECONDS = 60 * 60 * 8;

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** One session owner: opaque browser cookie, hashed credential in PostgreSQL. */
export class SessionService {
  readonly cookieName: string;
  private readonly secure: boolean;
  private readonly ttlSeconds: number;

  constructor(
    private readonly repository: SessionRepository,
    options: SessionOptions,
    private readonly clock: () => Date = () => new Date(),
  ) {
    const origin = assertTrustedOrigin(options.publicOrigin, options.appEnv);
    this.secure = origin.startsWith("https:");
    this.cookieName = this.secure ? "__Host-etail_session" : "etail_session";
    this.ttlSeconds = options.ttlSeconds ?? DEFAULT_TTL_SECONDS;
    if (!Number.isInteger(this.ttlSeconds) || this.ttlSeconds < 60 || this.ttlSeconds > DEFAULT_TTL_SECONDS) {
      throw new SecurityError("INVALID_SESSION_TTL", 503);
    }
  }

  private tokenFromCookie(cookieHeader: string | null): string | null {
    if (!cookieHeader || cookieHeader.length > 16_384) return null;
    const matches = cookieHeader.split(";").map((part) => part.trim()).filter((part) => {
      const equals = part.indexOf("=");
      return equals !== -1 && part.slice(0, equals) === this.cookieName;
    });
    // Duplicate cookies can signal path/domain shadowing; fail closed.
    if (matches.length !== 1) return null;
    const token = matches[0]!.slice(this.cookieName.length + 1);
    return TOKEN_PATTERN.test(token) ? token : null;
  }

  private cookie(token: string, maxAge: number): string {
    return `${this.cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${this.secure ? "; Secure" : ""}`;
  }

  private makeSession(identity: Pick<SessionRecord, "identityId" | "personId">, now: Date) {
    if (!identity.identityId || !identity.personId) throw new SecurityError("INVALID_SESSION_IDENTITY", 500);
    const token = randomBytes(32).toString("base64url");
    const record: SessionRecord = {
      identityId: identity.identityId,
      personId: identity.personId,
      familyId: randomUUID(),
      tokenHash: hashSessionToken(token),
      issuedAt: now,
      expiresAt: new Date(now.getTime() + this.ttlSeconds * 1_000),
      revokedAt: null,
    };
    return { token, record };
  }

  /** Call only after provider verification and application identity binding. */
  async issue(identity: Pick<SessionRecord, "identityId" | "personId">, contact?: ProviderContactObservation): Promise<IssuedSession> {
    const { token, record } = this.makeSession(identity, this.clock());
    await this.repository.insert(record, contact);
    return { record, cookie: this.cookie(token, this.ttlSeconds) };
  }

  async authenticate(cookieHeader: string | null): Promise<SessionRecord | null> {
    const token = this.tokenFromCookie(cookieHeader);
    if (!token) return null;
    const record = await this.repository.findByTokenHash(hashSessionToken(token));
    const now = this.clock().getTime();
    if (
      !record || record.revokedAt ||
      record.expiresAt.getTime() <= now || record.issuedAt.getTime() > now
    ) return null;
    return record;
  }

  async rotate(cookieHeader: string | null): Promise<IssuedSession | null> {
    const previous = await this.authenticate(cookieHeader);
    if (!previous) return null;
    const now = this.clock();
    const { token, record } = this.makeSession(
      { identityId: previous.identityId, personId: previous.personId }, now,
    );
    // Rotation alone is not reauthentication and must not extend the session.
    record.issuedAt = previous.issuedAt;
    record.expiresAt = previous.expiresAt;
    record.familyId = previous.familyId;
    if (!await this.repository.rotate(previous.tokenHash, record, now)) return null;
    const remainingSeconds = Math.floor((record.expiresAt.getTime() - now.getTime()) / 1_000);
    return { record, cookie: this.cookie(token, remainingSeconds) };
  }

  async logout(cookieHeader: string | null): Promise<string> {
    const token = this.tokenFromCookie(cookieHeader);
    if (token) await this.repository.revokeByTokenHash(hashSessionToken(token), this.clock());
    return this.cookie("", 0);
  }

  async revokeIdentity(identityId: string): Promise<void> {
    await this.repository.revokeByIdentity(identityId, this.clock());
  }
}

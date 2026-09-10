import type { SessionRecord } from "./session";
import { revokeSessionsSchema } from "./security-contracts";
import { sessionSecurityRepository } from "../../platform/database/session-repository";
import { SecurityError } from "../../platform/security/origin";

export function getActiveSessions(session: SessionRecord) { return sessionSecurityRepository.list(session); }
export function revokeSelectedSessions(session: SessionRecord, raw: unknown) {
  const parsed = revokeSessionsSchema.safeParse(raw);
  if (!parsed.success || new Set(parsed.data.familyIds).size !== parsed.data.familyIds.length) throw new SecurityError("INVALID_REQUEST", 422);
  return sessionSecurityRepository.revoke(session, parsed.data.familyIds);
}

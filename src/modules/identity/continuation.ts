import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { getDb } from "../../platform/database/client";
import { getRuntimeConfig } from "../../platform/config";
import { authNextPath, invitationIdFromNextPath } from "../../shared/auth-continuation";
import { identityContinuations } from "./contact-schema";

function cookieName() { return getRuntimeConfig().publicOrigin.startsWith("https:") ? "__Host-etail_continue" : "etail_continue"; }
function tokenFromCookie(header: string | null): string | null {
  if (!header || header.length > 16_384) return null;
  const values = header.split(";").map(part => part.trim()).filter(part => part.startsWith(`${cookieName()}=`));
  const token = values[0]?.slice(values[0].indexOf("=") + 1);
  return values.length === 1 && token && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null;
}
const hash = (token: string) => createHash("sha256").update(token).digest("hex");
/** Called only inside the existing same-origin registration/recovery HTTP boundary. */
export async function saveInvitationContinuation(nextPath: unknown): Promise<string | null> {
  const invitationId = invitationIdFromNextPath(nextPath);
  if (!invitationId) return null;
  const token = randomBytes(32).toString("base64url"), createdAt = new Date(), expiresAt = new Date(createdAt.getTime() + 86_400_000);
  await getDb().transaction(async tx => {
    await tx.delete(identityContinuations).where(lt(identityContinuations.expiresAt, createdAt));
    await tx.insert(identityContinuations).values({ tokenHash: hash(token), invitationId, createdAt, expiresAt });
  });
  return `${cookieName()}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${getRuntimeConfig().publicOrigin.startsWith("https:") ? "; Secure" : ""}`;
}
/** Navigation survives the provider's root email callback; it confers no service access. */
export async function resolveAuthNextPath(requested: unknown, cookieHeader: string | null): Promise<string> {
  if (requested !== undefined) return authNextPath(requested) ?? "/services";
  const token = tokenFromCookie(cookieHeader);
  if (!token) return "/services";
  const [row] = await getDb().select({ invitationId: identityContinuations.invitationId }).from(identityContinuations)
    .where(and(eq(identityContinuations.tokenHash, hash(token)), gt(identityContinuations.expiresAt, sql`clock_timestamp()`)));
  return row ? `/invitations/${row.invitationId}` : "/services";
}

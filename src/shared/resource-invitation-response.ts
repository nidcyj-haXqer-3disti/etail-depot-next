import { z } from "zod";

function safeDestination(value: string): boolean {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("%") || /[\u0000-\u0020\u007f]/.test(value)) return false;
  const url = new URL(value, "https://invitation.invalid");
  if (url.origin !== "https://invitation.invalid" || url.hash) return false;
  if (url.pathname === "/cardholder-services") return new Set(url.searchParams.keys()).size === [...url.searchParams].length && [...url.searchParams].every(([key, item]) => (key === "card" && z.uuid().safeParse(item).success) || (key === "view" && item === "cards"));
  return /^\/merchants\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(url.pathname) && (!url.search || url.search === "?tab=payments");
}
const base = {
  id: z.uuid(), targetName: z.string(), inviterName: z.string(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED", "REVOKED", "EXPIRED"]),
  version: z.int().positive(), expiresAt: z.iso.datetime(), canRespond: z.boolean(), hasAccess: z.boolean(),
  href: z.string().refine(safeDestination),
};
export const resourceInvitationProjectionSchema = z.discriminatedUnion("targetKind", [
  z.object({ ...base, targetKind: z.literal("CARD"), allowance: z.object({ amount: z.string().regex(/^[0-9]+$/), currency: z.literal("USD") }).strict() }).strict(),
  z.object({ ...base, targetKind: z.literal("MERCHANT_TERMINAL") }).strict(),
]);
export type ResourceInvitationProjection = z.infer<typeof resourceInvitationProjectionSchema>;

const uuid = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const invitation = new RegExp(`^/invitations/(${uuid})$`, "i");
const checkout = new RegExp(`^/checkout/${uuid}/card(?:\\?review=${uuid})?$`, "i");
/** Exact first-party locators only. No protocol, fragment, encoded path or extra query. */
export function authNextPath(value: unknown): string | null {
  return typeof value === "string" && value === value.trim() && (value === "/services" || invitation.test(value) || checkout.test(value)) ? value : null;
}
export function invitationIdFromNextPath(value: unknown): string | null {
  return typeof value === "string" && value === value.trim() ? invitation.exec(value)?.[1]?.toLowerCase() ?? null : null;
}

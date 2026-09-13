import { customerHref, customerQuery, customerRouteQuery } from "./customer-routes";
import { merchantActivityReturn, parseMerchantActivityFilters } from "./merchant-activity";
import { z } from "zod";
import { supportTopicSchema } from "./support-topics";
const uuid = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const invitation = new RegExp(`^/invitations/(${uuid})$`, "i");
const checkout = new RegExp(`^/checkout/${uuid}/card(?:\\?review=${uuid})?$`, "i");
/** Exact first-party locators only. No protocol, fragment, encoded path or extra query. */
export function authNextPath(value: unknown): string | null {
  if (typeof value !== "string" || value !== value.trim() || value.length > 4000 || /[\\\u0000-\u001f\u007f]/.test(value)) return null;
  if (["/services", "/profile", "/security", "/shared-access"].includes(value) || invitation.test(value) || checkout.test(value)) return value;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  try {
    const url = new URL(value, "https://etail.invalid");
    if (url.origin !== "https://etail.invalid" || url.hash || url.pathname.includes("%") || value.split("?")[0] !== url.pathname) return null;
    const query = customerQuery(url.searchParams);
    const cardKeys = ["view", "focus", "activityCard", "card", "context", "request", "new", "manage", "transaction", "person", "holder", "review", "cardTask", "invite", "page", "cardScope", "cardSearch", "requestPage", "requestStatus", "requestSearch", "peopleTab", "peopleSearch", "peopleStatus", "invitationStatus", "q", "from", "to", "status", "report"];
    const cardHelp = new RegExp(`^/cardholder-services/(?:cards/${uuid}/)?help$`, "i").test(url.pathname);
    if (cardHelp) {
      if (query.has("case") && !z.uuid().safeParse(query.get("case")).success || query.has("topic") && !supportTopicSchema.safeParse(query.get("topic")).success) return null;
      cardKeys.push("case", "topic");
    }
    const terminalKeys = ["tab", "payment", "transfer", "channel", "new", "invite", "case", "topic", "returnTo", "channelSearch", "channelStatus", "q", "from", "to", "status", "activity", "peopleTab", "peopleSearch", "peopleStatus", "invitationStatus"];
    const dashboardKeys = ["view", "section", "terminalUse", "activity", "period", "from", "to", "q", "status", "page", "new"];
    const allowed = url.pathname.startsWith("/cardholder-services") ? cardKeys : url.pathname.startsWith("/money-accounts/") ? ["task", "review", "page", "history", "returnTo"] : /^\/merchant-services\/[^/]+\/settings$/.test(url.pathname) ? ["returnTo"] : /^\/(?:merchants\/|merchant-services\/terminals\/)/.test(url.pathname) ? terminalKeys : dashboardKeys;
    if ([...query.keys()].some(key => !allowed.includes(key))) return null;
    if (query.has("returnTo") && !merchantActivityReturn(query.get("returnTo"))) return null;
    const normalized = customerRouteQuery(url.pathname, query);
    if (["/merchant-services", "/merchant-services/terminals", "/merchant-services/settings"].includes(url.pathname)) parseMerchantActivityFilters(normalized);
    return customerHref(url.pathname, query);
  } catch { return null; }
}
export function invitationIdFromNextPath(value: unknown): string | null {
  return typeof value === "string" && value === value.trim() ? invitation.exec(value)?.[1]?.toLowerCase() ?? null : null;
}

/** Called only after the email fragment has been captured; never reads a token. */
export function loginLocation(search: string): string {
  const input = new URLSearchParams(search), clean = new URLSearchParams();
  if (input.getAll("mode").length === 1 && input.get("mode") === "register") clean.set("mode", "register");
  const next = input.getAll("next").length === 1 ? authNextPath(input.get("next")) : null;
  if (next) clean.set("next", next);
  return `/login${clean.size ? `?${clean}` : ""}`;
}

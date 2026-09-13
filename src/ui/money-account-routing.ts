import { merchantActivityReturn } from "@/shared/merchant-activity";

/** Money tasks keep a validated merchant investigation; never accept an external return URL. */
export function moneyAccountReturn(value: unknown, serviceKind: "CARDHOLDER" | "MERCHANT") {
  if (value === undefined || value === null) return null;
  if (serviceKind !== "MERCHANT" || typeof value !== "string") throw new Error("INVALID_MONEY_RETURN");
  const target = merchantActivityReturn(value);
  if (!target) throw new Error("INVALID_MONEY_RETURN");
  return target;
}

export function moneyAccountHref(id: string, returnTo: string | null = null, values: Record<string, string> = {}) {
  const query = new URLSearchParams(values);
  if (returnTo) query.set("returnTo", returnTo);
  return `/money-accounts/${encodeURIComponent(id)}${query.size ? `?${query}` : ""}`;
}

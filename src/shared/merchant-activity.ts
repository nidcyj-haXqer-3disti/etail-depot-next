import { z } from "zod";

export const ACTIVITY_PAGE_SIZE = 25;
export const ACTIVITY_EXPORT_LIMIT = 10000;
export const merchantActivityQuerySchema = z.object({
  view: z.string().regex(/^(all|(?:unit|merchant):[0-9a-f-]{36})$/i).default("all"),
  section: z.enum(["activity", "funds", "merchants"]).default("activity"),
  activity: z.enum(["payments", "refunds", "transfers"]).default("payments"),
  period: z.enum(["all", "last7", "last30", "thisMonth", "lastMonth", "custom"]).default("all"),
  from: z.string().default(""), to: z.string().default(""),
  q: z.string().trim().max(160).refine(value => !/[\u0000-\u001f\u007f]/.test(value)).default(""),
  status: z.enum(["ALL", "COLLECTED", "APPROVED", "DECLINED", "REFUNDED"]).default("ALL"),
  page: z.coerce.number().int().min(1).max(1000000).default(1),
}).strict();
export type MerchantActivityQuery = z.infer<typeof merchantActivityQuerySchema>;
export type MerchantActivityQueryInput = Record<string, string | string[] | undefined> | URLSearchParams;
export function parseMerchantActivityFilters(input: MerchantActivityQueryInput = {}): MerchantActivityQuery {
  const source = input instanceof URLSearchParams ? Object.fromEntries([...new Set(input.keys())].map(key => [key, input.getAll(key).length === 1 ? input.get(key)! : input.getAll(key)])) : input;
  const raw = Object.fromEntries(Object.keys(merchantActivityQuerySchema.shape).filter(key => source[key] !== undefined).map(key => [key, source[key]]));
  const parsed = merchantActivityQuerySchema.safeParse(raw);
  if (!parsed.success) throw new Error("INVALID_ACTIVITY_FILTER");
  const query = parsed.data;
  query.view = query.view.toLowerCase();
  if (query.view !== "all" && !z.uuid().safeParse(query.view.split(":")[1]).success) throw new Error("INVALID_ACTIVITY_FILTER");
  for (const date of [query.from, query.to]) if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0,10) !== date)) throw new Error("INVALID_ACTIVITY_FILTER");
  if (query.from && query.to && query.from > query.to) throw new Error("INVALID_ACTIVITY_FILTER");
  if (query.period === "custom" && !query.from && !query.to) throw new Error("INVALID_ACTIVITY_FILTER");
  if (query.activity !== "payments") query.status = "ALL";
  return query;
}
export function activityRange(query: MerchantActivityQuery, now: Date) {
  const iso = (date: Date) => date.toISOString().slice(0,10);
  const today = iso(now), start = new Date(`${today}T00:00:00Z`);
  if (query.period === "all") return {from: "", to: ""};
  if (query.period === "custom") return {from: query.from, to: query.to};
  if (query.period === "last7" || query.period === "last30") return {from: iso(new Date(start.getTime() - (query.period === "last7" ? 6 : 29) * 86400000)), to: today};
  const month = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
  if (query.period === "thisMonth") return {from: iso(month), to: today};
  return {from: iso(new Date(Date.UTC(start.getUTCFullYear(),start.getUTCMonth()-1,1))), to: iso(new Date(month.getTime()-86400000))};
}
export function merchantActivityHref(query: MerchantActivityQuery, updates: Partial<MerchantActivityQuery> = {}) {
  const next = {...query, ...updates};
  const params = new URLSearchParams();
  for (const [key,value] of Object.entries(next)) if (value !== "" && !(key === "view" && value === "all") && !(key === "section" && value === "activity") && !(key === "status" && value === "ALL") && !(key === "page" && value === 1)) params.set(key,String(value));
  return `/merchant-services${params.size ? `?${params}` : ""}`;
}
/** Only our relative dashboard route and recognized filter values can be a return destination. */
export function merchantActivityReturn(value: string | null): string | null {
  if (!value || value.length > 2000 || !/^\/merchant-services(?:\?|$)/.test(value)) return null;
  try {const url = new URL(value,"https://etail.invalid"); if (url.hash || [...url.searchParams.keys()].some(key => !(Object.hasOwn(merchantActivityQuerySchema.shape,key)))) return null; return merchantActivityHref(parseMerchantActivityFilters(url.searchParams));} catch {return null;}
}

/** Carry a validated activity return through an exact merchant record. */
export function merchantRecordHref(merchantId: string, selection: Record<string, string>, returnTo: string | null) {
  const query = new URLSearchParams(selection);
  query.delete("returnTo");
  const back = merchantActivityReturn(returnTo);
  if (back) query.set("returnTo", back);
  return `/merchants/${encodeURIComponent(merchantId)}?${query}`;
}

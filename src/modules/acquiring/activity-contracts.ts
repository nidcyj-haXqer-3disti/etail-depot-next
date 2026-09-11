import { z } from "zod";
import { SecurityError } from "../../platform/security/origin";
import type { Money } from "../workspace/contracts";
import { merchantActivityQuerySchema, parseMerchantActivityFilters, type MerchantActivityQuery, type MerchantActivityQueryInput } from "../../shared/merchant-activity";
export { ACTIVITY_PAGE_SIZE, ACTIVITY_EXPORT_LIMIT, merchantActivityQuerySchema, activityRange, merchantActivityHref, merchantActivityReturn } from "../../shared/merchant-activity";
export type { MerchantActivityQuery, MerchantActivityQueryInput } from "../../shared/merchant-activity";

export function parseMerchantActivityQuery(input: MerchantActivityQueryInput = {}): MerchantActivityQuery {
  try { return parseMerchantActivityFilters(input); }
  catch { throw new SecurityError("INVALID_ACTIVITY_FILTER", 422); }
}
/** API queries are strict; page queries may also contain framework-owned parameters. */
export function parseMerchantActivityApiQuery(input: URLSearchParams) {
  const allowed = new Set([...Object.keys(merchantActivityQuerySchema.shape), "format"]);
  if ([...input.keys()].some(key => !allowed.has(key))) throw new SecurityError("INVALID_ACTIVITY_FILTER", 422);
  const formats = input.getAll("format");
  if (formats.length > 1 || formats.length === 1 && formats[0] !== "csv") throw new SecurityError("INVALID_ACTIVITY_FILTER", 422);
  const filters = new URLSearchParams(input);
  filters.delete("format");
  parseMerchantActivityQuery(filters);
  return {filters, exporting: formats[0] === "csv"};
}
export interface MerchantActivityRow {
  id: string; kind: "payment" | "refund" | "transfer"; merchantId: string; merchantName: string;
  description: string; amount: Money; status: "APPROVED" | "DECLINED" | "REFUNDED" | "COMPLETED";
  reference: string; at: string; paymentId: string | null; paymentReference: string | null; href: string;
}
export interface MerchantActivityProjection {
  query: MerchantActivityQuery; range: {from:string;to:string}; asOf:string;
  available:boolean; completeScope:boolean; rows:MerchantActivityRow[]; totalCount:number; pageCount:number; pageSize:number;
  periodTotals:{collected:Money|null;refunded:Money|null;transferred:Money|null};
}
const money = z.object({minor:z.string(),currency:z.literal("USD"),formatted:z.string()}).strict();
export const merchantActivityProjectionSchema = z.object({
  query:merchantActivityQuerySchema,range:z.object({from:z.string(),to:z.string()}).strict(),asOf:z.iso.datetime(),available:z.boolean(),completeScope:z.boolean(),
  rows:z.array(z.object({id:z.uuid(),kind:z.enum(["payment","refund","transfer"]),merchantId:z.uuid(),merchantName:z.string(),description:z.string(),amount:money,status:z.enum(["APPROVED","DECLINED","REFUNDED","COMPLETED"]),reference:z.string(),at:z.iso.datetime(),paymentId:z.uuid().nullable(),paymentReference:z.string().nullable(),href:z.string()}).strict()),
  totalCount:z.int().nonnegative(),pageCount:z.int().positive(),pageSize:z.int().positive(),
  periodTotals:z.object({collected:money.nullable(),refunded:money.nullable(),transferred:money.nullable()}).strict(),
}).strict();

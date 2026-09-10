import { z } from "zod";
import type { Money, WorkspaceActivity } from "../workspace/contracts";

export const reportSourceSchema = z.enum(["ACTIVITY"]);
export const reportStatusSchema = z.enum(["ALL", "POSTED", "PENDING", "DECLINED"]);
const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "Enter a valid calendar date.");
export const reportFiltersSchema = z.object({
  source: reportSourceSchema,
  status: reportStatusSchema.default("ALL"),
  from: dateOnlySchema,
  to: dateOnlySchema,
  query: z.string().trim().max(80).default(""),
}).strict().refine(value => value.from <= value.to, { message: "The end date must follow the start date.", path: ["to"] });
export const reportDefinitionCommandSchema = z.object({ commandId: z.uuid(), name: z.string().trim().min(1).max(60), filters: reportFiltersSchema }).strict();
export const reportDefinitionUpdateSchema = reportDefinitionCommandSchema.extend({ expectedVersion: z.int().positive() });
export const reportDefinitionDeleteSchema = z.object({ commandId: z.uuid(), expectedVersion: z.int().positive() }).strict();
export type ReportFilters = z.infer<typeof reportFiltersSchema>;
export type ReportSource = z.infer<typeof reportSourceSchema>;
export type ReportDefinitionCommand = z.infer<typeof reportDefinitionCommandSchema>;
export type ReportDefinitionUpdate = z.infer<typeof reportDefinitionUpdateSchema>;
export type ReportDefinitionDelete = z.infer<typeof reportDefinitionDeleteSchema>;

export interface SavedReportDefinition {
  id: string; serviceId: string; name: string; filters: ReportFilters; version: number;
  updatedAt: string; canRun: boolean; unavailableReason: string | null;
}
export interface ReportTotal { key: string; label: string; amount: Money; explanation: string }
export interface HistoricalReportProjection {
  kind: "CARD_ACTIVITY_REPORT";
  serviceId: string; serviceName: string; generatedAt: string;
  fictional: true; disclosure: string; filters: ReportFilters;
  availableSources: { value: ReportSource; label: string }[];
  periods: { value: string; label: string; from: string; to: string }[];
  activity: WorkspaceActivity[];
  activityTotals: ReportTotal[];
  definitions: SavedReportDefinition[];
  rowCount: number; empty: boolean;
}

/** The route rejects unknown query keys instead of accepting service/person scope from filters. */
export function readReportFilters(params: URLSearchParams): ReportFilters | undefined {
  if ([...params.keys()].length === 0) return undefined;
  const values: Record<string, string> = {};
  for (const [key, value] of params) {
    if (!new Set(["source", "status", "from", "to", "query"]).has(key) || Object.hasOwn(values, key)) throw new Error("INVALID_REPORT_FILTERS");
    values[key] = value;
  }
  return reportFiltersSchema.parse(values);
}

import { z } from "zod";
import { workspaceActivitySchema } from "../workspace/api-contracts";
import { reportSourceSchema, reportFiltersSchema, reportDefinitionCommandSchema, reportDefinitionUpdateSchema, reportDefinitionDeleteSchema } from "./contracts";

export const savedReportDefinitionSchema = z.object({ id: z.uuid(), serviceId: z.uuid(), name: z.string(), filters: reportFiltersSchema, version: z.int().positive(), updatedAt: z.iso.datetime(), canRun: z.boolean(), unavailableReason: z.string().nullable() }).strict();
const total = z.object({ key: z.string(), label: z.string(), amount: workspaceActivitySchema.shape.amount, explanation: z.string() }).strict();
export const historicalReportProjectionSchema = z.object({
  kind: z.literal("CARD_ACTIVITY_REPORT"), serviceId: z.uuid(), serviceName: z.string(), generatedAt: z.iso.datetime(), fictional: z.literal(true), disclosure: z.string(), filters: reportFiltersSchema,
  availableSources: z.array(z.object({ value: reportSourceSchema, label: z.string() }).strict()),
  periods: z.array(z.object({ value: z.string(), label: z.string(), from: z.string(), to: z.string() }).strict()),
  activity: z.array(workspaceActivitySchema),
  activityTotals: z.array(total), definitions: z.array(savedReportDefinitionSchema), rowCount: z.int().nonnegative(), empty: z.boolean(),
}).strict();
const prefix = "/api/v1/cardholder-services/{serviceId}/reports";
export const reportOperations = [
  { path: prefix, method: "get", response: historicalReportProjectionSchema, status: 200, authenticated: true, query: reportFiltersSchema },
  { path: `${prefix}/export`, method: "get", response: z.string(), responseContentType: "text/csv", status: 200, authenticated: true, query: reportFiltersSchema },
  { path: `${prefix}/definitions`, method: "post", request: reportDefinitionCommandSchema, response: savedReportDefinitionSchema, status: 200, authenticated: true },
  { path: `${prefix}/definitions/{definitionId}`, method: "patch", request: reportDefinitionUpdateSchema, response: savedReportDefinitionSchema, status: 200, authenticated: true },
  { path: `${prefix}/definitions/{definitionId}`, method: "delete", request: reportDefinitionDeleteSchema, response: z.object({ id: z.uuid(), deleted: z.literal(true) }).strict(), status: 200, authenticated: true },
] as const;

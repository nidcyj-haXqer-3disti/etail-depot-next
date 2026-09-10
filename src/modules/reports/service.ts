import { createHash, randomUUID } from "node:crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import type { z } from "zod";
import { getDb } from "../../platform/database/client";
import { SecurityError } from "../../platform/security/origin";
import { loadServiceScope } from "../access/scope";
import { evaluate } from "../policy/evaluate";
import { getWorkspace, getWorkspaceInTransaction } from "../workspace/service";
import { savedReportDefinitions, reportDefinitionCommands } from "./schema";
import { deriveHistoricalReport, historicalReportCsv, sourceAllowed } from "./derive";
import { reportDefinitionCommandSchema, reportDefinitionUpdateSchema, reportDefinitionDeleteSchema,
  type ReportFilters, type ReportDefinitionCommand, type ReportDefinitionUpdate, type ReportDefinitionDelete, type SavedReportDefinition } from "./contracts";

function validate<T>(schema: z.ZodType<T>, raw: unknown): T {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) throw new SecurityError("INVALID_REQUEST", 422);
  return parsed.data;
}
function definitionProjection(row: typeof savedReportDefinitions.$inferSelect, allowed: (action: string) => boolean): SavedReportDefinition {
  const canRun = sourceAllowed(row.source, allowed);
  return { id: row.id, serviceId: row.serviceId, name: row.name, version: row.version, updatedAt: row.updatedAt.toISOString(),
    filters: { source: row.source, status: row.status, from: row.fromDate, to: row.toDate, query: row.query }, canRun,
    unavailableReason: canRun ? null : "You no longer have access to the card activity included in this saved report." };
}

export async function getHistoricalReport(personId: string, serviceId: string, filters?: ReportFilters) {
  return getDb().transaction(async tx => {
    // Lock current scope before reading any card rows. A primary-to-secondary change cannot
    // leave an earlier broad projection available to totals, CSV or a saved-filter rerun.
    const scope = await loadServiceScope(tx, personId, serviceId, true);
    const workspace = await getWorkspaceInTransaction(tx, personId, serviceId);
    const allowed = (action: string) => evaluate(scope.policy, action).allowed;
    const rows = await tx.select().from(savedReportDefinitions).where(and(eq(savedReportDefinitions.serviceId, serviceId), eq(savedReportDefinitions.personId, personId), eq(savedReportDefinitions.deleted, false))).orderBy(desc(savedReportDefinitions.updatedAt), savedReportDefinitions.id);
    // Saved definitions contain filters only; every run uses current scoped source rows.
    const current = { ...workspace, capabilities: workspace.capabilities.map(item => ({ ...item, allowed: item.allowed && allowed(item.action) })),
      activity: allowed("activity.read") ? workspace.activity : [] };
    return deriveHistoricalReport(current, filters, rows.map(row => definitionProjection(row, allowed)));
  });
}

export async function exportHistoricalReport(personId: string, serviceId: string, filters?: ReportFilters) {
  const report = await getHistoricalReport(personId, serviceId, filters);
  return { csv: historicalReportCsv(report), filename: `etail-card-activity-${serviceId.slice(0, 8)}-${report.filters.from}-${report.filters.to}.csv` };
}

/** Typed saved-filter commands, not a generic record API or a financial writer. */
async function saveDefinition(personId: string, serviceId: string, definitionId: string | null, kind: "CREATE" | "UPDATE" | "DELETE", input: ReportDefinitionCommand | ReportDefinitionUpdate | ReportDefinitionDelete) {
  await getWorkspace(personId, serviceId); // Local fictional workspace only; this does not grant the mutation.
  return getDb().transaction(async tx => {
    const scope = await loadServiceScope(tx, personId, serviceId, true);
    const allowed = (action: string) => evaluate(scope.policy, action).allowed;
    if ("filters" in input && !sourceAllowed(input.filters.source, allowed)) throw new SecurityError("ACTION_DENIED", 403);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${input.commandId}, 0))`);
    const digest = createHash("sha256").update(JSON.stringify({ kind, definitionId, input })).digest("hex");
    const [receipt] = await tx.select().from(reportDefinitionCommands).where(eq(reportDefinitionCommands.commandId, input.commandId));
    if (receipt && (receipt.serviceId !== serviceId || receipt.personId !== personId || receipt.kind !== kind || receipt.digest !== digest)) throw new SecurityError("IDEMPOTENCY_CONFLICT", 409);
    const id = receipt?.definitionId ?? definitionId ?? randomUUID();
    const [existing] = await tx.select().from(savedReportDefinitions).where(and(eq(savedReportDefinitions.id, id), eq(savedReportDefinitions.serviceId, serviceId), eq(savedReportDefinitions.personId, personId))).for("update");
    if (receipt) {
      if (!existing) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
      if (kind === "DELETE") return { id, deleted: true as const };
      if (existing.deleted) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
      return definitionProjection(existing, allowed);
    }
    if (kind !== "CREATE") {
      if (!existing || existing.deleted) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
      if (!("expectedVersion" in input) || existing.version !== input.expectedVersion) throw new SecurityError("STALE_VERSION", 409);
    }
    if (kind === "DELETE") {
      await tx.update(savedReportDefinitions).set({ deleted: true, version: existing!.version + 1, updatedAt: new Date() }).where(eq(savedReportDefinitions.id, id));
      await tx.insert(reportDefinitionCommands).values({ commandId: input.commandId, serviceId, personId, definitionId: id, kind, digest });
      return { id, deleted: true as const };
    }
    if (!("filters" in input)) throw new SecurityError("INVALID_REQUEST", 422);
    const fields = { name: input.name, source: input.filters.source, status: input.filters.status, fromDate: input.filters.from, toDate: input.filters.to, query: input.filters.query };
    const [saved] = kind === "CREATE"
      ? await tx.insert(savedReportDefinitions).values({ id, serviceId, personId, ...fields }).returning()
      : await tx.update(savedReportDefinitions).set({ ...fields, version: existing!.version + 1, updatedAt: new Date() }).where(eq(savedReportDefinitions.id, id)).returning();
    await tx.insert(reportDefinitionCommands).values({ commandId: input.commandId, serviceId, personId, definitionId: id, kind, digest });
    return definitionProjection(saved!, allowed);
  });
}

export async function createReportDefinition(personId: string, serviceId: string, raw: ReportDefinitionCommand): Promise<SavedReportDefinition> {
  return await saveDefinition(personId, serviceId, null, "CREATE", validate(reportDefinitionCommandSchema, raw)) as SavedReportDefinition;
}
export async function updateReportDefinition(personId: string, serviceId: string, definitionId: string, raw: ReportDefinitionUpdate): Promise<SavedReportDefinition> {
  return await saveDefinition(personId, serviceId, definitionId, "UPDATE", validate(reportDefinitionUpdateSchema, raw)) as SavedReportDefinition;
}
export async function deleteReportDefinition(personId: string, serviceId: string, definitionId: string, raw: ReportDefinitionDelete): Promise<{ id: string; deleted: true }> {
  return await saveDefinition(personId, serviceId, definitionId, "DELETE", validate(reportDefinitionDeleteSchema, raw)) as { id: string; deleted: true };
}

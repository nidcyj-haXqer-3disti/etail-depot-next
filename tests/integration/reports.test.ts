import {fundCardGroup} from "../helpers/cardholder";
import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { and, eq } from "drizzle-orm";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { serviceMembers, permissionGrants } from "../../src/platform/database/schema";
import {cardPrimary,cardPerson,enrollCardholder,issuePracticeCard} from "../helpers/cardholder";
import { getWorkspace } from "../../src/modules/workspace/service";
import { getHistoricalReport, exportHistoricalReport, createReportDefinition, updateReportDefinition, deleteReportDefinition } from "../../src/modules/reports/service";
import { reportDefinitionCommands, savedReportDefinitions } from "../../src/modules/reports/schema";
import { historicalReportProjectionSchema, savedReportDefinitionSchema } from "../../src/modules/reports/api-contracts";
import type { ReportFilters } from "../../src/modules/reports/contracts";

afterAll(closeDatabase);
const activityFilters: ReportFilters = { source: "ACTIVITY", status: "ALL", from: "2026-09-01", to: "2026-09-30", query: "" };
async function fixture() {const primary=await cardPrimary("Report tester");await (async()=>{await fundCardGroup(primary.personId,primary.serviceId,"10000");return issuePracticeCard(primary.personId, primary.serviceId, primary.personId, "Report card", "1251", "10000");})();return primary;}
async function member(ownerId:string,serviceId:string) {
  const personId=await cardPerson("Report cardholder");
  await enrollCardholder(ownerId,serviceId,personId);
  return personId;
}

describe("scoped historical reports and private definitions", () => {
  it("reads itemized authorized history, exports the same filters, and never writes financial records", async () => {
    const { personId, serviceId } = await fixture();
    const before = await getWorkspace(personId, serviceId);
    const report = historicalReportProjectionSchema.parse(await getHistoricalReport(personId, serviceId));
    expect(report.activity).toEqual(before.activity);
    expect(report.rowCount).toBe(before.activity.length);
    const target = before.activity.find(item => item.status === "POSTED")!;
    const filtered = await getHistoricalReport(personId, serviceId, { ...activityFilters, status: "POSTED", query: target.title });
    expect(filtered.activity.map(item => item.id)).toEqual([target.id]);
    const { csv, filename } = await exportHistoricalReport(personId, serviceId, filtered.filters);
    expect(csv).toContain(target.id);
    expect(filename).toMatch(/^etail-card-activity-[0-9a-f-]+-2026-09-01-2026-09-30\.csv$/);
    const saved = await createReportDefinition(personId, serviceId, { commandId: randomUUID(), name: "Posted records", filters: filtered.filters });
    await deleteReportDefinition(personId, serviceId, saved.id, { commandId: randomUUID(), expectedVersion: saved.version });
    const after = await getWorkspace(personId, serviceId); expect(after.activity).toEqual(before.activity); expect(after.cards).toEqual(before.cards);
  });
  it("rejects cross-service reads/exports/definitions and never exposes owner history to an accepted cardholder", async () => {
    const owner = await fixture(), foreign = await fixture();
    await expect(getHistoricalReport(foreign.personId, owner.serviceId)).rejects.toMatchObject({ status: 404 });
    await expect(exportHistoricalReport(foreign.personId, owner.serviceId)).rejects.toMatchObject({ status: 404 });
    await expect(createReportDefinition(foreign.personId, owner.serviceId, { commandId: randomUUID(), name: "Denied", filters: activityFilters })).rejects.toMatchObject({ status: 404 });
    const granted = await member(owner.personId,owner.serviceId);
    expect((await getHistoricalReport(granted, owner.serviceId)).activity).toEqual([]);
    const exported = await exportHistoricalReport(granted, owner.serviceId);
    expect(exported.csv).toContain("NO_MATCHING_RECORDS");
    expect(exported.csv).not.toContain("Sample Market");
  });
  it("persists own named filters, retries once, rejects stale edits and isolates definitions within a card group", async () => {
    const { personId, serviceId } = await fixture(), viewerId = await member(personId,serviceId);
    const input = { commandId: randomUUID(), name: "My September", filters: activityFilters };
    const [first, duplicate] = await Promise.all([createReportDefinition(personId, serviceId, input), createReportDefinition(personId, serviceId, input)]);
    savedReportDefinitionSchema.parse(first); expect(duplicate).toEqual(first);
    expect((await getHistoricalReport(personId, serviceId)).definitions.map(item => item.id)).toEqual([first.id]);
    expect((await getHistoricalReport(viewerId, serviceId)).definitions).toEqual([]);
    await expect(updateReportDefinition(viewerId, serviceId, first.id, { ...input, commandId: randomUUID(), expectedVersion: first.version })).rejects.toMatchObject({ status: 404 });
    await expect(deleteReportDefinition(viewerId, serviceId, first.id, { commandId: randomUUID(), expectedVersion: first.version })).rejects.toMatchObject({ status: 404 });
    await expect(createReportDefinition(personId, serviceId, { ...input, name: "Changed replay" })).rejects.toMatchObject({ status: 409, code: "IDEMPOTENCY_CONFLICT" });
    const update = { commandId: randomUUID(), name: "Renamed", filters: { ...activityFilters, status: "POSTED" as const }, expectedVersion: first.version };
    const saved = await updateReportDefinition(personId, serviceId, first.id, update);
    expect(saved.version).toBe(first.version + 1); expect(saved.filters.status).toBe("POSTED");
    expect(await updateReportDefinition(personId, serviceId, first.id, update)).toEqual(saved);
    await expect(updateReportDefinition(personId, serviceId, first.id, { ...update, commandId: randomUUID() })).rejects.toMatchObject({ status: 409, code: "STALE_VERSION" });
    const deletion = { commandId: randomUUID(), expectedVersion: saved.version };
    expect(await deleteReportDefinition(personId, serviceId, saved.id, deletion)).toEqual({ id: saved.id, deleted: true });
    expect(await deleteReportDefinition(personId, serviceId, saved.id, deletion)).toEqual({ id: saved.id, deleted: true });
    expect((await getHistoricalReport(personId, serviceId)).definitions).toEqual([]);
    expect(await getDb().select().from(reportDefinitionCommands).where(eq(reportDefinitionCommands.serviceId, serviceId))).toHaveLength(3);
  });
  it("uses fixed cardholder access and rechecks accepted membership on every read, export and saved filter", async () => {
    const {personId,serviceId}=await fixture(),viewerId=await member(personId,serviceId);
    const saved=await createReportDefinition(viewerId,serviceId,{commandId:randomUUID(),name:"My activity",filters:activityFilters});
    await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,serviceId),eq(permissionGrants.personId,viewerId),eq(permissionGrants.action,"activity.read")));
    // Legacy grant rows cannot narrow or widen a holder's fixed own-card access.
    expect((await getHistoricalReport(viewerId,serviceId,saved.filters)).activity).toEqual([]);
    expect((await exportHistoricalReport(viewerId,serviceId,saved.filters)).csv).toContain("NO_MATCHING_RECORDS");
    await getDb().update(serviceMembers).set({state:"REVOKED"}).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.personId,viewerId)));
    await expect(getHistoricalReport(viewerId,serviceId)).rejects.toMatchObject({status:404});
    await expect(getHistoricalReport(viewerId,serviceId,saved.filters)).rejects.toMatchObject({status:404});
    await expect(exportHistoricalReport(viewerId,serviceId,saved.filters)).rejects.toMatchObject({status:404});
    await expect(createReportDefinition(viewerId,serviceId,{commandId:randomUUID(),name:"No access",filters:activityFilters})).rejects.toMatchObject({status:404});
    await expect(deleteReportDefinition(viewerId,serviceId,saved.id,{commandId:randomUUID(),expectedVersion:saved.version})).rejects.toMatchObject({status:404});
    expect(await getDb().select().from(savedReportDefinitions).where(eq(savedReportDefinitions.personId,viewerId))).toHaveLength(1);
  });
  it("validates filter-only payloads at the service boundary and rejects authority/data injection", async () => {
    const { personId, serviceId } = await fixture();
    const input = { commandId: randomUUID(), name: "Invalid", filters: activityFilters };
    await expect(createReportDefinition(personId, serviceId, { ...input, serviceId: randomUUID() } as typeof input)).rejects.toMatchObject({ status: 422 });
    await expect(createReportDefinition(personId, serviceId, { ...input, filters: { ...activityFilters, amountMinor: "1000" } } as typeof input)).rejects.toMatchObject({ status: 422 });
    await expect(getHistoricalReport(personId, serviceId, { ...activityFilters, from: "2026-02-30" })).rejects.toMatchObject({ status: 422 });
    expect(await getDb().select().from(savedReportDefinitions).where(eq(savedReportDefinitions.serviceId, serviceId))).toHaveLength(0);
  });
});

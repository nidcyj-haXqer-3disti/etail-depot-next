import { createHash } from "node:crypto";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../platform/database/client";
import { people, services } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import { evaluate } from "../policy/evaluate";
import type { ScopedTransaction } from "../access/scope";
import { supportCases, supportCaseMessages } from "../cases/schema";
import { operatorCommands, operatorServiceAccess } from "./schema";

import {operatorResponseSchema,type OperatorResponse} from "./contracts";
export {operatorResponseSchema} from "./contracts";

async function authority(tx: ScopedTransaction, actorId: string, serviceId: string, write = false) {
  if (write) await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${`operator:${serviceId}:${actorId}`},0))`);
  const query = tx.select({ assignment: operatorServiceAccess, service: services }).from(operatorServiceAccess)
    .innerJoin(services, eq(services.id, operatorServiceAccess.serviceId))
    .where(and(eq(operatorServiceAccess.personId, actorId), eq(operatorServiceAccess.serviceId, serviceId)));
  const [row] = write ? await query.for("share") : await query;
  if (!row) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
  const scope = { targetKind: "OPERATOR_SERVICE" as const, actorPersonId: actorId, assignmentPersonId: row.assignment.personId, serviceId, resourceServiceId: serviceId, state: row.assignment.state, serviceStatus: row.service.status, grants: row.assignment.canRespond ? ["support.operator.read", "support.operator.respond"] : ["support.operator.read"] };
  if (!evaluate(scope, "support.operator.read").allowed) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
  return { ...row, canRespond: evaluate(scope, "support.operator.respond").allowed };
}

export async function hasOperatorAccess(personId: string) {
  const rows = await getDb().select({ serviceId: operatorServiceAccess.serviceId }).from(operatorServiceAccess).innerJoin(services, eq(services.id, operatorServiceAccess.serviceId))
    .where(and(eq(operatorServiceAccess.personId, personId), eq(operatorServiceAccess.state, "ACCEPTED"), sql`${services.status}<>'CLOSED'`)).limit(1);
  return rows.length > 0;
}

export async function getOperatorQueue(personId: string) {
  return getDb().transaction(async tx => {
    const assignments = await tx.select({ serviceId: operatorServiceAccess.serviceId }).from(operatorServiceAccess).where(and(eq(operatorServiceAccess.personId, personId), eq(operatorServiceAccess.state, "ACCEPTED")));
    const authorized: string[] = [];
    for (const assignment of assignments) {
      try { await authority(tx, personId, assignment.serviceId); authorized.push(assignment.serviceId); }
      catch (error) { if (!(error instanceof SecurityError && error.status === 404)) throw error; }
    }
    if (!authorized.length) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
    const rows = await tx.select({ case: supportCases, name: services.displayName, kind: services.kind, customer: people.displayName }).from(supportCases)
      .innerJoin(services, eq(services.id, supportCases.serviceId)).innerJoin(people, eq(people.id, supportCases.creatorId))
      .where(inArray(supportCases.serviceId, authorized)).orderBy(desc(supportCases.updatedAt), supportCases.id).limit(100);
    return rows.map(row => ({ id: row.case.id, reference: row.case.reference, subject: row.case.subject, status: row.case.status, serviceName: row.name, serviceKind: row.kind, customer: row.customer, updatedAt: row.case.updatedAt.toISOString() }));
  }, { isolationLevel: "repeatable read" });
}

async function caseDetail(tx: ScopedTransaction, personId: string, caseId: string, write = false) {
  if (!z.uuid().safeParse(caseId).success) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
  const [locator] = await tx.select().from(supportCases).where(eq(supportCases.id, caseId));
  if (!locator) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
  const access = await authority(tx, personId, locator.serviceId, write);
  const query = tx.select().from(supportCases).where(eq(supportCases.id, caseId));
  const [row] = write ? await query.for("update") : await query;
  if (!row) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
  const [customer] = await tx.select({ name: people.displayName }).from(people).where(eq(people.id, row.creatorId));
  if (!customer) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
  const messages = await tx.select().from(supportCaseMessages).where(and(eq(supportCaseMessages.caseId, caseId), eq(supportCaseMessages.serviceId, row.serviceId))).orderBy(asc(supportCaseMessages.sequence));
  return { row, access, messages, customer: customer.name };
}

function project(detail: Awaited<ReturnType<typeof caseDetail>>) {
  return { id: detail.row.id, serviceId: detail.row.serviceId, reference: detail.row.reference, subject: detail.row.subject, status: detail.row.status, version: detail.row.version, serviceName: detail.access.service.displayName, customer: detail.customer, canRespond: detail.access.canRespond && detail.row.status === "OPEN", messages: detail.messages.map(message => ({ id: message.id, body: message.body, author: message.authorKind, createdAt: message.createdAt.toISOString() })) };
}
export async function getOperatorCase(personId: string, caseId: string) {
  return getDb().transaction(async tx => project(await caseDetail(tx, personId, caseId)), { isolationLevel: "repeatable read" });
}
export async function respondToCase(personId: string, caseId: string, raw: OperatorResponse) {
  const parsed = operatorResponseSchema.safeParse(raw);
  if (!parsed.success) throw new SecurityError("INVALID_REQUEST", 422);
  const input = parsed.data;
  return getDb().transaction(async tx => {
    const detail = await caseDetail(tx, personId, caseId, true);
    if (!detail.access.canRespond) throw new SecurityError("ACTION_DENIED", 403);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${`operator-command:${input.commandId}`},0))`);
    const digest = createHash("sha256").update(JSON.stringify({ caseId, ...input })).digest("hex");
    const [receipt] = await tx.select().from(operatorCommands).where(eq(operatorCommands.commandId, input.commandId));
    if (receipt) {
      if (receipt.actorId !== personId || receipt.caseId !== caseId || receipt.serviceId !== detail.row.serviceId || receipt.digest !== digest) throw new SecurityError("IDEMPOTENCY_CONFLICT", 409);
      return project(detail);
    }
    if (detail.row.version !== input.expectedVersion) throw new SecurityError("STALE_VERSION", 409);
    if (detail.row.status !== "OPEN") throw new SecurityError("INVALID_STATE", 422);
    const [updated] = await tx.update(supportCases).set({ status: input.resolve ? "RESOLVED" : "OPEN", version: detail.row.version + 1, updatedAt: sql`clock_timestamp()` }).where(eq(supportCases.id, caseId)).returning();
    await tx.insert(supportCaseMessages).values({ caseId, serviceId: detail.row.serviceId, creatorId: detail.row.creatorId, authorId: personId, authorKind: "SUPPORT", kind: input.resolve ? "RESOLVED" : "MESSAGE", body: input.message, sequence: updated!.version });
    await tx.insert(operatorCommands).values({ commandId: input.commandId, serviceId: detail.row.serviceId, actorId: personId, caseId, digest });
    return project(await caseDetail(tx, personId, caseId));
  });
}

export type OperatorQueue = Awaited<ReturnType<typeof getOperatorQueue>>;
export type OperatorCase = Awaited<ReturnType<typeof getOperatorCase>>;

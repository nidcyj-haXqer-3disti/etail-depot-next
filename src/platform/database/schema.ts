import { sql } from "drizzle-orm";
import { pgTable, pgEnum, uuid, text, timestamp, integer, bigint, boolean, primaryKey, unique, uniqueIndex, check, foreignKey } from "drizzle-orm/pg-core";

export const serviceKind = pgEnum("service_kind", ["CARDHOLDER", "MERCHANT"]);
export const people = pgTable("people", {
  id: uuid().primaryKey().defaultRandom(), displayName: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
export const identityBindings = pgTable("identity_bindings", {
  id: uuid().primaryKey().defaultRandom(), personId: uuid().notNull().references(() => people.id),
  issuer: text().notNull(), subject: text().notNull(),
}, (t) => [unique().on(t.issuer, t.subject), unique().on(t.id, t.personId)]);
export const services = pgTable("services", {
  id: uuid().primaryKey().defaultRandom(), kind: serviceKind().notNull(), primaryPersonId: uuid().notNull().references(() => people.id), displayName: text().notNull(),
  status: text({ enum: ["DRAFT", "ACTIVE", "SUSPENDED", "CLOSED"] }).notNull().default("ACTIVE"),
  version: integer().notNull().default(1), createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, (t) => [check("service_status_valid", sql`${t.status} in ('DRAFT','ACTIVE','SUSPENDED','CLOSED')`), check("service_version_positive", sql`${t.version}>0`), unique().on(t.id,t.kind), uniqueIndex("one_primary_cardholder_service").on(t.primaryPersonId).where(sql`${t.kind}='CARDHOLDER'`)]);
export const serviceMembers = pgTable("service_members", {
  serviceId: uuid().notNull().references(() => services.id), personId: uuid().notNull().references(() => people.id),
  state: text({ enum: ["ACCEPTED", "REVOKED"] }).notNull(), version: integer().notNull().default(1),
}, (t) => [primaryKey({columns:[t.serviceId,t.personId]}), check("membership_state_valid", sql`${t.state} in ('ACCEPTED','REVOKED')`), check("membership_version_positive", sql`${t.version}>0`)]);
export const cardholderCreationCommands = pgTable("cardholder_creation_commands", {
  commandId: uuid().primaryKey(), actorId: uuid().notNull().references(() => people.id), serviceId: uuid().notNull(), serviceKind: serviceKind().notNull().default("CARDHOLDER"), digest: text().notNull(), createdAt: timestamp({withTimezone:true}).notNull().defaultNow(),
}, t => [foreignKey({columns:[t.serviceId,t.serviceKind],foreignColumns:[services.id,services.kind]}),check("cardholder_creation_kind",sql`${t.serviceKind}='CARDHOLDER'`),check("cardholder_creation_digest",sql`${t.digest} ~ '^[0-9a-f]{64}$'`)]);
export const sessions = pgTable("app_sessions", {
  tokenHash: text().primaryKey(), identityId: uuid().notNull(), personId: uuid().notNull(),
  familyId: uuid().notNull().defaultRandom(),
  issuedAt: timestamp({withTimezone:true}).notNull(), expiresAt: timestamp({withTimezone:true}).notNull(), revokedAt: timestamp({withTimezone:true}),
}, (t) => [foreignKey({columns:[t.identityId,t.personId], foreignColumns:[identityBindings.id,identityBindings.personId]}), check("session_hash_valid",sql`${t.tokenHash} ~ '^[0-9a-f]{64}$'`), check("session_expiry_valid",sql`${t.expiresAt}>${t.issuedAt}`), uniqueIndex("app_sessions_one_active_per_family").on(t.familyId).where(sql`${t.revokedAt} is null`)]);
export const eventOutbox = pgTable("event_outbox", {
  id: uuid().primaryKey().defaultRandom(), businessKey: text().notNull().unique(), kind: text().notNull(),
  aggregateId: uuid().notNull(), createdAt: timestamp({withTimezone:true}).notNull().defaultNow(),
});

// Explicit service-scoped action grants. A role alone does not authorize a new workspace action.
export const permissionGrants = pgTable("permission_grants", {
  serviceId: uuid().notNull(), personId: uuid().notNull(), action: text().notNull(),
  state: text({enum:["ACCEPTED","REVOKED"]}).notNull().default("ACCEPTED"),
  delegable: boolean().notNull().default(false),
}, (t) => [primaryKey({columns:[t.serviceId,t.personId,t.action]}), foreignKey({columns:[t.serviceId,t.personId],foreignColumns:[serviceMembers.serviceId,serviceMembers.personId]}), check("grant_state_valid",sql`${t.state} in ('ACCEPTED','REVOKED')`)]);

export const cards = pgTable("cards", {
  id:uuid().primaryKey().defaultRandom(),serviceId:uuid().notNull(),serviceKind:serviceKind().notNull().default("CARDHOLDER"),holderId:uuid().notNull(),
  requestId:uuid().notNull(),issuerReference:text(),
  nickname:text().notNull(),lastFour:text().notNull(),format:text({enum:["VIRTUAL","PHYSICAL"]}).notNull(),
  status:text({enum:["ACTIVE","FROZEN"]}).notNull().default("ACTIVE"),version:integer().notNull().default(1),
  limitMinor:bigint({mode:"bigint"}).notNull(),currency:text().notNull().default("USD"),fictional:boolean().notNull().default(true),
},(t)=>[foreignKey({columns:[t.serviceId,t.serviceKind],foreignColumns:[services.id,services.kind]}),check("card_service_kind",sql`${t.serviceKind}='CARDHOLDER'`),unique().on(t.id,t.serviceId),unique("card_request_once").on(t.requestId),unique("card_issuer_reference_once").on(t.issuerReference),foreignKey({columns:[t.requestId,t.serviceId],foreignColumns:[cardRequests.id,cardRequests.serviceId]}),foreignKey({columns:[t.serviceId,t.holderId],foreignColumns:[serviceMembers.serviceId,serviceMembers.personId]}),check("card_fixture_only",sql`${t.fictional}=true`),check("card_status_valid",sql`${t.status} in ('ACTIVE','FROZEN')`),check("card_format_valid",sql`${t.format} in ('VIRTUAL','PHYSICAL')`),check("card_last_four",sql`${t.lastFour} ~ '^[0-9]{4}$'`),check("card_version_positive",sql`${t.version}>0`),check("card_limit_valid",sql`${t.limitMinor} >= 0 and ${t.currency}='USD'`)]);

export const cardRequests = pgTable("card_requests", {
  id:uuid().primaryKey().defaultRandom(),serviceId:uuid().notNull(),serviceKind:serviceKind().notNull().default("CARDHOLDER"),creatorId:uuid().notNull().references(()=>people.id),
  holderId:uuid().notNull(),nickname:text().notNull().default("New card"),format:text({enum:["VIRTUAL","PHYSICAL"]}).notNull().default("VIRTUAL"),
  requestedLimitMinor:bigint({mode:"bigint"}).notNull().default(0n),currency:text().notNull().default("USD"),
  status:text({enum:["DRAFT","BLOCKED","CANCELED","ISSUED"]}).notNull().default("DRAFT"),version:integer().notNull().default(1),
  createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),updatedAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},(t)=>[foreignKey({columns:[t.serviceId,t.serviceKind],foreignColumns:[services.id,services.kind]}),check("card_request_service_kind",sql`${t.serviceKind}='CARDHOLDER'`),unique("card_request_service_scope").on(t.id,t.serviceId),foreignKey({columns:[t.serviceId,t.holderId],foreignColumns:[serviceMembers.serviceId,serviceMembers.personId]}),check("card_request_status",sql`${t.status} in ('DRAFT','BLOCKED','CANCELED','ISSUED')`),check("card_request_amount",sql`${t.requestedLimitMinor} between 0 and 999999999 and ${t.currency}='USD'`),check("card_request_version",sql`${t.version}>0`)]);

export const serviceActivity = pgTable("service_activity", {
  id:uuid().primaryKey().defaultRandom(),serviceId:uuid().notNull().references(()=>services.id),cardId:uuid(),
  title:text().notNull(),category:text().notNull(),occurredAt:timestamp({withTimezone:true}).notNull(),
  status:text({enum:["POSTED","PENDING","DECLINED"]}).notNull(),direction:text({enum:["DEBIT","CREDIT"]}).notNull(),
  amountMinor:bigint({mode:"bigint"}).notNull(),currency:text().notNull().default("USD"),description:text().notNull(),fictional:boolean().notNull().default(true),
},(t)=>[unique().on(t.id,t.serviceId),foreignKey({columns:[t.cardId,t.serviceId],foreignColumns:[cards.id,cards.serviceId]}),check("activity_fixture_only",sql`${t.fictional}=true`),check("activity_status",sql`${t.status} in ('POSTED','PENDING','DECLINED')`),check("activity_direction",sql`${t.direction} in ('DEBIT','CREDIT')`),check("activity_amount",sql`${t.amountMinor}>=0 and ${t.currency}='USD'`)]);

export const notificationPreferences = pgTable("notification_preferences", {
  serviceId:uuid().notNull(),personId:uuid().notNull(),serviceActivity:boolean().notNull().default(true),cardControls:boolean().notNull().default(true),caseUpdates:boolean().notNull().default(true),version:integer().notNull().default(1),
},(t)=>[primaryKey({columns:[t.serviceId,t.personId]}),foreignKey({columns:[t.serviceId,t.personId],foreignColumns:[serviceMembers.serviceId,serviceMembers.personId]}),check("notification_version",sql`${t.version}>0`)]);
// Replay receipts reference typed owning records; they never contain arbitrary business JSON.
export const workspaceCommands = pgTable("workspace_command_receipts", {
  commandId:uuid().primaryKey(),serviceId:uuid().notNull().references(()=>services.id),actorId:uuid().notNull().references(()=>people.id),
  kind:text().notNull(),resourceId:uuid().notNull(),digest:text().notNull(),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},(t)=>[check("workspace_command_digest",sql`${t.digest} ~ '^[0-9a-f]{64}$'`)]);

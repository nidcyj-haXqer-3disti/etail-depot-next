import { sql } from "drizzle-orm";
import { pgTable, uuid, text, integer, timestamp, boolean, bigint, foreignKey, check, unique, uniqueIndex, index } from "drizzle-orm/pg-core";
import { services, serviceKind, serviceMembers, people } from "../../platform/database/schema";

/** One responsible Merchant service, with directly owned collection units. */
export const merchantUnits=pgTable("merchant_units",{
  id:uuid().primaryKey().defaultRandom(),kind:text({enum:["MASTER","SUB"]}).notNull(),
  masterId:uuid(),masterKind:text().notNull().default("MASTER"),masterServiceId:uuid().notNull(),masterServiceKind:serviceKind().notNull().default("MERCHANT"),
  displayName:text().notNull(),status:text({enum:["ACTIVE","PAUSED","CLOSED"]}).notNull().default("ACTIVE"),
  version:integer().notNull().default(1),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),updatedAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[
  uniqueIndex("merchant_unit_one_primary").on(t.masterServiceId).where(sql`${t.kind}='MASTER'`),
  unique("merchant_unit_parent_scope").on(t.id,t.kind,t.masterServiceId),
  unique("merchant_unit_service_scope").on(t.id,t.masterServiceId),
  foreignKey({columns:[t.masterServiceId,t.masterServiceKind],foreignColumns:[services.id,services.kind]}),
  foreignKey({columns:[t.masterId,t.masterKind,t.masterServiceId],foreignColumns:[t.id,t.kind,t.masterServiceId]}),
  check("merchant_unit_shape",sql`${t.masterKind}='MASTER' and ${t.masterServiceKind}='MERCHANT' and ((${t.kind}='MASTER' and ${t.masterId} is null) or (${t.kind}='SUB' and ${t.masterId} is not null and ${t.masterId}<>${t.id}))`),
  check("merchant_unit_status",sql`${t.status} in ('ACTIVE','PAUSED','CLOSED')`),
  check("merchant_unit_fields",sql`char_length(${t.displayName}) between 1 and 80 and ${t.version}>0`),
  index("merchant_units_primary").on(t.masterServiceId,t.id),
]);
export const merchantUnitEvents=pgTable("merchant_unit_events",{
  id:uuid().primaryKey().defaultRandom(),merchantUnitId:uuid().notNull().references(()=>merchantUnits.id),actorId:uuid().notNull().references(()=>people.id),
  kind:text({enum:["CREATED","PAUSED","RESUMED"]}).notNull(),reason:text().notNull().default(""),version:integer().notNull(),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[check("merchant_unit_event_kind",sql`${t.kind} in ('CREATED','PAUSED','RESUMED')`),check("merchant_unit_event_fields",sql`${t.version}>0 and char_length(${t.reason})<=300`)]);
export const merchantUnitCommands=pgTable("merchant_unit_commands",{
  commandId:uuid().primaryKey(),merchantUnitId:uuid().notNull().references(()=>merchantUnits.id),actorId:uuid().notNull().references(()=>people.id),
  kind:text({enum:["CREATE_SUB","PAUSE","RESUME"]}).notNull(),digest:text().notNull(),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[check("merchant_unit_command_kind",sql`${t.kind} in ('CREATE_SUB','PAUSE','RESUME')`),check("merchant_unit_command_digest",sql`${t.digest} ~ '^[0-9a-f]{64}$'`)]);

export const merchantProfiles=pgTable("merchant_profiles",{
  serviceId:uuid().primaryKey(),serviceKind:serviceKind().notNull().default("MERCHANT"),
  status:text({enum:["DRAFT","PENDING_LOCAL_REVIEW","APPROVED","RESTRICTED","DECLINED","CLOSED"]}).notNull().default("DRAFT"),
  fictional:boolean().notNull().default(true),
  version:integer().notNull().default(1),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),updatedAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[
  foreignKey({columns:[t.serviceId,t.serviceKind],foreignColumns:[services.id,services.kind]}),
  check("merchant_profile_merchant",sql`${t.serviceKind}='MERCHANT'`),
  check("merchant_profile_status",sql`${t.status} in ('DRAFT','PENDING_LOCAL_REVIEW','APPROVED','RESTRICTED','DECLINED','CLOSED')`),
  check("merchant_profile_fictional",sql`${t.fictional}=true`),check("merchant_profile_version",sql`${t.version}>0`),
]);
export const merchantApplications=pgTable("merchant_applications",{
  id:uuid().primaryKey().defaultRandom(),serviceId:uuid().notNull().unique().references(()=>merchantProfiles.serviceId),responsiblePersonId:uuid().notNull(),
  status:text({enum:["DRAFT","PENDING_LOCAL_REVIEW"]}).notNull().default("DRAFT"),
  legalEntityType:text({enum:["INDIVIDUAL","SOLE_PROPRIETOR","BUSINESS"]}),sellingName:text().notNull().default(""),legalName:text().notNull().default(""),activityDescription:text().notNull().default(""),country:text().notNull().default("US"),fictionalDetailsConfirmed:boolean().notNull().default(false),
  version:integer().notNull().default(1),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),updatedAt:timestamp({withTimezone:true}).notNull().defaultNow(),submittedAt:timestamp({withTimezone:true}),
},t=>[
  foreignKey({columns:[t.serviceId,t.responsiblePersonId],foreignColumns:[serviceMembers.serviceId,serviceMembers.personId]}),unique("merchant_application_scope").on(t.id,t.serviceId),
  check("merchant_application_status",sql`${t.status} in ('DRAFT','PENDING_LOCAL_REVIEW')`),check("merchant_application_entity",sql`${t.legalEntityType} is null or ${t.legalEntityType} in ('INDIVIDUAL','SOLE_PROPRIETOR','BUSINESS')`),
  check("merchant_application_fields",sql`char_length(${t.sellingName})<=80 and char_length(${t.legalName})<=100 and char_length(${t.activityDescription})<=500 and ${t.country}='US' and ${t.version}>0`),
  check("merchant_application_submission",sql`(${t.status}='DRAFT' and ${t.submittedAt} is null) or (${t.status}='PENDING_LOCAL_REVIEW' and ${t.submittedAt} is not null and ${t.legalEntityType} is not null and char_length(${t.sellingName})>0 and char_length(${t.legalName})>0 and char_length(${t.activityDescription})>0 and ${t.fictionalDetailsConfirmed}=true)`),
]);
export const merchantApplicationEvents=pgTable("merchant_application_events",{
  id:uuid().primaryKey().defaultRandom(),applicationId:uuid().notNull(),serviceId:uuid().notNull(),actorId:uuid().notNull(),
  kind:text({enum:["CREATED","SAVED","SUBMITTED_LOCAL"]}).notNull(),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[index("merchant_events_service_time").on(t.serviceId,t.applicationId,t.createdAt.desc(),t.id),foreignKey({columns:[t.applicationId,t.serviceId],foreignColumns:[merchantApplications.id,merchantApplications.serviceId]}),foreignKey({columns:[t.serviceId,t.actorId],foreignColumns:[serviceMembers.serviceId,serviceMembers.personId]}),check("merchant_application_event_kind",sql`${t.kind} in ('CREATED','SAVED','SUBMITTED_LOCAL')`)]);
export const merchantApplicationCommands=pgTable("merchant_application_commands",{
  commandId:uuid().primaryKey(),applicationId:uuid().notNull(),serviceId:uuid().notNull(),actorId:uuid().notNull(),kind:text({enum:["START","SAVE","SUBMIT"]}).notNull(),digest:text().notNull(),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[foreignKey({columns:[t.applicationId,t.serviceId],foreignColumns:[merchantApplications.id,merchantApplications.serviceId]}),foreignKey({columns:[t.serviceId,t.actorId],foreignColumns:[serviceMembers.serviceId,serviceMembers.personId]}),check("merchant_application_command_kind",sql`${t.kind} in ('START','SAVE','SUBMIT')`),check("merchant_application_digest",sql`${t.digest} ~ '^[0-9a-f]{64}$'`)]);
export const paymentChannels=pgTable("payment_channels",{
  id:uuid().primaryKey().defaultRandom(),serviceId:uuid().notNull().references(()=>merchantProfiles.serviceId),merchantUnitId:uuid().notNull(),creatorId:uuid().notNull().references(()=>people.id),
  creatorAssignmentId:uuid(),creatorBasis:text({enum:["PRIMARY_MEMBER","MERCHANT_ASSIGNMENT"]}).notNull().default("PRIMARY_MEMBER"),
  presentations:text().array().notNull().default(sql`ARRAY['WEB']::text[]`),visibility:text({enum:["CREATOR_PRIVATE","ASSIGNED"]}).notNull().default("CREATOR_PRIVATE"),
  description:text().notNull(),amountMinor:bigint({mode:"bigint"}).notNull(),currency:text().notNull().default("USD"),usage:text({enum:["ONE_TIME","REUSABLE"]}).notNull(),expiresAt:timestamp({withTimezone:true}).notNull(),status:text({enum:["DRAFT","CANCELED"]}).notNull().default("DRAFT"),version:integer().notNull().default(1),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),updatedAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[index("payment_channels_creator_time").on(t.serviceId,t.creatorId,t.updatedAt.desc(),t.id),index("payment_channels_unit_time").on(t.merchantUnitId,t.updatedAt.desc(),t.id),foreignKey({columns:[t.merchantUnitId,t.serviceId],foreignColumns:[merchantUnits.id,merchantUnits.masterServiceId]}),unique("payment_channel_merchant_scope").on(t.id,t.merchantUnitId,t.serviceId),unique("payment_channel_scope").on(t.id,t.serviceId,t.creatorId),check("payment_channel_fields",sql`char_length(${t.description}) between 1 and 160 and ${t.amountMinor}>0 and ${t.amountMinor}<=999999999999 and ${t.currency}='USD' and ${t.version}>0`),check("payment_channel_usage",sql`${t.usage} in ('ONE_TIME','REUSABLE')`),check("payment_channel_status",sql`${t.status} in ('DRAFT','CANCELED')`),check("payment_channel_presentations",sql`cardinality(${t.presentations}) between 1 and 7 and ${t.presentations} <@ ARRAY['SMS','EMAIL','INVOICE','BILL','SOCIAL','QR','WEB']::text[]`),check("payment_channel_visibility",sql`${t.visibility} in ('CREATOR_PRIVATE','ASSIGNED')`),check("payment_channel_creator_basis",sql`${t.creatorBasis} in ('PRIMARY_MEMBER','MERCHANT_ASSIGNMENT') and ((${t.creatorBasis}='MERCHANT_ASSIGNMENT' and ${t.creatorAssignmentId} is not null) or (${t.creatorBasis}<>'MERCHANT_ASSIGNMENT' and ${t.creatorAssignmentId} is null))`)]);
export const paymentChannelCommands=pgTable("payment_channel_commands",{
  commandId:uuid().primaryKey(),channelId:uuid().notNull().references(()=>paymentChannels.id),serviceId:uuid().notNull().references(()=>merchantProfiles.serviceId),merchantUnitId:uuid().notNull().references(()=>merchantUnits.id),actorId:uuid().notNull().references(()=>people.id),kind:text({enum:["CREATE","UPDATE","CANCEL"]}).notNull(),digest:text().notNull(),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[foreignKey({columns:[t.channelId,t.merchantUnitId,t.serviceId],foreignColumns:[paymentChannels.id,paymentChannels.merchantUnitId,paymentChannels.serviceId]}),check("payment_channel_command_kind",sql`${t.kind} in ('CREATE','UPDATE','CANCEL')`),check("payment_channel_digest",sql`${t.digest} ~ '^[0-9a-f]{64}$'`)]);

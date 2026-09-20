import {sql} from "drizzle-orm";
import {pgTable,uuid,text,integer,timestamp,bigint,foreignKey,check,unique,uniqueIndex,index} from "drizzle-orm/pg-core";
import {people} from "../../platform/database/schema";
import {paymentChannels} from "./schema";

/** Publication locators are intentionally public. Only the reviewed payer-safe snapshot is exposed. */
export const guestPublications=pgTable("merchant_guest_publications",{
 id:uuid().primaryKey(),channelId:uuid().notNull(),merchantUnitId:uuid().notNull(),serviceId:uuid().notNull(),publisherId:uuid().notNull().references(()=>people.id),authorityDigest:text().notNull(),requestDigest:text().notNull(),
 channelVersion:integer().notNull(),activationVersion:integer().notNull(),gatewayVersion:integer().notNull(),enrollmentVersion:integer().notNull(),
 merchantName:text().notNull(),primaryMerchantName:text().notNull(),description:text().notNull(),amountMinor:bigint({mode:"bigint"}).notNull(),currency:text().notNull().default("USD"),usage:text({enum:["ONE_TIME","REUSABLE"]}).notNull(),
 version:integer().notNull().default(1),revokedAt:timestamp({withTimezone:true}),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),expiresAt:timestamp({withTimezone:true}).notNull(),
},t=>[foreignKey({columns:[t.channelId,t.merchantUnitId,t.serviceId],foreignColumns:[paymentChannels.id,paymentChannels.merchantUnitId,paymentChannels.serviceId]}),unique("guest_publication_scope").on(t.id,t.channelId,t.merchantUnitId,t.serviceId),
 index("guest_publication_channel").on(t.channelId,t.createdAt.desc(),t.id),uniqueIndex("guest_publication_one_current").on(t.channelId).where(sql`${t.revokedAt} is null`),check("guest_publication_fields",sql`${t.authorityDigest} ~ '^[a-f0-9]{64}$' and ${t.requestDigest} ~ '^[a-f0-9]{64}$' and ${t.channelVersion}>0 and ${t.activationVersion}>0 and ${t.gatewayVersion}>0 and ${t.enrollmentVersion}>0 and ${t.version}>0 and ${t.amountMinor}>0 and ${t.amountMinor}<=999999999999 and ${t.currency}='USD' and ${t.usage} in ('ONE_TIME','REUSABLE') and ${t.expiresAt}>${t.createdAt}`)]);
export const guestPublicationCommands=pgTable("merchant_guest_publication_commands",{
 commandId:uuid().primaryKey(),publicationId:uuid().notNull().references(()=>guestPublications.id),actorId:uuid().notNull().references(()=>people.id),kind:text({enum:["PUBLISH","REVOKE"]}).notNull(),digest:text().notNull(),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[check("guest_publication_command_digest",sql`${t.digest} ~ '^[a-f0-9]{64}$' and ${t.kind} in ('PUBLISH','REVOKE')`)]);
/** A guest session grants order-only authority and is unrelated to people or service membership. */
export const guestSessions=pgTable("merchant_guest_sessions",{
 id:uuid().primaryKey(),tokenHash:text().notNull().unique(),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),expiresAt:timestamp({withTimezone:true}).notNull(),
},t=>[check("guest_session_fields",sql`${t.tokenHash} ~ '^[a-f0-9]{64}$' and ${t.expiresAt}>${t.createdAt}`)]);
export const guestOrders=pgTable("merchant_guest_orders",{
 id:uuid().primaryKey(),guestSessionId:uuid().notNull().references(()=>guestSessions.id),publicationId:uuid().notNull(),channelId:uuid().notNull(),merchantUnitId:uuid().notNull(),serviceId:uuid().notNull(),
 channelVersion:integer().notNull(),description:text().notNull(),merchantName:text().notNull(),primaryMerchantName:text().notNull(),amountMinor:bigint({mode:"bigint"}).notNull(),currency:text().notNull().default("USD"),usage:text({enum:["ONE_TIME","REUSABLE"]}).notNull(),
 createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),expiresAt:timestamp({withTimezone:true}).notNull(),
},t=>[foreignKey({columns:[t.publicationId,t.channelId,t.merchantUnitId,t.serviceId],foreignColumns:[guestPublications.id,guestPublications.channelId,guestPublications.merchantUnitId,guestPublications.serviceId]}),unique("guest_order_payment_scope").on(t.id,t.channelId,t.merchantUnitId,t.serviceId),index("guest_orders_session").on(t.guestSessionId,t.createdAt.desc(),t.id),check("guest_order_fields",sql`${t.channelVersion}>0 and ${t.amountMinor}>0 and ${t.amountMinor}<=999999999999 and ${t.currency}='USD' and ${t.usage} in ('ONE_TIME','REUSABLE') and ${t.expiresAt}>${t.createdAt}`)]);
export const guestAttempts=pgTable("merchant_guest_attempts",{
 id:uuid().primaryKey(),orderId:uuid().notNull().references(()=>guestOrders.id),sequence:integer().notNull(),outcome:text({enum:["APPROVED","DECLINED"]}).notNull(),requestDigest:text().notNull(),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[unique("guest_attempt_order_sequence").on(t.orderId,t.sequence),check("guest_attempt_fields",sql`${t.sequence}>0 and ${t.sequence}<=20 and ${t.outcome} in ('APPROVED','DECLINED') and ${t.requestDigest} ~ '^[a-f0-9]{64}$'`)]);
export const guestRequestBudgets=pgTable("merchant_guest_request_budgets",{
 key:text().primaryKey(),attempts:integer().notNull(),windowStartedAt:timestamp({withTimezone:true}).notNull(),
},t=>[check("guest_budget_fields",sql`${t.key} ~ '^[a-f0-9]{64}$' and ${t.attempts}>0 and ${t.attempts}<=600`)]);

import {sql} from "drizzle-orm";
import {pgTable,uuid,text,bigint,integer,timestamp,jsonb,check,uniqueIndex,foreignKey} from "drizzle-orm/pg-core";
import {people} from "../../platform/database/schema";
import {guestPublications,guestSessions} from "./guest-schema";
import {merchantTerminals,paymentChannels} from "./schema";
import {ledgerJournals} from "../ledger/schema";
import type {NetworkEvent} from "./network-contracts";
/** Immutable instructions exist before an adapter can create any external effect. */
export const networkPaymentOperations=pgTable("network_payment_operations",{
 id:uuid().primaryKey(),guestSessionId:uuid().notNull().references(()=>guestSessions.id),publicationId:uuid().notNull().references(()=>guestPublications.id),
 serviceId:uuid().notNull(),terminalId:uuid().notNull(),channelId:uuid().notNull(),channelVersion:integer().notNull(),channelUsage:text({enum:["ONE_TIME","REUSABLE"]}).notNull(),gatewayVersion:integer().notNull(),enrollmentVersion:integer().notNull(),
 provider:text().notNull(),mode:text().notNull(),providerAccount:text().notNull(),instrumentId:text({enum:["visa","mastercard","amex","discover"]}).notNull(),
 amountMinor:bigint({mode:"bigint"}).notNull(),feeMinor:bigint({mode:"bigint"}).notNull(),currency:text().notNull(),requestDigest:text().notNull(),description:text().notNull(),merchantName:text().notNull(),businessName:text().notNull(),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[foreignKey({columns:[t.channelId,t.terminalId,t.serviceId],foreignColumns:[paymentChannels.id,paymentChannels.merchantUnitId,paymentChannels.serviceId]}),uniqueIndex("network_one_time_reservation").on(t.channelId).where(sql`${t.channelUsage}='ONE_TIME'`),check("network_payment_fields",sql`${t.provider}='ETAIL_SANDBOX_NETWORK' and ${t.mode}='SANDBOX' and ${t.providerAccount}='sandbox:'||${t.serviceId}::text and ${t.instrumentId} in ('visa','mastercard','amex','discover') and ${t.amountMinor}>0 and ${t.amountMinor}<=999999999999 and ${t.feeMinor}=0 and ${t.currency}='USD' and ${t.requestDigest} ~ '^[0-9a-f]{64}$' and ${t.channelVersion}>0 and ${t.gatewayVersion}>0 and ${t.enrollmentVersion}>0`)]);
export const networkRefundOperations=pgTable("network_refund_operations",{
 id:uuid().primaryKey(),paymentOperationId:uuid().notNull().references(()=>networkPaymentOperations.id),actorId:uuid().notNull().references(()=>people.id),serviceId:uuid().notNull(),terminalId:uuid().notNull(),
 provider:text().notNull(),mode:text().notNull(),providerAccount:text().notNull(),providerPaymentId:text().notNull(),amountMinor:bigint({mode:"bigint"}).notNull(),feeMinor:bigint({mode:"bigint"}).notNull(),currency:text().notNull(),
 sourceBucket:text({enum:["MERCHANT_AVAILABLE","MERCHANT_SETTLED","MONEY_AVAILABLE"]}).notNull(),reason:text().notNull(),requestDigest:text().notNull(),reservationJournalId:uuid().notNull().unique().references(()=>ledgerJournals.id),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[foreignKey({columns:[t.terminalId,t.serviceId],foreignColumns:[merchantTerminals.id,merchantTerminals.merchantServiceId]}),check("network_refund_fields",sql`${t.provider}='ETAIL_SANDBOX_NETWORK' and ${t.mode}='SANDBOX' and ${t.providerAccount}='sandbox:'||${t.serviceId}::text and ${t.amountMinor}>0 and ${t.feeMinor}=0 and ${t.currency}='USD' and ${t.sourceBucket} in ('MERCHANT_AVAILABLE','MERCHANT_SETTLED','MONEY_AVAILABLE') and char_length(${t.reason}) between 1 and 300 and ${t.requestDigest} ~ '^[0-9a-f]{64}$'`)]);
/** Only normalized, verified provider events enter this immutable inbox. */
export const networkEvents=pgTable("network_events",{
 id:text().primaryKey(),operationId:uuid().notNull(),kind:text({enum:["PAYMENT","REFUND"]}).notNull(),type:text({enum:["CAPTURED","FUNDS_AVAILABLE","REFUND_SUCCEEDED","REFUND_FAILED"]}).notNull(),payload:jsonb().$type<NetworkEvent>().notNull(),digest:text().notNull(),receivedAt:timestamp({withTimezone:true}).notNull(),
},t=>[uniqueIndex("network_one_event_type").on(t.operationId,t.type),check("network_event_fields",sql`${t.digest} ~ '^[0-9a-f]{64}$' and ((${t.kind}='PAYMENT' and ${t.type} in ('CAPTURED','FUNDS_AVAILABLE')) or (${t.kind}='REFUND' and ${t.type} in ('REFUND_SUCCEEDED','REFUND_FAILED')))`)]);
/** Reconciliation markers are separate append-only records; order of receipt is not order of processing. */
export const networkEventEffects=pgTable("network_event_effects",{
 eventId:text().primaryKey().references(()=>networkEvents.id),journalId:uuid().notNull().unique().references(()=>ledgerJournals.id),createdAt:timestamp({withTimezone:true}).notNull(),
});

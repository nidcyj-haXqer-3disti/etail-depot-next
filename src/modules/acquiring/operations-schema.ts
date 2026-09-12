import { sql } from "drizzle-orm";
import { pgTable, uuid, text, integer, timestamp, bigint, foreignKey, check, unique, uniqueIndex, index } from "drizzle-orm/pg-core";
import { people,serviceActivity } from "../../platform/database/schema";
import { ledgerJournals } from "../ledger/schema";
import { merchantProfiles, merchantUnits, paymentChannels } from "./schema";
import {cardCheckoutAttempts} from "./card-checkout-schema";
import { guestOrders } from "./guest-schema";

export const testGateways=pgTable("merchant_test_gateways",{
  serviceId:uuid().primaryKey().references(()=>merchantProfiles.serviceId),mode:text({enum:["TEST_READY","DISABLED"]}).notNull(),
  processor:text().notNull().default("ETAIL_TEST"),version:integer().notNull().default(1),updatedBy:uuid().notNull().references(()=>people.id),
  createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),updatedAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[check("test_gateway_fields",sql`${t.mode} in ('TEST_READY','DISABLED') and ${t.processor}='ETAIL_TEST' and ${t.version}>0`)]);
export const testMerchantEnrollments=pgTable("merchant_test_enrollments",{
  merchantUnitId:uuid().primaryKey(),serviceId:uuid().notNull().references(()=>testGateways.serviceId),status:text({enum:["ENROLLED","DISABLED"]}).notNull(),
  version:integer().notNull().default(1),updatedBy:uuid().notNull().references(()=>people.id),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),updatedAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[foreignKey({columns:[t.merchantUnitId,t.serviceId],foreignColumns:[merchantUnits.id,merchantUnits.masterServiceId]}),unique("test_enrollment_scope").on(t.merchantUnitId,t.serviceId),check("test_enrollment_fields",sql`${t.status} in ('ENROLLED','DISABLED') and ${t.version}>0`)]);
export const channelActivations=pgTable("merchant_channel_activations",{
  channelId:uuid().primaryKey(),merchantUnitId:uuid().notNull(),serviceId:uuid().notNull(),status:text({enum:["ACTIVE","DISABLED"]}).notNull(),
  version:integer().notNull().default(1),updatedBy:uuid().notNull().references(()=>people.id),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),updatedAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[foreignKey({columns:[t.channelId,t.merchantUnitId,t.serviceId],foreignColumns:[paymentChannels.id,paymentChannels.merchantUnitId,paymentChannels.serviceId]}),check("channel_activation_fields",sql`${t.status} in ('ACTIVE','DISABLED') and ${t.version}>0`)]);
export const merchantTestPayments=pgTable("merchant_test_payments",{
  id:uuid().primaryKey(),serviceId:uuid().notNull(),merchantUnitId:uuid().notNull(),channelId:uuid().notNull(),actorId:uuid().references(()=>people.id),guestOrderId:uuid(),cardCheckoutId:uuid().unique().references(()=>cardCheckoutAttempts.id),cardActivityId:uuid().unique().references(()=>serviceActivity.id),
  channelVersion:integer().notNull(),channelUsage:text({enum:["ONE_TIME","REUSABLE"]}).notNull(),description:text().notNull(),
  amountMinor:bigint({mode:"bigint"}).notNull(),currency:text().notNull().default("USD"),outcome:text({enum:["APPROVED","DECLINED"]}).notNull(),
  testReference:text().notNull().unique(),gatewayVersion:integer().notNull(),enrollmentVersion:integer().notNull(),journalId:uuid().references(()=>ledgerJournals.id),
  createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[foreignKey({columns:[t.channelId,t.merchantUnitId,t.serviceId],foreignColumns:[paymentChannels.id,paymentChannels.merchantUnitId,paymentChannels.serviceId]}),unique("merchant_test_payment_scope").on(t.id,t.merchantUnitId,t.serviceId),foreignKey({columns:[t.guestOrderId,t.channelId,t.merchantUnitId,t.serviceId],foreignColumns:[guestOrders.id,guestOrders.channelId,guestOrders.merchantUnitId,guestOrders.serviceId]}),check("merchant_payment_actor_origin",sql`(num_nonnulls(${t.actorId},${t.guestOrderId},${t.cardCheckoutId})=1) and ((${t.cardCheckoutId} is null and ${t.cardActivityId} is null) or (${t.cardCheckoutId} is not null and ${t.cardActivityId} is not null and ${t.outcome}='APPROVED'))`),uniqueIndex("guest_order_one_approved_payment").on(t.guestOrderId).where(sql`${t.guestOrderId} is not null and ${t.outcome}='APPROVED'`),uniqueIndex("merchant_channel_one_approved_use").on(t.channelId).where(sql`${t.channelUsage}='ONE_TIME' and ${t.outcome}='APPROVED'`),index("merchant_test_payment_unit_time").on(t.merchantUnitId,t.createdAt.desc(),t.id),check("merchant_test_payment_fields",sql`${t.amountMinor}>0 and ${t.amountMinor}<=999999999999 and ${t.currency}='USD' and ${t.channelVersion}>0 and ${t.gatewayVersion}>0 and ${t.enrollmentVersion}>0 and ${t.channelUsage} in ('ONE_TIME','REUSABLE') and char_length(${t.description}) between 1 and 160 and ${t.testReference} like 'TEST-%' and ((${t.outcome}='APPROVED' and ${t.journalId} is not null) or (${t.outcome}='DECLINED' and ${t.journalId} is null))`)]);
export const merchantTestRefunds=pgTable("merchant_test_refunds",{
  id:uuid().primaryKey(),paymentId:uuid().notNull().unique(),merchantUnitId:uuid().notNull(),serviceId:uuid().notNull(),actorId:uuid().notNull().references(()=>people.id),
  amountMinor:bigint({mode:"bigint"}).notNull(),currency:text().notNull().default("USD"),reason:text().notNull(),testReference:text().notNull().unique(),journalId:uuid().notNull().references(()=>ledgerJournals.id),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[foreignKey({columns:[t.paymentId,t.merchantUnitId,t.serviceId],foreignColumns:[merchantTestPayments.id,merchantTestPayments.merchantUnitId,merchantTestPayments.serviceId]}),check("merchant_test_refund_fields",sql`${t.amountMinor}>0 and ${t.currency}='USD' and char_length(${t.reason}) between 1 and 300 and ${t.testReference} like 'TEST-%'`)]);
export const merchantTestPayouts=pgTable("merchant_test_payouts",{
  id:uuid().primaryKey(),serviceId:uuid().notNull(),merchantUnitId:uuid().notNull(),actorId:uuid().notNull().references(()=>people.id),amountMinor:bigint({mode:"bigint"}).notNull(),currency:text().notNull().default("USD"),testReference:text().notNull().unique(),journalId:uuid().notNull().references(()=>ledgerJournals.id),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[foreignKey({columns:[t.merchantUnitId,t.serviceId],foreignColumns:[merchantUnits.id,merchantUnits.masterServiceId]}),index("merchant_test_payout_unit_time").on(t.merchantUnitId,t.createdAt.desc(),t.id),check("merchant_test_payout_fields",sql`${t.amountMinor}>0 and ${t.amountMinor}<=999999999999 and ${t.currency}='USD' and ${t.testReference} like 'TEST-%'`)]);
export const merchantOperationCommands=pgTable("merchant_operation_commands",{
  commandId:uuid().primaryKey(),actorId:uuid().references(()=>people.id),guestOrderId:uuid().references(()=>guestOrders.id),scopeKey:text().notNull(),kind:text({enum:["GATEWAY","ENROLLMENT","ACTIVATION","PAYMENT","REFUND","PAYOUT"]}).notNull(),digest:text().notNull(),resultId:uuid().notNull(),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[check("merchant_operation_actor_origin",sql`(${t.actorId} is not null and ${t.guestOrderId} is null) or (${t.actorId} is null and ${t.guestOrderId} is not null and ${t.kind}='PAYMENT' and ${t.scopeKey}='guest-order:'||${t.guestOrderId}::text)`),check("merchant_operation_command_fields",sql`${t.kind} in ('GATEWAY','ENROLLMENT','ACTIVATION','PAYMENT','REFUND','PAYOUT') and ${t.digest} ~ '^[0-9a-f]{64}$' and char_length(${t.scopeKey}) between 1 and 120`)]);

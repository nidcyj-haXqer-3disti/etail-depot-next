import {sql} from "drizzle-orm";
import {pgTable,uuid,text,integer,timestamp,bigint,foreignKey,check,unique,index} from "drizzle-orm/pg-core";
import {people} from "../../platform/database/schema";
import {merchantTerminals} from "../acquiring/schema";
import {merchantTestPayments} from "../acquiring/operations-schema";

/** Payment disputes are distinct from private customer support and never move money. */
export const merchantDisputes=pgTable("merchant_disputes",{
 id:uuid().primaryKey(),paymentId:uuid().notNull().unique(),terminalId:uuid().notNull(),serviceId:uuid().notNull(),payerId:uuid().notNull().references(()=>people.id),
 reason:text({enum:["NOT_RECEIVED","NOT_AS_DESCRIBED","DUPLICATE","OTHER"]}).notNull(),amountMinor:bigint({mode:"bigint"}).notNull(),
 status:text({enum:["NEEDS_RESPONSE","IN_REVIEW","RESOLVED"]}).notNull().default("NEEDS_RESPONSE"),resolution:text({enum:["CLOSED_NO_REFUND","REFUND_RECOMMENDED"]}),
 version:integer().notNull().default(1),createdAt:timestamp({withTimezone:true}).notNull(),updatedAt:timestamp({withTimezone:true}).notNull(),
},t=>[foreignKey({columns:[t.paymentId,t.terminalId,t.serviceId],foreignColumns:[merchantTestPayments.id,merchantTestPayments.merchantUnitId,merchantTestPayments.serviceId]}),foreignKey({columns:[t.terminalId,t.serviceId],foreignColumns:[merchantTerminals.id,merchantTerminals.merchantServiceId]}),unique("dispute_terminal_scope").on(t.id,t.terminalId,t.serviceId),check("dispute_values",sql`${t.amountMinor}>0 and ${t.version}>0 and ${t.reason} in ('NOT_RECEIVED','NOT_AS_DESCRIBED','DUPLICATE','OTHER') and ${t.status} in ('NEEDS_RESPONSE','IN_REVIEW','RESOLVED')`),check("dispute_resolution_shape",sql`(${t.status}='RESOLVED' and ${t.resolution} in ('CLOSED_NO_REFUND','REFUND_RECOMMENDED')) or (${t.status}<>'RESOLVED' and ${t.resolution} is null)`),index("dispute_terminal_updated").on(t.terminalId,t.updatedAt)]);
export const merchantDisputeMessages=pgTable("merchant_dispute_messages",{
 id:uuid().primaryKey(),disputeId:uuid().notNull().references(()=>merchantDisputes.id),actorId:uuid().notNull().references(()=>people.id),
 kind:text({enum:["OPENED","RESPONSE","MORE_INFORMATION","RESOLVED"]}).notNull(),authorRole:text({enum:["PAYER","OWNER","TERMINAL_USER","OPERATOR"]}).notNull(),
 message:text().notNull(),evidence:text().notNull().default(""),sequence:integer().notNull(),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[unique("dispute_message_sequence").on(t.disputeId,t.sequence),check("dispute_message_fields",sql`${t.sequence}>0 and char_length(trim(${t.message})) between 1 and 2000 and char_length(${t.evidence})<=4000 and ${t.kind} in ('OPENED','RESPONSE','MORE_INFORMATION','RESOLVED') and ${t.authorRole} in ('PAYER','OWNER','TERMINAL_USER','OPERATOR')`)]);
export const merchantDisputeCommands=pgTable("merchant_dispute_commands",{
 commandId:uuid().primaryKey(),disputeId:uuid().notNull().references(()=>merchantDisputes.id),actorId:uuid().notNull().references(()=>people.id),kind:text().notNull(),digest:text().notNull(),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[check("dispute_command_values",sql`${t.kind} in ('OPEN','RESPOND','REVIEW') and ${t.digest} ~ '^[0-9a-f]{64}$'`)]);

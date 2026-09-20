import {sql} from "drizzle-orm";
import {pgTable,uuid,bigint,integer,timestamp,foreignKey,check} from "drizzle-orm/pg-core";
import {people,cards} from "../../platform/database/schema";
import {guestPublications} from "./guest-schema";
export const cardCheckoutAttempts=pgTable("card_checkout_attempts",{
 id:uuid().primaryKey(),publicationId:uuid().notNull().references(()=>guestPublications.id),payerId:uuid().notNull().references(()=>people.id),
 cardServiceId:uuid().notNull(),cardId:uuid().notNull(),expectedCardVersion:integer().notNull(),amountMinor:bigint({mode:"bigint"}).notNull(),confirmCommandId:uuid().notNull().unique(),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[foreignKey({columns:[t.cardId,t.cardServiceId],foreignColumns:[cards.id,cards.serviceId]}),check("card_checkout_fields",sql`${t.expectedCardVersion}>0 and ${t.amountMinor} between 1 and 999999999999`)]);

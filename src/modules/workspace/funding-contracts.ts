import {z} from "zod";
import type {Money} from "./contracts";

const amount=z.string().regex(/^(0|[1-9][0-9]{0,11})$/);
export const topupCommandSchema=z.object({commandId:z.uuid(),amountMinor:amount.refine(value=>BigInt(value)>0n),currency:z.literal("USD"),source:z.literal("SANDBOX_BANK")}).strict();
export const spendingLimitCommandSchema=z.object({commandId:z.uuid(),expectedVersion:z.number().int().min(0),monthlyLimitMinor:amount}).strict();
export type TopupCommand=z.infer<typeof topupCommandSchema>;
export type SpendingLimitCommand=z.infer<typeof spendingLimitCommandSchema>;
export interface PersonSpending {
 personId:string;monthlyLimit:Money;spentThisMonth:Money;remainingThisMonth:Money;available:Money;version:number;periodStart:string;periodEnd:string;timeZone:"UTC";
}
export interface TopupReceipt {id:string;serviceId:string;amount:Money;source:"SANDBOX_BANK";sourceLabel:string;status:"COMPLETED";createdAt:string;reference:string}
export interface FundingIntent {id:string;serviceId:string;amount:Money;sourceLabel:string;createdAt:string;receipt:TopupReceipt|null}
export interface CardholderFunds {serviceId:string;serviceName:string;available:Money;source:"SANDBOX_BANK";sourceLabel:string;topups:TopupReceipt[];page:number;hasMore:boolean;people:Array<{id:string;name:string;spending:PersonSpending}>}

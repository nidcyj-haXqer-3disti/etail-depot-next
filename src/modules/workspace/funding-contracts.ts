import {z} from "zod";
import type {Money} from "./contracts";

const amount=z.string().regex(/^(0|[1-9][0-9]{0,11})$/);
export const topupCommandSchema=z.object({commandId:z.uuid(),amountMinor:amount.refine(value=>/^(0|[1-9][0-9]{0,11})$/.test(value)&&BigInt(value)>0n),currency:z.literal("USD"),source:z.literal("SANDBOX_BANK")}).strict();
export const spendingLimitCommandSchema=z.object({commandId:z.uuid(),expectedVersion:z.number().int().min(0),allowanceMinor:amount}).strict();
export type TopupCommand=z.infer<typeof topupCommandSchema>;
export type SpendingLimitCommand=z.infer<typeof spendingLimitCommandSchema>;
export interface CardSpending {
 cardId:string;reviewRequired:boolean;allowance:Money;used:Money;remaining:Money;available:Money;version:number;
}
export interface TopupReceipt {id:string;serviceId:string;amount:Money;source:"SANDBOX_BANK";sourceLabel:string;status:"COMPLETED";createdAt:string;reference:string}
export interface FundingIntent {id:string;receiptId:string;serviceId:string;amount:Money;sourceLabel:string;createdAt:string;receipt:TopupReceipt|null}
export interface CardholderFunds {serviceId:string;moneyAccountId:string;serviceName:string;available:Money;source:"SANDBOX_BANK";sourceLabel:string;topups:TopupReceipt[];page:number;hasMore:boolean;cards:Array<{id:string;name:string;holderName:string;spending:CardSpending}>}

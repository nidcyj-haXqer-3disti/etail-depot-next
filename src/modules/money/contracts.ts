import {z} from "zod";
import type {Money} from "../workspace/contracts";

export const moneyAmountSchema=z.string().regex(/^[1-9][0-9]{0,11}$/);
export const moneyCommandSchema=z.object({commandId:z.uuid(),amountMinor:moneyAmountSchema}).strict();
export const processMoneyWithdrawalSchema=z.object({commandId:z.uuid(),outcome:z.enum(["COMPLETED","FAILED"])}).strict();
export type MoneyCommand=z.infer<typeof moneyCommandSchema>;
export type ProcessMoneyWithdrawal=z.infer<typeof processMoneyWithdrawalSchema>;
export interface MoneyTopupReceipt {id:string;moneyAccountId:string;amount:Money;source:"SANDBOX_BANK";sourceLabel:string;status:"COMPLETED";createdAt:string;reference:string}
export interface MoneyFundingIntent {id:string;moneyAccountId:string;receiptId:string;amount:Money;sourceLabel:string;createdAt:string;receipt:MoneyTopupReceipt|null}
export interface MoneyWithdrawalReceipt {id:string;intentId:string;moneyAccountId:string;amount:Money;destinationLabel:string;status:"PENDING"|"COMPLETED"|"FAILED";createdAt:string;completedAt:string|null;reference:string}
export interface MoneyWithdrawalIntent {id:string;moneyAccountId:string;amount:Money;destinationLabel:string;createdAt:string;receipt:MoneyWithdrawalReceipt|null}
export interface OwnedMoneyAccount {id:string;displayName:string;serviceKind:"CARDHOLDER"|"MERCHANT";currency:"USD";status:"ACTIVE"|"SUSPENDED"|"CLOSED";version:number;services:{id:string;kind:"CARDHOLDER"|"MERCHANT";displayName:string}[];available:Money;pendingWithdrawals:Money}
export interface MoneyAccountOverview extends OwnedMoneyAccount {history:{id:string;kind:string;label:string;amount:Money;createdAt:string;referenceId:string;href:string|null}[];withdrawals:MoneyWithdrawalReceipt[];withdrawalsHasMore:boolean;page:number;hasMore:boolean;canAddMoney:boolean;canWithdraw:boolean}

import { z } from "zod";
import type { Money } from "../workspace/contracts";
import {merchantActivityProjectionSchema,type MerchantActivityProjection} from "./activity-contracts";
export {primaryMerchantResultSchema} from "../../shared/merchant-response";
export const merchantCollectionAvailabilitySchema=z.object({
 code:z.enum(["PAUSED","SETUP_REQUIRED","OWNER_ACTION_REQUIRED","ACCESS_RESTRICTED","CHANNEL_REQUIRED","CHANNEL_REVIEW_REQUIRED","READY"]),
 title:z.string(),description:z.string(),action:z.object({label:z.string(),href:z.string()}).strict().nullable(),
}).strict();
export type MerchantCollectionAvailability=z.infer<typeof merchantCollectionAvailabilitySchema>;
export interface MerchantDashboardTotals {collected:Money|null;refunded:Money|null;transferred:Money|null;available:Money|null;settled:Money|null;pending:Money|null;bank:Money|null;channelCount:number|null;activeChannelCount:number|null}
export interface MerchantDashboardUnit {
 id:string;name:string;merchantServiceId:string;merchantName:string;ownerAccess:boolean;
 status:"ACTIVE"|"PAUSED"|"CLOSED";canOpen:boolean;canAddTerminal:boolean;canCreateChannel:boolean;canReadPeople:boolean;
 setupState:"NOT_CONFIGURED"|"DISABLED"|"NOT_ENROLLED"|"PAUSED"|"READY";totals:MerchantDashboardTotals;
 collectionAvailability:MerchantCollectionAvailability;
}
export interface MerchantDashboardPayment {id:string;merchantId:string;merchantName:string;description:string;amount:Money;status:"APPROVED"|"DECLINED"|"REFUNDED";reference:string;at:string}
export interface MerchantDashboardTransfer {status:"PENDING"|"COMPLETED"|"FAILED";id:string;merchantId:string;merchantName:string;amount:Money;reference:string;at:string}
export interface MerchantDashboardView {id:string;name:string;description:string;unitIds:string[];totals:MerchantDashboardTotals;payments:MerchantDashboardPayment[];transfers:MerchantDashboardTransfer[];paymentsHasMore:boolean;transfersHasMore:boolean}
export interface MerchantDashboardProjection {processingPayments?:{id:string;terminalId:string;terminalName:string;description:string;amount:Money}[];mode:"TEST";canCreateMerchant:boolean;merchants:{serviceId:string;name:string;ownerAccess:boolean;unitIds:string[]}[];moneyAccounts:{id:string;name:string;available:Money;merchantServiceIds:string[]}[];units:MerchantDashboardUnit[];views:MerchantDashboardView[];activity:MerchantActivityProjection}
const money=z.object({minor:z.string(),currency:z.literal("USD"),formatted:z.string()}).strict();
const totals=z.object({collected:money.nullable(),refunded:money.nullable(),transferred:money.nullable(),available:money.nullable(),settled:money.nullable(),pending:money.nullable(),bank:money.nullable(),channelCount:z.int().nonnegative().nullable(),activeChannelCount:z.int().nonnegative().nullable()}).strict();
export const merchantDashboardProjectionSchema=z.object({processingPayments:z.array(z.object({id:z.uuid(),terminalId:z.uuid(),terminalName:z.string(),description:z.string(),amount:money}).strict()).optional(),activity:merchantActivityProjectionSchema,mode:z.literal("TEST"),canCreateMerchant:z.boolean(),merchants:z.array(z.object({serviceId:z.uuid(),name:z.string(),ownerAccess:z.boolean(),unitIds:z.array(z.uuid())}).strict()),moneyAccounts:z.array(z.object({id:z.uuid(),name:z.string(),available:money,merchantServiceIds:z.array(z.uuid())}).strict()),units:z.array(z.object({id:z.uuid(),name:z.string(),merchantServiceId:z.uuid(),merchantName:z.string(),ownerAccess:z.boolean(),status:z.enum(["ACTIVE","PAUSED","CLOSED"]),canOpen:z.boolean(),canAddTerminal:z.boolean(),canCreateChannel:z.boolean(),canReadPeople:z.boolean(),setupState:z.enum(["NOT_CONFIGURED","DISABLED","NOT_ENROLLED","PAUSED","READY"]),collectionAvailability:merchantCollectionAvailabilitySchema,totals}).strict()),views:z.array(z.object({id:z.string(),name:z.string(),description:z.string(),unitIds:z.array(z.uuid()),totals,payments:z.array(z.object({id:z.uuid(),merchantId:z.uuid(),merchantName:z.string(),description:z.string(),amount:money,status:z.enum(["APPROVED","DECLINED","REFUNDED"]),reference:z.string(),at:z.iso.datetime()}).strict()),transfers:z.array(z.object({status:z.enum(["PENDING","COMPLETED","FAILED"]),id:z.uuid(),merchantId:z.uuid(),merchantName:z.string(),amount:money,reference:z.string(),at:z.iso.datetime()}).strict()),paymentsHasMore:z.boolean(),transfersHasMore:z.boolean()}).strict())}).strict();

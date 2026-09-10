import { z } from "zod";
import type { Money } from "../workspace/contracts";
export const primaryMerchantResultSchema=z.object({merchantId:z.uuid(),status:z.literal("DRAFT"),nextHref:z.string()}).strict();
export interface MerchantDashboardTotals {collected:Money|null;refunded:Money|null;transferred:Money|null;available:Money|null;channelCount:number|null;activeChannelCount:number|null}
export interface MerchantDashboardUnit {
 id:string;name:string;kind:"MASTER"|"SUB";primaryId:string;primaryName:string;primaryAccess:boolean;
 status:"ACTIVE"|"PAUSED"|"CLOSED";canOpen:boolean;canAddSubmerchant:boolean;canCreateChannel:boolean;
 setupState:"NOT_CONFIGURED"|"DISABLED"|"NOT_ENROLLED"|"PAUSED"|"READY";totals:MerchantDashboardTotals;
}
export interface MerchantDashboardPayment {id:string;merchantId:string;merchantName:string;description:string;amount:Money;status:"APPROVED"|"DECLINED"|"REFUNDED";reference:string;at:string}
export interface MerchantDashboardTransfer {id:string;merchantId:string;merchantName:string;amount:Money;reference:string;at:string}
export interface MerchantDashboardView {id:string;name:string;description:string;unitIds:string[];totals:MerchantDashboardTotals;payments:MerchantDashboardPayment[];transfers:MerchantDashboardTransfer[];paymentsHasMore:boolean;transfersHasMore:boolean}
export interface MerchantDashboardProjection {mode:"TEST";canCreatePrimary:boolean;primaryNetworks:{primaryId:string;name:string;unitIds:string[]}[];delegatedUnitIds:string[];units:MerchantDashboardUnit[];views:MerchantDashboardView[]}
const money=z.object({minor:z.string(),currency:z.literal("USD"),formatted:z.string()}).strict();
const totals=z.object({collected:money.nullable(),refunded:money.nullable(),transferred:money.nullable(),available:money.nullable(),channelCount:z.int().nonnegative().nullable(),activeChannelCount:z.int().nonnegative().nullable()}).strict();
export const merchantDashboardProjectionSchema=z.object({mode:z.literal("TEST"),canCreatePrimary:z.boolean(),primaryNetworks:z.array(z.object({primaryId:z.uuid(),name:z.string(),unitIds:z.array(z.uuid())}).strict()),delegatedUnitIds:z.array(z.uuid()),units:z.array(z.object({id:z.uuid(),name:z.string(),kind:z.enum(["MASTER","SUB"]),primaryId:z.uuid(),primaryName:z.string(),primaryAccess:z.boolean(),status:z.enum(["ACTIVE","PAUSED","CLOSED"]),canOpen:z.boolean(),canAddSubmerchant:z.boolean(),canCreateChannel:z.boolean(),setupState:z.enum(["NOT_CONFIGURED","DISABLED","NOT_ENROLLED","PAUSED","READY"]),totals}).strict()),views:z.array(z.object({id:z.string(),name:z.string(),description:z.string(),unitIds:z.array(z.uuid()),totals,payments:z.array(z.object({id:z.uuid(),merchantId:z.uuid(),merchantName:z.string(),description:z.string(),amount:money,status:z.enum(["APPROVED","DECLINED","REFUNDED"]),reference:z.string(),at:z.iso.datetime()}).strict()),transfers:z.array(z.object({id:z.uuid(),merchantId:z.uuid(),merchantName:z.string(),amount:money,reference:z.string(),at:z.iso.datetime()}).strict()),paymentsHasMore:z.boolean(),transfersHasMore:z.boolean()}).strict())}).strict();

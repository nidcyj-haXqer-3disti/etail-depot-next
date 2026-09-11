import { z } from "zod";
import type { Money } from "../workspace/contracts";
import type { MerchantUnitSummary, PaymentChannel } from "./contracts";
const version=z.int().nonnegative();
export const configureTestGatewaySchema=z.object({commandId:z.uuid(),expectedVersion:version,enabled:z.boolean()}).strict();
export const enrollTestMerchantSchema=configureTestGatewaySchema;
export const channelActivationSchema=z.object({commandId:z.uuid(),expectedVersion:version,expectedChannelVersion:z.int().positive(),active:z.boolean()}).strict();
export const simulateMerchantPaymentSchema=z.object({commandId:z.uuid(),expectedChannelVersion:z.int().positive(),outcome:z.enum(["APPROVED","DECLINED"])}).strict();
export const refundMerchantPaymentSchema=z.object({commandId:z.uuid(),expectedVersion:z.int().positive(),reason:z.string().trim().min(1).max(300).refine(value=>!/[\u0000-\u001f\u007f-\u009f]/.test(value),"Use plain text")}).strict();
export const merchantPayoutSchema=z.object({commandId:z.uuid(),settlementId:z.uuid().optional(),reviewToken:z.string().regex(/^[0-9a-f]{64}$/).optional()}).strict();
export type ConfigureTestGatewayInput=z.infer<typeof configureTestGatewaySchema>;
export type EnrollTestMerchantInput=z.infer<typeof enrollTestMerchantSchema>;
export type ChannelActivationInput=z.infer<typeof channelActivationSchema>;
export type SimulateMerchantPaymentInput=z.infer<typeof simulateMerchantPaymentSchema>;
export type RefundMerchantPaymentInput=z.infer<typeof refundMerchantPaymentSchema>;
export type MerchantPayoutInput=z.infer<typeof merchantPayoutSchema>;
export interface TestGateway {serviceId:string;mode:"NOT_CONFIGURED"|"TEST_READY"|"DISABLED";processor:"ETAIL_TEST";version:number;liveEnabled:false;updatedAt:string|null}
export interface TestMerchantEnrollment {merchantUnitId:string;serviceId:string;status:"NOT_ENROLLED"|"ENROLLED"|"DISABLED";version:number;updatedAt:string|null}
export interface ChannelActivation {channelId:string;merchantUnitId:string;version:number;state:"ACTIVE"|"DISABLED"|"EXPIRED"|"USED"|"NOT_READY";canActivate:boolean;canDisable:boolean}
export interface MerchantTestPayment {id:string;merchantUnitId:string;channelId:string;description:string;amount:Money;status:"APPROVED"|"DECLINED"|"REFUNDED";version:number;testReference:string;createdAt:string;feeStatus:"NOT_APPLIED";canRefund:boolean;refundSource:"COLLECTION_BALANCE"|"SANDBOX_BANK"|null;refundUnavailableReason:string|null;refund:null|{id:string;amount:Money;reason:string;testReference:string;createdAt:string}}
export interface MerchantTestPayout {id:string;merchantUnitId:string;amount:Money;status:"PENDING"|"COMPLETED"|"FAILED";testReference:string;destination:"TEST_DESTINATION";createdAt:string;settlementId:string;processedAt:string|null;retryReview:{amount:Money;token:string;paymentCount:number}|null;payments:{id:string;description:string;reference:string;amount:Money;refundedAmount:Money}[]}
export interface MerchantOperationsProjection {
  merchantUnitId:string;serviceId:string;mode:"TEST";liveEnabled:false;feeStatus:"NOT_APPLIED";
  gateway:TestGateway;enrollment:TestMerchantEnrollment;channels:ChannelActivation[];payments:MerchantTestPayment[];payouts:MerchantTestPayout[];
  depositReview:{amount:Money;token:string;paymentCount:number}|null;availableFunds:Money|null;settledFunds:Money|null;pendingDeposits:Money|null;bankFunds:Money|null;canConfigureGateway:boolean;canEnroll:boolean;canReadPayments:boolean;canPayout:boolean;
}
export interface MerchantNetworkProjection {
  primary:{id:string;serviceId:string;displayName:string};
  units:MerchantUnitSummary[];channels:PaymentChannel[];payments:MerchantTestPayment[];payouts:MerchantTestPayout[];
  availableFunds:Money|null;balances:{merchantUnitId:string;availableFunds:Money}[];canReadPayments:boolean;
}

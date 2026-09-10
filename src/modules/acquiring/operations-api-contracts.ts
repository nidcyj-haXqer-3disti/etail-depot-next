import { z } from "zod";
import {merchantUnitSummarySchema,paymentChannelSchema} from "./api-contracts";
import { channelActivationSchema, configureTestGatewaySchema, enrollTestMerchantSchema, merchantPayoutSchema, refundMerchantPaymentSchema, simulateMerchantPaymentSchema } from "./operations-contracts";
const money=z.object({minor:z.string(),currency:z.literal("USD"),formatted:z.string()}).strict();
export const testGatewayProjectionSchema=z.object({serviceId:z.uuid(),mode:z.enum(["NOT_CONFIGURED","TEST_READY","DISABLED"]),processor:z.literal("ETAIL_TEST"),version:z.int().nonnegative(),liveEnabled:z.literal(false),updatedAt:z.iso.datetime().nullable()}).strict();
export const testEnrollmentProjectionSchema=z.object({merchantUnitId:z.uuid(),serviceId:z.uuid(),status:z.enum(["NOT_ENROLLED","ENROLLED","DISABLED"]),version:z.int().nonnegative(),updatedAt:z.iso.datetime().nullable()}).strict();
export const activationProjectionSchema=z.object({channelId:z.uuid(),merchantUnitId:z.uuid(),version:z.int().nonnegative(),state:z.enum(["ACTIVE","DISABLED","EXPIRED","USED","NOT_READY"]),canActivate:z.boolean(),canDisable:z.boolean(),canSimulate:z.boolean(),previewHref:z.string().nullable()}).strict();
export const merchantTestPaymentProjectionSchema=z.object({id:z.uuid(),merchantUnitId:z.uuid(),channelId:z.uuid(),description:z.string(),amount:money,status:z.enum(["APPROVED","DECLINED","REFUNDED"]),version:z.int().positive(),testReference:z.string(),createdAt:z.iso.datetime(),feeStatus:z.literal("NOT_APPLIED"),canRefund:z.boolean(),refund:z.object({id:z.uuid(),amount:money,reason:z.string(),testReference:z.string(),createdAt:z.iso.datetime()}).strict().nullable()}).strict();
export const merchantTestPayoutProjectionSchema=z.object({id:z.uuid(),merchantUnitId:z.uuid(),amount:money,status:z.literal("COMPLETED"),testReference:z.string(),destination:z.literal("TEST_DESTINATION"),createdAt:z.iso.datetime()}).strict();
export const merchantOperationsProjectionSchema=z.object({merchantUnitId:z.uuid(),serviceId:z.uuid(),mode:z.literal("TEST"),liveEnabled:z.literal(false),feeStatus:z.literal("NOT_APPLIED"),gateway:testGatewayProjectionSchema,enrollment:testEnrollmentProjectionSchema,channels:z.array(activationProjectionSchema),payments:z.array(merchantTestPaymentProjectionSchema),payouts:z.array(merchantTestPayoutProjectionSchema),availableFunds:money.nullable(),canConfigureGateway:z.boolean(),canEnroll:z.boolean(),canReadPayments:z.boolean(),canPayout:z.boolean()}).strict();
const unit="/api/v1/merchants/{merchantId}",channel=`${unit}/channels/{channelId}`;
export const merchantNetworkProjectionSchema=z.object({primary:z.object({id:z.uuid(),serviceId:z.uuid(),displayName:z.string()}).strict(),units:z.array(merchantUnitSummarySchema),channels:z.array(paymentChannelSchema),payments:z.array(merchantTestPaymentProjectionSchema),payouts:z.array(merchantTestPayoutProjectionSchema),availableFunds:money.nullable(),balances:z.array(z.object({merchantUnitId:z.uuid(),availableFunds:money}).strict()),canReadPayments:z.boolean()}).strict();
export const merchantOperations=[
  {path:`${unit}/network`,method:"get",response:merchantNetworkProjectionSchema,status:200,authenticated:true},
  {path:`${unit}/operations`,method:"get",response:merchantOperationsProjectionSchema,status:200,authenticated:true},
  {path:"/api/v1/merchants/{merchantId}/gateway",method:"put",request:configureTestGatewaySchema,response:testGatewayProjectionSchema,status:200,authenticated:true},
  {path:`${unit}/test-enrollment`,method:"put",request:enrollTestMerchantSchema,response:testEnrollmentProjectionSchema,status:200,authenticated:true},
  {path:`${channel}/activation`,method:"put",request:channelActivationSchema,response:activationProjectionSchema,status:200,authenticated:true},
  {path:`${channel}/test-payments`,method:"post",request:simulateMerchantPaymentSchema,response:merchantTestPaymentProjectionSchema,status:200,authenticated:true},
  {path:`${unit}/payments/{paymentId}/refund`,method:"post",request:refundMerchantPaymentSchema,response:merchantTestPaymentProjectionSchema,status:200,authenticated:true},
  {path:`${unit}/payouts`,method:"post",request:merchantPayoutSchema,response:merchantTestPayoutProjectionSchema,status:200,authenticated:true},
] as const;

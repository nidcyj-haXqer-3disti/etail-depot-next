import {merchantTestPayoutProjectionSchema} from "../../shared/deposit-response";
export {merchantTestPayoutProjectionSchema} from "../../shared/deposit-response";
import { z } from "zod";
import { channelActivationSchema, configureTestGatewaySchema, enrollTestMerchantSchema, merchantSettlementSchema, refundMerchantPaymentSchema } from "./operations-contracts";
import {merchantPaymentSettingsSchema,testGatewayProjectionSchema,testEnrollmentProjectionSchema,activationProjectionSchema,merchantTestPaymentProjectionSchema,merchantOperationsProjectionSchema,merchantSettlementReceiptSchema} from "../../shared/merchant-operation-response";
export {testGatewayProjectionSchema,testEnrollmentProjectionSchema,activationProjectionSchema,merchantTestPaymentProjectionSchema,merchantOperationsProjectionSchema,merchantSettlementReceiptSchema} from "../../shared/merchant-operation-response";
import {processNetworkCheckoutSchema} from "./network-contracts";
const unit="/api/v1/merchants/{merchantId}",channel=`${unit}/channels/{channelId}`;
export const merchantOperations=[
  {path:"/api/v1/merchant-services/{serviceId}/payment-settings",method:"get",response:merchantPaymentSettingsSchema,status:200,authenticated:true},
  {path:"/api/v1/merchant-services/{serviceId}/payment-settings",method:"put",request:configureTestGatewaySchema,response:testGatewayProjectionSchema,status:200,authenticated:true},
  {path:`${unit}/processing-payments/{operationId}/process`,method:"post",request:processNetworkCheckoutSchema,response:merchantOperationsProjectionSchema,status:200,authenticated:true},
  {path:"/api/v1/operations/deposits/{depositId}",method:"post",request:z.object({commandId:z.uuid(),outcome:z.enum(["COMPLETED","FAILED"])}).strict(),response:merchantTestPayoutProjectionSchema,status:200,authenticated:true},
  {path:`${unit}/operations`,method:"get",response:merchantOperationsProjectionSchema,status:200,authenticated:true},
  {path:"/api/v1/merchants/{merchantId}/gateway",method:"put",request:configureTestGatewaySchema,response:testGatewayProjectionSchema,status:200,authenticated:true},
  {path:`${unit}/test-enrollment`,method:"put",request:enrollTestMerchantSchema,response:testEnrollmentProjectionSchema,status:200,authenticated:true},
  {path:`${channel}/activation`,method:"put",request:channelActivationSchema,response:activationProjectionSchema,status:200,authenticated:true},
  {path:`${unit}/payments/{paymentId}/refund`,method:"post",request:refundMerchantPaymentSchema,response:merchantTestPaymentProjectionSchema,status:200,authenticated:true},
  {path:`${unit}/settlements`,method:"post",request:merchantSettlementSchema,response:merchantSettlementReceiptSchema,status:200,authenticated:true},
] as const;

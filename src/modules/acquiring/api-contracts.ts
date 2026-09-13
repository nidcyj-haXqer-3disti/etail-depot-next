import { z } from "zod";
import { startMerchantSetupSchema,updateMerchantSetupSchema,submitMerchantSetupSchema,createChannelSchema,updateChannelSchema,cancelChannelSchema,pauseMerchantSchema,createTerminalSchema } from "./contracts";
import {createMerchantServiceSchema} from "../services/merchant-contracts";
import {merchantDashboardProjectionSchema,primaryMerchantResultSchema} from "./dashboard-contracts";
import {merchantActivityQuerySchema} from "./activity-contracts";
import {merchantSetupProjectionSchema,merchantBusinessDetailsProjectionSchema,merchantUnitSummarySchema,paymentChannelSchema,merchantDirectoryQuerySchema,merchantDirectoryProjectionSchema,merchantWorkspaceProjectionSchema} from "../../shared/merchant-response";
export {merchantSetupProjectionSchema,merchantBusinessDetailsProjectionSchema,merchantUnitSummarySchema,merchantReadinessSchema,paymentChannelSchema,merchantDirectoryQuerySchema,merchantDirectoryProjectionSchema,merchantWorkspaceProjectionSchema} from "../../shared/merchant-response";
export const acquiringOperations=[
  {path:"/api/v1/merchant-services/{serviceId}/business-details",method:"get",response:merchantBusinessDetailsProjectionSchema,status:200,authenticated:true},
  {path:"/api/v1/merchant-services/{serviceId}/business-details/application",method:"post",request:startMerchantSetupSchema,response:merchantSetupProjectionSchema,status:200,authenticated:true},
  {path:"/api/v1/merchant-services/{serviceId}/business-details/application/{applicationId}",method:"patch",request:updateMerchantSetupSchema,response:merchantSetupProjectionSchema,status:200,authenticated:true},
  {path:"/api/v1/merchant-services/{serviceId}/business-details/application/{applicationId}/submit",method:"post",request:submitMerchantSetupSchema,response:merchantSetupProjectionSchema,status:200,authenticated:true},
  {path:"/api/v1/merchants/dashboard",method:"get",query:merchantActivityQuerySchema.extend({format:z.literal("csv").optional()}).strict(),response:merchantDashboardProjectionSchema,additionalResponseContent:{"text/csv":z.string()},status:200,authenticated:true},
  {path:"/api/v1/merchants",method:"post",request:createMerchantServiceSchema,response:primaryMerchantResultSchema,status:200,authenticated:true},
  {path:"/api/v1/merchants/{merchantId}/terminals",method:"post",request:createTerminalSchema,response:merchantUnitSummarySchema,status:200,authenticated:true},
  {path:"/api/v1/merchants/{merchantId}/business-details",method:"get",response:merchantBusinessDetailsProjectionSchema,status:200,authenticated:true},
  {path:`/api/v1/merchants/{merchantId}/business-details/application`,method:"post",request:startMerchantSetupSchema,response:merchantSetupProjectionSchema,status:200,authenticated:true},
  {path:`/api/v1/merchants/{merchantId}/business-details/application/{applicationId}`,method:"patch",request:updateMerchantSetupSchema,response:merchantSetupProjectionSchema,status:200,authenticated:true},
  {path:`/api/v1/merchants/{merchantId}/business-details/application/{applicationId}/submit`,method:"post",request:submitMerchantSetupSchema,response:merchantSetupProjectionSchema,status:200,authenticated:true},
  {path:"/api/v1/merchants",method:"get",query:merchantDirectoryQuerySchema,response:merchantDirectoryProjectionSchema,status:200,authenticated:true},
  {path:"/api/v1/merchants/{merchantId}",method:"get",response:merchantWorkspaceProjectionSchema,status:200,authenticated:true},
  {path:"/api/v1/merchants/{merchantId}/pause",method:"post",request:pauseMerchantSchema,response:merchantUnitSummarySchema,status:200,authenticated:true},
  {path:"/api/v1/merchants/{merchantId}/resume",method:"post",request:pauseMerchantSchema,response:merchantUnitSummarySchema,status:200,authenticated:true},
  {path:"/api/v1/merchants/{merchantId}/channels",method:"post",request:createChannelSchema,response:paymentChannelSchema,status:200,authenticated:true},
  {path:"/api/v1/merchants/{merchantId}/channels/{channelId}",method:"patch",request:updateChannelSchema,response:paymentChannelSchema,status:200,authenticated:true},
  {path:"/api/v1/merchants/{merchantId}/channels/{channelId}/close",method:"post",request:cancelChannelSchema,response:paymentChannelSchema,status:200,authenticated:true},
] as const;

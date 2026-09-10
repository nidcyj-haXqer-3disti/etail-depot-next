import { z } from "zod";
import { supportTopicSchema, supportStatusSchema, createSupportCaseSchema, addSupportMessageSchema, withdrawSupportCaseSchema, supportCaseQuerySchema } from "./contracts";
export const supportCaseSummarySchema=z.object({id:z.uuid(),serviceId:z.uuid(),reference:z.string(),topic:supportTopicSchema,subject:z.string().min(1).max(100),status:supportStatusSchema,version:z.int().positive(),createdAt:z.iso.datetime(),updatedAt:z.iso.datetime(),canUpdate:z.boolean(),nextActor:z.enum(["SUPPORT","NONE"]),delivery:z.literal("SANDBOX_SUPPORT"),privacy:z.literal("CUSTOMER_AND_ASSIGNED_SUPPORT")}).strict();
export const supportCaseDetailSchema=supportCaseSummarySchema.extend({transaction:z.object({id:z.uuid(),title:z.string()}).strict().nullable(),transactionUnavailable:z.boolean(),messages:z.array(z.object({id:z.uuid(),kind:z.enum(["OPENED","MESSAGE","WITHDRAWN","RESOLVED"]),body:z.string().min(1).max(2000),sequence:z.int().positive(),createdAt:z.iso.datetime(),author:z.enum(["YOU","SUPPORT"])}).strict())}).strict();
export const supportCaseListSchema=z.object({cases:z.array(supportCaseSummarySchema).max(25),nextCursor:z.uuid().nullable(),canCreate:z.boolean()}).strict();
const path="/api/v1/cardholder-services/{serviceId}/cases";
export const caseOperations=[
  {path,method:"get",response:supportCaseListSchema,status:200,authenticated:true,query:supportCaseQuerySchema},
  {path,method:"post",request:createSupportCaseSchema,response:supportCaseDetailSchema,status:200,authenticated:true},
  {path:`${path}/{caseId}`,method:"get",response:supportCaseDetailSchema,status:200,authenticated:true},
  {path:`${path}/{caseId}/messages`,method:"post",request:addSupportMessageSchema,response:supportCaseDetailSchema,status:200,authenticated:true},
  {path:`${path}/{caseId}/withdraw`,method:"post",request:withdrawSupportCaseSchema,response:supportCaseDetailSchema,status:200,authenticated:true},
] as const;

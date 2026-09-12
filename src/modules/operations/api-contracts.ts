import {z} from "zod";
import {operatorResponseSchema} from "./contracts";
import {supportPaymentContextSchema} from "../cases/api-contracts";

const status=z.enum(["OPEN","WITHDRAWN","RESOLVED"]);
export const operatorQueueSchema=z.array(z.object({
  id:z.uuid(),reference:z.string(),subject:z.string(),status,
  serviceName:z.string(),serviceKind:z.enum(["CARDHOLDER","MERCHANT"]),customer:z.string(),updatedAt:z.iso.datetime(),
}).strict()).max(100);
export const operatorCaseSchema=z.object({
  id:z.uuid(),serviceId:z.uuid(),reference:z.string(),subject:z.string(),status,version:z.int().positive(),
  serviceName:z.string(),customer:z.string(),payment:supportPaymentContextSchema.nullable(),paymentUnavailable:z.boolean(),canRespond:z.boolean(),messages:z.array(z.object({
    id:z.uuid(),body:z.string(),author:z.enum(["CUSTOMER","SUPPORT"]),createdAt:z.iso.datetime(),
  }).strict()),
}).strict();
export const supportOperatorOperations=[
  {path:"/api/v1/operations/cases",method:"get",response:operatorQueueSchema,status:200,authenticated:true},
  {path:"/api/v1/operations/cases/{caseId}",method:"get",response:operatorCaseSchema,status:200,authenticated:true},
  {path:"/api/v1/operations/cases/{caseId}/responses",method:"post",request:operatorResponseSchema,response:operatorCaseSchema,status:200,authenticated:true},
] as const;

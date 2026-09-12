import {z} from "zod";
import {openDisputeSchema,respondDisputeSchema,reviewDisputeSchema,disputeProjectionSchema,payerDisputeProjectionSchema} from "./contracts";
export const disputeOperations=[
 {path:"/api/v1/payments/{paymentId}/dispute",method:"get",response:payerDisputeProjectionSchema,status:200,authenticated:true},
 {path:"/api/v1/payments/{paymentId}/dispute",method:"post",request:openDisputeSchema,response:disputeProjectionSchema,status:200,authenticated:true},
 {path:"/api/v1/merchants/{merchantId}/disputes",method:"get",response:z.array(disputeProjectionSchema),status:200,authenticated:true},
 {path:"/api/v1/merchants/{merchantId}/disputes/{disputeId}/respond",method:"post",request:respondDisputeSchema,response:disputeProjectionSchema,status:200,authenticated:true},
 {path:"/api/v1/operations/disputes",method:"get",response:z.array(disputeProjectionSchema),status:200,authenticated:true},
 {path:"/api/v1/operations/disputes/{disputeId}",method:"post",request:reviewDisputeSchema,response:disputeProjectionSchema,status:200,authenticated:true},
] as const;

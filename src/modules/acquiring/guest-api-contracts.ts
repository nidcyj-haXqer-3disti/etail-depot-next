import {z} from "zod";
import {emptyGuestSchema,publishGuestChannelSchema,revokeGuestPublicationSchema,createGuestOrderSchema,prepareGuestAttemptSchema,guestPublicationManagementSchema,publicGuestRequestSchema,guestOrderProjectionSchema} from "./guest-contracts";
const publication="/api/v1/merchants/{merchantId}/channels/{channelId}/publication";
const query=z.object({}).strict();
export const guestPaymentOperations=[
 {path:publication,method:"get",query,response:guestPublicationManagementSchema,status:200,authenticated:true},
 {path:publication,method:"post",request:publishGuestChannelSchema,response:guestPublicationManagementSchema,status:200,authenticated:true},
 {path:`${publication}/{publicationId}/revoke`,method:"post",request:revokeGuestPublicationSchema,response:guestPublicationManagementSchema,status:200,authenticated:true},
 {path:"/api/v1/guest/session",method:"post",request:emptyGuestSchema,response:z.object({ready:z.literal(true)}).strict(),status:200,authenticated:false},
 {path:"/api/v1/guest/publications/{publicationId}",method:"get",query,response:publicGuestRequestSchema,status:200,authenticated:false},
 {path:"/api/v1/guest/publications/{publicationId}/orders",method:"post",request:createGuestOrderSchema,response:guestOrderProjectionSchema,status:200,authenticated:false,guestAuthenticated:true},
 {path:"/api/v1/guest/orders/{orderId}",method:"get",query,response:guestOrderProjectionSchema,status:200,authenticated:false,guestAuthenticated:true},
 {path:"/api/v1/guest/orders/{orderId}/attempts",method:"post",request:prepareGuestAttemptSchema,response:guestOrderProjectionSchema,status:200,authenticated:false,guestAuthenticated:true},
 {path:"/api/v1/guest/orders/{orderId}/attempts/{attemptId}/confirm",method:"post",request:emptyGuestSchema,response:guestOrderProjectionSchema,status:200,authenticated:false,guestAuthenticated:true},
] as const;

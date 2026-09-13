import {z} from "zod";
import {publishGuestChannelSchema,revokeGuestPublicationSchema,guestRevocationResultSchema,guestPublicationManagementSchema,publicGuestRequestSchema,guestOrderProjectionSchema} from "./guest-contracts";
import {startNetworkCheckoutSchema,processNetworkCheckoutSchema} from "./network-contracts";
import {networkCheckoutProjectionSchema} from "../../shared/network-checkout-response";
const publication="/api/v1/merchants/{merchantId}/channels/{channelId}/publication";
const query=z.object({}).strict();
export const guestPaymentOperations=[
 {path:"/api/v1/guest/session",method:"post",request:z.object({}).strict(),response:z.object({ready:z.literal(true)}).strict(),status:200,authenticated:false},
 {path:"/api/v1/guest/publications/{publicationId}/payments",method:"post",request:startNetworkCheckoutSchema,response:networkCheckoutProjectionSchema,status:200,authenticated:false,guestAuthenticated:true},
 {path:"/api/v1/guest/publications/{publicationId}/payments/{operationId}",method:"get",query,response:networkCheckoutProjectionSchema,status:200,authenticated:false,guestAuthenticated:true},
 {path:"/api/v1/guest/publications/{publicationId}/payments/{operationId}/process",method:"post",request:processNetworkCheckoutSchema,response:networkCheckoutProjectionSchema,status:200,authenticated:false,guestAuthenticated:true},
 {path:publication,method:"get",query,response:guestPublicationManagementSchema,status:200,authenticated:true},
 {path:publication,method:"post",request:publishGuestChannelSchema,response:guestPublicationManagementSchema,status:200,authenticated:true},
 {path:`${publication}/{publicationId}/revoke`,method:"post",request:revokeGuestPublicationSchema,response:guestRevocationResultSchema,status:200,authenticated:true},
 {path:"/api/v1/guest/publications/{publicationId}",method:"get",query,response:publicGuestRequestSchema,status:200,authenticated:false},
 {path:"/api/v1/guest/publications/{publicationId}/qr",method:"get",query,response:z.string().meta({format:"binary"}),responseContentType:"image/png",status:200,authenticated:false},
 {path:"/api/v1/guest/orders/{orderId}",method:"get",query,response:guestOrderProjectionSchema,status:200,authenticated:false,guestAuthenticated:true},
] as const;

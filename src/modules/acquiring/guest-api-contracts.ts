import {z} from "zod";
import {publishGuestChannelSchema,revokeGuestPublicationSchema,guestPublicationManagementSchema,publicGuestRequestSchema,guestOrderProjectionSchema} from "./guest-contracts";
const publication="/api/v1/merchants/{merchantId}/channels/{channelId}/publication";
const query=z.object({}).strict();
export const guestPaymentOperations=[
 {path:publication,method:"get",query,response:guestPublicationManagementSchema,status:200,authenticated:true},
 {path:publication,method:"post",request:publishGuestChannelSchema,response:guestPublicationManagementSchema,status:200,authenticated:true},
 {path:`${publication}/{publicationId}/revoke`,method:"post",request:revokeGuestPublicationSchema,response:guestPublicationManagementSchema,status:200,authenticated:true},
 {path:"/api/v1/guest/publications/{publicationId}",method:"get",query,response:publicGuestRequestSchema,status:200,authenticated:false},
 {path:"/api/v1/guest/publications/{publicationId}/qr",method:"get",query,response:z.string().meta({format:"binary"}),responseContentType:"image/png",status:200,authenticated:false},
 {path:"/api/v1/guest/orders/{orderId}",method:"get",query,response:guestOrderProjectionSchema,status:200,authenticated:false,guestAuthenticated:true},
] as const;

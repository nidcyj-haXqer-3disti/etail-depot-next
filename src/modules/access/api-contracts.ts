import {z} from "zod";
import {createInvitationSchema,invitationDecisionSchema} from "./contracts";
import {invitationProjectionSchema,accessPersonSchema,accessOverviewSchema,anyInvitationProjectionSchema} from "../../shared/access-response";
export {invitationProjectionSchema,accessPersonSchema,accessOverviewSchema,anyInvitationProjectionSchema} from "../../shared/access-response";
const prefix="/api/v1/cardholder-services/{serviceId}";
export const accessOperations=[
 {path:`${prefix}/access`,method:"get",response:accessOverviewSchema,status:200,authenticated:true},
 {path:`${prefix}/invitations`,method:"post",request:createInvitationSchema,response:invitationProjectionSchema,status:200,authenticated:true},
 {path:"/api/v1/invitations",method:"get",response:z.array(anyInvitationProjectionSchema),status:200,authenticated:true},
 {path:"/api/v1/invitations/{invitationId}/accept",method:"post",request:invitationDecisionSchema,response:anyInvitationProjectionSchema,status:200,authenticated:true},
 {path:"/api/v1/invitations/{invitationId}/decline",method:"post",request:invitationDecisionSchema,response:anyInvitationProjectionSchema,status:200,authenticated:true},
 {path:`${prefix}/invitations/{invitationId}/revoke`,method:"post",request:invitationDecisionSchema,response:invitationProjectionSchema,status:200,authenticated:true},
 {path:`${prefix}/people/{personId}/revoke`,method:"post",request:invitationDecisionSchema,response:accessPersonSchema,status:200,authenticated:true},
] as const;

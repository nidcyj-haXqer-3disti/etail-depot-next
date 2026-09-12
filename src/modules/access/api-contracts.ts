import {resourceInvitationProjectionSchema} from "../../shared/resource-invitation-response";
import {z} from "zod";
import {createCardInvitationSchema,invitationDecisionSchema} from "./contracts";
import {cardInvitationProjectionSchema,invitationProjectionSchema,accessPersonSchema,accessOverviewSchema,anyInvitationProjectionSchema} from "../../shared/access-response";
export {cardInvitationProjectionSchema,invitationProjectionSchema,accessPersonSchema,accessOverviewSchema,anyInvitationProjectionSchema} from "../../shared/access-response";
const prefix="/api/v1/cardholder-services/{serviceId}";
export const accessOperations=[
 {path:`${prefix}/access`,method:"get",response:accessOverviewSchema,status:200,authenticated:true},
 {path:`${prefix}/cards/{cardId}/invitations`,method:"post",request:createCardInvitationSchema,response:cardInvitationProjectionSchema,status:200,authenticated:true},
 {path:"/api/v1/invitations/{invitationId}",method:"get",response:resourceInvitationProjectionSchema,status:200,authenticated:true},
 {path:"/api/v1/invitations",method:"get",response:z.array(anyInvitationProjectionSchema),status:200,authenticated:true},
 {path:"/api/v1/invitations/{invitationId}/accept",method:"post",request:invitationDecisionSchema,response:anyInvitationProjectionSchema,status:200,authenticated:true},
 {path:"/api/v1/invitations/{invitationId}/decline",method:"post",request:invitationDecisionSchema,response:anyInvitationProjectionSchema,status:200,authenticated:true},
 {path:`${prefix}/invitations/{invitationId}/revoke`,method:"post",request:invitationDecisionSchema,response:z.union([invitationProjectionSchema,cardInvitationProjectionSchema]),status:200,authenticated:true},
 {path:`${prefix}/people/{personId}/revoke`,method:"post",request:invitationDecisionSchema,response:accessPersonSchema,status:200,authenticated:true},
] as const;

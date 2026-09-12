import {createMerchantInvitationSchema} from "./merchant-contracts";
import {invitationDecisionSchema} from "./contracts";
import {merchantInvitationProjectionSchema,merchantAccessPersonSchema,merchantAccessOverviewSchema} from "../../shared/merchant-access-response";
export {merchantInvitationProjectionSchema,merchantAccessPersonSchema,merchantAccessOverviewSchema} from "../../shared/merchant-access-response";
const prefix="/api/v1/merchants/{merchantId}";
export const merchantAccessOperations=[
 {path:`${prefix}/access`,method:"get",response:merchantAccessOverviewSchema,status:200,authenticated:true},
 {path:`${prefix}/invitations`,method:"post",request:createMerchantInvitationSchema,response:merchantInvitationProjectionSchema,status:200,authenticated:true},
 {path:`${prefix}/invitations/{invitationId}/revoke`,method:"post",request:invitationDecisionSchema,response:merchantInvitationProjectionSchema,status:200,authenticated:true},
 {path:`${prefix}/people/{assignmentId}/revoke`,method:"post",request:invitationDecisionSchema,response:merchantAccessPersonSchema,status:200,authenticated:true},
] as const;

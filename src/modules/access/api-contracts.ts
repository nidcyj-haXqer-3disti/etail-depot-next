import { z } from "zod";
import {merchantInvitationProjectionSchema} from "./merchant-api-contracts";
import { ACCESS_PERMISSIONS,createInvitationSchema,invitationDecisionSchema,updateAccessSchema } from "./contracts";
const id=z.uuid(), version=z.int().positive(), permissions=z.array(z.enum(ACCESS_PERMISSIONS));
export const invitationProjectionSchema=z.object({targetKind:z.literal("SERVICE"),id,serviceId:id,serviceName:z.string(),serviceKind:z.literal("CARDHOLDER"),inviterName:z.string(),recipientId:id,recipientName:z.string(),role:z.literal("SECONDARY"),permissions,delegablePermissions:permissions,status:z.enum(["PENDING","ACCEPTED","DECLINED","REVOKED","EXPIRED"]),version,createdAt:z.iso.datetime(),expiresAt:z.iso.datetime(),canRespond:z.boolean(),canRevoke:z.boolean(),hasServiceAccess:z.boolean()}).strict();
export const accessPersonSchema=z.object({id,displayName:z.string(),role:z.enum(["PRIMARY","SECONDARY"]),state:z.enum(["ACCEPTED","REVOKED"]),version,permissions:z.array(z.string()),delegablePermissions:z.array(z.string()),canManage:z.boolean(),canRevoke:z.boolean(),isCurrentPerson:z.boolean()}).strict();
export const accessOverviewSchema=z.object({serviceId:id,serviceName:z.string(),serviceKind:z.literal("CARDHOLDER"),canInvite:z.boolean(),canManage:z.boolean(),people:z.array(accessPersonSchema),invitations:z.array(invitationProjectionSchema),recipients:z.array(z.object({id,displayName:z.string()}).strict()),permissionOptions:z.array(z.object({action:z.enum(ACCESS_PERMISSIONS),label:z.string(),description:z.string(),canDelegate:z.boolean(),allowedRoles:z.array(z.literal("SECONDARY"))}).strict()),roleOptions:z.array(z.literal("SECONDARY")),notice:z.string()}).strict();
export const anyInvitationProjectionSchema=z.discriminatedUnion("targetKind",[invitationProjectionSchema,merchantInvitationProjectionSchema]);
const prefix="/api/v1/cardholder-services/{serviceId}";
export const accessOperations=[
 {path:`${prefix}/access`,method:"get",response:accessOverviewSchema,status:200,authenticated:true},
 {path:`${prefix}/invitations`,method:"post",request:createInvitationSchema,response:invitationProjectionSchema,status:200,authenticated:true},
 {path:"/api/v1/invitations",method:"get",response:z.array(anyInvitationProjectionSchema),status:200,authenticated:true},
 {path:"/api/v1/invitations/{invitationId}/accept",method:"post",request:invitationDecisionSchema,response:anyInvitationProjectionSchema,status:200,authenticated:true},
 {path:"/api/v1/invitations/{invitationId}/decline",method:"post",request:invitationDecisionSchema,response:anyInvitationProjectionSchema,status:200,authenticated:true},
 {path:`${prefix}/invitations/{invitationId}/revoke`,method:"post",request:invitationDecisionSchema,response:invitationProjectionSchema,status:200,authenticated:true},
 {path:`${prefix}/people/{personId}`,method:"patch",request:updateAccessSchema,response:accessPersonSchema,status:200,authenticated:true},
 {path:`${prefix}/people/{personId}/revoke`,method:"post",request:invitationDecisionSchema,response:accessPersonSchema,status:200,authenticated:true},
] as const;

import {z} from "zod";
import {createMerchantInvitationSchema,MERCHANT_PERMISSIONS} from "./merchant-contracts";
import {invitationDecisionSchema} from "./contracts";
const id=z.uuid(),permissions=z.array(z.enum(MERCHANT_PERMISSIONS)),version=z.int().positive();
export const merchantInvitationProjectionSchema=z.object({targetKind:z.literal("MERCHANT_UNIT"),id,merchantUnitId:id,merchantName:z.string(),masterName:z.string(),inviterName:z.string(),recipientId:id,recipientName:z.string(),permissions,delegablePermissions:permissions,status:z.enum(["PENDING","ACCEPTED","DECLINED","REVOKED","EXPIRED"]),version,createdAt:z.iso.datetime(),expiresAt:z.iso.datetime(),accessExpiresAt:z.iso.datetime(),canRespond:z.boolean(),canRevoke:z.boolean(),hasMerchantAccess:z.boolean(),href:z.string()}).strict();
export const merchantAccessPersonSchema=z.object({id,personId:id,displayName:z.string(),state:z.enum(["ACCEPTED","REVOKED","EXPIRED","UNAVAILABLE"]),version,permissions,delegablePermissions:permissions,expiresAt:z.iso.datetime(),canRevoke:z.boolean(),isCurrentPerson:z.boolean()}).strict();
export const merchantAccessOverviewSchema=z.object({merchantUnitId:id,merchantName:z.string(),masterName:z.string(),canInvite:z.boolean(),controllers:z.array(z.object({personId:id,displayName:z.string(),basis:z.literal("PRIMARY_MEMBER")}).strict()),people:z.array(merchantAccessPersonSchema),invitations:z.array(merchantInvitationProjectionSchema),recipients:z.array(z.object({id,displayName:z.string()}).strict()),permissionOptions:z.array(z.object({action:z.enum(MERCHANT_PERMISSIONS),label:z.string(),description:z.string(),canDelegate:z.boolean()}).strict()),notice:z.string()}).strict();
const prefix="/api/v1/merchants/{merchantId}";
export const merchantAccessOperations=[
 {path:`${prefix}/access`,method:"get",response:merchantAccessOverviewSchema,status:200,authenticated:true},
 {path:`${prefix}/invitations`,method:"post",request:createMerchantInvitationSchema,response:merchantInvitationProjectionSchema,status:200,authenticated:true},
 {path:`${prefix}/invitations/{invitationId}/revoke`,method:"post",request:invitationDecisionSchema,response:merchantInvitationProjectionSchema,status:200,authenticated:true},
 {path:`${prefix}/people/{assignmentId}/revoke`,method:"post",request:invitationDecisionSchema,response:merchantAccessPersonSchema,status:200,authenticated:true},
] as const;

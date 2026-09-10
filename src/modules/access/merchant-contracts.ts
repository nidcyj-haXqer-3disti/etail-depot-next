import {z} from "zod";
import type {InvitationProjection} from "./contracts";

export const MERCHANT_PERMISSIONS=["merchant.read","merchant.people.read","merchant.people.invite","merchant.people.revoke","channels.read","channels.create","channels.update","channels.close","channels.share","payments.read","payments.simulate"] as const;
export type MerchantPermission=typeof MERCHANT_PERMISSIONS[number];
const permissions=z.array(z.enum(MERCHANT_PERMISSIONS)).min(1).max(MERCHANT_PERMISSIONS.length).refine(values=>new Set(values).size===values.length,"Permissions must be unique");
const delegable=z.array(z.enum(MERCHANT_PERMISSIONS)).max(MERCHANT_PERMISSIONS.length).refine(values=>new Set(values).size===values.length,"Permissions must be unique");
export const createMerchantInvitationSchema=z.object({commandId:z.uuid(),recipientId:z.uuid(),permissions,delegablePermissions:delegable,expiresInDays:z.union([z.literal(1),z.literal(3),z.literal(7)]),accessExpiresInDays:z.union([z.literal(1),z.literal(7),z.literal(30)])}).strict();
export type CreateMerchantInvitationInput=z.infer<typeof createMerchantInvitationSchema>;
export interface MerchantInvitationProjection {
  targetKind:"MERCHANT_UNIT";id:string;merchantUnitId:string;merchantName:string;masterName:string;
  inviterName:string;recipientId:string;recipientName:string;permissions:MerchantPermission[];delegablePermissions:MerchantPermission[];
  status:"PENDING"|"ACCEPTED"|"DECLINED"|"REVOKED"|"EXPIRED";version:number;createdAt:string;expiresAt:string;accessExpiresAt:string;
  canRespond:boolean;canRevoke:boolean;hasMerchantAccess:boolean;href:string;
}
export type AnyInvitationProjection=(InvitationProjection&{targetKind:"SERVICE"})|MerchantInvitationProjection;
export interface MerchantAccessPerson {
  id:string;personId:string;displayName:string;state:"ACCEPTED"|"REVOKED"|"EXPIRED"|"UNAVAILABLE";version:number;
  permissions:MerchantPermission[];delegablePermissions:MerchantPermission[];expiresAt:string;canRevoke:boolean;isCurrentPerson:boolean;
}
export interface MerchantAccessOverview {
  merchantUnitId:string;merchantName:string;masterName:string;canInvite:boolean;
  controllers:{personId:string;displayName:string;basis:"PRIMARY_MEMBER"}[];
  people:MerchantAccessPerson[];invitations:MerchantInvitationProjection[];recipients:{id:string;displayName:string}[];
  permissionOptions:{action:MerchantPermission;label:string;description:string;canDelegate:boolean}[];notice:string;
}

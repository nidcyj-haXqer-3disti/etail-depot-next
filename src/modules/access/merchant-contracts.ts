import {z} from "zod";
import {TERMINAL_PERMISSIONS} from "../../shared/access-permissions";
export {TERMINAL_PERMISSIONS} from "../../shared/access-permissions";
import type {InvitationProjection,CardInvitationProjection} from "./contracts";

export type MerchantPermission=typeof TERMINAL_PERMISSIONS[number];
export const createMerchantInvitationSchema=z.object({commandId:z.uuid(),recipientId:z.uuid().optional(),recipientEmail:z.email().max(254).optional(),expiresInDays:z.union([z.literal(1),z.literal(3),z.literal(7)])}).strict().refine(value=>Boolean(value.recipientId)!==Boolean(value.recipientEmail),"Choose one recipient");
export type CreateMerchantInvitationInput=z.infer<typeof createMerchantInvitationSchema>;
export interface MerchantInvitationProjection {
 targetKind:"MERCHANT_TERMINAL";id:string;terminalId:string;terminalName:string;merchantServiceId:string;merchantName:string;
 inviterName:string;recipientId:string|null;recipientEmail:string|null;recipientName:string;permissions:MerchantPermission[];
 status:"PENDING"|"ACCEPTED"|"DECLINED"|"REVOKED"|"EXPIRED";version:number;createdAt:string;expiresAt:string;accessExpiresAt:string|null;
 canRespond:boolean;canRevoke:boolean;hasMerchantAccess:boolean;href:string;
}
export type AnyInvitationProjection=InvitationProjection|CardInvitationProjection|MerchantInvitationProjection;
export interface MerchantAccessPerson {
 id:string;personId:string;displayName:string;state:"ACCEPTED"|"REVOKED"|"EXPIRED"|"UNAVAILABLE";version:number;
 permissions:MerchantPermission[];expiresAt:string|null;canRevoke:boolean;isCurrentPerson:boolean;
}
export interface MerchantAccessOverview {
 terminalId:string;terminalName:string;merchantName:string;canInvite:boolean;
 invitationTotal:number;pendingInvitationCount:number;invitationsTruncated:boolean;
 controllers:{personId:string;displayName:string;basis:"OWNER_MEMBER"}[];
 people:MerchantAccessPerson[];invitations:MerchantInvitationProjection[];notice:string;
}

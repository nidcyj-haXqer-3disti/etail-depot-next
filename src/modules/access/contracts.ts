import { z } from "zod";
import {ACCESS_PERMISSIONS} from "../../shared/access-permissions";
export {ACCESS_PERMISSIONS,CARDHOLDER_ACCESS_PERMISSIONS} from "../../shared/access-permissions";


export type AccessPermission = typeof ACCESS_PERMISSIONS[number];
export type InvitedRole = "CARDHOLDER";
export interface PermissionOption { action: AccessPermission; label: string; description: string; canDelegate: boolean; allowedRoles: InvitedRole[] }
export interface InvitationProjection {
  targetKind:"SERVICE";
  id:string; serviceId:string; serviceName:string; serviceKind:"CARDHOLDER";
  inviterName:string; recipientId:string; recipientName:string; role:InvitedRole;
  permissions:AccessPermission[]; delegablePermissions:AccessPermission[];
  status:"PENDING"|"ACCEPTED"|"DECLINED"|"REVOKED"|"EXPIRED";
  version:number; createdAt:string; expiresAt:string; canRespond:boolean; canRevoke:boolean; hasServiceAccess:boolean;
}
export interface AccessPerson {
  id:string; displayName:string; role:"OWNER"|InvitedRole; state:"ACCEPTED"|"REVOKED"; version:number;
  permissions:string[]; delegablePermissions:string[]; canManage:boolean; canRevoke:boolean; isCurrentPerson:boolean;
}
export interface AccessOverview {
  serviceId:string; serviceName:string; serviceKind:"CARDHOLDER";
  canInvite:boolean; canManage:boolean; people:AccessPerson[]; invitations:InvitationProjection[];
  invitationTotal:number; pendingInvitationCount:number; invitationsTruncated:boolean;
  recipients:{id:string;displayName:string}[]; permissionOptions:PermissionOption[]; roleOptions:InvitedRole[];
  notice:string;
  history:{id:string;personId:string|null;personName:string;actorName:string;label:string;createdAt:string}[];
  historyHasMore:boolean;
}

export const createInvitationSchema=z.object({commandId:z.uuid(),recipientId:z.uuid(),expiresInDays:z.union([z.literal(1),z.literal(3),z.literal(7)])}).strict();
export const invitationDecisionSchema=z.object({commandId:z.uuid(),expectedVersion:z.int().positive()}).strict();
export type CreateInvitationInput=z.infer<typeof createInvitationSchema>;
export type InvitationDecisionInput=z.infer<typeof invitationDecisionSchema>;

export interface CardInvitationProjection extends Omit<InvitationProjection,"targetKind"|"recipientId"> {targetKind:"CARD";cardId:string;cardName:string;recipientId:string|null;recipientEmail:string|null;allowance:{amount:string;currency:string};href:string}
export const createCardInvitationSchema=z.object({commandId:z.uuid(),recipientEmail:z.email().max(254),expiresInDays:z.union([z.literal(1),z.literal(3),z.literal(7)])}).strict();
export type CreateCardInvitationInput=z.infer<typeof createCardInvitationSchema>;

import { z } from "zod";

export const ACCESS_PERMISSIONS = ["cards.read","cards.hold","cards.request","cards.create","cards.purchase","cards.freeze","cards.unfreeze","cards.manageMembers","activity.read","people.read","people.invite","people.changeRole","people.revoke","notifications.manage"] as const;
export type AccessPermission = typeof ACCESS_PERMISSIONS[number];
export type InvitedRole = "SECONDARY";
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
  id:string; displayName:string; role:"PRIMARY"|InvitedRole; state:"ACCEPTED"|"REVOKED"; version:number;
  permissions:string[]; delegablePermissions:string[]; canManage:boolean; canRevoke:boolean; isCurrentPerson:boolean;
}
export interface AccessOverview {
  serviceId:string; serviceName:string; serviceKind:"CARDHOLDER";
  canInvite:boolean; canManage:boolean; people:AccessPerson[]; invitations:InvitationProjection[];
  recipients:{id:string;displayName:string}[]; permissionOptions:PermissionOption[]; roleOptions:InvitedRole[];
  notice:string;
}
const permissions = z.array(z.enum(ACCESS_PERMISSIONS)).max(ACCESS_PERMISSIONS.length).refine(values=>new Set(values).size===values.length,"Permissions must be unique");
export const createInvitationSchema=z.object({commandId:z.uuid(),recipientId:z.uuid(),role:z.literal("SECONDARY"),permissions,delegablePermissions:permissions,expiresInDays:z.union([z.literal(1),z.literal(3),z.literal(7)])}).strict();
export const invitationDecisionSchema=z.object({commandId:z.uuid(),expectedVersion:z.int().positive()}).strict();
export const updateAccessSchema=z.object({commandId:z.uuid(),expectedVersion:z.int().positive(),role:z.literal("SECONDARY"),permissions,delegablePermissions:permissions}).strict();
export type CreateInvitationInput=z.infer<typeof createInvitationSchema>;
export type InvitationDecisionInput=z.infer<typeof invitationDecisionSchema>;
export type UpdateAccessInput=z.infer<typeof updateAccessSchema>;

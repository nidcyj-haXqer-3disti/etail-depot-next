import { sql } from "drizzle-orm";
import { pgTable,uuid,text,timestamp,integer,boolean,primaryKey,uniqueIndex,check,foreignKey,unique,index } from "drizzle-orm/pg-core";
import { merchantUnits } from "../acquiring/schema";
import { services,people,serviceKind } from "../../platform/database/schema";

export const serviceInvitations=pgTable("service_invitations",{
  id:uuid().primaryKey().defaultRandom(),targetKind:text({enum:["SERVICE","MERCHANT_UNIT"]}).notNull().default("SERVICE"),serviceId:uuid().references(()=>services.id),cardholderKind:serviceKind().notNull().default("CARDHOLDER"),merchantUnitId:uuid().references(()=>merchantUnits.id),inviterId:uuid().notNull().references(()=>people.id),recipientId:uuid().notNull().references(()=>people.id),
  role:text({enum:["SECONDARY"]}),status:text({enum:["PENDING","ACCEPTED","DECLINED","REVOKED","EXPIRED"]}).notNull().default("PENDING"),
  version:integer().notNull().default(1),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),expiresAt:timestamp({withTimezone:true}).notNull(),decidedAt:timestamp({withTimezone:true}),
},t=>[foreignKey({columns:[t.serviceId,t.cardholderKind],foreignColumns:[services.id,services.kind]}),check("invitation_cardholder_kind",sql`${t.cardholderKind}='CARDHOLDER'`),unique("invitation_merchant_target").on(t.id,t.merchantUnitId),check("invitation_target_shape",sql`(${t.targetKind}='SERVICE' and ${t.serviceId} is not null and ${t.merchantUnitId} is null and ${t.role} is not null) or (${t.targetKind}='MERCHANT_UNIT' and ${t.serviceId} is null and ${t.merchantUnitId} is not null and ${t.role} is null)`),uniqueIndex("one_pending_merchant_invitation").on(t.merchantUnitId,t.recipientId).where(sql`${t.status}='PENDING'`),uniqueIndex("one_pending_invitation_per_recipient").on(t.serviceId,t.recipientId).where(sql`${t.status}='PENDING'`),check("invitation_state_valid",sql`${t.status} in ('PENDING','ACCEPTED','DECLINED','REVOKED','EXPIRED')`),check("invitation_role_valid",sql`${t.role} in ('SECONDARY')`),check("invitation_version_positive",sql`${t.version}>0`),check("invitation_expiry_valid",sql`${t.expiresAt}>${t.createdAt}`),check("invitation_different_people",sql`${t.inviterId}<>${t.recipientId}`)]);
export const invitationPermissions=pgTable("invitation_permissions",{
  invitationId:uuid().notNull().references(()=>serviceInvitations.id),action:text().notNull(),delegable:boolean().notNull().default(false),
},t=>[primaryKey({columns:[t.invitationId,t.action]})]);
export const accessCommands=pgTable("access_command_receipts",{
  commandId:uuid().primaryKey(),targetKind:text({enum:["SERVICE","MERCHANT_UNIT"]}).notNull().default("SERVICE"),serviceId:uuid().references(()=>services.id),merchantUnitId:uuid().references(()=>merchantUnits.id),actorId:uuid().notNull().references(()=>people.id),kind:text().notNull(),resourceId:uuid().notNull(),digest:text().notNull(),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[check("access_command_target_shape",sql`(${t.targetKind}='SERVICE' and ${t.serviceId} is not null and ${t.merchantUnitId} is null) or (${t.targetKind}='MERCHANT_UNIT' and ${t.serviceId} is null and ${t.merchantUnitId} is not null)`),check("access_command_digest",sql`${t.digest} ~ '^[0-9a-f]{64}$'`)]);
export const accessHistory=pgTable("service_access_history",{
  id:uuid().primaryKey().defaultRandom(),targetKind:text({enum:["SERVICE","MERCHANT_UNIT"]}).notNull().default("SERVICE"),serviceId:uuid().references(()=>services.id),merchantUnitId:uuid().references(()=>merchantUnits.id),actorId:uuid().notNull().references(()=>people.id),personId:uuid().notNull().references(()=>people.id),invitationId:uuid().references(()=>serviceInvitations.id),kind:text().notNull(),message:text().notNull(),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[check("access_history_target_shape",sql`(${t.targetKind}='SERVICE' and ${t.serviceId} is not null and ${t.merchantUnitId} is null) or (${t.targetKind}='MERCHANT_UNIT' and ${t.serviceId} is null and ${t.merchantUnitId} is not null)`)]);

/** Direct merchant permission lineage never creates an service membership. */
export const merchantAssignments=pgTable("merchant_assignments",{
  id:uuid().primaryKey().defaultRandom(),merchantUnitId:uuid().notNull().references(()=>merchantUnits.id),personId:uuid().notNull().references(()=>people.id),
  sourceAssignmentId:uuid(),sourcePrimaryPersonId:uuid().references(()=>people.id),sourceMembershipVersion:integer(),
  state:text({enum:["ACCEPTED","REVOKED"]}).notNull().default("ACCEPTED"),version:integer().notNull().default(1),
  expiresAt:timestamp({withTimezone:true}).notNull(),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),revokedAt:timestamp({withTimezone:true}),
},t=>[unique("merchant_assignment_scope").on(t.id,t.merchantUnitId),
  foreignKey({columns:[t.sourceAssignmentId,t.merchantUnitId],foreignColumns:[t.id,t.merchantUnitId]}),
  uniqueIndex("merchant_assignment_live_person").on(t.merchantUnitId,t.personId).where(sql`${t.state}='ACCEPTED'`),
  index("merchant_assignment_person").on(t.personId,t.merchantUnitId),
  check("merchant_assignment_source",sql`(${t.sourceAssignmentId} is not null and ${t.sourceAssignmentId}<>${t.id} and ${t.sourcePrimaryPersonId} is null and ${t.sourceMembershipVersion} is null) or (${t.sourceAssignmentId} is null and ${t.sourcePrimaryPersonId} is not null and ${t.sourceMembershipVersion} is not null and ${t.sourceMembershipVersion}>0)`),
  check("merchant_assignment_fields",sql`${t.state} in ('ACCEPTED','REVOKED') and ${t.version}>0 and ${t.expiresAt}>${t.createdAt}`),
]);
export const merchantPermissionGrants=pgTable("merchant_permission_grants",{
  assignmentId:uuid().notNull().references(()=>merchantAssignments.id),action:text().notNull(),delegable:boolean().notNull().default(false),
},t=>[primaryKey({columns:[t.assignmentId,t.action]}),check("merchant_grant_action",sql`${t.action} in ('merchant.read','merchant.people.read','merchant.people.invite','merchant.people.revoke','channels.read','channels.create','channels.update','channels.close','channels.share','payments.read','payments.simulate')`)]);
export const merchantInvitationTerms=pgTable("merchant_invitation_terms",{
  invitationId:uuid().primaryKey().references(()=>serviceInvitations.id),merchantUnitId:uuid().notNull().references(()=>merchantUnits.id),
  accessExpiresAt:timestamp({withTimezone:true}).notNull(),
  sourceAssignmentId:uuid(),sourcePrimaryPersonId:uuid().references(()=>people.id),sourceMembershipVersion:integer(),
},t=>[foreignKey({columns:[t.invitationId,t.merchantUnitId],foreignColumns:[serviceInvitations.id,serviceInvitations.merchantUnitId]}),foreignKey({columns:[t.sourceAssignmentId,t.merchantUnitId],foreignColumns:[merchantAssignments.id,merchantAssignments.merchantUnitId]}),
  check("merchant_invitation_source",sql`(${t.sourceAssignmentId} is not null and ${t.sourcePrimaryPersonId} is null and ${t.sourceMembershipVersion} is null) or (${t.sourceAssignmentId} is null and ${t.sourcePrimaryPersonId} is not null and ${t.sourceMembershipVersion} is not null and ${t.sourceMembershipVersion}>0)`),
]);

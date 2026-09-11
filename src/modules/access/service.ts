import { requireSandboxParticipant, sandboxFixturesAllowed } from "../sandbox/service";
import { requireServiceReader } from "../services/service-reader";
import { createHash,randomUUID } from "node:crypto";
import { and,desc,eq,inArray,lte,or,sql } from "drizzle-orm";
import { getDb } from "../../platform/database/client";
import { services,serviceMembers,identityBindings,people,permissionGrants } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import {CARDHOLDER_PERMISSION_ACTIONS,isCardholderPermission} from "../policy/cardholder-scope";
import { ACTIONS,evaluate,type PolicyScope } from "../policy/evaluate";
import { decideMerchantInvitation,merchantInvitationProjection } from "./merchant-service";
import type {AnyInvitationProjection} from "./merchant-contracts";
import { loadServiceScope,type ScopedTransaction } from "./scope";
import { serviceInvitations,invitationPermissions,accessCommands,accessHistory } from "./schema";
import { ACCESS_PERMISSIONS,createInvitationSchema,invitationDecisionSchema,updateAccessSchema,type AccessPermission,type AccessOverview,type AccessPerson,type InvitationProjection,type InvitedRole,type CreateInvitationInput,type InvitationDecisionInput,type UpdateAccessInput } from "./contracts";

type Scope=Awaited<ReturnType<typeof loadServiceScope>>;
type Invitation=typeof serviceInvitations.$inferSelect;
function serviceTarget(row:Invitation):asserts row is Invitation&{serviceId:string;role:InvitedRole} {if(row.targetKind!=="SERVICE"||!row.serviceId||!row.role)throw new SecurityError("INVITATION_UNAVAILABLE",404);}
const secondaryCardPermissions=["cards.read","cards.hold","cards.purchase","cards.freeze","cards.unfreeze","activity.read","notifications.manage"] as const;
const cardServicePermissions:readonly AccessPermission[]=CARDHOLDER_PERMISSION_ACTIONS;
const administration=["people.invite","people.changeRole","people.revoke"];
const permissionLabels:Record<AccessPermission,[string,string]>={
  "cards.read":["View cards","View only cards assigned to this secondary cardholder."],
  "cards.hold":["Be selected as a cardholder","May have a card assigned to them. Requesting, creating and using a card each need separate permission."],
  "cards.request":["Prepare card requests","Save and review a request for an eligible cardholder. Creating the card needs separate permission."],
  "cards.create":["Create cards","Create a card from a saved request. Requires View cards; limits and cardholder eligibility are checked again."],
  "cards.purchase":["Make purchases","Make purchases only with their own cards. Requires View cards and Be selected as a cardholder."],
  "cards.freeze":["Freeze cards","Pause purchases on cards they hold or are allowed to manage. Requires View cards."],
  "cards.unfreeze":["Unfreeze cards","Resume purchases on cards they hold or are allowed to manage. Requires View cards."],
  "cards.manageMembers":["Manage secondary cards","Only the primary cardholder can manage secondary cards. Making purchases needs separate permission."],
  "activity.read":["View activity","View only activity belonging to this person’s cards."],
  "people.read":["View people","See the cardholders and their current permissions."],
  "people.invite":["Invite people","Invite people only with permissions they are allowed to share."],
  "people.changeRole":["Change access","Change only permissions they are allowed to share."],
  "people.revoke":["Revoke access","Remove only permissions they are allowed to manage."],
  "notifications.manage":["Manage own notifications","Save preferences for their own card activity. Notifications are not sent yet."],
};
async function sandboxPerson(tx:ScopedTransaction,personId:string) {
  try {await requireSandboxParticipant(tx,personId);}
  catch(error){if(error instanceof SecurityError&&error.code==="SERVICE_UNAVAILABLE")throw new SecurityError("RECIPIENT_UNAVAILABLE",404);throw error;}
}
async function now(tx:ScopedTransaction) { const result=await tx.execute(sql`select clock_timestamp() as now`);return new Date(result.rows[0]!.now as string|Date); }
function requireAction(scope:Scope,action:string) { if(scope.service.kind!=="CARDHOLDER"||!evaluate(scope.policy,action).allowed) throw new SecurityError("ACTION_DENIED",403); }
function requireVersion(actual:number,expected:number) { if(actual!==expected) throw new SecurityError("STALE_VERSION",409); }
function parse<T>(schema:{safeParse:(input:unknown)=>{success:true;data:T}|{success:false}},input:unknown):T {
  const result=schema.safeParse(input);if(!result.success)throw new SecurityError("INVALID_REQUEST",422);return result.data;
}
function ceiling(scope:Scope):AccessPermission[] {
  return ACCESS_PERMISSIONS.filter(action=>scope.policy.delegableActions?.includes(action)&&evaluate(scope.policy,action).allowed);
}
function assertDelegation(scope:Scope,role:InvitedRole,permissions:readonly AccessPermission[],delegable:readonly AccessPermission[]) {
  const allowed=ceiling(scope);
  if(permissions.some(action=>!allowed.includes(action)) || delegable.some(action=>!permissions.includes(action)||!allowed.includes(action))) throw new SecurityError("DELEGATION_CEILING_EXCEEDED",403);
  if(role!=="SECONDARY" && (delegable.length || permissions.some(action=>administration.includes(action)))) throw new SecurityError("ROLE_SCOPE_INVALID",422);
  if(permissions.some(action=>administration.includes(action))&&!permissions.includes("people.read")) throw new SecurityError("PEOPLE_READ_REQUIRED",422);
  // The same evaluator determines the proposed recipient's effective role/product/read rules.
  // This does not grant anything until the intended recipient accepts the invitation.
  if(delegable.length || permissions.some(action=>!(secondaryCardPermissions as readonly string[]).includes(action)))throw new SecurityError("SECONDARY_SCOPE_REQUIRED",422);
  const proposed={...scope.policy,actorPersonId:"secondary-recipient",membershipPersonId:"secondary-recipient",role,grants:permissions,delegableActions:delegable};
  for(const action of permissions) {
    if(!evaluate({...proposed,grants:ACCESS_PERMISSIONS},action).allowed) throw new SecurityError("ROLE_SCOPE_INVALID",422);
    if(!evaluate(proposed,action).allowed) throw new SecurityError("PERMISSION_PREREQUISITE_REQUIRED",422);
  }
}
async function memberGrants(tx:ScopedTransaction,serviceId:string,personId:string) {
  return tx.select().from(permissionGrants).where(and(eq(permissionGrants.serviceId,serviceId),eq(permissionGrants.personId,personId),eq(permissionGrants.state,"ACCEPTED")));
}
function canManageTarget(scope:Scope,target:typeof serviceMembers.$inferSelect,_grants:Awaited<ReturnType<typeof memberGrants>>,action:string) {
  return target.personId!==scope.policy.primaryPersonId&&target.personId!==scope.membership.personId&&target.state==="ACCEPTED"&&evaluate(scope.policy,action).allowed;
}
async function personProjection(tx:ScopedTransaction,scope:Scope,member:typeof serviceMembers.$inferSelect):Promise<AccessPerson> {
 const [person]=await tx.select().from(people).where(eq(people.id,member.personId));
 const grants=await memberGrants(tx,member.serviceId,member.personId);
 const role=member.personId===scope.policy.primaryPersonId?"PRIMARY":"SECONDARY";
 const policy:PolicyScope={...scope.policy,actorPersonId:member.personId,membershipPersonId:member.personId,membershipState:member.state,role,grants:grants.map(grant=>grant.action),delegableActions:grants.filter(grant=>grant.delegable).map(grant=>grant.action)};
 return {id:member.personId,displayName:person!.displayName,role,state:member.state,version:member.version,permissions:ACTIONS.filter(action=>isCardholderPermission(action)&&evaluate(policy,action).allowed),delegablePermissions:[],canManage:canManageTarget(scope,member,grants,"people.changeRole"),canRevoke:canManageTarget(scope,member,grants,"people.revoke"),isCurrentPerson:member.personId===scope.membership.personId};
}
function canRevokeOffer(scope:Scope,invitation:Invitation) {
 return evaluate(scope.policy,"people.revoke").allowed||(invitation.inviterId===scope.membership.personId&&evaluate(scope.policy,"people.invite").allowed);
}
async function invitationProjection(tx:ScopedTransaction,row:Invitation,viewerId:string,viewerScope?:Scope,asOf?:Date):Promise<InvitationProjection> {
  serviceTarget(row);
  const [service]=await tx.select().from(services).where(eq(services.id,row.serviceId));
  const [inviter]=await tx.select().from(people).where(eq(people.id,row.inviterId));
  const [recipient]=await tx.select().from(people).where(eq(people.id,row.recipientId));
  if(!service||service.kind!=="CARDHOLDER")throw new SecurityError("INVITATION_UNAVAILABLE",404);
  const [primary]=await tx.select({name:people.displayName,state:serviceMembers.state}).from(serviceMembers).innerJoin(people,eq(people.id,serviceMembers.personId)).where(and(eq(serviceMembers.serviceId,row.serviceId),eq(serviceMembers.personId,service.primaryPersonId)));
  const permissions=await tx.select().from(invitationPermissions).where(eq(invitationPermissions.invitationId,row.id)).orderBy(invitationPermissions.action);
  const [membership]=await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,row.serviceId),eq(serviceMembers.personId,row.recipientId)));
  const timestamp=asOf??await now(tx);
  const status=row.status==="PENDING"&&row.expiresAt<=timestamp?"EXPIRED":row.status;
  const policy:PolicyScope={actorPersonId:viewerId,serviceId:row.serviceId,resourceServiceId:row.serviceId,membershipPersonId:viewerId,membershipServiceId:row.serviceId,membershipState:"INVITED",role:row.role,serviceKind:service!.kind,status:service!.status,primaryPersonId:service!.primaryPersonId,primaryMembershipState:primary?.state??"REVOKED",invitation:{recipientPersonId:row.recipientId,status:row.status,expiresAt:row.expiresAt,now:timestamp}};
  return {targetKind:"SERVICE",id:row.id,serviceId:row.serviceId,serviceName:primary?`Cards with ${primary.name}`:"Cardholder services",serviceKind:service!.kind,inviterName:inviter!.displayName,recipientId:row.recipientId,recipientName:recipient!.displayName,role:row.role,
    permissions:permissions.filter(item=>isCardholderPermission(item.action)).map(item=>item.action as AccessPermission),delegablePermissions:permissions.filter(item=>isCardholderPermission(item.action)&&item.delegable).map(item=>item.action as AccessPermission),status,version:row.version,createdAt:row.createdAt.toISOString(),expiresAt:row.expiresAt.toISOString(),
    canRespond:evaluate(policy,"invitation.accept").allowed,canRevoke:status==="PENDING"&&!!viewerScope&&canRevokeOffer(viewerScope,row),hasServiceAccess:membership?.state==="ACCEPTED"&&primary?.state==="ACCEPTED"&&service!.status==="ACTIVE"};
}

export async function getAccessOverview(personId:string,serviceId:string):Promise<AccessOverview> {
  return getDb().transaction(async tx=>{
    await sandboxPerson(tx,personId);
    const scope=await loadServiceScope(tx,personId,serviceId);requireAction(scope,"people.read");
    const members=await tx.select().from(serviceMembers).where(eq(serviceMembers.serviceId,serviceId)).orderBy(serviceMembers.personId);
    const peopleRows:AccessPerson[]=[];for(const member of members) peopleRows.push(await personProjection(tx,scope,member));
    peopleRows.sort((a,b)=>a.displayName.localeCompare(b.displayName)||a.id.localeCompare(b.id));
    const timestamp=await now(tx),pending=and(eq(serviceInvitations.status,"PENDING"),sql`${serviceInvitations.expiresAt}>${timestamp}`);
    const [counts]=await tx.select({total:sql<number>`count(*)::integer`,pending:sql<number>`count(*) filter (where ${pending})::integer`}).from(serviceInvitations).where(eq(serviceInvitations.serviceId,serviceId));
    const rows=await tx.select().from(serviceInvitations).where(eq(serviceInvitations.serviceId,serviceId)).orderBy(sql`case when ${pending} then 0 else 1 end`,desc(serviceInvitations.createdAt),serviceInvitations.id).limit(100);
    const invitations:InvitationProjection[]=[];for(const row of rows)invitations.push(await invitationProjection(tx,row,personId,scope,timestamp));
    const canInvite=evaluate(scope.policy,"people.invite").allowed;
    const candidates=canInvite&&sandboxFixturesAllowed()?await tx.select({id:people.id,displayName:people.displayName}).from(identityBindings).innerJoin(people,eq(people.id,identityBindings.personId)).where(and(eq(identityBindings.issuer,"urn:etail:isolated-fixture"),inArray(identityBindings.subject,["owner","viewer"]))):[];
    const recipients=candidates.filter(candidate=>candidate.id!==personId&&!members.some(member=>member.personId===candidate.id&&member.state==="ACCEPTED")&&!invitations.some(invite=>invite.recipientId===candidate.id&&invite.status==="PENDING"));
    const historyLabels:Record<string,string>={INVITED:"Invitation created",INVITATION_ACCEPTED:"Invitation accepted",INVITATION_DECLINED:"Invitation declined",INVITATION_REVOKED:"Invitation canceled",INVITATION_EXPIRED:"Invitation expired",ACCESS_CHANGED:"Access changed",ACCESS_REVOKED:"Cardholder access removed"};
    const changes=await tx.select().from(accessHistory).where(and(eq(accessHistory.targetKind,"SERVICE"),eq(accessHistory.serviceId,serviceId))).orderBy(desc(accessHistory.createdAt),accessHistory.id).limit(101);
    const names=changes.length?await tx.select({id:people.id,name:people.displayName}).from(people).where(inArray(people.id,[...new Set(changes.flatMap(change=>[change.personId,change.actorId]))])):[];
    const nameById=new Map(names.map(person=>[person.id,person.name]));
    return {serviceId,serviceName:"Cardholder access",serviceKind:"CARDHOLDER",canInvite,canManage:evaluate(scope.policy,"people.changeRole").allowed,people:peopleRows,invitations,invitationTotal:counts!.total,pendingInvitationCount:counts!.pending,invitationsTruncated:counts!.total>rows.length,recipients,
      history:changes.slice(0,100).map(change=>({id:change.id,personId:change.personId,personName:nameById.get(change.personId)??"Cardholder",actorName:nameById.get(change.actorId)??"Cardholder",label:historyLabels[change.kind]??"Access updated",createdAt:change.createdAt.toISOString()})),historyHasMore:changes.length>100,
      permissionOptions:ceiling(scope).filter(action=>(secondaryCardPermissions as readonly string[]).includes(action)).map(action=>({action,label:permissionLabels[action][0],description:permissionLabels[action][1],canDelegate:false,allowedRoles:(["SECONDARY"] as const).filter(role=>evaluate({...scope.policy,actorPersonId:"secondary-recipient",membershipPersonId:"secondary-recipient",role,grants:ceiling(scope)},action).allowed)})).filter(option=>option.allowedRoles.length>0),roleOptions:["SECONDARY"],
      notice:"Invitations are saved for named sandbox members. No email is sent. Roles do not approve spending, issue cards or grant access to another service."};
  },{isolationLevel:"repeatable read"});
}
export async function listInvitationsForPerson(personId:string):Promise<AnyInvitationProjection[]> {
  return getDb().transaction(async tx=>{
    await requireServiceReader(tx,personId);
    const rows=await tx.select().from(serviceInvitations).where(eq(serviceInvitations.recipientId,personId)).orderBy(desc(serviceInvitations.createdAt),serviceInvitations.id).limit(100);
    const result:AnyInvitationProjection[]=[];for(const row of rows){
      if(row.targetKind==="MERCHANT_UNIT")result.push(await merchantInvitationProjection(tx,row,personId));
      else {serviceTarget(row);result.push(await invitationProjection(tx,row,personId));}
    }return result;
  });
}

async function receipt(tx:ScopedTransaction,personId:string,serviceId:string,kind:string,input:{commandId:string},targetId:string|null,mutate:()=>Promise<string>) {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"access:"+input.commandId},0))`);
  const digest=createHash("sha256").update(JSON.stringify({kind,targetId,input})).digest("hex");
  const [existing]=await tx.select().from(accessCommands).where(eq(accessCommands.commandId,input.commandId));
  if(existing) {
    if(existing.serviceId!==serviceId||existing.actorId!==personId||existing.kind!==kind||existing.digest!==digest)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);
    return existing.resourceId;
  }
  const resourceId=await mutate();await tx.insert(accessCommands).values({commandId:input.commandId,serviceId,actorId:personId,kind,resourceId,digest});return resourceId;
}
async function history(tx:ScopedTransaction,serviceId:string,actorId:string,personId:string,kind:string,message:string,invitationId?:string) {
  await tx.insert(accessHistory).values({serviceId,actorId,personId,kind,message,invitationId});
}
async function writePermissions(tx:ScopedTransaction,serviceId:string,personId:string,permissions:readonly string[],delegable:readonly string[]) {
  await tx.update(permissionGrants).set({state:"REVOKED",delegable:false}).where(and(eq(permissionGrants.serviceId,serviceId),eq(permissionGrants.personId,personId),inArray(permissionGrants.action,cardServicePermissions)));
  for(const action of permissions) await tx.insert(permissionGrants).values({serviceId,personId,action,state:"ACCEPTED",delegable:delegable.includes(action)}).onConflictDoUpdate({target:[permissionGrants.serviceId,permissionGrants.personId,permissionGrants.action],set:{state:"ACCEPTED",delegable:delegable.includes(action)}});
}
async function serviceCommand(personId:string,serviceId:string,kind:string,action:string,input:{commandId:string},targetId:string|null,mutate:(tx:ScopedTransaction,scope:Scope)=>Promise<string>) {
  return getDb().transaction(async tx=>{
    await sandboxPerson(tx,personId);const scope=await loadServiceScope(tx,personId,serviceId,true);requireAction(scope,action);
    return receipt(tx,personId,serviceId,kind,input,targetId,()=>mutate(tx,scope));
  });
}
async function serviceInvitation(personId:string,serviceId:string,invitationId:string) {
  return getDb().transaction(async tx=>{
    await sandboxPerson(tx,personId);const scope=await loadServiceScope(tx,personId,serviceId);requireAction(scope,"people.read");
    const [row]=await tx.select().from(serviceInvitations).where(and(eq(serviceInvitations.id,invitationId),eq(serviceInvitations.serviceId,serviceId)));
    if(!row)throw new SecurityError("INVITATION_UNAVAILABLE",404);return invitationProjection(tx,row,personId,scope);
  });
}
export async function createInvitation(personId:string,serviceId:string,raw:CreateInvitationInput):Promise<InvitationProjection> {
  const input=parse(createInvitationSchema,raw);
  const invitationId=await serviceCommand(personId,serviceId,"invitation.create","people.invite",input,null,async(tx,scope)=>{
    await sandboxPerson(tx,input.recipientId);if(input.recipientId===personId)throw new SecurityError("RECIPIENT_UNAVAILABLE",422);
    assertDelegation(scope,input.role,input.permissions,input.delegablePermissions);
    const [membership]=await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.personId,input.recipientId))).for("update");
    if(membership?.state==="ACCEPTED")throw new SecurityError("ALREADY_SERVICE_MEMBER",409);
    const timestamp=await now(tx);
    await tx.update(serviceInvitations).set({status:"EXPIRED",version:sql`${serviceInvitations.version}+1`,decidedAt:timestamp}).where(and(eq(serviceInvitations.serviceId,serviceId),eq(serviceInvitations.recipientId,input.recipientId),eq(serviceInvitations.status,"PENDING"),lte(serviceInvitations.expiresAt,timestamp)));
    const [pending]=await tx.select().from(serviceInvitations).where(and(eq(serviceInvitations.serviceId,serviceId),eq(serviceInvitations.recipientId,input.recipientId),eq(serviceInvitations.status,"PENDING")));
    if(pending)throw new SecurityError("PENDING_INVITATION_EXISTS",409);
    const id=randomUUID();
    await tx.insert(serviceInvitations).values({id,serviceId,inviterId:personId,recipientId:input.recipientId,role:input.role,createdAt:timestamp,expiresAt:new Date(timestamp.getTime()+input.expiresInDays*86400000)});
    for(const action of input.permissions)await tx.insert(invitationPermissions).values({invitationId:id,action,delegable:input.delegablePermissions.includes(action)});
    await history(tx,serviceId,personId,input.recipientId,"INVITED","Invitation created for its named recipient; no email sent.",id);return id;
  });
  return serviceInvitation(personId,serviceId,invitationId);
}
async function decideInvitation(personId:string,invitationId:string,raw:InvitationDecisionInput,decision:"accept"|"decline"):Promise<AnyInvitationProjection> {
  const input=parse(invitationDecisionSchema,raw);
  await getDb().transaction(async tx=>{
    await sandboxPerson(tx,personId);
    const [initial]=await tx.select().from(serviceInvitations).where(and(eq(serviceInvitations.id,invitationId),eq(serviceInvitations.recipientId,personId)));
    if(!initial)throw new SecurityError("INVITATION_UNAVAILABLE",404);
    if(initial.targetKind==="MERCHANT_UNIT")return decideMerchantInvitation(tx,personId,initial,input,decision);
    serviceTarget(initial);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"workspace:"+initial.serviceId},0))`);
    const [invitation]=await tx.select().from(serviceInvitations).where(and(eq(serviceInvitations.id,invitationId),eq(serviceInvitations.recipientId,personId))).for("update");
    if(!invitation)throw new SecurityError("INVITATION_UNAVAILABLE",404);
    serviceTarget(invitation);
    await receipt(tx,personId,invitation.serviceId,`invitation.${decision}`,input,invitationId,async()=>{
      requireVersion(invitation.version,input.expectedVersion);
      const [service]=await tx.select().from(services).where(eq(services.id,invitation.serviceId)).for("share");
      const [primary]=await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,invitation.serviceId),eq(serviceMembers.personId,service!.primaryPersonId))).for("share");
      const timestamp=await now(tx);
      const policy:PolicyScope={actorPersonId:personId,serviceId:invitation.serviceId,resourceServiceId:invitation.serviceId,membershipPersonId:personId,membershipServiceId:invitation.serviceId,membershipState:"INVITED",role:invitation.role,serviceKind:service!.kind,status:service!.status,primaryPersonId:service!.primaryPersonId,primaryMembershipState:primary?.state??"REVOKED",invitation:{recipientPersonId:personId,status:invitation.status,expiresAt:invitation.expiresAt,now:timestamp}};
      const result=evaluate(policy,`invitation.${decision}`);if(!result.allowed)throw new SecurityError(result.reasonCode,422);
      if(decision==="accept") {
        let inviter:Scope;
        try{inviter=await loadServiceScope(tx,invitation.inviterId,invitation.serviceId,true);requireAction(inviter,"people.invite");}catch(error){if(error instanceof SecurityError)throw new SecurityError("INVITER_ACCESS_CHANGED",409);throw error;}
        const grants=await tx.select().from(invitationPermissions).where(eq(invitationPermissions.invitationId,invitationId));
        assertDelegation(inviter,invitation.role,grants.map(grant=>grant.action as AccessPermission),grants.filter(grant=>grant.delegable).map(grant=>grant.action as AccessPermission));
        const [existing]=await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,invitation.serviceId),eq(serviceMembers.personId,personId))).for("update");
        if(existing?.state==="ACCEPTED")throw new SecurityError("ALREADY_SERVICE_MEMBER",409);
        if(existing)await tx.update(serviceMembers).set({state:"ACCEPTED",version:existing.version+1}).where(and(eq(serviceMembers.serviceId,invitation.serviceId),eq(serviceMembers.personId,personId)));
        else await tx.insert(serviceMembers).values({serviceId:invitation.serviceId,personId,state:"ACCEPTED"});
        await writePermissions(tx,invitation.serviceId,personId,grants.map(grant=>grant.action),grants.filter(grant=>grant.delegable).map(grant=>grant.action));
      }
      await tx.update(serviceInvitations).set({status:decision==="accept"?"ACCEPTED":"DECLINED",version:invitation.version+1,decidedAt:timestamp}).where(eq(serviceInvitations.id,invitationId));
      await history(tx,invitation.serviceId,personId,personId,decision==="accept"?"INVITATION_ACCEPTED":"INVITATION_DECLINED",decision==="accept"?"Named recipient accepted the exact offered service access. No financial product was approved.":"Named recipient declined the invitation.",invitationId);return invitationId;
    });
  });
  return getDb().transaction(async tx=>{await sandboxPerson(tx,personId);const [row]=await tx.select().from(serviceInvitations).where(and(eq(serviceInvitations.id,invitationId),eq(serviceInvitations.recipientId,personId)));if(!row)throw new SecurityError("INVITATION_UNAVAILABLE",404);return row.targetKind==="MERCHANT_UNIT"?merchantInvitationProjection(tx,row,personId):invitationProjection(tx,row,personId);});
}
export const acceptInvitation=(personId:string,id:string,input:InvitationDecisionInput)=>decideInvitation(personId,id,input,"accept");
export const declineInvitation=(personId:string,id:string,input:InvitationDecisionInput)=>decideInvitation(personId,id,input,"decline");

export async function revokeInvitation(personId:string,serviceId:string,invitationId:string,raw:InvitationDecisionInput):Promise<InvitationProjection> {
  const input=parse(invitationDecisionSchema,raw);
  await getDb().transaction(async tx=>{
    await sandboxPerson(tx,personId);const scope=await loadServiceScope(tx,personId,serviceId,true);requireAction(scope,"people.read");
    const [invitation]=await tx.select().from(serviceInvitations).where(and(eq(serviceInvitations.id,invitationId),eq(serviceInvitations.serviceId,serviceId))).for("update");
    if(!invitation)throw new SecurityError("INVITATION_UNAVAILABLE",404);
    if(!canRevokeOffer(scope,invitation))throw new SecurityError("ACTION_DENIED",403);
    await receipt(tx,personId,serviceId,"invitation.revoke",input,invitationId,async()=>{
      requireVersion(invitation.version,input.expectedVersion);if(invitation.status!=="PENDING")throw new SecurityError("INVITATION_ALREADY_USED",422);
      await tx.update(serviceInvitations).set({status:"REVOKED",version:invitation.version+1,decidedAt:await now(tx)}).where(eq(serviceInvitations.id,invitationId));
      await history(tx,serviceId,personId,invitation.recipientId,"INVITATION_REVOKED","Pending invitation revoked before acceptance.",invitationId);return invitationId;
    });
  });
  return serviceInvitation(personId,serviceId,invitationId);
}
async function invalidateInvitations(tx:ScopedTransaction,serviceId:string,personId:string,includeIncoming:boolean) {
  const subject=includeIncoming?or(eq(serviceInvitations.inviterId,personId),eq(serviceInvitations.recipientId,personId)):eq(serviceInvitations.inviterId,personId);
  await tx.update(serviceInvitations).set({status:"REVOKED",version:sql`${serviceInvitations.version}+1`,decidedAt:await now(tx)}).where(and(eq(serviceInvitations.serviceId,serviceId),eq(serviceInvitations.status,"PENDING"),subject));
}
async function returnedPerson(actorId:string,serviceId:string,personId:string) { const result=(await getAccessOverview(actorId,serviceId)).people.find(item=>item.id===personId);if(!result)throw new SecurityError("PERSON_UNAVAILABLE",404);return result; }
export async function updateMemberAccess(personId:string,serviceId:string,targetId:string,raw:UpdateAccessInput):Promise<AccessPerson> {
  const input=parse(updateAccessSchema,raw);
  await serviceCommand(personId,serviceId,"member.update","people.changeRole",input,targetId,async(tx,scope)=>{
    const [target]=await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.personId,targetId))).for("update");
    if(!target)throw new SecurityError("PERSON_UNAVAILABLE",404);
    requireVersion(target.version,input.expectedVersion);const grants=await memberGrants(tx,serviceId,targetId);
    if(!canManageTarget(scope,target,grants,"people.changeRole"))throw new SecurityError("TARGET_ACCESS_PROTECTED",403);
    assertDelegation(scope,input.role,input.permissions,input.delegablePermissions);
    await tx.update(serviceMembers).set({version:target.version+1}).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.personId,targetId)));
    await writePermissions(tx,serviceId,targetId,input.permissions,input.delegablePermissions);await invalidateInvitations(tx,serviceId,targetId,false);
    await history(tx,serviceId,personId,targetId,"ACCESS_CHANGED","Card permissions replaced with the reviewed selection; card invitations canceled. Merchant membership, permissions and history were retained.");return targetId;
  });
  return returnedPerson(personId,serviceId,targetId);
}
export async function revokeMemberAccess(personId:string,serviceId:string,targetId:string,raw:InvitationDecisionInput):Promise<AccessPerson> {
  const input=parse(invitationDecisionSchema,raw);
  await serviceCommand(personId,serviceId,"member.revoke","people.revoke",input,targetId,async(tx,scope)=>{
    const [target]=await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.personId,targetId))).for("update");
    if(!target)throw new SecurityError("PERSON_UNAVAILABLE",404);
    requireVersion(target.version,input.expectedVersion);if(!canManageTarget(scope,target,await memberGrants(tx,serviceId,targetId),"people.revoke"))throw new SecurityError("TARGET_ACCESS_PROTECTED",403);
    await tx.update(serviceMembers).set({state:"REVOKED",version:target.version+1}).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.personId,targetId)));
    await writePermissions(tx,serviceId,targetId,[],[]);await invalidateInvitations(tx,serviceId,targetId,true);
    await history(tx,serviceId,personId,targetId,"ACCESS_REVOKED","Card access and related card invitations revoked. Merchant membership and permissions, historical records and obligations remain unchanged.");return targetId;
  });
  return returnedPerson(personId,serviceId,targetId);
}

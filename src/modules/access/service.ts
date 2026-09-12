import { requireSandboxParticipant } from "../sandbox/service";
import { requireServiceReader } from "../services/service-reader";
import { createHash,randomUUID } from "node:crypto";
import { and,desc,eq,inArray,lte,or,sql } from "drizzle-orm";
import { getDb } from "../../platform/database/client";
import { services,serviceMembers,people,permissionGrants } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import {isCardholderPermission} from "../policy/cardholder-scope";
import { ACTIONS,evaluate,type PolicyScope } from "../policy/evaluate";
import { decideMerchantInvitation,merchantInvitationProjection } from "./merchant-service";
import type {AnyInvitationProjection} from "./merchant-contracts";
import { lockMoneyAccountsForServices } from "../money/service";
import { loadServiceScope,type ScopedTransaction } from "./scope";
import { serviceInvitations,invitationPermissions,accessCommands,accessHistory } from "./schema";
import { ACCESS_PERMISSIONS,CARDHOLDER_ACCESS_PERMISSIONS,createInvitationSchema,invitationDecisionSchema,type AccessPermission,type AccessOverview,type AccessPerson,type InvitationProjection,type InvitedRole,type CreateInvitationInput,type InvitationDecisionInput } from "./contracts";

type Scope=Awaited<ReturnType<typeof loadServiceScope>>;
type Invitation=typeof serviceInvitations.$inferSelect;
function serviceTarget(row:Invitation):asserts row is Invitation&{serviceId:string;role:InvitedRole} {if(row.targetKind!=="SERVICE"||!row.serviceId||!row.role)throw new SecurityError("INVITATION_UNAVAILABLE",404);}
const cardServicePermissions:readonly AccessPermission[]=ACCESS_PERMISSIONS.filter(isCardholderPermission);
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
function assertCardholderAccess(scope:Scope) {requireAction(scope,"people.invite");if(scope.service.primaryPersonId!==scope.policy.actorPersonId)throw new SecurityError("ACTION_DENIED",403);}
async function memberGrants(tx:ScopedTransaction,serviceId:string,personId:string) {
  return tx.select().from(permissionGrants).where(and(eq(permissionGrants.serviceId,serviceId),eq(permissionGrants.personId,personId),eq(permissionGrants.state,"ACCEPTED")));
}
function canManageTarget(scope:Scope,target:typeof serviceMembers.$inferSelect,_grants:Awaited<ReturnType<typeof memberGrants>>,action:string) {
  return target.personId!==scope.policy.primaryPersonId&&target.personId!==scope.membership.personId&&target.state==="ACCEPTED"&&evaluate(scope.policy,action).allowed;
}
async function personProjection(tx:ScopedTransaction,scope:Scope,member:typeof serviceMembers.$inferSelect):Promise<AccessPerson> {
 const [person]=await tx.select().from(people).where(eq(people.id,member.personId));
 const grants=await memberGrants(tx,member.serviceId,member.personId);
 const role=member.personId===scope.policy.primaryPersonId?"OWNER":"CARDHOLDER";
 const policy:PolicyScope={...scope.policy,actorPersonId:member.personId,membershipPersonId:member.personId,membershipState:member.state,role,grants:role==="CARDHOLDER"?[...CARDHOLDER_ACCESS_PERMISSIONS]:grants.map(grant=>grant.action),delegableActions:[]};
 return {id:member.personId,displayName:person!.displayName,role,state:member.state,version:member.version,permissions:ACTIONS.filter(action=>isCardholderPermission(action)&&evaluate(policy,action).allowed),delegablePermissions:[],canManage:false,canRevoke:canManageTarget(scope,member,grants,"people.revoke"),isCurrentPerson:member.personId===scope.membership.personId};
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
  let inviterCurrent=false;
  if(row.inviterId===service.primaryPersonId){try{const inviterScope=await loadServiceScope(tx,row.inviterId,row.serviceId);inviterCurrent=evaluate(inviterScope.policy,"people.invite").allowed;}catch(error){if(!(error instanceof SecurityError))throw error;}}
  const [membership]=await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,row.serviceId),eq(serviceMembers.personId,row.recipientId)));
  const timestamp=asOf??await now(tx);
  const status=row.status==="PENDING"&&row.expiresAt<=timestamp?"EXPIRED":row.status;
  const policy:PolicyScope={actorPersonId:viewerId,serviceId:row.serviceId,resourceServiceId:row.serviceId,membershipPersonId:viewerId,membershipServiceId:row.serviceId,membershipState:"INVITED",role:row.role,serviceKind:service!.kind,status:service!.status,primaryPersonId:service!.primaryPersonId,primaryMembershipState:primary?.state??"REVOKED",invitation:{recipientPersonId:row.recipientId,status:row.status,expiresAt:row.expiresAt,now:timestamp}};
  return {targetKind:"SERVICE",id:row.id,serviceId:row.serviceId,serviceName:primary?`Cards with ${primary.name}`:"Cardholder services",serviceKind:service!.kind,inviterName:inviter!.displayName,recipientId:row.recipientId,recipientName:recipient!.displayName,role:row.role,
    permissions:[...CARDHOLDER_ACCESS_PERMISSIONS],delegablePermissions:[],status,version:row.version,createdAt:row.createdAt.toISOString(),expiresAt:row.expiresAt.toISOString(),
    canRespond:inviterCurrent&&evaluate(policy,"invitation.accept").allowed,canRevoke:status==="PENDING"&&!!viewerScope&&canRevokeOffer(viewerScope,row),hasServiceAccess:membership?.state==="ACCEPTED"&&primary?.state==="ACCEPTED"&&service!.status==="ACTIVE"};
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
    const recipients:{id:string;displayName:string}[]=[];
    const historyLabels:Record<string,string>={INVITED:"Invitation created",INVITATION_ACCEPTED:"Invitation accepted",INVITATION_DECLINED:"Invitation declined",INVITATION_REVOKED:"Invitation canceled",INVITATION_EXPIRED:"Invitation expired",ACCESS_CHANGED:"Access changed",ACCESS_REVOKED:"Cardholder access removed"};
    const changes=await tx.select().from(accessHistory).where(and(eq(accessHistory.targetKind,"SERVICE"),eq(accessHistory.serviceId,serviceId))).orderBy(desc(accessHistory.createdAt),accessHistory.id).limit(101);
    const names=changes.length?await tx.select({id:people.id,name:people.displayName}).from(people).where(inArray(people.id,[...new Set(changes.flatMap(change=>[change.personId,change.actorId]))])):[];
    const nameById=new Map(names.map(person=>[person.id,person.name]));
    return {serviceId,serviceName:"Cardholder access",serviceKind:"CARDHOLDER",canInvite,canManage:false,people:peopleRows,invitations,invitationTotal:counts!.total,pendingInvitationCount:counts!.pending,invitationsTruncated:counts!.total>rows.length,recipients,
      history:changes.slice(0,100).map(change=>({id:change.id,personId:change.personId,personName:nameById.get(change.personId)??"Cardholder",actorName:nameById.get(change.actorId)??"Cardholder",label:historyLabels[change.kind]??"Access updated",createdAt:change.createdAt.toISOString()})),historyHasMore:changes.length>100,
      permissionOptions:[],roleOptions:[],
      notice:"Invite a person to use their own cards. You manage the group money and each card’s allowance."};
  },{isolationLevel:"repeatable read"});
}
export async function listInvitationsForPerson(personId:string):Promise<AnyInvitationProjection[]> {
  return getDb().transaction(async tx=>{
    await requireServiceReader(tx,personId);
    const rows=await tx.select().from(serviceInvitations).where(eq(serviceInvitations.recipientId,personId)).orderBy(desc(serviceInvitations.createdAt),serviceInvitations.id).limit(100);
    const result:AnyInvitationProjection[]=[];for(const row of rows){
      if(row.targetKind==="MERCHANT_TERMINAL")result.push(await merchantInvitationProjection(tx,row,personId));
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
    assertCardholderAccess(scope);
    const [membership]=await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.personId,input.recipientId))).for("update");
    if(membership?.state==="ACCEPTED")throw new SecurityError("ALREADY_SERVICE_MEMBER",409);
    const timestamp=await now(tx);
    await tx.update(serviceInvitations).set({status:"EXPIRED",version:sql`${serviceInvitations.version}+1`,decidedAt:timestamp}).where(and(eq(serviceInvitations.serviceId,serviceId),eq(serviceInvitations.recipientId,input.recipientId),eq(serviceInvitations.status,"PENDING"),lte(serviceInvitations.expiresAt,timestamp)));
    const [pending]=await tx.select().from(serviceInvitations).where(and(eq(serviceInvitations.serviceId,serviceId),eq(serviceInvitations.recipientId,input.recipientId),eq(serviceInvitations.status,"PENDING")));
    if(pending)throw new SecurityError("PENDING_INVITATION_EXISTS",409);
    const id=randomUUID();
    await tx.insert(serviceInvitations).values({id,serviceId,inviterId:personId,recipientId:input.recipientId,role:"CARDHOLDER",createdAt:timestamp,expiresAt:new Date(timestamp.getTime()+input.expiresInDays*86400000)});
    for(const action of CARDHOLDER_ACCESS_PERMISSIONS)await tx.insert(invitationPermissions).values({invitationId:id,action,delegable:false});
    await history(tx,serviceId,personId,input.recipientId,"INVITED","Invitation created for the named cardholder.",id);return id;
  });
  return serviceInvitation(personId,serviceId,invitationId);
}
async function decideInvitation(personId:string,invitationId:string,raw:InvitationDecisionInput,decision:"accept"|"decline"):Promise<AnyInvitationProjection> {
  const input=parse(invitationDecisionSchema,raw);
  await getDb().transaction(async tx=>{
    await sandboxPerson(tx,personId);
    const [initial]=await tx.select().from(serviceInvitations).where(and(eq(serviceInvitations.id,invitationId),eq(serviceInvitations.recipientId,personId)));
    if(!initial)throw new SecurityError("INVITATION_UNAVAILABLE",404);
    if(initial.targetKind==="MERCHANT_TERMINAL")return decideMerchantInvitation(tx,personId,initial,input,decision);
    serviceTarget(initial);
    await lockMoneyAccountsForServices(tx,[initial.serviceId]);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"workspace:"+initial.serviceId},0))`);
    const [invitation]=await tx.select().from(serviceInvitations).where(and(eq(serviceInvitations.id,invitationId),eq(serviceInvitations.recipientId,personId))).for("update");
    if(!invitation)throw new SecurityError("INVITATION_UNAVAILABLE",404);
    serviceTarget(invitation);
    if(decision==="accept") {
      try {const inviter=await loadServiceScope(tx,invitation.inviterId,invitation.serviceId,true);assertCardholderAccess(inviter);}
      catch(error){if(error instanceof SecurityError)throw new SecurityError("INVITER_ACCESS_CHANGED",409);throw error;}
    }
    await receipt(tx,personId,invitation.serviceId,`invitation.${decision}`,input,invitationId,async()=>{
      requireVersion(invitation.version,input.expectedVersion);
      const [service]=await tx.select().from(services).where(eq(services.id,invitation.serviceId)).for("share");
      const [primary]=await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,invitation.serviceId),eq(serviceMembers.personId,service!.primaryPersonId))).for("share");
      const timestamp=await now(tx);
      const policy:PolicyScope={actorPersonId:personId,serviceId:invitation.serviceId,resourceServiceId:invitation.serviceId,membershipPersonId:personId,membershipServiceId:invitation.serviceId,membershipState:"INVITED",role:invitation.role,serviceKind:service!.kind,status:service!.status,primaryPersonId:service!.primaryPersonId,primaryMembershipState:primary?.state??"REVOKED",invitation:{recipientPersonId:personId,status:invitation.status,expiresAt:invitation.expiresAt,now:timestamp}};
      const result=evaluate(policy,`invitation.${decision}`);if(!result.allowed)throw new SecurityError(result.reasonCode,422);
      if(decision==="accept") {
        const [existing]=await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,invitation.serviceId),eq(serviceMembers.personId,personId))).for("update");
        if(existing?.state==="ACCEPTED")throw new SecurityError("ALREADY_SERVICE_MEMBER",409);
        if(existing)await tx.update(serviceMembers).set({state:"ACCEPTED",version:existing.version+1}).where(and(eq(serviceMembers.serviceId,invitation.serviceId),eq(serviceMembers.personId,personId)));
        else await tx.insert(serviceMembers).values({serviceId:invitation.serviceId,personId,state:"ACCEPTED"});
        await writePermissions(tx,invitation.serviceId,personId,CARDHOLDER_ACCESS_PERMISSIONS,[]);
      }
      await tx.update(serviceInvitations).set({status:decision==="accept"?"ACCEPTED":"DECLINED",version:invitation.version+1,decidedAt:timestamp}).where(eq(serviceInvitations.id,invitationId));
      await history(tx,invitation.serviceId,personId,personId,decision==="accept"?"INVITATION_ACCEPTED":"INVITATION_DECLINED",decision==="accept"?"Named recipient accepted the exact offered service access. No financial product was approved.":"Named recipient declined the invitation.",invitationId);return invitationId;
    });
  });
  return getDb().transaction(async tx=>{await sandboxPerson(tx,personId);const [row]=await tx.select().from(serviceInvitations).where(and(eq(serviceInvitations.id,invitationId),eq(serviceInvitations.recipientId,personId)));if(!row)throw new SecurityError("INVITATION_UNAVAILABLE",404);return row.targetKind==="MERCHANT_TERMINAL"?merchantInvitationProjection(tx,row,personId):invitationProjection(tx,row,personId);});
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

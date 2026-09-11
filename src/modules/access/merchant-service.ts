import { sandboxFixturesAllowed } from "../sandbox/service";
import { createHash,randomUUID } from "node:crypto";
import { and,desc,eq,inArray,sql } from "drizzle-orm";
import { getDb } from "../../platform/database/client";
import { identityBindings,people } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import { merchantUnits } from "../acquiring/schema";
import { evaluate,type MerchantPolicyScope } from "../policy/evaluate";
import { serviceInvitations,invitationPermissions,accessCommands,accessHistory,merchantAssignments,merchantPermissionGrants,merchantInvitationTerms } from "./schema";
import { loadMerchantUnitScope,merchantNow,requireMerchantParticipant } from "./merchant-scope";
import { createMerchantInvitationSchema,MERCHANT_PERMISSIONS,type CreateMerchantInvitationInput,type MerchantAccessOverview,type MerchantAccessPerson,type MerchantInvitationProjection,type MerchantPermission } from "./merchant-contracts";
import { invitationDecisionSchema,type InvitationDecisionInput } from "./contracts";
import type { ScopedTransaction } from "./scope";

type Scope=Awaited<ReturnType<typeof loadMerchantUnitScope>>;
type Invite=typeof serviceInvitations.$inferSelect;
function parse<T>(schema:{safeParse:(raw:unknown)=>{success:true;data:T}|{success:false}},raw:unknown):T {const result=schema.safeParse(raw);if(!result.success)throw new SecurityError("INVALID_REQUEST",422);return result.data;}
function action(scope:Scope,name:string){if(!evaluate(scope.policy,name).allowed)throw new SecurityError("ACTION_DENIED",403);}
function version(actual:number,expected:number){if(actual!==expected)throw new SecurityError("STALE_VERSION",409);}
function ceiling(scope:Scope){return MERCHANT_PERMISSIONS.filter(name=>scope.policy.delegableActions.includes(name)&&evaluate(scope.policy,name).allowed);}
function delegation(scope:Scope,permissions:readonly string[],delegable:readonly string[]) {
  const allowed:readonly string[]=ceiling(scope);
  if(permissions.some(name=>!allowed.includes(name))||delegable.some(name=>!permissions.includes(name)||!allowed.includes(name)))throw new SecurityError("DELEGATION_CEILING_EXCEEDED",403);
  if((permissions.includes("payments.simulate")&&!permissions.includes("payments.read"))||!permissions.includes("merchant.read")||(permissions.some(name=>name.startsWith("channels."))&&!permissions.includes("channels.read"))||(permissions.some(name=>["merchant.people.invite","merchant.people.revoke"].includes(name))&&!permissions.includes("merchant.people.read")))throw new SecurityError("READ_SCOPE_REQUIRED",422);
}
function provenance(scope:Scope) {
  if(scope.assignment){let parent=scope.assignment,depth=1;while(parent.sourceAssignmentId){const next=scope.assignments.find(item=>item.id===parent.sourceAssignmentId);if(!next||depth>=3)throw new SecurityError("DELEGATION_DEPTH_EXCEEDED",422);parent=next;depth++;}return {sourceAssignmentId:scope.assignment.id,sourcePrimaryPersonId:null,sourceMembershipVersion:null};}
  const authority=scope.policy.authority;
  if(!authority||authority.kind!=="PRIMARY_MEMBER"||!authority.membershipVersion)throw new SecurityError("DELEGATION_REQUIRED",403);
  return {sourceAssignmentId:null,sourcePrimaryPersonId:authority.personId,sourceMembershipVersion:authority.membershipVersion};
}
function sameSource(scope:Scope,terms:typeof merchantInvitationTerms.$inferSelect){const current=provenance(scope);return current.sourceAssignmentId===terms.sourceAssignmentId&&current.sourcePrimaryPersonId===terms.sourcePrimaryPersonId&&current.sourceMembershipVersion===terms.sourceMembershipVersion;}
async function receipt(tx:ScopedTransaction,personId:string,unitId:string,kind:string,input:{commandId:string},targetId:string|null,run:()=>Promise<string>) {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"access:"+input.commandId},0))`);
  const digest=createHash("sha256").update(JSON.stringify({kind,targetId,input})).digest("hex");
  const [old]=await tx.select().from(accessCommands).where(eq(accessCommands.commandId,input.commandId));
  if(old){if(old.targetKind!=="MERCHANT_UNIT"||old.merchantUnitId!==unitId||old.actorId!==personId||old.kind!==kind||old.digest!==digest)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);return old.resourceId;}
  const resourceId=await run();await tx.insert(accessCommands).values({targetKind:"MERCHANT_UNIT",merchantUnitId:unitId,actorId:personId,commandId:input.commandId,kind,resourceId,digest});return resourceId;
}
async function history(tx:ScopedTransaction,unitId:string,actorId:string,personId:string,kind:string,invitationId?:string){await tx.insert(accessHistory).values({targetKind:"MERCHANT_UNIT",merchantUnitId:unitId,actorId,personId,kind,invitationId,message:"Named merchant access changed. Cardholder access is unchanged."});}
function isDescendant(scope:Scope,id:string,parentId:string):boolean {let current=scope.assignments.find(row=>row.id===id);for(let depth=0;current&&depth<4;depth++){if(current.sourceAssignmentId===parentId)return true;current=scope.assignments.find(row=>row.id===current!.sourceAssignmentId);}return false;}
function canRevoke(scope:Scope,row:typeof merchantAssignments.$inferSelect){return row.personId!==scope.policy.actorPersonId&&evaluate(scope.policy,"merchant.people.revoke").allowed&&(!scope.assignment||isDescendant(scope,row.id,scope.assignment.id));}
async function personProjection(tx:ScopedTransaction,scope:Scope,row:typeof merchantAssignments.$inferSelect):Promise<MerchantAccessPerson>{
  const [person]=await tx.select().from(people).where(eq(people.id,row.personId));const live=scope.liveAssignments.some(item=>item.id===row.id),grants=scope.allGrants.filter(grant=>grant.assignmentId===row.id);
  return {id:row.id,personId:row.personId,displayName:person!.displayName,state:row.state==="REVOKED"?"REVOKED":row.expiresAt<=scope.now?"EXPIRED":live?"ACCEPTED":"UNAVAILABLE",version:row.version,permissions:live?grants.map(grant=>grant.action as MerchantPermission):[],delegablePermissions:live?grants.filter(grant=>grant.delegable).map(grant=>grant.action as MerchantPermission):[],expiresAt:row.expiresAt.toISOString(),canRevoke:row.state==="ACCEPTED"&&canRevoke(scope,row),isCurrentPerson:row.personId===scope.policy.actorPersonId};
}
export async function merchantInvitationProjection(tx:ScopedTransaction,row:Invite,viewerId:string,scope?:Scope):Promise<MerchantInvitationProjection>{
  if(row.targetKind!=="MERCHANT_UNIT"||!row.merchantUnitId)throw new SecurityError("INVITATION_UNAVAILABLE",404);
  const [terms]=await tx.select().from(merchantInvitationTerms).where(eq(merchantInvitationTerms.invitationId,row.id));
  const [unit]=await tx.select().from(merchantUnits).where(eq(merchantUnits.id,row.merchantUnitId));
  if(!terms||!unit)throw new SecurityError("INVITATION_UNAVAILABLE",404);
  const [master]=await tx.select().from(merchantUnits).where(eq(merchantUnits.id,unit.masterId??unit.id));
  const persons=await tx.select().from(people).where(inArray(people.id,[row.inviterId,row.recipientId]));
  const grants=await tx.select().from(invitationPermissions).where(eq(invitationPermissions.invitationId,row.id));const timestamp=scope?.now??await merchantNow(tx);
  const status=row.status==="PENDING"&&(row.expiresAt<=timestamp||terms.accessExpiresAt<=timestamp)?"EXPIRED":row.status;
  let canRespond=false,hasMerchantAccess=false;
  if(viewerId===row.recipientId&&status==="PENDING")try{const inviter=await loadMerchantUnitScope(tx,row.inviterId,unit.id);action(inviter,"merchant.people.invite");delegation(inviter,grants.map(g=>g.action),grants.filter(g=>g.delegable).map(g=>g.action));canRespond=sameSource(inviter,terms);}catch(error){if(!(error instanceof SecurityError))throw error;}
  if(viewerId===row.recipientId||scope)try{await loadMerchantUnitScope(tx,row.recipientId,unit.id);hasMerchantAccess=true;}catch(error){if(!(error instanceof SecurityError))throw error;}
  const canRevokeOffer=!!scope&&(evaluate(scope.policy,"merchant.people.revoke").allowed||(row.inviterId===viewerId&&evaluate(scope.policy,"merchant.people.invite").allowed))&&(!scope.assignment||terms.sourceAssignmentId===scope.assignment.id||(!!terms.sourceAssignmentId&&isDescendant(scope,terms.sourceAssignmentId,scope.assignment.id)));
  return {targetKind:"MERCHANT_UNIT",id:row.id,merchantUnitId:unit.id,merchantName:unit.displayName,masterName:master!.displayName,inviterName:persons.find(p=>p.id===row.inviterId)!.displayName,recipientId:row.recipientId,recipientName:persons.find(p=>p.id===row.recipientId)!.displayName,permissions:grants.map(g=>g.action as MerchantPermission),delegablePermissions:grants.filter(g=>g.delegable).map(g=>g.action as MerchantPermission),status,version:row.version,createdAt:row.createdAt.toISOString(),expiresAt:row.expiresAt.toISOString(),accessExpiresAt:terms.accessExpiresAt.toISOString(),canRespond,canRevoke:status==="PENDING"&&canRevokeOffer,hasMerchantAccess,href:`/merchants/${unit.id}`};
}
export async function getMerchantAccessOverview(personId:string,unitId:string):Promise<MerchantAccessOverview>{return getDb().transaction(async tx=>{
  const scope=await loadMerchantUnitScope(tx,personId,unitId,false,{read:true});action(scope,"merchant.people.read");
  const persons:MerchantAccessPerson[]=[];for(const row of scope.assignments)persons.push(await personProjection(tx,scope,row));
  const waiting=sql`(${serviceInvitations.status} = 'PENDING' AND ${serviceInvitations.expiresAt} > ${scope.now} AND ${merchantInvitationTerms.accessExpiresAt} > ${scope.now})`;
  const [counts]=await tx.select({total:sql<number>`count(*)::int`,pending:sql<number>`count(*) filter (where ${waiting})::int`}).from(serviceInvitations).leftJoin(merchantInvitationTerms,eq(merchantInvitationTerms.invitationId,serviceInvitations.id)).where(eq(serviceInvitations.merchantUnitId,unitId));
  const selected=await tx.select({invitation:serviceInvitations}).from(serviceInvitations).leftJoin(merchantInvitationTerms,eq(merchantInvitationTerms.invitationId,serviceInvitations.id)).where(eq(serviceInvitations.merchantUnitId,unitId)).orderBy(desc(sql`case when ${waiting} then 1 else 0 end`),desc(serviceInvitations.createdAt),serviceInvitations.id).limit(100);
  const rows=selected.map(row=>row.invitation);
  const invitations:MerchantInvitationProjection[]=[];for(const row of rows)invitations.push(await merchantInvitationProjection(tx,row,personId,scope));
  const canInvite=evaluate(scope.policy,"merchant.people.invite").allowed;
  const accessDays=([1,7,30] as const).filter(days=>canInvite&&(!scope.assignment||scope.now.getTime()+days*86400000<=scope.assignment.expiresAt.getTime()));
  const invitationOptions:MerchantAccessOverview["invitationOptions"]={accessDays,invitationDays:([1,3,7] as const).filter(days=>accessDays.some(accessDay=>days<=accessDay)),accessExpiresAt:scope.assignment?.expiresAt.toISOString()??null};
  const candidates=canInvite&&sandboxFixturesAllowed()?await tx.select({id:people.id,displayName:people.displayName}).from(identityBindings).innerJoin(people,eq(people.id,identityBindings.personId)).where(and(eq(identityBindings.issuer,"urn:etail:isolated-fixture"),inArray(identityBindings.subject,["owner","viewer"]))):[];
  const controllers:MerchantAccessOverview["controllers"]=[];
  for(const id of [scope.masterService.primaryPersonId]){const [person]=await tx.select().from(people).where(eq(people.id,id));controllers.push({personId:id,displayName:person!.displayName,basis:"PRIMARY_MEMBER"});}
  return {merchantUnitId:unitId,merchantName:scope.unit.displayName,masterName:scope.master.displayName,canInvite,invitationTotal:counts!.total,pendingInvitationCount:counts!.pending,invitationsTruncated:counts!.total>rows.length,invitationOptions,controllers,people:persons,invitations,recipients:candidates.filter(row=>row.id!==personId&&!scope.liveAssignments.some(item=>item.personId===row.id)&&!invitations.some(item=>item.recipientId===row.id&&item.status==="PENDING")),permissionOptions:ceiling(scope).filter(name=>name!=="payments.simulate").map(name=>({action:name,label:({"merchant.read":"View merchant unit","merchant.people.read":"View merchant people","merchant.people.invite":"Invite merchant helpers","merchant.people.revoke":"Revoke delegated merchant access","channels.read":"View channel drafts","channels.create":"Create channel drafts","channels.update":"Edit permitted channel drafts","channels.close":"Cancel permitted channel drafts","channels.share":"Share channels","payments.read":"View payments","payments.simulate":"Try a sandbox payment"} satisfies Record<MerchantPermission,string>)[name],description:"Applies only to this merchant unit. Cardholder access and transfer permission are separate.",canDelegate:true})),notice:"Named sandbox members accept merchant-only access. Only the reviewed merchant permissions are granted. Access expires and stops when its delegation source is withdrawn."};
},{isolationLevel:"repeatable read"});}
export async function createMerchantInvitation(personId:string,unitId:string,raw:CreateMerchantInvitationInput):Promise<MerchantInvitationProjection>{const input=parse(createMerchantInvitationSchema,raw);return getDb().transaction(async tx=>{
  const scope=await loadMerchantUnitScope(tx,personId,unitId,true);action(scope,"merchant.people.invite");delegation(scope,input.permissions,input.delegablePermissions);
  const id=await receipt(tx,personId,unitId,"merchant.invitation.create",input,null,async()=>{
    await requireMerchantParticipant(tx,input.recipientId);if(input.recipientId===personId||scope.masterService.primaryPersonId===input.recipientId)throw new SecurityError("RECIPIENT_UNAVAILABLE",422);
    if(scope.liveAssignments.some(row=>row.personId===input.recipientId))throw new SecurityError("ALREADY_MERCHANT_MEMBER",409);
    const timestamp=await merchantNow(tx),expiresAt=new Date(timestamp.getTime()+input.expiresInDays*86400000),accessExpiresAt=new Date(timestamp.getTime()+input.accessExpiresInDays*86400000);
    if(scope.assignment&&accessExpiresAt>scope.assignment.expiresAt)throw new SecurityError("DELEGATION_EXPIRY_EXCEEDED",422);
    const pending=await tx.select().from(serviceInvitations).where(and(eq(serviceInvitations.merchantUnitId,unitId),eq(serviceInvitations.recipientId,input.recipientId),eq(serviceInvitations.status,"PENDING")));
    for(const row of pending){const [terms]=await tx.select().from(merchantInvitationTerms).where(eq(merchantInvitationTerms.invitationId,row.id));if(row.expiresAt>timestamp&&terms&&terms.accessExpiresAt>timestamp)throw new SecurityError("PENDING_INVITATION_EXISTS",409);await tx.update(serviceInvitations).set({status:"EXPIRED",version:row.version+1,decidedAt:timestamp}).where(eq(serviceInvitations.id,row.id));}
    const createdId=randomUUID();await tx.insert(serviceInvitations).values({id:createdId,targetKind:"MERCHANT_UNIT",merchantUnitId:unitId,inviterId:personId,recipientId:input.recipientId,createdAt:timestamp,expiresAt});
    await tx.insert(merchantInvitationTerms).values({invitationId:createdId,merchantUnitId:unitId,accessExpiresAt,...provenance(scope)});
    for(const name of input.permissions)await tx.insert(invitationPermissions).values({invitationId:createdId,action:name,delegable:input.delegablePermissions.includes(name)});
    await history(tx,unitId,personId,input.recipientId,"MERCHANT_INVITED",createdId);return createdId;
  });
  const [row]=await tx.select().from(serviceInvitations).where(eq(serviceInvitations.id,id));return merchantInvitationProjection(tx,row!,personId,scope);
});}
/** The canonical invitation entry point dispatches here by the persisted target kind. */
export async function decideMerchantInvitation(tx:ScopedTransaction,personId:string,initial:Invite,input:InvitationDecisionInput,decision:"accept"|"decline"):Promise<void>{
  if(initial.targetKind!=="MERCHANT_UNIT"||!initial.merchantUnitId||initial.recipientId!==personId)throw new SecurityError("INVITATION_UNAVAILABLE",404);
  const unitId=initial.merchantUnitId;
  const [targetUnit]=await tx.select().from(merchantUnits).where(eq(merchantUnits.id,unitId));if(!targetUnit)throw new SecurityError("INVITATION_UNAVAILABLE",404);
  // Accept checks live inviter authority before replay. Decline needs only the intended recipient and immutable target locks.
  let inviter:Scope|undefined;
  if(decision==="accept")try{inviter=await loadMerchantUnitScope(tx,initial.inviterId,unitId,true);action(inviter,"merchant.people.invite");}catch(error){if(error instanceof SecurityError)throw new SecurityError("INVITER_ACCESS_CHANGED",409);throw error;}
  else {
    const [unit]=await tx.select().from(merchantUnits).where(eq(merchantUnits.id,unitId));if(!unit)throw new SecurityError("INVITATION_UNAVAILABLE",404);
    for(const id of [unit.masterServiceId])await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"workspace:"+id},0))`);
    for(const id of [...new Set([unit.masterId??unit.id,unit.id])])await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"merchant:"+id},0))`);
  }
  const [row]=await tx.select().from(serviceInvitations).where(eq(serviceInvitations.id,initial.id)).for("update");const [terms]=await tx.select().from(merchantInvitationTerms).where(eq(merchantInvitationTerms.invitationId,initial.id));
  if(!row||!terms)throw new SecurityError("INVITATION_UNAVAILABLE",404);
  const offered=await tx.select().from(invitationPermissions).where(eq(invitationPermissions.invitationId,row.id));
  if(inviter){if(!sameSource(inviter,terms))throw new SecurityError("INVITER_ACCESS_CHANGED",409);delegation(inviter,offered.map(g=>g.action),offered.filter(g=>g.delegable).map(g=>g.action));}
  await receipt(tx,personId,unitId,`merchant.invitation.${decision}`,input,row.id,async()=>{
    version(row.version,input.expectedVersion);const timestamp=await merchantNow(tx);if(row.status!=="PENDING")throw new SecurityError("INVITATION_ALREADY_USED",422);if(row.expiresAt<=timestamp||terms.accessExpiresAt<=timestamp)throw new SecurityError("INVITATION_EXPIRED",422);
    const recipientPolicy:MerchantPolicyScope={...(inviter?.policy??{targetKind:"MERCHANT_UNIT",merchantUnitId:unitId,resourceMerchantUnitId:unitId,serviceId:targetUnit.masterServiceId,masterServiceId:targetUnit.masterServiceId,unitKind:targetUnit.kind,available:false,operating:false,primaryAccess:false,canManageFunds:false,grants:[],delegableActions:[]}),actorPersonId:personId,mode:"INVITATION_RECIPIENT",authority:null,invitation:{recipientPersonId:row.recipientId,status:row.status,expiresAt:row.expiresAt,accessExpiresAt:terms.accessExpiresAt,now:timestamp}};
    if(!evaluate(recipientPolicy,`invitation.${decision}`).allowed)throw new SecurityError("INVITATION_UNAVAILABLE",404);
    if(decision==="accept"){
      const scope=inviter!;
      if(scope.liveAssignments.some(item=>item.personId===personId))throw new SecurityError("ALREADY_MERCHANT_MEMBER",409);
      if(scope.assignment&&terms.accessExpiresAt>scope.assignment.expiresAt)throw new SecurityError("DELEGATION_EXPIRY_EXCEEDED",422);
      await tx.update(merchantAssignments).set({state:"REVOKED",version:sql`${merchantAssignments.version}+1`,revokedAt:timestamp}).where(and(eq(merchantAssignments.merchantUnitId,unitId),eq(merchantAssignments.personId,personId),eq(merchantAssignments.state,"ACCEPTED")));
      const assignmentId=randomUUID();await tx.insert(merchantAssignments).values({id:assignmentId,merchantUnitId:unitId,personId,expiresAt:terms.accessExpiresAt,createdAt:timestamp,sourceAssignmentId:terms.sourceAssignmentId,sourcePrimaryPersonId:terms.sourcePrimaryPersonId,sourceMembershipVersion:terms.sourceMembershipVersion});
      for(const grant of offered)await tx.insert(merchantPermissionGrants).values({assignmentId,action:grant.action,delegable:grant.delegable});
    }
    await tx.update(serviceInvitations).set({status:decision==="accept"?"ACCEPTED":"DECLINED",version:row.version+1,decidedAt:timestamp}).where(eq(serviceInvitations.id,row.id));await history(tx,unitId,personId,personId,`MERCHANT_INVITATION_${decision.toUpperCase()}`,row.id);return row.id;
  });
}
export async function revokeMerchantInvitation(personId:string,unitId:string,invitationId:string,raw:InvitationDecisionInput):Promise<MerchantInvitationProjection>{const input=parse(invitationDecisionSchema,raw);return getDb().transaction(async tx=>{
  const scope=await loadMerchantUnitScope(tx,personId,unitId,true);action(scope,"merchant.people.read");const [row]=await tx.select().from(serviceInvitations).where(and(eq(serviceInvitations.id,invitationId),eq(serviceInvitations.merchantUnitId,unitId))).for("update");if(!row)throw new SecurityError("INVITATION_UNAVAILABLE",404);
  const projected=await merchantInvitationProjection(tx,row,personId,scope);
  // A resolved retry is still limited to the current controller/delegator; receipt validates its exact input.
  if(!projected.canRevoke&&!(row.status==="REVOKED"&&(evaluate(scope.policy,"merchant.people.revoke").allowed||row.inviterId===personId)))throw new SecurityError("ACTION_DENIED",403);
  await receipt(tx,personId,unitId,"merchant.invitation.revoke",input,invitationId,async()=>{version(row.version,input.expectedVersion);if(row.status!=="PENDING")throw new SecurityError("INVITATION_ALREADY_USED",422);await tx.update(serviceInvitations).set({status:"REVOKED",version:row.version+1,decidedAt:await merchantNow(tx)}).where(eq(serviceInvitations.id,invitationId));await history(tx,unitId,personId,row.recipientId,"MERCHANT_INVITATION_REVOKED",invitationId);return invitationId;});
  const [current]=await tx.select().from(serviceInvitations).where(eq(serviceInvitations.id,invitationId));return merchantInvitationProjection(tx,current!,personId,scope);
});}
export async function revokeMerchantAccess(personId:string,unitId:string,assignmentId:string,raw:InvitationDecisionInput):Promise<MerchantAccessPerson>{const input=parse(invitationDecisionSchema,raw);return getDb().transaction(async tx=>{
  const scope=await loadMerchantUnitScope(tx,personId,unitId,true);action(scope,"merchant.people.read");const row=scope.assignments.find(item=>item.id===assignmentId);if(!row)throw new SecurityError("PERSON_UNAVAILABLE",404);if(!canRevoke(scope,row))throw new SecurityError("ACTION_DENIED",403);
  await receipt(tx,personId,unitId,"merchant.access.revoke",input,assignmentId,async()=>{version(row.version,input.expectedVersion);if(row.state!=="ACCEPTED")throw new SecurityError("ACCESS_ALREADY_REVOKED",422);
    const ids=scope.assignments.filter(item=>item.id===assignmentId||isDescendant(scope,item.id,assignmentId)).map(item=>item.id),timestamp=await merchantNow(tx);
    await tx.update(merchantAssignments).set({state:"REVOKED",version:sql`${merchantAssignments.version}+1`,revokedAt:timestamp}).where(and(inArray(merchantAssignments.id,ids),eq(merchantAssignments.state,"ACCEPTED")));
    const pending=await tx.select({id:merchantInvitationTerms.invitationId}).from(merchantInvitationTerms).where(inArray(merchantInvitationTerms.sourceAssignmentId,ids));if(pending.length)await tx.update(serviceInvitations).set({status:"REVOKED",version:sql`${serviceInvitations.version}+1`,decidedAt:timestamp}).where(and(inArray(serviceInvitations.id,pending.map(item=>item.id)),eq(serviceInvitations.status,"PENDING")));
    await history(tx,unitId,personId,row.personId,"MERCHANT_ACCESS_REVOKED");return assignmentId;});
  const current=await loadMerchantUnitScope(tx,personId,unitId,true);return personProjection(tx,current,current.assignments.find(item=>item.id===assignmentId)!);
});}

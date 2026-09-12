import { createHash,randomUUID } from "node:crypto";
import { and,desc,eq,inArray,sql } from "drizzle-orm";
import { getDb } from "../../platform/database/client";
import { people,services } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import { merchantTerminals } from "../acquiring/schema";
import { evaluate } from "../policy/evaluate";
import { lockMoneyAccountsForServices } from "../money/service";
import { serviceInvitations,invitationPermissions,accessCommands,accessHistory,terminalAssignments,terminalInvitationTerms } from "./schema";
import { loadTerminalScope,merchantNow,requireMerchantParticipant } from "./merchant-scope";
import { TERMINAL_PERMISSIONS,createMerchantInvitationSchema,type CreateMerchantInvitationInput,type MerchantInvitationProjection,type MerchantAccessOverview,type MerchantAccessPerson } from "./merchant-contracts";
import { invitationDecisionSchema,type InvitationDecisionInput } from "./contracts";
import type { ScopedTransaction } from "./scope";
type Scope=Awaited<ReturnType<typeof loadTerminalScope>>;
type Invite=typeof serviceInvitations.$inferSelect;
function parse<T>(schema:{safeParse:(input:unknown)=>{success:true;data:T}|{success:false}},raw:unknown):T {const result=schema.safeParse(raw);if(!result.success)throw new SecurityError("INVALID_REQUEST",422);return result.data;}
function action(scope:Scope,name:string){if(!evaluate(scope.policy,name).allowed)throw new SecurityError("ACTION_DENIED",403);}
function version(actual:number,expected:number){if(actual!==expected)throw new SecurityError("STALE_VERSION",409);}
async function receipt(tx:ScopedTransaction,personId:string,terminalId:string,kind:string,input:{commandId:string},targetId:string|null,run:()=>Promise<string>){
 await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"access:"+input.commandId},0))`);
 const digest=createHash("sha256").update(JSON.stringify({kind,targetId,input})).digest("hex");
 const [old]=await tx.select().from(accessCommands).where(eq(accessCommands.commandId,input.commandId));
 if(old){if(old.targetKind!=="MERCHANT_TERMINAL"||old.merchantUnitId!==terminalId||old.actorId!==personId||old.kind!==kind||old.digest!==digest)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);return old.resourceId;}
 const resourceId=await run();await tx.insert(accessCommands).values({targetKind:"MERCHANT_TERMINAL",merchantUnitId:terminalId,actorId:personId,commandId:input.commandId,kind,resourceId,digest});return resourceId;
}
async function history(tx:ScopedTransaction,terminalId:string,actorId:string,personId:string,kind:string,invitationId?:string){await tx.insert(accessHistory).values({targetKind:"MERCHANT_TERMINAL",merchantUnitId:terminalId,actorId,personId,kind,invitationId,message:"Access to this terminal updated.",});}
function sameOwner(scope:Scope,terms:typeof terminalInvitationTerms.$inferSelect){return scope.ownerAccess&&terms.grantedByPersonId===scope.policy.actorPersonId&&terms.ownerMembershipVersion===scope.ownerMember?.version;}
async function personProjection(tx:ScopedTransaction,scope:Scope,row:typeof terminalAssignments.$inferSelect):Promise<MerchantAccessPerson>{
 const [person]=await tx.select().from(people).where(eq(people.id,row.personId));
 const live=scope.liveAssignments.some(item=>item.id===row.id);
 return {id:row.id,personId:row.personId,displayName:person!.displayName,state:row.state==="REVOKED"?"REVOKED":row.expiresAt&&row.expiresAt<=scope.now?"EXPIRED":live?"ACCEPTED":"UNAVAILABLE",version:row.version,permissions:live?[...TERMINAL_PERMISSIONS]:[],expiresAt:row.expiresAt?.toISOString()??null,canRevoke:row.state==="ACCEPTED"&&evaluate(scope.policy,"merchant.people.revoke").allowed&&row.personId!==scope.policy.actorPersonId,isCurrentPerson:row.personId===scope.policy.actorPersonId};
}
export async function merchantInvitationProjection(tx:ScopedTransaction,row:Invite,viewerId:string,scope?:Scope):Promise<MerchantInvitationProjection>{
 if(row.targetKind!=="MERCHANT_TERMINAL"||!row.merchantUnitId)throw new SecurityError("INVITATION_UNAVAILABLE",404);
 const [terms]=await tx.select().from(terminalInvitationTerms).where(eq(terminalInvitationTerms.invitationId,row.id));
 const [terminal]=await tx.select().from(merchantTerminals).where(eq(merchantTerminals.id,row.merchantUnitId));
 if(!terms||!terminal)throw new SecurityError("INVITATION_UNAVAILABLE",404);
 const [merchant]=await tx.select().from(services).where(eq(services.id,terminal.merchantServiceId));
 const persons=await tx.select().from(people).where(inArray(people.id,[row.inviterId,row.recipientId]));
 const timestamp=scope?.now??await merchantNow(tx);
 const status=row.status==="PENDING"&&(row.expiresAt<=timestamp||!!terms.accessExpiresAt&&terms.accessExpiresAt<=timestamp)?"EXPIRED":row.status;
 let canRespond=false,hasMerchantAccess=false;
 if(viewerId===row.recipientId&&status==="PENDING")try{const inviter=await loadTerminalScope(tx,row.inviterId,terminal.id);action(inviter,"merchant.people.invite");canRespond=sameOwner(inviter,terms);}catch(error){if(!(error instanceof SecurityError))throw error;}
 if(viewerId===row.recipientId||scope)try{await loadTerminalScope(tx,row.recipientId,terminal.id);hasMerchantAccess=true;}catch(error){if(!(error instanceof SecurityError))throw error;}
 return {targetKind:"MERCHANT_TERMINAL",id:row.id,terminalId:terminal.id,terminalName:terminal.displayName,merchantServiceId:terminal.merchantServiceId,merchantName:merchant!.displayName,inviterName:persons.find(p=>p.id===row.inviterId)!.displayName,recipientId:row.recipientId,recipientName:persons.find(p=>p.id===row.recipientId)!.displayName,permissions:[...TERMINAL_PERMISSIONS],status,version:row.version,createdAt:row.createdAt.toISOString(),expiresAt:row.expiresAt.toISOString(),accessExpiresAt:terms.accessExpiresAt?.toISOString()??null,canRespond,canRevoke:status==="PENDING"&&!!scope&&evaluate(scope.policy,"merchant.people.revoke").allowed,hasMerchantAccess,href:`/merchants/${terminal.id}`};
}
export async function getMerchantAccessOverview(personId:string,terminalId:string):Promise<MerchantAccessOverview>{return getDb().transaction(async tx=>{
 const scope=await loadTerminalScope(tx,personId,terminalId,false,{read:true});action(scope,"merchant.people.read");
 const persons:MerchantAccessPerson[]=[];for(const row of scope.assignments)persons.push(await personProjection(tx,scope,row));
 const pending=sql`(${serviceInvitations.status}='PENDING' and ${serviceInvitations.expiresAt}>${scope.now} and (${terminalInvitationTerms.accessExpiresAt} is null or ${terminalInvitationTerms.accessExpiresAt}>${scope.now}))`;
 const [counts]=await tx.select({total:sql<number>`count(*)::int`,pending:sql<number>`count(*) filter(where ${pending})::int`}).from(serviceInvitations).leftJoin(terminalInvitationTerms,eq(terminalInvitationTerms.invitationId,serviceInvitations.id)).where(eq(serviceInvitations.merchantUnitId,terminalId));
 const rows=await tx.select({invitation:serviceInvitations}).from(serviceInvitations).leftJoin(terminalInvitationTerms,eq(terminalInvitationTerms.invitationId,serviceInvitations.id)).where(eq(serviceInvitations.merchantUnitId,terminalId)).orderBy(desc(sql`case when ${pending} then 1 else 0 end`),desc(serviceInvitations.createdAt),serviceInvitations.id).limit(100);
 const invitations:MerchantInvitationProjection[]=[];for(const row of rows)invitations.push(await merchantInvitationProjection(tx,row.invitation,personId,scope));
 const [owner]=await tx.select().from(people).where(eq(people.id,scope.merchantService.primaryPersonId));
 return {terminalId,terminalName:scope.terminal.displayName,merchantName:scope.merchantService.displayName,canInvite:evaluate(scope.policy,"merchant.people.invite").allowed,invitationTotal:counts!.total,pendingInvitationCount:counts!.pending,invitationsTruncated:counts!.total>rows.length,controllers:[{personId:owner!.id,displayName:owner!.displayName,basis:"OWNER_MEMBER"}],people:persons,invitations,notice:"Terminal users can receive payments, view this terminal’s records and respond to disputes. Only the account owner manages money and access."};
},{isolationLevel:"repeatable read"});}
export async function createMerchantInvitation(personId:string,terminalId:string,raw:CreateMerchantInvitationInput):Promise<MerchantInvitationProjection>{const input=parse(createMerchantInvitationSchema,raw);return getDb().transaction(async tx=>{
 const scope=await loadTerminalScope(tx,personId,terminalId,true);action(scope,"merchant.people.invite");
 const id=await receipt(tx,personId,terminalId,"terminal.invitation.create",input,null,async()=>{
  await requireMerchantParticipant(tx,input.recipientId);if(input.recipientId===personId)throw new SecurityError("RECIPIENT_UNAVAILABLE",422);
  if(scope.liveAssignments.some(row=>row.personId===input.recipientId))throw new SecurityError("ALREADY_MERCHANT_MEMBER",409);
  const timestamp=await merchantNow(tx),expiresAt=new Date(timestamp.getTime()+input.expiresInDays*86400000);
  const pending=await tx.select({invitation:serviceInvitations,terms:terminalInvitationTerms}).from(serviceInvitations).leftJoin(terminalInvitationTerms,eq(terminalInvitationTerms.invitationId,serviceInvitations.id)).where(and(eq(serviceInvitations.merchantUnitId,terminalId),eq(serviceInvitations.recipientId,input.recipientId),eq(serviceInvitations.status,"PENDING")));
  for(const {invitation:row,terms} of pending){if(row.expiresAt>timestamp&&(!terms?.accessExpiresAt||terms.accessExpiresAt>timestamp))throw new SecurityError("PENDING_INVITATION_EXISTS",409);await tx.update(serviceInvitations).set({status:"EXPIRED",version:row.version+1,decidedAt:timestamp}).where(eq(serviceInvitations.id,row.id));}
  const createdId=randomUUID();await tx.insert(serviceInvitations).values({id:createdId,targetKind:"MERCHANT_TERMINAL",merchantUnitId:terminalId,inviterId:personId,recipientId:input.recipientId,createdAt:timestamp,expiresAt});
  await tx.insert(terminalInvitationTerms).values({invitationId:createdId,terminalId,grantedByPersonId:personId,ownerMembershipVersion:scope.ownerMember!.version});
  for(const name of TERMINAL_PERMISSIONS)await tx.insert(invitationPermissions).values({invitationId:createdId,action:name,delegable:false});
  await history(tx,terminalId,personId,input.recipientId,"TERMINAL_INVITED",createdId);return createdId;
 });
 const [row]=await tx.select().from(serviceInvitations).where(eq(serviceInvitations.id,id));return merchantInvitationProjection(tx,row!,personId,scope);
});}
/** Only the persisted recipient may accept, and current owner authority is checked before replay. */
export async function decideMerchantInvitation(tx:ScopedTransaction,personId:string,initial:Invite,input:InvitationDecisionInput,decision:"accept"|"decline"):Promise<void>{
 if(initial.targetKind!=="MERCHANT_TERMINAL"||!initial.merchantUnitId||initial.recipientId!==personId)throw new SecurityError("INVITATION_UNAVAILABLE",404);
 const terminalId=initial.merchantUnitId;
 const [terminal]=await tx.select().from(merchantTerminals).where(eq(merchantTerminals.id,terminalId));if(!terminal)throw new SecurityError("INVITATION_UNAVAILABLE",404);
 let inviter:Scope|undefined;
 if(decision==="accept")try{inviter=await loadTerminalScope(tx,initial.inviterId,terminalId,true);action(inviter,"merchant.people.invite");}catch(error){if(error instanceof SecurityError)throw new SecurityError("INVITER_ACCESS_CHANGED",409);throw error;}
 else {await lockMoneyAccountsForServices(tx,[terminal.merchantServiceId]);await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"workspace:"+terminal.merchantServiceId},0))`);await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"terminal:"+terminalId},0))`);}
 const [row]=await tx.select().from(serviceInvitations).where(eq(serviceInvitations.id,initial.id)).for("update");const [terms]=await tx.select().from(terminalInvitationTerms).where(eq(terminalInvitationTerms.invitationId,initial.id));
 if(!row||!terms||row.recipientId!==personId)throw new SecurityError("INVITATION_UNAVAILABLE",404);
 if(inviter&&!sameOwner(inviter,terms))throw new SecurityError("INVITER_ACCESS_CHANGED",409);
 await receipt(tx,personId,terminalId,`terminal.invitation.${decision}`,input,row.id,async()=>{
  version(row.version,input.expectedVersion);const timestamp=await merchantNow(tx);if(row.status!=="PENDING")throw new SecurityError("INVITATION_ALREADY_USED",422);if(row.expiresAt<=timestamp||!!terms.accessExpiresAt&&terms.accessExpiresAt<=timestamp)throw new SecurityError("INVITATION_EXPIRED",422);
  if(decision==="accept"){
   if(inviter!.liveAssignments.some(item=>item.personId===personId))throw new SecurityError("ALREADY_MERCHANT_MEMBER",409);
   await tx.update(terminalAssignments).set({state:"REVOKED",version:sql`${terminalAssignments.version}+1`,revokedAt:timestamp}).where(and(eq(terminalAssignments.terminalId,terminalId),eq(terminalAssignments.personId,personId),eq(terminalAssignments.state,"ACCEPTED")));
   await tx.insert(terminalAssignments).values({terminalId,personId,grantedByPersonId:terms.grantedByPersonId,ownerMembershipVersion:terms.ownerMembershipVersion,expiresAt:terms.accessExpiresAt,createdAt:timestamp});
  }
  await tx.update(serviceInvitations).set({status:decision==="accept"?"ACCEPTED":"DECLINED",version:row.version+1,decidedAt:timestamp}).where(eq(serviceInvitations.id,row.id));await history(tx,terminalId,personId,personId,`TERMINAL_INVITATION_${decision.toUpperCase()}`,row.id);return row.id;
 });
}
export async function revokeMerchantInvitation(personId:string,terminalId:string,invitationId:string,raw:InvitationDecisionInput):Promise<MerchantInvitationProjection>{const input=parse(invitationDecisionSchema,raw);return getDb().transaction(async tx=>{
 const scope=await loadTerminalScope(tx,personId,terminalId,true,{read:true});action(scope,"merchant.people.revoke");const [row]=await tx.select().from(serviceInvitations).where(and(eq(serviceInvitations.id,invitationId),eq(serviceInvitations.merchantUnitId,terminalId))).for("update");if(!row)throw new SecurityError("INVITATION_UNAVAILABLE",404);
 await receipt(tx,personId,terminalId,"terminal.invitation.revoke",input,invitationId,async()=>{version(row.version,input.expectedVersion);if(row.status!=="PENDING")throw new SecurityError("INVITATION_ALREADY_USED",422);await tx.update(serviceInvitations).set({status:"REVOKED",version:row.version+1,decidedAt:await merchantNow(tx)}).where(eq(serviceInvitations.id,invitationId));await history(tx,terminalId,personId,row.recipientId,"TERMINAL_INVITATION_REVOKED",invitationId);return invitationId;});
 const [current]=await tx.select().from(serviceInvitations).where(eq(serviceInvitations.id,invitationId));return merchantInvitationProjection(tx,current!,personId,scope);
});}
export async function revokeMerchantAccess(personId:string,terminalId:string,assignmentId:string,raw:InvitationDecisionInput):Promise<MerchantAccessPerson>{const input=parse(invitationDecisionSchema,raw);return getDb().transaction(async tx=>{
 const scope=await loadTerminalScope(tx,personId,terminalId,true,{read:true});action(scope,"merchant.people.revoke");const row=scope.assignments.find(item=>item.id===assignmentId);if(!row)throw new SecurityError("PERSON_UNAVAILABLE",404);
 await receipt(tx,personId,terminalId,"terminal.access.revoke",input,assignmentId,async()=>{version(row.version,input.expectedVersion);if(row.state!=="ACCEPTED")throw new SecurityError("ACCESS_ALREADY_REVOKED",422);await tx.update(terminalAssignments).set({state:"REVOKED",version:row.version+1,revokedAt:await merchantNow(tx)}).where(eq(terminalAssignments.id,assignmentId));await history(tx,terminalId,personId,row.personId,"TERMINAL_ACCESS_REVOKED");return assignmentId;});
 const current=await loadTerminalScope(tx,personId,terminalId,true,{read:true});return personProjection(tx,current,current.assignments.find(item=>item.id===assignmentId)!);
});}

import { and,eq,sql } from "drizzle-orm";
import { z } from "zod";
import { services,serviceMembers } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import { requireSandboxParticipant } from "../sandbox/service";
import { merchantProfiles,merchantTerminals } from "../acquiring/schema";
import { MERCHANT_ACTIONS,evaluate,type MerchantPolicyScope } from "../policy/evaluate";
import { terminalAssignments } from "./schema";
import { TERMINAL_PERMISSIONS } from "./merchant-contracts";
import { requireServiceReader } from "../services/service-reader";
import { getServiceMoneyAccount,lockMoneyAccountsForServices } from "../money/service";
import type { ScopedTransaction } from "./scope";

export async function requireMerchantParticipant(tx:ScopedTransaction,personId:string) {await requireSandboxParticipant(tx,personId);}
export async function merchantNow(tx:ScopedTransaction) {const result=await tx.execute(sql`select clock_timestamp() as now`);return new Date(result.rows[0]!.now as string|Date);}
export async function listTerminalAssignmentIds(tx:ScopedTransaction,personId:string) {
 await requireServiceReader(tx,personId);
 const rows=await tx.select({id:terminalAssignments.terminalId}).from(terminalAssignments).where(and(eq(terminalAssignments.personId,personId),eq(terminalAssignments.state,"ACCEPTED"))).orderBy(terminalAssignments.terminalId);
 return rows.map(row=>row.id);
}
/** One money-account lock, then service and terminal locks. Scope is rechecked on every operation. */
export async function loadTerminalScope(tx:ScopedTransaction,personId:string,terminalId:string,forWrite=false,options:{mode?:"OPERATING"|"OVERSIGHT";read?:boolean}={}) {
 if(!z.uuid().safeParse(terminalId).success)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
 terminalId=terminalId.toLowerCase();
 if(forWrite)await requireMerchantParticipant(tx,personId);else await requireServiceReader(tx,personId);
 const [hint]=await tx.select().from(merchantTerminals).where(eq(merchantTerminals.id,terminalId));
 if(!hint)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
 if(forWrite){await lockMoneyAccountsForServices(tx,[hint.merchantServiceId]);await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"workspace:"+hint.merchantServiceId},0))`);await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"terminal:"+terminalId},0))`);}
 const tq=tx.select().from(merchantTerminals).where(eq(merchantTerminals.id,terminalId));
 const [terminal]=forWrite?await tq.for("update"):await tq;
 if(!terminal||terminal.merchantServiceId!==hint.merchantServiceId)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
 const [merchantService]=await tx.select().from(services).where(and(eq(services.id,terminal.merchantServiceId),eq(services.kind,"MERCHANT")));
 if(!merchantService)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
 const account=await getServiceMoneyAccount(tx,merchantService.id);
 if(account.ownerPersonId!==merchantService.primaryPersonId)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
 const [ownerMember]=await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,merchantService.id),eq(serviceMembers.personId,account.ownerPersonId),eq(serviceMembers.state,"ACCEPTED")));
 const [profile]=await tx.select().from(merchantProfiles).where(eq(merchantProfiles.serviceId,merchantService.id));
 const ownerAccess=!!ownerMember&&account.ownerPersonId===personId;
 const available=account.status==="ACTIVE"&&!["SUSPENDED","CLOSED"].includes(merchantService.status)&&!!profile&&!["RESTRICTED","DECLINED","CLOSED"].includes(profile.status)&&terminal.status!=="CLOSED";
 const operating=available&&terminal.status==="ACTIVE"&&!!ownerMember;
 const aq=tx.select().from(terminalAssignments).where(eq(terminalAssignments.terminalId,terminalId)).orderBy(terminalAssignments.id);
 const assignments=forWrite?await aq.for("update"):await aq;
 const timestamp=await merchantNow(tx);
 const liveAssignments=assignments.filter(row=>operating&&row.state==="ACCEPTED"&&(!row.expiresAt||row.expiresAt>timestamp)&&row.grantedByPersonId===account.ownerPersonId&&row.ownerMembershipVersion===ownerMember?.version);
 const direct=liveAssignments.find(row=>row.personId===personId)??null;
 const authority:MerchantPolicyScope["authority"]=ownerAccess?{kind:"OWNER_MEMBER",personId,membershipVersion:ownerMember!.version}:direct?{kind:"TERMINAL_ASSIGNMENT",personId,membershipVersion:null}:null;
 const grants:string[]=ownerAccess?[...MERCHANT_ACTIONS,"disputes.read","disputes.respond"]:direct?[...TERMINAL_PERMISSIONS]:[];
 const mode=options.mode??(options.read&&ownerAccess&&!operating?"OVERSIGHT":"OPERATING");
 if(mode==="OVERSIGHT"&&!ownerAccess)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
 const policy:MerchantPolicyScope={targetKind:"MERCHANT_TERMINAL",actorPersonId:personId,terminalId,resourceTerminalId:terminalId,serviceId:merchantService.id,resourceServiceId:merchantService.id,mode,available:mode==="OVERSIGHT"?ownerAccess&&merchantService.status!=="CLOSED"&&account.status!=="CLOSED"&&!!profile:available,operating,canManageFunds:ownerAccess,ownerAccess,authority,grants,delegableActions:[]};
 if(!evaluate(policy,"merchant.read").allowed)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
 return {terminal,merchantService,policy,ownerAccess,ownerMember,assignment:direct,grants,assignments,liveAssignments,now:timestamp};
}

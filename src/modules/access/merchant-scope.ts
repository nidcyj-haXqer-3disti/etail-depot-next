import { and,eq,inArray,sql } from "drizzle-orm";
import { z } from "zod";
import { services,serviceMembers,identityBindings,permissionGrants } from "../../platform/database/schema";
import { getRuntimeConfig } from "../../platform/config";
import { SecurityError } from "../../platform/security/origin";
import { assertFixtureIdentityAllowed } from "../identity";
import { merchantProfiles,merchantUnits } from "../acquiring/schema";
import { MERCHANT_ACTIONS,evaluate,type MerchantPolicyScope } from "../policy/evaluate";
import { merchantAssignments,merchantPermissionGrants } from "./schema";
import { requireServiceReader } from "../services/service-reader";
import type { ScopedTransaction } from "./scope";

export async function requireMerchantFixturePerson(tx:ScopedTransaction,personId:string) {
  const config=getRuntimeConfig();
  try {assertFixtureIdentityAllowed({...config,fixtureIdentityEnabled:config.localFixtureIdentity});} catch {throw new SecurityError("MERCHANT_UNAVAILABLE",404);}
  const [binding]=await tx.select({id:identityBindings.id}).from(identityBindings).where(and(eq(identityBindings.personId,personId),eq(identityBindings.issuer,"urn:etail:isolated-fixture")));
  if(!binding)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
}
export async function merchantNow(tx:ScopedTransaction) {const result=await tx.execute(sql`select clock_timestamp() as now`);return new Date(result.rows[0]!.now as string|Date);}
export async function listMerchantAssignmentUnitIds(tx:ScopedTransaction,personId:string) {
  await requireServiceReader(tx,personId);
  const rows=await tx.select({id:merchantAssignments.merchantUnitId}).from(merchantAssignments).where(and(eq(merchantAssignments.personId,personId),eq(merchantAssignments.state,"ACCEPTED"))).orderBy(merchantAssignments.merchantUnitId);
  return rows.map(row=>row.id);
}
/** Merchant service lock precedes primary, unit, assignment and financial locks. */
export async function loadMerchantUnitScope(tx:ScopedTransaction,personId:string,unitId:string,forWrite=false,options:{mode?:"OPERATING"|"OVERSIGHT";read?:boolean}={}) {
  if(!z.uuid().safeParse(unitId).success)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
  unitId=unitId.toLowerCase();
  if(forWrite)await requireMerchantFixturePerson(tx,personId);else await requireServiceReader(tx,personId);
  const [hint]=await tx.select().from(merchantUnits).where(eq(merchantUnits.id,unitId));
  if(!hint)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
  if(forWrite)await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"workspace:"+hint.masterServiceId},0))`);
  const rootId=hint.masterId??hint.id;
  if(forWrite)for(const id of [...new Set([rootId,unitId])])await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"merchant:"+id},0))`);
  const unitQuery=tx.select().from(merchantUnits).where(inArray(merchantUnits.id,[rootId,unitId])).orderBy(merchantUnits.id);
  const units=forWrite?await unitQuery.for("update"):await unitQuery;
  const unit=units.find(row=>row.id===unitId),master=units.find(row=>row.id===rootId);
  if(!unit||!master||master.kind!=="MASTER"||master.masterServiceId!==unit.masterServiceId||unit.masterServiceId!==hint.masterServiceId)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
  const [masterService]=await tx.select().from(services).where(and(eq(services.id,unit.masterServiceId),eq(services.kind,"MERCHANT")));
  if(!masterService)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
  const [primaryMember]=await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,masterService.id),eq(serviceMembers.personId,masterService.primaryPersonId),eq(serviceMembers.state,"ACCEPTED")));
  const serviceGrants=await tx.select().from(permissionGrants).where(and(eq(permissionGrants.serviceId,masterService.id),eq(permissionGrants.personId,masterService.primaryPersonId),eq(permissionGrants.state,"ACCEPTED")));
  const [profile]=await tx.select().from(merchantProfiles).where(eq(merchantProfiles.serviceId,masterService.id));
  const primaryGrants=serviceGrants.map(row=>row.action).filter(action=>(MERCHANT_ACTIONS as readonly string[]).includes(action));
  const primaryAccess=!!primaryMember&&masterService.primaryPersonId===personId&&primaryGrants.includes("merchant.read");
  const available=!["SUSPENDED","CLOSED"].includes(masterService.status)&&!!profile&&!["RESTRICTED","DECLINED","CLOSED"].includes(profile.status)&&unit.status!=="CLOSED";
  const operating=available&&unit.status==="ACTIVE"&&master.status==="ACTIVE"&&!!primaryMember&&primaryGrants.includes("merchant.read");
  const assignmentQuery=tx.select().from(merchantAssignments).where(eq(merchantAssignments.merchantUnitId,unitId)).orderBy(merchantAssignments.id);
  const assignments=forWrite?await assignmentQuery.for("update"):await assignmentQuery;
  const allGrants=assignments.length?await tx.select().from(merchantPermissionGrants).where(inArray(merchantPermissionGrants.assignmentId,assignments.map(row=>row.id))):[];
  const timestamp=await merchantNow(tx);
  function active(row:typeof merchantAssignments.$inferSelect,seen:Set<string>=new Set()):boolean {
    if(!operating||row.state!=="ACCEPTED"||row.expiresAt<=timestamp||seen.has(row.id)||seen.size>=4)return false;
    seen.add(row.id);
    const grants=allGrants.filter(grant=>grant.assignmentId===row.id);
    if(row.sourceAssignmentId) {
      const parent=assignments.find(item=>item.id===row.sourceAssignmentId);
      if(!parent||row.expiresAt>parent.expiresAt||!active(parent,seen))return false;
      const ceiling=allGrants.filter(grant=>grant.assignmentId===parent.id&&grant.delegable).map(grant=>grant.action);
      return grants.every(grant=>ceiling.includes(grant.action));
    }
    return !!primaryMember&&row.sourcePrimaryPersonId===masterService.primaryPersonId&&row.sourceMembershipVersion===primaryMember.version&&grants.every(grant=>serviceGrants.some(source=>source.action===grant.action&&source.delegable));
  }
  const liveAssignments=assignments.filter(row=>active(row)),direct=liveAssignments.find(row=>row.personId===personId)??null;
  let authority:MerchantPolicyScope["authority"]=null,grants:string[]=[],delegableActions:string[]=[];
  if(primaryAccess){authority={kind:"PRIMARY_MEMBER",personId,membershipVersion:primaryMember!.version};grants=primaryGrants;delegableActions=serviceGrants.filter(row=>row.delegable).map(row=>row.action);}
  else if(direct){authority={kind:"MERCHANT_ASSIGNMENT",personId,membershipVersion:null};grants=allGrants.filter(row=>row.assignmentId===direct.id).map(row=>row.action);delegableActions=allGrants.filter(row=>row.assignmentId===direct.id&&row.delegable).map(row=>row.action);}
  const mode=options.mode??(options.read&&primaryAccess&&!operating?"OVERSIGHT":"OPERATING");
  if(mode==="OVERSIGHT"&&!primaryAccess)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
  const policy:MerchantPolicyScope={targetKind:"MERCHANT_UNIT",actorPersonId:personId,merchantUnitId:unitId,resourceMerchantUnitId:unitId,serviceId:masterService.id,masterServiceId:masterService.id,unitKind:unit.kind,mode,available:mode==="OVERSIGHT"?primaryAccess&&masterService.status!=="CLOSED"&&!!profile:available,operating,canManageFunds:primaryAccess,primaryAccess,authority,grants,delegableActions};
  if(!evaluate(policy,"merchant.read").allowed)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
  return {unit,master,masterService,policy,primaryAccess,primaryMember,assignment:authority?.kind==="MERCHANT_ASSIGNMENT"?direct:null,grants,assignments,liveAssignments,allGrants,now:timestamp};
}

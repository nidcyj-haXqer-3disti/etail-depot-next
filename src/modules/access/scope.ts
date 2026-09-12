import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { CARDHOLDER_ACCESS_PERMISSIONS } from "./contracts";
import { getServiceMoneyAccount,lockMoneyAccountsForServices } from "../money/service";
import { getDb } from "../../platform/database/client";
import { services, serviceMembers, permissionGrants } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import { evaluate, type PolicyScope, type Role } from "../policy/evaluate";
export type ScopedTransaction=Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0];
/** Canonical exact-service authority. Financial/resource writers acquire this lock first. */
export async function loadServiceScope(tx:ScopedTransaction,personId:string,serviceId:string,forWrite=false) {
 if(!z.uuid().safeParse(serviceId).success)throw new SecurityError("SERVICE_UNAVAILABLE",404);
 serviceId=serviceId.toLowerCase();
 if(forWrite)await lockMoneyAccountsForServices(tx,[serviceId]);
 if(forWrite)await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"workspace:"+serviceId},0))`);
 const sq=tx.select().from(services).where(eq(services.id,serviceId));
 const [service]=forWrite?await sq.for("share"):await sq;
 const mq=tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.personId,personId)));
 const [member]=forWrite?await mq.for("update"):await mq;
 if(!service||!member)throw new SecurityError("SERVICE_UNAVAILABLE",404);
 const account=await getServiceMoneyAccount(tx,serviceId);
 if(account.ownerPersonId!==service.primaryPersonId||account.status!=="ACTIVE")throw new SecurityError("SERVICE_UNAVAILABLE",404);
 const pq=tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.personId,service.primaryPersonId)));
 const [primary]=forWrite?await pq.for("share"):await pq;
 const gq=tx.select().from(permissionGrants).where(and(eq(permissionGrants.serviceId,serviceId),eq(permissionGrants.personId,personId),eq(permissionGrants.state,"ACCEPTED")));
 const grants=forWrite?await gq.for("share"):await gq;
 const role:Role=service.primaryPersonId===personId?"OWNER":"CARDHOLDER";
 const policy:PolicyScope={actorPersonId:personId,serviceId,resourceServiceId:serviceId,membershipServiceId:serviceId,membershipPersonId:personId,membershipState:member.state,primaryPersonId:service.primaryPersonId,primaryMembershipState:primary?.state??"REVOKED",role,serviceKind:service.kind,status:service.status,grants:service.kind==="CARDHOLDER"&&role==="CARDHOLDER"?[...CARDHOLDER_ACCESS_PERMISSIONS]:grants.map(grant=>grant.action),delegableActions:grants.filter(grant=>grant.delegable).map(grant=>grant.action)};
 if(!evaluate(policy,"service.read").allowed)throw new SecurityError("SERVICE_UNAVAILABLE",404);
 return {service,membership:{...member,role},policy,grants};
}

import {customerHref} from "../../shared/customer-routes";
import { createHash, randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { getDb } from "../../platform/database/client";
import { services, serviceMembers, permissionGrants, eventOutbox } from "../../platform/database/schema";
import { merchantTerminals } from "../acquiring/schema";
import { SecurityError } from "../../platform/security/origin";
import { loadServiceScope } from "../access/scope";
import { initializeMerchantSetup } from "../acquiring/service";
import { evaluate } from "../policy/evaluate";
import { requireMerchantApplicant } from "./merchant-eligibility";
import { merchantServiceCommands } from "./schema";
import { createMerchantServiceSchema, type CreateMerchantServiceInput } from "./merchant-contracts";
import {attachServiceMoneyAccount,lockMoneyAccount,lockMoneyAccountsForServices} from "../money/service";

class MerchantLockSetChanged extends Error {}

/** One creation command. Merchant eligibility is independent of Cardholder enrollment. */
export async function createPrimaryMerchant(personId:string,input:CreateMerchantServiceInput) {
  const parsed=createMerchantServiceSchema.safeParse(input);
  if(!parsed.success)throw new SecurityError("INVALID_REQUEST",422);
  const value=parsed.data;
  const digest=createHash("sha256").update(JSON.stringify({personId,displayName:value.displayName,...(value.moneyAccountId?{moneyAccountId:value.moneyAccountId}:{})})).digest("hex");
  for(let attempt=0;attempt<3;attempt++) {
   try {return await getDb().transaction(async tx=>{
    if(value.moneyAccountId)await lockMoneyAccount(tx,value.moneyAccountId);
    // Discovery supplies lock IDs only. Re-read both authority and receipt after locking.
    const [discovered]=await tx.select().from(merchantServiceCommands).where(eq(merchantServiceCommands.commandId,value.commandId));
    if(discovered?.actorId===personId)await lockMoneyAccountsForServices(tx,[discovered.merchantServiceId]);
    const targetId=discovered?.actorId===personId?discovered.merchantServiceId:randomUUID();
    for(const serviceId of [targetId]) {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"workspace:"+serviceId},0))`);
    }
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"merchant-service:"+value.commandId},0))`);
    await requireMerchantApplicant(tx,personId);
    const [previous]=await tx.select().from(merchantServiceCommands).where(eq(merchantServiceCommands.commandId,value.commandId));
    let serviceId=targetId;
    if(previous){
      if(previous.actorId!==personId || previous.digest!==digest)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);
      if(previous.merchantServiceId!==targetId)throw new MerchantLockSetChanged();
      const current=await loadServiceScope(tx,personId,previous.merchantServiceId,true);
      if(!evaluate(current.policy,"acquiring.setup").allowed)throw new SecurityError("ACTION_DENIED",403);
      serviceId=previous.merchantServiceId;
    } else {
      await tx.insert(services).values({id:targetId,kind:"MERCHANT",primaryPersonId:personId,displayName:value.displayName,status:"DRAFT"});
      await attachServiceMoneyAccount(tx,targetId,personId,"MERCHANT",value.displayName,value.moneyAccountId);
      await tx.insert(serviceMembers).values({serviceId:targetId,personId,state:"ACCEPTED"});
      await tx.insert(permissionGrants).values(["acquiring.read","acquiring.setup","merchant.read","merchant.people.read","merchant.people.invite","merchant.people.revoke","merchant.terminals.create","merchant.terminals.pause","channels.read","channels.create","channels.update","channels.close","channels.share","gateway.manage","payments.read","payments.refund","payouts.manage"].map(action=>({serviceId:targetId,personId,action,state:"ACCEPTED" as const,delegable:true})));
      await initializeMerchantSetup(tx,personId,targetId);
      await tx.insert(merchantServiceCommands).values({commandId:value.commandId,actorId:personId,merchantServiceId:targetId,digest});
      await tx.insert(eventOutbox).values({businessKey:`merchant-setup-started:${targetId}`,kind:"merchant.setup.started",aggregateId:targetId});
    }
    const [unit]=await tx.select({id:merchantTerminals.id}).from(merchantTerminals).where(eq(merchantTerminals.merchantServiceId,serviceId)).orderBy(merchantTerminals.createdAt,merchantTerminals.id).limit(1);
    if(!unit)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
    return {serviceId,merchantId:unit.id,status:"DRAFT" as const,nextHref:customerHref(`/merchants/${unit.id}`,{tab:"payments"})};
   });}catch(error){if(!(error instanceof MerchantLockSetChanged))throw error;}
  }
  throw new SecurityError("REQUEST_RETRY_REQUIRED",409);
}

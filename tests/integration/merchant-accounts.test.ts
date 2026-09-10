import {randomUUID} from "node:crypto";
import {afterAll,expect,it} from "vitest";
import {and,eq} from "drizzle-orm";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {services,serviceMembers,permissionGrants,cards} from "../../src/platform/database/schema";
import {createPrimaryMerchant} from "../../src/modules/services/create-merchant";
import {merchantServiceCommands} from "../../src/modules/services/schema";
import {acquiringPerson} from "../helpers/acquiring";
afterAll(closeDatabase);
it("primary enrollment creates only Merchant service authority and a stable command receipt",async()=>{
 const person=await acquiringPerson(),input={commandId:randomUUID(),displayName:"Exact merchant"};const created=await createPrimaryMerchant(person.personId,input);expect(await createPrimaryMerchant(person.personId,input)).toEqual(created);
 expect((await getDb().select().from(services).where(eq(services.id,created.serviceId)))[0]).toMatchObject({kind:"MERCHANT",primaryPersonId:person.personId});
 expect(await getDb().select().from(services).where(and(eq(services.primaryPersonId,person.personId),eq(services.kind,"CARDHOLDER")))).toEqual([]);
 expect(await getDb().select().from(cards).where(eq(cards.serviceId,created.serviceId))).toEqual([]);
 expect((await getDb().select().from(permissionGrants).where(eq(permissionGrants.serviceId,created.serviceId))).some(row=>row.action.startsWith("cards."))).toBe(false);
 expect(await getDb().select().from(merchantServiceCommands).where(eq(merchantServiceCommands.commandId,input.commandId))).toHaveLength(1);
 await expect(createPrimaryMerchant(person.personId,{...input,displayName:"Other name"})).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
 const other=await acquiringPerson();await expect(createPrimaryMerchant(other.personId,input)).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
 await getDb().update(serviceMembers).set({state:"REVOKED",version:2}).where(eq(serviceMembers.serviceId,created.serviceId));await expect(createPrimaryMerchant(person.personId,input)).rejects.toMatchObject({status:404});
});
it("unenrolled and supervised people cannot manufacture merchant eligibility",async()=>{
 for(const kind of [null,"FICTIONAL_SUPERVISED"] as const){const person=await acquiringPerson(kind);await expect(createPrimaryMerchant(person.personId,{commandId:randomUUID(),displayName:"Denied"})).rejects.toMatchObject({code:"MERCHANT_APPLICANT_REQUIRED"});expect(await getDb().select().from(services).where(eq(services.primaryPersonId,person.personId))).toEqual([]);}
});

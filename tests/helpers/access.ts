import { randomUUID } from "node:crypto";
import { merchantSetupEligibility } from "../../src/modules/services/schema";
import { getDb } from "../../src/platform/database/client";

import { bindIdentity, createCardholderService } from "../../src/modules/services/service";
import { seedWorkspaceService } from "../../src/modules/workspace/fixtures";
import { seedAccessCapabilities } from "../../src/modules/access/fixtures";
import type { CreateInvitationInput } from "../../src/modules/access/contracts";
export async function person(){const identity=await bindIdentity("urn:etail:isolated-fixture",randomUUID(),"Isolated fictional access tester");await getDb().insert(merchantSetupEligibility).values({personId:identity.personId,personaKind:"FICTIONAL_ADULT"});return identity;}
export async function accessFixture() {
 const owner=await person(),recipient=await person();
 const {serviceId}=await createCardholderService(owner.personId,{commandId:randomUUID(),displayName:"Cardholder test group"});
 await seedWorkspaceService(serviceId,owner.personId);await seedAccessCapabilities(owner.personId);
 return {owner,recipient,serviceId};
}
export function offer(recipientId:string):CreateInvitationInput {
 return {commandId:randomUUID(),recipientId,expiresInDays:3};
}
export const decision=(expectedVersion=1)=>({commandId:randomUUID(),expectedVersion});

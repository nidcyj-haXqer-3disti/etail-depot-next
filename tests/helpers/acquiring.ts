import {randomUUID} from "node:crypto";
import {getDb} from "../../src/platform/database/client";
import {bindIdentity} from "../../src/modules/services/service";
import {createPrimaryMerchant} from "../../src/modules/services/create-merchant";
import {merchantSetupEligibility} from "../../src/modules/services/schema";
import {getMerchantBusinessDetails} from "../../src/modules/acquiring/service";
export async function acquiringPerson(kind:"FICTIONAL_ADULT"|"FICTIONAL_SUPERVISED"|null="FICTIONAL_ADULT") {
 const identity=await bindIdentity("urn:etail:isolated-fixture",randomUUID(),"Fictional merchant tester");
 if(kind)await getDb().insert(merchantSetupEligibility).values({personId:identity.personId,personaKind:kind});
 return identity;
}
export async function acquiringFixture() {
 const person=await acquiringPerson(),service=await createPrimaryMerchant(person.personId,{commandId:randomUUID(),displayName:"Fictional merchant"});
 const setup=(await getMerchantBusinessDetails(person.personId,service.merchantId)).setup!;
 return {...person,serviceId:service.serviceId,merchantId:service.merchantId,setup};
}
export const completeSetup=(expectedVersion:number)=>({commandId:randomUUID(),expectedVersion,legalEntityType:"SOLE_PROPRIETOR" as const,sellingName:"Fictional ceramics",legalName:"Fictional merchant legal party",activityDescription:"Fictional handmade ceramic items",country:"US" as const,fictionalDetailsConfirmed:true});
export const paymentInput=()=>({commandId:randomUUID(),description:"Fictional ceramic bowl",amountMinor:"1250",currency:"USD" as const,usage:"ONE_TIME" as const,expiresAt:new Date(Date.now()+7*86400000).toISOString()});

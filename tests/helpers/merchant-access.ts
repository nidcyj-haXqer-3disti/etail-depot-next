import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import {getDb} from "../../src/platform/database/client";
import {merchantUnits} from "../../src/modules/acquiring/schema";
import {createOwnedSubmerchant} from "../../src/modules/acquiring/service";
import {createMerchantInvitation} from "../../src/modules/access/merchant-service";
import {acceptInvitation} from "../../src/modules/access/service";
import {acquiringFixture,acquiringPerson} from "./acquiring";
import {MERCHANT_PERMISSIONS,type CreateMerchantInvitationInput,type MerchantPermission} from "../../src/modules/access/merchant-contracts";
export async function merchantAccessFixture() {
 const merchant=await acquiringFixture(),operator=await acquiringPerson(),helper=await acquiringPerson();
 const created=await createOwnedSubmerchant(merchant.personId,merchant.merchantId,{commandId:randomUUID(),displayName:"Fictional collection unit"});
 const [unit]=await getDb().select().from(merchantUnits).where(eq(merchantUnits.id,created.id));
 const [master]=await getDb().select().from(merchantUnits).where(eq(merchantUnits.id,merchant.merchantId));
 const offer=await createMerchantInvitation(merchant.personId,unit!.id,{...merchantOffer(operator.personId,[...MERCHANT_PERMISSIONS],[...MERCHANT_PERMISSIONS]),accessExpiresInDays:30});
 await acceptInvitation(operator.personId,offer.id,{commandId:randomUUID(),expectedVersion:offer.version});
 return {merchant,operator,helper,unit:unit!,master:master!};
}
export function merchantOffer(recipientId:string,permissions:MerchantPermission[]=["merchant.read","channels.read","channels.create","channels.update","channels.close"],delegablePermissions:MerchantPermission[]=[]):CreateMerchantInvitationInput{return {commandId:randomUUID(),recipientId,permissions,delegablePermissions,expiresInDays:3,accessExpiresInDays:7};}

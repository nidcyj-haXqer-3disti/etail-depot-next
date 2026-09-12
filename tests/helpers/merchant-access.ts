import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import {getDb} from "../../src/platform/database/client";
import {merchantTerminals} from "../../src/modules/acquiring/schema";
import {createTerminal} from "../../src/modules/acquiring/service";
import {createMerchantInvitation} from "../../src/modules/access/merchant-service";
import {acceptInvitation} from "../../src/modules/access/service";
import {acquiringFixture,acquiringPerson} from "./acquiring";
import {type CreateMerchantInvitationInput} from "../../src/modules/access/merchant-contracts";
export async function merchantAccessFixture() {
 const merchant=await acquiringFixture(),operator=await acquiringPerson(),helper=await acquiringPerson();
 const created=await createTerminal(merchant.personId,merchant.serviceId,{commandId:randomUUID(),displayName:"Named payment terminal"});
 const [unit]=await getDb().select().from(merchantTerminals).where(eq(merchantTerminals.id,created.id));
 const [master]=await getDb().select().from(merchantTerminals).where(eq(merchantTerminals.id,merchant.merchantId));
 const offer=await createMerchantInvitation(merchant.personId,unit!.id,merchantOffer(operator.personId));
 await acceptInvitation(operator.personId,offer.id,{commandId:randomUUID(),expectedVersion:offer.version});
 return {merchant,operator,helper,unit:unit!,master:master!};
}
export function merchantOffer(recipientId:string):CreateMerchantInvitationInput{return {commandId:randomUUID(),recipientId,expiresInDays:3};}

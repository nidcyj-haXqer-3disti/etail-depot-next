import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import {expect,type Page} from "@playwright/test";
import {getDb} from "../../../src/platform/database/client";
import {identityBindings} from "../../../src/platform/database/schema";
import {SessionService} from "../../../src/modules/identity";
import {sessionRepository} from "../../../src/platform/database/session-repository";
import {createChannel} from "../../../src/modules/acquiring/service";
import {configureTestGateway,enrollTestMerchant,setChannelActivation} from "../../../src/modules/acquiring/operations-service";
import {publishGuestChannel} from "../../../src/modules/acquiring/guest-service";
import {cardPrimary,fundCardGroup,issuePracticeCard} from "../../helpers/cardholder";
import {merchantAccessFixture} from "../../helpers/merchant-access";
import {paymentInput} from "../../helpers/acquiring";
import {cardholderDashboardSchema} from "../../../src/modules/workspace/api-contracts";
import {prepareCardCheckout} from "../../../src/modules/acquiring/card-checkout-service";

export const prepaidOrigin="http://127.0.0.1:3100";
export async function signInPerson(page:Page,personId:string){
 const [identity]=await getDb().select().from(identityBindings).where(and(eq(identityBindings.personId,personId),eq(identityBindings.issuer,"urn:etail:isolated-fixture")));
 if(!identity)throw new Error("Expected a fresh fictional identity");
 const session=await new SessionService(sessionRepository,{appEnv:"test",publicOrigin:prepaidOrigin}).issue({personId,identityId:identity.id});
 const pair=session.cookie.split(";",1)[0]!;
 await page.context().addCookies([{name:pair.slice(0,pair.indexOf("=")),value:pair.slice(pair.indexOf("=")+1),domain:"127.0.0.1",path:"/",httpOnly:true,sameSite:"Strict",expires:Math.floor(session.record.expiresAt.getTime()/1000)}]);
}
export async function freshPrepaidCard(funds="2500",limit=funds){
 const primary=await cardPrimary(`Browser primary ${randomUUID().slice(0,8)}`);
 await fundCardGroup(primary.personId,primary.serviceId,funds);

 const {card}=await issuePracticeCard(primary.personId, primary.serviceId, primary.personId, "Fresh prepaid card", undefined, limit);
 return {primary,card};
}
export async function freshPublishedPayment(amountMinor:string,description=`Browser order ${randomUUID().slice(0,8)}`){
 const m=await merchantAccessFixture();
 await configureTestGateway(m.merchant.personId,m.master.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});
 await enrollTestMerchant(m.merchant.personId,m.unit.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});
 const channel=await createChannel(m.operator.personId,m.unit.id,{...paymentInput(),amountMinor,description,usage:"ONE_TIME",presentations:["WEB"],visibility:"CREATOR_PRIVATE"});
 await setChannelActivation(m.operator.personId,m.unit.id,channel.id,{commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:channel.version,active:true});
 const publication=(await publishGuestChannel(m.operator.personId,m.unit.id,channel.id,{commandId:randomUUID(),expectedChannelVersion:channel.version})).publication;
 if(!publication)throw new Error("Canonical publication missing");
 return {...m,channel,publication};
}
/** Historical review fixtures use the canonical command; the customer-facing chooser is retired. */
export async function prepareSavedCardReview(page:Page,publicationId:string,cardId:string){
 const response=await page.request.get("/api/v1/cardholder-services?cardScope=OWN");expect(response.status()).toBe(200);
 const dashboard=cardholderDashboardSchema.parse(await response.json()),card=dashboard.cards.find(row=>row.id===cardId);
 if(!card||card.holderId!==dashboard.person.id)throw new Error("Historical review needs this session's exact authorized own card");
 return prepareCardCheckout(dashboard.person.id,publicationId,{commandId:randomUUID(),cardServiceId:card.serviceId,cardId,expectedCardVersion:card.version});
}
export async function openSavedCardReview(page:Page,publicationId:string,cardId:string){
 const review=await prepareSavedCardReview(page,publicationId,cardId),url=`http://127.0.0.1:3100/checkout/${publicationId}/card?review=${review.id}`;
 await page.goto(url);await expect(page.getByRole("heading",{name:"Review your payment",exact:true})).toBeVisible();
 return {reviewId:review.id,url,confirmPath:`/api/v1/checkout/${publicationId}/card/${review.id}`};
}

/** Test setup uses the same paired checkout command as the customer endpoint. */
export async function payPublishedWithCard(publicationId:string,group:Awaited<ReturnType<typeof freshPrepaidCard>>){
 const {getWorkspace}=await import("../../../src/modules/workspace/service");
 const {prepareCardCheckout,confirmCardCheckout}=await import("../../../src/modules/acquiring/card-checkout-service");
 const current=(await getWorkspace(group.primary.personId,group.primary.serviceId)).cards.find(card=>card.id===group.card.id)!;
 const review=await prepareCardCheckout(group.primary.personId,publicationId,{commandId:randomUUID(),cardServiceId:group.primary.serviceId,cardId:current.id,expectedCardVersion:current.version});
 return confirmCardCheckout(group.primary.personId,publicationId,review.id);
}

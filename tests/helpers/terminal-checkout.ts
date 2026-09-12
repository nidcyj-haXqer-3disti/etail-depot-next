import {randomUUID} from "node:crypto";
import {merchantAccessFixture} from "./merchant-access";
import {cardPrimary,fundCardGroup,issuePracticeCard} from "./cardholder";
import {paymentInput} from "./acquiring";
import {createChannel} from "../../src/modules/acquiring/service";
import {configureTestGateway,enrollTestMerchant,setChannelActivation} from "../../src/modules/acquiring/operations-service";
import {publishGuestChannel} from "../../src/modules/acquiring/guest-service";
import {prepareCardCheckout,confirmCardCheckout} from "../../src/modules/acquiring/card-checkout-service";
import {getWorkspace} from "../../src/modules/workspace/service";
/** Real published checkout in the isolated provider environment; no merchant-side payment writer. */
export async function terminalCheckoutFixture(fundingMinor="20000"){
 const f=await merchantAccessFixture(),payer=await cardPrimary("Payment customer");
 await fundCardGroup(payer.personId,payer.serviceId,fundingMinor);
 const issued=await issuePracticeCard(payer.personId,payer.serviceId,payer.personId,"Shopping card",undefined,fundingMinor);
 await configureTestGateway(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});
 await enrollTestMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});
 const channel=await createChannel(f.operator.personId,f.unit.id,{...paymentInput(),usage:"REUSABLE",presentations:["SMS","EMAIL","INVOICE","BILL","SOCIAL","QR","WEB"],visibility:"ASSIGNED"});
 await setChannelActivation(f.operator.personId,f.unit.id,channel.id,{commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:channel.version,active:true});
 const published=await publishGuestChannel(f.operator.personId,f.unit.id,channel.id,{commandId:randomUUID(),expectedChannelVersion:channel.version});
 if(!published.publication)throw new Error("Fixture payment publication missing");
 return {...f,payer,card:issued.card,channel,publication:published.publication};
}
export async function payTerminal(f:Awaited<ReturnType<typeof terminalCheckoutFixture>>){
 const card=(await getWorkspace(f.payer.personId,f.payer.serviceId)).cards.find(row=>row.id===f.card.id)!;
 const review=await prepareCardCheckout(f.payer.personId,f.publication.id,{commandId:randomUUID(),cardServiceId:f.payer.serviceId,cardId:card.id,expectedCardVersion:card.version});
 const result=await confirmCardCheckout(f.payer.personId,f.publication.id,review.id);
 if(!result.receipt)throw new Error("Fixture checkout did not produce a receipt");return result.receipt;
}

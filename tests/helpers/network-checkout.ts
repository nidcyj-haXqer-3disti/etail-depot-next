import {randomUUID} from "node:crypto";
import {acquiringFixture,paymentInput} from "./acquiring";
import {createChannel} from "../../src/modules/acquiring/service";
import {configureTestGateway,enrollTestMerchant,setChannelActivation} from "../../src/modules/acquiring/operations-service";
import {ensureGuestSession,publishGuestChannel} from "../../src/modules/acquiring/guest-service";
export async function networkCheckoutFixture(usage:"ONE_TIME"|"REUSABLE"="REUSABLE"){
 const f=await acquiringFixture();await configureTestGateway(f.personId,f.merchantId,{commandId:randomUUID(),expectedVersion:0,enabled:true});await enrollTestMerchant(f.personId,f.merchantId,{commandId:randomUUID(),expectedVersion:0,enabled:true});const channel=await createChannel(f.personId,f.merchantId,{...paymentInput(),usage,presentations:["SMS","EMAIL","INVOICE","BILL","SOCIAL","QR","WEB"],visibility:"ASSIGNED"});await setChannelActivation(f.personId,f.merchantId,channel.id,{commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:channel.version,active:true});const offer=await publishGuestChannel(f.personId,f.merchantId,channel.id,{commandId:randomUUID(),expectedChannelVersion:channel.version});if(!offer.publication)throw new Error("Missing publication");const session=await ensureGuestSession(null);return {...f,channel,publication:offer.publication,cookie:session.setCookie!.split(";")[0]};
}

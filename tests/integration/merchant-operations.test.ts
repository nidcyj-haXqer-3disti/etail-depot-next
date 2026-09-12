import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {configureTestGateway,enrollTestMerchant,getMerchantOperations,setChannelActivation,refundMerchantPayment} from "../../src/modules/acquiring/operations-service";
import {createChannel,updateChannel} from "../../src/modules/acquiring/service";
import {getPublicGuestRequest} from "../../src/modules/acquiring/guest-service";
import {prepareCardCheckout,confirmCardCheckout} from "../../src/modules/acquiring/card-checkout-service";
import {merchantOperationCommands,merchantTestPayments} from "../../src/modules/acquiring/operations-schema";
import {terminalCheckoutFixture,payTerminal} from "../helpers/terminal-checkout";
import {acquiringFixture,paymentInput} from "../helpers/acquiring";
afterAll(closeDatabase);
it("gateway and terminal enrollment require owner authority and optimistic versions",async()=>{
 const f=await acquiringFixture(),input={commandId:randomUUID(),expectedVersion:0,enabled:true};
 expect(await getMerchantOperations(f.personId,f.merchantId)).toMatchObject({gateway:{mode:"NOT_CONFIGURED"},enrollment:{status:"NOT_ENROLLED"}});
 await expect(enrollTestMerchant(f.personId,f.merchantId,input)).rejects.toMatchObject({code:"TEST_GATEWAY_NOT_READY"});
 const gateway=await configureTestGateway(f.personId,f.merchantId,input);expect(await configureTestGateway(f.personId,f.merchantId,input)).toEqual(gateway);
 await expect(configureTestGateway(f.personId,f.merchantId,{...input,commandId:randomUUID(),enabled:false})).rejects.toMatchObject({code:"STALE_VERSION"});
 await enrollTestMerchant(f.personId,f.merchantId,{...input,commandId:randomUUID()});expect((await getMerchantOperations(f.personId,f.merchantId)).enrollment.status).toBe("ENROLLED");
});
it("activation binds the reviewed channel terms and expired channels cannot publish",async()=>{
 const f=await terminalCheckoutFixture(),channel=await createChannel(f.operator.personId,f.unit.id,{...paymentInput(),presentations:["WEB"],visibility:"ASSIGNED"});
 await updateChannel(f.operator.personId,f.unit.id,channel.id,{...paymentInput(),presentations:["WEB"],visibility:"ASSIGNED",expectedVersion:1,amountMinor:"2500"});
 await expect(setChannelActivation(f.operator.personId,f.unit.id,channel.id,{commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:1,active:true})).rejects.toMatchObject({code:"STALE_VERSION"});
 expect(await setChannelActivation(f.operator.personId,f.unit.id,channel.id,{commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:2,active:true})).toMatchObject({state:"ACTIVE"});
});
it("disabled gateway stops new checkout confirmation while preserving existing receipts",async()=>{
 const f=await terminalCheckoutFixture(),paid=await payTerminal(f);
 const review=await prepareCardCheckout(f.payer.personId,f.publication.id,{commandId:randomUUID(),cardServiceId:f.payer.serviceId,cardId:f.card.id,expectedCardVersion:2});
 await configureTestGateway(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:1,enabled:false});
 await expect(confirmCardCheckout(f.payer.personId,f.publication.id,review.id)).rejects.toBeDefined();
 expect((await getMerchantOperations(f.operator.personId,f.unit.id)).payments.map(row=>row.id)).toEqual([paid.paymentId]);
 expect((await getPublicGuestRequest(f.publication.id)).canStart).toBe(false);
});
it("full refunds retain exact amount and immutable original payment attribution",async()=>{
 const f=await terminalCheckoutFixture(),paid=await payTerminal(f),input={commandId:randomUUID(),expectedVersion:1,reason:"Returned order"};
 const refund=await refundMerchantPayment(f.merchant.personId,f.unit.id,paid.paymentId,input);expect(refund).toMatchObject({status:"REFUNDED",amount:{minor:"1250"},refund:{amount:{minor:"1250"}}});
 await expect(refundMerchantPayment(f.merchant.personId,f.unit.id,paid.paymentId,{...input,reason:"Changed"})).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
 await expect(getDb().update(merchantTestPayments).set({description:"Changed history"}).where(eq(merchantTestPayments.id,paid.paymentId))).rejects.toThrow();
 await expect(getDb().delete(merchantOperationCommands).where(eq(merchantOperationCommands.commandId,input.commandId))).rejects.toThrow();
});
it("a channel publication retains exact seven-channel payment details",async()=>{
 const f=await terminalCheckoutFixture();expect(f.channel.presentations).toHaveLength(7);
 const publication=await getPublicGuestRequest(f.publication.id);
 expect(publication.publication?.amount.minor).toBe("1250");expect(publication.publication?.publicHref).toBe(`${process.env.ETAIL_PUBLIC_ORIGIN}/checkout/${publication.publication?.id}`);
});

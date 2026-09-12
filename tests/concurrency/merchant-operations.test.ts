import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {terminalCheckoutFixture} from "../helpers/terminal-checkout";
import {prepareCardCheckout,confirmCardCheckout} from "../../src/modules/acquiring/card-checkout-service";
import {merchantTestPayments} from "../../src/modules/acquiring/operations-schema";
import {getMerchantOperations} from "../../src/modules/acquiring/operations-service";
import {readServiceMoneyAvailable} from "../../src/modules/money/service";
afterAll(closeDatabase);
it("concurrent checkout confirmation retries record one payment and one card debit",async()=>{
 const f=await terminalCheckoutFixture(),review=await prepareCardCheckout(f.payer.personId,f.publication.id,{commandId:randomUUID(),cardServiceId:f.payer.serviceId,cardId:f.card.id,expectedCardVersion:f.card.version});
 const results=await Promise.all(Array.from({length:6},()=>confirmCardCheckout(f.payer.personId,f.publication.id,review.id)));
 expect(new Set(results.map(row=>row.receipt?.paymentId)).size).toBe(1);expect(await getDb().select().from(merchantTestPayments).where(eq(merchantTestPayments.channelId,f.channel.id))).toHaveLength(1);
 expect((await getMerchantOperations(f.merchant.personId,f.unit.id)).availableFunds?.minor).toBe("1250");expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,f.payer.serviceId))).toBe(18750n);
});

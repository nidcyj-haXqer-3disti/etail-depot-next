import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {createMerchantSettlement,getMerchantOperations,refundMerchantPayment} from "../../src/modules/acquiring/operations-service";
import {merchantSettlements} from "../../src/modules/acquiring/settlement-schema";
import {merchantTestRefunds} from "../../src/modules/acquiring/operations-schema";
import {openPaymentDispute,respondToTerminalDispute} from "../../src/modules/disputes/service";
import {merchantDisputes,merchantDisputeMessages} from "../../src/modules/disputes/schema";
import {readServiceMoneyAvailable} from "../../src/modules/money/service";
import {terminalCheckoutFixture,payTerminal} from "../helpers/terminal-checkout";
afterAll(closeDatabase);
it("concurrent settlement retries produce one credit and refund retries return money only once",async()=>{
 const f=await terminalCheckoutFixture(),paid=await payTerminal(f);const input={commandId:randomUUID(),reviewToken:(await getMerchantOperations(f.merchant.personId,f.unit.id)).depositReview!.token};
 const results=await Promise.all(Array.from({length:5},()=>createMerchantSettlement(f.merchant.personId,f.unit.id,input)));expect(new Set(results.map(row=>row.id)).size).toBe(1);
 expect(await getDb().select().from(merchantSettlements).where(eq(merchantSettlements.merchantUnitId,f.unit.id))).toHaveLength(1);
 const refund={commandId:randomUUID(),expectedVersion:1,reason:"Order returned"};const refunds=await Promise.all(Array.from({length:5},()=>refundMerchantPayment(f.merchant.personId,f.unit.id,paid.paymentId,refund)));expect(new Set(refunds.map(row=>row.refund?.id)).size).toBe(1);
 expect(await getDb().select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,paid.paymentId))).toHaveLength(1);
 expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,f.merchant.serviceId))).toBe(0n);expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,f.payer.serviceId))).toBe(20000n);
});
it("racing settlement and refund serialize principal without stranded or negative money",async()=>{
 const f=await terminalCheckoutFixture(),paid=await payTerminal(f),review=(await getMerchantOperations(f.merchant.personId,f.unit.id)).depositReview!;
 const results=await Promise.allSettled([createMerchantSettlement(f.merchant.personId,f.unit.id,{commandId:randomUUID(),reviewToken:review.token}),refundMerchantPayment(f.merchant.personId,f.unit.id,paid.paymentId,{commandId:randomUUID(),expectedVersion:1,reason:"Canceled order"})]);
 expect(results[1]?.status).toBe("fulfilled");expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,f.merchant.serviceId))).toBe(0n);expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,f.payer.serviceId))).toBe(20000n);
});
it("concurrent dispute retries create one claim and competing responses have one winner",async()=>{
 const f=await terminalCheckoutFixture(),paid=await payTerminal(f),input={commandId:randomUUID(),reason:"OTHER" as const,message:"Please check my delivery."};
 const claims=await Promise.all(Array.from({length:4},()=>openPaymentDispute(f.payer.personId,paid.paymentId,input)));expect(new Set(claims.map(row=>row.id)).size).toBe(1);expect(await getDb().select().from(merchantDisputes).where(eq(merchantDisputes.paymentId,paid.paymentId))).toHaveLength(1);
 const results=await Promise.allSettled([f.merchant.personId,f.operator.personId].map(personId=>respondToTerminalDispute(personId,f.unit.id,claims[0]!.id,{commandId:randomUUID(),expectedVersion:1,message:"Delivery checked",evidence:"Tracking record 500"})));expect(results.filter(row=>row.status==="fulfilled")).toHaveLength(1);expect(results.find(row=>row.status==="rejected")).toMatchObject({reason:{code:"STALE_VERSION"}});expect(await getDb().select().from(merchantDisputeMessages).where(eq(merchantDisputeMessages.disputeId,claims[0]!.id))).toHaveLength(2);
});

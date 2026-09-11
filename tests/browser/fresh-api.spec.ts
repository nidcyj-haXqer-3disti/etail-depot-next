import {randomUUID} from "node:crypto";
import {expect,test} from "@playwright/test";
import {headers,signIn,cardDashboard,merchantDashboard} from "./helpers/fresh";
import {eq,inArray} from "drizzle-orm";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {merchantTestPayments,merchantTestRefunds} from "../../src/modules/acquiring/operations-schema";
import {guestOrders} from "../../src/modules/acquiring/guest-schema";
import {cardCheckoutAttempts} from "../../src/modules/acquiring/card-checkout-schema";
import {cardCheckoutReviewSchema} from "../../src/modules/acquiring/card-checkout-contracts";
import {ledgerEntries} from "../../src/modules/ledger/schema";
import {getBalance} from "../../src/modules/ledger/service";
import {freshPrepaidCard,freshPublishedPayment,signInPerson} from "./helpers/prepaid";
import {merchantOperations} from "./helpers/merchant-payments";
import {createOwnedSubmerchant} from "../../src/modules/acquiring/service";
import {merchantAccessFixture} from "../helpers/merchant-access";
test.afterAll(closeDatabase);

test("fresh directory has exactly two service kinds and identity sessions contain no account selector",async({request})=>{await signIn(request);const response=await request.get("/api/v1/services"),data=await response.json();expect(response.status()).toBe(200);expect(new Set(data.services.map((item:{kind:string})=>item.kind))).toEqual(new Set(["CARDHOLDER","MERCHANT"]));expect(data).not.toHaveProperty("selectedServiceId");expect(JSON.stringify(data)).not.toMatch(/PERSONAL|HOUSEHOLD|SELLER|personalOwner|cardAccessState/);expect((await request.get("/api/v1/accounts")).status()).toBe(404);});
test("secondary card API excludes primary card data, service-wide permissions and guessed records",async({request,playwright})=>{await signIn(request);const primary=await cardDashboard(request),foreign=primary.cards.find(card=>card.holderId===primary.person.id)!;const secondary=await playwright.request.newContext({baseURL:"http://127.0.0.1:3100"});try{await signIn(secondary,"viewer");const own=await cardDashboard(secondary);expect(own.primaryService).toBeNull();expect(own.cards.length).toBe(1);expect(own.cards.every(card=>card.holderId===own.person.id)).toBe(true);expect(JSON.stringify(own)).not.toContain(foreign.id);expect((await secondary.post(`/api/v1/cardholder-services/${foreign.serviceId}/cards/${foreign.id}/control`,{headers,data:{commandId:randomUUID(),expectedVersion:foreign.version,action:"freeze"}})).status()).toBeGreaterThanOrEqual(400);const workspace=await(await secondary.get(`/api/v1/cardholder-services/${foreign.serviceId}/workspace`)).json();expect(workspace.people).toEqual([]);expect(workspace.cardRequests).toEqual([]);expect(workspace.activity.every((row:{cardId:string})=>row.cardId===own.cards[0]!.id)).toBe(true);}finally{await secondary.dispose();}});
test("card controls require same origin, replay safely and preserve available funds",async({request})=>{await signIn(request);const d=await cardDashboard(request),card=d.cards.find(row=>row.holderId===d.person.id)!;const endpoint=`/api/v1/cardholder-services/${card.serviceId}/cards/${card.id}/control`,input={commandId:randomUUID(),expectedVersion:card.version,action:card.status==="ACTIVE"?"freeze":"unfreeze"};expect((await request.post(endpoint,{headers:{"Content-Type":"application/json"},data:input})).status()).toBe(403);expect((await request.post(endpoint,{headers:{...headers,Origin:"https://example.invalid"},data:input})).status()).toBe(403);const response=await request.post(endpoint,{headers,data:input});expect(response.status()).toBe(200);const result=await response.json();expect(result.available.minor).toBe(card.available.minor);expect(await(await request.post(endpoint,{headers,data:input})).json()).toEqual(result);expect((await request.post(endpoint,{headers,data:{commandId:randomUUID(),expectedVersion:result.version,action:card.status==="ACTIVE"?"unfreeze":"freeze"}})).status()).toBe(200);});
test("submerchant API exposes only its own records and denies sibling, primary and deposit authority",async({page})=>{
 const f=await merchantAccessFixture();
 const sibling=await createOwnedSubmerchant(f.merchant.personId,f.master.id,{commandId:randomUUID(),displayName:"Other fictional collection point"});
 await signInPerson(page,f.operator.personId);
 const own=await merchantDashboard(page.request);expect(own.primaryNetworks).toEqual([]);expect(own.units.map(unit=>unit.id)).toEqual([f.unit.id]);
 for(const path of [`/api/v1/merchants/${sibling.id}`,`/api/v1/merchants/${f.master.id}/network`,`/api/v1/merchants/${f.master.id}/business-details`])expect([403,404]).toContain((await page.request.get(path)).status());
 const operations=await merchantOperations(page,f.unit.id);expect(operations.payments).toEqual([]);expect(operations.canConfigureGateway).toBe(false);expect(operations.canPayout).toBe(false);expect(operations.depositReview).toBeNull();
 const denied=await page.request.post(`/api/v1/merchants/${f.unit.id}/payouts`,{headers,data:{commandId:randomUUID(),reviewToken:"0".repeat(64)}});
 expect([403,404]).toContain(denied.status());expect((await cardDashboard(page.request)).cards).toEqual([]);
});

test("connected checkout and full refund replay exactly once and preserve gross monthly spending",async({page})=>{
 const m=await freshPublishedPayment("1250"),payer=await freshPrepaidCard("10000","10000");
 await signInPerson(page,payer.primary.personId);
 const path=`/api/v1/checkout/${m.publication.id}/card`,input={commandId:randomUUID(),cardServiceId:payer.primary.serviceId,cardId:payer.card.id,expectedCardVersion:payer.card.version};
 for(const origin of [undefined,"https://example.invalid"]){const denied=await page.request.post(path,{headers:{"Content-Type":"application/json",...(origin?{Origin:origin}:{})},data:input});expect(denied.status()).toBe(403);}
 expect(await getDb().select().from(cardCheckoutAttempts).where(eq(cardCheckoutAttempts.publicationId,m.publication.id))).toHaveLength(0);
 const prepared=await page.request.post(path,{headers,data:input});expect(prepared.status()).toBe(200);const review=cardCheckoutReviewSchema.parse(await prepared.json());expect(review.receipt).toBeNull();
 expect(await(await page.request.post(path,{headers,data:input})).json()).toEqual(review);
 const paid=await page.request.post(`${path}/${review.id}`,{headers,data:{}});expect(paid.status()).toBe(200);const receipt=cardCheckoutReviewSchema.parse(await paid.json());expect(receipt.receipt).not.toBeNull();
 const replay=await page.request.post(`${path}/${review.id}`,{headers,data:{}});expect(replay.status()).toBe(200);expect(await replay.json()).toEqual(receipt);
 expect(await getDb().transaction(tx=>getBalance(tx,{serviceId:payer.primary.serviceId,bucket:"GROUP_AVAILABLE"}))).toBe(8750n);
 await signInPerson(page,m.merchant.personId);
 const operations=await merchantOperations(page,m.unit.id),payment=operations.payments[0]!;expect(payment.id).toBe(receipt.receipt!.paymentId);expect(operations.availableFunds?.minor).toBe("1250");
 expect(await getDb().select().from(merchantTestPayments).where(eq(merchantTestPayments.cardCheckoutId,review.id))).toHaveLength(1);
 const refundInput={commandId:randomUUID(),expectedVersion:payment.version,reason:"Browser connected refund"};
 const refundPath=`/api/v1/merchants/${m.unit.id}/payments/${payment.id}/refund`;
 const refund=await page.request.post(refundPath,{headers,data:refundInput});expect(refund.status()).toBe(200);const saved=await refund.json();expect(saved.status).toBe("REFUNDED");
 const refundReplay=await page.request.post(refundPath,{headers,data:refundInput});expect(refundReplay.status()).toBe(200);expect(await refundReplay.json()).toEqual(saved);
 expect(await getDb().select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,payment.id))).toHaveLength(1);
 expect((await merchantOperations(page,m.unit.id)).availableFunds?.minor).toBe("0");
 expect(await getDb().transaction(tx=>getBalance(tx,{serviceId:payer.primary.serviceId,bucket:"GROUP_AVAILABLE"}))).toBe(10000n);
 await signInPerson(page,payer.primary.personId);const card=(await cardDashboard(page.request)).cards.find(row=>row.id===payer.card.id)!;expect(card.available.minor).toBe("8750");
 const current=cardCheckoutReviewSchema.parse(await(await page.request.get(`${path}/${review.id}`)).json());expect(current.receipt?.refundedAt).not.toBeNull();
});

test("retired merchant and guest payment mutations return 404 and cannot create any money or order effects",async({page})=>{
 const m=await freshPublishedPayment("1250"),payer=await freshPrepaidCard("10000","10000");await signInPerson(page,m.merchant.personId);
 const scope=[m.merchant.serviceId,payer.primary.serviceId],orderId=randomUUID(),attemptId=randomUUID();
 const before=await getDb().select().from(ledgerEntries).where(inArray(ledgerEntries.serviceId,scope)).orderBy(ledgerEntries.journalId,ledgerEntries.lineNumber);
 const oldMutations=[
  {path:`/api/v1/cardholder-services/${payer.primary.serviceId}/cards/${payer.card.id}/purchase`,data:{commandId:randomUUID(),amountMinor:"100",description:"Retired purchase"}},
  {path:`/api/v1/cardholder-services/${payer.primary.serviceId}/funds/top-ups`,data:{commandId:randomUUID(),amountMinor:"100",currency:"USD",source:"SANDBOX_BANK"}},
  {path:`/api/v1/merchants/${m.unit.id}/channels/${m.channel.id}/test-payments`,data:{commandId:randomUUID(),expectedChannelVersion:m.channel.version,outcome:"APPROVED"}},
  {path:"/api/v1/guest/session",data:{}},
  {path:`/api/v1/guest/publications/${m.publication.id}/orders`,data:{commandId:randomUUID()}},
  {path:`/api/v1/guest/orders/${orderId}/attempts`,data:{commandId:randomUUID(),outcome:"APPROVED"}},
  {path:`/api/v1/guest/orders/${orderId}/attempts/${attemptId}/confirm`,data:{}},
 ];
 for(const {path,data} of oldMutations)expect((await page.request.post(path,{headers,data})).status(),path).toBe(404);
 expect((await page.request.get(`/pay/${m.channel.id}`)).status()).toBe(404);
 expect([401,404]).toContain((await page.request.get(`/api/v1/guest/orders/${orderId}`)).status());
 expect(await getDb().select().from(ledgerEntries).where(inArray(ledgerEntries.serviceId,scope)).orderBy(ledgerEntries.journalId,ledgerEntries.lineNumber)).toEqual(before);
 expect(await getDb().select().from(merchantTestPayments).where(eq(merchantTestPayments.merchantUnitId,m.unit.id))).toEqual([]);
 expect(await getDb().select().from(guestOrders).where(eq(guestOrders.merchantUnitId,m.unit.id))).toEqual([]);
 expect(await getDb().select().from(cardCheckoutAttempts).where(eq(cardCheckoutAttempts.publicationId,m.publication.id))).toEqual([]);
 expect(await merchantOperations(page,m.unit.id)).toMatchObject({availableFunds:{minor:"0"},pendingDeposits:{minor:"0"},bankFunds:{minor:"0"},payments:[],payouts:[]});
});

test("operator assignment is separate and replies are visible only to the case customer",async({request,playwright})=>{await signIn(request);const d=await cardDashboard(request),serviceId=d.primaryService!.id;expect((await request.get("/api/v1/operations/cases")).status()).toBe(404);const created=await request.post(`/api/v1/cardholder-services/${serviceId}/cases`,{headers,data:{commandId:randomUUID(),topic:"CARD",subject:`Browser care ${randomUUID().slice(0,8)}`,message:"Please help me understand my card.",transactionId:null}});expect(created.status()).toBe(200);const ticket=await created.json();const support=await playwright.request.newContext({baseURL:"http://127.0.0.1:3100"});try{await signIn(support,"operator");expect((await support.get(`/api/v1/operations/cases/${ticket.id}`)).status()).toBe(200);const input={commandId:randomUUID(),expectedVersion:ticket.version,message:"Use the selected card's controls to pause or resume purchases.",resolve:true};const response=await support.post(`/api/v1/operations/cases/${ticket.id}/responses`,{headers,data:input});expect(response.status()).toBe(200);expect((await response.json()).status).toBe("RESOLVED");const customer=await(await request.get(`/api/v1/cardholder-services/${serviceId}/cases/${ticket.id}`)).json();expect(customer.messages.at(-1)).toMatchObject({author:"SUPPORT",body:input.message});}finally{await support.dispose();}});

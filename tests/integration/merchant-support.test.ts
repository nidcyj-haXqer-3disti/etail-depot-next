import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {serviceMembers} from "../../src/platform/database/schema";
import {terminalAssignments} from "../../src/modules/access/schema";
import {createTerminal,pauseMerchant} from "../../src/modules/acquiring/service";
import {getMerchantOperations,refundMerchantPayment} from "../../src/modules/acquiring/operations-service";
import {getMerchantSupportCase,listMerchantSupportCases,createMerchantSupportCase,addMerchantSupportMessage,withdrawMerchantSupportCase,getSupportCase,createSupportCase,getMerchantSupportPaymentPreview} from "../../src/modules/cases/service";
import {supportCases,supportCaseMessages} from "../../src/modules/cases/schema";
import {supportCaseDetailSchema,supportCaseListSchema} from "../../src/modules/cases/api-contracts";
import {operatorCaseSchema} from "../../src/modules/operations/api-contracts";
import {operatorServiceAccess} from "../../src/modules/operations/schema";
import {getOperatorCase,getOperatorQueue,respondToCase} from "../../src/modules/operations/service";
import {acquiringPerson} from "../helpers/acquiring";
import {ledgerEntries} from "../../src/modules/ledger/schema";

import {terminalCheckoutFixture,payTerminal} from "../helpers/terminal-checkout";
afterAll(closeDatabase);
const question=(paymentId:string|null=null)=>({commandId:randomUUID(),topic:"PAYMENT" as const,subject:"Where is this payment?",message:"Please explain the payment and refund dates.",paymentId});
async function fixture(){const f=await terminalCheckoutFixture();const receipt=await payTerminal(f);const payment=(await getMerchantOperations(f.merchant.personId,f.unit.id)).payments.find(row=>row.id===receipt.paymentId)!;return {...f,payment};}

it("supports a collector without granting service membership; private conversation follows an exact payment through assigned support",async()=>{
 const f=await fixture(),staff=await acquiringPerson();
 const before=await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.merchantUnitId,f.unit.id));
 const command=question(f.payment.id),ticket=await createMerchantSupportCase(f.operator.personId,f.unit.id,command);
 supportCaseDetailSchema.parse(ticket);
 expect(ticket.payment).toMatchObject({id:f.payment.id,merchantId:f.unit.id,amount:{minor:"1250"},refund:null});
 expect(await getDb().select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,f.merchant.serviceId),eq(serviceMembers.personId,f.operator.personId)))).toHaveLength(0);
 expect(await createMerchantSupportCase(f.operator.personId,f.unit.id,command)).toEqual(ticket);
 await expect(getMerchantSupportCase(f.merchant.personId,f.unit.id,ticket.id)).rejects.toMatchObject({code:"RESOURCE_UNAVAILABLE"});
 await expect(getSupportCase(f.operator.personId,f.merchant.serviceId,ticket.id)).rejects.toBeDefined();
 await expect(createSupportCase(f.merchant.personId,f.merchant.serviceId,{commandId:randomUUID(),topic:"SERVICE",subject:"Wrong service",message:"Do not create membership",transactionId:null})).rejects.toMatchObject({code:"SUPPORT_UNAVAILABLE"});
 await getDb().insert(operatorServiceAccess).values({personId:staff.personId,serviceId:f.merchant.serviceId,state:"ACCEPTED",canRespond:true});
 expect((await getOperatorQueue(staff.personId)).map(row=>row.id)).toContain(ticket.id);
 const operator=await getOperatorCase(staff.personId,ticket.id);operatorCaseSchema.parse(operator);expect(operator.payment?.id).toBe(f.payment.id);
 await respondToCase(staff.personId,ticket.id,{commandId:randomUUID(),expectedVersion:ticket.version,message:"Your payment is in this merchant’s activity.",resolve:false});
 expect((await getMerchantSupportCase(f.operator.personId,f.unit.id,ticket.id)).nextActor).toBe("CUSTOMER");
 const listed=await listMerchantSupportCases(f.operator.personId,f.unit.id,{q:""});supportCaseListSchema.parse(listed);expect(listed.cases[0]?.nextActor).toBe("CUSTOMER");
 const updated=await addMerchantSupportMessage(f.operator.personId,f.unit.id,ticket.id,{commandId:randomUUID(),expectedVersion:2,message:"Thank you. Please close this."});expect(updated.nextActor).toBe("SUPPORT");
 await respondToCase(staff.personId,ticket.id,{commandId:randomUUID(),expectedVersion:3,message:"Resolved as requested.",resolve:true});
 expect(await getMerchantSupportCase(f.operator.personId,f.unit.id,ticket.id)).toMatchObject({status:"RESOLVED",version:4,nextActor:"NONE",canUpdate:false});
 expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.merchantUnitId,f.unit.id))).toEqual(before);
});
it("uses independent payment/refund timestamps and rejects sibling payment context",async()=>{
 const f=await fixture();
 const sibling=await createTerminal(f.merchant.personId,f.merchant.serviceId,{commandId:randomUUID(),displayName:"Other collection point"});
 await expect(createMerchantSupportCase(f.merchant.personId,sibling.id,question(f.payment.id))).rejects.toMatchObject({code:"RESOURCE_UNAVAILABLE"});
 await expect(getMerchantSupportPaymentPreview(f.operator.personId,sibling.id,f.payment.id)).rejects.toBeDefined();
 await refundMerchantPayment(f.merchant.personId,f.unit.id,f.payment.id,{commandId:randomUUID(),expectedVersion:1,reason:"Order canceled"});
 const ticket=await createMerchantSupportCase(f.operator.personId,f.unit.id,question(f.payment.id));
 expect(ticket.payment?.receivedAt).toBe(f.payment.createdAt);
 expect(ticket.payment?.refund).toMatchObject({amount:{minor:"1250"}});
 expect(new Date(ticket.payment!.refund!.completedAt).getTime()).toBeGreaterThanOrEqual(new Date(ticket.payment!.receivedAt).getTime());
 await expect(getMerchantSupportCase(f.merchant.personId,sibling.id,ticket.id)).rejects.toMatchObject({code:"RESOURCE_UNAVAILABLE"});
 await expect(getMerchantSupportCase(f.operator.personId,f.unit.id,"not-a-case-id")).rejects.toMatchObject({code:"RESOURCE_UNAVAILABLE"});
});
it("rechecks collector revocation before reads and successful command replay; assigned support retains history",async()=>{
 const f=await fixture(),staff=await acquiringPerson(),command=question(f.payment.id);
 const ticket=await createMerchantSupportCase(f.operator.personId,f.unit.id,command);
 await getDb().insert(operatorServiceAccess).values({personId:staff.personId,serviceId:f.merchant.serviceId,state:"ACCEPTED",canRespond:true});
 await getDb().update(terminalAssignments).set({state:"REVOKED",version:2,revokedAt:new Date()}).where(and(eq(terminalAssignments.terminalId,f.unit.id),eq(terminalAssignments.personId,f.operator.personId)));
 await expect(getMerchantSupportCase(f.operator.personId,f.unit.id,ticket.id)).rejects.toBeDefined();
 await expect(createMerchantSupportCase(f.operator.personId,f.unit.id,command)).rejects.toBeDefined();
 await expect(addMerchantSupportMessage(f.operator.personId,f.unit.id,ticket.id,{commandId:randomUUID(),expectedVersion:1,message:"Revoked"})).rejects.toBeDefined();
 expect((await getOperatorCase(staff.personId,ticket.id)).messages).toHaveLength(1);
 expect(await getDb().select().from(supportCaseMessages).where(eq(supportCaseMessages.caseId,ticket.id))).toHaveLength(1);
});

it("keeps primary support available for a paused unit without restoring collector access",async()=>{
 const f=await fixture(),primary=await createMerchantSupportCase(f.merchant.personId,f.unit.id,question(f.payment.id));
 const collector=await createMerchantSupportCase(f.operator.personId,f.unit.id,question(f.payment.id));
 await pauseMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:f.unit.version,reason:"Review collection activity"});
 expect(await getMerchantSupportCase(f.merchant.personId,f.unit.id,primary.id)).toMatchObject({id:primary.id,canUpdate:true});
 await expect(getMerchantSupportCase(f.operator.personId,f.unit.id,collector.id)).rejects.toBeDefined();
 expect((await addMerchantSupportMessage(f.merchant.personId,f.unit.id,primary.id,{commandId:randomUUID(),expectedVersion:1,message:"Help me understand this paused collection point."})).messages).toHaveLength(2);
});
it("deduplicates concurrent creation and rejects changed payloads and competing case versions",async()=>{
 const f=await fixture(),input=question(f.payment.id);
 const [a,b]=await Promise.all([createMerchantSupportCase(f.operator.personId,f.unit.id,input),createMerchantSupportCase(f.operator.personId,f.unit.id,input)]);
 expect(a.id).toBe(b.id);expect(a.messages).toHaveLength(1);
 await expect(createMerchantSupportCase(f.operator.personId,f.unit.id,{...input,subject:"Changed"})).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
 const results=await Promise.allSettled([addMerchantSupportMessage(f.operator.personId,f.unit.id,a.id,{commandId:randomUUID(),expectedVersion:1,message:"More information"}),withdrawMerchantSupportCase(f.operator.personId,f.unit.id,a.id,{commandId:randomUUID(),expectedVersion:1,reason:"Already understood"})]);
 expect(results.filter(row=>row.status==="fulfilled")).toHaveLength(1);
 expect((await getMerchantSupportCase(f.operator.personId,f.unit.id,a.id)).messages).toHaveLength(2);
});
it("keeps database context links typed and rejects cross-unit or wrong-service references",async()=>{
 const f=await fixture(),sibling=await createTerminal(f.merchant.personId,f.merchant.serviceId,{commandId:randomUUID(),displayName:"Other unit"});
 const base={id:randomUUID(),creatorId:f.operator.personId,serviceId:f.merchant.serviceId,serviceKind:"MERCHANT" as const,merchantUnitId:sibling.id,paymentId:f.payment.id,reference:`CASE-${randomUUID()}`,topic:"PAYMENT" as const,subject:"Invalid context"};
 await expect(getDb().insert(supportCases).values(base)).rejects.toBeDefined();
 await expect(getDb().insert(supportCases).values({...base,id:randomUUID(),serviceKind:"CARDHOLDER",merchantUnitId:null,paymentId:null,topic:"SERVICE"})).rejects.toBeDefined();
});

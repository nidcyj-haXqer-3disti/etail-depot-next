import {randomUUID} from "node:crypto";
import {afterAll,describe,it,expect} from "vitest";
import {eq} from "drizzle-orm";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {serviceMembers} from "../../src/platform/database/schema";
import {ledgerEntries} from "../../src/modules/ledger/schema";
import {operatorServiceAccess} from "../../src/modules/operations/schema";
import {getMerchantStatement} from "../../src/modules/acquiring/statement-service";
import {merchantStatementProjectionSchema} from "../../src/modules/acquiring/statement-contracts";
import {startNetworkCheckout,processNetworkCheckout} from "../../src/modules/acquiring/network-service";
import {getMerchantOperations,createMerchantSettlement,refundMerchantPayment} from "../../src/modules/acquiring/operations-service";
import {createTerminal} from "../../src/modules/acquiring/service";
import {getServiceMoneyAccount,prepareMoneyWithdrawal,confirmMoneyWithdrawal,processMoneyWithdrawal} from "../../src/modules/money/service";
import {createMerchantInvitation} from "../../src/modules/access/merchant-service";
import {acceptInvitation} from "../../src/modules/access/service";
import {networkCheckoutFixture} from "../helpers/network-checkout";
import {cardPerson} from "../helpers/cardholder";

afterAll(closeDatabase);
async function payment(f:Awaited<ReturnType<typeof networkCheckoutFixture>>){const started=await startNetworkCheckout(f.cookie,f.publication.id,{commandId:randomUUID(),instrumentId:"visa"});await processNetworkCheckout(f.cookie,f.publication.id,started.id);return started.id;}
async function settle(f:Awaited<ReturnType<typeof networkCheckoutFixture>>){const operations=await getMerchantOperations(f.personId,f.merchantId);return createMerchantSettlement(f.personId,f.merchantId,{commandId:randomUUID(),reviewToken:operations.depositReview!.token});}

describe("authoritative merchant statement",()=>{
 it("reconciles the same payment, settlement, pending/completed payout and failed payout without duplicate money",async()=>{
  const f=await networkCheckoutFixture(),paymentId=await payment(f),account=await getDb().transaction(tx=>getServiceMoneyAccount(tx,f.serviceId));
  const savedPayment=(await getMerchantOperations(f.personId,f.merchantId)).payments.find(row=>row.id===paymentId)!;
  await settle(f);const processor=await cardPerson("Statement payout processor");await getDb().insert(operatorServiceAccess).values({serviceId:f.serviceId,personId:processor,state:"ACCEPTED",canProcessDeposits:true});
  const first=await prepareMoneyWithdrawal(f.personId,account.id,{commandId:randomUUID(),amountMinor:"500"}),payout=await confirmMoneyWithdrawal(f.personId,account.id,first.id);
  let statement=await getMerchantStatement(f.personId,{view:`merchant:${f.serviceId}`});
  expect(merchantStatementProjectionSchema.safeParse(statement).success).toBe(true);expect(statement.totals[0]).toMatchObject({credit:{minor:"1250"},debit:{minor:"0"}});expect(statement.rows.find(row=>row.reference===payout.reference)?.status).toBe("PENDING");
  await processMoneyWithdrawal(processor,payout.id,{commandId:randomUUID(),outcome:"COMPLETED"});
  const second=await prepareMoneyWithdrawal(f.personId,account.id,{commandId:randomUUID(),amountMinor:"200"}),returned=await confirmMoneyWithdrawal(f.personId,account.id,second.id);await processMoneyWithdrawal(processor,returned.id,{commandId:randomUUID(),outcome:"FAILED"});
  const before=await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.moneyAccountId,account.id));
  statement=await getMerchantStatement(f.personId,{view:`merchant:${f.serviceId}`});expect(statement.totals[0]).toMatchObject({credit:{minor:"1250"},debit:{minor:"500"}});
  expect(statement.rows.filter(row=>row.reference===returned.reference)).toHaveLength(2);
  expect(statement.rows.filter(row=>row.reference===returned.reference).every(row=>row.credit===null&&row.debit===null&&row.status==="FAILED")).toBe(true);
  expect(statement.rows.filter(row=>row.reference===payout.reference&&row.debit).map(row=>row.debit!.minor)).toEqual(["500"]);
  expect(statement.rows.find(row=>row.reference===savedPayment.testReference&&row.credit)?.href).toContain(`payment=${paymentId}`);
  expect(statement.rows.find(row=>row.reference===payout.reference)?.href).toContain(`review=${first.id}`);
  const byReceipt=await getMerchantStatement(f.personId,{view:`merchant:${f.serviceId}`,section:"overview",q:savedPayment.testReference});
  expect(byReceipt.rows.filter(row=>row.credit)).toHaveLength(1);expect(byReceipt.rows.every(row=>row.reference===savedPayment.testReference)).toBe(true);
  const paymentLink=new URL(byReceipt.rows.find(row=>row.credit)!.href!,"https://etail.invalid");expect(paymentLink.pathname).toBe(`/merchants/${f.merchantId}`);expect(paymentLink.searchParams.get("payment")).toBe(paymentId);
  const byPayoutReceipt=await getMerchantStatement(f.personId,{view:`merchant:${f.serviceId}`,section:"overview",q:payout.reference});expect(byPayoutReceipt.rows).toHaveLength(2);expect(byPayoutReceipt.totals[0]).toMatchObject({credit:{minor:"0"},debit:{minor:"500"}});expect(byPayoutReceipt.rows.every(row=>new URL(row.href!,"https://etail.invalid").searchParams.get("review")===first.id)).toBe(true);
  expect((await getMerchantStatement(f.personId,{view:`merchant:${f.serviceId}`})).rows).toEqual(statement.rows);
  expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.moneyAccountId,account.id))).toEqual(before);
  const terminal=await getMerchantStatement(f.personId,{view:`unit:${f.merchantId}`});expect(terminal.includesAccountMovements).toBe(false);expect(terminal.rows.some(row=>row.kind==="payout")).toBe(false);
  const sibling=await createTerminal(f.personId,f.serviceId,{commandId:randomUUID(),displayName:"Separate statement terminal"});
  const siblingStatement=await getMerchantStatement(f.personId,{view:`unit:${sibling.id}`});expect(siblingStatement).toMatchObject({available:true,includesAccountMovements:false,rows:[]});expect(siblingStatement.totals[0]).toMatchObject({credit:{minor:"0"},debit:{minor:"0"}});
 });
 it.each([false,true])("debits a refund once with settled=%s and keeps terminal-only access private",async settled=>{
  const f=await networkCheckoutFixture(),paymentId=await payment(f);if(settled)await settle(f);
  const savedRefund=await refundMerchantPayment(f.personId,f.merchantId,paymentId,{commandId:randomUUID(),expectedVersion:1,reason:"Statement refund"});
  const owner=await getMerchantStatement(f.personId,{view:`merchant:${f.serviceId}`});expect(owner.totals[0]).toMatchObject({credit:{minor:"1250"},debit:{minor:"1250"}});
  expect(owner.rows.filter(row=>row.kind==="refund"&&row.debit)).toHaveLength(1);
  const byRefundReceipt=await getMerchantStatement(f.personId,{view:`merchant:${f.serviceId}`,section:"overview",q:savedRefund.refund!.testReference});
  expect(byRefundReceipt.rows).toHaveLength(1);expect(byRefundReceipt.rows[0]).toMatchObject({reference:savedRefund.refund!.testReference,kind:"refund",debit:{minor:"1250"}});
  const refundLink=new URL(byRefundReceipt.rows[0]!.href!,"https://etail.invalid");expect(refundLink.pathname).toBe(`/merchants/${f.merchantId}`);expect(refundLink.searchParams.get("payment")).toBe(paymentId);
  const sibling=await createTerminal(f.personId,f.serviceId,{commandId:randomUUID(),displayName:"No sibling refund visibility"});
  expect((await getMerchantStatement(f.personId,{view:`unit:${sibling.id}`})).rows).toEqual([]);
  const refunded=await getMerchantStatement(f.personId,{view:`merchant:${f.serviceId}`,section:"activity",activity:"payments",status:"REFUNDED"});expect(refunded.rows.filter(row=>row.credit)).toHaveLength(1);
  const recipient=await cardPerson("Statement terminal recipient"),invitation=await createMerchantInvitation(f.personId,f.merchantId,{commandId:randomUUID(),recipientId:recipient,expiresInDays:3});await acceptInvitation(recipient,invitation.id,{commandId:randomUUID(),expectedVersion:invitation.version});
  const own=await getMerchantStatement(recipient);expect(own.rows.every(row=>row.terminalId===f.merchantId)).toBe(true);expect(own.rows.some(row=>row.href?.startsWith("/money-accounts/"))).toBe(false);expect(own.includesAccountMovements).toBe(false);expect(own.totals[0]).toMatchObject({credit:{minor:"1250"},debit:{minor:"1250"}});
  const other=await networkCheckoutFixture();const denied=await getMerchantStatement(recipient,{view:`merchant:${other.serviceId}`});expect(denied).toMatchObject({available:false,rows:[],totals:[]});
  await getDb().update(serviceMembers).set({state:"REVOKED",version:2}).where(eq(serviceMembers.serviceId,f.serviceId));
  expect(await getMerchantStatement(recipient)).toMatchObject({available:false,rows:[],totals:[]});expect(await getMerchantStatement(f.personId,{view:`merchant:${f.serviceId}`})).toMatchObject({available:false,rows:[],totals:[]});
 });
});

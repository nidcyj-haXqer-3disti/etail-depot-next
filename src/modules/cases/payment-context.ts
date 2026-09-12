import { services } from "../../platform/database/schema";
import { and, eq } from "drizzle-orm";
import type { ScopedTransaction } from "../access/scope";
import { merchantTerminals } from "../acquiring/schema";
import { merchantTestPayments, merchantTestRefunds } from "../acquiring/operations-schema";
import { formatMoney } from "../workspace/service";
import type { SupportPaymentContext } from "./contracts";

/** Call only after authorizing the customer unit or the operator's service assignment. */
export async function readSupportPayment(tx:ScopedTransaction,paymentId:string,merchantId:string,serviceId:string):Promise<SupportPaymentContext|null> {
  const [payment]=await tx.select().from(merchantTestPayments).where(and(eq(merchantTestPayments.id,paymentId),eq(merchantTestPayments.merchantUnitId,merchantId),eq(merchantTestPayments.serviceId,serviceId)));
  if(!payment)return null;
  const [unit]=await tx.select().from(merchantTerminals).where(and(eq(merchantTerminals.id,merchantId),eq(merchantTerminals.merchantServiceId,serviceId)));
  if(!unit)return null;
  const [primary]=await tx.select().from(services).where(eq(services.id,serviceId));
  if(!primary)return null;
  const [refund]=await tx.select().from(merchantTestRefunds).where(and(eq(merchantTestRefunds.paymentId,paymentId),eq(merchantTestRefunds.merchantUnitId,merchantId),eq(merchantTestRefunds.serviceId,serviceId)));
  return {id:payment.id,merchantId,merchantName:unit.displayName,primaryName:primary.displayName,description:payment.description,reference:payment.testReference,amount:formatMoney(payment.amountMinor),receivedAt:payment.createdAt.toISOString(),outcome:payment.outcome,refund:refund?{reference:refund.testReference,amount:formatMoney(refund.amountMinor),completedAt:refund.createdAt.toISOString()}:null};
}

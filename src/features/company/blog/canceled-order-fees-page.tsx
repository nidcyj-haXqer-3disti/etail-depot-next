import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { canceledOrderFeesArticle } from "./canceled-order-fees-content";

export function CanceledOrderFeesPage() {
  return <BlogArticlePage article={canceledOrderFeesArticle}>
    <p>The customer cancels before dispatch. The warehouse has not packed anything. From the merchant’s point of view, the sale barely existed. Then the processing charge appears.</p>
    <p>The disagreement begins with the word “canceled.” In a store’s order system, it can mean the purchase will not be fulfilled. In the payment record, the money may already have been captured. The payment may require a void or refund, depending on its state and the provider’s supported process, even when the customer canceled within minutes.</p>
    <p>An authorization is different. It establishes approval and generally reserves available funds for a limited time. Capture submits the payment for completion. The exact status at cancellation determines which action is available. The age of the order alone does not answer that question.</p>
    <p>For Trolleys merchants, the standard processing fee applies to successful capture. An authorization or cancellation before capture does not incur that standard fee. After capture, the original processing fee is retained when the payment is refunded. Separately agreed event charges follow their own terms. The <Link href="/company/legal/fees#calculation" prefetch={false}>fee calculation</Link> makes that boundary explicit.</p>
    <p>This makes the store’s payment configuration a commercial decision. Capturing immediately can simplify fulfillment. Authorizing first and capturing later can avoid collecting money for an order that will not ship. Delayed capture also creates work: authorizations expire, capture can fail, and the integration must keep order and payment status aligned. Eligibility and timing depend on the payment method and account setup.</p>
    <p>Suppose a store repeatedly cancels orders after discovering that stock is unavailable. The fee is a visible cost of taking payment before the store knows it can fulfill the promise. Moving capture later may help, but it does not fix the stock information. It also leaves somebody responsible for collecting the payment at the right time. The merchant needs to understand why the cancellations happen before changing when money is collected.</p>
    <p>Support teams need the same distinction. “We canceled your order” and “we refunded your captured payment” describe different things to a customer watching their bank account. A clear explanation begins with the actual payment status, including whether the customer is seeing an authorization hold or a completed charge.</p>
    <p>When a canceled order leaves a fee, inspect that sequence before concluding the bill is wrong. If capture happened earlier than the business intended, there may be an integration decision worth correcting. The payment record can explain the charge and expose a process the merchant did not realize they had chosen.</p>
  </BlogArticlePage>;
}

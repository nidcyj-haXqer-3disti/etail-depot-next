import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { transactionFeeCapsArticle } from "./transaction-fee-caps-content";

export function TransactionFeeCapsPage() {
  return <BlogArticlePage article={transactionFeeCapsArticle}>
    <p>A cap sounds like certainty: however large the payment becomes, the fee will stop at a stated amount. That is useful certainty only when the merchant knows exactly which fee stops.</p>
    <p>For a hypothetical fee of 1% capped at $5, plus a separate 30-cent charge, a $1,000 payment costs $5.30. If the $5 cap instead covers the whole fee, it costs $5. These are fictional terms, not a provider quote. The difference comes from what the word “cap” modifies, not from the size of the customer’s payment.</p>

    <section id="name-the-boundary" aria-labelledby="name-the-boundary-title">
      <h2 id="name-the-boundary-title">Read the boundary as carefully as the number</h2>
    <p>This is not merely a hypothetical drafting issue. Stripe’s pricing policy distinguishes the portion of a fee to which a stated maximum applies. Square publishes different ACH cap conditions across its invoice and API or payment-link offerings. The provider name alone cannot identify the applicable ceiling.</p>
    <p>For a large invoice, the useful promise is a complete calculation for the method the customer will use, under the plan the merchant has. If the merchant approves a sale on the strength of one method’s cap but lets the customer choose a differently priced method, the expected margin can change. The cap belongs to a defined payment arrangement, not to the invoice simply because the merchant used it in the budget.</p>
    <p>Later events need their own treatment too. A return or dispute, where separately chargeable, is not automatically covered by a maximum on processing the original payment.</p>
    </section>

    <section id="certainty-with-conditions" aria-labelledby="certainty-with-conditions-title">
      <h2 id="certainty-with-conditions-title">Price certainty does not remove payment risk</h2>
    <p>A low maximum fee can make a payment method attractive without making it suitable for every sale. Consider confirmation timing, potential returns, customer convenience and fulfillment alongside the price. A limit on the provider’s processing charge is not a guarantee that the merchant will retain the payment.</p>
    <p>A Trolleys merchant should use the <Link href="/company/legal/fees" prefetch={false}>account’s accepted fee schedule</Link> for that calculation. Another product’s advertised cap cannot supply a missing limit.</p>
    <p>A cap can be valuable for a business collecting large invoices. Its value comes from knowing the limit before offering the payment option to a customer. If the rest of the bill is still unexplained, the advertised maximum is too small a piece of the decision.</p>
    </section>
  </BlogArticlePage>;
}

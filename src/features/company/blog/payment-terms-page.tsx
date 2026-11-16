import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentTermsArticle } from "./payment-terms-content";

export function PaymentTermsPage() {
  return <BlogArticlePage article={paymentTermsArticle}>
    <p>Getting the price you asked for does not settle the whole deal. If you buy materials, pay staff and finish the work before the customer pays, your business has to carry those costs in the meantime. The same price paid in advance creates a different cash position.</p>
    <p>Payment terms describe the amount or how it is calculated, when it becomes payable and how the customer will pay. The Australian Government’s business guidance treats selling on credit as a commercial choice: it can help win business, but it exposes the supplier to delayed or missing payments.</p>
    <p>That choice deserves more thought than copying the default at the bottom of an invoice. Before agreeing to a longer wait, look at when your own bills fall due. Before asking for payment upfront, consider what the customer needs to feel comfortable committing. For a longer project, agreed stage payments may give both sides a workable arrangement.</p>

    <section id="agree-when-the-clock-starts" aria-labelledby="agree-when-the-clock-starts-title">
      <h2 id="agree-when-the-clock-starts-title">Agree when the clock starts</h2>
      <p>The UK Small Business Commissioner describes a payment complaint where the invoice contained neither terms nor a due date. The customer’s finance team was waiting for confirmation of when payment was due. Once that was clarified with both parties, the invoice was settled. The missing information had become part of the delay.</p>
      <p>A payment period needs a starting event. Invoice issue, receipt of the invoice, delivery and acceptance of the work are different events. State which one applies, then show the corresponding calendar due date on the invoice. A familiar label such as net 30 is less useful when the two sides are counting from different dates.</p>
      <p>If approval starts the clock, establish what approval involves and who gives it. If the customer requires an invoice through a purchasing portal, confirm that process before work begins. The Commissioner recommends agreeing terms in advance and checking where the invoice should be sent. A well-written deadline is of limited use if the bill never reaches the people responsible for paying it.</p>
      <p>Keep the quote, agreement and invoice consistent. A payment date added at billing should not silently replace the arrangement the customer accepted. When the work or timing changes, record the agreed effect on payment too. Our article on <Link href="/company/blog/contract-invoices" prefetch={false}>contract invoices</Link> covers how to connect those changes to the eventual bill.</p>
      <p>Early payment discounts need the same precision. Specify the reduction, the charges it applies to and the deadline for qualifying. Explain whether eligibility depends on payment being initiated or received, and how partial payments are treated. Agreeing a discount is easy; interpreting an unexplained deduction after the deadline is harder.</p>
      <p>Look at the tradeoff before offering it. You are accepting less for the sale in exchange for earlier payment. Compare that reduction with the value of having the money sooner and the margin available on the work. Faster collection alone does not tell you whether the discount was a good decision.</p>
    </section>

    <section id="make-the-system-follow-the-agreement" aria-labelledby="make-the-system-follow-the-agreement-title">
      <h2 id="make-the-system-follow-the-agreement-title">Make the system follow the agreement</h2>
      <p>Payment timing and payment method are separate choices. A bill can be due after delivery and payable by card or bank transfer. State the currency and supported methods clearly, along with any required payment reference. Do not leave the customer to guess which account or invoice the payment should settle.</p>
      <p>Then compare the written terms with your billing settings. Stripe, for example, lets a business set a default payment period after sending an invoice and manage accepted methods. A default measured from sending may not match a contract measured from acceptance of the work. Check the actual due date before the invoice leaves.</p>
      <p>Automatic collection requires its own permission. Agreeing to monthly invoices does not by itself authorize a business to charge a saved card. Stripe’s requirements for future charges include customer consent, the expected timing and frequency, how the amount is determined and a cancellation policy for subscriptions. It also requires retaining the written agreement. Follow the requirements of the provider and payment method you actually use.</p>
      <p>For an ongoing service, make changes usable by the people running billing. They need to know when a revised price starts, what period the final charge covers and how cancellation affects future collection. Our article on <Link href="/company/blog/set-up-recurring-invoices" prefetch={false}>recurring invoices</Link> explains why correcting one bill can leave the next scheduled bill wrong.</p>
      <p>Give customers a clear contact for billing questions. Have provisions for late fees, interest, cancellation and refunds reviewed for the business and customers concerned; a clause copied from another country or business is not a reliable starting point. Clear writing helps people understand an arrangement, but does not establish that every provision is permitted.</p>
      <p>Read the finished terms as the person who must pay, then as the colleague who must collect. Both should be able to identify the amount, the date, the method and what happens when the arrangement changes. That is when payment terms begin doing useful work for the deal you have made.</p>
    </section>
  </BlogArticlePage>;
}

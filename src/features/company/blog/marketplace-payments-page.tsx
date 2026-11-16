import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { marketplacePaymentsArticle } from "./marketplace-payments-content";

export function MarketplacePaymentsPage() {
  return <BlogArticlePage article={marketplacePaymentsArticle}>
    <p>Consider an ordinary marketplace order: two items from two independent sellers, bought together. One item arrives as promised. The other is returned after its seller has already been paid.</p>
    <p>The buyer expects a refund for that item. The first seller expects their earnings to stay untouched. The marketplace needs to know which records and balances should change, including any commission it collected.</p>
    <p>That is a useful way to evaluate embedded payments. A checkout demonstration shows whether a customer can pay. This ordinary return shows whether the commercial arrangement, account structure and software agree about what happens next.</p>
    <p>For businesses considering <Link href="/use-cases/software-platforms/partnerships" prefetch={false}>Trolleys, an Etail Depot service</Link>, the starting point is the proposed merchant relationship and movement of funds. Multiple sellers, commissions and split payments need a specifically approved structure. A payment form alone does not establish it.</p>

    <section id="who-made-the-sale" aria-labelledby="who-made-the-sale-title">
      <h2 id="who-made-the-sale-title">Who did the customer buy from?</h2>
      <p>“Marketplace” describes a customer experience, but it can also have a specific meaning in payment network rules. Those meanings should not be assumed to match. A website that brings several businesses together still needs an agreed payment model.</p>
      <p>Visa’s classification considers the actual selling relationship, how the business identifies itself and who provides recourse when something goes wrong. Its rules also consider factors such as receipts, ownership of goods and responsibility for returns. Calling yourself a platform does not settle that classification.</p>
      <p>Establish the merchant of record, meaning the business responsible for the transaction toward the customer, with your provider before choosing the technical payment flow. Stripe’s documentation makes this sequence explicit: the commercial arrangement determines the appropriate role; a preferred payment configuration should not determine the business relationship.</p>
      <p>Then make the purchase understandable. The seller information, terms, receipt and statement description should fit the approved arrangement. Customers need to recognize the charge and know where to bring a delivery or refund question. They should not have to reconstruct your company structure to get help.</p>
      <p>Also distinguish independent sellers from additional stores owned by one company. A second DBA or merchant ID under the same LLC is not a substitute for establishing an account relationship for another business. Putting both in one dashboard does not make them the same legal seller.</p>
    </section>

    <section id="the-refund-after-the-payout" aria-labelledby="the-refund-after-the-payout-title">
      <h2 id="the-refund-after-the-payout-title">The return arrives after the payout</h2>
      <p>Go back to the returned item. Your support team can approve the return while the payment team still has several separate actions to complete. Someone must issue the customer’s refund, account for the seller’s share and apply the agreed treatment of the platform’s fee.</p>
      <p>The mechanics depend on the provider and payment model. In Stripe’s separate charges and transfers model, for example, refunding the customer’s charge does not automatically reverse the associated seller transfers. Its documentation treats recovery from the seller as another action. That is a concrete reason to test the full return of money, rather than stopping when the customer refund succeeds.</p>
      <p>Ask which account funds the refund first and what happens if the seller has no available balance. A seller’s contractual obligation to repay the platform and the platform’s ability to recover that money immediately are different things. The agreement must allocate that exposure; the software must show what remains outstanding.</p>
      <p>The order record should let staff follow the item, seller, payment, allocation and refund together. Keep an adjustment to one seller distinct from another seller’s earnings. If the platform keeps or returns its commission, the seller should be able to see that treatment in the statement.</p>
      <p>A dispute adds another participant: the card issuer. Decide who receives the notice, obtains fulfillment evidence and submits the response within the applicable deadline. Do not let a seller’s departure from the marketplace leave an open customer claim without an owner.</p>
    </section>

    <section id="a-listing-is-not-payment-readiness" aria-labelledby="a-listing-is-not-payment-readiness-title">
      <h2 id="a-listing-is-not-payment-readiness-title">A seller can be visible before they are ready</h2>
      <p>Creating a marketplace profile, completing account verification, accepting payments and receiving payouts are separate milestones. A single “active” label can hide which one has actually been reached.</p>
      <p>Adyen’s marketplace documentation illustrates this distinction through account capabilities. Verification determines which activities a user may perform, and later information changes or periodic reviews can affect those permissions. That is provider-specific behavior, not a promise about every marketplace program.</p>
      <p>Build the seller experience around the status supplied by the chosen provider. Explain the outstanding requirement, where to resolve it and how it affects new orders or existing funds. A request for more information is not, by itself, evidence that every payment activity has stopped.</p>
      <p>When a seller asks about missing money, support needs the relevant order and payment references, the current payout status and an escalation contact. Avoid promising a release date that the account team has not confirmed. An honest explanation with a clear next action is more useful than an unexplained “pending” badge.</p>
    </section>

    <section id="a-partnership-that-fits-the-marketplace" aria-labelledby="a-partnership-that-fits-the-marketplace-title">
      <h2 id="a-partnership-that-fits-the-marketplace-title">Bring the difficult order to the partnership discussion</h2>
      <p>Trolleys’ <Link href="/use-cases/software-platforms/payment-models" prefetch={false}>platform payment models</Link> begin with who sells and who receives payment. Each merchant account is reviewed for its business activity. The agreement defines supported flows, integration permissions, pricing and responsibility for account support. Holding or distributing customer funds and revenue sharing require their own approved terms.</p>
      <p>Bring a representative order to the <Link href="/company/contact#platforms" prefetch={false}>platform partnership conversation</Link>, including a partial return, a seller whose account needs attention and a dispute after payout. Explain your seller locations, products and delivery times. Review the supported countries, payment methods and account arrangements before promising them to users.</p>
      <p>The commercial opportunity is easier to evaluate when those details are visible. Compare the work saved for merchants and the value to your platform with implementation, processing, support and any agreed loss exposure. A commission percentage by itself cannot tell you whether the service works for your business.</p>
    </section>

    <p>A strong marketplace makes an ordinary problem manageable. The buyer receives a clear answer, each seller can understand their money and your team can trace the result. That is the experience worth embedding.</p>
  </BlogArticlePage>;
}

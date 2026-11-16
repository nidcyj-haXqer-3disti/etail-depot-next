import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { merchantAccountsArticle } from "./merchant-accounts-content";

export function MerchantAccountsPage() {
  return <BlogArticlePage article={merchantAccountsArticle}>
    <p>The company whose name appears on your checkout page may provide the software, the merchant service or both. That name alone does not explain who handles acquiring, which account receives settlement or which agreement controls your payouts.</p>
    <section id="account-arrangement" aria-labelledby="account-arrangement-title">
      <h2 id="account-arrangement-title">Start with the account arrangement</h2>
      <p>A <strong>merchant account</strong> is part of the arrangement that allows your business to accept card payments. A <strong>business bank account</strong> is the account you nominate to receive payouts and use for your business banking. They serve different purposes.</p>
      <p>You may contract directly with an acquirer or receive payment services through a payment facilitator. Under the latter model, your business is often called a <strong>sponsored merchant</strong> or <strong>submerchant</strong>. The acquiring relationship still exists behind the service.</p>
      <p>Neither label alone establishes your price, approval conditions or payout schedule. Read the agreement that applies to your business rather than relying on a general description of the model. Trolleys, an Etail Depot service, operates as a payment facilitator through its acquiring relationships. Its <Link href="/services/payment-facilitator" prefetch={false}>service model</Link> explains that role; Etail is not a bank or card issuer.</p>
    </section>
    <section id="who-does-what" aria-labelledby="who-does-what-title">
      <h2 id="who-does-what-title">Know who does what</h2>
      <ul>
        <li><strong>Acquirer:</strong> The financial institution on the merchant side of card acceptance. It connects the acquiring arrangement to the card networks.</li>
        <li><strong>Payment facilitator:</strong> A provider working with an acquirer to serve sponsored merchants. Its responsibilities can include onboarding, payment services, monitoring and support under the applicable agreements.</li>
        <li><strong>Processor and gateway:</strong> The processor handles transaction messages. The gateway connects your checkout to payment processing and returns results. These services must work with your acquiring arrangement.</li>
        <li><strong>Issuer:</strong> The financial institution that provides the customer’s card and makes the approval or decline decision for a typical card authorization.</li>
      </ul>
      <p>Your service may combine several of these functions, or different companies may provide them. Ask your provider who handles each part and where you should go for account support. For the transaction stages themselves, see <Link href="/company/blog/payment-processing-systems" prefetch={false}>how credit card processing works</Link>.</p>
    </section>
    <section id="before-applying" aria-labelledby="before-applying-title">
      <h2 id="before-applying-title">The account needs to fit the sale</h2>
      <p>Consider a seller that delivers immediately and another that takes orders months before delivery. Their websites may look similar, yet their exposure to cancellations and delayed fulfillment differs. Give prospective providers an accurate description of what you sell, how customers pay and when you deliver.</p>
      <p>Averages can hide that difference. An occasional large advance order still matters even when most sales are small and delivered quickly. Explain those exceptions, subscriptions and seasonal peaks alongside representative processing figures. Identify forecasts as estimates and provide business, ownership and bank records through the provider’s application process.</p>
      <p>The <Link href="/company/blog/get-a-merchant-account" prefetch={false}>merchant account application article</Link> explains monthly volume, average ticket and highest-order figures. Trolleys’ <Link href="/resources/merchant-account-setup" prefetch={false}>account setup guide</Link> covers the application fields. The purpose of those records is to help the provider review the business you actually operate.</p>
    </section>
    <section id="check-the-agreement" aria-labelledby="check-the-agreement-title">
      <h2 id="check-the-agreement-title">Put the terms in writing</h2>
      <p>Keep the account agreement, fee schedule and bank verification together. They answer different questions; a competitive processing rate does not override a funding restriction. Before accepting an offer, confirm:</p>
      <ul>
        <li><strong>Who you contract with:</strong> The legal entity providing the service and the acquirer behind the arrangement.</li>
        <li><strong>What you will pay:</strong> Processing charges, recurring fees, additional services, refunds, disputes and any termination charges.</li>
        <li><strong>When funds are available:</strong> The payout schedule, processing cutoffs and circumstances that can lead to a reserve or hold.</li>
        <li><strong>Who provides support:</strong> Where to report missing funds, update business details and respond to disputes.</li>
        <li><strong>What happens when you leave:</strong> How to retrieve records and handle outstanding payouts, refunds or disputes after closure.</li>
      </ul>
      <p>For Trolleys merchants, review the current <Link href="/pricing" prefetch={false}>pricing and additional fees</Link> alongside your accepted account documents. Approval and account conditions depend on the review of your business.</p>
    </section>
    <section id="after-approval" aria-labelledby="after-approval-title">
      <h2 id="after-approval-title">Connect the approved account</h2>
      <p>Account approval does not by itself connect a website checkout. Confirm the store, approved payment methods and gateway configuration before accepting payments.</p>
      <p>With Trolleys, the <strong>Back Office Operations Portal</strong> provides merchant account activity and funding records. The <strong>Cybersource Business Center</strong> provides gateway settings and transaction records for the relevant account. Use the account mapping in your welcome information: a merchant ID, gateway organization ID and user login are different identifiers.</p>
      <p>If you operate several stores or DBAs, check which merchant account and gateway belong to each one. A DBA is a trading name, not automatically a separate legal company. An additional merchant account needs the applicable setup and approval; adding a name to a website does not create it.</p>
      <p>Once access is ready, follow the <Link href="/developers/getting-started" prefetch={false}>steps after merchant account approval</Link> for your connection. Check a complete payment journey in the approved test environment before arranging any separately authorized live validation.</p>
    </section>
    <section id="follow-your-funds" aria-labelledby="follow-your-funds-title">
      <h2 id="follow-your-funds-title">Follow your funds</h2>
      <p>A successful card authorization does not mean a bank deposit has arrived. Check whether the payment was captured, then which funding record includes it. Several sales, fees, refunds or other adjustments may contribute to one payout.</p>
      <p>Compare merchant and gateway records for the same account, reporting period, currency and transaction status. Follow the payout separately using its reference and amount. If the expected bank credit is missing, those details give support a useful starting point. Asking the customer to pay again would not resolve a funding question.</p>
      <p>Keep the account terms and support route accessible to the person who checks daily activity. Trolleys’ <Link href="/services/reconciliation" prefetch={false}>reconciliation</Link> and <Link href="/services/payouts" prefetch={false}>payout</Link> pages explain the two workflows.</p>
    </section>
  </BlogArticlePage>;
}

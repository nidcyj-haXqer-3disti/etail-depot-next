import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { gatewayProcessorArticle } from "./gateway-processor-content";

export function GatewayProcessorPage() {
  return <BlogArticlePage article={gatewayProcessorArticle}>
    <p>Your website developer asks which gateway you use. Your bookkeeper asks where yesterday’s money is. Both questions concern the same sales, but the answers come from different parts of your payment service.</p>
    <p>A payment gateway connects your checkout to processing. It receives the payment request and passes it onward. A payment processor handles transaction messages within the acquiring and card network arrangements. Those jobs work together. Buying one does not necessarily give your business everything it needs to accept cards.</p>
    <p>For a merchant, the useful distinction is who can help connect the store, locate a payment and explain what happens to the money. That is the context in which we provide <Link href="/services/merchant-services" prefetch={false}>Trolleys, an Etail Depot service</Link>: account setup, payment acceptance and support for the activity that follows.</p>

    <section id="connection-and-account" aria-labelledby="connection-and-account-title">
      <h2 id="connection-and-account-title">A checkout connection is part of a larger relationship</h2>
      <p>The gateway is the part your web team connects to. It is not the same thing as the customer’s bank, and it is not your business checking account. A request can travel through it successfully without the customer’s payment being approved.</p>
      <p>The acquiring arrangement supports your business’s card acceptance. The card network connects the acquiring and issuing sides; the issuer provides the customer’s card account. A processor performs processing work within that arrangement. Compatibility matters: a gateway connection must work with the processing and acquiring setup approved for your business.</p>
      <p>These functions may be offered together or through several providers. One company name on a proposal does not mean one company performs every role. Equally, several systems behind a service do not mean the merchant needs to negotiate a separate connection with each of them.</p>
      <p>Trolleys’ <Link href="/services/payment-facilitator" prefetch={false}>payment facilitator model</Link> brings merchant onboarding, payment acceptance and account support together through its acquiring relationships. Cybersource provides the gateway connection used in our integration guides. Etail is not the bank that issued your customer’s card, and a gateway login does not replace approval of your merchant account.</p>
    </section>

    <section id="two-views-of-the-sale" aria-labelledby="two-views-of-the-sale-title">
      <h2 id="two-views-of-the-sale-title">Why Trolleys gives you two views of the sale</h2>
      <p>After approval, your welcome details connect the store name or DBA, its merchant ID and its gateway account. Keep that association. If you run more than one store, a correct transaction reference in the wrong account can still lead to an apparently missing payment.</p>
      <p>The Back Office Operations Portal gives you a view across your merchant accounts. Use it to follow daily activity, funding records, account maintenance and disputes. The Cybersource Business Center is the gateway view for the selected store, including transaction details and payment configuration. Our <Link href="/developers/getting-started#portal-access" prefetch={false}>approved-account setup guidance</Link> explains which access belongs to each.</p>
      <p>These portals serve different purposes. You do not need to build a Back Office Operations Portal API connection for the standard merchant setup. Your website connects to the payment gateway through the integration appropriate to your store, while your team uses the operations portal to manage its accounts.</p>
      <p>When reports appear to disagree, start by matching the store, reporting period, currency and payment references. A gateway report and a merchant account report can describe different stages or selections of activity. Trolleys’ <Link href="/services/reconciliation" prefetch={false}>reconciliation service</Link> focuses on understanding those differences. The bank statement is a further record to check when confirming a deposit.</p>
    </section>

    <section id="when-a-payment-needs-attention" aria-labelledby="when-a-payment-needs-attention-title">
      <h2 id="when-a-payment-needs-attention-title">An approval does not answer every money question</h2>
      <p>If checkout shows an approved card payment but you cannot find the money, first establish what was approved. An authorization and a capture are different events. Confirm whether the authorized payment was submitted for capture before treating it as a missing payout.</p>
      <p>Once processing records establish the payment activity, follow the payout calculation and its status. Fees, refunds, reserves and other adjustments can affect the amount. Your account’s schedule and bank processing affect when it arrives. Etail’s <Link href="/services/payouts" prefetch={false}>payout guidance</Link> follows that path through to the receiving bank. An authorization response alone cannot confirm a bank deposit.</p>
      <p>A problem before the payment reaches the gateway needs a different investigation: the website, connection and request may need your web team’s attention. A recorded payment with an unclear outcome needs the existing transaction traced. Starting checkout again does not resolve either question and can create another payment attempt.</p>
      <p>For Trolleys account or payment questions, bring the store name, relevant references, amount, currency and time to <Link href="/company/contact#account-support" prefetch={false}>account support</Link>. For a website connection problem, include the error details without passwords, API secrets or full card information. That gives the investigation a starting point beyond “the gateway is not working.”</p>
    </section>

    <p>When you compare payment services, ask the provider to walk through your actual store setup and one payment that needs attention. Who helps connect checkout? Which records explain the sale? Where do you go for a funding question? Review the account terms alongside the technical connection, including fees, payout conditions and the support available to your business.</p>
    <p>The gateway and processor distinction should make your choice clearer. A business needs a working connection and a merchant service it can understand when the sale moves beyond the Pay button.</p>
  </BlogArticlePage>;
}

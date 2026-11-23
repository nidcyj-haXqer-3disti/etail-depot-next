import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { shopifyRenewalFitArticle } from "./shopify-renewal-fit-content";

export function ShopifyRenewalFitPage() {
  return <BlogArticlePage article={shopifyRenewalFitArticle}>
    <p>A customer completes checkout and the first subscription order appears. The merchant has evidence that the initial purchase worked. It still needs evidence that the next permitted payment can happen without sending the customer through the same checkout again.</p>
    <p>That difference can decide whether a payment provider fits a subscription business at all.</p>

    <section id="a-specific-compatibility-question" aria-labelledby="a-specific-compatibility-question-title">
      <h2 id="a-specific-compatibility-question-title">Ask about the complete Shopify arrangement</h2>
    <p>Shopify maintains a specific list of supported gateways for subscription products, with conditions by provider and region. It is not the same as the list of gateways that can accept an ordinary Shopify order. The subscription app and payment method also need to support the intended recurring arrangement.</p>
    <p>Cybersource is not on Shopify’s current published subscription-gateway list. Merchants should therefore not treat Trolleys’ general recurring-payment capability or its Cybersource Shopify connection as confirmation that Shopify subscription products are supported. Obtain current, explicit confirmation for the proposed setup before committing to it.</p>
    <p>This is a product boundary, not a judgment about the quality of the gateway. A service can be suitable for ordinary orders while lacking the specific compatibility a subscription store needs.</p>
    </section>

    <section id="the-renewal-and-the-exit" aria-labelledby="the-renewal-and-the-exit-title">
      <h2 id="the-renewal-and-the-exit-title">Test the lifecycle that produces the recurring revenue</h2>
    <p>For a supported arrangement, a successful renewal still leaves the difficult branches to examine. A failed payment needs a defined response, a permitted payment-method update must reach the right arrangement, and a cancellation needs to be reflected in what happens next. Test those events and the related records through the provider’s approved process. Confirm the customer’s authorization and the app’s behavior when an action cannot be completed. The team needs to explain the resulting subscription state, not merely show that a card was charged once.</p>
    <p>Existing subscribers introduce another question: whether their saved payment arrangements can move through a supported migration process. Do not assume installing a new app transfers permission or credentials, and do not collect raw card information to improvise the move. Establish what the providers support and whether customers need to take action.</p>
    <p>Our <Link href="/resources/shopify-gateway-integration" prefetch={false}>Shopify connection guide</Link> explains the account connection. A subscription business needs the additional compatibility decision before that connection becomes its plan for recurring sales.</p>
    <p>A provider comparison for subscriptions should begin with renewal feasibility, then evaluate costs and operations. A lower rate on the first payment is of little use if the store has no supported way to collect the second.</p>
    </section>
  </BlogArticlePage>;
}

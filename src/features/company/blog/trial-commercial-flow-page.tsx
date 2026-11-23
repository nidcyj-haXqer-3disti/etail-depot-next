import { BlogArticlePage } from "./article-page";
import { trialCommercialFlowArticle } from "./trial-commercial-flow-content";

export function TrialCommercialFlowPage() {
  return <BlogArticlePage article={trialCommercialFlowArticle}>
    <p>The landing page leads with free. The application calls the product a subscription. The billing system is configured to charge automatically after the trial.</p>
    <p>All three can describe the same offer, but they leave different impressions if nobody explains the connection.</p>
    <p>For a merchant review, follow the customer through that connection. The first charge should be understandable before it happens, including when the customer can decide not to continue.</p>

    <section id="first-bill" aria-labelledby="first-bill-title">
      <h2 id="first-bill-title">Describe the bill the customer is agreeing to.</h2>
    <p>State the trial period, what the customer receives during it, the subsequent amount and billing interval, and any condition that changes the price. If the amount varies, explain how it is calculated and what the customer sees before agreeing.</p>
    <p>Show the point at which the customer accepts the arrangement. Collecting a card is not a complete explanation of permission to charge it. Preserve the applicable terms and the customer’s agreement through the supported process.</p>
    <p>Consider a fictional trial that converts to a $180 annual plan, advertised at the equivalent of $15 a month. The first paid bill is $180. A customer who remembers only the monthly figure may expect a very different charge. The offer needs to make the amount collected and the period it buys clear together. These are illustrative prices, not Trolleys pricing. For the reviewer, the annual bill also means a year of service remains to be delivered after payment.</p>
    </section>

    <section id="cancellation" aria-labelledby="cancellation-title">
      <h2 id="cancellation-title">Try the cancellation journey the way a customer would.</h2>
    <p>Explain where a customer requests cancellation, when it takes effect and what happens to access, future charges and any amount already paid. Cancellation of future billing and a refund for an earlier payment are different decisions.</p>
    <p>The real test happens between the cancellation screen and the next bill. A customer who has completed the required cancellation may still be charged if the instruction never reaches billing. A reassuring message cannot compensate for that broken handoff.</p>
    <p>Support needs enough history to distinguish a valid final bill from a charge that should have stopped. The cancellation request, its effective date and the billing result answer that question together. A screenshot of the confirmation page alone does not.</p>
    </section>

    <section id="approved-offer" aria-labelledby="approved-offer-title">
      <h2 id="approved-offer-title">Discuss the actual subscription model before launch.</h2>
    <p>Trolleys’ acceptable-use terms include subscriptions, automatic renewals and free trials that convert to paid services among activities requiring specific written approval. Confirm the arrangement for the account before introducing the offer. Recurring-payment functionality alone does not approve every commercial model.</p>
    <p>Trolleys also requires clear customer disclosures and evidence of the agreed recurring arrangement. Confirm the legal and card-network requirements that apply to your offer.</p>
    <p>For the review, present the real enrollment and exit journey together. A trial may be the easiest way for a customer to discover a product. Clear terms and a functioning cancellation process are what allow that discovery to remain a voluntary purchase.</p>
    </section>
  </BlogArticlePage>;
}

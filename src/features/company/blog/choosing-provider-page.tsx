import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { choosingProviderArticle } from "./choosing-provider-content";
import s from "./blog.module.css";

const costQuestions = [
  ["Processing", "What percentage and fixed charges apply? Are any fees charged for an authorization or an unsuccessful attempt?"],
  ["Ongoing services", "Which account, gateway, platform or optional service charges apply, and are there minimums?"],
  ["International payments", "Do international cards, currency conversion or the payout currency change the cost?"],
  ["Refunds and disputes", "Are original processing fees returned? What refund, dispute or response fees can apply?"],
  ["Setup and exit", "Are there integration, equipment, lease, cancellation or data migration costs? Which are separate agreements?"],
] as const;

export function ChoosingProviderPage() {
  return <BlogArticlePage article={choosingProviderArticle}>
    <p>A low processing quote can be attractive until your team needs a refund, a missing payment or a delayed payout explained. Those ordinary tasks are part of the service you are buying. Choose a provider by asking it to work through the orders and questions your business actually handles.</p>
    <section id="business-needs" aria-labelledby="business-needs-title">
      <h2 id="business-needs-title">Start with how your business works</h2>
      <p>Give each prospective provider the same description of what you sell, where customers are located and how long delivery takes. Include expected monthly payment volume, typical order size and the largest payment you reasonably expect. Use representative records, or clearly identified estimates for a new business.</p>
      <p>List the payment methods, store platform and billing features you need now. If you take subscriptions, advance orders or payments across several stores, explain that before comparing offers. A feature advertised by a provider may still require approval or separate setup for your account.</p>
      <p>Separate essential requirements from future preferences. Replace “works with our store” with a task someone can demonstrate, such as completing an order and issuing a partial refund from the original transaction.</p>
      <p>Visa recommends confirming that the acquirer understands the business and is identified in the contract. Ask who provides the merchant service, gateway and acquiring relationship. Our <Link href="/company/blog/merchant-accounts-and-acquiring" prefetch={false}>merchant accounts and acquiring article</Link> explains those roles.</p>
    </section>
    <section id="compare-costs" aria-labelledby="compare-costs-title">
      <h2 id="compare-costs-title">Compare the full cost</h2>
      <p>Ask each provider to price the same representative period, using both the sales value and number of transactions. A lower percentage can still cost more when fixed charges or other fees are higher. Do not compare quotes that assume different payment activity.</p>
      <table className={s.comparison}>
        <caption>Questions to put beside each written quote</caption>
        <thead><tr><th scope="col">Cost area</th><th scope="col">What to confirm</th></tr></thead>
        <tbody>{costQuestions.map(([area, question]) => <tr key={area}>
          <th scope="row">{area}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to confirm</span>{question}</td>
        </tr>)}</tbody>
      </table>
      <p>Separate expected recurring costs from occasional events such as disputes. Ask which charges are deducted from payouts and which are billed separately, so the comparison does not count a fee twice.</p>
      <p>A refund does not necessarily return the original processing charge. Stripe, for example, states that original processing and currency conversion fees are not returned under its standard pricing. Check the policy in each offer rather than applying one provider’s terms to another.</p>
      <p>For merchants using Trolleys, an Etail Depot service, compare the current <Link href="/pricing" prefetch={false}>pricing and additional fees</Link> with the terms offered to your business. Keep the written quote and any separate agreements together.</p>
    </section>
    <section id="funding-and-terms" aria-labelledby="funding-and-terms-title">
      <h2 id="funding-and-terms-title">Read the funding and contract terms</h2>
      <p>A payout schedule describes when money is sent. It does not, by itself, tell you when a new sale becomes available for payout or when your bank will credit it. Stripe explicitly distinguishes these stages; use the definitions and schedule that apply to the account you are considering.</p>
      <p>Ask when the timing starts, which cutoff and time zone apply, and whether the first payout differs from later payouts. Confirm how holidays, verification requirements and account restrictions affect the expected arrival.</p>
      <p>Keep reserves separate from fees. Ask when funds may be withheld, how the amount is calculated, who makes the decision and what review or release conditions apply. Etail’s <Link href="/company/legal/payouts-and-reserves" prefetch={false}>payouts and reserves terms</Link> explain its account framework; your accepted documents and any applicable notice establish the arrangement for your business.</p>
      <p>Before signing, read the contract length, renewal rules, cancellation process and remaining obligations. Check any equipment lease or other separate agreement too. A statement about cancelling the processing service may not describe every contract you are accepting.</p>
    </section>
    <section id="verify-service" aria-labelledby="verify-service-title">
      <h2 id="verify-service-title">Ask for a working demonstration</h2>
      <p>Use a provider demonstration or approved test environment to check the work your team will actually do. Confirm the supported integration, version, implementation owner and any additional setup cost.</p>
      <ol>
        <li><strong>Complete an order.</strong> Follow the phone and desktop checkout. Check that the correct order and payment result appear once, including when the customer cancels or a payment is declined.</li>
        <li><strong>Find and refund a payment.</strong> Locate the original transaction, check its status and demonstrate the supported full or partial refund workflow.</li>
        <li><strong>Read the records.</strong> Find transaction references, fees and funding activity. Ask for sample reports with customer information removed and confirm that staff can export the records they need.</li>
        <li><strong>Reach the right support team.</strong> Establish who handles checkout errors, account reviews, missing payouts and disputes. Confirm contact channels, hours and how an unresolved issue is escalated.</li>
      </ol>
      <p>Security responsibilities also need a clear owner. PCI SSC says outsourcing processing does not remove a merchant’s responsibility for protecting payment data. Confirm the provider’s compliance for the service, document shared responsibilities and ask your acquirer or compliance contact which validation applies to your checkout.</p>
      <p>For Trolleys merchants, merchant activity and funding records are available through the Back Office Operations Portal. Gateway settings and transaction records are in the store’s Cybersource Business Center. Review how those records support <Link href="/services/reconciliation" prefetch={false}>reconciliation</Link> and how <Link href="/services/payouts" prefetch={false}>payouts</Link> are followed separately.</p>
    </section>
    <section id="choose-and-launch" aria-labelledby="choose-and-launch-title">
      <h2 id="choose-and-launch-title">Choose, then verify the launch</h2>
      <p>Mark each essential requirement as confirmed, not supported or still unanswered. Keep the written evidence beside it. An attractive feature should not compensate for a missing payment method or an unsupported business activity.</p>
      <p>If you are changing providers, agree how saved payment methods and records can be transferred securely. Tokens and subscription arrangements do not move automatically. Existing refunds, disputes and held funds remain subject to the previous provider’s terms. See <Link href="/use-cases/switch-merchant-services" prefetch={false}>what to check before switching merchant services</Link>.</p>
      <p>Approval and a working checkout are separate milestones. Follow the <Link href="/resources/merchant-account-setup" prefetch={false}>account setup guide</Link>, then confirm the supported connection and testing plan. Keep the old setup available as needed for unresolved activity and an agreed transition.</p>
      <p>After launch, compare the first statements, payout records and support experience with the offer you accepted. Record any difference and ask for an explanation. The right provider is one whose confirmed service fits your business and whose day to day operation matches its commitments.</p>
    </section>
  </BlogArticlePage>;
}

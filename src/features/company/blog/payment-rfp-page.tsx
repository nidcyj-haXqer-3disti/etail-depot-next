import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentRfpArticle } from "./payment-rfp-content";
import s from "./blog.module.css";

const responseFields = [
  ["Availability", "Is this available for our business, account and integration today?", "Any approval, configuration or separate service required."],
  ["Evidence", "Can you show the relevant documentation, report or working flow?", "A dated reference or demonstration tied to the requirement."],
  ["Work and cost", "Who implements and maintains it, and what charges apply?", "Provider tasks, merchant tasks, dependencies and fees."],
  ["Acceptance", "How will we check that it works for our orders?", "A defined test, expected result and responsible reviewer."],
] as const;

export function PaymentRfpPage() {
  return <BlogArticlePage article={paymentRfpArticle}>
    <p>Two payment proposals can both promise “advanced reporting” and still leave your finance team with different amounts of work. A request for proposal, or RFP, turns that promise into a question each bidder must answer: can we follow one sale, its later refund and the resulting account records? A shared brief gives your commercial, technical and finance teams a way to compare the answers.</p>
    <section id="define-the-decision" aria-labelledby="define-the-decision-title">
      <h2 id="define-the-decision-title">Start with the decision you need to make</h2>
      <p>Describe your legal entities, products or services, sales channels, countries, currencies and payment methods. Include typical order values, processing volume, seasonal peaks and your current systems. Distinguish measured activity from forecasts so providers know what their proposals should assume.</p>
      <p>Separate what must work at launch from possible future needs. If subscriptions, multiple merchant accounts or a particular store integration are essential, say so directly. Stripe’s RFP guide treats the business model and integration experience as separate areas to investigate; a general feature list cannot answer both.</p>
      <p>Name the people who will review commercial terms, implementation, finance operations, support and security. Agree which requirements would rule out a provider before assigning scores to preferences.</p>
      <p>Give every bidder the same brief, response deadline and process for questions. For a straightforward merchant account, a shorter <Link href="/company/blog/choose-a-merchant-services-provider" prefetch={false}>provider comparison</Link> may be enough. Use an RFP when several teams or dependencies make a more structured decision useful.</p>
    </section>
    <section id="compare-provider-answers" aria-labelledby="compare-provider-answers-title">
      <h2 id="compare-provider-answers-title">Give every provider the same response format</h2>
      <p>Write each requirement as something your team needs to accomplish. “Our finance team can trace a refund to the original payment” is more useful than “advanced reporting.” Then ask providers to complete these four fields:</p>
      <table className={s.comparison}>
        <caption>A response format for each requirement</caption>
        <thead><tr><th scope="col">Field</th><th scope="col">Question</th><th scope="col">What to record</th></tr></thead>
        <tbody>{responseFields.map(([field, question, record]) => <tr key={field}>
          <th scope="row">{field}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Question</span>{question}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to record</span>{record}</td>
        </tr>)}</tbody>
      </table>
      <p>Keep available, conditional, planned and unsupported capabilities distinct. A future release can inform your plans, but it does not satisfy a launch requirement today.</p>
      <p>Ask providers to explain their performance claims using the same definitions and transaction mix. Adyen notes that authorization results vary by business and that gross and net rates can treat retries differently. A headline percentage is not a reliable comparison without knowing what was counted.</p>
      <p>Keep the questionnaire focused. One clear answer with supporting evidence is more useful than several pages of product descriptions that leave the requirement unresolved.</p>
    </section>
    <section id="test-reporting-promise" aria-labelledby="test-reporting-promise-title">
      <h2 id="test-reporting-promise-title">Turn a reporting promise into a demonstration</h2>
      <p>Ask each shortlisted provider to demonstrate the same scenario using test data: a completed payment followed by a partial refund in a later reporting period. This checks whether the records answer a real operating question without requiring a live charge.</p>
      <ol>
        <li><strong>Find the payment.</strong> Start with your order reference and identify the correct merchant account, payment operation, amount and currency.</li>
        <li><strong>Follow the refund.</strong> Show its status and reference, its link to the original payment and the amount still available to refund.</li>
        <li><strong>Explain the reporting periods.</strong> Locate the sale, refund and applicable fees in the relevant reports. Show how the later adjustment is recognized without counting the sale twice.</li>
        <li><strong>Resolve a difference.</strong> Show how your team would investigate a mismatch, export the supporting records and get help if it remained unresolved.</li>
      </ol>
      <p>Stripe’s RFP guidance asks about transaction identifiers, fees, reporting availability and reconciliation. Use those questions to test the records you would actually receive, rather than an unrelated product demonstration.</p>
      <p>For a Trolleys account, <Link href="/services/reconciliation" prefetch={false}>reconciliation</Link> includes comparing merchant account and gateway records. Checking the resulting deposit against your bank is a separate task. Ask which report supports each step and which team owns any difference.</p>
    </section>
    <section id="review-complete-offer" aria-labelledby="review-complete-offer-title">
      <h2 id="review-complete-offer-title">Review the cost and the work behind it</h2>
      <p>Use the same transaction mix and review period for every cost estimate. Request applicable setup, integration, account, transaction, refund, dispute, currency and optional service charges. Separate fixed commitments from variable estimates and ask what changes with volume or renewal.</p>
      <p>Check funding terms alongside fees. A lower processing rate does not answer when funds become available, whether reserves may apply or how adjustments affect a payout. Trolleys’ <Link href="/pricing" prefetch={false}>pricing page</Link> separates card processing, additional charges and account terms; ACH and software partnership pricing are confirmed separately.</p>
      <p>Ask who supports the integration, what support hours apply and how an urgent payment issue is escalated. Include your own development, migration and ongoing operating work in the comparison. Adyen’s RFP guidance highlights implementation overhead and operational complexity as costs that a processing rate alone can miss.</p>
      <p>For security, request current evidence covering the services you will use and a written division of responsibilities. PCI SSC explains that outsourcing payments does not remove a merchant’s responsibilities for provider oversight and shared controls. Confirm the applicable validation requirements with your acquirer or the organization managing your compliance program.</p>
      <p>Include exit questions before signing: notice periods, relevant charges, report access and the handling of old refunds or disputes. Ask which saved payment details can move and who manages the transfer. Stripe’s migration documentation describes coordination with the previous processor and a plan for mapping records and subscriptions. Do not assume changing providers transfers everything automatically. Our <Link href="/company/blog/switch-payment-processors" prefetch={false}>switching guide</Link> covers those dependencies.</p>
    </section>
    <section id="record-selection" aria-labelledby="record-selection-title">
      <h2 id="record-selection-title">Keep the decision useful after selection</h2>
      <p>Use the priorities agreed at the start to review each response. Record the evidence, unresolved conditions and owner for every material requirement. An attractive overall score should not conceal a missing capability that prevents launch.</p>
      <p>Keep the final proposal, agreed terms and implementation plan together. Identify who will approve the checkout, reporting and support arrangements before launch. Where a promise matters to the decision, confirm how it appears in the agreement or agreed scope.</p>
      <p>Carry the acceptance checks into implementation. Our <Link href="/developers/testing" prefetch={false}>payment testing guidance</Link> provides checks for a Trolleys gateway connection; the RFP should also cover your store, staff workflows and finance requirements.</p>
      <p>A useful RFP ends with a decision your team can explain and a service it knows how to put into use. The document is finished when responsibilities and remaining conditions are clear, not when every box says yes.</p>
    </section>
  </BlogArticlePage>;
}

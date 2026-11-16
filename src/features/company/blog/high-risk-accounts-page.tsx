import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { highRiskAccountsArticle } from "./high-risk-accounts-content";
import s from "./blog.module.css";

export function HighRiskAccountsPage() {
  return <BlogArticlePage article={highRiskAccountsArticle}>
    <p>After a string of payment-provider rejections, an approval email can feel like the problem is finally solved. You can take orders again. The quoted rate looks manageable. There is a reserve, but the salesperson calls it temporary.</p>
    <p>Before you commit, put one more question beside the approval: can the business fulfill its orders on the money that will actually be available?</p>
    <p>“High-risk merchant account” describes processing for a business a provider considers to present greater exposure. It does not describe one standard product, one price or one set of protections. The label tells you less than the approved business activity and the documents behind the offer.</p>

    <section id="understand-the-exposure" aria-labelledby="understand-the-exposure-title">
      <h2 id="understand-the-exposure-title">What is the provider actually worried about?</h2>
      <p>Consider two businesses selling the same item. One ships stock tomorrow. The other collects payment today and promises delivery in three months. Similar products and sales totals can produce different obligations if orders cannot be fulfilled.</p>
      <p>The OCC’s merchant-processing handbook explains why future delivery can increase an acquirer’s chargeback exposure. The customer may not raise a problem until delivery is due, after the original payment has moved through the system. A reserve is one way a provider may address that exposure.</p>
      <p>That gives the merchant a more useful conversation than arguing over the label. Explain when customers pay, what happens before delivery, how cancellations work and what resources would cover refunds if a supplier failed. Bring actual processing history where available, realistic volume estimates and a clear account of the products and sales channels.</p>
      <p>A risk classification is not a verdict on your honesty. It also does not establish that every provider can support the activity. Ask which part of the business needs further review and what the proposed conditions are intended to address.</p>
    </section>

    <section id="compare-usable-cash" aria-labelledby="compare-usable-cash-title">
      <h2 id="compare-usable-cash-title">The lower rate may leave less cash available</h2>
      <p>Fees, reserves and payout timing affect the same bank balance in different ways. Putting them all into a single percentage hides decisions your business still needs to make.</p>
      <table className={s.comparison}>
        <caption>Three terms to compare separately</caption>
        <thead><tr><th scope="col">Term</th><th scope="col">What it changes</th><th scope="col">What to establish</th></tr></thead>
        <tbody>
          <tr><th scope="row">Processing fee</th><td><span className={s.comparisonLabel} aria-hidden="true">What it changes</span>The cost of accepting the payment.</td><td><span className={s.comparisonLabel} aria-hidden="true">What to establish</span>Which amount or event is charged, and which other fees apply.</td></tr>
          <tr><th scope="row">Reserve</th><td><span className={s.comparisonLabel} aria-hidden="true">What it changes</span>Funds held against specified obligations.</td><td><span className={s.comparisonLabel} aria-hidden="true">What to establish</span>The calculation, holder, permitted uses, review and release conditions.</td></tr>
          <tr><th scope="row">Payout timing</th><td><span className={s.comparisonLabel} aria-hidden="true">What it changes</span>When eligible funds can reach your operating account.</td><td><span className={s.comparisonLabel} aria-hidden="true">What to establish</span>Availability, payout initiation, bank timing and any restrictions.</td></tr>
        </tbody>
      </table>
      <p>For a simple hypothetical comparison, assume a reserve is calculated as 10% of $50,000 in eligible sales. That puts $5,000 into reserve. Before considering any reserve releases or other adjustments, only $45,000 remains outside it, and processing fees still need to be accounted for. These figures illustrate the calculation, not a Trolleys offer or a typical market rate.</p>
      <p>The $5,000 is not automatically a processing fee. It is also not available to pay this week’s supplier invoice. Its eventual treatment depends on the agreement, including obligations it may be used to cover.</p>
      <p>Read the calculation base carefully. A percentage of gross sales differs from a percentage after fees. A rolling arrangement can release older amounts while holding part of new sales. A fixed release arrangement works differently. The account documents should make the applicable method understandable.</p>
      <p>Now compare complete offers against your cash forecast. If a lower rate comes with more withholding, the fee saving and the additional funding needed are separate results. Neither one cancels out the other on paper.</p>
    </section>

    <section id="read-the-difficult-month" aria-labelledby="read-the-difficult-month-title">
      <h2 id="read-the-difficult-month-title">Read the terms for a difficult month</h2>
      <p>A normal month is the easy test. Try the same offer against a delayed shipment, a cluster of cancellations or a seasonal sales spike. Would the business still have enough available cash for fulfillment and refunds if the applicable restrictions took effect?</p>
      <p>Find the provisions that govern changes to reserves, processing limits and payouts. Ask who makes the decision, what notice or review is available and what information you can provide. A verbal assurance that a hold is temporary does not answer how release is assessed.</p>
      <p>Read the exit provisions too. Stopping new processing does not make earlier sales disappear. Refunds, disputes and other accepted obligations may remain. Establish how final accounting, any continuing reserve and funds eligible for release will be handled.</p>
      <p>Keep the quote, fee schedule and accepted agreement together. If a promise matters to whether the business can operate, identify where it appears in the documents that govern the account. Have unclear guarantees or security obligations explained before agreeing to them.</p>
    </section>

    <section id="approval-that-fits" aria-labelledby="approval-that-fits-title">
      <h2 id="approval-that-fits-title">Ask us about the business you actually run</h2>
      <p>With Trolleys, an Etail Depot service, the starting point is your actual business model. Our <Link href="/services/merchant-onboarding" prefetch={false}>merchant account review</Link> includes the activity, payment flow and account conditions. Restricted activities require specific written approval, and some businesses cannot be supported under the applicable program.</p>
      <p>A familiar industry name, a working integration or a successful payment does not extend that approval. A new seller, product, sales channel or material change in delivery timing may need further review. Describe those plans before processing the changed activity.</p>
      <p>For an approved Trolleys merchant, <Link href="/services/payouts" prefetch={false}>payout records</Link> and the applicable reserve notice should explain what is available and what remains restricted. Our published reserve terms call for the holder, calculation, review arrangements and release conditions to be identified. They do not promise one reserve percentage or holding period for every account.</p>
      <p><Link href="/company/contact#payment-review" prefetch={false}>Talk with our team about your processing needs</Link> before treating an approval as a launch plan. Bring your sales pattern, fulfillment timetable and the account conditions you need clarified. We can discuss eligibility and the relevant account process; approval and funding remain subject to the applicable review and accepted terms.</p>
    </section>

    <p>The useful approval is the one that covers your real activity and leaves you with a workable operating plan. You need to know more than whether the provider will accept the next payment. You need to know how you will deliver the order that follows it.</p>
  </BlogArticlePage>;
}

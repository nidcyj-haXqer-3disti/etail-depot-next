import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { pricingModelsArticle } from "./pricing-models-content";
import s from "./blog.module.css";

const pricingComparison = [
  ["Quoted rate", "Specified underlying card costs plus an agreed provider markup.", "A stated rate for payments within a defined category."],
  ["Card mix", "Underlying costs can change with the cards and transaction types processed.", "The stated rate applies within its scope; other categories can have different charges."],
  ["Provider charge", "Check the markup separately from interchange and network charges.", "The provider’s margin is included in the quoted transaction rate."],
  ["Other fees", "Read the full schedule for charges outside the transaction calculation.", "Read the full schedule here too. A flat rate does not mean every service is included."],
] as const;

export function PricingModelsPage() {
  return <BlogArticlePage article={pricingModelsArticle}>
    <p>A low headline rate is useful only when you know what it covers. Neither pricing label tells you the complete bill or guarantees a lower cost for your business. Start with the definitions, then compare the same payment activity.</p>
    <section id="read-the-pricing-definition" aria-labelledby="read-the-pricing-definition-title">
      <h2 id="read-the-pricing-definition-title">Find out what the quoted rate includes</h2>
      <p>Interchange is a transfer between the acquiring and issuing banks. Visa distinguishes it from the merchant discount, the charge a merchant agrees with its financial institution. A network interchange schedule is therefore not a complete merchant quote.</p>
      <table className={s.comparison}>
        <caption>Two ways to price the same card payments</caption>
        <thead><tr><th scope="col">What to compare</th><th scope="col">Interchange-plus</th><th scope="col">Flat-rate</th></tr></thead>
        <tbody>{pricingComparison.map(([item, interchange, flat]) => <tr key={item}>
          <th scope="row">{item}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Interchange-plus</span>{interchange}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Flat-rate</span>{flat}</td>
        </tr>)}</tbody>
      </table>
      <p>For interchange-plus, ask which network charges are passed through and how they appear on the statement. For flat-rate, check the eligible payment types. A domestic online card rate may not cover international cards, merchant-entered payments or currency conversion on the same terms. Stripe’s pricing page, for example, lists separate charges for those cases.</p>
    </section>
    <section id="compare-one-volume" aria-labelledby="compare-one-volume-title">
      <h2 id="compare-one-volume-title">Use the same transactions for both offers</h2>
      <p>Take a representative period from your own payment records and give each provider the same summary. If you are starting a business, identify forecasts as estimates. Ask each quote to show these four inputs:</p>
      <ol>
        <li><strong>Sales volume.</strong> Use the same gross processed card sales, period and currency, rather than the amount deposited into your bank.</li>
        <li><strong>Payment count.</strong> Include the number of payments as well as their value. A fixed transaction fee depends on count, not just sales volume.</li>
        <li><strong>Card and transaction mix.</strong> Separate the categories that affect the quote, such as domestic and international cards or online and merchant-entered payments.</li>
        <li><strong>Other chargeable activity.</strong> Supply the same refund, dispute and optional-service assumptions. Ask what triggers each fee.</li>
      </ol>
      <p>Ask for the calculation behind each total. If a provider estimates interchange because detailed card data is unavailable, have it identify the assumptions. Do not compare one quote based on your actual mix with another based on an unexplained average.</p>
      <p>Use aggregated reports or the provider’s approved secure process for a statement review. A pricing comparison does not require sending full card numbers by email.</p>
    </section>
    <section id="include-the-work-and-exceptions" aria-labelledby="include-the-work-and-exceptions-title">
      <h2 id="include-the-work-and-exceptions-title">Compare the complete cost</h2>
      <p>Put every applicable charge beside the transaction calculation: account or gateway fees, minimums, reporting, integrations and optional services. Mark each one as included, separately charged or not applicable. Check contract duration, cancellation terms and how price changes are communicated.</p>
      <p>Keep refunds and disputes visible. Returning a customer’s purchase amount does not necessarily return the original processing fee. Etail’s <Link href="/company/legal/fees#refund-treatment" prefetch={false}>Fees and billing schedule</Link> states that original processing and currency conversion fees are not returned on a refund. Other providers’ treatment must be checked against their own terms.</p>
      <p>Also distinguish payment attempts from captured sales. Ask whether a quoted transaction charge applies to an authorization, a successful capture or another event. Trolleys’ standard processing fee applies to successfully captured card payments; separately agreed event fees follow their own rules.</p>
      <p>Request a sample statement showing how fees are collected. Charges deducted from settlement and charges invoiced later both belong in the comparison. Count each once; a lower deposit by itself does not identify the processing cost.</p>
    </section>
    <section id="make-the-choice" aria-labelledby="make-the-choice-title">
      <h2 id="make-the-choice-title">Choose the model your business can verify</h2>
      <p>Compare the totals only after the inputs and inclusions match. Flat-rate pricing can make an eligible payment’s cost easier to calculate. Interchange-plus provides a separate view of underlying costs and markup, but requires more detailed statement review.</p>
      <p>Ask your team to explain any difference between the quotes: card mix, provider markup, fixed fees or extra services. If nobody can identify the cause, request clarification before treating it as a saving. Repeat the comparison when your average order size, customer mix or payment channels change.</p>
      <p>The <Link href="/company/blog/payment-processing-rfp" prefetch={false}>payment processing RFP checklist</Link> helps you request comparable answers. The <Link href="/company/blog/choose-a-merchant-services-provider" prefetch={false}>merchant services provider guide</Link> adds support, account terms and operational fit to the decision.</p>
      <p>For Trolleys’ current offer, use the <Link href="/pricing" prefetch={false}>pricing page</Link> and your accepted account terms. This comparison explains pricing models; it does not introduce a different Trolleys plan. Choose an offer whose full cost you can understand and check against your own records.</p>
    </section>
  </BlogArticlePage>;
}

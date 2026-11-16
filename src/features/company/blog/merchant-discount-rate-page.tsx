import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { merchantDiscountArticle } from "./merchant-discount-rate-content";
import s from "./blog.module.css";

const statementItems = [
  ["Processing fee", "A charge for accepting or processing payments under the agreement.", "Include it if it belongs to the cost measure and period you are reviewing."],
  ["Refunded purchase amount", "Money returned to the customer for the sale.", "Keep the purchase amount separate from any fee charged or credited for the refund."],
  ["Reserve movement", "Funds moved into or out of a reserve under the account’s terms.", "Track it separately. The movement itself is not a processing fee."],
  ["Payout timing difference", "Sales and bank receipts fall in different reporting periods.", "Match the transactions and payout references before comparing totals."],
] as const;

export function MerchantDiscountPage() {
  return <BlogArticlePage article={merchantDiscountArticle}>
    <p>Despite its name, the merchant discount rate is not a discount offered to your customer. It describes card acceptance pricing. The useful questions are what your agreed rate includes and how the charges on your statement were calculated.</p>
    <section id="read-the-agreed-price" aria-labelledby="read-the-agreed-price-title">
      <h2 id="read-the-agreed-price-title">Identify what the rate covers</h2>
      <p>Visa and Mastercard distinguish the merchant’s acceptance charges from interchange between financial institutions. Interchange can form part of the merchant price alongside network and provider charges. Your agreement determines whether those components are bundled or shown separately.</p>
      <p>A quoted percentage may also have a fixed charge per payment. Account fees, optional services and other charges can sit outside that quote. Ask which payment types qualify, which amount the percentage applies to and which event triggers the fixed fee.</p>
      <p>Use the <Link href="/company/blog/interchange-fees" prefetch={false}>interchange fees article</Link> to understand the underlying component. For comparing offers, <Link href="/company/blog/interchange-plus-vs-flat-rate-pricing" prefetch={false}>interchange-plus versus flat-rate pricing</Link> explains how to keep the transaction inputs consistent.</p>
    </section>
    <section id="calculate-an-effective-rate" aria-labelledby="calculate-an-effective-rate-title">
      <h2 id="calculate-an-effective-rate-title">Calculate the cost from actual fees</h2>
      <p>An effective processing rate summarizes the charges you choose to measure over a defined period. It is a calculated average, not necessarily the contractual MDR or the rate charged on every payment.</p>
      <p><strong>Effective processing rate = included processing fees ÷ corresponding gross processed card sales × 100.</strong></p>
      <p>List the included fee categories, account, currency and reporting period beside the result. Use the corresponding card sales before refunds as the denominator for this measure. If you calculate against sales after refunds instead, label it as a net-sales measure and use the same basis in every comparison. A period with no card sales has no meaningful rate under this formula.</p>
      <table className={s.comparison}>
        <caption>Not every deduction from a payout is a processing fee</caption>
        <thead><tr><th scope="col">Statement item</th><th scope="col">What it represents</th><th scope="col">How to treat it</th></tr></thead>
        <tbody>{statementItems.map(([item, meaning, handling]) => <tr key={item}>
          <th scope="row">{item}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it represents</span>{meaning}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">How to treat it</span>{handling}</td>
        </tr>)}</tbody>
      </table>
      <p>Etail’s <Link href="/company/legal/payouts-and-reserves#calculation" prefetch={false}>payout terms</Link> separate fees, refunds, disputes, reserve movements and prior balances in the payout calculation. Those adjustments explain why subtracting a bank deposit from gross sales does not isolate your processing cost.</p>
      <p>Identify fee credits as well as charges, and count each once. If you also want a broader cost measure that includes software subscriptions or other services, state those inclusions separately. Do not compare that broader total with another provider’s transaction fees alone.</p>
    </section>
    <section id="compare-equivalent-periods" aria-labelledby="compare-equivalent-periods-title">
      <h2 id="compare-equivalent-periods-title">Understand why the average moves</h2>
      <p>A fixed fee has more weight on a small purchase than on a large one. Changes in payment count, average order value, card mix or separately priced transaction types can therefore move the average even when the agreed fee schedule stays the same.</p>
      <p>Refunds can also change the result, especially if you use net sales. Returning the purchase amount does not necessarily return the original fee. Etail’s <Link href="/company/legal/fees#refund-treatment" prefetch={false}>Fees and billing schedule</Link> states that original processing and currency conversion fees are not returned when a payment is refunded.</p>
      <p>Check when fees are billed. Some are deducted from settlement; others may appear on a separate invoice or debit. Match the relevant billing records to the activity being reviewed, including any later credits. A charge shown on both a statement and an invoice must not be counted twice.</p>
      <p>The <Link href="/company/blog/transaction-details-reports" prefetch={false}>transaction report guide</Link> explains how to follow references and dates across records. Compare equivalent periods and fee categories before concluding that the provider raised your price.</p>
    </section>
    <section id="resolve-a-question" aria-labelledby="resolve-a-question-title">
      <h2 id="resolve-a-question-title">Ask for a specific fee explanation</h2>
      <p>Prepare these four items for a pricing review:</p>
      <ol>
        <li><strong>Agreement.</strong> Keep the applicable fee schedule and any later pricing notices.</li>
        <li><strong>Statement.</strong> Identify the exact line item, account and billing period in question.</li>
        <li><strong>Transactions.</strong> Provide representative references, amounts, currencies and payment types through the approved support channel.</li>
        <li><strong>Expected calculation.</strong> Show the fees and sales volume you used, what you excluded and the difference you want explained.</li>
      </ol>
      <p>Keep the review tied to the underlying records. If a cost cannot yet be matched to a period or transaction group, identify it as unresolved rather than quietly assigning it to whichever total looks convenient.</p>
      <p>Use the effective rate to spot questions, then resolve them against the agreement and actual charges. A single average is useful for monitoring cost, but it cannot explain every fee or show on its own whether an account was billed correctly.</p>
    </section>
  </BlogArticlePage>;
}

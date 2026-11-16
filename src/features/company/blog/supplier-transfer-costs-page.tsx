import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { supplierTransferCostsArticle } from "./supplier-transfer-costs-content";

export function SupplierTransferCostsPage() {
  return <BlogArticlePage article={supplierTransferCostsArticle}>
    <p>The transfer fee is easy to compare. It is the number beside the button.</p>
    <p>The cost of an unfinished payment is harder to see: a supplier chasing a balance, an accounts team investigating a deduction, a second transfer to settle what the first one left behind. Those costs rarely appear beside the button.</p>
    <p>For a business paying an overseas supplier, the useful question is what it will cost to meet the agreed payment obligation. That means knowing what leaves your account and what reaches theirs. A low sending fee answers only part of that question.</p>

    <section id="compare-the-same-receipt" aria-labelledby="compare-the-same-receipt-title">
      <h2 id="compare-the-same-receipt-title">Put the supplier’s receipt into the comparison</h2>
      <p>Consider a hypothetical USD 6,000 invoice. The agreement requires the supplier to receive the full amount. The first route has a USD 12 sending fee. In this illustration, an intermediary bank deducts USD 18 from the payment before it reaches the supplier.</p>
      <p>The second quote costs USD 25 above the invoice amount and, for this illustration only, includes an explicit commitment to deliver USD 6,000 to that account. Neither quote represents a real provider’s price or a promise of availability.</p>
      <div data-table-scroll><table>
        <caption>Hypothetical comparison in USD, with no currency conversion. The second quote assumes a written full-receipt commitment.</caption>
        <colgroup><col /><col style={{ width: "30%" }} /><col style={{ width: "30%" }} /></colgroup>
        <thead><tr><th scope="col">Payment result</th><th scope="col">First quote</th><th scope="col">Second quote</th></tr></thead>
        <tbody>
          <tr><th scope="row">Your debit</th><td>6,012</td><td>6,025</td></tr>
          <tr><th scope="row">Supplier gets</th><td>5,982</td><td>6,000</td></tr>
          <tr><th scope="row">Still due</th><td>18</td><td>0</td></tr>
        </tbody>
      </table></div>
      <p>The first debit is USD 13 lower, but the invoice is still USD 18 short. Sending the balance may incur another fee. You cannot establish the cost of completing that payment by comparing USD 12 with USD 25, or by assuming the follow-up transfer will be free.</p>
      <p>The agreement matters. If the supplier has accepted responsibility for receiving charges, a deduction may need a different accounting treatment rather than another payment. Settle that point before sending. A payment provider’s fee option does not rewrite the commercial terms between buyer and seller.</p>
      <p>Intermediary banks help route payments between institutions. Their deductions can sit alongside the sender’s fee and the receiving bank’s charges. Currency conversion adds another price to examine. Bank of America’s wire guidance, for example, distinguishes its transfer fee from exchange-rate markups and other charges that may apply. No transfer fee does not necessarily mean no transfer cost.</p>
      <p>Ask for a quote tied to the actual destination account, payment currency, intended receipt and payment date. Find out which charges are fixed, which are estimated and which can still be deducted or billed later. If the provider cannot confirm the recipient amount, keep that uncertainty visible in your comparison.</p>
      <p>Also ask what a “sender pays” selection actually covers. Wise Platform’s documentation for global-currency Swift transfers warns that the full amount is not guaranteed under either OUR or SHA instructions. That is a limitation of the service described, not proof that every provider has identical terms. It is a reason to read the commitment behind a fee option before relying on it.</p>
    </section>

    <section id="change-the-payment-route" aria-labelledby="change-the-payment-route-title">
      <h2 id="change-the-payment-route-title">Change the arrangement before repeating the cost</h2>
      <p>If the same supplier keeps receiving less than expected, the next payment deserves a fresh quote. Ask whether a supported local-currency route, a different receiving arrangement or a service with clearer charge coverage would suit the invoice. The answer depends on the sender, recipient, currency and accounts involved.</p>
      <p>Such alternatives exist, but they come with conditions. HSBC UK’s Pay Local service describes payments without intermediary charges for specified locations and local currencies, through eligible UK accounts with the required setup. That is evidence of a particular route, not a rule that every local-currency payment is cheaper or available to every business.</p>
      <p>Changing currency also changes the comparison. Get the supplier’s agreement to any revised invoice currency and amount. Confirm that its account can receive the payment as intended. Then compare the complete cost, including the quoted exchange rate. Removing an intermediary deduction is not a saving if a more expensive conversion outweighs it.</p>
      <p>For regular purchases, agreeing a payment schedule with the supplier may reduce the number of separately charged transfers. Price that option rather than assuming it saves money. Earlier payment ties up cash; later payment can breach terms or delay an order. Include invoice references so a combined payment can still be allocated correctly.</p>
      <p>After payment, retain the quote and compare the actual debit with the supplier’s confirmed credit. Ask the bank or payment provider to explain a deduction using the original reference. If a small balance remains, agree how it will be resolved before sending more. A pattern across several receipts is a better basis for changing the arrangement than a cheap headline or one unusually smooth transfer.</p>
      <p>The same attention to net amounts matters on the sales side of your business. Trolleys, an Etail Depot service, helps merchants understand <Link href="/services/payouts" prefetch={false}>the payments and adjustments behind a payout</Link>. Our <Link href="/services/reconciliation" prefetch={false}>reconciliation service</Link> supports comparison of merchant account and gateway reports, while payout records explain the amount due for deposit.</p>
      <p>For a Trolleys merchant, bring an unexplained account fee or payout difference to <Link href="/company/contact#account-support" prefetch={false}>account support</Link> with the relevant reference. Our current <Link href="/company/legal/payouts-and-reserves#scope" prefetch={false}>funding arrangements</Link> cover USD payouts to approved US bank accounts. A separate international supplier transfer belongs with the bank or provider handling it.</p>
      <p>A transfer that settles the invoice cleanly lets the supplier get back to fulfilling orders and your team get back to running the business. Judge the price against that result, including the cost of fixing a payment that falls short.</p>
    </section>
  </BlogArticlePage>;
}

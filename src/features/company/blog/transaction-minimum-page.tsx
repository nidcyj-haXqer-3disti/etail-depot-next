import { BlogArticlePage } from "./article-page";
import { transactionMinimumArticle } from "./transaction-minimum-content";

export function TransactionMinimumPage() {
  return <BlogArticlePage article={transactionMinimumArticle}>
    <p>A merchant sees a low percentage and assumes the fee will fall proportionately with the purchase. A minimum changes that relationship. Below the point where the percentage reaches the floor, a smaller payment can cost exactly as much to process as a larger one.</p>
    <p>For illustration, 1% with a $1 minimum costs $1 on a $20 payment and $1 on a $100 payment. The first is effectively 5%; the second is 1%. This is a hypothetical fee structure, not a Trolleys rate.</p>
    <p>It is also different from charging 1% plus $1. A floor replaces a lower calculated fee; an added fixed charge increases it. Confusing those structures can make a comparison wrong in either direction.</p>
    <p>Under that same hypothetical rule, collecting five separate $20 balances costs $5, while collecting one $100 payment costs $1. The merchant receives the same total before fees. What changes is how many times the minimum applies. A quote based only on total receipts would miss that difference.</p>
    <p>Square’s published ACH pricing provides a real example of transaction minimums, with different conditions by product and plan. The appropriate lesson is to read the full charging rule. The minimum is part of the price, not a footnote to a percentage that can be used on its own.</p>
    <p>For a merchant collecting small balances, the floor may affect the choice of payment method or billing cadence. Combining legitimately due amounts into a convenient bill could change the cost, but that decision must fit the customer agreement, consent and service. Delaying collection purely to reduce fees can introduce cash and administration costs of its own.</p>
    <p>A small payment can still be commercially worthwhile. It may settle a remaining balance, preserve a customer relationship or complete an order the merchant has already earned. The fee is a cost to include in that judgment, rather than an automatic reason to refuse the payment.</p>
    <p>Two other minimums are easy to confuse with this one. A monthly account minimum concerns the billing period. A minimum purchase amount imposed on customers concerns checkout policy and is subject to different rules. Neither tells you how a provider calculates its per-payment fee floor.</p>
    <p>Before changing how customers pay, look at how often the business collects amounts below the fee floor. A few large purchases can make the average payment look comfortable while many smaller balances still incur the minimum. That pattern, more than the advertised percentage, tells the owner whether this is a marginal expense or a recurring cost built into the way the business collects its money.</p>
  </BlogArticlePage>;
}

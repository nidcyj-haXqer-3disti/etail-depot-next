import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { multivendorArticle } from "./multivendor-content";
import s from "./blog.module.css";

const sellerShares = [
  ["First seller", "$100", "$10", "$90"],
  ["Second seller", "$60", "$6", "$54"],
] as const;

export function MultivendorPage() {
  return <BlogArticlePage article={multivendorArticle}>
    <p>A customer adds products from two sellers to a basket, enters a promotion code and pays. From the buyer’s side, the marketplace has done its job.</p>
    <p>From the sellers’ side, one question is still open: who paid for that discount?</p>
    <p>If the marketplace promised to fund the promotion, quietly deducting it from the sellers changes the deal. If the sellers agreed to fund it, keeping their original balances overstates what the marketplace owes. A successful payment does not resolve either mistake.</p>
    <p>That is the less visible part of multivendor marketplace payments. Each order needs a defensible explanation of the buyer’s payment, each seller’s entitlement and the platform’s own costs. Seller confidence depends on that explanation surviving the first promotion, cancellation and refund.</p>

    <section id="the-discount-has-an-owner" aria-labelledby="the-discount-has-an-owner-title">
      <h2 id="the-discount-has-an-owner-title">A promotion can cost more than the commission earns</h2>
      <p>Consider a hypothetical order with $100 of goods from one seller and $60 from another. Assume the marketplace charges each seller a 10% commission on the goods value before the discount. It also offers the buyer a $20 promotion that the marketplace funds entirely, without reducing either seller’s agreed share.</p>
      <p>Leave tax, shipping and payment processing costs out of this calculation so the promotion’s effect is visible.</p>
      <table className={s.comparison}>
        <caption>Seller shares under these illustrative commercial terms</caption>
        <thead><tr><th scope="col">Seller</th><th scope="col">Goods value</th><th scope="col">Commission</th><th scope="col">Seller share</th></tr></thead>
        <tbody>{sellerShares.map(([seller, goods, commission, share]) => <tr key={seller}>
          <th scope="row">{seller}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Goods value</span>{goods}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Commission</span>{commission}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Seller share</span>{share}</td>
        </tr>)}</tbody>
      </table>
      <p>The buyer pays $140 after the promotion. The sellers are still due $144 in total. The marketplace therefore has to contribute $4 before payment processing costs: its $16 commission has been more than consumed by the $20 promotion.</p>
      <p>The checkout can look entirely normal while the marketplace loses money on the order. The problem becomes harder to see when a dashboard reports the full goods value as sales and treats every commission as income without showing the promotion beside it.</p>
      <p>If the sellers fund the discount instead, their agreed shares may change. If commission is calculated after discounts, that changes the result again. Decide these terms before running the campaign and retain the calculation used for each order. A later change to the commission schedule should not silently rewrite an earlier sale.</p>
      <p>These figures describe the commercial result. They do not specify how to move the funds. Any platform contribution and seller distribution need a payment arrangement that supports them.</p>
    </section>

    <section id="a-seller-should-recognize-their-money" aria-labelledby="a-seller-should-recognize-their-money-title">
      <h2 id="a-seller-should-recognize-their-money-title">Give the seller a statement they can recognize</h2>
      <p>A single net amount is easy to display and difficult to question. A seller should be able to connect it to the items sold, the agreed discount contribution, the commission and any other adjustments.</p>
      <p>Keep seller ownership attached to the order lines. Record who bears a discount, which shipping charges belong to which part of the order and how any tax amounts are handled under the applicable arrangement. Where an amount must be divided across lines, use a consistent allocation and rounding rule. A leftover cent needs an owner too.</p>
      <p>Payment providers make these distinctions explicit in their own systems. Adyen, for example, documents separate allocation types for seller amounts, platform commission and payment fees, with account and reference information. Its fee documentation distinguishes transaction fees that can be assigned to balance accounts from aggregated costs that cannot be allocated to individual payments. Those are specific implementation rules, not a promise that every gateway has the same marketplace functions.</p>
      <p>The lesson for your commercial design is simpler: specify what the seller should receive before asking a developer to divide the buyer’s payment. A commission is not automatically the amount left after every other cost. Shipping collected is not automatically platform income. The records should explain the treatment agreed with the seller.</p>
      <p>Also distinguish the amount calculated for an order from an amount actually transferred or paid out. A seller reading “earned” should not have to guess whether it means allocated, available for payout or already sent to a bank. Use the status supported by the payment record, with the relevant reference.</p>
    </section>

    <section id="when-one-part-of-the-basket-changes" aria-labelledby="when-one-part-of-the-basket-changes-title">
      <h2 id="when-one-part-of-the-basket-changes-title">A return tests the original promise</h2>
      <p>Now suppose the customer returns only the first seller’s item. The order used a promotion across the basket. How much should the buyer receive back, what happens to the promotion and does the marketplace return the related commission?</p>
      <p>Answer from the disclosed purchase terms and the seller agreement, subject to applicable refund rights. The refund record should preserve how the original discount was applied and explain any resulting adjustment. Simply refunding the undiscounted item price can produce a different result from reversing the buyer’s actual payment allocation.</p>
      <p>The unaffected seller’s share should remain traceable. If a promotion rule changes the treatment of the remaining basket, make that consequence explicit rather than silently changing another seller’s proceeds.</p>
      <p>The buyer refund and recovery from a seller may be separate operations. Stripe’s separate charges and transfers documentation, for example, states that refunding the charge does not automatically reverse its associated transfers. Its transfer recovery has its own conditions. The supported payment model determines the mechanics.</p>
      <p>Keep an unresolved seller recovery visible even when the buyer’s refund has succeeded. Our article on <Link href="/company/blog/embedded-payments-for-online-marketplaces" prefetch={false}>a marketplace refund after payout</Link> examines that operating problem in more detail. The important point here is continuity: staff should be able to explain the adjustment using the same commercial terms that produced the original seller share.</p>
    </section>

    <section id="bring-the-mixed-order-to-trolleys" aria-labelledby="bring-the-mixed-order-to-trolleys-title">
      <h2 id="bring-the-mixed-order-to-trolleys-title">Bring the mixed order to the payment discussion</h2>
      <p>With <Link href="/use-cases/software-platforms/partnerships" prefetch={false}>Trolleys, an Etail Depot service</Link>, begin with the businesses making the sales and the intended movement of money. Each merchant account is reviewed for its business activity. Multiple sellers, commissions, split payments and holding funds require a separately approved structure.</p>
      <p>A gateway integration or a dashboard showing several merchant accounts does not, by itself, authorize the marketplace to collect and redistribute money for independent sellers. Confirm the <Link href="/use-cases/software-platforms/payment-models" prefetch={false}>account and payment model</Link> before promising a single charge, automatic distributions or a payout schedule.</p>
      <p>Bring one representative mixed order to a <Link href="/company/contact#platforms" prefetch={false}>Trolleys platform partnership discussion</Link>, including a promotion and a partial return. Explain the commission basis, who funds incentives and who handles a seller’s question about a deduction. Our team can review the proposed merchant relationship and integration requirements; supported flows, permissions, records and commercial terms are agreed for the partnership.</p>
    </section>

    <p>The buyer wants an easy purchase. The seller wants a fair, explainable payment. A marketplace earns trust when both can look at the same order and understand what happened to the money.</p>
  </BlogArticlePage>;
}

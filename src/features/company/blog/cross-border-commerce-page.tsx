import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { crossBorderCommerceArticle } from "./cross-border-commerce-content";

export function CrossBorderCommercePage() {
  return <BlogArticlePage article={crossBorderCommerceArticle}>
    <p>Imagine your first overseas clothing order. The customer found the store, liked the product and paid without trouble. The parcel arrived. Then the customer asked to return it because the fit was wrong.</p>
    <p>Now someone has to find a return service, explain the postage, decide where the parcel goes and work out the refund. The sale that looked like proof of international demand becomes a test of everything the checkout did not do.</p>
    <p>That does not make selling abroad a bad idea. It makes the return trip part of the business plan. Cross-border ecommerce is online selling to customers in another country. For physical goods, the offer has to work from the customer’s first price comparison through to the last support conversation.</p>

    <section id="the-price-after-delivery" aria-labelledby="the-price-after-delivery-title">
      <h2 id="the-price-after-delivery-title">The customer buys a delivered product</h2>
      <p>Your product page may show a competitive price while the delivered purchase is much less attractive. Freight, insurance, tariffs, taxes and other fees can change what the customer must pay. The International Trade Administration includes these in the landed cost of an export shipment.</p>
      <p>Decide which charges your business will pay, which it will collect and which the buyer may owe separately. Then make the customer’s responsibility clear before payment. A delivery estimate cannot compensate for a charge the customer did not know to expect.</p>
      <p>Confirm that arrangement for the exact destination and shipping service. A carrier name alone is not enough. DHL eCommerce, for example, describes services where duties and taxes are billed to the merchant and others where applicable charges are collected at delivery. The service you select has to match the promise on your website.</p>
      <p>Use a current estimate for the actual product, origin and destination. Do not borrow a tax rate or exemption from another market. Classification and local requirements need checking with the carrier, customs broker or relevant adviser. An estimate should remain an estimate unless your arrangement genuinely fixes the customer’s total.</p>
      <p>Next, ask what the merchant keeps. A new country can produce larger baskets while leaving less money to run the business. Compare orders using consistent cost definitions, with tax collected for a government separated from sales revenue.</p>
      <div data-table-scroll><table>
        <caption>Hypothetical planning amounts per order, in USD. These are assumed costs, not Trolleys prices or market rates.</caption>
        <colgroup><col /><col style={{ width: "5rem" }} /></colgroup>
        <thead><tr><th scope="col">Order calculation</th><th scope="col">USD</th></tr></thead>
        <tbody>
          <tr><th scope="row">Sales before returns, excluding tax collected for a government</th><td>150</td></tr>
          <tr><th scope="row">Product, packing, outbound delivery and merchant-paid import charges</th><td>−95</td></tr>
          <tr><th scope="row">Payment and currency costs</th><td>−5</td></tr>
          <tr><th scope="row">Expected net effect of returns per shipped order</th><td>−12</td></tr>
          <tr><th scope="row">Remaining for acquisition, support, overhead and profit</th><td>38</td></tr>
        </tbody>
      </table></div>
      <p>The USD 95 combines an assumed USD 55 product cost, USD 28 for packing and outbound delivery, and USD 12 in merchant-paid import charges. The remaining USD 38 is not profit. It still has to cover the work and spending outside this calculation.</p>
      <p>The USD 12 return allowance includes expected refunds and return handling, offset by the value of recovered stock and recoverable charges. It is averaged across all shipped orders, not charged again on top of actual return losses. If that net allowance rises by USD 18, the remainder falls to USD 20. Replace these assumptions with evidence as the market develops.</p>
    </section>

    <section id="design-the-return-trip" aria-labelledby="design-the-return-trip-title">
      <h2 id="design-the-return-trip-title">Write the return answer before the first complaint</h2>
      <p>For the clothing order, the customer needs a usable answer: where to send the item, which service to use, who pays and what amount will be refunded. Staff need to know how to identify the returning order and what happens if the item arrives damaged or cannot be resold.</p>
      <p>A prepaid label is one possible arrangement, not a universal solution. A local return address, a consolidated return service or a permitted refund without return may fit some products better. Price the options against the value of recovering the stock. An operational choice does not remove a refund or other remedy the customer is legally owed.</p>
      <p>Check the consumer rules that apply to the market and sale. Your Europe’s guidance for covered distance sales describes advance information about delivery, charges and returns, alongside withdrawal rights and exceptions. Your domestic store policy does not establish the answer for every overseas customer. Have the relevant requirements reviewed before presenting the policy as final.</p>
      <p>Keep the parcel return and the payment refund connected but distinct. A tracking scan does not establish that a refund completed. A refund request does not tell the warehouse which item is coming back. The order reference should let both teams find the same history without making the customer repeat it.</p>
      <p>Before issuing money back, check previous refunds and any dispute on the original payment. Record the authorized amount, the provider’s response and the resulting status. Explain what your team has done without promising a bank posting date it cannot control.</p>
    </section>

    <section id="earn-a-wider-launch" aria-labelledby="earn-a-wider-launch-title">
      <h2 id="earn-a-wider-launch-title">One well-served market is a useful start</h2>
      <p>Begin with a named destination and a manageable product selection. Confirm product eligibility, delivery service, customer-facing terms and the payment arrangement. Then test the customer journey through purchase, delivery and a planned return, rather than treating a successful card charge as the finish line.</p>
      <p>After the necessary approvals, a limited launch can expose questions that a worldwide shipping switch hides. Watch delivered orders, refusals, support contacts and return costs alongside sales. Give the first group of orders time to pass through the applicable return period before declaring the economics proven.</p>
      <p><Link href="/use-cases/online-businesses" prefetch={false}>Trolleys, an Etail Depot service</Link>, connects enabled checkout methods with merchant payment records. For a Trolleys merchant, expanding abroad starts with confirming the proposed countries, products, currencies and delivery model against the <Link href="/company/legal/merchant-services#approval" prefetch={false}>approved account</Link>. This is a US merchant program; accepting an overseas card where enabled does not approve every international activity.</p>
      <p>Our <Link href="/services/refunds" prefetch={false}>refund service</Link> helps keep eligible full or partial refunds tied to the original transaction, with their references and status. Bring payment questions to our <Link href="/company/contact#account-support" prefetch={false}>account support team</Link>. Your business still owns the product, delivery promise, return policy and customer relationship.</p>
      <p>The right first market is not necessarily the one with the most impressive demand forecast. It is one where customers can receive what you promised, get a clear answer when something goes wrong, and leave enough margin for you to serve the next order well.</p>
    </section>
  </BlogArticlePage>;
}

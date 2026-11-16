import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { retailChannelsArticle } from "./retail-channels-content";
import s from "./blog.module.css";

const comparison = [
  ["Income", "The selling price after discounts and any additional charges you retain.", "The selling price after discounts, plus any delivery charge the customer pays."],
  ["Order costs", "Product cost, payment collection and handling attributable to the sale.", "Product cost, payment collection, picking, packaging and delivery attributable to the order."],
  ["Returns", "Staff handling, inspection and any loss on a returned item.", "Customer support, return transport where you pay it, inspection and any loss on the item."],
  ["Overhead", "Premises, equipment, staffing and other costs of keeping the location open.", "Store software, maintenance, support and other costs of keeping the online operation running."],
] as const;

export function RetailChannelsPage() {
  return <BlogArticlePage article={retailChannelsArticle}>
    <section id="customer" aria-labelledby="customer-title">
      <h2 id="customer-title">Compare how the customer buys</h2>
      <p>A physical store lets shoppers inspect products and, when stock is available, take them away immediately. An online store can present a searchable catalog and accept orders without requiring a visit. It must replace some of that inspection with accurate photos, specifications and clear delivery information.</p>
      <p>Neither channel guarantees lower costs or stronger loyalty. A store needs space and staff; an online business may need paid acquisition, packaging, delivery and more remote support. Start with the customer’s purchase task: trying a fit, replacing a known item or obtaining something by a particular date.</p>
      <p>The US Census Bureau defines ecommerce by how the order is placed or its terms are negotiated, and notes that payment need not happen online. An order placed on a website can still be collected in a shop. That is why comparing only “website” with “store” can miss the way customers actually buy.</p>
      <p>Keep the product business separate from its sales channels. A clothing retailer remains a clothing business whether an order comes from a shop counter or its website. Adding a channel changes the customer journey and operating requirements; it does not by itself describe a new product category.</p>
    </section>
    <section id="economics" aria-labelledby="economics-title">
      <h2 id="economics-title">Compare contribution for the same product</h2>
      <p>Use the same product and comparable order quantities when evaluating the channels. Start with the income you retain, then subtract the costs that change with the sale. The remainder contributes toward fixed costs and profit. It is not automatically the profit of the whole business.</p>
      <table className={s.comparison}>
        <caption>Use your actual costs for each channel</caption>
        <thead><tr><th scope="col">Compare</th><th scope="col">Physical store</th><th scope="col">Online shop</th></tr></thead>
        <tbody>{comparison.map(([entry, store, online]) => <tr key={entry}>
          <th scope="row">{entry}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Physical store</span>{store}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Online shop</span>{online}</td>
        </tr>)}</tbody>
      </table>
      <p>Include customer acquisition costs in both channels. A physical shop can require advertising, and an online store can receive repeat orders without buying each visit. Use your own results instead of assuming all online sales are expensive or all shop visitors are free to attract.</p>
      <p>Separate costs that change with orders from ongoing overhead, and avoid counting the same staff or software cost twice. The Small Business Administration’s planning guidance distinguishes fixed and variable costs and asks businesses to budget for both initial and recurring expenses.</p>
      <p>Ask whether the expected sales can cover the extra costs of the new channel. Shared stock or premises may help, but extra packing, service and returns still require time. Our <Link href="/company/blog/create-an-online-shop" prefetch={false}>online shop launch article</Link> includes an order calculation checklist without assumed prices or fees.</p>
    </section>
    <section id="hybrid" aria-labelledby="hybrid-title">
      <h2 id="hybrid-title">Treat pickup as its own operation</h2>
      <p>Ordering online and collecting in store combines a remote order with local handover. It needs a reliable stock promise, a person to pick the item and a clear message when it is ready. “Order received” should not mean “ready to collect” unless the operating process truly supports that promise.</p>
      <p>Shopify’s pickup workflow, for example, separates marking an order ready for pickup from marking it collected. Use the equivalent supported steps in your own platform. Give the customer the collection location, hours and instructions before they travel.</p>
      <ul>
        <li><strong>Inventory.</strong> Decide when an online order removes stock from what a store employee can sell. Test competing orders and decide how staff handle an unavailable item.</li>
        <li><strong>Returns.</strong> Tell customers where and how they can return an item bought through either channel. Keep the original order and payment reference available so the correct refund process can be followed.</li>
        <li><strong>Ownership.</strong> Assign responsibility for the online order, its preparation and its handover. Decide who contacts the customer if it cannot be collected as promised.</li>
      </ul>
      <p>Confirm how payment at checkout, payment on collection and refunds work with your platform and provider. Do not assume that enabling one payment route enables every other route. A pickup option also does not automatically synchronize stock across systems; test the actual connection.</p>
      <p>Our <Link href="/company/blog/choosing-an-ecommerce-shopping-cart-for-your-store" prefetch={false}>shopping cart checklist</Link> helps test stock, discounts and delivery when an order changes.</p>
    </section>
    <section id="pilot" aria-labelledby="pilot-title">
      <h2 id="pilot-title">Test one channel extension at a time</h2>
      <p>An existing store might begin with online reorders of a small, stable product range. An online retailer might test a temporary physical selling opportunity before committing to permanent premises. Choose a limited trial that tests the uncertain assumption, such as demand for inspection or the cost of local handover.</p>
      <p>Decide what you will measure before the trial starts. Compare contribution, fulfillment errors, returns and staff time alongside sales. Record which channel brought the order and which team completed it, so pickup work does not disappear from the online channel’s cost picture.</p>
      <p>If the added channel creates frequent stock conflicts, increasing advertising will amplify an operating problem. Fix the handoff before extending the assortment or coverage area. The goal is a buying journey the business can reliably support.</p>
    </section>
  </BlogArticlePage>;
}

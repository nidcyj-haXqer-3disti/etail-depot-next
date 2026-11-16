import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { ecommercePlatformsArticle } from "./ecommerce-platforms-content";
import s from "./blog.module.css";

const costs = [
  ["Launch", "Design, setup, data migration, training and integration work.", "What is included in the initial quote, and what would require more work?"],
  ["Platform and apps", "The plan, hosting where separate, themes and required app or extension subscriptions.", "Which costs change at renewal or when sales, users or usage increase?"],
  ["Payments", "Processing charges and any separate platform transaction charges.", "What is charged for the payment provider and methods you intend to use?"],
  ["Operations", "Staff time, updates, testing, backups, monitoring and specialist support.", "Who performs this work, how often, and what support is included?"],
] as const;

export function EcommercePlatformsPage() {
  return <BlogArticlePage article={ecommercePlatformsArticle}>
    <section id="models" aria-labelledby="models-title">
      <h2 id="models-title">Compare responsibility, not just labels</h2>
      <p>A hosted platform runs specified parts of the service for you under its plan and contract. A system you host yourself leaves more hosting, updates and operational responsibility with your team or its suppliers. Neither label tells you every limitation, integration cost or support boundary.</p>
      <p>Headless means the customer facing storefront is built separately from the commerce system that manages products, carts and orders. It can use a hosted commerce service, so it is not the opposite of hosted. Shopify’s guidance makes the additional custom storefront development and maintenance explicit. Choose that separation for a concrete experience or integration requirement, not because it sounds more advanced.</p>
      <p>Ask who maintains each part of the store. WooCommerce, for example, recommends current backups and testing updates on a staging copy before applying them to the live store. Its checks cover the theme, extensions, checkout, shipping, taxes and order emails. Include that work in the plan, whether your own team or a supplier handles it.</p>
    </section>
    <section id="requirements" aria-labelledby="requirements-title">
      <h2 id="requirements-title">Check essential requirements first</h2>
      <p>Write down what your store must do before comparing extras. Ask each candidate to demonstrate your workflow in the plan being quoted, with the integrations you will actually use.</p>
      <ul>
        <li><strong>Catalog and orders.</strong> Demonstrate required product options, stock behavior, delivery restrictions and returns. Use products that represent the difficult parts of your catalog.</li>
        <li><strong>Connections.</strong> Confirm the supported payment, accounting and fulfillment integrations. Check who maintains each connection and which features it supports.</li>
        <li><strong>Team access.</strong> Check who can change prices, refund orders and export customer data, including how access is removed when someone leaves.</li>
        <li><strong>Operations.</strong> Establish who fixes faults across the platform, theme, apps and custom integrations. Name the first support contact and the person who follows up.</li>
      </ul>
      <p>Do not let a strong average score compensate for a failed mandatory requirement. After that first screen, compare the remaining candidates on usability, recurring work and cost. A demonstration using the seller’s simplest sample store is insufficient if your catalog behaves differently.</p>
      <p>Confirm that a named payment integration supports the actions you need, such as taking a payment and handling a refund. Do not assume every wallet or recurring payment feature works with every platform and gateway combination. Our <Link href="/company/blog/choosing-an-ecommerce-shopping-cart-for-your-store" prefetch={false}>shopping cart selection article</Link> focuses on that part of the decision.</p>
    </section>
    <section id="cost" aria-labelledby="cost-title">
      <h2 id="cost-title">Compare the full cost</h2>
      <p>A low monthly platform price does not establish the cost of running the store. Build a comparison from the actual quotes, required apps and work your team expects to perform. Separate the initial launch budget from ongoing costs.</p>
      <table className={s.comparison}>
        <caption>Use the same assumptions for each candidate</caption>
        <thead><tr><th scope="col">Cost area</th><th scope="col">Include</th><th scope="col">Ask before committing</th></tr></thead>
        <tbody>{costs.map(([cost, include, question]) => <tr key={cost}>
          <th scope="row">{cost}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Include</span>{include}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Ask before committing</span>{question}</td>
        </tr>)}</tbody>
      </table>
      <p>Use the same order volume, payment mix and support expectations when comparing costs. Avoid counting a bundled service twice or leaving out a required app. Ask what happens to the budget if orders double, a plan limit is reached or a required integration changes.</p>
      <p>Some platforms charge transaction fees separately from payment processing fees. Check the terms for your chosen plan and payment provider rather than assuming one quoted rate covers everything. A hosted platform is not automatically cheaper, and software with no license charge is not automatically free to operate.</p>
    </section>
    <section id="exit" aria-labelledby="exit-title">
      <h2 id="exit-title">Test routine work and an eventual exit</h2>
      <p>Have the people who run the store create a product, correct an order and investigate a failed integration. The tool should fit their responsibilities, not merely impress the person selecting it. Record any steps that require a developer and confirm that ongoing capacity is available.</p>
      <p>Use a test environment and the provider’s supported test payment method to check checkout on a phone and a desktop. Include a declined payment, a refund and the order emails. Check how staff identify the result in both the store and the payment account.</p>
      <p>Before committing, inspect sample exports for products, orders and other records you need. Clarify which assets and saved payment arrangements can move, under what permissions and at what cost. An export button alone does not guarantee a complete migration.</p>
      <p>Shopify’s documentation illustrates that distinction: orders can be exported, but importing them into another Shopify store requires an app or the API rather than the standard admin import. Apps must be reinstalled and settings such as shipping and payments reconfigured. Check the destination’s import process as well as the source’s export.</p>
      <p>Choose the platform that meets the essential requirements and that your team can operate after launch. Keep the test results, support responsibilities and cost assumptions together so the decision can be reviewed as the business changes. Our <Link href="/company/blog/create-an-online-shop" prefetch={false}>online shop setup article</Link> covers the next steps.</p>
    </section>
  </BlogArticlePage>;
}

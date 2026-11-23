import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { checkoutPlacementArticle } from "./checkout-placement-content";

export function CheckoutPlacementPage() {
  return <BlogArticlePage article={checkoutPlacementArticle}>
    <p>An embedded card form keeps the payment experience visually close to the store. For a business that has invested heavily in its website, that is an understandable attraction. A separate payment experience can feel like handing the customer away at the last moment.</p>
    <p>The decision lasts longer than the design review. Once the site is open, someone still has to answer the customer whose payment went through but whose order did not update. That responsibility remains wherever the card form sits.</p>
    <p>PayPal distinguishes its hosted Checkout from the customizable embedded experience in Expanded Checkout. Availability, methods and implementation depend on the selected product and eligible account. The comparison is between actual payment arrangements, not two interchangeable designs a merchant can select after signing.</p>

    <section id="the-work-behind-the-form" aria-labelledby="the-work-behind-the-form-title">
      <h2 id="the-work-behind-the-form-title">Decide who will maintain the experience</h2>
    <p>A launch budget can buy an integration without buying a lasting way to maintain it. A merchant using a managed website may reasonably prefer the supported checkout its software already maintains. Another business may have a team able to own a more tailored integration. The relevant capacity is the help available after launch, including ordinary updates and awkward payment questions, rather than only the developer available to build the first version.</p>
    <p>Ask who will handle a failed order update, a changed integration requirement or a payment that succeeds while the customer loses their connection. Find out how staff issue refunds and locate the payment behind an order. Hosting the card fields elsewhere does not, by itself, settle those operating responsibilities or remove the merchant’s security obligations.</p>
    <p>The customer’s experience also reaches beyond the location of the card fields. On an actual phone, examine whether the seller and total remain clear, whether a declined payment can be corrected without rebuilding the order and whether the final screen accurately reflects the payment status. A visually continuous page can still leave the buyer unsure what happened. What matters is whether the customer can understand the result and the next step.</p>
    </section>

    <section id="choose-for-the-store" aria-labelledby="choose-for-the-store-title">
      <h2 id="choose-for-the-store-title">Fit the checkout to the store you can operate</h2>
    <p>For a Trolleys merchant, start with the approved account and the <Link href="/services/payment-methods" prefetch={false}>connection supported by the website platform</Link>. Our Shopify and WooCommerce guides describe specific Cybersource arrangements. A PayPal product comparison does not establish that those features are included in a Trolleys account.</p>
    <p>A tailored form earns its extra work when it addresses a concrete customer need and the business can support the result. A supported hosted flow may be a better fit for another team. The decision should leave the owner able to explain both why the customer experience works and who will take responsibility when it does not.</p>
    </section>
  </BlogArticlePage>;
}

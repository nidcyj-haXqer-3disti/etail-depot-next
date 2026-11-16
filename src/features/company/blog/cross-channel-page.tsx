import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { crossChannelArticle } from "./cross-channel-content";

export function CrossChannelPage() {
  return <BlogArticlePage article={crossChannelArticle}>
    <p>A customer pays online and comes to collect their purchase. The person at the counter can find the item but cannot find the payment. Now the customer is searching through email while someone calls the colleague who handles the website.</p>
    <p>This can happen even in a business with a good online checkout and a perfectly functional card reader. Both places can take money. Neither necessarily tells the other what happened.</p>
    <p>Accepting payments online and in person means deciding how the sale continues when the customer changes channels. They may pay before visiting, pay a deposit and settle later, or bring back something bought online. To the customer, these are dealings with one business. They should not need to understand which system owns each part.</p>
    <p>That does not mean trusting a screenshot instead of checking a payment. It means giving staff a dependable way to find the business’s own records. An order number should start that lookup. The customer’s bank app should not have to stand in for a missing connection between your systems.</p>

    <section id="one-order-several-payments" aria-labelledby="one-order-several-payments-title">
      <h2 id="one-order-several-payments-title">One order can have several payments</h2>
      <p>A deposit paid online and a balance collected in person belong to the same purchase, but they are separate payments. Staff need to see both, along with what remains due. Recreating the whole sale at the counter because the deposit is hard to find makes the records less useful precisely when someone needs them.</p>
      <p>The order should explain what the customer bought. Its associated payment records should explain how much was collected, through which method and with what result. A completed order form is not proof that money was collected, and an <Link href="/company/blog/card-authorization" prefetch={false}>authorization</Link> should not be mistaken for a completed charge. Decide which payment status allows collection or fulfillment in your actual setup.</p>
      <p>There are products designed to make these relationships visible. Square’s Orders API connects purchase details and fulfillment with payment activity, including activity from its point of sale, invoices and integrations. Shopify documents an Orders screen in its POS that includes online and in-person orders. Those are concrete capabilities to examine when comparing systems, rather than assuming that a shared provider name means every record is already connected.</p>
      <p>Partial payments deserve a demonstration of their own. Shopify POS, for example, can retrieve a partially paid order and collect its outstanding balance when the relevant options are enabled, subject to its restrictions. Ask how your proposed setup handles a deposit taken through your particular website. Seeing two successful payments is less useful than seeing the correct balance on the original order.</p>
    </section>

    <section id="return-at-the-counter" aria-labelledby="return-at-the-counter-title">
      <h2 id="return-at-the-counter-title">The return at the counter is the revealing test</h2>
      <p>A customer bringing an online purchase back to a shop exposes more than a payment connection. Can the employee find the sale? Are they allowed to refund it? Does the item go back into that location’s inventory? Will the customer receive a clear record of what was returned?</p>
      <p>Shopify’s POS documentation separates these responsibilities. Staff need return and exchange permissions, and additional permissions govern actions such as restocking. Its refund guidance also notes that some orders from third-party channels must be refunded through the admin instead of the POS app. Being able to display an order does not necessarily mean every action is available from that screen.</p>
      <p>There can be consequences for unfinished orders too. Shopify warns that editing an order paid through multiple payments, or refunding or exchanging an item on it, prevents additional payments on that order in the described POS flow. That is exactly the sort of restriction a business taking deposits should discover before a customer asks to change the purchase.</p>
      <p>Your return policy should fit what staff can actually carry out. If a different team must complete a refund, arrange the handoff and explain the next step to the customer. A returned item, a refund request and a completed refund are separate events. Our <Link href="/services/refunds" prefetch={false}>refunds page</Link> looks at following the money back to the original payment.</p>
    </section>

    <section id="demonstrate-the-handoff" aria-labelledby="demonstrate-the-handoff-title">
      <h2 id="demonstrate-the-handoff-title">Ask the provider to finish the difficult sale</h2>
      <p>A sales demonstration often ends once the terminal approves a payment. Keep it going. Have the provider retrieve an online order from the counter, recognize an existing payment, collect an outstanding balance and handle a later return. Use the software, permissions and locations you intend to operate, not an unrelated demonstration account with every feature enabled.</p>
      <p>Then ask what happens when the result does not arrive. Adyen’s terminal documentation recommends checking the original transaction’s status when a payment response is missing. A missing response should not become an instruction to collect again through the website. Staff need a supported way to resolve the first attempt and a person to contact when they cannot.</p>
      <p>One provider may reduce the number of places your team works. Separate providers can also be workable when references, reports and responsibilities are clear. Compare the work each arrangement leaves behind: finding payments, matching deposits, managing returns and answering customers. Include software, devices, integration and ongoing support in the decision, alongside transaction charges. Confirm that the provider supports your business and both acceptance channels before committing to equipment.</p>
      <p>The strongest demonstration is one your staff can repeat without the salesperson. Let the person who normally handles collections or returns try it. If they can find the order, understand its balance and explain the next step, the connection is doing useful work. Your customer can get back to the purchase instead of helping your systems find each other.</p>
    </section>
  </BlogArticlePage>;
}

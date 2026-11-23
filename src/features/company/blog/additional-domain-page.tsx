import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { additionalDomainArticle } from "./additional-domain-content";

export function AdditionalDomainPage() {
  return <BlogArticlePage article={additionalDomainArticle}>
    <p>Copying a storefront is easy to mistake for copying a business. The second site can use the same inventory, platform and checkout settings while presenting customers with a different name and offer.</p>
    <p>That difference follows the purchase. A buyer who knows only the new brand may not recognize the name on the receipt, know where to ask for a refund or understand why the payment appears elsewhere.</p>
    <p>Before launch, the business needs an answer that works from both sides: which account should receive the sale, and which seller will the customer believe they paid?</p>

    <section id="same-owner" aria-labelledby="same-owner-title">
      <h2 id="same-owner-title">Start with what the second site actually sells.</h2>
    <p>Is this another website for the same legal seller and approved activity, another DBA, or a store run by a different company? Identify the products, delivery arrangement and customer terms. Shared ownership does not answer all of those questions.</p>
    <p>Trolleys’ activation confirmation identifies approved websites and account conditions. Ask how the additional domain should be recorded and whether the proposed activity needs further review or a separate account. Do not treat a successful connection as that answer.</p>
    <p>The customer-facing details should tell the same story without requiring the customer to know the company structure. Imagine a buyer ordering from the new brand and receiving a receipt headed with the original store’s name. Internally, both names may be familiar. To this buyer, the unexplained change can make a legitimate charge hard to recognize. Identify the seller clearly and explain the relationship wherever the purchase record would otherwise appear to change identity.</p>
    </section>

    <section id="connection-and-records" aria-labelledby="connection-and-records-title">
      <h2 id="connection-and-records-title">Test the new address as a new customer journey.</h2>
    <p>Use the setup instructions for the actual gateway and integration. Confirm permitted website settings, return destinations and enabled methods for this domain. Keep secret keys on the server through the approved connection; copying them into page code is not a shortcut.</p>
    <p>Wallet setup deserves a separate check. Cybersource’s Apple Pay documentation states that each merchant domain processing Apple Pay must be registered. Follow the applicable integration’s registration process rather than assuming verification of the first store covers every later domain.</p>
    <p>An approved test should follow the order beyond the payment screen. Confirm that it reaches the intended merchant account and carries a usable order reference. Then give the customer-facing receipt to the person who will answer support requests. Can they locate the purchase and identify the storefront without help from the developer? This checks whether the two brands remain distinguishable where staff need the distinction. Check the receipt and the return from the payment page on desktop and phone too.</p>
    <p>Our <Link href="/developers/getting-started" prefetch={false}>developer guidance</Link> explains the account and gateway handoff. Keep the business approval and technical testing connected, while recognizing that each answers a different question.</p>
    <p>The second domain introduces the business to customers who may never have seen the first one. Their receipt should be enough to start a useful support conversation. If it only makes sense to someone who already knows both brands, the storefront has copied the connection without finishing the customer journey.</p>
    </section>
  </BlogArticlePage>;
}

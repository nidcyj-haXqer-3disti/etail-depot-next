import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { walletContinuityArticle } from "./wallet-continuity-content";

export function WalletContinuityPage() {
  return <BlogArticlePage article={walletContinuityArticle}>
    <p>The new checkout displays the same wallet logo as the old one. A customer makes a new purchase successfully. The team concludes that the wallet migration worked.</p>
    <p>That test establishes something narrower: a customer could make that new purchase. It does not establish that an existing saved payment arrangement can continue charging through the new connection.</p>

    <section id="identify-what-was-saved" aria-labelledby="identify-what-was-saved-title">
      <h2 id="identify-what-was-saved-title">Find out what the business is actually using</h2>
    <p>A wallet button, a provider’s stored reference and a network token describe different parts of the payment experience. EMVCo explains that payment tokens can be restricted to a particular merchant, device or payment scenario. The same cardholder and logo therefore do not imply a credential can be used through any account.</p>
    <p>Provider transfer rules also differ. Stripe excludes Link credentials from its card exports. Shopify documents separate treatment for wallet credentials and PayPal billing agreements in its migration guidance. These are specific product boundaries, not reasons to assume every wallet must be abandoned or every customer must enter a card again.</p>
    <p>Ask which existing payment arrangements are in use, where they are held and what the proposed change affects. The provider should distinguish a new wallet purchase from a saved method used for a later merchant-initiated collection.</p>
    </section>

    <section id="verify-the-next-use" aria-labelledby="verify-the-next-use-title">
      <h2 id="verify-the-next-use-title">Test the future action you depend on</h2>
    <p>For a business that relies on repeat billing, the revealing case is the customer who does nothing during the change. Can that customer’s next agreed collection continue through the exact arrangement, or is fresh approval needed? A shopper who returns and actively approves a new wallet purchase cannot answer that question for them. A technical transfer must preserve the permitted use; it cannot create broader authorization than the customer gave.</p>
    <p>Check the new checkout’s wallet setup separately, including any account or domain requirements. Where fresh customer approval is required, use the provider’s supported secure process and explain the change through a recognizable channel. Do not ask customers to send underlying card credentials to reconstruct a wallet arrangement manually.</p>
    <p>For Trolleys, wallet availability depends on the approved account and integration. The <Link href="/developers/getting-started" prefetch={false}>Developer guidance</Link> separates account activation, gateway configuration and wallet setup. None is a blanket promise that a previous provider’s saved credentials will transfer.</p>
    <p>Keep the two conclusions separate in the migration record: new wallet purchases work, and existing billing arrangements have a confirmed next step. The first can be true while the second remains unresolved. That is the gap a familiar button can conceal.</p>
    </section>
  </BlogArticlePage>;
}

import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardNetworksArticle } from "./card-networks-content";

export function CardNetworksPage() {
  return <BlogArticlePage article={cardNetworksArticle}>
    <p>Visa, Mastercard, American Express and Discover are familiar names at checkout. For a merchant, knowing what sits behind those marks helps with more practical questions: Can this customer pay? Who handles a problem? Which charges apply to the transaction?</p>
    <section id="different-roles" aria-labelledby="different-roles-title">
      <h2 id="different-roles-title">Separate the network from the issuer</h2>
      <p>A card can carry both a bank’s name and a network logo. The <strong>issuer</strong> provides the customer’s card account. The <strong>network</strong> connects payment participants under its operating rules. The <strong>acquirer</strong> is the financial institution on the merchant side of acceptance.</p>
      <p>A gateway and processor connect your checkout to that arrangement. They are not interchangeable names for the card network. Your provider may bring several services together, but the responsibilities still matter when you need help.</p>
      <p>Some payment groups perform more than one role. Others work through separate issuing and acquiring institutions. Rather than assuming every brand has the same structure, confirm which organizations handle your merchant account, processing and support. The <Link href="/company/blog/merchant-accounts-and-acquiring" prefetch={false}>merchant accounts and acquiring guide</Link> explains that relationship.</p>
    </section>
    <section id="payment-flow" aria-labelledby="payment-flow-title">
      <h2 id="payment-flow-title">Follow the network’s role</h2>
      <p>For a typical card purchase, the network helps carry the authorization request from the merchant side to the issuer and returns the response. The customer sees the result at checkout. An approval is one stage of the payment, not confirmation that money has reached your bank.</p>
      <p>After capture, <strong>clearing</strong> exchanges the transaction details needed to account for the payment. <strong>Settlement</strong> handles the financial obligations between the participating institutions. Networks provide services that support these processes.</p>
      <p>Your merchant payout is a separate account event. Its timing and amount follow your processing arrangement, including applicable fees and adjustments. A network logo does not promise a particular deposit date. Read more about <Link href="/company/blog/card-authorization" prefetch={false}>card authorization</Link> and <Link href="/services/payouts" prefetch={false}>merchant payouts</Link>.</p>
    </section>
    <section id="acceptance" aria-labelledby="acceptance-title">
      <h2 id="acceptance-title">Check acceptance before adding a logo</h2>
      <p>Suppose customers ask whether your store accepts another card brand. Adding its logo to the page will not enable processing. Check the account agreement, provider activation and checkout configuration first.</p>
      <ul>
        <li><strong>Account coverage:</strong> Confirm the enabled brands and card types, including any relevant credit, debit, prepaid or commercial card conditions.</li>
        <li><strong>Customer coverage:</strong> Check supported countries and currencies for the customers you intend to serve.</li>
        <li><strong>Checkout behavior:</strong> Test the enabled method using the provider’s approved test setup, including an unsuccessful attempt.</li>
        <li><strong>After the payment:</strong> Confirm that your team can find the transaction, follow its status and handle a supported refund.</li>
      </ul>
      <p>A successful domestic test does not establish that every international card will work. It verifies the particular case tested. Keep the displayed payment options consistent with what the account and checkout actually support.</p>
      <p>Trolleys’ <Link href="/services/payment-methods" prefetch={false}>payment methods page</Link> lists cards through the configured checkout, with availability dependent on account setup. It is the starting point for a setup discussion, not a promise that every brand and transaction type is automatically enabled.</p>
    </section>
    <section id="cost" aria-labelledby="cost-title">
      <h2 id="cost-title">Read fees at the right level</h2>
      <p>The price your business pays can include several components. <strong>Interchange</strong> is a fee exchanged between the acquiring and issuing sides. Network charges and the provider’s processing and service charges are separate components of the overall arrangement.</p>
      <p>Your merchant pricing may combine these costs into a blended rate or show some of them separately. Visa distinguishes interchange between financial institutions from the merchant price negotiated with the acquiring institution. An interchange table is not a complete quote for your business.</p>
      <p>Two cards with the same network logo can have different underlying cost categories. Compare your agreement against the cards your customers use, how they pay and the countries involved. Do not rank a brand as always cheaper or more expensive based on its logo.</p>
      <p>For merchants using Trolleys, an Etail Depot service, review the <Link href="/pricing" prefetch={false}>current pricing page</Link> and your accepted fee schedule. Keep processing costs separate from the amount of a particular payout, which can also reflect refunds or other account adjustments.</p>
    </section>
    <section id="rules-and-support" aria-labelledby="rules-and-support-title">
      <h2 id="rules-and-support-title">Know the rules and support route</h2>
      <p>Card acceptance brings operating requirements as well as a payment option. Confirm the rules that apply to your business and location, including receipts, acceptance practices and any proposed charge to the customer. Visa’s published rules distinguish regional requirements and direct merchants to their acquirer agreement for additional conditions.</p>
      <p>For a checkout or processing issue, start with your merchant service provider and the transaction reference. Match the correct merchant account and payment attempt. A customer asking about their card account, available balance or a transaction on their statement should contact the card issuer through its official support channel.</p>
      <p>If a payment is declined or its outcome is uncertain, check the recorded result before asking the customer to try again. The <Link href="/company/blog/credit-card-declines" prefetch={false}>decline and retry guide</Link> explains that follow-up. Clear records and the right support contact are more useful than treating every issue as a problem with the network.</p>
    </section>
  </BlogArticlePage>;
}

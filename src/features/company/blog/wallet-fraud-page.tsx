import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { walletFraudArticle } from "./wallet-fraud-content";

export function WalletFraudPage() {
  return <BlogArticlePage article={walletFraudArticle}>
    <p>Consider an order paid through a digital wallet. The payment is approved, the receipt is sent and the warehouse is ready to pack. Then an email arrives asking for delivery to a different address. It includes a screenshot of the wallet and a request to hurry.</p>
    <p>The order might be legitimate. So might the change. But the approved payment does not establish who sent that email or whether the new destination is authorized.</p>
    <p>This is where a useful payment feature can become an unhelpful assumption. Digital wallets can make checkout easier and protect payment credentials. They do not make every surrounding account, message or fulfillment decision trustworthy.</p>
    <p>A merchant needs to understand the protection without asking it to do a job it was never designed to do.</p>

    <section id="before-the-wallet-button" aria-labelledby="before-the-wallet-button-title">
      <h2 id="before-the-wallet-button-title">The story starts before the customer pays</h2>
      <p>Adding a card to a wallet and using it for a purchase are separate events. Apple’s provisioning documentation says the card issuer or its authorized service provider decides whether to approve adding a card to Apple Wallet. Your store does not make that enrollment decision simply because it accepts Apple Pay.</p>
      <p>Apple Pay then protects the payment with a Device Account Number and a security code specific to the transaction. The actual card number is not sent to the merchant’s app in that flow. That reduces exposure of the underlying credential; it does not establish that every later message about the order came from the buyer.</p>
      <p>Keep the participants separate when something appears wrong. An unrecognized card enrollment belongs with the issuer through a trusted channel. A lost device or compromised wallet account belongs in the wallet provider’s official recovery process. A changed delivery instruction belongs in your order review. Fixing one does not automatically resolve the others.</p>
      <p>Apple, for example, provides Lost Mode and card suspension options for a missing device. A merchant should not try to solve that problem by asking the customer to email a full card number or a device passcode.</p>
    </section>

    <section id="review-the-change" aria-labelledby="review-the-change-title">
      <h2 id="review-the-change-title">Review what changed after checkout</h2>
      <p>Return to the delivery email. The useful question is whether the requested change is authorized, not whether the screenshot contains a familiar wallet logo.</p>
      <p>Use the established customer channel and your order-change policy to verify the request. Do not rely only on the new phone number or email address supplied in the message. Keep the original destination, the requested change and the decision together with the order. If the concern cannot be resolved, follow the agreed hold or cancellation procedure before releasing the goods.</p>
      <p>An address change is a reason to look closer, not proof of fraud. Customers make mistakes, send gifts and change plans. A measured review protects those customers too. Ask for the information needed to resolve the specific concern rather than collecting identity documents by default.</p>
      <p><strong>Payment approval answers a payment question. A delivery change asks a new one.</strong></p>
      <p>The same principle applies to customer accounts. A familiar order history does not settle who controls the account today. If access appears compromised, coordinate the order review with the website’s recovery process. Our <Link href="/company/blog/account-takeover-fraud" prefetch={false}>account takeover article</Link> explains why simply trusting an existing login can miss the problem.</p>
    </section>

    <section id="check-the-actual-protection" aria-labelledby="check-the-actual-protection-title">
      <h2 id="check-the-actual-protection-title">Check the protection on the actual transaction</h2>
      <p>A wallet name is not a complete description of the payment. Google Pay documentation distinguishes cards saved to a Google Account from authenticated device tokens. It also explicitly tells merchants to keep their existing risk checks: Google’s checks do not replace the merchant’s risk management.</p>
      <p>That distinction matters when someone says wallet payments are covered against fraud. Liability protection depends on the applicable network rules and transaction conditions. Google says liability shift availability depends on the card network. Stripe’s Apple Pay documentation likewise describes eligibility conditions while confirming that customers can still dispute completed payments.</p>
      <p>Ask your payment provider what applies to the specific transaction and claim. Protection against an eligible unauthorized-payment dispute is not a substitute for proving delivery when the customer says the goods never arrived. A wallet logo cannot answer both questions.</p>
      <p>Preserve the gateway reference, original order, payment result, customer correspondence and relevant fulfillment records. Use the actual dispute reason and deadline to decide what evidence is needed. Do not assume a case can be ignored because authentication succeeded.</p>
      <p>If a refund is appropriate, use the supported action linked to the original payment. A request to return the money to a different card, bank account or wallet needs scrutiny. If the payment is already disputed, follow the case instructions before issuing a refund so that one problem does not become two credits.</p>
    </section>

    <section id="give-the-team-a-clear-handoff" aria-labelledby="give-the-team-a-clear-handoff-title">
      <h2 id="give-the-team-a-clear-handoff-title">Give the team a clear handoff</h2>
      <p>Trolleys, an Etail Depot service, supports digital wallets through the <Link href="/services/payment-methods" prefetch={false}>payment methods enabled for your merchant account</Link>. Before launch, connect the payment result to the order and decide who reviews unusual changes, who can issue refunds and who responds to a dispute.</p>
      <p>For Trolleys merchants, the gateway payment record and the merchant account record should remain traceable to the same sale. Our <Link href="/services/disputes" prefetch={false}>dispute management service</Link> focuses on the claim, deadline and supporting records. It does not turn wallet acceptance into a guarantee against losses or an automatic decision in your favor.</p>
      <p>When <Link href="/company/contact" prefetch={false}>bringing a payment concern to our team</Link>, identify the affected account, order, transaction and what changed. Share relevant evidence through the requested secure channel. The issuer handles card enrollment concerns, the wallet provider handles its account or device controls, and your business remains responsible for its fulfillment decisions.</p>
    </section>

    <p>Keep the convenient checkout. Keep the useful security. Then give the rest of the sale the same care: a verified change, a traceable order and a response based on what actually happened.</p>
  </BlogArticlePage>;
}

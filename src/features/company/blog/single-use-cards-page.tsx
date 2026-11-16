import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { singleUseCardsArticle } from "./single-use-cards-content";

export function SingleUseCardsPage() {
  return <BlogArticlePage article={singleUseCardsArticle}>
    <p>One order. One checkout. One card that will stop working afterward. It sounds like a tidy way to pay until the supplier sends the order in two shipments.</p>
    <p>Consider a company buying supplies that leave different warehouses. The first shipment is paid for. When the supplier asks for approval to charge for the second, the card has already closed. The buyer intended to authorize the whole order. The card followed a narrower instruction.</p>
    <p>That is the useful limitation to understand about single-use credit cards. Usually provided as a <Link href="/company/blog/virtual-credit-cards" prefetch={false}>virtual card number</Link>, the credential is configured to stop accepting new payment approvals after a qualifying use. “Single use” describes a restriction on the number. It does not, by itself, tell you how the account is funded or what repayment terms apply.</p>
    <section id="order-and-approval" aria-labelledby="order-and-approval-title">
      <h2 id="order-and-approval-title">The checkout is one event. Fulfillment may be several.</h2>
      <p>A buyer sees an order total and a confirmation number. Behind that confirmation, the seller may need to deal with separate warehouses, different shipping dates or an item that is not yet available. Payment can follow those events.</p>
      <p>Amazon Pay’s customer FAQ describes a familiar result: a single order can produce several charges as items ship. That is a reason to compare the shipment records with the payments before treating every extra entry as a duplicate.</p>
      <p>But several charges do not necessarily mean several approvals. <Link href="/company/blog/card-authorization" prefetch={false}>Authorization</Link> is the request for permission to take payment; capture is the later collection against an approval. Some payment arrangements let a seller capture portions of one authorized amount as an order ships. Stripe documents that capability, with eligibility and network restrictions.</p>
      <p>The distinction matters for a single-use card. A later capture against an existing approval is different from a fresh authorization request. The opening scenario becomes a problem when the seller needs another approval after the card has closed. It does not mean that every split shipment will fail.</p>
      <p>Before choosing the card for an order that may ship in parts, find out how the supplier will collect payment. “One order” on the receipt is not enough information.</p>
    </section>
    <section id="what-counts-as-use" aria-labelledby="what-counts-as-use-title">
      <h2 id="what-counts-as-use-title">“Used” is a decision made by the card provider</h2>
      <p>The next surprise is timing. A card can reach its usage limit when a payment is approved, before the seller collects the money and before any goods arrive.</p>
      <p>Stripe Issuing’s lifecycle controls count qualifying approved authorizations toward automatic cancellation. They treat small card checks differently from purchases, and a declined authorization does not consume a use. The precise rules matter more than the label on the card.</p>
      <p>Privacy illustrates why those rules cannot be assumed across providers. Its single-use cards can close immediately after a qualifying approval. It also documents a different outcome after an initial decline: the card closes automatically 24 hours later, leaving a window to retry. A failed attempt can therefore affect how long that particular card remains available.</p>
      <p>For a buyer, the practical question is whether the number will still work when the seller next needs it. A retry tomorrow, a delayed shipment or a changed order can be legitimate and still fall outside the card’s remaining use.</p>
      <p>The restriction is useful when it fits the purchase. It limits reuse of the credential after the intended payment. For an order with uncertain timing or several expected payment requests, a reusable card with suitable spending controls may fit better. That is a purchasing decision to make from the actual provider terms and supplier process.</p>
    </section>
    <section id="unfinished-purchase" aria-labelledby="unfinished-purchase-title">
      <h2 id="unfinished-purchase-title">Replace the payment, not the purchase</h2>
      <p>If a later payment is declined, resist starting a second order just to get through checkout. First establish what the supplier has already accepted, what has shipped and which amount remains unpaid. Replacing the payment method on the existing order is a different instruction from ordering the goods again.</p>
      <p>A closed card also does not erase an earlier approval. Privacy explicitly says that closing a card prevents future authorizations while previous approvals are honored under payment network rules. A charge appearing after closure is therefore not, on its own, proof that the restriction failed.</p>
      <p>Ask the card provider to distinguish a new authorization from the completion of an earlier one. Compare that explanation with the supplier’s order and shipment records. If the payment is still unexplained, use the provider’s dispute process rather than assuming the closed number settles the question.</p>
      <p>For a finance team, the record worth keeping is the connection between the order, the card used and the payments that completed it. That connection still matters after the number can no longer buy anything.</p>
      <p>A single-use card can be finished with a purchase before the business is. Choose the restriction around how the order will be paid, not just how simple the checkout looks.</p>
    </section>
  </BlogArticlePage>;
}

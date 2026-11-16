import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardLifecycleArticle } from "./card-lifecycle-content";

export function CardLifecyclePage() {
  return <BlogArticlePage article={cardLifecycleArticle}>
    <p>A worn chip and a stolen wallet can both lead to a replacement card arriving in the mail. While that envelope is on its way, the two customers have different needs. One wants to keep buying normally. The other needs confidence that the missing card cannot keep being used.</p>
    <p>For a business operating a card program, the replacement is a test of how well the account holds together. The customer may still have a purchase waiting to complete, a refund coming back and bills due through saved payment details. Sending a new card resolves only part of that situation.</p>
    <p>Credit card lifecycle management covers activation, ongoing use, suspension, replacement and retirement. Its harder work is keeping those changes connected to the right account, payment records and customer instructions. A status that says “replaced” is useful only if someone can explain what changed.</p>
    <section id="replacement-reason" aria-labelledby="replacement-reason-title">
      <h2 id="replacement-reason-title">Keep the reason attached to the replacement</h2>
      <p>A temporary lock while someone looks for a misplaced card serves a different purpose from reporting theft. Capital One, for example, describes unlocking a recovered card after a temporary lock. A lost or stolen report instead triggers restriction and replacement with a new number. Suspected compromise needs the issuer’s reporting process, not just a request for fresh plastic.</p>
      <p>That reason can affect the replacement details, too. Stripe Issuing permits the same card number for expired or damaged replacements, while lost or stolen replacements require the original card to be canceled and receive a new number. These are that provider’s rules. A program needs to establish its own issuer’s behavior rather than assume every replacement works alike.</p>
      <p>The customer should learn what they can use while waiting and what needs activation when the replacement arrives. Those answers belong in the confirmation, alongside the reason for replacement. Leaving them to a later declined purchase turns an ordinary service request into another support problem.</p>
      <p>Digital wallets have their own continuity rules. Chase says a replacement card is usually associated with the existing Apple Pay device account number. If that association cannot be made, the wallet can show the card as inactive and require it to be added again. That is a specific issuer and wallet arrangement, not a promise that every wallet updates automatically.</p>
    </section>
    <section id="continuing-records" aria-labelledby="continuing-records-title">
      <h2 id="continuing-records-title">The old number still has a history</h2>
      <p>A customer should not lose sight of a purchase because the app now displays a different card. Stripe’s replacement documentation notes that authorizations can move to the replacement while still clearing on the original card. An interface that shows only the latest card’s activity can therefore tell an incomplete story.</p>
      <p>Preserve the relationship between the account, the old credential, its replacement and the transactions in progress. Customer service needs enough of that history to answer a question without asking the customer to reconstruct it. Use appropriate masked references and access controls rather than copying complete card details into support notes.</p>
      <p>Consider a return made just before the card is replaced. The merchant has confirmed the refund, but the credit has not appeared. The new number does not, by itself, explain where the money is or establish that the refund failed.</p>
      <p>Stripe’s refund documentation says refunds to expired or canceled cards are handled by the issuer and usually credited to the replacement. It also documents failures, so automatic routing should not be guaranteed. Support needs the original payment, the refund reference and its actual status before deciding how to investigate.</p>
      <p>The merchant’s next move matters here. Follow the provider’s refund process for the original payment. Do not send a second reimbursement elsewhere simply because the customer has a new card number. Establish what happened to the first refund and resolve a confirmed failure through the applicable process.</p>
      <p>Retiring a credential should leave the necessary history available. Closing the underlying account is a separate action with its own treatment of balances, statements and unresolved activity. The account’s terms and issuer process determine what remains to be completed.</p>
    </section>
    <section id="customer-continuity" aria-labelledby="customer-continuity-title">
      <h2 id="customer-continuity-title">Tell the customer what continues</h2>
      <p>Saved payments are another reason to preserve the replacement reason. Stripe says it updates stored details for many of its card programs after expiry or damage, but does not provide those replacement details to businesses when the original is marked lost or stolen. A useful continuity feature can deliberately behave differently during a security incident.</p>
      <p>Other arrangements may differ. Visa Account Updater supports participating issuers and merchants, including updates following certain lost or stolen replacements. It can also return closed-account or contact-cardholder advice. An update can be received even when the associated payment is declined. The <Link href="/company/blog/credit-card-account-updater" prefetch={false}>account updater result</Link> and the payment result need separate attention.</p>
      <p>For the customer, the useful message answers ordinary questions: whether the old card is usable, whether the wallet needs attention, and which saved payments they should review. Give them a secure route to update details where needed. Avoid a blanket “everything will keep working” message that the program cannot support.</p>
      <p>For the team behind the card, test the transitions as carefully as the first purchase. Replace a damaged card while a purchase is pending. Replace a lost card with an expected refund. Renew a card used in a wallet and for recurring payments. For each case, check the customer view, the account records and the explanation support can provide. This is where <Link href="/company/blog/card-issuing-apis" prefetch={false}>card issuing capabilities</Link> become a service someone can rely on.</p>
      <p>The replacement is successful when the customer knows what is protected, what still works and what needs their attention. The account should carry its history forward, so the customer can carry on.</p>
    </section>
  </BlogArticlePage>;
}

import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { billingPortalsArticle } from "./billing-portals-content";

export function BillingPortalsPage() {
  return <BlogArticlePage article={billingPortalsArticle}>
    <p>A customer replaces an expired card, sees a confirmation and closes the tab. If the overdue invoice is still unpaid, have you helped them solve the problem they came to fix?</p>
    <p>The payment details may be correct now. The customer may still owe you money. Both can be true, and a message that says only saved leaves the customer to discover the difference in the next reminder.</p>
    <p>This is where a customer billing portal earns its place. It gives buyers access to their own invoices, payment details and subscriptions. But moving those controls out of your support inbox does not, by itself, make billing easier. The customer needs to understand what an action changes and whether anything remains to be done.</p>

    <section id="saved-is-not-paid" aria-labelledby="saved-is-not-paid-title">
      <h2 id="saved-is-not-paid-title">Saved is not paid</h2>
      <p>Changing a payment method and collecting a payment are separate events. Do not treat confirmation of the first as evidence of the second. Show the invoice’s actual status and explain whether the system will retry collection or the customer needs to take another action. Someone trying to put an account right should not have to guess which step is missing.</p>
      <p>The same distinction matters when customers leave. Stripe’s cancellation documentation separates the cancellation date from refund choices and final billing. A business can end a subscription immediately or schedule its end, with different treatment for credits, refunds and outstanding usage. The word canceled cannot explain all of that on its own.</p>
      <p>A useful confirmation tells the customer when the subscription ends, how long access continues under your terms, and whether a final charge or refund applies. If a cancellation is scheduled, say so. If a refund has only been requested, do not present it as completed. These details belong beside the decision, before the customer needs to ask for them.</p>
      <p>A change of plan deserves the same care. Customers need to see what they will pay now, when the new plan starts and what happens at renewal. Our article on <Link href="/company/blog/billing-models" prefetch={false}>billing models</Link> examines why the way you charge changes what customers need to understand about their bill.</p>
      <p>The portal also has to fit the subscriptions you actually sell. Stripe documents limits on portal updates for subscriptions with multiple products or usage-based billing, among other configurations. A feature listed on a provider’s website is not a promise that every account in your business can use it. Check the relevant configuration before telling customers they can manage everything themselves.</p>
    </section>

    <section id="who-handles-billing" aria-labelledby="who-handles-billing-title">
      <h2 id="who-handles-billing-title">The person paying may not own the account</h2>
      <p>In a business subscription, the employee using the product, the person who bought it and the finance team processing the invoice may be different people. A portal built only around the original purchaser can leave the person responsible for payment waiting for someone else to download a document.</p>
      <p>GitHub offers a useful example of separating those responsibilities. Its billing manager role can view payment history, download receipts and manage payment methods without granting access to the organization’s repositories. Enterprise-owned organizations use a different invitation arrangement. The relevant idea is that billing access has its own purpose and permissions.</p>
      <p>Decide which actions each customer role should be able to take. Downloading a receipt, replacing a payment method and canceling the company’s subscription need not be the same permission. Make the account being changed visible, particularly when one person manages several businesses or subscriptions. A confirmation should leave no doubt about which account it affects.</p>
      <p>These are product decisions as much as payment decisions. For a software business, the billing experience continues after checkout and after the original buyer changes jobs. Our article on <Link href="/company/blog/saas-payment-processing" prefetch={false}>SaaS payment processing</Link> looks at the wider relationship between subscriptions, collection and service access.</p>
    </section>

    <section id="last-screen" aria-labelledby="last-screen-title">
      <h2 id="last-screen-title">Read the last screen as a customer</h2>
      <p>When reviewing a portal, follow an ordinary task all the way through. Download an invoice on a phone. Change a billing detail using a keyboard. Return after a session has expired. Then read what the customer sees at the end, without relying on what your team knows happened behind the scenes.</p>
      <p>A success message needs to reach the person using the page. W3C’s guidance on status messages explains how assistive technology should be able to announce results without requiring the user to move focus to the message. A visible confirmation alone does not tell you whether someone using a screen reader received it.</p>
      <p>For an unsuccessful or interrupted action, explain what is known: whether the change was saved, where to check its status and how to get help. If the system cannot confirm the outcome, say that plainly. Sending the customer back to the beginning without that context makes it harder to know whether to try again.</p>
      <p>Support remains part of self-service. Give the customer a way to get help with the account or invoice already identified, rather than asking them to reconstruct the entire problem. A portal has done its job when someone can close it knowing what changed, what they owe and whether they need to do anything else.</p>
    </section>
  </BlogArticlePage>;
}

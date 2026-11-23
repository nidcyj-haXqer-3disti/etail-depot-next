import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { customerReentryArticle } from "./customer-reentry-content";

export function CustomerReentryPage() {
  return <BlogArticlePage article={customerReentryArticle}>
    <p>A customer who has paid reliably for months receives an email asking them to update their payment details. From the business’s perspective, it is routine migration work. From the customer’s perspective, it may look like a phishing attempt or an unexpected change to the service.</p>
    <p>That gap is a commercial risk the migration plan should address.</p>

    <section id="ask-only-the-affected-customers" aria-labelledby="ask-only-the-affected-customers-title">
      <h2 id="ask-only-the-affected-customers-title">First establish who actually needs to act</h2>
    <p>Do not send the entire customer base a payment-update request simply because the provider is changing. Determine which saved methods have a supported transfer, which require further work and which need the customer to enter details again. Keep unverified records separate from confirmed failures.</p>
    <p>Shopify’s migration guidance shows why the exact arrangement matters: some changes involving methods already stored in Shopify need no migration after confirmation, while other credentials and billing agreements require different handling. Neither “everyone must start again” nor “everything will move” is a safe general assumption.</p>
    <p>Give the affected group a clear explanation before the next collection is due. Identify the seller, the service and what remains unchanged. If the amount, terms or seller will change, deal with the required notice or agreement separately; a request to update a card should not conceal a new purchase.</p>
    </section>

    <section id="make-the-request-recognizable" aria-labelledby="make-the-request-recognizable-title">
      <h2 id="make-the-request-recognizable-title">Let the customer verify the request</h2>
    <p>Use the established account experience or another provider-approved secure route. Explain how the customer can reach it independently through the business’s usual website or support contact. Do not ask for full card numbers or security codes in an email reply, chat or shared document.</p>
    <p>Keep reminders tied to the actual outstanding action. A customer who has already updated successfully should not continue receiving requests. Decide how failed updates, expired links and customers who decline to continue will be handled under the existing agreement.</p>
    <p>For Trolleys merchants, the <Link href="/company/legal/security-policy#account-access" prefetch={false}>account security guidance</Link> applies to the team as well as the customer. Use authorized provider processes and avoid copying sensitive details into support notes to get the migration finished.</p>
    <p>The customer is doing extra work because the business changed its payment arrangement. Acknowledge that inconvenience, explain the purpose and make the route recognizable. Keeping a recurring customer’s confidence is more valuable than making the internal project appear effortless.</p>
    </section>
  </BlogArticlePage>;
}

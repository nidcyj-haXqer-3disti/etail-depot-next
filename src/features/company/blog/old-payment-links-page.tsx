import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { oldPaymentLinksArticle } from "./old-payment-links-content";

export function OldPaymentLinksPage() {
  return <BlogArticlePage article={oldPaymentLinksArticle}>
    <p>The website is using the new provider. The team has tested checkout and updated its internal instructions. A customer then pays an invoice from an email sent last month, through the old account.</p>
    <p>That possibility belongs in the migration plan. A payment link is a small sales channel with a life beyond the page where it was created. It may be in an invoice, a text conversation, a saved browser tab or a QR code on a printed document.</p>

    <section id="follow-the-link" aria-labelledby="follow-the-link-title">
      <h2 id="follow-the-link-title">Follow the customer’s copy</h2>
    <p>Start with the places customers actually receive payment requests. Identify the account behind each still-valid link and the obligation it collects. An unpaid invoice, a reusable product link and a subscription signup are different cases; replacing them with one generic new checkout can lose the context the customer needs.</p>
    <p>Stripe documents payment links shared by email, on websites and through QR codes. That distribution is their convenience and the reason a website-only update is incomplete. Changing a link in your own template does not rewrite messages or printed material already delivered.</p>
    <p>For each outstanding request, decide whether the old link can safely remain available or must be replaced through the provider’s supported controls. If it stays live, name the person who will notice a payment and stop further collection attempts for that invoice. Keeping a link available without monitoring its result preserves the customer’s way to pay but loses the business’s way to recognize the payment. If it is withdrawn, agree what the customer will see instead of an unexplained dead end.</p>
    </section>

    <section id="preserve-one-payment" aria-labelledby="preserve-one-payment-title">
      <h2 id="preserve-one-payment-title">Give the invoice one payment outcome</h2>
    <p>Before issuing a replacement request, verify the original payment status. A customer may have paid while the team was preparing the change. Match the invoice and account reference, including pending results, so the new link does not become a second request for money already collected.</p>
    <p>Explain a replacement through the business’s normal trusted channel. Preserve the invoice number, seller and amount unless there is a legitimate, separately explained change. Staff should be able to confirm the request without asking the customer to send card details by email.</p>
    <p>For Trolleys merchants, link availability and the handling of earlier payments depend on the approved service. <Link href="/company/legal/merchant-services#termination" prefetch={false}>Ending an account</Link> does not transfer links, credentials or outstanding obligations to a new provider. Establish the transition before withdrawing the old service.</p>
    <p>The switch is complete for a customer only when the payment request they hold still leads somewhere sensible. Their inbox does not know your website has moved.</p>
    </section>
  </BlogArticlePage>;
}

import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentIntegrationArticle } from "./payment-integration-content";
import s from "./blog.module.css";

const paymentEvidence = [
  ["The customer experience", "Where customers pay and how they return to the purchase.", "Complete a purchase on a phone, including a declined attempt."],
  ["The record connection", "Which payment results update which business records.", "Follow a sale and a partial refund back to the original order."],
  ["The merchant relationship", "Who provides the account, sets the terms and handles problems.", "Read the agreement alongside the support and account access arrangements."],
] as const;

export function PaymentIntegrationPage() {
  return <BlogArticlePage article={paymentIntegrationArticle}>
    <p>The demonstration ends with a successful payment. The button matches the software, the customer gets a receipt and everyone agrees that the experience looks good.</p>
    <p>Then someone asks where the refund will appear in the order history. The answer is a separate portal, a report and a manual update.</p>
    <p>That can still be a workable service. It is simply a different purchase from one that carries the payment result through the merchant’s existing work. The words “embedded” and “integrated” do not answer that question on their own.</p>
    <p>For a merchant choosing software, or a software company choosing a payment partner, the useful comparison starts with the work left to do after the demonstration ends.</p>

    <section id="what-the-labels-describe" aria-labelledby="what-the-labels-describe-title">
      <h2 id="what-the-labels-describe-title">One product can be both</h2>
      <p>Integrated payments generally describes a connection between payment processing and business software. Embedded payments generally emphasizes payments offered within the software’s own product experience. Providers also use these terms to distinguish commercial partnership models, so ask what each means in the proposal in front of you.</p>
      <p>An embedded payment experience still needs a technical integration. A connected payment service can include a provider page without requiring staff to copy every result by hand. The visible screen, the exchange of records and the commercial relationship deserve separate answers.</p>
      <table className={s.comparison}>
        <caption>Three things a payment label cannot settle</caption>
        <thead><tr><th scope="col">Compare</th><th scope="col">What it covers</th><th scope="col">Ask to see</th></tr></thead>
        <tbody>{paymentEvidence.map(([area, meaning, evidence]) => <tr key={area}>
          <th scope="row">{area}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it covers</span>{meaning}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Ask to see</span>{evidence}</td>
        </tr>)}</tbody>
      </table>
      <p>This distinction also matters before the first sale. Adyen’s platform documentation describes both provider hosted onboarding and an API approach using a platform’s own interface. Different enrollment screens can therefore sit within the same provider’s platform offering. The appearance alone does not tell you the whole account arrangement.</p>
      <p>A familiar logo or an uninterrupted screen is useful design. It does not establish who the seller is, who holds the merchant agreement or whether the software company may control funds. Those answers belong in the approved <Link href="/use-cases/software-platforms/payment-models" prefetch={false}>payment model</Link>.</p>
    </section>

    <section id="compare-the-work-left-behind" aria-labelledby="compare-the-work-left-behind-title">
      <h2 id="compare-the-work-left-behind-title">Compare the work left behind</h2>
      <p>Imagine choosing software for a business that takes deposits on custom orders. One proposal puts checkout inside the order screen. Another opens a payment provider’s page. Before picking the smoother looking option, follow what happens when the customer changes the order.</p>
      <p>Does the deposit remain attached to the right purchase? Can staff see the remaining balance? If part of the deposit is refunded, does the order show the adjustment, or does someone have to enter it again? These are questions for the actual connection being offered, not assumptions about either label.</p>
      <p>Ask the person demonstrating the product to make the change while you watch. A slide that says “connected reporting” is less informative than the original order, its payment reference and the adjustment appearing where staff expect them.</p>
      <p>Be precise about the software involved. A connection to one product does not establish support for every edition, extension or custom workflow. Record the version, payment methods, supported actions and responsibility for updates in the scope. A good demonstration should leave you with fewer unanswered questions about your own business.</p>
      <p>There is room for a sensible handoff. An occasional account maintenance task may work well in the <Link href="/resources/merchant-account-setup" prefetch={false}>Back Office Operations Portal</Link>. A task repeated throughout the day deserves closer attention. Price the staff time and confusion caused by that handoff alongside the quoted payment and software charges.</p>
    </section>

    <section id="the-agreement-behind-the-screen" aria-labelledby="the-agreement-behind-the-screen-title">
      <h2 id="the-agreement-behind-the-screen-title">Read the agreement behind the screen</h2>
      <p>Convenience is part of the buying decision. So are account access, support and the ability to change software later.</p>
      <p>Ask whether the proposed connection uses an existing merchant arrangement or requires a new one. Confirm who supplies the account, how charges are disclosed and which team can investigate a payment problem. A software subscription, a gateway connection and merchant services may have different terms even when they appear under one brand.</p>
      <p>Think past the start date. If you stop using the software, how will you retrieve the permitted records and service an earlier refund or dispute? Do not assume saved payment credentials can move to another provider. Any transfer needs a supported process and the relevant permissions. Put the exit arrangements alongside the onboarding plan.</p>
      <p>Security follows the implementation too. The PCI Security Standards Council distinguishes embedded payment forms from redirects when explaining a specific script security eligibility criterion for SAQ A. That is not a blanket exemption from PCI obligations for either design. Confirm the appropriate assessment and secure setup with the entity accepting your compliance validation.</p>
    </section>

    <section id="a-specific-trolleys-conversation" aria-labelledby="a-specific-trolleys-conversation-title">
      <h2 id="a-specific-trolleys-conversation-title">Bring the workflow to Trolleys</h2>
      <p>With <Link href="/use-cases/software-platforms/partnerships" prefetch={false}>Trolleys, an Etail Depot service</Link>, the starting point is the selling business and its merchant account. Each merchant is reviewed for its activity. A partnership with the software company does not automatically approve every business using the software.</p>
      <p>For a Cybersource Unified Checkout connection, the relevant gateway account and payment methods must be enabled before integration. The checkout interface is one part of the setup. Available records, permissions and delivery methods depend on the agreed integration. Our team supplies the documentation and configuration details so your developers can establish what the connection will support.</p>
      <p>A useful <Link href="/company/contact#platforms" prefetch={false}>partnership discussion</Link> starts with your current order or invoice, the point where payment happens and the tasks staff still perform afterward. From there, agree the account setup, supported payment actions, reporting and division of support. Processing, platform and implementation charges belong in that same conversation.</p>
      <p>You should be able to describe the improvement without using either product label: the payment matches the order, the refund is traceable and staff know where to get an answer. When you can demonstrate that in the agreed setup, you know what you are buying.</p>
    </section>
  </BlogArticlePage>;
}

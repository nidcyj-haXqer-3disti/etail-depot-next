import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { processorsIsosArticle } from "./processors-isos-content";
import s from "./blog.module.css";

const offerChecks = [
  ["Total cost", "What will we pay for processing, account services and the tools we need?", "A complete fee schedule, including applicable recurring, optional service and cancellation charges."],
  ["Checkout compatibility", "Does the proposed service support our website and required payment methods?", "The supported connection, account requirements and the team responsible for setup."],
  ["Ongoing support", "Who handles a failed payment, account change or funding question?", "Support hours, contact channels and an escalation route to the team that owns the issue."],
  ["Leaving the service", "What happens to our records, connected services and remaining obligations?", "The applicable notice periods, export options and separate agreements that need attention."],
] as const;

export function ProcessorsIsosPage() {
  return <BlogArticlePage article={processorsIsosArticle}>
    <p>The useful question is what each company will do for your business. A familiar sales contact, a checkout logo and a processing agreement may represent different parts of the same arrangement.</p>
    <section id="understand-the-service-chain" aria-labelledby="understand-the-service-chain-title">
      <h2 id="understand-the-service-chain-title">Identify the roles in the offer</h2>
      <p>In Visa’s acquiring classification, a merchant ISO can refer merchants, sell acceptance services and provide onboarding or customer support on an acquirer’s behalf. The ISO role itself does not include processing transactions or receiving settlement funds. A company performing additional functions may also fall into another registration category.</p>
      <p>A processor handles the technical transaction work, such as routing authorization messages and processing capture or settlement records. The ISO may be the company that introduced the service and remains your support contact, while another provider performs that processing.</p>
      <p>These labels describe functions, not necessarily separate companies. Visa’s classification guidance looks at what an entity actually does and for whom. A company name or sales title alone does not establish its responsibilities.</p>
      <p>Ask who is selling the service, which legal entities appear in the agreements and who provides the underlying processing. Our <Link href="/company/blog/payment-processor-vs-merchant-acquirer" prefetch={false}>processor and acquirer comparison</Link> explains the acquiring relationship separately.</p>
    </section>
    <section id="compare-what-you-receive" aria-labelledby="compare-what-you-receive-title">
      <h2 id="compare-what-you-receive-title">Compare what you receive</h2>
      <p>An ISO can provide useful setup assistance and ongoing support. A processor selling directly can offer those services too. The category alone does not tell you which offer will cost less, fit your website or handle a difficult support request better.</p>
      <p>Give each provider the same description of your business and compare the written answers:</p>
      <table className={s.comparison}>
        <caption>Four checks for either type of offer</caption>
        <thead><tr><th scope="col">Compare</th><th scope="col">Ask</th><th scope="col">Look for</th></tr></thead>
        <tbody>{offerChecks.map(([topic, question, evidence]) => <tr key={topic}>
          <th scope="row">{topic}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Ask</span>{question}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Look for</span>{evidence}</td>
        </tr>)}</tbody>
      </table>
      <p>A transaction rate is only part of the comparison. Include the account fees and services your business will actually use. If equipment is part of the offer, review any purchase or lease terms separately from processing.</p>
      <p>For a Trolleys proposal, use the current <Link href="/pricing" prefetch={false}>pricing page</Link> alongside the fee schedule and terms supplied for your account. This article does not replace those terms or establish a different price.</p>
    </section>
    <section id="test-support-ownership" aria-labelledby="test-support-ownership-title">
      <h2 id="test-support-ownership-title">Ask how a real problem will be handled</h2>
      <p>Consider an online store that buys payment services through an ISO. Its merchant account is approved, but the website connection is not ready. The sales relationship and account approval do not answer who will complete that connection.</p>
      <p>Before signing, ask the proposed provider to walk through that situation:</p>
      <ol>
        <li><strong>Name the setup contact.</strong> Who checks the account configuration and confirms the connection requirements?</li>
        <li><strong>Identify your team’s work.</strong> What must your website developer or store administrator complete?</li>
        <li><strong>Explain the handoff.</strong> If another provider must act, who coordinates the request and keeps you informed?</li>
        <li><strong>Define readiness.</strong> What checks confirm that checkout, payment records and the intended payment methods work before launch?</li>
      </ol>
      <p>A clear answer names the next action and its owner. “We provide a complete solution” does not explain the handoff. Ask for the expected response process without treating an estimate as a guaranteed resolution time.</p>
      <p>Etail’s <Link href="/developers/getting-started" prefetch={false}>after approval guide</Link> separates merchant portal access, gateway access, website connection and testing. It illustrates why an approved account still needs the appropriate setup before a store starts taking payments.</p>
    </section>
    <section id="review-before-signing" aria-labelledby="review-before-signing-title">
      <h2 id="review-before-signing-title">Keep the relationship clear after signing</h2>
      <p>Keep the signed agreements, fee schedule and support contacts together. Record which company handles billing questions, technical investigations and account decisions. Include the relevant store and merchant account references so a request reaches the right account.</p>
      <p>When a sales promise affects your decision, ask where it appears in the agreement or service scope. Check who can change pricing, who approves account changes and whether any software or equipment arrangement continues separately if you stop processing.</p>
      <p>If your contact changes, the service should still be understandable from the records you hold. Ask how another member of the provider’s team will take over an open request and how you can obtain the account records you need.</p>
      <p>For Trolleys’ United States program, the <Link href="/company/legal/acquirer-disclosure" prefetch={false}>acquirer disclosure</Link> identifies Trolleys’ payment facilitator arrangement and provider responsibilities. An ISO, processor and payment facilitator are distinct roles; use the arrangement documented for your account.</p>
      <p>Choose the service whose costs, responsibilities and support process you can explain clearly. That is more useful than choosing solely on whether the seller calls itself an ISO or a processor.</p>
    </section>
  </BlogArticlePage>;
}

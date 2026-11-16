import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { saasEmbeddedArticle } from "./saas-embedded-content";

export function SaasEmbeddedPage() {
  return <BlogArticlePage article={saasEmbeddedArticle}>
    <p>Your software knows who booked the appointment, which work was completed and what the customer owes. Then payment happens somewhere else, and the merchant has to bring the answer back.</p>
    <p>That gap is a better starting point for embedded payments than a revenue projection.</p>
    <p>For a software as a service business, or SaaS platform, embedded payments can connect a merchant’s customer payment to the work already happening in the product. The commercial appeal is understandable: another reason to use the software, fewer separate tasks and a possible source of income under the payment partnership. But each of those benefits needs to be earned in the merchant’s working day.</p>
    <p>With <Link href="/use-cases/software-platforms/partnerships" prefetch={false}>Trolleys, an Etail Depot service</Link>, the discussion begins with merchant accounts, the payment connection and who supports the resulting service. The useful question is specific: which job will your customer no longer have to do twice?</p>

    <section id="two-customers-two-payment-relationships" aria-labelledby="two-customers-two-payment-relationships-title">
      <h2 id="two-customers-two-payment-relationships-title">Your subscription and their sales are separate</h2>
      <p>A business pays you to use your software. Its customers pay that business for goods or services. Both payments might appear somewhere in your product, but they belong to different commercial relationships.</p>
      <p>Consider a shop that uses your software to manage repairs. Its monthly software bill is your sale. The repair invoice belongs to the shop. A member of staff refunding a repair needs permission over the shop’s payment, not access to the shop’s software subscription or another merchant’s transactions.</p>
      <p>Establish those boundaries before choosing the screens. Identify the selling business, the merchant account and the people allowed to view records or take payment actions. Keep your platform’s software charges and each merchant’s customer payments distinguishable in reporting and support.</p>
      <p>Each Trolleys merchant applies and is reviewed for its business activity. Creating a software account does not automatically enable payment acceptance. The approved <Link href="/use-cases/software-platforms/payment-models" prefetch={false}>platform payment model</Link> defines the account relationship and permitted movement of money. Holding funds, splitting payments or collecting commissions requires a separately approved arrangement.</p>
      <p>That gives product teams a clearer activation story. A merchant should understand whether they have joined the software, completed their account application or become ready to accept payments. Those moments can sit within one customer journey without being presented as one approval.</p>
    </section>

    <section id="finish-the-merchants-work" aria-labelledby="finish-the-merchants-work-title">
      <h2 id="finish-the-merchants-work-title">Follow one payment back into the work</h2>
      <p>The most useful demonstration starts with the merchant’s ordinary task. Open the job, booking or invoice that needs payment. Show how its reference, amount and merchant account reach checkout, then how the verified result returns to the right record.</p>
      <p>Keep the exceptions in that same story. A deposit should leave the remaining balance visible. A refund should stay attached to the original sale. An unresolved attempt should be investigated before someone asks the customer to pay again. Staff should be able to explain what happened without matching screenshots by eye.</p>
      <p>For the Cybersource connection used with Trolleys, Unified Checkout requires the relevant gateway account and payment methods to be enabled. Your developer supplies the server connection and configures the supported payment experience. Available records, delivery methods and permissions depend on the integration agreed for your platform.</p>
      <p>Also close the customer’s browser during a controlled test. Cybersource supports payment result notifications to the server independently of the browser callback. Those notifications have their own setup and security requirements, including encrypted payloads. Your application still has to verify the message, match it to the merchant and order, and complete the intended update once.</p>
      <p>The payment interface can fit into your software while sensitive card entry is handled by the gateway’s hosted fields. That does not make the rest of the implementation someone else’s responsibility. The PCI Security Standards Council identifies script security considerations for embedded payment forms and directs merchants to confirm the appropriate assessment with the entity accepting their compliance validation.</p>
      <p>Keep the implementation details with the developer, but ask for the business evidence. Can the merchant find the original sale after an interrupted checkout? Can the right staff member handle a refund? Can one merchant’s login ever expose another merchant’s records? Our <Link href="/developers/testing" prefetch={false}>payment testing guidance</Link> helps turn the demonstration into a useful handoff.</p>
    </section>

    <section id="support-is-part-of-the-product" aria-labelledby="support-is-part-of-the-product-title">
      <h2 id="support-is-part-of-the-product-title">Your customer will ask you first</h2>
      <p>If payments appear inside your software, expect merchants to bring payment questions to your support team. They may not know whether a missing receipt, a declined payment or a payout question belongs to the software, gateway or merchant account.</p>
      <p>Agree how your team identifies the issue and passes it to the right person. Trolleys can help with merchant account access and payment operations under the partnership arrangement. Your software team remains responsible for its application behavior and connection. The merchant still handles the underlying purchase and fulfillment. Clear ownership should make the handoff easier for the person asking for help.</p>
      <p>Account changes need the same attention. A merchant may add a location, replace an administrator or cancel the software subscription while an earlier sale remains subject to a refund or dispute. Plan the permitted access, retained records and servicing route under the applicable agreements. Ending a software login should not leave everyone guessing who handles an existing customer issue.</p>
      <p>A provider portal can remain part of the operating model. There is little value in rebuilding every account function merely to keep every action inside your interface. Decide which tasks belong in your product and which have a clear, supported handoff.</p>
    </section>

    <p>Before projecting payment income across every subscriber, try the service with a small, representative group of approved merchants. Compare the work before and after: manual matching, payment questions, unresolved attempts and the time needed to explain a balance. Track merchants who actually start using the connection separately from those who merely enable a feature.</p>
    <p>Model the platform’s agreed fees or revenue share alongside implementation, support and ongoing maintenance costs. Total payment volume is not the platform’s earnings. Confirm the commercial terms rather than assuming the software can take a share of each transaction.</p>
    <p>Bring those findings to a <Link href="/company/contact#platforms" prefetch={false}>Trolleys platform partnership conversation</Link>. The strongest case for embedded payments is a merchant who can finish the sale, understand the result and move on with the business. Make that easier, and the feature has a reason to stay.</p>
  </BlogArticlePage>;
}

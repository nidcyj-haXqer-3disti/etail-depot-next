import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { orchestrationGatewayArticle } from "./orchestration-gateway-content";
import s from "./blog.module.css";

const comparisons = [
  ["Main job", "Connect checkout or business software to supported payment processing services.", "Coordinate supported payment connections and the rules used to choose between them."],
  ["What to verify", "The account, methods and payment operations your business can use.", "The operations supported on each connection, and which work still happens with each provider."],
] as const;

export function OrchestrationGatewayPage() {
  return <BlogArticlePage article={orchestrationGatewayArticle}>
    <p>A payment proposal can get more impressive as it gets harder to understand. More connections. More routing options. Another dashboard. Somewhere in the conversation, the original problem can disappear: customers are struggling to pay, staff cannot find a transaction, or the business needs to accept a method it does not currently offer.</p>
    <p>Payment orchestration can solve genuine coordination problems. It can also be an expensive answer to a problem your existing payment setup could solve more simply. Before comparing product names, identify the work you want to change.</p>
    <p>That is where we start with Trolleys, an Etail Depot service: the merchant account, how customers buy and the support the business needs. An additional technology layer should serve those needs rather than become the reason for the project.</p>

    <section id="the-job-of-each-layer" aria-labelledby="the-job-of-each-layer-title">
      <h2 id="the-job-of-each-layer-title">A gateway and orchestration do different jobs</h2>
      <p>A payment gateway connects your checkout or application to payment processing services. Depending on the product and account, that connection can support authorization, capture, refunds and related payment functions. A gateway is not necessarily the company providing your merchant account, and it is not the bank that decides whether to approve a customer’s card.</p>
      <p>Payment orchestration adds coordination across supported gateways, processors or other payment services. It can provide a common connection for your software and rules for selecting a payment route. The exact scope varies. It may be sold separately or alongside payment processing.</p>
      <table className={s.comparison}>
        <caption>The responsibility you are buying</caption>
        <thead><tr><th scope="col">Compare</th><th scope="col">Gateway</th><th scope="col">Orchestration</th></tr></thead>
        <tbody>{comparisons.map(([question, gateway, orchestration]) => <tr key={question}>
          <th scope="row">{question}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Gateway</span>{gateway}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Orchestration</span>{orchestration}</td>
        </tr>)}</tbody>
      </table>
      <p>The two can work together. Orchestration does not make the underlying processing connections disappear. Equally, a gateway should not be dismissed as a product with only one possible processor or payment method. Visa Acceptance Solutions documents multiple processor connections, with different supported services. Your account and configuration determine what you can use.</p>
      <p>This distinction matters when a proposal says you have outgrown your gateway. Ask what is missing. Is it an unavailable payment method, a genuine need to coordinate several providers, or an account feature that has not been configured? Those are different purchasing decisions.</p>
    </section>

    <section id="the-work-behind-one-integration" aria-labelledby="the-work-behind-one-integration-title">
      <h2 id="the-work-behind-one-integration-title">“One integration” is a starting point for questions</h2>
      <p>Imagine a business that already uses two providers for different approved sales channels. Every software change has to be implemented twice, and support staff move between records to answer an order question. A shared connection could reduce repeated work. That is a concrete reason to investigate orchestration.</p>
      <p>Now imagine a store with one suitable provider and a payment method that has never been enabled. Buying a coordination platform before checking the existing account could leave the original issue unresolved while adding another contract and another system to maintain.</p>
      <p>The demonstration should therefore follow your actual work. If you charge after dispatch, ask to see that operation. If customers return one item from a larger order, ask to see the partial refund. If you sell subscriptions, confirm the recurring payment behavior on the proposed connection. A provider logo in a connector list does not answer these questions.</p>
      <p>Stripe’s orchestration feature documentation makes the distinction visible: support is specified by destination processor, and some operations have exceptions. Treat that as a reason to examine the service you are buying, not as a universal feature list for every orchestration product.</p>
      <p>The same applies to the operating dashboard. Stripe’s current orchestration documentation directs merchants to the third party processor for disputes and settlement activity. A common view of payments does not necessarily mean that every account task has moved into it.</p>
      <p>Ask the seller to show who handles the awkward case. A refund is still unresolved. A transaction is missing from the view your employee normally uses. A connection stops responding. Which team takes the case, which reference identifies it, and who updates your staff? The answer should not be a circle of providers referring you to one another.</p>
      <p>For a software platform, this is especially important. A shared integration can serve several merchant accounts while their approval, permitted activity and account responsibilities remain distinct. Trolleys’ <Link href="/use-cases/software-platforms/partnerships" prefetch={false}>platform partnerships</Link> define integration and support arrangements, with each merchant reviewed before activation. A common technical connection does not make the merchants one interchangeable account.</p>
    </section>

    <section id="the-business-case-for-another-layer" aria-labelledby="the-business-case-for-another-layer-title">
      <h2 id="the-business-case-for-another-layer-title">Make the extra layer justify its cost</h2>
      <p>Compare the full arrangement. Include processing charges, any orchestration fees, implementation, maintenance and the time your people spend handling exceptions. Put the expected benefit beside those costs: a needed payment option, less repeated development, clearer operations or a measured improvement in completed orders.</p>
      <p>A processing fee does not necessarily disappear because another service chooses the route. Stripe states that each third party processor continues processing payments routed to it. Processing fees and responsibility for transaction losses remain governed by your agreement with that processor. Read the corresponding responsibilities in any offer you consider.</p>
      <p>There is also a new dependency to understand. If the orchestration service becomes unavailable, what happens to your checkout? Do not assume you can bypass it. Ask for the supported recovery process and a demonstration appropriate to your integration. Our article on <Link href="/company/blog/payment-failover" prefetch={false}>payment failover</Link> explains why restoring new sales and resolving earlier attempts require separate attention.</p>
      <p>Before signing, ask how you would leave. Confirm access to payment records, export arrangements, saved payment method restrictions and any development needed to change the connection. A common interface can make daily work easier without making every future move automatic.</p>
      <p>For a Trolleys merchant, the first conversation is about the account and connection you need now. Our <Link href="/developers/getting-started" prefetch={false}>Getting started information</Link> explains gateway access and the supported setup paths. Trolleys merchant services do not, by themselves, include a separate orchestration platform or automatic routing across unrelated providers. Any additional connection needs confirmation of compatibility and responsibilities.</p>
      <p><Link href="/company/contact" prefetch={false}>Bring us your current payment setup and the work you want to improve</Link>. We can discuss the merchant service, checkout and support side. If an orchestration provider is part of the proposal, make its role and ongoing ownership explicit before customers depend on it.</p>
    </section>

    <p>A business can be ambitious without buying every layer of payment technology at once. Add orchestration when the coordination is worth paying for. Keep the simpler arrangement when it already does the job well.</p>
  </BlogArticlePage>;
}

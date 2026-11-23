import { BlogArticlePage } from "./article-page";
import { supportHandoffArticle } from "./support-handoff-content";

export function SupportHandoffPage() {
  return <BlogArticlePage article={supportHandoffArticle}>
    <p>The customer receives a prompt reply: the team is looking into the missing parcel.</p>
    <p>Two days later, the same customer asks again. The agency can see the ticket but cannot locate the order. The warehouse has not responded. Only the owner can approve a refund, and nobody has assigned the owner a task.</p>
    <p>A response-time report can look good while the underlying customer problem remains untouched.</p>

    <section id="authority" aria-labelledby="authority-title">
      <h2 id="authority-title">Define what the agency can actually do.</h2>
    <p>Explain which business answers customers, which records its staff can see and which actions they can take. Reading an order, requesting a cancellation and issuing a refund are different permissions.</p>
    <p>For a Trolleys merchant, account access should remain limited to authorized people and the functions needed for their roles. A support contract alone does not give an agency permission to use the owner’s credentials or change payment information.</p>
    <p>Keep commercial authority clear too. If staff can offer a replacement or approve a remedy within agreed limits, record those limits. If they cannot, define who makes the decision and how the request reaches that person.</p>
    </section>

    <section id="the-handoff" aria-labelledby="the-handoff-title">
      <h2 id="the-handoff-title">Measure the handoff that gets the issue resolved.</h2>
    <p>In the missing-parcel example, the first reply moves no stock and returns no money. Progress begins when someone checks the order, obtains a delivery answer and gets a decision from the person authorized to provide a remedy. The agency can own the customer conversation throughout, even when another team must perform the next action. That ownership should survive the referral to the warehouse or merchant.</p>
    <p>The useful measure is how long the customer’s request has remained unresolved, including time spent waiting for another team. Closing the ticket at each referral can hide that waiting time from view without helping the customer. A cancellation request should remain traceable into the billing process; a promised refund should remain pending until the authorized payment process confirms its status.</p>
    <p>A dispute notice introduces its own deadline and submission route. Staff need to recognize when an ordinary complaint has become a formal payment case and escalate it accordingly.</p>
    </section>

    <section id="merchant-responsibility" aria-labelledby="merchant-responsibility-title">
      <h2 id="merchant-responsibility-title">The merchant remains accountable for the service it sold.</h2>
    <p>Trolleys’ selling terms retain the merchant’s fulfillment and customer-support responsibilities. Outsourcing can help deliver those responsibilities; it does not transfer them out of the customer relationship by default.</p>
    <p>During review, describe the real arrangement, including operating coverage, escalation and access to records. Do not claim round-the-clock resolution merely because an agency can receive messages at any time. Identify what is available and what waits for the merchant’s team.</p>
    <p>Plan for the agency relationship ending as well. Customer records, open complaints and pending account actions need an authorized handoff, with access removed when no longer needed.</p>
    <p>Return to that missing parcel when evaluating the arrangement. If the agency can name the next action, its owner and the evidence needed to finish it, the handoff has substance. If it can only send another reassuring reply, the customer is still waiting in the same place.</p>
    </section>
  </BlogArticlePage>;
}

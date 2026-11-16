import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { billingModelsArticle } from "./billing-models-content";

export function BillingModelsPage() {
  return <BlogArticlePage article={billingModelsArticle}>
    <p>Adding a colleague to a shared workspace should be an ordinary decision. Put a charge behind that invitation and it becomes a budget decision too. The customer has to decide whether another person’s access is worth another line on the bill.</p>
    <p>The same tension appears when a customer sends a message, runs a report or processes an order. What you charge for can influence what they feel comfortable doing. A model that looks attractive in a revenue forecast may make customers hesitate at the very activity your product is meant to encourage.</p>
    <p>That is why choosing a billing model takes more thought than choosing a monthly price. The model defines what creates a charge. The billing schedule says when the bill arrives. A monthly invoice can contain a fixed fee, a count of seats, measured use or a combination of them.</p>

    <section id="what-counts" aria-labelledby="what-counts-title">
      <h2 id="what-counts-title">The important word comes after “per”</h2>
      <p>A flat rate buys a defined package for a set amount. Per-seat pricing charges for users. Usage pricing follows measured activity. A base fee with an allowance and charges above it combines fixed and variable elements. Stripe’s recurring pricing documentation describes these options; the choice still belongs to the business selling the service.</p>
      <p>Each model needs a definition the customer can rely on. A seat might mean an allocated license, an accepted invitation or an active user. Those are different promises, even when the headline says the same thing: per user.</p>
      <p>Slack makes that distinction explicit. Its Fair Billing Policy applies to plans bought through its website and paid by credit card or self-serve invoicing. Eligible paid members who become inactive generate prorated account credits for unused time. The policy defines inactivity and also states that those credits are nonrefundable. Buying access and actually using it are connected by a published rule.</p>
      <p>You do not have to copy that policy. You do need an answer when a customer asks why a person who left, never joined or rarely logs in still appears on the bill. If your product depends on broad participation, consider whether charging for every added colleague will make customers restrict access. That is a design question to investigate with customers, not a universal argument against seat pricing.</p>
    </section>

    <section id="visible-usage" aria-labelledby="visible-usage-title">
      <h2 id="visible-usage-title">The customer’s count may differ from yours</h2>
      <p>Usage billing can sound particularly fair: pay for what you use. But the customer has to understand what your system calls use.</p>
      <p>Twilio’s SMS documentation gives a concrete example. SMS is billed per message segment sent. A long message can be split into several segments and then displayed as one message on the recipient’s phone. Character encoding can change the segment count too. A customer counting messages in a conversation is not necessarily counting the units on the bill.</p>
      <p>The lesson for your own product is to make that difference visible before it becomes a dispute. If you charge for documents processed, decide what happens to a failed document or a repeated submission. If you charge for storage, explain whether the bill uses the highest amount stored, an average or another measurement. Choose the rule deliberately and make the records capable of supporting it.</p>
      <p>Costs matter here. An apparently simple unlimited plan can leave you carrying expensive use that the price does not cover. A very detailed meter can recover those costs while leaving the customer unable to anticipate a bill. Neither problem is solved by giving the plan a better name.</p>
      <p>Give the customer a useful view of consumption during the billing period. Stripe, for example, documents alerts that notify an application when reported usage crosses a threshold. An alert is a signal for a response; do not describe it as a spending cap unless your product actually enforces one. Decide whether you will warn the customer, ask for approval or restrict further use, and make that behavior clear.</p>
    </section>

    <section id="read-the-bill" aria-labelledby="read-the-bill-title">
      <h2 id="read-the-bill-title">Read the bill before choosing the model</h2>
      <p>Before committing, take real activity records from a quiet customer, a typical customer and a heavy user. Work out what each would owe under the models you are considering. Look at the cost of serving those accounts as well as the revenue. The attractive average can conceal a customer you would lose money serving.</p>
      <p>Then write the invoice those customers would receive. Can someone outside the product team explain why the amount changed? Can you show the units, the period and the applicable rate without a separate explanation from an engineer? If an allowance is included, the bill should make clear what was included and what exceeded it.</p>
      <p>Try a month that is not tidy. Someone joins halfway through. A customer changes plans. A usage record needs correcting. Decide when a change takes effect and whether an adjustment applies. These are part of the offer customers are buying, not details to leave until the first complaint.</p>
      <p>Collection is another decision. You can calculate a valid charge and still have an unpaid invoice. Our article on <Link href="/company/blog/saas-payment-processing" prefetch={false}>SaaS payment processing</Link> separates billing, payment and access; our discussion of <Link href="/company/blog/important-invoice-management-tips" prefetch={false}>invoice management</Link> follows the bill after it is sent. A pricing formula does not replace either process.</p>
      <p>The model is ready when the business can support it and the customer can understand the consequences of using the product. If inviting a colleague, sending a message or doing more work changes the bill, that should be understandable at the moment of the decision. The invoice should confirm what the customer expected.</p>
    </section>
  </BlogArticlePage>;
}

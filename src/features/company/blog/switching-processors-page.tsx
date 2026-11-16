import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { switchingProcessorsArticle } from "./switching-processors-content";
import s from "./blog.module.css";

const migrationRecords = [
  ["Checkout connection", "Prepare the new integration, credentials, enabled methods and payment updates. Confirm which store and merchant account it will use."],
  ["Saved payment details", "Ask both providers what can transfer through their secure migration process. A saved card reference is not automatically usable elsewhere."],
  ["Recurring billing", "Map each customer, plan, payment method and next billing date. Decide which system will collect the next payment."],
  ["Existing transactions", "Keep the original provider reference and supported process for captures, cancellations, refunds and disputes."],
  ["Reports and funds", "Preserve transaction reports, statements and funding records. Track remaining balances and adjustments with the provider that holds them."],
] as const;

export function SwitchingProcessorsPage() {
  return <BlogArticlePage article={switchingProcessorsArticle}>
    <p>Your first sale through a new processor does not finish the switch. A customer may still need a refund for an earlier purchase, a subscription may be due to renew, or a payout may still be pending. Plan for those older payments alongside the new checkout.</p>
    <section id="plan-the-switch" aria-labelledby="plan-the-switch-title">
      <h2 id="plan-the-switch-title">Confirm the new setup before setting a date</h2>
      <p>Write down what the change needs to improve: account support, checkout compatibility, payment methods, cost or reporting. Confirm those requirements with the new provider. Use the <Link href="/company/blog/choose-a-merchant-services-provider" prefetch={false}>provider comparison checklist</Link> to review the offer before committing to a launch.</p>
      <p>Check your current agreement for notice periods, renewal dates, cancellation charges and any separate gateway, software or equipment contracts. Disconnecting a plugin is not the same as ending each agreement. Ask what access and costs continue while you handle older transactions.</p>
      <p>With Trolleys, an Etail Depot service, a new account still requires business review and approval. Changing providers does not transfer an existing account or release money held elsewhere. Confirm the approved business, payment methods, checkout connection and funding terms before sending new payments. The <Link href="/use-cases/switch-merchant-services" prefetch={false}>Switch merchant services page</Link> explains that boundary.</p>
      <p>Assign someone to coordinate the change with your web team, finance staff and customer support. Choose a manageable launch window and record who can pause the rollout if a problem appears.</p>
    </section>
    <section id="map-what-moves" aria-labelledby="map-what-moves-title">
      <h2 id="map-what-moves-title">Separate what moves from what stays</h2>
      <p>Make an inventory before replacing the checkout. A customer record, a saved payment method and a subscription schedule are separate records. Moving one does not prove that the others are ready.</p>
      <ul className={s.actionChecklist} role="list">
        {migrationRecords.map(([area, detail]) => <li key={area}>
          <strong>{area}.</strong> {detail}
        </li>)}
      </ul>
      <p>For saved cards, agree the transfer method and supported records with both providers before promising uninterrupted use. Stripe’s migration process, for example, coordinates the processors and supplies a mapping between old and new records. A similar process cannot be assumed for every provider or payment method.</p>
      <p>Keep sensitive card data within the providers’ approved secure process. Do not export it into ordinary spreadsheets or send it between staff by email. If a transfer is unavailable, arrange a supported way for customers to enter their payment details again.</p>
      <p>For subscriptions, check the amount, currency, billing interval, next collection date and any outstanding invoice. Preserve applicable discounts, trials and tax settings. Confirm customer permissions and any required notices with the providers. Test that only one system collects each scheduled payment; copying a subscription should not start a second charge for the same period.</p>
      <p>Trolleys supports recurring payments through Cybersource when enabled for the merchant account. That does not mean an existing subscription, wallet credential or stored payment reference transfers automatically.</p>
    </section>
    <section id="test-the-journey" aria-labelledby="test-the-journey-title">
      <h2 id="test-the-journey-title">Test the complete payment journey</h2>
      <p>Use the provider’s permitted test procedures before opening the new checkout. A successful card entry is only one part of the check:</p>
      <ol>
        <li><strong>Order and payment.</strong> Confirm the amount, currency, tax and shipping total, then match the store order with the gateway transaction and correct merchant account.</li>
        <li><strong>Unsuccessful or interrupted checkout.</strong> Check declines, abandoned authentication, delayed results and repeated clicks. An unresolved result must not trigger another charge or duplicate fulfillment.</li>
        <li><strong>Work after the sale.</strong> Verify supported cancellations, full and partial refunds, payment updates and report exports. Confirm how staff will receive and handle dispute notices.</li>
        <li><strong>Customer and staff experience.</strong> Check mobile and desktop checkout, receipts, the configured statement description and support instructions. For subscriptions, test the next billing event and its records.</li>
      </ol>
      <p>Etail’s <Link href="/developers/testing" prefetch={false}>checkout testing guidance</Link> helps your web team separate sandbox checks from authorized live validation. Passing a sandbox test does not activate live processing or establish a payout date.</p>
      <p>Keep a short record of what passed, what remains open and who is responsible. Correct missing order references or unexplained results before expanding the launch.</p>
    </section>
    <section id="move-new-payments" aria-labelledby="move-new-payments-title">
      <h2 id="move-new-payments-title">Give each payment one processing route</h2>
      <p>Record when new orders begin using the new connection. If your store supports a staged change, define the group of orders that moves first. Otherwise, plan a coordinated switch with the people who manage the store. Do not assume the plugin can split traffic between providers.</p>
      <p>Keep the selected provider and transaction reference with each payment attempt. A purchase paid before the change still needs its original payment record for a refund. Changing the storefront’s payment settings does not move that purchase to the new processor.</p>
      <p>If a payment times out, check its original provider before requesting payment again. Cybersource’s guidance treats a timeout as an unknown result, not proof of failure. Retrying through the new connection while the old result is unresolved can create a second authorization or charge.</p>
      <p>If you need to restore the previous checkout, change the route for eligible new payments only. Investigate payments already attempted before retrying them, and do not restart subscription schedules that the new system has already collected.</p>
      <p>Monitor completed orders, errors and the first expected renewals and payouts. Compare merchant account and gateway records for the same account and reporting period, then follow bank receipt separately. Our <Link href="/services/reconciliation" prefetch={false}>reconciliation</Link> and <Link href="/services/payouts" prefetch={false}>payout</Link> pages explain those checks.</p>
    </section>
    <section id="keep-old-payments-accessible" aria-labelledby="keep-old-payments-accessible-title">
      <h2 id="keep-old-payments-accessible-title">Keep earlier payments manageable</h2>
      <p>Stop creating new payments through the old connection once the transition is confirmed, while preserving the access needed for existing activity. Agree with the provider how remaining captures, refunds, disputes, reserves and balances will be handled.</p>
      <p>Account closure can remove capabilities you still need. Stripe, for example, states that a closed account cannot be reopened and can no longer issue refunds or respond to disputes. Closure also does not remove responsibility for outstanding balances. Check your own provider’s terms before ending access.</p>
      <p>Save the reports and agreement records your business needs in approved storage. Record the closure requirements, any continuing charges and the support contact for later questions. Do not assume a zero balance today means there can be no later adjustment.</p>
      <p>Give staff a simple instruction for locating an older purchase and using the original provider’s refund or dispute process. Include that provider’s support details and keep the instruction available after the new checkout becomes routine.</p>
      <p>The switch is ready to close when new payments work as intended and the business has an agreed way to manage everything that remains with the previous provider.</p>
    </section>
  </BlogArticlePage>;
}

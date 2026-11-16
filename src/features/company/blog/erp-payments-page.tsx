import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { erpPaymentsArticle } from "./erp-payments-content";

export function ErpPaymentsPage() {
  return <BlogArticlePage article={erpPaymentsArticle}>
    <p>An import finishes. Every row is accepted. Yet a customer who paid in full still appears to owe money.</p>
    <p>That can happen when an enterprise resource planning system, or ERP, treats the net bank deposit as the customer’s payment. If processing fees were deducted before payout, the deposit is smaller. The difference belongs in the accounting for the payment service; it does not, by itself, mean the customer underpaid the invoice.</p>
    <p>ERP payment integration brings payment activity into the system used to manage the business’s finance and operations. Moving the data is only part of the work. The integration also needs to preserve what each amount means and which entry it should update.</p>
    <p>For merchants using <Link href="/services/merchant-services" prefetch={false}>Trolleys, an Etail Depot service</Link>, the starting point is the payment activity behind the payout. Keep customer receipts, fees, refunds and account adjustments identifiable as those records enter your own systems. A bank line is the end of one movement of money, not a complete account of every sale behind it.</p>

    <section id="customer-payment-and-payout" aria-labelledby="customer-payment-and-payout-title">
      <h2 id="customer-payment-and-payout-title">The customer payment and the payout answer different questions</h2>
      <p>A customer receipt answers how much was paid toward a particular bill. The payout explains which eligible activity was transferred after the applicable deductions and adjustments. One invoice can receive several payments, and one payout can contain activity from several invoices.</p>
      <p>Your ERP must preserve both relationships. Apply each supported receipt to the right invoice or invoices, with its amount and remaining balance. Separately, retain the evidence connecting the payment activity and adjustments to the payout. Then match the payout to the bank credit.</p>
      <p>If the payment feed has already recorded the customer’s receipt, importing the later bank deposit as another customer payment can count the same money twice. If the bank deposit is the only record imported, fees deducted from it can leave a false unpaid balance. Both problems begin when two different events are treated as the same accounting instruction.</p>
      <p>Trolleys’ <Link href="/services/payouts" prefetch={false}>payout guidance</Link> follows included payments, fees, refunds and adjustments through to bank receipt. Use the breakdown available for your account rather than inferring which sales belong to a payout because their dates or totals happen to match. Report availability and reference fields depend on the account configuration.</p>
      <p>A reserve movement, refund and processing fee also need different treatment. Do not combine every difference into a generic fee entry to force the bank amount to match. Your finance team should approve the accounts, recognition rules and posting dates; the connector should preserve the evidence needed to apply them.</p>
    </section>

    <section id="one-entry-several-records" aria-labelledby="one-entry-several-records-title">
      <h2 id="one-entry-several-records-title">Decide which import creates the entry</h2>
      <p>The same payment can appear in a gateway report, merchant account activity and a bank feed. Decide which source creates each ERP entry and which later source confirms or matches it. Write that decision down before allowing several feeds to post automatically.</p>
      <p>Microsoft’s Business Central documentation illustrates why this matters: its payment reconciliation journal can apply payments to open entries, recognize bank entries already posted and let users review suggested matches. Those controls belong to that product’s workflow. A separate connector still needs to use them correctly.</p>
      <p>Preserve the source record identifier, merchant account, business entity, currency and relevant dates. A reference that is unique within one store may not be unique across another store’s records. A repeated import should recognize work already completed, while a genuine refund or correction must remain able to create its own approved entry.</p>
      <p>For a Trolleys merchant, our <Link href="/services/reconciliation" prefetch={false}>reconciliation service</Link> helps compare merchant account and gateway activity. Your ERP and finance team handle the accounting treatment of that activity. Bank reconciliation is another check, against the receiving bank’s evidence. Keeping those responsibilities clear makes a difference easier to investigate.</p>
      <p>Keep the payment’s source date alongside the accounting date chosen under your policy. A late refund should have a traceable connection to its original payment and an approved treatment for the relevant period. Quietly replacing an earlier amount can make today’s balance look right while making the previous close impossible to explain.</p>
    </section>

    <section id="test-the-missing-record" aria-labelledby="test-the-missing-record-title">
      <h2 id="test-the-missing-record-title">Ask what happens when a record is missing</h2>
      <p>A convincing demonstration should include an incomplete import. Leave out one receipt, run the same file twice and include a payment with no matching invoice. The system should expose the missing or unmatched work and avoid duplicate postings. It should not quietly choose another invoice with the same balance.</p>
      <p>Then follow one invoice through its receipts, related deductions, payout and bank evidence. Follow the bank deposit back in the other direction. If the connection can only explain a total, your team may still have to reconstruct the underlying payments at month end.</p>
      <p>Check the reporting period, time zone, record counts and currencies as well as the total imported. An empty result can mean there was no activity, but it can also mean the wrong account or an incomplete export was used. A successful file transfer does not establish complete financial records.</p>
    </section>

    <p>Before committing to an ERP connector, bring your software version, accounting workflow and reporting requirements to our <Link href="/company/contact#integration" prefetch={false}>account and integration team</Link>. We can help with the merchant account, available payment records and payment or payout questions. Your ERP provider or developer must confirm the connector, field mapping and recovery behavior. A gateway connection alone does not establish ERP compatibility.</p>
    <p>The result worth buying is a close your team can explain: what the customer paid, what changed before payout and what reached the bank. Automation earns its place when those answers survive the import.</p>
  </BlogArticlePage>;
}

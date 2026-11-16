import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { nonprofitDonationsArticle } from "./nonprofit-donations-content";
import s from "./blog.module.css";

const records = [
  ["Donation", "The donor’s contribution and the purpose attached to it.", "Gift reference, amount, date, donor contact and any campaign restriction."],
  ["Processing fee", "The provider’s charge under the account terms.", "Fee amount and the related transaction or report."],
  ["Refund or adjustment", "A later change affecting the original payment.", "Reason, amount, original reference and any acknowledgment correction needed."],
  ["Payout", "Funds sent to the nonprofit, which may combine several gifts.", "Payout reference, included transactions, deductions and bank receipt."],
] as const;

export function NonprofitDonationsPage() {
  return <BlogArticlePage article={nonprofitDonationsArticle}>
    <section id="define-gift" aria-labelledby="define-gift-title">
      <h2 id="define-gift-title">Define what the donor is agreeing to</h2>
      <p>State who receives the funds and whether the contribution supports a particular campaign or the organization generally. Keep a single gift and a recurring commitment clearly distinct, including how a donor can change or stop future gifts.</p>
      <p>If you invite the donor to cover processing costs, make that choice clear and show the resulting total before payment. Avoid adding an unexplained charge. Confirm with your provider how the option works and with your accountant how the resulting contribution should be recorded.</p>
      <p>An event ticket, membership benefit and unrestricted gift may need different records and disclosures. Do not label every incoming payment as fully tax deductible. Confirm the organization’s eligibility and the treatment of the particular transaction before publishing deduction claims. The IRS Tax Exempt Organization Search includes information about eligibility to receive deductible contributions.</p>
      <p>Choose a payment tool that supports the intended journey. For example, PayPal describes donation buttons and recurring giving tools, with charity account verification as part of its setup. A provider’s advertised features do not establish that your organization qualifies or that every method is enabled.</p>
    </section>
    <section id="follow-money" aria-labelledby="follow-money-title">
      <h2 id="follow-money-title">Keep the gift separate from the deposit</h2>
      <p>Suppose a donor contributes to a campaign and the provider deducts a processing fee before sending the proceeds. Preserve the contribution, fee and net payout as separate amounts. Do not silently redefine the donor’s gift as the smaller bank deposit. Confirm the accounting entries with the organization’s accountant.</p>
      <table className={s.comparison}>
        <caption>Four records to connect after a donation</caption>
        <thead><tr><th scope="col">Record</th><th scope="col">What it explains</th><th scope="col">What to retain</th></tr></thead>
        <tbody>{records.map(([record, purpose, details]) => <tr key={record}>
          <th scope="row">{record}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it explains</span>{purpose}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to retain</span>{details}</td>
        </tr>)}</tbody>
      </table>
      <p>If a campaign receives several gifts in one payout, retain the individual donor and campaign references. A bank deposit alone cannot tell the fundraising team whom to thank or which restriction applies.</p>
      <p>Use the provider’s detailed report to explain the amount sent. Stripe’s payout reporting, for example, separates payments, fees, refunds and other adjustments. Your provider’s report fields may differ. Our <Link href="/company/blog/payment-settlement-and-payouts" prefetch={false}>settlement and payout article</Link> explains why payment approval and bank receipt are separate stages.</p>
    </section>
    <section id="acknowledge" aria-labelledby="acknowledge-title">
      <h2 id="acknowledge-title">Prepare an acknowledgment, not just a checkout message</h2>
      <p>A payment confirmation reports a transaction result. A charitable acknowledgment documents information a donor may need for tax purposes. A processor receipt does not automatically contain every required item.</p>
      <p>To substantiate a charitable contribution of <strong>$250 or more</strong>, the donor needs the required written acknowledgment. IRS guidance lists the organization’s name, cash contribution amount and whether goods or services were provided. When benefits are provided, the acknowledgment generally needs their description and a good faith estimate of their value. Specific rules apply to noncash gifts and certain religious benefits.</p>
      <p>A separate disclosure rule generally applies when a donor pays <strong>more than $75</strong> partly as a contribution and partly for goods or services. The charity must explain the deductible portion and provide a good faith estimate of the benefits’ value, subject to IRS exceptions. This threshold concerns the total payment, not just the potentially deductible portion.</p>
      <p>Have the organization’s tax adviser confirm the wording, timing and applicable exceptions. Design the acknowledgment around the actual gift, retain a copy and give staff a way to correct errors. Do not promise an individual donor a particular tax result.</p>
    </section>
    <section id="rehearse" aria-labelledby="rehearse-title">
      <h2 id="rehearse-title">Rehearse the donor and staff journeys</h2>
      <p>Use a test environment to check the donation flow on desktop and mobile. Include the people who answer donor questions, prepare acknowledgments and review financial reports.</p>
      <ul>
        <li><strong>Failed or uncertain payment.</strong> Show an honest result and investigate the original attempt before collecting again. An interrupted browser session does not prove the gift failed.</li>
        <li><strong>Recurring change.</strong> Locate the recurring instruction, confirm the donor’s request and explain when a change or cancellation takes effect.</li>
        <li><strong>Reporting.</strong> Connect campaign records with individual gifts, fees, refunds and payouts using consistent references.</li>
        <li><strong>Access and privacy.</strong> Collect only the information needed and limit access to donor records to the people responsible for the work.</li>
      </ul>
      <p>Keep recurring consent and payment results together. If bank debits are offered, check the applicable authorization and cancellation process; our <Link href="/company/blog/how-recurring-ach-payments-work" prefetch={false}>recurring ACH article</Link> covers those distinctions.</p>
      <p>Confirm account eligibility, supported methods, charges, payout arrangements and support before choosing a provider. A promotional nonprofit rate is useful only if the organization qualifies and the rest of the process fits.</p>
    </section>
  </BlogArticlePage>;
}

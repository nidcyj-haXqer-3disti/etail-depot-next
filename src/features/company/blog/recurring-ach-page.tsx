import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { recurringAchArticle } from "./recurring-ach-content";
import s from "./blog.module.css";

const billingChanges = [
  ["Amount or collection date", "Check the existing permission and any required notice before changing the schedule.", "The agreed change, customer notice and affected payment date."],
  ["Bank account details", "Use the provider’s secure update and validation process. Check that the update cannot collect the same bill twice.", "The replacement payment record and confirmation that the old instruction is stopped."],
  ["Revocation or cancellation", "Record the request and stop future collections under the revoked authorization. Check any instruction already submitted with the provider.", "When the request arrived, what was stopped and any remaining payment or service issue."],
] as const;

export function RecurringAchPage() {
  return <BlogArticlePage article={recurringAchArticle}>
    <p>For subscriptions, memberships or ongoing services, the customer authorizes repeated collections from a bank account. The provider submits an <Link href="/company/blog/ach-debit" prefetch={false}>ACH debit</Link> for each billing cycle through the originating bank. A saved schedule reduces manual work, but it does not guarantee successful collection.</p>
    <section id="agreement" aria-labelledby="agreement-title">
      <h2 id="agreement-title">Agree on the collection before scheduling it</h2>
      <p>Make the business name, service, amount or calculation method, payment timing and way to revoke permission clear. Keep the authorization with the customer’s billing record and give the customer a copy.</p>
      <p>For covered US consumer accounts, Regulation E requires recurring debits to be authorized in writing, signed or similarly authenticated by the consumer. An electronic process can qualify when it meets the applicable requirements. The business obtaining permission must provide a copy to the consumer.</p>
      <p>Business accounts have different applicable requirements. Ask your bank or provider to confirm the correct account type, authorization method and ACH entry category. Permission for a single payment does not automatically establish a recurring arrangement.</p>
      <ol>
        <li><strong>Confirm account support.</strong> Check that recurring ACH is enabled for your merchant account and intended customer account type. Confirm fees, funding terms and the process for returns.</li>
        <li><strong>Record the agreement.</strong> Use the provider’s supported authorization process. Retain the accepted terms and evidence of consent, with clear cancellation instructions.</li>
        <li><strong>Set the schedule.</strong> Match the amount, start date, billing frequency and end condition to the agreement. Check how banking holidays affect processing.</li>
        <li><strong>Connect the records.</strong> Link the subscription to the customer and invoice. Assign someone to review the first collection and any later exception.</li>
      </ol>
      <p>Cybersource’s eCheck subscription documentation includes a recurring amount, start date, frequency and number of payments. These settings control the billing instruction. They do not replace the customer’s authorization.</p>
    </section>
    <section id="changes" aria-labelledby="changes-title">
      <h2 id="changes-title">Handle changes before the next payment</h2>
      <p>A member who agrees to regular collections may later buy an extra workshop. Check whether the existing authorization covers that purchase and whether notice or separate permission is needed. Do not simply add it to the next debit because the software allows an amount change.</p>
      <table className={s.comparison}>
        <caption>Three changes that need a recorded decision</caption>
        <thead><tr><th scope="col">Change</th><th scope="col">Action</th><th scope="col">Record to keep</th></tr></thead>
        <tbody>{billingChanges.map(([change, action, record]) => <tr key={change}>
          <th scope="row">{change}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Action</span>{action}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Record to keep</span>{record}</td>
        </tr>)}</tbody>
      </table>
      <p>For covered consumer transfers that vary in amount, Regulation E generally requires written notice of the amount and date at least 10 days before the transfer. The rule also allows an agreed arrangement for notices outside a specified range or difference, with required disclosures. Confirm the applicable notice process before changing a collection.</p>
      <p>Revoking payment permission and ending the service are separate actions. The CFPB explains that stopping automatic payments does not itself cancel the underlying contract or erase an amount owed. Make it easy for customers to explain whether they are ending the service or changing how they pay.</p>
    </section>
    <section id="results" aria-labelledby="results-title">
      <h2 id="results-title">Check the result of every collection</h2>
      <p>A billing date passing is not proof of payment. Match each scheduled collection to a submitted transaction and its result. Keep the invoice open, or reopen it when appropriate, if the payment is missing, rejected or returned.</p>
      <p>A debit can pass initial validation and be returned later. Read the reason before deciding what to do: insufficient funds, incorrect bank details and revoked permission require different responses. Follow the provider’s rules for any permitted retry and document a new arrangement with the customer when needed.</p>
      <p>Keep payment status separate from merchant funding. Our <Link href="/company/blog/how-long-does-it-take-an-echeck-to-clear" prefetch={false}>eCheck clearing article</Link> explains why initial acceptance, completion and money in the bank are different events.</p>
      <p>Trolleys, an Etail Depot service, supports recurring payments through Cybersource when enabled for the account. For recurring <Link href="/services/ach-payments" prefetch={false}>ACH payments</Link>, confirm the supported setup, authorizations, notices and account terms before scheduling the first collection.</p>
    </section>
  </BlogArticlePage>;
}

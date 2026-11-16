import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { accountUpdaterArticle } from "./account-updater-content";
import s from "./blog.module.css";

const updateOutcomes = [
  ["New expiry date", "The card’s expiry details have changed.", "Confirm that the current details reached the saved-payment record used for billing."],
  ["Replacement account number", "Updated account details are available.", "Follow the provider’s update process and retain the connection to the correct customer."],
  ["Closed account", "The response reports that the account is closed.", "Follow the provider’s stop and recovery instructions instead of continuing to charge the closed account."],
  ["Contact the cardholder", "The customer needs to provide further payment instructions.", "Contact the customer through your approved process; this is not a replacement credential."],
] as const;

export function AccountUpdaterPage() {
  return <BlogArticlePage article={accountUpdaterArticle}>
    <p>A customer’s card can change while their subscription or repeat purchasing relationship stays active. An updater may help the next agreed payment use current details. Your team still needs to understand the response and handle anything the service cannot resolve.</p>
    <section id="understand-the-response" aria-labelledby="understand-the-response-title">
      <h2 id="understand-the-response-title">An updater can return more than replacement details</h2>
      <p>Visa Account Updater describes four common outcomes. Each calls for different handling:</p>
      <figure>
        <figcaption>Read the update result before deciding what to do</figcaption>
        <dl className={s.diagnosticList}>
          {updateOutcomes.map(([result, detail, action]) => <div key={result}>
            <dt>{result}</dt>
            <dd><p>{detail}</p><p><strong>What to check next:</strong> {action}</p></dd>
          </div>)}
        </dl>
      </figure>
      <p>No update is a separate outcome. It does not prove that the saved details are usable or that the next charge will succeed. Keep a secure way for the customer to update their payment method themselves.</p>
      <p>Coverage depends on issuer participation, eligible cards and the provider’s implementation. Cybersource lists Visa, Mastercard and American Express support, with issuer enrollment required and American Express support limited to merchants using its Token Management Service. Confirm the arrangement for your account rather than assuming every saved card is covered.</p>
    </section>
    <section id="keep-the-agreement-separate" aria-labelledby="keep-the-agreement-separate-title">
      <h2 id="keep-the-agreement-separate-title">Use an update only within the existing permission</h2>
      <p>Suppose a customer cancels a monthly subscription. The provider later receives replacement card details through an updater. The cancellation still needs to be respected; receiving new details does not restart the subscription.</p>
      <p>For an active agreement, an update may allow the next permitted payment attempt to use current credentials. It does not expand the purpose, amount or timing the customer agreed to. Stripe’s saved-payment guidance similarly limits use to the terms accepted by the customer.</p>
      <p>The payment still has its own authorization result. Visa states that Real Time Account Updater can return updated details even when the transaction is not approved. Keep the update status and payment status separate in your records.</p>
      <p>The <Link href="/company/blog/card-on-file" prefetch={false}>card on file article</Link> explains why saving a payment method, agreeing to automatic billing and canceling a subscription are different actions.</p>
    </section>
    <section id="review-the-operating-setup" aria-labelledby="review-the-operating-setup-title">
      <h2 id="review-the-operating-setup-title">Make update outcomes visible to the right team</h2>
      <p>Ask your provider four practical questions before relying on the service:</p>
      <ol>
        <li><strong>Coverage.</strong> Which networks, cards and saved-payment records are eligible? Confirm enrollment and account enablement.</li>
        <li><strong>Processing.</strong> Are updates scheduled, requested for selected records or handled during a payment attempt? Establish which system applies them.</li>
        <li><strong>Exceptions.</strong> Where do closed-account and contact-customer notices appear, and who acts on them? Check what must stop until the issue is resolved.</li>
        <li><strong>Commercial terms.</strong> What triggers a charge for the service, and which report explains it? Use your agreed terms rather than a generic cost estimate.</li>
      </ol>
      <p>Cybersource’s guide describes both scheduled token updates and updates for selected batches. Their reporting and handling differ. It also instructs merchants to review contact-cardholder responses and take appropriate action before continuing, rather than repeatedly requesting updates.</p>
      <p>Verify which saved record is updated, especially if your billing software keeps its own reference. Give staff the customer reference, update status and required action without copying full card numbers into ordinary logs or support messages. If network tokens are also used, ask which service maintains the token and which maintains the underlying account details.</p>
      <p>For merchants using Trolleys, an Etail Depot service, confirm updater availability and account-specific terms with the team. Gateway access or recurring billing alone does not establish that this separate service is active. The <Link href="/company/legal/merchant-services#methods" prefetch={false}>Merchant Services Terms</Link> explain why payment capabilities depend on the enabled account arrangement.</p>
    </section>
    <section id="measure-useful-outcomes" aria-labelledby="measure-useful-outcomes-title">
      <h2 id="measure-useful-outcomes-title">Count resolved problems, not just updates</h2>
      <p>Track eligible saved-payment records, updates received, records needing customer action and the outcomes of subsequent payments. Keep those counts separate. A card that received an update is not automatically a recovered sale.</p>
      <p>Use a consistent reporting period and compare similar groups of active billing agreements. Exclude canceled subscriptions from the payments you expected to collect. Record customer updates separately where possible, so you do not attribute every successful payment to the updater.</p>
      <p>Review the reason for each remaining failure. Changed credentials are different from insufficient funds, a request for authentication or another issuer decline. The <Link href="/company/blog/credit-card-declines" prefetch={false}>card declines article</Link> helps distinguish those next steps.</p>
      <p>The useful measure is fewer avoidable interruptions in your own eligible customer base. Keep customer follow-up available for the exceptions, and do not promise a universal approval improvement from the number of updates alone.</p>
    </section>
  </BlogArticlePage>;
}

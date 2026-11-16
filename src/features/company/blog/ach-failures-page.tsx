import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { achFailuresArticle } from "./ach-failures-content";
import s from "./blog.module.css";

const preventionChecks = [
  ["Incorrect or closed account", "Check where the details came from and whether the customer recently changed accounts.", "Have the customer correct details securely and complete the required checks. Do not guess replacement digits."],
  ["Insufficient funds", "Read the return reason and review the collection date with the customer.", "Confirm whether another attempt is permitted. Do not turn every return into an automatic retry."],
  ["Unexpected amount or date", "Compare the payment instruction with the customer’s authorization and billing record.", "Hold affected instructions that have not been sent and correct the rule that produced them."],
  ["Revoked or disputed permission", "Review the authorization, cancellation request and return information.", "Stop further collections under revoked permission and work with the provider on the appropriate resolution."],
] as const;

export function AchFailuresPage() {
  return <BlogArticlePage article={achFailuresArticle}>
    <p>A payment can pass an initial check and still be returned later. Cybersource’s eCheck guidance separates funding problems, authorization issues and administrative returns such as closed accounts. The response should fit the recorded reason.</p>
    <section id="patterns" aria-labelledby="patterns-title">
      <h2 id="patterns-title">Find the cause behind the return</h2>
      <p>Keep each payment investigation with the bank or provider, but also review patterns across collections. Compare the return reason, billing run, account entry method, recent bank changes and customer agreement. A cluster after a billing update deserves attention even if individual returns look unrelated.</p>
      <figure>
        <figcaption>Match the preventive check to the payment problem</figcaption>
        <dl className={s.diagnosticList}>
          {preventionChecks.map(([result, detail, action]) => <div key={result}>
            <dt>{result}</dt>
            <dd><p>{detail}</p><p><strong>Preventive step:</strong> {action}</p></dd>
          </div>)}
        </dl>
      </figure>
      <p>The distinction between authorization problems matters. Nacha uses R10 when the customer reports that the originator is unknown or not authorized to debit the account. R11 covers an existing authorization that the payment did not follow, such as an incorrect amount or an early debit. Confirm the exact reason with your provider before deciding what to change.</p>
      <p>Bank validation addresses a different risk. For consumer debits authorized online, known as WEB debits, Nacha requires account validation before first use of an account number and when the customer supplies a new one. Minimum validation does not necessarily establish ownership, and it cannot correct an unauthorized amount or collection date. The <Link href="/company/blog/ach-verification" prefetch={false}>ACH account verification article</Link> explains those separate checks.</p>
    </section>
    <section id="correct" aria-labelledby="correct-title">
      <h2 id="correct-title">Correct every affected instruction</h2>
      <p>Consider a subscription business that changes its billing rule. The new rule moves every collection to the first day of the month, even though some customers agreed to other dates. One customer reports an early debit.</p>
      <p>Review every instruction produced by that rule, not only the customer who complained. Separate entries that are still waiting to be sent from those already submitted or returned. Hold incorrect instructions before release and ask the provider how to resolve payments that have already been sent.</p>
      <p>The preventive change is a comparison between each scheduled amount and date and its authorization record. Send mismatches for review before collection. When a customer changes bank details, confirm that the replacement receives the required checks and that the old record cannot create a duplicate debit.</p>
      <p>A process fix does not retroactively change a payment or create permission to collect again. Nacha permits reinitiation only in specified circumstances. Cybersource’s eCheck documentation also limits resubmission for insufficient or uncollected funds. Follow the rules and provider instructions for the actual return, rather than applying one retry policy to every failure.</p>
      <p>Tell the customer what happened, whether another collection is planned and what action they need to take. Keep correction of the payment separate from changes to the service agreement. Our <Link href="/company/blog/how-recurring-ach-payments-work" prefetch={false}>recurring ACH article</Link> explains billing changes and cancellations.</p>
    </section>
    <section id="check" aria-labelledby="check-title">
      <h2 id="check-title">Check whether the change worked</h2>
      <p>A lower number of returns is not enough to show improvement if collection volume also fell. Compare the same type of problem across a consistent group of payments and allow time for later returns to appear.</p>
      <ol>
        <li><strong>Set a clear baseline.</strong> Record affected collections and the total exposed to the process. Keep failures before submission separate from later ACH returns, and distinguish first attempts from retries.</li>
        <li><strong>Review the next run.</strong> Compare prepared amounts, dates and bank account records with the agreed instructions. Check affected accounts and a sample of unaffected ones for duplicate or missing collections.</li>
        <li><strong>Follow the recorded outcome.</strong> Use the provider’s reports to review processing results and later returns. A pending payment is not a successful recovery, and a missing response is not a reason to submit it again.</li>
        <li><strong>Assign responsibility.</strong> Give someone ownership of the correction and its review. If the same pattern remains, check whether the control was bypassed or the original diagnosis missed another cause.</li>
      </ol>
      <p>This comparison is an internal improvement measure. It does not replace the return rate calculations or monitoring required by your bank or provider. Keep the period, payment group and type of return visible so that successive reviews are comparable.</p>
      <p>For merchants using Trolleys, an Etail Depot service, <Link href="/services/ach-payments" prefetch={false}>ACH processing and return handling</Link> depend on the merchant account and supported connection. Confirm which reports and correction options are available for your setup. Use those records to improve the collection process, rather than treating another debit attempt as the solution.</p>
    </section>
  </BlogArticlePage>;
}

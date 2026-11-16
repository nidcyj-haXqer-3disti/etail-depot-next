import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { achRejectionArticle } from "./ach-rejection-content";
import s from "./blog.module.css";

const returnClues = [
  ["R01 / R09", "Funds were not available for the debit. R01 concerns insufficient funds; R09 concerns uncollected funds affecting the available balance."],
  ["R03 / R04", "Investigate the account details. R03 concerns an account that cannot be located or matched; R04 concerns an invalid account number structure."],
  ["R10", "The customer reports that the originator is unknown or was not authorized to debit the account."],
  ["R11", "An authorization exists, but the payment did not follow its terms, such as the agreed amount or date."],
] as const;

export function AchRejectionPage() {
  return <BlogArticlePage article={achRejectionArticle}>
    <p>An invoice is overdue. The bank payment says Failed. It is easy for the next email to sound like a warning about the customer’s finances, even when nobody has checked why the payment failed.</p>
    <p>That assumption can damage a perfectly good relationship. The problem might be an account detail. It might be an account debited earlier than agreed. It might not have reached the banking network at all.</p>
    <p>ACH rejection codes are useful because they give the investigation a direction. They are not a judgment of the customer, and they are not instructions to keep collecting until something works.</p>

    <section id="find-where-it-stopped" aria-labelledby="find-where-it-stopped-title">
      <h2 id="find-where-it-stopped-title">First find out where the payment stopped</h2>
      <p>A rejected submission and a returned ACH entry are different events. Your payment provider can reject missing or invalid information before an entry is sent. After submission to the ACH Network, a receiving bank can return an entry for a reason reported through the network.</p>
      <p>Cybersource’s eCheck documentation describes these successive checks. Passing the initial validation does not establish that the account can be debited successfully. A payment can pass an early stage and still be returned later.</p>
      <p>So look beyond the label on the invoice. Find the payment identifier, the exact message, the submission time and any return information. Ask whether you are reading a provider’s validation error or an ACH return reason. A search result explaining a bank return will not fix a submission that never left your software.</p>
      <p>This also changes the conversation with the customer. If a required field was missing from your submission, asking them to add money to their account sends them in the wrong direction. Establish what happened before deciding what to ask them to do.</p>
    </section>

    <section id="read-the-return-reason" aria-labelledby="read-the-return-reason-title">
      <h2 id="read-the-return-reason-title">The code changes the question you should ask</h2>
      <p>A return code narrows the problem. It does not supply the whole account history or prove why a customer acted. These common examples show why one generic “payment declined” email is a poor fit for ACH collections.</p>
      <table className={s.comparison}>
        <caption>Different return reasons, different conversations</caption>
        <thead><tr><th scope="col">Return code</th><th scope="col">What to investigate</th></tr></thead>
        <tbody>{returnClues.map(([code, meaning]) => <tr key={code}>
          <th scope="row">{code}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to investigate</span>{meaning}</td>
        </tr>)}</tbody>
      </table>
      <p>For an account detail problem, use the approved secure process to have the customer reconfirm their information. Do not guess which digit is wrong. For an authorization question, examine the permission and payment instruction before discussing another debit.</p>
      <p>The account context matters. Nacha’s R10 and R11 distinction applies to consumer receivers and consumer entry types sent to business accounts. Corporate debit entries can use different return codes. Give your provider the account and payment type instead of treating this short comparison as a complete code manual.</p>
      <p>R11 is still treated as an unauthorized return under the rules. Its useful distinction is that an error in an otherwise authorized payment may be correctable. It does not mean that the original debit was acceptable.</p>
    </section>

    <section id="check-your-own-instruction" aria-labelledby="check-your-own-instruction-title">
      <h2 id="check-your-own-instruction-title">Sometimes the account is right and your instruction is wrong</h2>
      <p>Imagine a customer who authorizes a monthly debit on the fifteenth. A scheduling change causes the account to be debited on the twelfth. The amount is correct, the account is open and the customer has agreed to pay. The date is still wrong.</p>
      <p>An R11 return can point to that kind of mismatch. Sending an insufficient funds reminder would misdescribe the problem. Asking for a different bank account would not repair the scheduling rule.</p>
      <p>Compare the authorization with the actual instruction, including the amount and timing. If your business made the mistake, explain it plainly and correct its cause. Confirm the permitted next action with the originating bank or payment provider before submitting a corrected payment.</p>
      <p>Then look at the rest of the billing run. The same rule may have affected other customers who have not contacted you yet. Review unsent instructions separately from payments already submitted. Fixing tomorrow’s schedule does not change what was sent yesterday.</p>
    </section>

    <section id="decide-before-another-debit" aria-labelledby="decide-before-another-debit-title">
      <h2 id="decide-before-another-debit-title">Another attempt should follow a decision</h2>
      <p>Nacha permits reinitiating a returned debit only in specified circumstances. A retry button does not establish that those circumstances apply. Changing the amount or identifying details to evade a restriction is not a valid way around it.</p>
      <p>Even a funds problem does not create unlimited attempts. Cybersource’s eCheck guidance limits resubmission for insufficient or uncollected funds to two additional attempts. Confirm the applicable timing, authorization and account restrictions with your provider. That limit is not a general permission to retry every return twice.</p>
      <p>Keep prior attempts visible when the case moves between people. Your team should know what was submitted, what came back and whether another action is already planned. A customer who has arranged an alternative payment should not encounter an unexplained debit because someone else restarted the original collection.</p>
      <p>This is part of the service conversation we have with Trolleys merchants. Trolleys, an Etail Depot service, offers <Link href="/services/ach-payments" prefetch={false}>ACH payments for eligible account setups</Link>, with authorization, processing and return records connected to the invoice or order. Availability and account terms still need confirmation.</p>
      <p>When <Link href="/company/contact" prefetch={false}>asking our team about a returned payment</Link>, bring the merchant account, payment reference, exact code and prior attempts. Identify whether money was being collected or sent and whether the receiving account is a consumer or business account. Use the approved secure channel for any supporting authorization record; do not email full bank details or credentials.</p>
      <p>A useful answer should explain what needs correcting, whether another collection is permitted and what the customer needs to know. If the same issue keeps returning, our article on <Link href="/company/blog/reduce-ach-payment-failures" prefetch={false}>reducing ACH payment failures</Link> looks at the process behind repeated problems.</p>
    </section>

    <p>The goal is to collect the payment you are entitled to receive while treating the customer fairly. Read the reason first. The next conversation should be based on evidence, not the color of a status label.</p>
  </BlogArticlePage>;
}

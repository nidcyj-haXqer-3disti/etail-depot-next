import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { businessCreditReportArticle } from "./business-credit-report-content";

export function BusinessCreditReportPage() {
  return <BlogArticlePage article={businessCreditReportArticle}>
    <p>“We already paid that” is a reasonable reaction to an overdue balance on a business credit report. It is also the beginning of an investigation. The payment in your records and the entry on the report need to be connected before anyone can establish what went wrong.</p>
    <p>Start with the report itself. If a lender or supplier has raised a concern, ask which reporting agency and entry they used. Match the legal business name, address and file identifier before buying or disputing a report. Save the copy and its date. A result for a similarly named business is not a useful starting point.</p>
    <p>Experian distinguishes its free company search from a purchased business credit report. Its reports can include payment history, credit obligations, legal filings and company information. Read those details as well as the score. Experian also says that checking your own business report does not affect your business credit score.</p>
    <section id="follow-the-invoice" aria-labelledby="follow-the-invoice-title">
      <h2 id="follow-the-invoice-title">Follow the payment all the way to the invoice</h2>
      <p>Suppose your records show a supplier was paid, while a report still shows an overdue balance. Pull the invoice, agreed payment terms and payment confirmation together. Then ask the supplier which invoice received the payment and when it was applied. A transfer leaving your bank account does not, by itself, show how the supplier recorded it.</p>
      <p>The dates can change the explanation. A report may describe a period before the payment. A supplier may have applied the money to another outstanding invoice. Or the invoice may have been paid after its due date. These are possibilities to investigate, not conclusions to draw from the balance alone.</p>
      <p>Current debt and payment history answer different questions. If a bill was genuinely paid late, showing that it is now paid does not establish that the earlier lateness was an error. Ask for the particular inaccurate fact to be corrected. “This balance is still shown as outstanding” is a different concern from “this payment was reported late despite being received within the agreed terms.”</p>
      <p>An unfamiliar entry also needs interpretation before accusation. Experian says some of its reports display supplier categories rather than actual supplier names. Ask the bureau how to identify an entry you cannot match. Avoid assuming that every unfamiliar label belongs to another company.</p>
      <p>This is where the detail in your <Link href="/company/blog/accounts-payable-vs-accounts-receivable" prefetch={false}>accounts payable records</Link> earns its keep. An invoice reference, due date and payment allocation give the supplier something specific to investigate. A spreadsheet marked “paid” may leave the most important question unanswered.</p>
    </section>
    <section id="correction-result" aria-labelledby="correction-result-title">
      <h2 id="correction-result-title">Read the answer to the dispute</h2>
      <p>Experian directs businesses with a current report to the “Submit Data Dispute” button at the bottom of that report. Identify the entry, explain what you believe is wrong and provide the relevant evidence through the official process. Experian investigates with the organizations that supplied the information. It says it notifies the business when the investigation finishes and provides another report for confirmation if changes are made.</p>
      <p>For Dun &amp; Bradstreet, the free D-U-N-S Profile Manager is available to eligible US businesses that are not publicly traded. A verified owner, director or officer can request changes to business details and dispute reported payment experiences. D&amp;B reviews and validates requests; submitting one does not guarantee it will be accepted or added to the file.</p>
      <p>Keep the case reference, the original report and the documents you sent. When an answer arrives, compare it with the concern you raised. Did it address the outstanding balance, the payment date, the company identity or something else? If it leaves a discrepancy unexplained, follow up on that exact point with the supporting record.</p>
      <p>A corrected report is worth keeping even if the score barely changes. It establishes what was resolved and gives you a record for the next conversation with a lender or supplier. <Link href="/company/blog/common-mistakes-when-building-business-credit" prefetch={false}>Building business credit</Link> involves more than one payment entry, and a correction does not promise a credit approval. The useful outcome here is simpler: when someone reads your company’s record, the facts should be right.</p>
    </section>
  </BlogArticlePage>;
}

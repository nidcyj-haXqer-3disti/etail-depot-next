import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { ediPaymentsArticle } from "./edi-payments-content";
import s from "./blog.module.css";

const paymentTerms = [
  ["EDI", "Electronic Data Interchange", "A structured way to exchange documents such as invoices and payment details."],
  ["ACH", "Automated Clearing House", "The US network used for electronic bank payments, including credits and authorized debits."],
  ["EFT", "Electronic funds transfer", "A broad term for moving money electronically. ACH is one type of EFT."],
] as const;

export function EdiPaymentsPage() {
  return <BlogArticlePage article={ediPaymentsArticle}>
    <p>A supplier receives a payment but cannot tell which invoices it covers. The money arrived; the explanation did not. That is the problem remittance information helps solve. It connects a payment with the customer, invoices and adjustments behind it.</p>
    <section id="three-terms" aria-labelledby="three-terms-title">
      <h2 id="three-terms-title">Separate the message from the transfer</h2>
      <table className={s.comparison}>
        <caption>Three terms that describe different parts of the process</caption>
        <thead><tr><th scope="col">Term</th><th scope="col">Full name</th><th scope="col">What it describes</th></tr></thead>
        <tbody>{paymentTerms.map(([term, name, meaning]) => <tr key={term}>
          <th scope="row">{term}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Full name</span>{name}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it describes</span>{meaning}</td>
        </tr>)}</tbody>
      </table>
      <p>These are not three competing payment methods. EDI describes the information format, while ACH identifies a payment network. “Pay by EFT” alone does not tell you which network or process the sender will use.</p>
      <p>Ask your trading partner to name the payment method and the required document format separately. Then check whether your bank, payment provider and accounting software support that combination.</p>
    </section>
    <section id="message" aria-labelledby="message-title">
      <h2 id="message-title">What the payment message tells the recipient</h2>
      <p>Remittance advice explains how to apply a payment to outstanding invoices. X12’s 820 transaction set can carry an instruction to a financial institution to pay, remittance details, or both. The information can pass directly between businesses or through a bank or another intermediary.</p>
      <p>That does not mean every EDI document moves money. An invoice, a payment instruction and confirmation of a completed transfer serve different purposes. Check which document your partner expects and which record confirms the payment result.</p>
      <p>ACH payment types also differ in the remittance information they can carry. A supported ACH connection does not establish support for every EDI format or every invoice detail. Agree on how the recipient will access the information, including any advice delivered separately.</p>
    </section>
    <section id="matching" aria-labelledby="matching-title">
      <h2 id="matching-title">Match one payment to several invoices</h2>
      <p>Suppose a customer pays two invoices together and deducts an agreed credit from one of them. The recipient needs more than the total received. The advice should identify each invoice, the amount applied to it and the credit that explains the difference.</p>
      <p>Keep a shared payment reference with the transfer and its advice. When matching the records, compare the payer, currency, invoice allocations and adjustments with the actual payment result. Equal totals alone may not identify the right invoices.</p>
      <p>If the advice arrives but the payment cannot be found, investigate the transfer before marking the invoices paid. If money arrives without usable advice, hold it for matching and request the missing information. Neither situation is a reason to send a second payment without checking the first.</p>
      <p>The <Link href="/company/blog/transaction-details-reports" prefetch={false}>transaction report guide</Link> explains how references and status changes help you trace a payment. Keep those records alongside the invoice allocation, rather than replacing one with the other.</p>
    </section>
    <section id="setup" aria-labelledby="setup-title">
      <h2 id="setup-title">Agree on a process with your trading partner</h2>
      <ol>
        <li><strong>Confirm the two routes.</strong> Agree on the payment method, document format and delivery channel. Name the bank, software or provider responsible for each part.</li>
        <li><strong>Agree on the matching details.</strong> Include the customer and invoice references, currency, amounts, credits and shared payment reference. Confirm the required format version and fields with the recipient.</li>
        <li><strong>Test the exceptions.</strong> Check a partial payment, an unknown invoice, a rejected transfer and a repeated message. Confirm that importing the same advice twice does not apply the payment twice.</li>
        <li><strong>Assign follow-up.</strong> Decide who investigates missing advice, unmatched funds and rejected files. Keep a contact and a way to trace each submission.</li>
      </ol>
      <p>A successful file delivery is not the same as a completed payment. Your team needs to know whether the recipient received the file, accepted its contents and matched the money.</p>
      <p>For merchants using Trolleys, an Etail Depot service, <Link href="/services/ach-payments" prefetch={false}>ACH availability and account terms</Link> must be confirmed for your business. If a trading partner requires EDI, ask specifically about the required format and delivery method before choosing a connection.</p>
    </section>
    <section id="records" aria-labelledby="records-title">
      <h2 id="records-title">Keep the records useful after transmission</h2>
      <p>Structured information can reduce retyping, but it cannot correct the wrong invoice number or an unapproved deduction. Review unmatched items and retain the supporting invoices, credits, remittance advice and payment records. The IRS identifies invoices and proof of payment among the documents that support business books.</p>
      <p>EDI describes how information is organized. It does not, by itself, establish secure delivery, access permissions or successful settlement. Confirm those controls with the services handling the exchange.</p>
      <p>If you also need to understand who starts the transfer, read <Link href="/company/blog/ach-debit" prefetch={false}>what an ACH debit is</Link>. That is a separate decision from how you send the invoice details.</p>
    </section>
  </BlogArticlePage>;
}

import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { b2bPaymentsArticle } from "./b2b-payments-content";
import s from "./blog.module.css";

const methods = [
  ["ACH credit", "The payer instructs its bank or provider to send funds.", "Verify the recipient’s bank details, submission cutoff, expected availability and invoice references."],
  ["ACH debit", "The collecting business initiates a payment under the payer’s authorization.", "Agree on authorization, collection dates, account requirements and handling of returns."],
  ["Bank wire", "The payer instructs its bank or provider to transfer funds.", "Confirm destination, currency, fees, cutoff and how the recipient will confirm receipt."],
  ["Card", "The buyer pays through a card process the seller accepts.", "Compare the seller’s processing terms with the buyer’s card terms, including any borrowing costs."],
  ["Check", "The payer issues a check for the recipient to deposit.", "Allow for delivery and deposit, track the check and agree how to handle a missing payment."],
] as const;

export function B2bPaymentsPage() {
  return <BlogArticlePage article={b2bPaymentsArticle}>
    <section id="method-workflow" aria-labelledby="method-workflow-title">
      <h2 id="method-workflow-title">Connect the payment to the invoice</h2>
      <p>The invoice explains what is owed. An approval records who authorized the purchase or payment. The payment method moves the money. Keep those three parts connected so both businesses can explain what was paid and what remains due.</p>
      <p>A purchase order or a term such as “net 30” is not a payment method. A link or wallet can be the way a customer reaches a card or bank payment. Financing changes how a purchase is funded. Identify the underlying payment method before comparing costs, timing or protections.</p>
      <p>Start with the transaction: an occasional supplier bill, a regular collection or an urgent purchase. Ask which methods the other business accepts and what information its accounts team needs to match the payment.</p>
    </section>
    <section id="compare" aria-labelledby="compare-title">
      <h2 id="compare-title">Compare the methods you can use</h2>
      <table className={s.comparison}>
        <caption>Five methods for paying another business</caption>
        <thead><tr><th scope="col">Method</th><th scope="col">Who starts it</th><th scope="col">What to check</th></tr></thead>
        <tbody>{methods.map(([method, initiation, checks]) => <tr key={method}>
          <th scope="row">{method}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Who starts it</span>{initiation}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to check</span>{checks}</td>
        </tr>)}</tbody>
      </table>
      <p>ACH can send money or collect it. With an <Link href="/company/blog/ach-debit" prefetch={false}>ACH debit</Link>, establish the required authorization and business agreement before collecting. Corporate ACH entries can also carry payment information, but confirm what your service supports and what the recipient can use.</p>
      <p>Fedwire is one US wire service. Transfers between its participants are final and irrevocable once processed. That does not mean every instruction called a “wire” reaches a customer instantly. Ask the sending bank about its cutoff, processing status and the expected receipt.</p>
      <p>A virtual card is still a card payment. Visa describes virtual cards issued through financial institutions for uses such as supplier payments. Check whether the supplier accepts that arrangement and what controls and terms the issuer provides.</p>
      <p>Compare the full provider arrangement, including failures and unmatched payments. There is no single cheapest method for every business. Our <Link href="/company/blog/card-vs-ach-payments" prefetch={false}>card and ACH comparison</Link> explains the different questions to ask about acceptance.</p>
    </section>
    <section id="example" aria-labelledby="example-title">
      <h2 id="example-title">Match one payment to two invoices</h2>
      <p>Suppose a print shop pays one supplier for paper and packaging. The supplier issued two invoices, but the shop sends one payment covering both.</p>
      <p>The shop should provide both invoice numbers and the amount allocated to each. This supporting explanation is often called remittance information. If it travels separately from the payment, include a reference that lets the supplier connect the two records.</p>
      <p>The total alone may not tell the supplier which bills to close. Confirm any credits or partial payments, retain the allocation and check the remaining balances. The invoice references help match the bill; they do not verify that the money went to the correct account.</p>
    </section>
    <section id="controls" aria-labelledby="controls-title">
      <h2 id="controls-title">Verify changed payment instructions</h2>
      <p>A familiar supplier name on an email is not enough to approve new bank details. The FBI recommends independently verifying payment requests and changes to account numbers or payment procedures.</p>
      <p>Use an established contact or independently obtained phone number. Do not rely on a new number included in the change request. Record who confirmed the change before updating the recipient’s instructions.</p>
      <p>Keep the invoice, approval, payment reference and supporting records together. The IRS explains that invoices, receipts and proof of payment can support business records, and that more than one document may be needed. A payment status alone does not explain the underlying purchase.</p>
      <p>If you suspect funds were sent to a fraudster, contact your financial institution immediately. Assign someone to follow the investigation and retain its case reference. Recovery is not guaranteed.</p>
    </section>
    <section id="automation" aria-labelledby="automation-title">
      <h2 id="automation-title">Test automation with a payment that goes wrong</h2>
      <p>Before relying on an automated process, ask the provider to demonstrate more than a successful payment. Use a test environment or a walkthrough to check three situations:</p>
      <ol>
        <li><strong>A partial payment.</strong> Can your team see which invoice was paid, how much was applied and what remains outstanding?</li>
        <li><strong>A changed invoice.</strong> Can someone review the revised amount and approval before a scheduled payment is released?</li>
        <li><strong>A failed or uncertain result.</strong> Can your team investigate the original instruction, identify the next action and avoid sending a duplicate?</li>
      </ol>
      <p>Investigate an uncertain payment before resending it. Agree who handles exceptions, what each status means and how the final result reaches your accounting records. A useful process leaves both businesses able to identify the payment and explain the balance.</p>
    </section>
  </BlogArticlePage>;
}

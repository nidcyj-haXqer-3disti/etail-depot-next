import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { bankAccountNumberArticle } from "./bank-account-number-content";
import s from "./blog.module.css";

const bankDetails = [
  ["Routing or bank identifier", "Identifies the financial institution or payment route.", "Use the identifier supplied for that payment method."],
  ["Account number", "Identifies the account receiving or making the payment.", "Copy the complete verified value, including leading zeros."],
  ["Invoice or customer reference", "Helps the recipient match a payment to a bill or customer.", "Enter it in the reference field, not as the bank account number."],
  ["Card number", "Identifies a card used for card payments.", "Do not substitute it for the account number on an ACH form."],
] as const;

export function BankAccountNumberPage() {
  return <BlogArticlePage article={bankAccountNumberArticle}>
    <p>For a business, the practical task is to copy the right details, preserve them accurately and verify who supplied them. A payment form accepting an entry does not prove the money will reach the intended account.</p>
    <section id="locate" aria-labelledby="locate-title">
      <h2 id="locate-title">Get the number from your bank</h2>
      <p>Open your bank’s app or website directly and sign in. Look for the account details or receiving instructions for the account you intend to use. Nacha recommends getting account and routing numbers from your bank or credit union; a personal check can also show them.</p>
      <p>If the labels are unclear, ask the bank. Do not infer an account number from a debit card or use a masked statement that shows only the last few digits. Use the full value supplied by the bank rather than assuming every account has the same length.</p>
      <h3>Keep the leading zeros</h3>
      <p>Suppose a business copies verified account details into a spreadsheet. The software treats the account number as a quantity and removes its leading zeros. A later export then contains a different payment instruction.</p>
      <p>Microsoft documents this behavior in Excel. If an approved business process requires an import, treat account identifiers as text before importing or entering them. Long numeric values can also lose precision.</p>
      <p>Changing the format afterward does not recover digits already lost. Return to the bank’s original record and replace the altered value. Do not add zeros from memory. Check the exported file as well as the value displayed on screen.</p>
    </section>
    <section id="distinguish" aria-labelledby="distinguish-title">
      <h2 id="distinguish-title">Keep each number in its own field</h2>
      <p>These details serve different purposes. An invoice reference helps identify the bill; it cannot direct a payment to a bank account.</p>
      <dl className={s.identifierList}>
        {bankDetails.map(([detail, purpose, check]) => <div key={detail}>
          <dt>{detail}</dt>
          <dd><p>{purpose}</p><p className={s.accountingNote}>{check}</p></dd>
        </div>)}
      </dl>
      <p>Keep the bank’s instructions together with the payment method they apply to. Our <Link href="/company/blog/routing-number" prefetch={false}>routing number article</Link> explains why ACH and wire details can differ.</p>
      <h3>Validation is not the same as permission</h3>
      <p>A form can check the format without confirming account ownership. Nacha’s minimum account validation standard for online consumer ACH debits checks whether an account is open and can accept ACH entries. That minimum does not itself establish ownership; stronger checks may be appropriate for the business and its risks.</p>
      <p>Permission to debit the account is a separate requirement. Follow your provider’s authorization and verification process rather than treating possession of the number as consent. Our <Link href="/company/blog/ach-verification" prefetch={false}>ACH verification article</Link> explains the distinction.</p>
    </section>
    <section id="protect" aria-labelledby="protect-title">
      <h2 id="protect-title">Verify changes before using them</h2>
      <p>The FBI advises independently checking changes to account numbers or payment instructions. An urgent message, familiar signature or plausible account number does not establish that the request is genuine.</p>
      <ol>
        <li><strong>Confirm the request.</strong> Contact the supplier or customer through an established channel. Do not rely on a new phone number supplied in the message asking for the change.</li>
        <li><strong>Verify the new details.</strong> Confirm the intended account and payment method, then complete the bank or provider’s applicable checks before using it.</li>
        <li><strong>Replace the saved instruction carefully.</strong> Record who confirmed the change and when. Mark the old instruction as superseded so staff do not reuse it accidentally.</li>
      </ol>
      <p>Keep the full details in your approved business system, with access limited to people who need them. Use masked views in routine reports when the complete number is unnecessary.</p>
      <p>If money has already been sent using incorrect details, contact the initiating bank or payment provider promptly. Establish the first payment’s status before sending a replacement. If you suspect fraud, the FBI recommends contacting your financial institution immediately; recovery is not guaranteed.</p>
    </section>
  </BlogArticlePage>;
}

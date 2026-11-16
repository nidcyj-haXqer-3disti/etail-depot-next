import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { routingNumberArticle } from "./routing-number-content";
import s from "./blog.module.css";

const paymentDetails = [
  ["Routing number", "Identifies the financial institution for payment routing.", "Use the number supplied for the intended payment method. It is not the recipient’s account number."],
  ["Account number", "Identifies the account within the receiving arrangement.", "Use the recipient’s confirmed account details. A bank’s routing number cannot replace this field."],
  ["Payment reference", "Helps the recipient match the money to an invoice, order or customer.", "Enter it in the designated reference field. It does not identify the bank account or prove that money arrived."],
] as const;

export function RoutingNumberPage() {
  return <BlogArticlePage article={routingNumberArticle}>
    <p>Start with the account’s current bank instructions. Do not choose a number just because it appears beside the bank’s name in a search result or worked for a different kind of payment.</p>
    <section id="roles" aria-labelledby="roles-title">
      <h2 id="roles-title">Separate the bank identifier from the account</h2>
      <p>A transfer form can ask for several numbers. They have different jobs, even when they appear together on an invoice or payment instruction.</p>
      <figure className={s.editorialIdentifiers} aria-labelledby="routing-details-caption">
        <figcaption id="routing-details-caption">Three details that should stay separate</figcaption>
        <dl className={s.editorialDefinitions}>
          {paymentDetails.map(([detail, purpose, check]) => <div key={detail}>
            <dt>{detail}</dt>
            <dd><p>{purpose}</p><p>{check}</p></dd>
          </div>)}
        </dl>
      </figure>
      <p>For your own account, use your bank’s signed-in website, app or current bank-issued instructions. If someone is paying you, share the appropriate receiving instructions through your agreed secure channel. Include the required <Link href="/company/blog/customer-reference-in-credit-transfers" prefetch={false}>payment reference</Link> separately.</p>
      <p>Do not infer the number from your current address. Bank of America, for example, says its routing numbers can depend on the state where the account was opened, which may differ from where the customer now lives. That is a reason to confirm the account’s details, not a rule to apply to every bank.</p>
      <h3>Saved ACH details do not settle a wire request</h3>
      <p>A business regularly pays a supplier by ACH. The supplier later requests a domestic wire for an urgent order. Before reusing the saved details, the business should obtain and verify the supplier’s wire instructions.</p>
      <p>Some banks use different numbers for ACH and wires, as Bank of America’s wire guidance explains. A successful ACH payment does not confirm that the same routing number is correct for a wire. Our <Link href="/company/blog/ach-vs-wire-transfers" prefetch={false}>ACH and wire comparison</Link> explains the wider differences.</p>
    </section>
    <section id="verify" aria-labelledby="verify-title">
      <h2 id="verify-title">Check the instruction, not just the digits</h2>
      <p>Before saving a recipient or changing payment details, make these three checks.</p>
      <ol>
        <li><strong>Confirm the payment method.</strong> Establish whether you are sending ACH, a domestic wire or an international transfer. Request instructions for that method, including any additional bank identifiers or receiving instructions.</li>
        <li><strong>Confirm the destination.</strong> Check the recipient name and complete account details through a trusted channel. Preserve leading zeros and review copied information before saving it. Do not treat a recognized bank name as confirmation of the recipient.</li>
        <li><strong>Verify changes independently.</strong> For an unexpected change, call a contact already known to your business. Use a number you trust, rather than one supplied in the change request. Urgency is a reason to review the instruction carefully.</li>
      </ol>
      <p>The Federal Reserve’s routing directory provides information about participating institutions for FedACH and Fedwire. Finding an institution there does not verify a particular customer account or show that an email requesting payment is genuine.</p>
      <p>Even an account check has limits. For consumer ACH debits authorized online, Nacha distinguishes the minimum check that an account is open and accepts ACH entries from verifying its ownership. Our <Link href="/company/blog/ach-verification" prefetch={false}>account verification article</Link> explains those separate checks. A routing-number lookup is not a substitute for them.</p>
    </section>
    <section id="mistake" aria-labelledby="mistake-title">
      <h2 id="mistake-title">Act quickly if the details were wrong</h2>
      <p>Contact the bank or provider that initiated the payment. Have the payment reference, amount, date and submitted details ready, and share them through its secure support channel. Ask whether the instruction can still be stopped or whether it was sent, rejected, returned or received.</p>
      <p>Do not assume an incorrect routing number will always cause an automatic rejection. Bank of America warns that an incorrect wire routing number can delay a transfer, cause a rejection or return, or send it to an unintended account. The available response depends on the payment’s actual status.</p>
      <p>If the instructions may be fraudulent, contact your financial institution immediately. The FBI also directs businesses to report suspected business email compromise to IC3. Keep the original message and transfer records.</p>
      <p>Resolve the first payment’s status with the provider before sending a replacement. Otherwise, both may arrive. Update the saved instructions only after verification, and keep a record of who confirmed the change. Correcting the details does not by itself recover money already sent.</p>
    </section>
  </BlogArticlePage>;
}

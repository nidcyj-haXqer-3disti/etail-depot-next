import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { sortCodeRoutingArticle } from "./sort-code-routing-content";
import s from "./blog.module.css";

const bankDetails = [
  ["Length", "Six digits.", "Nine digits."],
  ["Used with", "The recipient’s account number for the relevant UK payment service.", "The recipient’s account number for the relevant US payment service."],
  ["Payment route", "Confirm that the sort code and account support the intended payment system.", "Confirm the number for the intended transfer. ACH and domestic wire instructions can differ."],
] as const;

export function SortCodeRoutingPage() {
  return <BlogArticlePage article={sortCodeRoutingArticle}>
    <p>When a payment form asks for details you do not have, first check whether it supports the destination. Adding zeros to a sort code does not turn it into a US routing number.</p>
    <section id="local-details" aria-labelledby="local-details-title">
      <h2 id="local-details-title">Use the details for the relevant banking system</h2>
      <p>Neither identifier replaces the recipient’s account number. Both are part of a set of payment instructions, and the correct set depends on the receiving account and how the money will be sent.</p>
      <table className={s.comparison}>
        <caption>UK and US details are different identifiers</caption>
        <thead><tr><th scope="col">What to compare</th><th scope="col">UK sort code</th><th scope="col">US routing number</th></tr></thead>
        <tbody>{bankDetails.map(([detail, uk, us]) => <tr key={detail}>
          <th scope="row">{detail}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">UK sort code</span>{uk}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">US routing number</span>{us}</td>
        </tr>)}</tbody>
      </table>
      <p>Pay.UK allocates sort codes to eligible payment service providers. Registration with the relevant payment system matters: having a sort code does not establish access to every UK payment route.</p>
      <p>In the US, a routing number identifies a financial institution. Some banks use different numbers for ACH and domestic wires. Bank of America explicitly warns customers to confirm the wire instructions rather than assume the ACH details will work. Our <Link href="/company/blog/routing-number" prefetch={false}>routing number article</Link> covers that check.</p>
      <h3>A UK supplier on a US payment form</h3>
      <p>A US business receives a UK supplier’s sort code and account number. Its supplier payment form requires a nine-digit routing number. The business should not add digits or put the sort code in an unrelated field to make the form accept it.</p>
      <p>Instead, ask the sending bank which service supports the supplier’s account and currency. Request the supplier’s bank-issued instructions for that service. A form designed only for US ACH details may not support the intended payment.</p>
    </section>
    <section id="obtain" aria-labelledby="obtain-title">
      <h2 id="obtain-title">Get complete instructions for the payment</h2>
      <p>Resolve these three questions together before saving the recipient.</p>
      <ol>
        <li><strong>Where is the account, and which currency should arrive?</strong> Confirm the receiving account’s country and agreed currency. Establish whether the recipient expects local or international payment instructions.</li>
        <li><strong>Which fields does the service require?</strong> Follow the sending bank’s definitions and the receiving bank’s instructions. Ask about missing information instead of inventing a conversion between identifiers.</li>
        <li><strong>Who confirmed the details?</strong> Verify the recipient and any changed instructions through an established contact. The FBI advises checking changes to bank details independently. A plausible code does not authenticate an email.</li>
      </ol>
      <p>For your own account, retrieve details through your bank’s signed-in app, website or current bank documents. NatWest, for example, explains where its customers can find their sort code and account number in digital banking and on statements.</p>
      <h3>When the bank asks for an IBAN or BIC</h3>
      <p>An IBAN identifies an account in an international format. A BIC, often called a SWIFT code in payment instructions, identifies the relevant institution. These are separate fields, not alternative names for a sort code.</p>
      <p>Request them from the recipient when the service requires them. Not every country uses IBANs: NatWest’s guidance notes that the US does not. Use the complete instructions for the destination rather than trying to construct an IBAN yourself.</p>
    </section>
    <section id="resolve" aria-labelledby="resolve-title">
      <h2 id="resolve-title">Stop when a field does not fit</h2>
      <p>A rejected form may indicate that the selected payment service does not fit the account, or that details are missing. Ask the bank to clarify the requirement. Do not alter valid account details simply to pass a form check.</p>
      <p>Before choosing another service, confirm its fees, exchange rate and expected delivery. The identifier alone does not establish the cost or timing. For US transfers, our <Link href="/company/blog/ach-vs-wire-transfers" prefetch={false}>ACH and wire comparison</Link> explains why the payment method matters.</p>
      <p>Keep local and international receiving instructions clearly labeled, with the account, currency, payment method and date verified. When instructions change, confirm the new details before replacing the saved record. A previous successful payment is useful history, not a reason to guess a different set of instructions.</p>
    </section>
  </BlogArticlePage>;
}

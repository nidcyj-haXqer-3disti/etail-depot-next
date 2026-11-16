import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { crossBorderControlsArticle } from "./cross-border-controls-content";
import s from "./blog.module.css";

export function CrossBorderControlsPage() {
  return <BlogArticlePage article={crossBorderControlsArticle}>
    <p>The purchase order is signed. The supplier is known. Finance has approved the deposit. Then a message arrives asking for euros instead of dollars, and the person preparing the transfer treats it as an administrative change.</p>
    <p>It may be entirely legitimate. It can still change the cost, the receiving instructions and the amount the supplier expects. The invoice number staying the same does not mean the payment is the same.</p>
    <p>For a business paying suppliers abroad, that gap is where a useful control belongs: between approving the obligation and releasing the actual money.</p>

    <section id="approve-the-actual-payment" aria-labelledby="approve-the-actual-payment-title">
      <h2 id="approve-the-actual-payment-title">The approval needs an amount and a currency</h2>
      <p>Consider a hypothetical supplier deposit originally agreed at USD 12,000. Before payment, the supplier proposes replacing it with EUR 11,000. Suppose an available exchange quote is USD 1.10 for each euro.</p>
      <p><strong className={s.editorialFormula}>EUR 11,000 × USD 1.10 per EUR = USD 12,100</strong></p>
      <p>The revised principal is USD 100 higher than the original dollar deposit, before separate fees. These are illustrative amounts and an assumed quote, not a current exchange rate or a Trolleys price. If the quote expires or the amount changes, the calculation needs to change too.</p>
      <p>The question is not whether EUR 11,000 looks close to USD 12,000. It is whether the business agreed to the revised obligation and authorized the total debit. If an existing approval allows a defined tolerance, check the payment against that authority. Otherwise, obtain a revised approval rather than silently stretching the old one.</p>
      <p>Keep the agreed invoice currency distinct from the currency used to fund the transfer. Paying a euro invoice from a dollar account creates a conversion question; changing a dollar invoice into a euro obligation also changes the commercial agreement. The supplier and buyer should understand which change they are making.</p>
      <p>Review the executable quote and its validity, the exchange rate, separate fees and any charges that may reduce what arrives. A headline transfer fee does not describe the whole cost. If the provider cannot guarantee the net receipt, establish how any difference will be handled with the supplier.</p>
      <p>The due date also deserves a precise meaning. Does the contract require the money to be received by that date, or a different agreed event? An instruction submitted late on the due date is not evidence that the supplier received the funds on time. Confirm the route’s cutoff and expected arrival before promising a date.</p>
    </section>

    <section id="changes-need-visible-review" aria-labelledby="changes-need-visible-review-title">
      <h2 id="changes-need-visible-review-title">Make the changed instruction visible</h2>
      <p>A payment approver needs to see what changed: the recipient, receiving account, currency, amount or timing. Showing the original invoice beside a generic approval button leaves too much outside the decision.</p>
      <p>Start with the obligation itself. For a supplier deposit, retain the agreed order and deposit terms. For an invoice payable after delivery, keep the relevant delivery or milestone evidence. A payment to an external payroll-service business for its service fee is a supplier payment; wages paid directly to employees need their own process.</p>
      <p>Transfers between related companies also need a stated purpose and the correct legal entities. Common ownership does not explain whether a movement pays an invoice, funds a loan or contributes capital. Resolve that classification and the required supporting documents with the appropriate accounting and legal advisers.</p>
      <p>Then check the destination independently. The FBI recommends verifying changes to payment instructions through an established or independently obtained contact. Use that confirmation before updating the supplier record. A number included in the change request is not independent verification.</p>
      <p>Where your team can separate responsibilities, have the person authorizing release review the verified destination and current payment details. If the same person must prepare and release payments, define a practical review arrangement appropriate to the business. Do not describe an approval as independent when it is only the preparer checking their own work.</p>
      <p>Keep the approved version with the instruction that was sent. If a later edit changes a material detail, bring that change back through the applicable approval process. Software should make that difference visible; automation is not a reason to lose it.</p>
    </section>

    <section id="close-the-right-obligation" aria-labelledby="close-the-right-obligation-title">
      <h2 id="close-the-right-obligation-title">A debit is not the end of the story</h2>
      <p>Your bank account being debited tells you that money left that account. It does not, by itself, prove that the supplier received the agreed amount or applied it to the right invoice.</p>
      <p>Payment status needs its own evidence. Swift’s confirmation framework distinguishes outcomes such as recipient credit, rejection and a hold. Ask the provider handling your transfer what status it can supply and what that status means. Do not assume every business has direct access to the same tracking tools.</p>
      <p>Keep the approved obligation, verified recipient details, exchange quote, total debit and provider reference connected. Resolve a short receipt or missing invoice reference as a specific exception. Whether an invoice balance is discharged follows the agreement and the evidence, not the fact that someone pressed Send.</p>
      <p>If the supplier cannot find the payment, investigate the existing transfer before sending another. If charges explain a difference, establish who is responsible under the agreed terms. If the payment failed, confirm its status and the correction required before authorizing a replacement.</p>
      <p>For a Trolleys merchant, the incoming side matters to this planning too. <Link href="/services/payouts" prefetch={false}>Trolleys, an Etail Depot service</Link>, helps merchants follow the payments and adjustments behind their payouts. A customer sale, available merchant funds and a bank deposit are separate events; plan supplier commitments against the relevant confirmed funds and account terms.</p>
      <p>The current <Link href="/company/legal/payouts-and-reserves#scope" prefetch={false}>funding schedule</Link> covers USD payouts to approved US bank accounts. It does not establish a service for sending international supplier payments. Bring an unclear merchant payout to our <Link href="/company/contact#account-support" prefetch={false}>account support team</Link>; take an outgoing supplier transfer to the bank or provider that sent it.</p>
      <p>A good approval trail answers a straightforward question: did the business authorize the payment that actually happened? Across currencies and borders, that answer needs more than an approved invoice.</p>
    </section>
  </BlogArticlePage>;
}

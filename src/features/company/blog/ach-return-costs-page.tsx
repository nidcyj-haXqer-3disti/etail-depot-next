import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { achReturnCostsArticle } from "./ach-return-costs-content";

export function AchReturnCostsPage() {
  return <BlogArticlePage article={achReturnCostsArticle}>
    <p>The return fee is usually the easiest part of a failed bank payment to notice. It has a label and an amount. The time spent reopening an invoice, finding the payment record and explaining the problem to a customer is harder to see.</p>
    <p>So is the gap in the cash you expected to collect. If goods have already shipped or work has already been delivered, the business has more at stake than an extra line on its processing statement.</p>
    <p>ACH returns and debit return charges belong in the same conversation, but they are different things. A return concerns the payment itself. A return charge is a separate fee that may apply under your account terms. Understanding both helps you judge the cost of accepting bank payments without treating every unsuccessful collection as the same problem.</p>

    <section id="separate-payment-and-fee" aria-labelledby="separate-payment-and-fee-title">
      <h2 id="separate-payment-and-fee-title">The returned payment is not a processing fee</h2>
      <p>An ACH return sends a payment entry back through the banking process with a reason. For a business collecting a debit, it can mean that the expected payment has not been collected or that funds previously credited are adjusted out of the account.</p>
      <p>Cybersource’s eCheck guidance explains that a payment can pass initial validation and still be returned later. The return amount is reflected in the settlement account and statement. The original successful submission is therefore only part of the payment’s history.</p>
      <p>Keep the original collection, its return and any contractual fee distinct in your records. The amount of the returned sale should not disappear into a general category called “bank charges.” Equally, a return fee should not be mistaken for another unpaid invoice.</p>
      <p>Consider a business that delivers a service, marks the invoice paid and later receives a return notice. Its team now has to establish whether the customer still owes the amount, whether a dispute needs resolving and whether another payment is appropriate. The return alone does not settle those commercial questions.</p>
      <p><strong>The fee is an expense. The returned collection is a payment you cannot count as retained.</strong> Any eventual loss on the sale is a further question. Keeping those distinctions visible makes the conversation with your bookkeeper, provider and customer much clearer.</p>
    </section>

    <section id="avoid-a-second-credit" aria-labelledby="avoid-a-second-credit-title">
      <h2 id="avoid-a-second-credit-title">Do not pay the customer twice while trying to help</h2>
      <p>A customer asks your support team for a refund. They also contact their bank. If the two conversations stay separate, your business can issue a refund while the bank returns the original debit. The customer may receive two credits for one purchase.</p>
      <p>Stripe’s ACH documentation explicitly warns about that overlap. A merchant refund does not prevent the bank dispute process from continuing. Before sending money back, establish what has happened to the debit and whether a return or another credit is already in progress.</p>
      <p>Return, refund and reversal are not interchangeable labels. A bank return follows the ACH return process. A merchant refund is a separate instruction to give money back. An ACH reversal is a restricted correction for a qualifying erroneous entry, subject to its own rules and timing.</p>
      <p>Nacha does not permit reversals simply because the originator failed to fund the original entry. Nor is a reversal a general way to undo an unwanted sale. Ask the provider which action fits the actual record instead of choosing the button that sounds closest to “cancel.”</p>
      <p>The useful customer conversation is specific: what has already been requested, which payment it concerns and who is checking the outcome. Record that answer where the next employee can find it. Good intentions do not protect the business from a second payment sent without the first being resolved.</p>
    </section>

    <section id="who-pays-the-return-charge" aria-labelledby="who-pays-the-return-charge-title">
      <h2 id="who-pays-the-return-charge-title">A fee you pay is not automatically a fee the customer owes</h2>
      <p>Three different charges can be confused in a discussion about an ACH return: the fee your provider charges your business, a fee the customer’s bank may charge its account holder, and a fee your business proposes to charge the customer. One does not establish the amount or permissibility of another.</p>
      <p>Start with your own agreement. Confirm which return events trigger a charge, whether charges differ by reason and what happens to the original processing fee. Do not borrow a fee from another provider’s website and assume it applies to your account.</p>
      <p>Passing a cost to a customer requires a separate review of your customer terms, applicable law and collection method. For consumer accounts, Regulation E includes authorization and notice requirements when a business collects a returned item fee electronically. Its treatment of a fee imposed by the customer’s own bank is different.</p>
      <p>The practical point is straightforward: permission to collect the purchase price is not, by itself, proof that you can debit an extra return fee. Confirm the requirements with your provider and, where needed, legal counsel before adding such a charge to your billing process.</p>
      <p>Even where a charge is permitted, the explanation matters. If the return followed a mistake in your own billing instructions, begin by resolving that mistake. An unexplained fee can turn a payment problem into a customer relationship problem.</p>
    </section>

    <section id="price-the-whole-arrangement" aria-labelledby="price-the-whole-arrangement-title">
      <h2 id="price-the-whole-arrangement-title">Compare the whole ACH arrangement</h2>
      <p>A useful ACH proposal should explain more than the rate for a successful payment. Ask how returns appear in reports, when an adjustment affects your balance, which charges apply and who helps when the customer and payment records disagree.</p>
      <p>That is the discussion to have with Trolleys, an Etail Depot service. Our <Link href="/services/ach-payments" prefetch={false}>ACH service</Link> connects authorization, bank account validation and payment status to invoices and orders. ACH availability, charges and payout conditions depend on the approved account. Our <Link href="/pricing" prefetch={false}>pricing information</Link> keeps those terms separate from card processing rates.</p>
      <p>For cash planning, a deposit that included a collection is not proof that the payment can never be returned. Keep later adjustments linked to the original transaction, even when they appear in another reporting period. Otherwise this month’s statement can obscure the problem with last month’s sale.</p>
      <p>Before trying to collect again, read the <Link href="/company/blog/ach-rejection-codes" prefetch={false}>actual return reason</Link> and review the authorization and prior attempts. Account errors, a funds problem and a disputed debit do not all call for the same response. Another attempt needs to be permitted, not merely possible in the software.</p>
      <p><Link href="/company/contact" prefetch={false}>Bring our team the payment reference and return information</Link> when you need help with a Trolleys account. A useful answer should connect the charge on the statement with the payment event behind it and explain what can happen next. It should not leave you choosing between an unexplained adjustment and a blind retry.</p>
    </section>

    <p>ACH can be a useful way to collect business payments. Judge it by the complete arrangement: money collected, exceptions understood and customers helped. The fee on the statement is only one part of that picture.</p>
  </BlogArticlePage>;
}

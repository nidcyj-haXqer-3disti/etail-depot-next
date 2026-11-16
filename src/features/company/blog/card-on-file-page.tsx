import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardOnFileArticle } from "./card-on-file-content";
import s from "./blog.module.css";

const savedCardUses = [
  ["Save a card for faster checkout", "The customer agrees to save the payment method for later purchases.", "Saving it does not start a subscription or authorize unrelated charges."],
  ["Choose the saved card for a new order", "The customer actively confirms that purchase using the saved method.", "The new payment still needs a result; a stored card is not proof of payment."],
  ["Pay automatically under an agreement", "The business initiates later payments within the agreed billing terms.", "The schedule, amount basis and cancellation process must match that agreement."],
] as const;

export function CardOnFilePage() {
  return <BlogArticlePage article={cardOnFileArticle}>
    <p>A returning customer should not have to guess what “save my card” means. Start with the use they are agreeing to, then make the checkout, billing process and customer controls reflect it.</p>
    <section id="define-the-future-use" aria-labelledby="define-the-future-use-title">
      <h2 id="define-the-future-use-title">Agree what the saved card can be used for</h2>
      <p>A customer selecting a saved card for a new purchase is different from a business collecting an agreed subscription payment while the customer is absent. Cybersource describes these as customer initiated transactions and merchant initiated transactions. Both may use stored credentials, but the customer’s involvement is different.</p>
      <table className={s.comparison}>
        <caption>Three uses of a saved payment method</caption>
        <thead><tr><th scope="col">Customer action</th><th scope="col">What it means</th><th scope="col">What to keep clear</th></tr></thead>
        <tbody>{savedCardUses.map(([action, meaning, boundary]) => <tr key={action}>
          <th scope="row">{action}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it means</span>{meaning}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to keep clear</span>{boundary}</td>
        </tr>)}</tbody>
      </table>
      <p>Explain the intended use before saving the method and obtain the required agreement through the provider’s supported process. For automatic charges, cover the purpose, anticipated timing or triggering event, how the amount is determined and the applicable cancellation arrangements.</p>
      <p>Keep a record of the terms the customer accepted. Stripe’s saved-payment guidance, for example, requires consent for the specified future use and a record of the written agreement. Follow the requirements for your provider, payment method and business; a general permission to save a card is not unlimited permission to charge it.</p>
    </section>
    <section id="keep-the-data-with-the-right-system" aria-labelledby="keep-the-data-with-the-right-system-title">
      <h2 id="keep-the-data-with-the-right-system-title">Use the provider’s supported storage process</h2>
      <p>With a tokenized setup, your business can retain a provider reference while the provider manages the underlying card credentials. Cybersource’s Token Management Service supports this approach. Use the supported collection and storage flow for your integration, rather than copying card details into customer notes or a spreadsheet.</p>
      <p>Tokenization describes how payment information is represented. Keeping a card on file describes an agreed future use. A token does not establish consent, create a billing schedule or guarantee that the next payment will succeed.</p>
      <p>PCI DSS prohibits merchants from retaining the card security code after authorization, even encrypted or with the customer’s permission. It must not be kept for recurring billing. The <Link href="/company/blog/card-verification-value" prefetch={false}>card verification value article</Link> explains the code and the places it can accidentally appear, including screenshots, logs and support messages.</p>
      <p>Confirm your remaining security responsibilities with the provider. Protect access to saved references and payment tools, and restrict who can initiate charges. Using a token does not mean every connected system or staff workflow has automatically become secure.</p>
    </section>
    <section id="separate-storage-from-billing" aria-labelledby="separate-storage-from-billing-title">
      <h2 id="separate-storage-from-billing-title">Make customer controls match the agreement</h2>
      <p>Suppose a customer places an order and chooses to save the payment method for next time. That choice does not enroll them in a monthly subscription. A recurring offer needs clear billing terms and the required agreement.</p>
      <p>Similarly, removing a saved card and canceling a subscription are different requests. Show customers how to do each and explain the result. A cancellation must reach the billing system, not just remain in a support conversation. Confirm when it takes effect and stop future collections as required by the agreement and applicable rules.</p>
      <p>Replacing a card should also have a clear outcome. Establish which active billing arrangements use the replacement and whether any need a separate update. Keep the permitted records of earlier purchases available for receipts, refunds and disputes; deleting a saved method does not undo a completed payment.</p>
      <p>Trolleys, an Etail Depot service, supports recurring payments through Cybersource when enabled for the merchant account. Confirm the supported setup and terms before offering it. The <Link href="/company/legal/merchant-services#methods" prefetch={false}>Merchant Services Terms</Link> distinguish account access from permission to use recurring billing or stored credentials.</p>
    </section>
    <section id="plan-for-changes" aria-labelledby="plan-for-changes-title">
      <h2 id="plan-for-changes-title">Expect cards and customer instructions to change</h2>
      <p>Review four parts of the ongoing customer experience:</p>
      <ol>
        <li><strong>Payment method updates.</strong> Provide a supported way to replace an expired or changed card. Verify which future payments will use it.</li>
        <li><strong>Customer agreement.</strong> Keep the accepted terms and consent record available to authorized staff. Follow the required notice and agreement process when the arrangement changes.</li>
        <li><strong>Later payment results.</strong> Monitor each collection. Handle declines and requests for customer authentication through the provider’s supported recovery process.</li>
        <li><strong>Cancellation.</strong> Check that billing schedules and payment permissions reflect the customer’s valid instructions, and confirm the outcome to them.</li>
      </ol>
      <p>A saved card can still be declined or require the customer to return and authenticate. Give them a secure way to resolve the payment; do not request a security code by email or treat repeated attempts as a substitute for investigating the result.</p>
      <p>For an uncertain outcome, check the original transaction before submitting another charge. See <Link href="/company/blog/credit-card-declines" prefetch={false}>how to handle card declines</Link> for the difference between a confirmed decline and a payment whose result still needs checking.</p>
    </section>
  </BlogArticlePage>;
}

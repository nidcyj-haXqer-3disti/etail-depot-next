import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardVerificationArticle } from "./card-verification-content";
import s from "./blog.module.css";

const cardLocations = [
  ["Visa, Mastercard and Discover", "Usually three digits", "On the back of the card, separate from the card number."],
  ["American Express", "Usually four digits", "On the front of the card, separate from the card number."],
] as const;

export function CardVerificationPage() {
  return <BlogArticlePage article={cardVerificationArticle}>
    <p>For a customer, the question is usually where to find the code. For a merchant, two more questions matter: what the result tells you and how to keep the code out of your records.</p>
    <section id="find-the-code" aria-labelledby="find-the-code-title">
      <h2 id="find-the-code-title">Help the customer find the correct field</h2>
      <p>Use a clear label such as “Security code” and explain where to look. Common physical card layouts are:</p>
      <table className={s.comparison}>
        <caption>Where to find the card security code</caption>
        <thead><tr><th scope="col">Card</th><th scope="col">Code length</th><th scope="col">Usual location</th></tr></thead>
        <tbody>{cardLocations.map(([card, length, location]) => <tr key={card}>
          <th scope="row">{card}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Code length</span>{length}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Usual location</span>{location}</td>
        </tr>)}</tbody>
      </table>
      <p>If the layout differs, the code is unreadable or the customer is using a virtual card, direct them to their card issuer’s instructions. Do not ask them to email a photograph of the card.</p>
      <p>The security code is not the card’s PIN, expiry date or a one-time sign-in or authentication code. Keep those labels distinct. Let the payment provider’s supported checkout handle the fields required for the chosen payment method, rather than adding a separate field that copies the code into your order form.</p>
    </section>
    <section id="understand-the-result" aria-labelledby="understand-the-result-title">
      <h2 id="understand-the-result-title">Treat the check as one signal</h2>
      <p>A match means the supplied code passed the check. It does not prove that the buyer is the cardholder or that the cardholder agreed to the purchase. Someone with a stolen card may have its security code as well.</p>
      <p>A security-code result is also different from the issuer’s authorization decision. Cybersource’s processor-specific documentation describes cases where an issuer authorizes a transaction despite a code mismatch. That does not make it safe to ignore the mismatch or assume the same handling applies to every account.</p>
      <p>Follow the gateway documentation and risk settings for your actual processor and merchant account. Treat a match, mismatch, unavailable check and issuer decline as distinct outcomes. A code match by itself is not an instruction to fulfill an order.</p>
      <p>If checkout shows an unclear result, look up the original payment before asking the customer to try again. Check the order reference and gateway status instead of requesting card details in a message. See <Link href="/company/blog/card-authorization" prefetch={false}>how card authorization works</Link> and <Link href="/company/blog/credit-card-declines" prefetch={false}>how to handle card declines</Link> for the next checks.</p>
    </section>
    <section id="never-retain-the-code" aria-labelledby="never-retain-the-code-title">
      <h2 id="never-retain-the-code-title">Keep the code out of records and support tools</h2>
      <p>PCI DSS prohibits merchants from storing card verification codes after authorization, even in encrypted form. Collecting a code when needed for a specific authorization is different from keeping it for later purchases. Customer permission does not create an exception.</p>
      <p>A support screenshot can create an unintended copy. If a customer cannot complete checkout and offers to send a picture of all the card fields, ask for the error message and order reference instead. Remind them to leave out the card number, security code and other sensitive details.</p>
      <p>Apply the same care to chat transcripts, application logs and session recordings. If sensitive card information arrives unexpectedly, follow your incident and secure-handling process. Do not forward it to more people as part of troubleshooting.</p>
      <p>For repeat purchases, use the provider’s supported saved-payment process with the required customer agreement. Do not keep security codes in a spreadsheet, customer profile or support note to make the next charge easier.</p>
    </section>
    <section id="check-the-implementation" aria-labelledby="check-the-implementation-title">
      <h2 id="check-the-implementation-title">Review what your tools capture</h2>
      <p>Check the entire route through checkout and customer support:</p>
      <ol>
        <li><strong>Payment fields.</strong> Use the provider’s supported collection components. Keep card details out of your own general contact and order forms.</li>
        <li><strong>Logs and analytics.</strong> Confirm that request logging, error reports and session recordings do not capture the code.</li>
        <li><strong>Support requests.</strong> Ask for the order reference and error description. Give staff a clear process for handling unexpected sensitive information.</li>
        <li><strong>Repeat billing.</strong> Use the supported saved-payment flow. Verify that neither your records nor connected tools retain the security code for later use.</li>
      </ol>
      <p>Have the person responsible for payment security verify the setup, including any tools added after launch. A hosted payment form does not justify copying its contents into another system.</p>
      <p>Etail’s <Link href="/developers/api-reference#display-checkout" prefetch={false}>checkout integration guidance</Link> explains how Cybersource supplies the payment fields while your integration verifies the payment result. Keep those responsibilities clear: collect through the approved checkout, confirm the outcome and retain only the records you are permitted to keep.</p>
    </section>
  </BlogArticlePage>;
}

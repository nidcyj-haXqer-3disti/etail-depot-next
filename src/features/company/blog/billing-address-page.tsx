import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { billingAddressArticle } from "./billing-address-content";

export function BillingAddressPage() {
  return <BlogArticlePage article={billingAddressArticle}>
    <p>An employee orders equipment for a branch using a company card registered to the head office. The delivery address is correct. Copying it into the billing address field can still send the wrong information to the card issuer.</p>
    <p>That is a plausible purchase, not evidence that this particular order is safe. It illustrates why an address mismatch needs interpretation. A merchant who treats every mismatch as fraud can turn an ordinary purchasing detail into a lost sale. A merchant who ignores every mismatch gives up a useful warning.</p>

    <section id="ask-for-the-cards-address" aria-labelledby="ask-for-the-cards-address-title">
      <h2 id="ask-for-the-cards-address-title">Ask for the address that belongs to the card</h2>
      <p>For a card payment, the billing address is the address held by the card issuer for that account. It can differ from the shipping destination, the buyer’s current location or the address that belongs on a business invoice. Those fields serve different purposes.</p>
      <p>Address Verification Service, usually shortened to AVS, checks submitted address details against the issuer’s records where supported. Stripe’s documentation describes checks on the billing street address and postal code. It also notes that support varies by country and issuer. A completed address form does not mean every element was independently verified.</p>
      <p>A customer who has moved may enter a perfectly valid new address that the issuer does not yet have. Stripe identifies this as a reason legitimate payments can fail verification. Updating a delivery address in your store does not update the card issuer’s record. The customer needs to confirm or correct that record through the issuer’s own process.</p>
      <p>Your checkout can prevent some confusion before a payment is attempted. Label the field “Billing address” and explain that it should match the card issuer’s record. Make a different shipping address easy to enter. If you offer “Same as shipping,” let the customer see and change what that choice supplies.</p>
      <p>For business purchases, do not make one address silently stand for the card account, the purchasing entity and the delivery location. Ask for each detail only where needed and explain its purpose. A customer should not have to alter a correct delivery address to get through payment.</p>
    </section>

    <section id="read-both-results" aria-labelledby="read-both-results-title">
      <h2 id="read-both-results-title">Read the payment result as well as the address result</h2>
      <p>An address response can describe a match, a partial match or a check that was unavailable. Cybersource’s response documentation distinguishes, for example, a postal code match with a street mismatch from a system that could not perform the check. Those results should not all become the same “wrong address” message.</p>
      <p>A match has limits too. Someone can know the cardholder’s address without permission to use the card. Passing AVS does not establish that the order is authorized by the customer, safe to ship or protected from a dispute. Keep the result alongside the other evidence used by your payment and risk processes.</p>
      <p>The issuer’s authorization decision is another result again. Cybersource’s Secure Acceptance documentation describes a case in which the issuer approves the authorization but the transaction is declined after failing the address check. An address error on the checkout screen therefore does not, by itself, tell your team whether an authorization exists.</p>
      <p>Look up the original transaction before asking the customer to submit another payment. Confirm the order reference, payment status and whether a capture or reversal occurred. An authorization can leave a pending hold rather than a completed charge, as our article on <Link href="/company/blog/card-authorization" prefetch={false}>card authorization</Link> explains.</p>
      <p>Reversal behavior depends on the integration and its settings. Secure Acceptance, for example, offers an automatic reversal setting for failed address checks. Do not assume that feature is enabled on another checkout or that a hold has already disappeared from the customer’s bank display. Follow the documented recovery process for the account actually handling the payment.</p>
    </section>

    <section id="fix-the-question-before-the-rule" aria-labelledby="fix-the-question-before-the-rule-title">
      <h2 id="fix-the-question-before-the-rule-title">Fix the question before weakening the check</h2>
      <p>If address failures rise after a checkout update, inspect what changed. Is the shipping address being copied into the billing fields? Is the customer’s saved address replacing their new entry? Does the form handle the postal format for the country selected? These are questions to investigate before blaming customers or changing a fraud rule.</p>
      <p>For an individual purchase, give the customer a next step supported by the actual result. A confirmed postal code entry issue can justify asking them to check that field against the issuer’s record. An unavailable check calls for a different explanation. Avoid repeated guesses, and do not invent an address to make the payment pass.</p>
      <p>Support can investigate with the order reference and the error description. There is no need to request a photograph of the card, a full card number or a security code in an ordinary email or chat. If the result remains unclear, use the provider’s support process and the original transaction record. Our article on <Link href="/company/blog/credit-card-declines" prefetch={false}>card declines</Link> covers the checks to make before retrying.</p>
      <p>Any decision to change address rules belongs with the people responsible for payment risk, informed by the account’s processor requirements and real order outcomes. A successful retry alone does not establish that a weaker rule is a better one.</p>
      <p>The useful goal is a checkout that asks the right question and a team that understands the answer. That lets a legitimate customer correct a mistake while keeping the warning meaningful when the order genuinely needs review.</p>
    </section>
  </BlogArticlePage>;
}

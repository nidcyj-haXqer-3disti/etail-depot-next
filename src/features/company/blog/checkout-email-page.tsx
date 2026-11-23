import { BlogArticlePage } from "./article-page";
import { checkoutEmailArticle } from "./checkout-email-content";

export function CheckoutEmailPage() {
  return <BlogArticlePage article={checkoutEmailArticle}>
    <p>The payment succeeds. The receipt goes somewhere else.</p>
    <p>Sometimes the customer mistyped an email address. Sometimes a checkout tried to be helpful and replaced an unfamiliar domain with a familiar one. The second failure can be harder to notice because the form believes it improved the answer.</p>
    <p>An email address is an instruction about where information should go. Treating it as ordinary spelling correction gives the software authority it does not have.</p>
    <p>A syntax check can catch some malformed entries. A suggestion can flag a likely mistake in a common domain. Neither proves that the customer owns the resulting mailbox or that a message will reach it. An unfamiliar business domain may be exactly right. Changing it to a familiar one can make the entry look more credible to the form while directing the order away from the buyer.</p>
    <p>The U.S. Web Design System recommends warning about likely misspellings of common email providers while still letting people continue with the entered address. The distinction matters: software can notice a possible error without deciding who should receive the order.</p>
    <p>A visible address in the order review gives the customer another chance to spot the problem. A nearby suggestion can help, provided accepting it is a deliberate choice. Replacing the value silently when a customer leaves the field turns assistance into an unapproved change of recipient.</p>
    <p>The stakes depend on what the address controls. For a physical order it may carry the receipt and delivery updates. For a digital purchase it may be the route by which the customer receives the product itself. A merchant that checks only whether payment succeeded can miss the fact that its own correction has redirected fulfillment.</p>
    <p>Requiring a second entry can create more work without catching the mistake: the same wrong address can be typed twice. Paste and autofill deserve a place in the flow. The U.S. guidance discourages repeat entry without a good reason.</p>
    <p>Account verification is a separate decision. A one-time code or confirmation link may be appropriate when the service needs to establish access to a mailbox, but it changes the purchase flow and needs a recovery path. Do not insert compulsory verification into every checkout merely to solve a problem that could be reduced by a visible review and correction.</p>
    <p>After an order exists, changing the recipient needs more care. Support should use the platform’s approved process to establish that the requester is entitled to change the contact details. Knowledge of an email address alone should not expose the order, and a correction should not automatically create a second order or trigger another charge.</p>
    <p>For a Trolleys merchant, a missing receipt is a reason to locate the order, not to assume the payment failed. Support can establish the result using the appropriate verification and order reference without asking the customer to email card details or buy again.</p>
    <p>The repair has to reach the systems that send later updates. If support changes the order record but the shipping service keeps its earlier copy, the case can look resolved internally while the customer is still missing messages. The useful question is which address the next message will actually use, not merely whether the visible field now looks right.</p>
    <p>An email correction changes where the business sends information. It deserves the same care as correcting a delivery address, even when the difference is only one letter.</p>
  </BlogArticlePage>;
}

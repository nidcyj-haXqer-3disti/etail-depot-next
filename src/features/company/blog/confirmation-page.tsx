import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { confirmationArticle } from "./confirmation-content";

export function ConfirmationPage() {
  return <BlogArticlePage article={confirmationArticle}>
    <p>The customer has stopped comparing products. They have entered their details and pressed Pay. Now they want to know whether they can close the tab.</p>
    <p>A large checkmark and “Thank you” can feel like a finished checkout to the team building it. To the person buying, the important questions may still be unanswered. Did the payment go through? Has the business accepted the order? Will anything else arrive by email?</p>
    <p>That is why a payment confirmation page deserves more attention than the space left over after checkout. It is where the business begins to deliver on the sale. Before adding a discount for the next purchase, give the customer confidence in this one.</p>
    <p>For <Link href="/services/merchant-services" prefetch={false}>Trolleys, an Etail Depot service</Link>, the merchant relationship continues through payment operations and support. Your store’s confirmation should connect to that work: an order your team recognizes, a payment it can trace and a next step it can actually carry out.</p>

    <section id="received-or-paid" aria-labelledby="received-or-paid-title">
      <h2 id="received-or-paid-title">The order is received. Is the payment confirmed?</h2>
      <p>These messages can mean different things. A store may have created an order while its payment remains unresolved. A card authorization may have been approved while capture will happen later. The heading should describe the event the business has verified.</p>
      <p>If your business captures payment when goods ship, say when you will charge the customer. If the payment is complete but the order still needs review, explain the review. Do not let the word “confirmed” silently promise stock, dispatch or an appointment that nobody has secured.</p>
      <p>There is a technical decision underneath that wording. In Cybersource Unified Checkout, collecting payment details and receiving a payment result are different operations, depending on the integration. Your developer needs to verify the result and match it to the correct order, account, amount and currency. Reaching a particular web address is not proof that someone paid. Our <Link href="/developers/api-reference#payment-status" prefetch={false}>integration guidance</Link> explains that boundary.</p>
      <p>The harder message is the one shown when the result cannot yet be checked. A timeout does not establish that a payment failed. Sending the customer straight back to Pay can turn uncertainty into another payment attempt.</p>
      <p>For that unresolved state, a useful message could begin:</p>
      <p><strong>We are checking your payment. Please do not pay again yet.</strong></p>
      <p>That sentence needs an order reference, a way to get help and a real process behind it. If you promise an update, somebody or something must send it. If the customer needs to return to check the result, make that route clear. Never say that no money was taken unless you have established that fact.</p>
      <p>A confirmed decline deserves a different response, with a permitted way to try again. A pending payment needs its own explanation. One generic failure screen is easier to build, but it asks the customer to guess which situation they are in.</p>
    </section>

    <section id="a-record-worth-keeping" aria-labelledby="a-record-worth-keeping-title">
      <h2 id="a-record-worth-keeping-title">Give the customer a record worth keeping</h2>
      <p>Think about the person reopening the page tomorrow. They may be checking a delivery, claiming an expense or asking why an item has not arrived. The useful details are the purchase, the amount and currency, the order reference, the next step and the right contact.</p>
      <p>The store name matters here. A customer who bought from one of your DBAs should recognize the business on the confirmation and receipt. When you explain how the payment may appear on a statement, use the descriptor agreed for that merchant account. Do not guess from the trading name or promise that every bank will display identical text.</p>
      <p>Keep the reference easy to find and copy on a phone. Explain when the customer should expect a receipt, tracking information, access instructions or a booking confirmation, according to what they bought. Distinguish an estimated delivery from a guaranteed date. The payment result cannot make a fulfillment promise on its own.</p>
      <p>Place those answers before a referral offer, survey or another product. An offer can still have a place after the transaction details. It should not make a buyer search for evidence that the original purchase worked, or look like a required step to finish an already completed payment.</p>
      <p>Use words as well as a tick or a color to explain the status. If a waiting message changes without a new page loading, the change should also be available to a screen reader. W3C’s notification guidance supports concise feedback and clear recovery instructions. That is useful discipline for the happy path as well as the error screen.</p>
      <p>A customer should be able to keep the information through the receipt or another accessible record. Do not make a screenshot their only option. Show only the personal details needed for the task, and have your developer protect access to the underlying order. A reference number identifies a purchase; it is not permission to view somebody else’s details.</p>
    </section>

    <section id="after-the-tab-closes" aria-labelledby="after-the-tab-closes-title">
      <h2 id="after-the-tab-closes-title">Keep the promise after the tab closes</h2>
      <p>A confirmation should describe the existing purchase when it is refreshed or revisited. It should not create another charge, resend an instruction to the warehouse or start the order again. Likewise, an accepted payment needs to reach your order process even if the customer never sees the final screen.</p>
      <p>This is where customer communication meets merchant operations. A Trolleys merchant should be able to connect the customer’s order reference to the relevant gateway payment and store account. The Back Office Operations Portal supplies merchant activity and funding records; your store retains the order and fulfillment context. Those records answer different questions, but your team needs a way to follow the same sale across them.</p>
      <p>If the customer later requests a <Link href="/services/refunds" prefetch={false}>refund</Link>, preserve the original purchase and show the return separately with its own status. A submitted refund is not yet proof of a credit appearing at the customer’s bank. Updating the customer means explaining the latest event without erasing what happened before it.</p>
      <p>Before launch, let the person who handles customer inquiries review the confirmation on a phone. Give them the reference and ask them to find the order and explain what happens next. Then repeat the exercise for a delayed result and a return visit. Our <Link href="/company/contact#integration" prefetch={false}>account and integration team</Link> can help with merchant and gateway questions; your developer and operations team need to make the store’s message and behavior agree.</p>
    </section>

    <p>The customer should leave checkout knowing what they bought, what happened to the payment and where to turn if something changes. When the page delivers those answers, “Thank you” can be a warm ending instead of the only information on the screen.</p>
  </BlogArticlePage>;
}

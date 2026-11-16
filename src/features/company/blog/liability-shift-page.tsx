import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { liabilityShiftArticle } from "./liability-shift-content";

export function LiabilityShiftPage() {
  return <BlogArticlePage article={liabilityShiftArticle}>
    <p>Imagine an online order that passes the customer’s bank authentication check. The payment is approved. Your team marks the order “protected” and sends it to the warehouse.</p>
    <p>Later, the customer disputes the purchase because the wrong product arrived. Someone points to the successful bank check. It is a valid record, but it does not answer the complaint.</p>
    <p>The trouble began with one word doing too much work. Protection against a particular fraud loss is valuable. Treating it as protection against anything that happens after checkout can leave the business answering the wrong question.</p>

    <section id="what-actually-shifts" aria-labelledby="what-actually-shifts-title">
      <h2 id="what-actually-shifts-title">What actually shifts is a particular liability</h2>
      <p>A fraud liability shift changes which participant bears certain fraud losses when the applicable card-network conditions are met. In a qualifying online authentication arrangement, that responsibility can move from the merchant side to the card issuer, the bank that issued the customer’s card.</p>
      <p>Visa describes potential fraud liability protection for qualifying Visa Secure transactions. The important word is qualifying. The network, transaction circumstances and later claim matter. A security feature being available on your account does not establish the result for every payment.</p>
      <p>For an online business, <Link href="/company/blog/how-3d-secure-works" prefetch={false}>3D Secure</Link> is one relevant arrangement. It helps the issuer authenticate the person making the purchase before the payment authorization decision. Protection against an eligible unauthorized-payment claim does not establish that the merchant delivered the promised goods or honored a cancellation.</p>
      <p>Return to the wrong-product order. The customer may fully acknowledge making the purchase. Their complaint concerns what the seller supplied. The useful records are the product description, order, fulfillment details and correspondence about putting the problem right. The authentication result cannot substitute for those records.</p>
      <p>Other claims have their own questions. Was the order delivered? Was a credit actually processed? Was a payment duplicated? Card networks distinguish these from fraud claims, and the response should follow the reason in the notice.</p>
      <p>Nor should protection reported for one transaction be assumed to cover another. A later saved-card payment or renewal needs its own assessment under the applicable arrangement. A wallet logo or a successful first purchase is not a standing promise about every future charge.</p>
    </section>

    <section id="read-the-payment-record" aria-labelledby="read-the-payment-record-title">
      <h2 id="read-the-payment-record-title">Three reassuring statuses can mean different things</h2>
      <p><strong>Authentication is enabled.</strong> That describes configuration. It does not tell you whether a particular buyer was authenticated, what result came back or how that result was used.</p>
      <p><strong>Authentication succeeded.</strong> That describes the bank check. Stripe’s documentation explicitly separates a successful 3D Secure result from the actual liability outcome. Network rules and the conditions of the payment and dispute still apply.</p>
      <p><strong>The payment was approved.</strong> That describes an authorization result. Approval alone is not a promise that the merchant is protected from a later claim.</p>
      <p>The connection between those records matters. Cybersource instructs integrators to pass the relevant authentication information into the authorization request to qualify for liability protection. A checkout that displays a successful bank check but loses the required information on the next step can create a misleading impression of completion.</p>
      <p>A merchant does not need to memorize the technical fields to ask a useful question: did this payment carry the required authentication result, and what protection does the provider report for it? Have the payment team or integration team confirm the actual transaction rather than relying on a settings screenshot.</p>
      <p>Keep internal wording precise. “Authentication successful” is useful when that is what the record establishes. “No chargeback risk” goes far beyond it. Clear labels help the next person handling the order understand what is known and what still needs checking.</p>
    </section>

    <section id="keep-the-case-moving" aria-labelledby="keep-the-case-moving-title">
      <h2 id="keep-the-case-moving-title">A protected payment can still need your attention</h2>
      <p>If a fraud dispute arrives despite an expected liability shift, ask the provider to examine the payment and claim. Do not dismiss the notice. Stripe documents exceptions and inquiries that still require a response, including the risk that failing to answer can affect protection. Follow the instructions and deadline for your actual case.</p>
      <p>For Trolleys, an Etail Depot service, start with the affected merchant account, original payment reference, disputed amount, reason and response deadline. Keep the gateway record associated with the correct MID and DBA. One company may operate several accounts; the protection being discussed belongs to the specific transaction.</p>
      <p>Our <Link href="/services/disputes" prefetch={false}>dispute management service</Link> focuses on the claim and the records that address it. For an authentication question, request a review of the recorded result and any applicable exception. For a delivery or product complaint, gather the order and fulfillment evidence. For a refund claim, preserve the original payment and <Link href="/services/refunds" prefetch={false}>refund reference and status</Link>.</p>
      <p><Link href="/company/contact" prefetch={false}>Bring an unclear protection status to our team</Link> promptly, using the requested secure channel for records. The aim is a clear explanation of the applicable process and any action still due, not an assurance that every dispute will be decided in your favor.</p>
      <p>Keep the financial questions separate too. Who bears the disputed payment amount is one issue. Applicable processing fees, dispute fees and the cost of dealing with the order follow their own terms and circumstances. Do not read a liability-shift result as a promise that every business cost disappears.</p>
    </section>

    <p>Back at the warehouse, the wrong item still needs attention. Use the protection your payment qualifies for, and keep the rest of the sale just as well documented. That gives your team a stronger position than a reassuring label ever could.</p>
  </BlogArticlePage>;
}

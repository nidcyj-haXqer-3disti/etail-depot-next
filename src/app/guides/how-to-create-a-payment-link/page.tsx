import Link from "next/link";
import { formatUsdCents } from "@/modules/public-site/fee-estimate";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { paymentExamples } from "@/modules/public-site/payment-examples";
import { productFacts } from "@/shared/product-facts";
import { GuideTable } from "@/ui/payment-guide";

import { ReadingGuide } from "@/ui/reading-guide";

export const metadata = publicPageMetadata("/guides/how-to-create-a-payment-link");

const createSource = "https://developer.cybersource.com/docs/cybs/en-us/paybylink/developer/all/rest/paybylink/paybylink-services/paybylink-create-intro.html";
const overviewSource = "https://developer.cybersource.com/docs/cybs/en-us/paybylink/developer/all/rest/paybylink/paybylink-intro.html";
const notificationSource = "https://developer.cybersource.com/docs/cybs/en-us/paybylink/developer/all/rest/paybylink/paybylink-webhooks-intro.html";
const fees = productFacts.payments;
const example = paymentExamples.goods;
const exampleAmount = formatUsdCents(example.amountCents);

export default function CreatePaymentLinkPage() {
  return <ReadingGuide
    path="/guides/how-to-create-a-payment-link"
    title="How to create and share a payment link"
    intro="Agree on the purchase and amount, create a payment request, then send your customer its link. With an approved Trolleys account, you can share an online card-payment page by link or QR code and check the payment in your account afterward."
    showPaymentAcceptanceLink
    relatedPaths={["/guides/payment-processing-systems", "/guides/what-is-a-chargeback"]}
    sections={[
      {
        id: "prepare-the-request",
        title: "Before you begin",
        content: <>
          <p>Agree on what the customer is buying, the total amount and when they will receive it. For goods, record the item, quantity and delivery arrangement. For services, describe the work and completion date. For information, explain what will be supplied, how the customer will receive it and any access conditions.</p>
          <p>You need an approved Trolleys account and completed setup to create and share requests. Review <Link href="/payment-acceptance-service">the payment acceptance service</Link> before applying.</p>
          <p>This walkthrough uses a sample order. Field names and options may differ in your account; follow the instructions shown there.</p>
        </>,
      },
      {
        id: "create-the-request",
        title: "1. Create the payment request",
        content: <>
          <p>Create a request in Trolleys for the goods, services or information you are selling. Add a description the customer will recognize and the agreed total amount. Explain delivery or access details in your accompanying message where needed.</p>
          <figure className="payment-guide-example">
            <figcaption>Example request</figcaption>
            <dl><div><dt>Payment for</dt><dd>{example.description}</dd></div><div><dt>Quantity</dt><dd>{example.quantity}</dd></div><div><dt>Order reference</dt><dd>{example.orderReference}</dd></div><div className="payment-guide-example-total"><dt>Total</dt><dd>{exampleAmount} <span>USD</span></dd></div></dl>
          </figure>
          <p>Keep the same reference in your order records and customer message. In this example, it is {example.orderReference}. The reference connects the request, your message and the eventual payment to one purchase.</p>
          <GuideTable caption="Illustrative payment requests in USD" headings={["Example purchase", "Details to agree before payment"]} rows={[
            [`${paymentExamples.goods.description}: ${formatUsdCents(paymentExamples.goods.amountCents)}`, "What is included in the set and how the customer will receive it."],
            [`${paymentExamples.services.description}: ${formatUsdCents(paymentExamples.services.amountCents)}`, "Which design work the payment covers and the completion arrangements."],
            [`${paymentExamples.information.description}: ${formatUsdCents(paymentExamples.information.amountCents)}`, "What the briefing covers and when it will be supplied by email."],
          ]} />
          <p>These are sample purchases, not suggested prices or real payment requests. Use your own agreed details and keep a record connecting the request to the order.</p>
        </>,
      },
      {
        id: "check-before-sending",
        title: "Check the payment page before sharing",
        content: <>
          <p>Open the exact link you plan to send. Check that the description, currency and amount match both the order and your message. Correct any mismatch before sharing, then reopen the link to check the result.</p>
          <p>If you add a website button, follow that button to check its destination. For printed QR codes, scan the finished print with a phone and check the page it opens.</p>
          <p>A shared link lets the customer enter their card details on the payment page. You do not need to ask them to send card details in a message. Sharing a link by text does not include a messaging subscription.</p>
        </>,
      },
      {
        id: "share-the-link",
        title: "2. Share the payment link",
        content: <>
          <p>Copy the payment link from your request and share it by text, email, social post or direct message. You can also connect a website link or button to the payment page, or display its QR code on a sign or printed material. The QR code opens the same online payment page.</p>
          <p>Include enough context to recognize the purchase. For the same homeware order, your message could read:</p>
          <figure className="payment-guide-example payment-guide-message">
            <figcaption>Example customer message</figcaption>
            <blockquote>Here is the payment link for your homeware set, order {example.orderReference}. The total is {exampleAmount} USD. Please review the details before paying.<span className="payment-guide-link-placeholder">[Your payment link]</span></blockquote>
          </figure>
          <p>Add the agreed delivery or collection details and keep a copy of the message with the order. The customer opens the link, reviews the purchase and enters their payment details on the payment page.</p>
        </>,
      },
      {
        id: "card-payment-fees",
        title: "What does a payment link cost?",
        content: <>
          <p>For US businesses, {fees.offerName} costs {fees.cardRateLabel} per successful domestic online card payment in USD, with a ${fees.setupFeeDollars} setup fee and ${fees.monthlyFeeDollars} monthly fee. Request creation, sharing and basic receipts are included.</p>
          <p>The additional {fees.manualEntryRateLabel} merchant-entry charge applies when the merchant enters card details, not when the customer types them into online checkout. Other charges can apply; review the <Link href="/payment-acceptance-service#fees">full fee schedule and card-payment calculator</Link>.</p>
        </>,
      },
      {
        id: "confirm-the-payment",
        title: "After your customer pays",
        content: <>
          <p>Open the payment record in your Trolleys account. For this example, check that it matches order {example.orderReference}, the homeware set and {exampleAmount} USD. A matching customer name is not enough; check that the payment completed.</p>
          <p>Opening a link or scanning its QR code does not mean the order is paid. Keep the completed payment reference with the purchase details and any delivery, completion or refund records so you can find them together later.</p>
          <p>If a customer says they paid but you cannot find a matching completed payment, check the account record before marking the order as paid or asking them to pay again. A screenshot or message alone does not confirm the payment result.</p>
          <p>A successful payment and money arriving in your bank are separate steps. Your account’s payout schedule applies, and fees, refunds, disputes, holds or reserves can affect available funds. See <Link href="/payment-acceptance-service#payouts">payout guidance</Link>, or use <Link href="/help#payments">payment acceptance help</Link> for an account question.</p>
        </>,
      },
    ]}
    sources={[
      { title: "Cybersource — Create a fixed-price link", href: createSource },
      { title: "Cybersource — Introduction to Pay by Link", href: overviewSource },
      { title: "Cybersource — Payment-link notifications", href: notificationSource },
    ]}
  />;
}

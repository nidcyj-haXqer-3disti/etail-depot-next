import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { productFacts, saleRecordsOffer } from "@/shared/product-facts";
import { GuideTable } from "@/ui/payment-guide";

import { ReadingGuide } from "@/ui/reading-guide";

export const metadata = publicPageMetadata("/guides/payment-processing-systems");

const gatewaySource = "https://www.cybersource.com/en-us/solutions/payment-acceptance/payment-gateway.html";
const rolesSource = "https://www.cybersource.com/content/dam/documents/en/ultimate-payments-industry-guide.pdf";
const authorizationSource = "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/vital/sa/payments/payments-intro/payments-services-intro/payments-intro-processing-auth/payments-intro-processing-auth-workflow.html";
const captureSource = "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/vital/sa/payments/payments-intro/payments-services-intro/payments-intro-processing-capture/payments-intro-processing-capture-workflow.html";
const fees = productFacts.payments;
const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const feeExamples = [2_000, 10_000].map(amount => {
  const fee = Math.round(amount * fees.cardRateBasisPoints / 10_000) + fees.cardFixedFeeCents;
  return [dollars(amount), `${dollars(fee)} base fee; ${dollars(amount - fee)} remaining after that fee.`];
});

export default function PaymentProcessingSystemsPage() {
  return <ReadingGuide
    path="/guides/payment-processing-systems"
    title="Payment processing systems: a practical guide for US businesses"
    intro="A payment processing system lets a customer pay and helps you track what happens to the money afterward. Start with how customers buy from you, then check the fees, order records and payout terms before choosing a service."
    showPaymentAcceptanceLink
    relatedPaths={["/guides/how-to-create-a-payment-link", "/guides/stripe-alternatives"]}
    sections={[
      {
        id: "parts-of-a-system",
        title: "What each part does",
        content: <>
          <p>The payment page is the part your customer sees. Behind it, a gateway, processor and merchant account arrangement handle different parts of the transaction. One provider may bring several of these together.</p>
          <GuideTable caption="The main parts of a payment system" headings={["Part", "Its role in the sale"]} rows={[
            ["Customer payment page", "Shows the amount and collects the customer’s payment choice."],
            ["Payment gateway", "Passes payment information securely between checkout and the processing service."],
            ["Payment processor", "Coordinates transaction messages with financial institutions and card networks."],
            ["Merchant account arrangement", "Supports receiving card-payment funds before payout to your business bank account. Settlement, reserve and payout terms depend on the arrangement."],
          ]} />
          <p>“Merchant services” is a wider label for services that help a business accept and manage payments. It can include processing, payment software and support. Ask which services are actually included instead of treating the label as a feature list.</p>
          <p>Your merchant account arrangement supports card acceptance. Your business bank account receives payouts. Confirm how both are connected, who provides each service and which terms apply. Buying a gateway alone does not tell you the full cost or when your bank will receive the money.</p>
        </>,
      },
      {
        id: "choose-a-workflow",
        title: "Start with how customers will pay",
        content: <>
          <p>Write down where the customer agrees to buy and what should happen next. A business taking occasional orders may need a different setup from a store managing stock or a service charging recurring subscriptions.</p>
          <p>For an order agreed by email or text, a payment link may be enough. It needs a recognizable description, the agreed amount and a reference you can match to the order. A QR code can open that same page from printed material; it does not turn the payment into a card-terminal transaction.</p>
          <p>A website with a shopping cart needs checkout to work with order updates, inventory and refunds. Regular automatic charges need recurring billing, including consent, schedule changes, failed-payment handling and cancellation. Check those requirements and their fees before choosing.</p>
          <p>Trolleys lets approved businesses create online card-payment requests and share them by link or QR code for goods, services or information. If you need a store integration, recurring billing or a card terminal, ask Trolleys whether it supports those requirements before choosing.</p>
          <p>For a request you can share directly with a customer, see <Link href="/guides/how-to-create-a-payment-link">how to create and share a payment link</Link>.</p>
        </>,
      },
      {
        id: "payment-to-payout",
        title: "How a credit card processing system works",
        content: <>
          <p>The <strong>issuer</strong> provides the customer’s card, the <strong>acquirer</strong> handles the merchant side, and the <strong>card network</strong> connects them. Follow the five stages of a sample online card purchase below.</p>
          <figure className="payment-guide-flow" aria-labelledby="payment-flow-caption">
            <figcaption id="payment-flow-caption"><span>From checkout to payout</span><span className="payment-guide-flow-amount">$100.00 <span>sample purchase</span></span></figcaption>
            <ol>
              {[
                ["Checkout", "The customer reviews the $100 purchase and submits their card details on the payment page. Opening the link alone does not make a payment."],
                ["Authorization", "The request reaches the issuer through the gateway, processing service and card network. The issuer approves or declines it. Approval can reserve available credit; the money has not reached your bank."],
                ["Capture", "The approved amount is submitted for collection. This can follow authorization automatically or happen separately, depending on the setup."],
                ["Settlement", "Transaction records are exchanged and funds move between the issuing and acquiring sides. Fees and account adjustments affect the funds available to your business."],
                ["Payout", "Available funds are sent to your business bank account under your payout schedule. A payout may combine several sales, refunds and other adjustments."],
              ].map(([title, description], index) => <li key={title}>
                <span className="payment-guide-flow-number" aria-hidden="true">{index + 1}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </li>)}
            </ol>
            <p className="payment-guide-flow-note">Illustrative stages. Your account determines the available controls and timing.</p>
          </figure>
          <p>An approval alone does not complete collection: an authorization can expire before capture. Check the actual payment status before treating an order as paid. Trolleys’ account terms determine processing and payouts; first payouts, reviews, reserves and bank holidays can affect timing.</p>
          <div className="payment-guide-records">
            <div><h3>Check the payment</h3><p>Match the order reference, $100 amount and payment result. Keep the delivery and any refund records with that order.</p></div>
            <div><h3>Check the payout</h3><p>Match the payout reference to the bank deposit. Review the included payments, fees, refunds and adjustments to explain the total.</p></div>
          </div>
          <p>A customer’s screenshot or message does not replace checking the payment in your account. For the difference between a payment and its bank deposit, see <Link href="/payment-acceptance-service#payouts">Trolleys payout guidance</Link>.</p>
        </>,
      },
      {
        id: "compare-total-cost",
        title: "Compare costs using your usual order amounts",
        content: <>
          <p>A percentage plus a fixed fee affects small and large orders differently. The examples below show the base fee for successful domestic online card payments at Trolleys’ published {fees.cardRateLabel} rate.</p>
          <GuideTable caption="Illustrative Trolleys base processing fees in USD" headings={["Payment", "Base fee and remaining amount"]} rows={feeExamples} />
          <p>The formula is payment amount × 2.9%, plus 30¢. A $20 payment therefore has a higher fee as a share of the sale than a $100 payment. Use your typical amounts and card mix when comparing offers, rather than only comparing the headline percentage.</p>
          <p>These figures exclude optional Clarity, international-card, currency-conversion, merchant-entry, dispute and other applicable charges. They do not predict the bank payout after refunds, reserves or other adjustments. Review <Link href="/payment-acceptance-service#fees">all published Trolleys fees</Link>.</p>
          <p>Optional Clarity adds {saleRecordsOffer.rateLabel} {saleRecordsOffer.feeBasis}. It uses Order Insight to help customers recognize purchases and prevent eligible Visa online fraud disputes. Coverage depends on the payment, participating bank and available data; it does not prevent every dispute or guarantee an outcome. Automatic refunds and services that respond to chargebacks for you are separate services.</p>
        </>,
      },
      {
        id: "questions-before-applying",
        title: "What to confirm before applying",
        content: <ol>
          <li><strong>Does the service accept my business?</strong> Describe what you sell, who buys it and when you deliver. Confirm eligibility and any restrictions before relying on approval.</li>
          <li><strong>Can customers pay the way I need?</strong> List the channels, payment methods and integrations you need, including work after the sale.</li>
          <li><strong>What will it cost in normal and exceptional cases?</strong> Include typical transactions, international cards, refunds, disputes, optional services and any monthly costs.</li>
          <li><strong>How will funds reach my bank?</strong> Review first-payout timing, the ongoing schedule and any reserve or hold terms.</li>
          <li><strong>How will I manage customer issues?</strong> Confirm access to records, support, refunds and dispute notices. To learn about Trolleys payment requests, see <Link href="/payment-acceptance-service">payment acceptance</Link>.</li>
        </ol>,
      },
    ]}
    sources={[
      { title: "Cybersource — How a payment gateway works", href: gatewaySource },
      { title: "Authorize.net — Payments industry roles (PDF, page 5)", href: rolesSource },
      { title: "Cybersource — Authorization workflow", href: authorizationSource },
      { title: "Cybersource — Capture and reconciliation", href: captureSource },
    ]}
  />;
}

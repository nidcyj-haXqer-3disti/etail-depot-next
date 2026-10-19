import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { productFacts, saleRecordsOffer } from "@/shared/product-facts";
import { GuideSourceLink, GuideTable, PaymentGuide } from "@/ui/payment-guide";

export const metadata = publicPageMetadata("/guides/payment-processing-systems");

const rolesSource = "https://stripe.com/resources/more/payment-processor-vs-gateway-vs-merchant-account";
const merchantSource = "https://stripe.com/resources/more/merchant-account-vs-payment-gateway";
const processingSource = "https://stripe.com/resources/more/credit-card-processing-101";
const captureSource = "https://docs.stripe.com/payments/place-a-hold-on-a-payment-method";
const payoutsSource = "https://docs.stripe.com/payouts";
const fees = productFacts.payments;
const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const feeExamples = [2_000, 10_000].map(amount => {
  const fee = Math.round(amount * fees.cardRateBasisPoints / 10_000) + fees.cardFixedFeeCents;
  return [dollars(amount), dollars(fee), dollars(amount - fee)];
});

export default function PaymentProcessingSystemsPage() {
  return <PaymentGuide
    path="/guides/payment-processing-systems"
    title="Payment processing systems: a practical guide for US businesses"
    intro="A payment system connects the customer’s payment step with authorization, settlement and your business’s records. Choose it around the way you sell and the work you need to do after a payment."
    sections={[
      {
        id: "parts-of-a-system",
        title: "Understand the parts of a payment system",
        content: <>
          <p>A payment processor, payment gateway and merchant account serve different roles. One service may package several roles together, so you may not need a separate contract for every part. <GuideSourceLink href={rolesSource}>Stripe’s overview of payment-system roles</GuideSourceLink> explains that distinction.</p>
          <GuideTable caption="Payment-system roles and useful questions" headings={["Part", "What it does", "What to ask"]} rows={[
            ["Customer payment page", "Presents the amount and collects the customer’s payment choice.", "Can customers use it from the channels where I sell?"],
            ["Payment gateway", "Passes payment information securely between the checkout and processing service.", "Is it included, and does my checkout work with it?"],
            ["Payment processor", "Coordinates transaction messages and processing with financial institutions and card networks.", "Which payment methods and transactions are supported?"],
            ["Merchant account arrangement", "Supports receiving card-payment funds before payout to the business bank account.", "How is my account set up, and which settlement, reserve and payout terms apply?"],
          ]} />
          <p>“Merchant services” is a wider label for services that help a business accept and manage payments. It can include processing, payment software and support. Ask which services are actually included instead of treating the label as a feature list.</p>
          <p>A merchant account arrangement is also different from the everyday business bank account where payouts arrive. Some services bundle merchant-account functionality; a separate account is not always something the merchant opens independently. See <GuideSourceLink href={merchantSource}>Stripe’s explanation of merchant accounts and gateways</GuideSourceLink>.</p>
        </>,
      },
      {
        id: "choose-a-workflow",
        title: "Start with how customers will pay",
        content: <>
          <p>Write down where the customer agrees to buy and what should happen next. A business taking occasional orders may need a different setup from a store managing stock or a service charging recurring subscriptions.</p>
          <GuideTable caption="Match the way customers pay to the sale" headings={["Your situation", "An option to consider", "Check before choosing"]} rows={[
            ["Orders agreed by email, text or conversation", "A payment request shared as a link", "Clear description, amount, delivery terms and a way to match the payment to the order."],
            ["A sign, printed material or an in-person conversation", "A QR code opening an online payment page", "The customer can open the page and confirm the intended payment. A QR code alone is not a card terminal."],
            ["A website with a shopping cart", "An integrated or hosted checkout", "Compatibility with the store, order updates, inventory and how you handle refunds."],
            ["Regular automatic charges", "A recurring-billing product", "Customer consent, schedule changes, failed-payment handling, cancellation and extra fees."],
          ]} />
          <p>Trolleys lets approved businesses create online card-payment requests and share them by link or QR code for goods, services or information. If you need a store integration, recurring billing or a card terminal, ask Trolleys whether it supports those requirements before choosing.</p>
          <p>For a request you can share directly with a customer, see <Link href="/guides/how-to-create-a-payment-link">how to create and share a payment link</Link>.</p>
        </>,
      },
      {
        id: "payment-to-payout",
        title: "How a credit card processing system works",
        content: <>
          <p>Follow an illustrative $100 online card purchase. The <strong>issuer</strong> provides the customer’s card, the <strong>acquirer</strong> handles the merchant side, and the <strong>card network</strong> connects them. These are general processing stages, not Trolleys screen names or promised timings.</p>
          <ol>
            <li><strong>Checkout.</strong> The customer reviews the $100 purchase and submits their card details on the payment page. Opening a link alone does not make a payment.</li>
            <li><strong>Authorization.</strong> The gateway and processing service route the request through the card network to the issuer. The issuer checks the account and approves or declines the request. Approval can place a hold on the customer’s available credit; it is not a deposit into the merchant’s bank account.</li>
            <li><strong>Capture.</strong> The approved amount is submitted for collection. Capture may follow authorization automatically or happen separately, depending on the service and setup. An authorization can expire if it is not captured; do not assume an approval alone completes collection.</li>
            <li><strong>Settlement.</strong> Transaction records are exchanged and funds move between the issuing and acquiring sides under the network’s arrangements. Fees and account adjustments affect what becomes available to the business.</li>
            <li><strong>Payout.</strong> Available funds are sent to the business bank account under its payout schedule. One payout can combine multiple payments and adjustments, so it may not match this $100 sale.</li>
          </ol>
          <p>For background, see Stripe’s explanations of <GuideSourceLink href={processingSource}>credit card processing</GuideSourceLink>, <GuideSourceLink href={captureSource}>authorization and capture</GuideSourceLink>, and <GuideSourceLink href={payoutsSource}>payout scheduling</GuideSourceLink>. Trolleys’ account terms determine its processing and payout arrangements; first payouts, reviews, reserves and bank holidays can affect timing.</p>
          <div className="payment-guide-callout"><p><strong>Ask two separate questions:</strong> “How will I confirm this customer paid?” and “When will the funds be available and arrive in my bank?” Use the actual payment record for the first and the account’s payout information for the second.</p></div>
          <p>Match the $100 order to its payment reference, then check the fees and adjustments in the relevant payout record. Keep delivery and refund records with the order. A customer’s screenshot or an email alone should not replace checking the payment in your account. See <Link href="/payment-acceptance-service#payouts">Trolleys payout guidance</Link>.</p>
        </>,
      },
      {
        id: "compare-total-cost",
        title: "Compare costs using your usual order amounts",
        content: <>
          <p>A percentage plus a fixed fee affects small and large orders differently. The examples below show the base fee for successful domestic online card payments at Trolleys’ published {fees.cardRateLabel} rate.</p>
          <GuideTable caption="Illustrative Trolleys base processing fees in USD" headings={["Payment", "Base processing fee", "Amount after base fee"]} rows={feeExamples} />
          <p>The formula is payment amount × 2.9%, plus 30¢. A $20 payment therefore has a higher fee as a share of the sale than a $100 payment. Use your typical amounts and card mix when comparing offers, rather than only comparing the headline percentage.</p>
          <p>These figures exclude optional Clarity, international-card, currency-conversion, merchant-entry, dispute and other applicable charges. They do not predict the bank payout after refunds, reserves or other adjustments. Review <Link href="/payment-acceptance-service#fees">all published Trolleys fees</Link>.</p>
          <p>Optional Clarity adds {saleRecordsOffer.rateLabel} {saleRecordsOffer.feeBasis}. It uses Order Insight to help customers recognize purchases and prevent eligible Visa online fraud disputes. Coverage depends on the payment, participating bank and available data; it does not prevent every dispute or guarantee an outcome. Automatic refunds and services that respond to chargebacks for you are separate services.</p>
        </>,
      },
      {
        id: "questions-before-applying",
        title: "Prepare five questions before applying",
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
      { title: "Stripe — Payment processor, gateway and merchant account", href: rolesSource },
      { title: "Stripe — Merchant account versus payment gateway", href: merchantSource },
      { title: "Stripe — Credit card processing 101", href: processingSource },
      { title: "Stripe — Authorization and capture", href: captureSource },
      { title: "Stripe — Receive payouts", href: payoutsSource },
    ]}
  />;
}

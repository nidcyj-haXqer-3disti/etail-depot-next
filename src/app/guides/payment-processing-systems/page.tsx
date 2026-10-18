import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { productFacts, saleRecordsOffer } from "@/shared/product-facts";
import { GuideSourceLink, GuideTable, PaymentGuide } from "@/ui/payment-guide";

export const metadata = publicPageMetadata("/guides/payment-processing-systems");

const rolesSource = "https://stripe.com/resources/more/payment-processor-vs-gateway-vs-merchant-account";
const merchantSource = "https://stripe.com/resources/more/merchant-account-vs-payment-gateway";
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
        </>,
      },
      {
        id: "payment-to-payout",
        title: "Separate payment confirmation from payout",
        content: <>
          <p>Authorization is the card issuer’s decision on a payment request. Capture and settlement handle later processing steps. Funds then become available under the account’s terms, and a payout moves available money toward the business bank account. A service may handle several of these steps automatically, but they are still different events.</p>
          <p>For example, a merchant may see a successful payment while bank arrival is still pending. <GuideSourceLink href={payoutsSource}>Stripe’s payout documentation</GuideSourceLink> separates funds availability, payout scheduling and bank timing. For Trolleys, the account’s schedule applies; first payouts, reviews, reserves and bank holidays can affect timing.</p>
          <div className="payment-guide-callout"><p><strong>Ask two separate questions:</strong> “How will I confirm this customer paid?” and “When will the funds be available and arrive in my bank?” Use the actual payment record for the first and the account’s payout information for the second.</p></div>
          <p>Keep a record connecting the order, payment, fulfillment and any later refund. That makes a payment easier to reconcile and gives you useful context if the customer asks a question or disputes it.</p>
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
      { title: "Stripe — Receive payouts", href: payoutsSource },
    ]}
  />;
}

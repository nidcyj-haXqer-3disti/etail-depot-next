import { pageJsonLd } from "./metadata";
import Link from "next/link";
import { merchantAccountGuidance } from "@/shared/site/merchant-account-guidance";
import { PublicPageStructuredData } from "@/shared/seo/structured-data";
import { cardProduct } from "@/shared/site/card-product";
import { hostedServices } from "@/shared/site/hosted-services";
import { legalIdentity } from "@/shared/site/legal-identity";
import { productFacts, saleRecordsOffer } from "@/shared/site/product-facts";
import { serviceLabels } from "@/shared/site/service-language";
import { Shell } from "@/shared/layout/shell";
import { PaymentPortalLink } from "@/shared/ui/merchant-portal-link";
import { SalesContactLink } from "@/shared/ui/sales-booking/sales-booking-link";
import { Icon } from "@/shared/ui/icon";
import "@/shared/styles/public-site.css";
import "../../../app/resources/help/help.css";
import "@/features/resources/help/enterprise-support-help.css";
import "@/features/resources/help/connected-resources-help.css";

const topics = [
  {
    id: "payments", label: serviceLabels.payments, icon: "business",
    questions: [
      { q: "Can my business apply for a merchant account?", a: <>US businesses can apply to accept payments in USD for goods, services or information. Start with <Link prefetch={false} href="/resources/merchant-account-setup">merchant account setup</Link> to prepare your application. Review the fees, payout schedule and account terms before accepting the agreement. Payments can start once the account is approved and set up.</> },
      { q: "Another provider declined my business. Can I still apply?", a: "Yes. Contact us with your business website, processing history and the reason given. We review each business separately. A decision from another provider does not determine our decision. Account approval is still required." },
      { q: "Can I add another store or DBA under the same company?", a: <>Use + Location in your application portal to request another Merchant ID (MID). Keep the same legal company name and enter the new DBA. Each approved MID has its own payment activity and reporting. Follow the <Link prefetch={false} href="/resources/merchant-account-setup#additional-mid">additional DBA setup steps</Link>. For a different legal company, ask our team which application to use.</> },
      { q: "How do I check a customer’s payment?", a: <>Find the original payment in Cybersource Business Center for the correct store. Match its reference, amount and date to the customer’s order. A customer’s screenshot or confirmation message does not replace the payment record. Back Office reports may update later. Contact <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}</a> if the status is unclear.</> },
      { q: "I’m not sure a payment went through. What should I do?", a: <>Check the original payment before asking the customer to pay again. A timeout or missing confirmation does not mean the payment failed. If you cannot confirm the result in your account, contact merchant support with the payment reference.</> },
      { q: "What will I pay to accept card payments?", a: <>Our published offer for US businesses is {productFacts.payments.cardRateLabel} per successful domestic online card payment in USD. No setup or monthly fee. An additional fee applies per successful payment through a link or QR code. A QR payment incurs this fee once. Basic payment receipts are included. Payment links must be enabled for your merchant account. Your accepted fee schedule determines your charges. See <Link href="/pricing#fees">card processing fees</Link> for optional services and other applicable charges.</> },
      { q: "When will the money reach my bank?", a: <>Check funding activity in the Back Office Operations Portal for the correct MID, along with your agreed payout schedule and any review requirements. A completed payment does not mean the money has reached your bank. If a payout has not arrived, contact support with its reference. Do not ask the customer to pay again. See <Link href="/services/payouts">payout information</Link>.</> },
      { q: "Why do my merchant and gateway reports show different totals?", a: <>Compare the same store, currency and reporting period, including the time zone. Match sales with sales and refunds with refunds. Reporting delays and fees can also explain differences. Use the payment references to investigate anything that remains unmatched. See <Link prefetch={false} href="/services/reconciliation">how to compare the reports</Link>.</> },
      { q: "How do I refund a customer?", a: <>Open the original payment in your connected store or Cybersource Business Center and check the available refund action. Check for an existing refund or dispute before returning money again. Follow the refund record until its outcome is confirmed. Posting the credit to the customer’s bank account is separate. See <Link href="/services/refunds">refund procedures</Link>.</> },
      { q: "A customer disputed a payment. What should I do?", a: <>Open the case in the Back Office Operations Portal. Check its reason, response deadline and requested evidence, then follow the case instructions. Include any existing refund record. A refund does not automatically close a dispute, and closing a dispute does not confirm a refund. See <Link prefetch={false} href="/services/disputes">dispute support</Link>.</> },
      { q: "Is dispute prevention included?", a: <>Basic payment receipts are included. Optional {saleRecordsOffer.name} costs {saleRecordsOffer.rateLabel} {saleRecordsOffer.feeBasis}, separate from payment processing. It shares purchase details with participating banks. Eligible Visa online fraud disputes may be prevented when enrollment, transaction history and data requirements are met. It does not cover every bank, payment or dispute reason, and no outcome is guaranteed. Refund programs and responses to existing chargebacks are separate services. Continue to follow dispute deadlines. Review the <Link href="/company/legal/fees#optional-service">coverage, fees and service terms</Link> before enrollment.</> },
    ],
  },
  {
    id: "checkout", label: "Checkout setup", icon: "link",
    questions: [
      { q: "My merchant account is approved. What do I do next?", a: <>Check the store name, MID and gateway login details in your welcome email. Open the accounts listed there, connect your checkout and complete the payment checks before launch. Follow <Link prefetch={false} href="/developers/getting-started">setup after approval</Link>, or share it with your web team.</> },
      { q: "How do I connect my website?", a: <>Use the <Link prefetch={false} href="/resources/shopify-gateway-integration">Shopify guide</Link> or <Link prefetch={false} href="/resources/woocommerce-gateway-integration">WooCommerce guide</Link> for your store. For a custom website, share the <Link prefetch={false} href="/developers/api-reference">checkout integration instructions</Link> with your web developer. No API connection to the Back Office Operations Portal is required for this setup.</> },
      { q: "Can customers pay by ACH, Apple Pay or Google Pay?", a: <>We confirm the payment and checkout options for your account during setup. ACH has separate fees and payout terms. Wallet availability also depends on the customer’s card and device. The published card rate and fee calculator cover card payments. For Apple Pay on a custom Unified Checkout website, your web team must verify each checkout domain. Follow the <Link prefetch={false} href="/developers/getting-started#payment-methods">payment method setup instructions</Link>; Shopify and WooCommerce use their integration guides.</> },
      { q: "Can I accept payments without a website?", a: <>A payment link or QR code can take customers to a hosted checkout once Pay by Link is enabled for your merchant account. <Link prefetch={false} href="/company/contact#account-support">Ask our team to confirm availability</Link>. The <Link prefetch={false} href="/use-cases/no-code-checkout-experience">No code checkout experience</Link> explains the options; its preview does not accept payments.</> },
    ],
  },
  {
    id: "partners", label: "Software platforms", icon: "layers",
    questions: [
      { q: "Who can I talk to about payments for my software?", a: <><SalesContactLink>Book a call</SalesContactLink> to discuss your software, the merchants you serve and the payment options you need. See <Link prefetch={false} href="/use-cases/software-platforms">payments for software platforms</Link> for an overview. For an existing account or payment issue, contact <Link prefetch={false} href="/company/contact#account-support">merchant support</Link>.</> },
      { q: "How would payments fit into my software?", a: "Describe your checkout, the payment methods you need and how your software handles orders, refunds and reporting. Our integration team explains the available checkout options, account permissions and reporting for your setup." },
      { q: "Our provider cannot support some customers. Can you review them?", a: "Yes. Tell us what the businesses sell, how customers pay and why the current provider cannot support them. A decline elsewhere does not determine our decision. Each merchant and payment flow still needs review and approval." },
      { q: "Would we need to move every customer?", a: "Not necessarily. Tell us which merchants need another payment option. We review whether they can use a separate arrangement alongside your existing service. Contracts, account structure, integration and data portability determine what is possible." },
      { q: "Does each business need its own approval?", a: "Yes. Each business needs its own eligibility checks and account approval. We’ll discuss the application process, supported business activities and support responsibilities with you." },
    ],
  },
  {
    id: "cards", label: serviceLabels.cards, icon: "card",
    questions: [
      { q: "What kind of credit card is it?", a: `The ${cardProduct.name} is a virtual ${cardProduct.creditType} for compatible digital wallets. A security deposit backs the account, and purchases are repaid separately.` },
      { q: "Can I add the card to my phone’s wallet?", a: <>Eligible cards can be added to Apple Wallet or Google Wallet. Support depends on the card, device and region. <Link href="/services/card-services#wallets">How to add a card to your wallet</Link>.</> },
      { q: "Does my deposit pay for my purchases?", a: <>No. Your deposit backs the credit account; you repay purchases separately. The minimum deposit is ${productFacts.cards.minimumDepositDollars}. See <Link href="/services/card-services#card-details">card details</Link> and review the card agreement for credit limits and conditions for returning your deposit.</> },
      { q: "What will I pay, and when is my balance due?", a: <>The annual fee is ${productFacts.cards.annualFeeDollars}, and the monthly fee is ${productFacts.cards.monthlyFeeDollars}. Repay your full statement balance each month. Earlier or daily payments are optional. See <Link href="/services/card-services#card-details">card details</Link> and review the full charges and conditions in the card agreement.</> },
      { q: "What if I lose my phone?", a: "Use Apple Find My or Google Find Hub to secure your device. Contact Ledgix promptly about your card and any unrecognized purchases." },
      { q: "Who can I contact about the card?", a: <>Email <a href={hostedServices.cards.contactHref}>{hostedServices.cards.email}</a> for credit card inquiries. An inquiry does not submit a card application or guarantee approval.</> },
    ],
  },
  {
    id: "access", label: "Help signing in", icon: "lock",
    questions: [
      { q: "Where do I sign in to my merchant account?", a: <>To create or continue an application, choose Sign in to Trolleys. On a phone, open Menu first. {merchantAccountGuidance.signIn} See the <Link href="/resources/merchant-account-setup#sign-in">sign in instructions</Link>. After approval, use the separate <Link prefetch={false} href="/developers/getting-started#portal-access">portal links in your welcome email</Link> for payments and reports.</> },
      { q: "Which login do I use after approval?", a: <>Use your administrator email and enrollment password for the Back Office Operations Portal to view activity, funding and disputes across your assigned MIDs. Cybersource Business Center uses the separate Organization ID, User ID and password you set up for each store. Use it for gateway payment records, API keys and Virtual Terminal when enabled. See <Link prefetch={false} href="/developers/getting-started#portal-access">both portals and their sign in steps</Link>.</> },
      { q: "How do I create a merchant login?", a: <>Choose Start now. Enter your email on Welcome, then choose Register to create your password. Follow the <Link href="/resources/merchant-account-setup#create-account">account setup steps with screenshots</Link>. {merchantAccountGuidance.approval}</> },
      { q: "Why can’t I enter my email on the registration page?", a: <>{merchantAccountGuidance.registrationEmail} Choose Sign in above Register New Account to return to Welcome and enter the correct email. Choose Register for a new account or Sign In for an existing account. <Link href="/resources/merchant-account-setup#registration-email">See where to enter your email</Link>.</> },
      { q: "I can’t sign in. What should I do?", a: <>{merchantAccountGuidance.registeredEmail} For other access problems, follow the account recovery instructions or contact <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}</a> for help.</> },
      { q: "Does my merchant account include a credit card account?", a: "No. A merchant account does not include a credit card account. Merchant and card services have separate account relationships." },
      { q: "How can I access records from my old Etail Depot account?", a: <>Earlier Etail Depot accounts are no longer accessible on this website. For access, correction or deletion requests about those records, email <a href={`mailto:${legalIdentity.complianceEmail}`}>{legalIdentity.complianceEmail}</a>. You do not need to sign in. Records are not automatically deleted when account access ends; applicable rights and retention requirements still apply. See <Link href="/company/privacy#choices">your privacy request choices</Link>.</> },
    ],
  },
];

export default function HelpPage() {
  return <Shell>
    <PublicPageStructuredData json={pageJsonLd()} /><div className="cw-help">
    <section className="page-container public-help-intro">
      <h1>Help center</h1>
      <p>Find answers about account access, checkout setup, payments and card services. Choose a topic or contact the team responsible for your account.</p>
      <section className="help-support-grid" aria-label="Support contacts">
        <article className="help-support-card">
          <h2>Merchant support</h2>
          <p>For payment status, refunds, disputes and payout questions.</p>
          <a href={hostedServices.payments.contactHref}><span>{hostedServices.payments.email}</span></a>
        </article>
        <article className="help-support-card">
          <h2>Card inquiries</h2>
          <p>Ask about the {cardProduct.name}.</p>
          <a href={hostedServices.cards.contactHref}><span>{hostedServices.cards.email}</span></a>
        </article>
        <article className="help-support-card">
          <h2><a href="#access">Help signing in</a></h2>
          <p>Open your accounts, continue an application or fix a registration email.</p>
        </article>
      </section>
      <div className="help-support-notes">
        <p>Privacy and legal inquiries: <a href={`mailto:${legalIdentity.complianceEmail}`}>{legalIdentity.complianceEmail}</a></p>
        <p>Do not email passwords, verification codes, complete card or bank account numbers, or identity documents.</p>
      </div>
      <nav aria-label="Help topics" className="help-topic-links">{topics.map(topic => <a key={topic.id} href={`#${topic.id}`}><Icon name={topic.icon} />{topic.label}</a>)}</nav>
    </section>
    <div className="page-container public-help-body">
      {topics.map(topic => <section key={topic.id} id={topic.id} className="help-guide">
        <h2>{topic.label}</h2>
        <div className="public-questions">{topic.questions.map(item => <details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div>
        {topic.id === "payments" && <PaymentPortalLink intent="sign-in" className="welcome-text-link" />}
      </section>)}
    </div>
  </div></Shell>;
}

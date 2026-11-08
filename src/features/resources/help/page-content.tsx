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
import { Icon } from "@/shared/ui/icon";
import "@/shared/styles/public-site.css";
import "../../../app/resources/help/help.css";
import "@/features/resources/help/enterprise-support-help.css";
import "@/features/resources/help/connected-resources-help.css";

const topics = [
  {
    id: "payments", label: serviceLabels.payments, link: hostedServices.payments.signInUrl, action: "Sign in",
    questions: [
      { q: "Can my business apply for a merchant account?", a: <>US businesses can apply to accept payments in USD for goods, services or information. Start with <a href="/services/merchant-onboarding">merchant account setup</a> to prepare your application. Review the fees, payout schedule and account terms before accepting the agreement. Payments can start once the account is approved and set up.</> },
      { q: "Another provider declined my business. Can I still apply?", a: "Yes. Contact us with your business website, processing history and the reason given. We review each business separately. A decision from another provider does not determine our decision. Account approval is still required." },
      { q: "Can customers pay by ACH, Apple Pay or Google Pay?", a: "We confirm the payment and checkout options for your account during setup. ACH has separate fees and payout terms. Wallet availability also depends on the customer’s card and device. The published card rate and fee calculator cover card payments." },
      { q: "How do I check a customer’s payment?", a: <>Use your merchant account to check the payment record and match its reference, amount and date to the customer’s order. A customer’s screenshot or confirmation message does not replace the account record. Contact <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}</a> if the status is unclear.</> },
      { q: "I’m not sure a payment went through. What should I do?", a: <>Check the original payment before asking the customer to pay again. A timeout or missing confirmation does not mean the payment failed. If you cannot confirm the result in your account, contact merchant support with the payment reference.</> },
      { q: "What will I pay to accept card payments?", a: <>Our published offer for US businesses is {productFacts.payments.cardRateLabel} per successful domestic online card payment in USD. No setup or monthly fee. Payment request creation, sharing and basic receipts are included. Your accepted fee schedule determines your charges. See <Link href="/pricing#fees">card processing fees</Link> for optional services and other applicable charges.</> },
      { q: "When will the money reach my bank?", a: <>A completed payment does not mean the money has reached your bank. Check the payout status, expected timing and any review requirements in your merchant account. If a payout has not arrived, contact support with its reference. Do not ask the customer to pay again to resolve a missing payout. See <Link href="/services/payouts">payout information</Link>.</> },
      { q: "How do I refund a customer?", a: <>Find the original payment and follow the refund instructions in your merchant account. Check whether a refund or dispute already exists before returning money again. You can track progress in the refund record. Processing the refund and posting it to the customer’s bank account are separate steps. See <Link href="/services/refunds">refund procedures</Link>.</> },
      { q: "A customer disputed a payment. What should I do?", a: <>Open the dispute notice and check the reason, response deadline and requested evidence. Follow the instructions in your merchant account or contact support if you need help. If you have already refunded the payment, include that record. A refund does not automatically close a dispute, and closing a dispute does not confirm a refund.</> },
      { q: "Is dispute prevention included?", a: <>Basic payment receipts are included. Optional {saleRecordsOffer.name} costs {saleRecordsOffer.rateLabel} {saleRecordsOffer.feeBasis}, separate from payment processing. It shares purchase details with participating banks. Eligible Visa online fraud disputes may be prevented when enrollment, transaction history and data requirements are met. It does not cover every bank, payment or dispute reason, and no outcome is guaranteed. Refund programs and responses to existing chargebacks are separate services. Continue to follow dispute deadlines. Review the <Link href="/company/legal/fees#optional-service">coverage, fees and service terms</Link> before enrollment.</> },
    ],
  },
  {
    id: "partners", label: "Software platforms", link: hostedServices.payments.contactHref, action: "Contact the payments team",
    questions: [
      { q: "Who can I talk to about payments for my software?", a: <>Email <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}</a> with your software website, the merchants you serve and where your current payment service falls short. Our team explains account requirements, integration options and terms for the merchants you serve. See <Link href="/use-cases/software-platforms">payments for software platforms</Link> for the service overview.</> },
      { q: "How would payments fit into my software?", a: "Describe your checkout, the payment methods you need and how your software handles orders, refunds and reporting. Our integration team explains the available checkout options, account permissions and reporting for your setup." },
      { q: "Our provider cannot support some customers. Can you review them?", a: "Yes. Tell us what the businesses sell, how customers pay and why the current provider cannot support them. A decline elsewhere does not determine our decision. Each merchant and payment flow still needs review and approval." },
      { q: "Would we need to move every customer?", a: "Not necessarily. Tell us which merchants need another payment option. We review whether they can use a separate arrangement alongside your existing service. Contracts, account structure, integration and data portability determine what is possible." },
      { q: "Does each business need its own approval?", a: "Yes. Each business needs its own eligibility checks and account approval. We’ll discuss the application process, supported business activities and support responsibilities with you." },
    ],
  },
  {
    id: "cards", label: serviceLabels.cards, link: hostedServices.cards.contactHref, action: "Contact Ledgix",
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
    id: "access", label: "Help signing in",
    questions: [
      { q: "Where do I sign in to my merchant account?", a: <>Choose Sign in to Trolleys. On a phone, open Menu first. {merchantAccountGuidance.signIn} See the <Link href="/resources/merchant-account-setup#sign-in">sign in instructions</Link>.</> },
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
      <p>Get help with a merchant account, a payment or card services. Choose a topic or contact the team responsible for your account.</p>
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
          <p>Sign in, continue an application or fix a registration email.</p>
        </article>
      </section>
      <div className="help-support-notes">
        <p>Privacy and legal inquiries: <a href={`mailto:${legalIdentity.complianceEmail}`}>{legalIdentity.complianceEmail}</a></p>
        <p>Do not email passwords, verification codes, complete card or bank account numbers, or identity documents.</p>
      </div>
      <nav aria-label="Help topics" className="help-topic-links">{topics.map((topic, index) => <a key={topic.id} href={`#${topic.id}`}><Icon name={["business", "layers", "card", "lock"][index]} />{topic.label}</a>)}</nav>
    </section>
    <div className="page-container public-help-body">
      {topics.map(topic => <section key={topic.id} id={topic.id} className="help-guide">
        <h2>{topic.label}</h2>
        <div className="public-questions">{topic.questions.map(item => <details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div>
        {topic.id === "payments" && topic.link && <PaymentPortalLink intent="sign-in" className="welcome-text-link">{topic.action}</PaymentPortalLink>}
      </section>)}
    </div>
  </div></Shell>;
}

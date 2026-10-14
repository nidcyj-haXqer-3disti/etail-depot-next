import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { cardProduct } from "@/shared/card-product";
import { hostedServices } from "@/shared/hosted-services";
import { legalIdentity } from "@/shared/legal-identity";
import { productFacts, saleRecordsOffer } from "@/shared/product-facts";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import "@/ui/public-site.css";
import "./help.css";

export const metadata = publicPageMetadata("/help");

const topics = [
  {
    id: "payments", label: "Trolleys payment acceptance", link: hostedServices.payments.portalUrl, action: "Open Trolleys",
    questions: [
      { q: "What does it cost to accept payments?", a: <>For US businesses, {productFacts.payments.offerName} costs {productFacts.payments.cardRateLabel} per successful domestic online card payment in USD. No setup or monthly fee. Payment request creation, sharing and basic receipts are included. See <Link href="/payment-acceptance-service#fees">payment pricing</Link> for optional services and other applicable charges.</> },
      { q: "When will a payout reach my bank?", a: <>A successful payment and a bank payout are different steps. Check payment and payout status in your Trolleys account for timing and any review requirements. Learn more about <Link href="/payment-acceptance-service#payouts">payouts</Link>.</> },
      { q: "How do I handle a refund or dispute?", a: <>Follow the instructions in your Trolleys account to request a refund or respond to a dispute. Review the applicable fees, required information and deadlines there. See <Link href="/payment-acceptance-service#refunds-and-disputes">refund and dispute details</Link>, or contact the payments team if you need help.</> },
      { q: "Who can help with my Trolleys account?", a: <>Use the support options in your Trolleys account or email <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}</a>. Do not include passwords or full card details.</> },
      { q: "What is Trolleys Clarity?", a: <>Trolleys’ optional {saleRecordsOffer.name} service uses Order Insight to share purchase details with participating banks and help customers recognize charges. Eligible Visa online fraud disputes may be prevented when the required transaction history and data qualify. Basic payment receipts remain included without this service. <Link href="/payment-acceptance-service#dispute-readiness">See how it works</Link>.</> },
      { q: "What does Clarity cost?", a: <>The Trolleys service fee is {saleRecordsOffer.rateLabel} {saleRecordsOffer.feeBasis}. Payment processing is separate. Applicable charges and service terms are disclosed before enrollment. See <Link href="/payment-acceptance-service#fees">fees and estimates</Link>. Selecting the website example does not enroll you or create a charge.</> },
      { q: "How does Order Insight help with a payment inquiry?", a: "Supported business, payment and purchase details help participating banks answer questions about a charge. Coverage depends on merchant enrollment, the payment and available records. The examples on this website do not share actual customer or purchase information." },
      { q: "Does Clarity prevent every dispute?", a: "No. Purchase recognition and prevention of eligible Visa online fraud disputes do not cover every bank, payment or dispute reason. A dispute can still proceed, and no outcome is guaranteed. Refund programs and managed responses to existing chargebacks are separate services. Follow your account’s instructions and deadlines if a dispute occurs." },
      { q: "What happens when I explore the payment examples?", a: "The examples illustrate payments for goods, services and information using fixed sample details. Your selections stay in this browser. They do not send payment requests, collect customer information, create sale records or enroll you in a service." },
      { q: "What does the Information example cover?", a: "Research, insights, analysis or advice delivered through a report, briefing or consultation. Specify what the customer will receive, its scope, delivery timing and any access conditions." },
    ],
  },
  {
    id: "cards", label: "Ledgix secured credit card", link: hostedServices.cards.contactHref, action: "Contact Ledgix",
    questions: [
      { q: "Can I apply for a card now?", a: `Ledgix ${cardProduct.name} is a virtual ${cardProduct.creditType} for compatible digital wallets. Applications are not open yet. You’ll manage your card account through Ledgix when it launches.` },
      { q: "Which digital wallets are supported?", a: <>When the card service is available, eligible cards can be added to Apple Wallet or Google Wallet. Support depends on the card, device and region. <Link href="/credit-card-services#wallets">Preview the wallet experience</Link>.</> },
      { q: "How does the security deposit work?", a: <>The minimum security deposit is ${productFacts.cards.minimumDepositDollars}. It backs the credit account; it does not pay for purchases. Purchases create a balance that you repay separately. See <Link href="/credit-card-services#card-details">card details</Link> and review the card agreement for credit limits and deposit-return conditions.</> },
      { q: "What are the card fees and repayment terms?", a: <>The annual fee is ${productFacts.cards.annualFeeDollars}, and the monthly fee is ${productFacts.cards.monthlyFeeDollars}. {productFacts.cards.repayment}. You can also make payments earlier or daily. See <Link href="/credit-card-services#card-details">card details</Link> and review the full charges and conditions in the card agreement when the service launches.</> },
      { q: "How do I contact Ledgix?", a: <>Email <a href={hostedServices.cards.contactHref}>{hostedServices.cards.email}</a> for credit card inquiries. An inquiry does not submit a card application, guarantee approval or subscribe you to launch updates.</> },
    ],
  },
  {
    id: "access", label: "Sign-in help",
    questions: [
      { q: "Where do I sign in and manage payments?", a: "Follow the sign-in instructions provided with your Trolleys account. If you are new to the service, visit Trolleys to apply." },
      { q: "What if I cannot sign in to Trolleys?", a: <>Follow the recovery instructions supplied with your Trolleys account, or contact <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}</a> for help. Do not send us your password or verification codes.</> },
      { q: "Does one service account give me access to the other?", a: "No. A Trolleys account does not create a Ledgix account. Ledgix registration and sign-in will be separate when the card service launches." },
      { q: "How do I ask about records from an earlier Etail Depot account?", a: <>Earlier website account tools are no longer available here. For access, correction or deletion requests about those records, email <a href={`mailto:${legalIdentity.complianceEmail}`}>{legalIdentity.complianceEmail}</a>. You do not need to sign in. Retiring account tools does not automatically delete historical records; applicable rights and retention requirements still apply. See <Link href="/privacy#choices">your privacy request choices</Link>.</> },
    ],
  },
];

export default function HelpPage() {
  return <Shell>
    <PublicPageStructuredData path="/help" />
    <section className="page-container public-help-intro">
      <h1>Help center</h1>
      <p>Get help with Trolleys payment acceptance or ask about the Ledgix credit card.</p>
      <section className="help-support-grid" aria-label="Support contacts">
        <article className="help-support-card">
          <h2>Payment acceptance support</h2>
          <p>For Trolleys account, payment, refund and dispute questions.</p>
          <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}<Icon name="arrow" /></a>
        </article>
        <article className="help-support-card">
          <h2>Credit card inquiries</h2>
          <p>Ask about the Ledgix {cardProduct.name}. Applications are not open yet.</p>
          <a href={hostedServices.cards.contactHref}>{hostedServices.cards.email}<Icon name="arrow" /></a>
        </article>
        <article className="help-support-card">
          <h2>Sign-in help</h2>
          <p>Find sign-in and recovery guidance for your Trolleys account.</p>
          <a href="#access">Get sign-in help<Icon name="arrow" /></a>
        </article>
      </section>
      <div className="help-support-notes">
        <p>Privacy and legal inquiries: <a href={`mailto:${legalIdentity.complianceEmail}`}>{legalIdentity.complianceEmail}</a></p>
        <p>Do not email passwords, verification codes, complete card or bank account numbers, or identity documents.</p>
      </div>
      <nav aria-label="Help topics" className="help-topic-links">{topics.map(topic => <a key={topic.id} href={`#${topic.id}`}>{topic.label}<Icon name="arrow" /></a>)}</nav>
    </section>
    <div className="page-container public-help-body">
      {topics.map(topic => <section key={topic.id} id={topic.id} className="help-guide">
        <h2>{topic.label}</h2>
        <div className="public-questions">{topic.questions.map(item => <details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div>
        {topic.link && <a className="welcome-text-link" href={topic.link} referrerPolicy="no-referrer" rel="noreferrer">{topic.action}<Icon name="arrow" /></a>}
      </section>)}
    </div>
  </Shell>;
}

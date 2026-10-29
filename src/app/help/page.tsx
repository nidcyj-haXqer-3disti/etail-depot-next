import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { cardProduct } from "@/shared/card-product";
import { hostedServices } from "@/shared/hosted-services";
import { legalIdentity } from "@/shared/legal-identity";
import { productFacts, saleRecordsOffer } from "@/shared/product-facts";
import { serviceLabels } from "@/shared/service-language";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import "@/ui/public-site.css";
import "./help.css";

export const metadata = publicPageMetadata("/help");

const topics = [
  {
    id: "payments", label: serviceLabels.payments, link: hostedServices.payments.portalUrl, action: "Open Trolleys",
    questions: [
      { q: "How do I check a customer’s payment?", a: <>Use your Trolleys account to check the payment record and match its reference, amount and date to the customer’s order. A customer’s screenshot or confirmation message does not replace the account record. Contact <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}</a> if the status is unclear.</> },
      { q: "I’m not sure a payment went through. What should I do?", a: <>Check the original payment before asking the customer to pay again. A timeout or missing confirmation does not mean the payment failed. If you cannot confirm the result in your account, contact Trolleys support with the payment reference.</> },
      { q: "What will I pay to accept card payments?", a: <>For US businesses, the card processing fee for {productFacts.payments.offerName} is {productFacts.payments.cardRateLabel} per successful domestic online card payment in USD. No setup or monthly fee. Payment request creation, sharing and basic receipts are included. See <Link href="/payment-acceptance-service#fees">card processing fees</Link> for optional services and other applicable charges.</> },
      { q: "When will the money reach my bank?", a: <>A completed payment does not mean the money has reached your bank. Check the payout status, expected timing and any review requirements in your Trolleys account. If a payout has not arrived, contact support with its reference. Do not ask the customer to pay again to resolve a missing payout. See <Link href="/payment-acceptance-service#payouts">payout information</Link>.</> },
      { q: "How do I refund a customer?", a: <>Find the original payment and follow the refund instructions in your Trolleys account. Check whether a refund or dispute already exists before returning money again. You can track progress in the refund record. Processing the refund and posting it to the customer’s bank account are separate steps. See <Link href="/payment-acceptance-service#refunds-and-disputes">refund details and fees</Link>.</> },
      { q: "A customer disputed a payment. What should I do?", a: <>Open the dispute notice and check the reason, response deadline and requested evidence. Follow the instructions in your Trolleys account or contact support if you need help. If you have already refunded the payment, include that record. A refund does not automatically close a dispute, and closing a dispute does not confirm a refund.</> },
      { q: "Is dispute prevention included?", a: <>Basic payment receipts are included. {saleRecordsOffer.name} is optional and costs {saleRecordsOffer.rateLabel} {saleRecordsOffer.feeBasis}, separate from payment processing. It uses Order Insight to share purchase details with participating banks. Eligible Visa online fraud disputes may be prevented when enrollment, transaction history and data requirements are met. It does not cover every bank, payment or dispute reason, and no outcome is guaranteed. Refund programs and responses to existing chargebacks are separate services. Continue to follow dispute deadlines. Review the <Link href="/terms#dispute-prevention">coverage, fees and service terms</Link> before enrollment.</> },
    ],
  },
  {
    id: "partners", label: "Software platforms", link: hostedServices.payments.contactHref, action: "Contact the payments team",
    questions: [
      { q: "Who can I talk to about payments for my software?", a: <>Email <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}</a> with your company name, the software you provide and the merchants you serve. Tell us how customers pay today and what you want the payment connection to support. See <Link href="/software-partners">payments for software platforms</Link> for the service overview.</> },
      { q: "How would payments fit into my software?", a: "Describe your checkout, the payment methods you need and how your software handles orders, refunds and reporting. The payments team can discuss the available connection, merchant requirements and responsibilities with you before implementation." },
      { q: "Does each business need its own approval?", a: "Yes. Each business needs its own eligibility checks and account approval. We’ll discuss the application process, supported business activities and support responsibilities with you." },
    ],
  },
  {
    id: "cards", label: serviceLabels.cards, link: hostedServices.cards.contactHref, action: "Contact Ledgix",
    questions: [
      { q: "Can I apply for a credit card yet?", a: `Applications are not open yet. The ${cardProduct.name} is a virtual ${cardProduct.creditType} for compatible digital wallets. You’ll manage your credit card account through Ledgix when it launches.` },
      { q: "Can I add the card to my phone’s wallet?", a: <>When the credit card service is available, eligible cards can be added to Apple Wallet or Google Wallet. Support depends on the card, device and region. <Link href="/credit-card-services#wallets">How to add a card to your wallet</Link>.</> },
      { q: "Does my deposit pay for my purchases?", a: <>No. Your deposit backs the credit account; you repay purchases separately. The minimum deposit is ${productFacts.cards.minimumDepositDollars}. See <Link href="/credit-card-services#card-details">card details</Link> and review the card agreement for credit limits and conditions for returning your deposit.</> },
      { q: "What will I pay, and when is my balance due?", a: <>The annual fee is ${productFacts.cards.annualFeeDollars}, and the monthly fee is ${productFacts.cards.monthlyFeeDollars}. Repay your full statement balance each month. Earlier or daily payments are optional. See <Link href="/credit-card-services#card-details">card details</Link> and review the full charges and conditions in the card agreement when the service launches.</> },
      { q: "Who can I contact about the card?", a: <>Email <a href={hostedServices.cards.contactHref}>{hostedServices.cards.email}</a> for credit card inquiries. An inquiry does not submit a card application, guarantee approval or subscribe you to launch updates.</> },
    ],
  },
  {
    id: "access", label: "Help signing in",
    questions: [
      { q: "Where do I sign in to my merchant account?", a: "Follow the instructions for signing in provided with your Trolleys account. If you are new to the service, visit Trolleys to apply." },
      { q: "I can’t sign in. What should I do?", a: <>Follow the recovery instructions supplied with your Trolleys account, or contact <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}</a> for help.</> },
      { q: "Does my merchant account include a credit card account?", a: "No. A Trolleys account does not create a Ledgix account. Ledgix registration and account access will be separate when the credit card service launches." },
      { q: "How can I access records from my old Etail Depot account?", a: <>Earlier Etail Depot accounts are no longer accessible on this website. For access, correction or deletion requests about those records, email <a href={`mailto:${legalIdentity.complianceEmail}`}>{legalIdentity.complianceEmail}</a>. You do not need to sign in. Records are not automatically deleted when account access ends; applicable rights and retention requirements still apply. See <Link href="/privacy#choices">your privacy request choices</Link>.</> },
    ],
  },
];

export default function HelpPage() {
  return <Shell>
    <PublicPageStructuredData path="/help" />
    <section className="page-container public-help-intro">
      <p className="eyebrow">Support</p>
      <h1>Help center</h1>
      <p>Support for merchant services, card inquiries and software partnerships.</p>
      <section className="help-support-grid" aria-label="Support contacts">
        <article className="help-support-card">
          <h2>Merchant support</h2>
          <p>For Trolleys account, payment, payout, refund and dispute questions.</p>
          <a href={hostedServices.payments.contactHref}><span>{hostedServices.payments.email}</span><Icon name="arrow" /></a>
        </article>
        <article className="help-support-card">
          <h2>Card inquiries</h2>
          <p>Ask about the {cardProduct.name}. Applications are not open yet.</p>
          <a href={hostedServices.cards.contactHref}><span>{hostedServices.cards.email}</span><Icon name="arrow" /></a>
        </article>
        <article className="help-support-card">
          <h2>Help signing in</h2>
          <p>Find help signing in or recovering access for your Trolleys account.</p>
          <a href="#access"><span>Get help signing in</span><Icon name="arrow" /></a>
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
        {topic.id === "payments" && topic.link && <a className="welcome-text-link" href={topic.link} referrerPolicy="no-referrer" rel="noreferrer">{topic.action}<Icon name="arrow" /></a>}
      </section>)}
    </div>
  </Shell>;
}

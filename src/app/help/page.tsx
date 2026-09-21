import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { cardProduct } from "@/shared/card-product";
import { hostedServices } from "@/shared/hosted-services";
import { legalIdentity } from "@/shared/legal-identity";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import "@/ui/public-site.css";

export const metadata = publicPageMetadata("/help");

const topics = [
  {
    id: "payments", label: "Trolleys payments", link: hostedServices.payments.portalUrl, action: "Open Trolleys",
    questions: [
      { q: "Where do I sign in and manage payments?", a: "Use the account access instructions supplied by Trolleys. If you are new to the service, visit its website to apply. You do not need an Etail Depot website login." },
      { q: "Who can help with my payment account?", a: <>Use the support options in your Trolleys account or email <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}</a>. Do not include passwords or full card details.</> },
    ],
  },
  {
    id: "cards", label: "Ledgix cards", link: hostedServices.cards.contactHref, action: "Contact Ledgix",
    questions: [
      { q: "Can I apply for a card now?", a: `Ledgix ${cardProduct.name} is an upcoming virtual ${cardProduct.creditType} for compatible digital wallets. Applications and card sign-in are not open yet. The card service will have its own sign-in and dashboard.` },
      { q: "Which digital wallets are supported?", a: "When the card service is available, eligible cards can be added to Apple Wallet or Google Wallet. Support depends on the card, device and region." },
      { q: "How does the security deposit work?", a: "A security deposit backs the credit account. Purchases create a balance that you repay separately. The card agreement will explain the deposit, credit limit and repayment terms." },
      { q: "Where can I ask about Ledgix?", a: <>Email <a href={hostedServices.cards.contactHref}>{hostedServices.cards.email}</a> for card inquiries.</> },
    ],
  },
  {
    id: "access", label: "Sign-in help",
    questions: [
      { q: "What if I cannot sign in to Trolleys?", a: <>Follow the recovery instructions supplied with your Trolleys account, or contact <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}</a> for help. Etail Depot does not collect your service password here.</> },
      { q: "Does one service account give me access to the other?", a: "No. Cards and payments are separate services. Each has its own registration, sign-in and account access. A Trolleys account does not create a Ledgix account." },
    ],
  },
];

export default function HelpPage() {
  return <Shell>
    <PublicPageStructuredData path="/help" />
    <section className="page-container public-help-intro">
      <h1>Help center</h1>
      <p>Find the right support for your service.</p>
      <nav aria-label="Help topics" className="help-topic-links">{topics.map(topic => <a key={topic.id} href={`#${topic.id}`}>{topic.label}<Icon name="arrow" /></a>)}</nav>
    </section>
    <div className="page-container public-help-body">
      {topics.map(topic => <section key={topic.id} id={topic.id} className="help-guide">
        <h2>{topic.label}</h2>
        <div className="public-questions">{topic.questions.map(item => <details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div>
        {topic.link && <a className="welcome-text-link" href={topic.link} referrerPolicy="no-referrer" rel="noreferrer">{topic.action}<Icon name="arrow" /></a>}
      </section>)}
      <section className="help-guide" aria-labelledby="privacy-legal-help">
        <h2 id="privacy-legal-help">Privacy and legal inquiries</h2>
        <a className="welcome-text-link" href={`mailto:${legalIdentity.complianceEmail}`}>{legalIdentity.complianceEmail}<Icon name="arrow" /></a>
      </section>
    </div>
  </Shell>;
}

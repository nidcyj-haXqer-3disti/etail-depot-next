import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icon";

/** Decorative product illustration, separate from authenticated account data. */
export function ProductPreview({ variant = "cards" }: { variant?: "cards" | "payments" }) {
  return <figure className={`product-preview product-preview-${variant}`} aria-label={variant === "cards" ? "Illustration of card controls and payment organization" : "Illustration of payment channels and merchant activity"}>
    <div className="preview-orbit" aria-hidden="true" /><div className="preview-orbit preview-orbit-two" aria-hidden="true" />
    <div className="preview-card" aria-hidden="true"><div className="preview-card-top"><span>Etail Depot</span><span>EVERYDAY</span></div><Image src="/brand/symbol.png" alt="" width={180} height={113} className="preview-symbol" priority /><div className="preview-card-bottom"><span>Your day.<br />Your way.</span><Icon name="lock" /></div></div>
    <div className="preview-controls" aria-hidden="true"><div className="preview-panel-heading"><span className="preview-circle"><Icon name="check" /></span><div><strong>{variant === "cards" ? "You’re in control" : "Your business, in view"}</strong><span>{variant === "cards" ? "Your card. Your next move." : "Keep each payment close."}</span></div></div><div className="preview-task"><span><Icon name="grid" />{variant === "cards" ? "Card activity" : "Payment links"}</span><Icon name="arrow" /></div><div className="preview-task"><span><Icon name={variant === "cards" ? "lock" : "shop"} />{variant === "cards" ? "Card controls" : "Your stores"}</span><Icon name="arrow" /></div></div>
    <div className="preview-payment" aria-hidden="true"><span className="preview-circle"><Icon name="shop" /></span><div><strong>Payments, together</strong><span>Links · Invoices · QR codes</span></div></div><figcaption>A look inside Etail Depot</figcaption>
  </figure>;
}

const commonQuestions = [
  { question: "What can I do with Etail Depot?", answer: "Fund one prepaid card group and set a monthly spending limit for each adult cardholder, or share payment tools through Merchant services. Customers pay through published links with their own Etail cards. You choose permissions and keep the overview. Explore both in the sandbox." },
  { question: "Who can see my cards and payments?", answer: "The primary cardholder manages their card group. Each additional cardholder sees only their own cards and activity. A primary merchant oversees its submerchants. Invited people see the merchant records their permissions allow; people assigned to the same merchant may share its payment view. Authorized support staff can read questions assigned to them." },
  { question: "Can I give someone both a card and payment tools?", answer: "Yes, with separate invitations and permissions for each service. Giving someone a card does not give them access to merchant payments, and payment access does not reveal private card activity. Cards for children and teenagers are not available in this sandbox." },
  { question: "Does the demo use real money?", answer: "No. This is a sandbox with fictional people, cards and payments. You can try the experience without entering real bank details. Live card issuance and payment processing are not available here." },
  { question: "Can I use Etail Depot on my phone?", answer: "Yes. Open this website in your phone’s browser to use the same card and payment tools. You do not need to install an app." },
];
export function PublicQuestions() {
  return <div className="public-questions">{commonQuestions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>;
}
export function StartExploring() {
  return <section className="page-container public-final-section"><div className="public-final"><div><p className="eyebrow">YOUR NEXT STEP</p><h2>Picture what you could do together.</h2><p>Try the view for you and the people you invite. No real money moves.</p></div><Link href="/login" className="button primary">Explore the demo <Icon name="arrow" /></Link></div></section>;
}
export function ServiceSteps({ items }: { items: { title: string; text: string }[] }) {
  return <ol className="public-steps">{items.map((item, index) => <li key={item.title}><span className="everyday-number">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ol>;
}

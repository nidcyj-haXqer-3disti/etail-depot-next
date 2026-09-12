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
 {question:"What can I do with Etail Depot?",answer:"Give your people prepaid cards, each with its own total allowance. Or give them terminals to collect payments for your merchant. You own the money and keep the overview."},
 {question:"Who can see my cards and payments?",answer:"The account owner sees all cards or terminals in that service. Cardholders see only their own cards and activity. Terminal users see only their assigned terminal records and can respond to disputes; they cannot manage money."},
 {question:"Do card allowances reset each month?",answer:"No. Each card has a total allowance that stays in place until its owner changes it. Spending uses that card’s allowance and the available card-group money. Refunds return money to the group but do not replenish the used allowance."},
 {question:"Do merchant payments fund my cards?",answer:"No. Your card money and merchant money stay separate. Every terminal’s settled payments go to the merchant balance. Only the account owner can add or withdraw money."},
 {question:"Can I give someone both a card and a terminal?",answer:"Yes. Invite them separately to each service. Their card access and terminal access stay separate, and each invitation tells them what they can do."},
 {question:"How do I get started?",answer:"Create a login, confirm your email and choose Cardholder or Merchant services. You can invite people when you’re ready. Open the same website on your phone; no app installation is needed."},
];
export function PublicQuestions() {
  return <div className="public-questions">{commonQuestions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>;
}
export function StartExploring() {
  return <section className="page-container public-final-section"><div className="public-final"><div><p className="eyebrow">YOUR NEXT STEP</p><h2>Picture what you could do together.</h2><p>Create a login, confirm your email and choose your service.</p></div><Link href="/login?mode=register" className="button primary">Create your login <Icon name="arrow" /></Link></div></section>;
}
export function ServiceSteps({ items }: { items: { title: string; text: string }[] }) {
  return <ol className="public-steps">{items.map((item, index) => <li key={item.title}><span className="everyday-number">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ol>;
}

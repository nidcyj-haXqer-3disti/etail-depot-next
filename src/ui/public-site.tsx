import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icon";

/** Decorative product illustration, separate from authenticated account data. */
export function ProductPreview({ variant = "cards" }: { variant?: "cards" | "payments" }) {
  return <figure className={`product-preview product-preview-${variant}`} aria-label={variant === "cards" ? "Illustration of card controls and payment organization" : "Illustration of payment links and receipts"}>
    <div className="preview-orbit" aria-hidden="true" /><div className="preview-orbit preview-orbit-two" aria-hidden="true" />
    {variant === "cards" ? <div className="preview-card" aria-hidden="true"><div className="preview-card-top"><span>Etail Depot</span><span>VISA</span></div><Image src="/brand/symbol.png" alt="" width={180} height={113} className="preview-symbol" priority /><div className="preview-card-bottom"><span>Your day.<br />Your way.</span><Icon name="lock" /></div></div> : <div className="preview-card preview-request-illustration" aria-hidden="true"><div className="preview-card-top"><span>Payment request</span></div><strong className="preview-request-amount">$25.00</strong><div className="preview-card-bottom"><span>Maya’s Flower Shop<br />Weekend flowers</span><Icon name="link" /></div></div>}
    <div className="preview-controls" aria-hidden="true"><div className="preview-panel-heading"><span className="preview-circle"><Icon name="check" /></span><div><strong>{variant === "cards" ? "You’re in control" : "Your business, in view"}</strong><span>{variant === "cards" ? "Your card. Your next move." : "Keep each payment close."}</span></div></div><div className="preview-task"><span><Icon name="grid" />{variant === "cards" ? "Card activity" : "Payment links"}</span><Icon name="arrow" /></div><div className="preview-task"><span><Icon name={variant === "cards" ? "lock" : "shop"} />{variant === "cards" ? "Card controls" : "Your payment terminals"}</span><Icon name="arrow" /></div></div>
    <div className="preview-payment" aria-hidden="true"><span className="preview-circle"><Icon name="shop" /></span><div><strong>Payments, together</strong><span>Links · Invoices · QR codes</span></div></div>
  </figure>;
}

const commonQuestions = [
 {question:"What can I do with Etail Depot?",answer:"Add money, create Visa cards and invite your people to use them with spending limits you choose. You can also create payment requests for products or services and invite people to help collect payments. You control the money in each account."},
 {question:"Who can see my cards and payments?",answer:"As the account owner, you see all your cards or payment terminals. Each cardholder sees only their own cards and purchases. People you invite to collect payments see only their assigned terminals and cannot move money."},
 {question:"Do spending limits reset each month?",answer:"No. Each card has a total spending limit that stays in place until you change it. For example, spending $200 of a $1,000 limit leaves $800, as long as there is enough money in the shared card balance. Refunds restore the balance but do not restore the used limit."},
 {question:"Where can these cards be used?",answer:"The product is a Visa prepaid card, designed for purchases wherever Visa is accepted, subject to the card’s controls and available balance. The cards shown in this sandbox are not live Visa credentials."},
 {question:"Do payments I receive add money to my cards?",answer:"No. Money you add funds your cards. Customer payments stay separate, and only you can manage refunds and payouts from your payment account."},
 {question:"Can someone have both a card and payment tools?",answer:"Yes. Invite them to each separately. They can see their own cards and the payment terminals assigned to them. Each invitation explains what they can do."},
 {question:"How do I get started?",answer:"Create a login, confirm your email and choose Cards & spending or Accept payments. You can invite people when you are ready. Use the same website on your phone; no app installation is needed."},
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

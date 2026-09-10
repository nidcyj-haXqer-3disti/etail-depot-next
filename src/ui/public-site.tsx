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
  { question: "What can I do with Etail Depot?", answer: "Use Cardholder services to manage cards and follow spending. Use Merchant services to organize customer payments, stores and team access. You can explore both in the demo." },
  { question: "Who can see my cards and payments?", answer: "The primary cardholder manages their card group. Each additional cardholder sees only their own cards and activity. A primary merchant can oversee its stores; invited team members see only the merchants they have access to. Authorized support staff can read questions assigned to them." },
  { question: "Does the demo use real money?", answer: "No. This is a sandbox with fictional people, cards and payments. You can try the experience without entering real bank details. Live card issuance and payment processing are not available here." },
  { question: "Can I use Etail Depot on my phone?", answer: "Yes. Open this website in your phone’s browser to use the same card and payment tools. You do not need to install an app." },
];
export function PublicQuestions() {
  return <div className="public-questions">{commonQuestions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>;
}
export function StartExploring() {
  return <section className="page-container public-final-section"><div className="public-final"><div><p className="eyebrow">YOUR NEXT STEP</p><h2>See how simple it can feel.</h2><p>Take a look around with demo cards and payments.</p></div><Link href="/login" className="button primary">Explore the demo <Icon name="arrow" /></Link></div></section>;
}
export function ServiceSteps({ items }: { items: { title: string; text: string }[] }) {
  return <ol className="public-steps">{items.map((item, index) => <li key={item.title}><span className="everyday-number">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ol>;
}

import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { PublicQuestions } from "@/ui/public-site";
import "@/ui/public-site.css";
export const metadata = publicPageMetadata("/help");
const topics = [
  {id:"cards",label:"Cards & spending",title:"Your card, step by step.",link:"/cardholder-services",action:"Go to cardholder services",questions:[
    {q:"How do I freeze a card?",a:"Open Cardholder services and select your card. Choose Freeze card, review the confirmation, then confirm. When you find your card, choose Unfreeze card. Only controls available to you are shown."},
    {q:"Where can I find a purchase or a report?",a:"Select your card to see recent activity. Open Activity for purchase details, or Statements & reports to create and download an activity report. These reports describe sandbox activity; they are not live billing statements."},
    {q:"How do additional cardholders get access?",a:"The primary cardholder sends an invitation and chooses permissions from Cardholder access. The invited person signs in separately and accepts. The primary cardholder can then use Add card to request a card for them. Issued cards and their activity appear in the additional cardholder’s own view."}]},
  {id:"payments",label:"Business payments",title:"Keep the details together.",link:"/merchant-services",action:"Go to merchant services",questions:[
    {q:"What is a payment channel?",a:"A payment channel is a saved way to request a payment. Choose a merchant, add a name and amount, and select a presentation such as an invoice, QR code or link. In the demo, messages are previews and payments use practice money."},
    {q:"Where are my payments, refunds and transfers?",a:"Open Merchant services, choose the merchant and open Payments. Switch between Payments, Refunds and Transfers, then search or filter the list. Open a payment or refund to see its receipt. Transfer details appear directly in the table."},
    {q:"Can a store see another store’s payments?",a:"Only the primary merchant can oversee all its submerchants. A person invited to a store sees that store’s permitted records. Merchant access does not give anyone access to your private card activity."}]},
  {id:"access",label:"Sign-in & access",title:"A sign-in of your own.",link:"/login",action:"Go to sign in",questions:[
    {q:"How do I try the demo?",a:"Go to Sign in and choose one of the demo people. Try the primary view for group and business management, or the additional cardholder view for private cards and assigned store access. No bank details are needed."},
    {q:"How do I create a login with my email?",a:"In the local preview, open Sign in and choose Create a login. Use an email address you control and a password of at least 12 characters. Open the confirmation email, then paste the final Etail Depot page address into Confirmation link. Confirm your email, then sign in. Your login stays separate from the sample profiles and does not automatically open cards or merchant services."},
    {q:"What if I cannot sign in?",a:"If this is your first visit, choose Create a login and confirm your email before signing in. If you already registered, check your email and password or choose Forgot your password? An expired link needs a new email. If the page says a password change needs review, contact the site owner; repeated sign-in attempts will not resolve it."},
    {q:"Where can I ask about my card?",a:"Sign in, open Cardholder services and choose Help & support. You can send a private question about your card and return to the same conversation for replies."}]},
];
export default function HelpPage() {
  return <Shell><PublicPageStructuredData path="/help" /><section className="page-container public-help-intro"><p className="eyebrow">ETAIL DEPOT HELP CENTER</p><h1>A little help.<br /><span>A clear next step.</span></h1><p>Find your way around cards, payments and sign-in.</p><nav aria-label="Help topics" className="help-topic-links">{topics.map(topic=><a key={topic.id} href={`#${topic.id}`}>{topic.label}<Icon name="arrow" /></a>)}</nav></section><div className="page-container public-help-body">{topics.map(topic=><section key={topic.id} id={topic.id} className="help-guide"><p className="eyebrow">{topic.label}</p><h2>{topic.title}</h2><div className="public-questions">{topic.questions.map(item=><details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div><Link className="welcome-text-link" href={topic.link}>{topic.action}<Icon name="arrow" /></Link></section>)}<section className="help-guide" aria-labelledby="more-answers"><p className="eyebrow">MORE ANSWERS</p><h2 id="more-answers">Before you explore.</h2><PublicQuestions /></section></div></Shell>;
}

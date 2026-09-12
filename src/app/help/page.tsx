import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { PublicQuestions } from "@/ui/public-site";
import "@/ui/public-site.css";
export const metadata = publicPageMetadata("/help");
const topics = [
 {id:"cards",label:"Cards & spending",title:"A card of your own.",link:"/cardholder-services",action:"Open your cards",questions:[
 {q:"How do card money and allowances work?",a:"The owner adds money to the card group. Each card has its own total allowance, with no monthly reset. Spending is limited by both what remains on that card’s allowance and the group’s available money. Creating a card or changing an allowance adds no money."},
 {q:"What happens when I change an allowance?",a:"You change the total amount that card is allowed to spend, including what it has already used. The review shows the amount used and what will remain. Refunds return group money but do not restore allowance."},
 {q:"How do I give someone a card?",a:"Open People and invite them using their member code. They review and accept through their own login. Then choose Add card, select the person, name the card and set its total allowance. You can add more cards for that person with separate allowances."},
 {q:"How do I freeze a card?",a:"Select the card and choose Freeze card. A cardholder can freeze their own card. A card frozen by its owner stays frozen until the owner releases that restriction."}]},
 {id:"payments",label:"Payments & terminals",title:"One merchant. Your people’s terminals.",link:"/merchant-services",action:"Open Merchant services",questions:[
 {q:"What is a terminal?",a:"A terminal is a named payment workspace under your merchant. Create one for a person, a counter or a sales activity. It can receive payments through text, email, invoice, bill, social, QR or website links. It is not a separate merchant or money account."},
 {q:"What can a terminal user do?",a:"They can create and share payment requests, view their terminal’s receipts, and respond to disputes. They cannot see group money, issue refunds, settle payments, withdraw money or give others access. People assigned to the same terminal share its operational records."},
 {q:"Where does payment money go?",a:"Payments remain pending until the owner settles them. Every terminal’s settled payments go to one merchant balance. Merchant money stays separate from the money used by cards."},
 {q:"How are disputes handled?",a:"The payer raises a dispute for their payment. The merchant owner or assigned terminal user adds a response and supporting details, then submits it for review. An assigned reviewer records the outcome. A refund recommendation does not move money; the owner must explicitly issue the refund."},
 {q:"How do withdrawals work?",a:"Only the owner can review and request a withdrawal. The requested money is set aside while it is processed. A completed withdrawal is recorded; a failed withdrawal returns the money to the available balance."}]},
 {id:"access",label:"Sign-in & access",title:"Your own login. Your own view.",link:"/profile",action:"Open your profile",questions:[
 {q:"Where is my member code?",a:"Open Your profile from Your services. Share your member code with an account owner who wants to give you a card or terminal. Keep your password private."},
 {q:"How do invitations work?",a:"The owner chooses the person and service or terminal. Sign in to your own login to review and accept. An invitation creates no money or card by itself, and it does not give access to the other service. Only the owner can remove or replace access."},
 {q:"How do I create a login?",a:"Choose Create a login, use your email address and a password of at least 12 characters, and open the confirmation email. Confirm your email on the page it opens, then sign in."},
 {q:"What if I cannot sign in?",a:"Confirm your email before your first sign-in. If you already registered, check your email and password or choose Forgot your password? Use the latest confirmation or recovery email if an earlier link has expired."}]},
];
export default function HelpPage() {
  return <Shell><PublicPageStructuredData path="/help" /><section className="page-container public-help-intro"><p className="eyebrow">ETAIL DEPOT HELP CENTER</p><h1>A little help.<br /><span>A clear next step.</span></h1><p>Find your way around cards, payments and sign-in.</p><nav aria-label="Help topics" className="help-topic-links">{topics.map(topic=><a key={topic.id} href={`#${topic.id}`}>{topic.label}<Icon name="arrow" /></a>)}</nav></section><div className="page-container public-help-body">{topics.map(topic=><section key={topic.id} id={topic.id} className="help-guide"><p className="eyebrow">{topic.label}</p><h2>{topic.title}</h2><div className="public-questions">{topic.questions.map(item=><details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div><Link className="welcome-text-link" href={topic.link}>{topic.action}<Icon name="arrow" /></Link></section>)}<section className="help-guide" aria-labelledby="more-answers"><p className="eyebrow">MORE ANSWERS</p><h2 id="more-answers">Before you explore.</h2><PublicQuestions /></section></div></Shell>;
}

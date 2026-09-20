import { cardProduct } from "@/shared/card-product";
import { hostedServices } from "@/shared/hosted-services";

const commonQuestions = [
  {
    question: "Which services are available?",
    answer: `Trolleys payments are available now. Ledgix ${cardProduct.name} is coming soon. Explore each product here, then continue to its service website when it is available.`,
  },
  {
    question: "How can I accept payments?",
    answer: <>Visit <a href={hostedServices.payments.portalUrl} referrerPolicy="no-referrer" rel="external noreferrer">Trolleys</a> to apply for payment services. Once your account is approved, share payment links, QR codes or invoices, accept major card networks and give your team access.</>,
  },
  {
    question: "Will cards and payments use the same sign-in?",
    answer: "No. Ledgix and Trolleys have separate service websites, sign-ins and dashboards. You do not need to create an Etail Depot website login before continuing to Trolleys.",
  },
  {
    question: "When can I apply for a card?",
    answer: <>Ledgix {cardProduct.name} is coming soon. Applications are not open yet. For card inquiries, contact <a href={hostedServices.cards.contactHref}>{hostedServices.cards.email}</a>.</>,
  },
  {
    question: "Which digital wallets can I use?",
    answer: "When the card service is available, eligible cards can be added to Apple Wallet or Google Wallet. Support depends on the card, device and region.",
  },
  {
    question: "How does a secured credit card work?",
    answer: `${cardProduct.name} is a virtual ${cardProduct.creditType}. A security deposit backs the credit account. Purchases create a balance that you repay separately. The card’s product agreement explains the deposit, credit limit, fees and repayment terms.`,
  },
  {
    question: "How can I get help?",
    answer: <>For payments, contact <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}</a>. For cards, contact <a href={hostedServices.cards.contactHref}>{hostedServices.cards.email}</a>.</>,
  },
];

export function PublicQuestions() {
  return <div className="public-questions">{commonQuestions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>;
}

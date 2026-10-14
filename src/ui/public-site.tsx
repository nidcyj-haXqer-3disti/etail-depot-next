import { publicCompanyDescription } from "@/shared/legal-identity";

const commonQuestions = [
  {
    question: "Can I start accepting payments now?",
    answer: "You can apply with Trolleys now and accept payments once your account is approved and set up.",
  },
  {
    question: "When can I apply for a Ledgix credit card?",
    answer: "Credit card applications are not open yet. Visit the Credit card page for details and a preview of the wallet experience.",
  },
  {
    question: "Where will I manage my services?",
    answer: "Manage your payment acceptance account through Trolleys. Credit card account access will be available through Ledgix when the service launches, with a separate sign-in.",
  },
  {
    question: "Who operates Trolleys and Ledgix?",
    answer: publicCompanyDescription,
  },
];

export function PublicQuestions() {
  return <div className="public-questions">{commonQuestions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>;
}

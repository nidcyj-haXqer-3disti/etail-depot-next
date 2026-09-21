const commonQuestions = [
  {
    question: "Can I get started with payments now?",
    answer: "Yes. You can apply with Trolleys now. Once your account is approved and set up, you can accept payments.",
  },
  {
    question: "When can I apply for a Ledgix card?",
    answer: "Card applications are not open yet. Explore the Cards page for the product and wallet experience.",
  },
  {
    question: "Will cards and payments use the same sign-in?",
    answer: "No. Trolleys and Ledgix use separate service accounts. Card account access will open when Ledgix launches. You do not need an Etail Depot website login to continue to Trolleys.",
  },
];

export function PublicQuestions() {
  return <div className="public-questions">{commonQuestions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>;
}

const commonQuestions = [
  {
    question: "Can I use Etail Depot to accept payments?",
    answer: "US businesses can apply to accept online card and ACH payments. You can accept payments once your account is approved and set up. Your account setup and merchant agreement determine which services you can use.",
  },
  {
    question: "Can I add payments to my software?",
    answer: "Yes. If your software serves merchants, we can discuss how to connect payments. We’ll agree the checkout experience, payment records, responsibilities and pricing before launch.",
  },
  {
    question: "Can I apply for a credit card yet?",
    answer: "Applications are not open yet. Visit Card services for details on the security deposit, fees, full monthly repayment and digital wallets.",
  },
  {
    question: "How do I get started?",
    answer: "For your own business, start with Merchant services to see payment options, fees and account requirements. If you’re building payments into software, visit Software platforms.",
  },
];

export function PublicQuestions() {
  return <div className="public-questions">{commonQuestions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>;
}

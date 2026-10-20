import Link from "next/link";
import { publicCompanyDescription } from "@/shared/legal-identity";

const commonQuestions = [
  {
    question: "What merchant services does Trolleys offer?",
    answer: "Trolleys offers online card payments through payment requests shared by link or QR code. ACH payments are also available; contact Trolleys for ACH fees, timing and account options. Approved businesses manage payments in their Trolleys account.",
  },
  {
    question: "Can I start accepting payments now?",
    answer: "You can apply with Trolleys now and accept payments once your account is approved and set up.",
  },
  {
    question: "Can Trolleys help prevent chargebacks?",
    answer: "Optional Clarity shares purchase details with participating banks and helps prevent eligible Visa online fraud disputes. Coverage depends on the payment, participating bank and available records; it does not cover every chargeback.",
    link: { href: "/payment-acceptance-service#dispute-readiness", label: "Explore Clarity chargeback prevention and fees" },
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
  return <div className="public-questions">{commonQuestions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}{item.link && <> <Link href={item.link.href}>{item.link.label}</Link>.</>}</p></details>)}</div>;
}

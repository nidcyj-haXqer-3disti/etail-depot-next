import Link from "next/link";
import { PaymentPortalLink } from "./service-entry";
import "./payment-guide.css";

const guides = [
  {
    path: "/guides/stripe-alternatives",
    title: "Stripe alternatives",
    description: "Compare Stripe and Trolleys on payment links, features and costs before switching.",
  },
  {
    path: "/guides/payment-processing-systems",
    title: "Payment processing systems",
    description: "Understand the parts of a payment system and choose how customers will pay.",
  },
  {
    path: "/guides/what-is-a-chargeback",
    title: "What is a chargeback?",
    description: "Understand refunds, dispute fees, prevention and the records that help you respond.",
  },
] as const;

export function PaymentGuides({ showCta = false, excludePath }: { showCta?: boolean; excludePath?: string }) {
  return <section className="payment-guides" aria-labelledby="payment-guides-title">
    <div className="page-container">
      <div className="payment-guides-heading">
        <p className="eyebrow">Merchant guides</p>
        <h2 id="payment-guides-title">Payment providers, fees and chargebacks.</h2>
      </div>
      <div className="payment-guides-grid">
        {guides.filter(guide => guide.path !== excludePath).map(guide => <Link className="payment-guides-card" href={guide.path} key={guide.path}>
          <h3>{guide.title}</h3>
          <p>{guide.description}</p>
          <span className="payment-guides-read">Read the guide <span aria-hidden="true">→</span></span>
        </Link>)}
      </div>
      {showCta && <div className="payment-guides-next">
        <p>Ready to apply? Account setup and payment management take place at Trolleys.</p>
        <PaymentPortalLink>Continue to Trolleys</PaymentPortalLink>
      </div>}
    </div>
  </section>;
}

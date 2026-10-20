import Link from "next/link";
import { PUBLISHED_GUIDES } from "@/modules/public-site/guide-catalog";
import "./payment-guide.css";

export function PaymentGuides({ excludePath, relatedPaths }: { excludePath?: string; relatedPaths?: string[] }) {
  return <section className="payment-guides" aria-labelledby="payment-guides-title">
    <div className="page-container">
      <div className="payment-guides-heading">
        <p className="eyebrow">Merchant guides</p>
        <h2 id="payment-guides-title">{relatedPaths ? "Related guides" : "Payment links, providers and chargebacks."}</h2>
      </div>
      <div className="payment-guides-grid">
        {PUBLISHED_GUIDES.filter(guide => guide.path !== excludePath && (relatedPaths ?? ["/guides/how-to-create-a-payment-link","/guides/stripe-alternatives","/guides/payment-processing-systems","/guides/what-is-a-chargeback"]).includes(guide.path)).map(guide => <Link className="payment-guides-card" href={guide.path} key={guide.path}>
          <h3>{guide.title}</h3>
          <p>{guide.description}</p>
          <span className="payment-guides-read">Read the guide <span aria-hidden="true">→</span></span>
        </Link>)}
      </div>
    </div>
  </section>;
}

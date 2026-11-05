import Link from "next/link";
import { Icon } from "./icon";
import { StandardsCollections } from "./standards-collections";
import "./guide-directory.css";
import "./enterprise-support.css";
import "./connected-resources.css";

export function GuideDirectory() {
  return <div className="guides-directory page-container cw-guides">
    <header className="guides-directory-heading"><h1>Guides</h1><p className="guides-directory-intro">Set up your merchant account, connect your store and look up payment codes.</p></header>
    <section className="guides-setup" aria-label="Setup guides">
      <Link href="/docs/merchant-onboarding" className="guides-setup-card">
        <Icon name="business" /><h2>Merchant account setup</h2>
        <p>Enter your email, create a login or return to your application.</p>
        <span className="guides-setup-format">Step by step with screenshots</span>
      </Link>
      <Link href="/resources/shopify-gateway-integration" className="guides-setup-card">
        <Icon name="link" /><h2>Shopify integration</h2>
        <p>Connect Shopify to Cybersource and check your first payment.</p>
        <span className="guides-setup-format">Step by step with screenshots</span>
      </Link>
    </section>
    <StandardsCollections />
  </div>;
}

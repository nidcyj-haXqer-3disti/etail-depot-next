import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { ProductPreview, PublicQuestions, StartExploring } from "@/ui/public-site";
import "@/ui/public-site.css";

export const metadata = publicPageMetadata("/");

export default function HomePage() {
  return <Shell><PublicPageStructuredData path="/" />
    <section className="welcome-hero page-container" aria-labelledby="welcome-title">
      <div className="welcome-copy"><p className="eyebrow">A LITTLE MORE CLARITY. EVERY DAY.</p><h1 id="welcome-title">Your cards.<br />Your business.<br /><span>All in view.</span></h1><p className="welcome-description">Keep up with card spending. Stay on top of customer payments. Etail Depot brings the details that matter into one easy place.</p><div className="welcome-actions"><Link href="/login" className="button primary">Explore Etail Depot <Icon name="arrow" /></Link><a href="#find-your-service" className="welcome-text-link">Find your service <span aria-hidden="true">↓</span></a></div><p className="welcome-note">Try it with demo cards and payments. No real money moves.</p></div><ProductPreview />
    </section>
    <section className="public-section service-discovery page-container" id="find-your-service" aria-labelledby="service-title">
      <div className="public-section-heading"><div><p className="eyebrow">MADE FOR YOUR EVERYDAY</p><h2 id="service-title">What brings you here?</h2></div><p>Start with your cards or your business.<br />Everything else follows from there.</p></div>
      <div className="discovery-grid">
        <article className="discovery-card discovery-cards"><div className="discovery-top"><span className="public-icon"><Icon name="person" /></span><span className="discovery-category">FOR CARDHOLDERS</span></div><h3>A clearer picture<br />of your spending.</h3><p>Find your balance, check a purchase and freeze a misplaced card. Manage your own cards or help look after the people in your card group.</p><ul className="public-checklist"><li><Icon name="check" />Card balances and recent activity</li><li><Icon name="check" />Quick freeze and card controls</li><li><Icon name="check" />Separate access for each cardholder</li></ul><Link href="/card-services" className="discovery-link">Explore cardholder services <Icon name="arrow" /></Link></article>
        <article className="discovery-card discovery-payments"><div className="discovery-top"><span className="public-icon"><Icon name="shop" /></span><span className="discovery-category">FOR BUSINESSES</span></div><h3>Less looking around.<br />More moving forward.</h3><p>Bring payment links, customer payments and refunds together. See how each store is doing and give your team the access they need.</p><ul className="public-checklist"><li><Icon name="check" />Payment links, invoices and QR codes</li><li><Icon name="check" />Payment history and clear receipts</li><li><Icon name="check" />Stores and team access in one place</li></ul><Link href="/payment-services" className="discovery-link">Explore merchant services <Icon name="arrow" /></Link></article>
      </div>
    </section>
    <section className="public-section everyday-section page-container" aria-labelledby="everyday-title"><div className="public-section-heading"><div><p className="eyebrow">LESS EFFORT. MORE CONFIDENCE.</p><h2 id="everyday-title">The next step is always close.</h2></div></div><div className="everyday-grid"><article><span className="everyday-number">01</span><h3>Find what matters</h3><p>Your card, your balance and your recent activity stay together. Business payments have their own clear home.</p></article><article><span className="everyday-number">02</span><h3>Stay in control</h3><p>Review an action before you confirm. Give others access without sharing your sign-in or your private activity.</p></article><article><span className="everyday-number">03</span><h3>Pick up anywhere</h3><p>Use the same simple tools on your phone or computer. Get back to a card, payment or saved request when you need it.</p></article></div></section>
    <section className="public-section page-container public-faq-section" aria-labelledby="questions-title"><div><p className="eyebrow">GOOD TO KNOW</p><h2 id="questions-title">A few answers<br />before you begin.</h2><Link href="/help" className="welcome-text-link">Visit the help center <Icon name="arrow" /></Link></div><PublicQuestions /></section><StartExploring />
  </Shell>;
}

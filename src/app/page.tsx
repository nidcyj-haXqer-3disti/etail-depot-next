import Link from "next/link";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { HomeCompanyArt } from "@/ui/home-company-art";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import styles from "@/ui/home-overview.module.css";

export const metadata = publicPageMetadata("/");

export default function Page() {
  return <Shell>
    <PublicPageStructuredData path="/" />
    <div className={styles.home}>
      <section className={`${styles.hero} ec-home-hero`} aria-labelledby="welcome-title">
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div className={styles.heroCopy} data-home-copy>
            <h1 id="welcome-title">Merchant services.{" "}<br /><span>For your business.</span></h1>
            <p className={styles.intro}>Credit card processing, online checkout and reporting for US businesses and software platforms. Opening an account or looking for another provider? Let’s talk about what you need.</p>
            <div className={`${styles.heroActions} ec-hero-actions`}><Link className={styles.primary} href="#services">Explore our services</Link></div>
            <p className={styles.note}>Merchant account approval is required. Payment methods, pricing and payout terms depend on the account.</p>
          </div>
          <HomeCompanyArt />
        </div>
      </section>

      <section className={`${styles.container} ${styles.services}`} id="services" aria-label="Explore Etail services">
        <span className={styles.anchor} id="payment-channels" /><span className={styles.anchor} id="service-lifecycle-title" /><span className={styles.anchor} id="online-businesses-title" /><span className={styles.anchor} id="home-section-2-title" />
        <article className={styles.service} id="business-services">
          <span className={styles.serviceIcon}><Icon name="business" /></span>
          <h2>Merchant services</h2>
          <p>Accept cards, digital wallets and ACH. Follow each payment from checkout through refunds, disputes and payout reporting.</p>
          <Link className={styles.textLink} href="/payment-acceptance-service">Explore merchant services</Link>
        </article>
        <article className={styles.service} id="use-cases-title">
          <span className={styles.anchor} id="software-partners-title" /><span className={styles.anchor} id="partner-contact" /><span className={styles.anchor} id="audiences-title" /><span className={styles.anchor} id="home-section-3-title" />
          <span className={styles.serviceIcon}><Icon name="layers" /></span>
          <h2>Software platforms</h2>
          <p>Merchant accounts, checkout and reporting for the businesses using your software.</p>
          <Link className={styles.textLink} href="/software-partners">Explore software platforms</Link>
        </article>
        <article className={styles.service} id="card-services">
          <span className={styles.anchor} id="ledgix-title" />
          <span className={styles.serviceIcon}><Icon name="card" /></span>
          <h2>Card services</h2>
          <p>A virtual Visa secured credit card for Apple Wallet and Google Wallet, where supported.</p>
          <Link className={styles.textLink} href="/credit-card-services">Explore card services</Link>
        </article>
      </section>

      <section className={styles.review} aria-labelledby="review-title">
        <div className={`${styles.container} ${styles.reviewGrid}`}>
          <div><p className={styles.eyebrow}>Changing providers</p><h2 id="review-title">Need a different{" "}<br /><span>provider?</span></h2></div>
          <div className={styles.reviewCopy}>
            <p>Application declined or account closed? Etail offers credit card processing and ACH, with guidance on account setup, checkout and switching providers.</p>
            <Link className={styles.textLink} href="/switch-payment-providers">Switch merchant services</Link>
          </div>
        </div>
      </section>

      <section className={`${styles.container} ${styles.resources}`} aria-label="Documentation and guides">
        <span className={styles.anchor} id="resources-title" /><span className={styles.anchor} id="questions-title" />
        <Link className={styles.resource} href="/docs" id="home-docs-title"><span className={styles.resourceIcon}><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m10 8-8 8 8 8m12-16 8 8-8 8M19 4l-6 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span><div><h2>Documentation</h2><p>Account setup, checkout and payment operations.</p></div></Link>
        <Link className={styles.resource} href="/guides" id="home-guides-title"><span className={styles.resourceIcon}><Icon name="document" /></span><div><h2>Guides</h2><p>ISO 20022 and independent ISO 8583 references.</p></div></Link>
      </section>
    </div>
  </Shell>;
}

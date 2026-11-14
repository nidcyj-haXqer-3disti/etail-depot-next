import Link from "next/link";
import { Shell } from "@/shared/layout/shell";
import { BrandImage } from "@/shared/brand/brand-image";
import "@/shared/brand/brand-images-cybersource.css";
import { TrolleysBrand } from "@/shared/brand/trolleys-brand";
import { Icon } from "@/shared/ui/icon";
import { noCodeCheckoutJsonLd } from "./metadata";
import { ServiceDetailHero } from "@/features/services/shared/service-detail-layout";
import classic from "@/features/services/shared/service-detail.module.css";
import { IntegrationGuideStepState } from "@/features/resources/components/integration-guide-step-state";
import { NoCodeCheckoutSetup } from "./setup-guide";
import s from "./checkout-experience.module.css";

// Local presentation only. Both options remain inactive until the receiving
// account and its exact provider-hosted payment URL have been verified.
export function NoCodeCheckoutExperiencePage() {
  return <Shell><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: noCodeCheckoutJsonLd() }} /><div className={classic.page}>
    <ServiceDetailHero label="No code checkout experience" title="Accept payments with a link or QR code."
      intro="Share a payment link or QR code with your customers. No website or coding needed."
      actions={<><a className={classic.primary} href="#setup">Set up your checkout</a><a className={classic.secondary} href="#checkout-experience">See the checkout</a></>}
      note="Payment links must be enabled for your merchant account."
      artwork={<section className={`${classic.scene} ${s.surface}`} id="checkout-experience" aria-labelledby="checkout-experience-title" data-checkout-preview>
        <div className={s.panel}>
          <div className={s.identity}><TrolleysBrand compact /><span className={s.preview}>Preview</span></div>
          <h2 id="checkout-experience-title" className={s.title}>Choose how to pay.</h2>
          <div className={s.online}>
            <button type="button" className={`${classic.primary} ${s.open}`} disabled aria-describedby="checkout-status">Pay online<Icon name="external" /></button>
            <p>Opens the payment page on this device.</p>
          </div>
          <div className={s.separator}><span>or use your phone</span></div>
          <div className={s.scan}>
            <div className={s.qrPlaceholder} data-qr-placeholder><Icon name="qr" /><span>QR code pending</span></div>
            <div><h3>Scan to pay</h3><p>Use your phone’s camera to open the payment page.</p></div>
          </div>
          <p id="checkout-status" role="status" className={s.status}>Preview only. Payments are not available yet.</p>
        </div>
        <p className={s.protection}><span>Checkout hosted by</span><BrandImage brand="cybersource" alt="Cybersource" width={180} height={44} className={s.providerLogo} /></p>
      </section>}
    />
    <section className={classic.overview} aria-labelledby="checkout-benefits-title"><div className={classic.container}>
      <div className={classic.sectionHeading}><h2 id="checkout-benefits-title">Share it your way.</h2></div>
      <dl className={classic.benefits}>
        <div><dt><span className={classic.featureIcon}><Icon name="link" /></span>Send a link</dt><dd>Add it to an email, text message or social profile.</dd></div>
        <div><dt><span className={classic.featureIcon}><Icon name="qr" /></span>Display a QR code</dt><dd>Place it on an invoice, a sign or your website.</dd></div>
        <div><dt><span className={classic.featureIcon}><Icon name="lock" /></span>Let customers pay</dt><dd>Customers review the amount and enter their payment details on the hosted checkout page.</dd></div>
      </dl>
      <Link href="/services/payment-methods" prefetch={false} className={s.methodLink}>View payment methods<Icon name="arrow" /></Link>
    </div></section>
    <NoCodeCheckoutSetup />
    <IntegrationGuideStepState />
  </div></Shell>;
}

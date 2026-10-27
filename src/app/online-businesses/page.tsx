import Link from "next/link";
import { servicePageMetadata } from "@/modules/public-site/metadata";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { PaymentPortalLink } from "@/ui/service-entry";
import { PaymentLinkArt } from "@/ui/payment-link-art";
import { PaymentServiceExplorer } from "@/ui/payment-service-explorer";
import { ServiceSectionNav } from "@/ui/service-section-nav";
import "@/ui/public-site.css";
import "@/ui/consumer-site.css";
import "@/ui/payment-page.css";
import "@/ui/service-blueprint.css";
import "@/ui/online-business-page.css";

export const metadata = servicePageMetadata("/online-businesses");

export default function OnlineBusinessesPage() {
  return <Shell quietAccess>
    <div className="consumer-page consumer-payments service-blueprint online-business-page">
      <ServiceSectionNav title="Online businesses" links={[
        { href: "#customer-checkout", label: "Payment journey" },
        { href: "#payment-channels", label: "Payment requests" },
      ]} />
      <section className="online-business-hero" aria-labelledby="online-business-title">
        <div className="page-container online-business-intro">
          <div><p className="eyebrow">Online businesses</p><h1 id="online-business-title">Payments for<br /><span>online businesses.</span></h1></div>
          <div className="online-business-copy">
            <p>Give customers a choice of cards, digital wallets and ACH at checkout. Keep track of the payment from the order through to your bank deposit.</p>
            <div className="online-business-actions"><PaymentPortalLink>Apply for a merchant account</PaymentPortalLink><Link href="/payment-acceptance-service#fees" className="consumer-text-link">View processing fees<Icon name="arrow" /></Link></div>
            <p className="online-business-note">Applications open at Trolleys, an Etail Depot service. Account approval and setup apply. ACH pricing is separate.</p>
          </div>
        </div>
        <section className="page-container online-business-journey" id="customer-checkout" aria-label="Payment journey">
          <h2 className="sr-only" id="payment-workflow-title">Payment journey</h2>
          <PaymentServiceExplorer />
        </section>
      </section>
      <div className="page-container">
        <section className="payment-sharing-note" id="payment-channels" aria-labelledby="payment-sharing-title">
          <div className="payment-sharing-copy" id="request-details">
            <p className="eyebrow">Payment requests</p><h2 id="payment-sharing-title">Take the checkout<br />to your customer.</h2>
            <p>Send a payment request when the sale happens outside your website checkout. Your customer opens a hosted payment page to complete the purchase.</p>
            <p>Share it by email, text, social media or a website button. Use a QR code on printed materials.</p>
            <p className="payment-sharing-qualification">Available options depend on your account setup.</p>
            <Link href="/docs/payment-requests" className="consumer-text-link">Use payment requests<Icon name="arrow" /></Link>
          </div>
          <PaymentLinkArt />
        </section>
      </div>
    </div>
  </Shell>;
}

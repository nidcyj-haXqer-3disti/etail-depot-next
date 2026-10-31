import Link from "next/link";
import { ServiceContext } from "@/ui/service-context";
import "@/ui/connected-services.css";
import { servicePageMetadata } from "@/modules/public-site/metadata";
import { Shell } from "@/ui/shell";
import { PaymentLinkArt } from "@/ui/payment-link-art";
import { PaymentServiceExplorer } from "@/ui/payment-service-explorer";
import { ServiceSectionNav } from "@/ui/service-section-nav";
import "@/ui/public-site.css";
import "@/ui/consumer-site.css";
import "@/ui/payment-page.css";
import "@/ui/service-blueprint.css";
import "@/ui/online-business-page.css";
import "@/ui/enterprise-support.css";
import "@/ui/attention-pages.css";

import "@/ui/service-craft.css";

export const metadata = servicePageMetadata("/online-businesses");

export default function OnlineBusinessesPage() {
  return <Shell>
    <div className="consumer-page consumer-payments service-blueprint online-business-page online-craft enterprise-support cw-online attention-site attention-online">
      <ServiceContext path="/online-businesses" structured />
      <ServiceSectionNav title="Online businesses" links={[
        { href: "#customer-checkout", label: "Payment journey" },
        { href: "#payment-channels", label: "Payment requests" },
      ]} />
      <section className="online-business-hero" aria-labelledby="online-business-title">
        <div className="page-container online-business-intro">
          <div><p className="eyebrow">Online businesses</p><h1 id="online-business-title">Online payments.{" "}<br /><span>Connected to your orders.</span></h1></div>
          <div className="online-business-copy">
            <p>Accept credit cards, digital wallets and ACH online through the methods enabled for your account. Keep the payment result connected to the order.</p>
            <div className="online-business-actions"><Link href="/payment-acceptance-service" className="button primary">Explore merchant services</Link><Link href="/docs/checkout" className="consumer-text-link">Connect online checkout</Link></div>
            <p className="online-business-note">Account approval and setup apply. Wallet availability depends on the customer’s card and device. ACH pricing is separate.</p>
          </div>
        </div>
        <section className="page-container online-business-journey" id="customer-checkout" aria-label="Payment journey">
          <h2 className="sr-only" id="payment-workflow-title">From order to payment record.</h2>
          <PaymentServiceExplorer />
        </section>
      </section>
      <div className="page-container">
        <section className="cw-order-outcome" aria-labelledby="order-outcome-title"><div><p className="eyebrow">After checkout</p><h2 id="order-outcome-title">Know whether an order is paid.</h2><p>Check the payment record before fulfilling an order or requesting another payment. A browser message alone does not confirm the outcome.</p></div><dl><div><dt>Payment confirmed</dt><dd>Match the amount and reference to the order before fulfillment. Capture and bank receipt are separate.</dd></div><div><dt>Result unclear</dt><dd>Check the existing payment attempt before requesting another payment. An interruption is not a decline.</dd></div><div><dt>Customer needs a refund</dt><dd>Return to the original transaction. Follow the refund’s own status and reference.</dd></div></dl></section>
        <section className="payment-sharing-note" id="payment-channels" aria-labelledby="payment-sharing-title">
          <div className="payment-sharing-copy" id="request-details">
            <p className="eyebrow">Payment requests</p><h2 id="payment-sharing-title">Send a payment request{" "}<br />when the order is ready.</h2>
            <p>For orders placed by phone, email or another channel, share a hosted payment page by email, text, social media, a website button or a QR code.</p>
            <p className="payment-sharing-qualification">Available options depend on your account setup.</p>
            <Link href="/docs/payment-requests" className="consumer-text-link">Use payment requests</Link>
          </div>
          <PaymentLinkArt />
        </section>
      </div>
    </div>
  </Shell>;
}

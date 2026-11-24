import "@/features/use-cases/online-businesses/site-artwork-polish-online.css";
import { SalesContactLink } from "@/shared/ui/sales-booking/sales-booking-link";
import Link from "next/link";
import { PaymentPortalLink } from "@/shared/ui/merchant-portal-link";
import { CommercialStructuredData } from "@/shared/seo/commercial-structured-data";
import { pageDetails } from "./metadata";
import "@/shared/styles/connected-services.css";
import { Shell } from "@/shared/layout/shell";
import { PaymentLinkArt } from "@/features/use-cases/online-businesses/payment-link-art";
import { PaymentServiceExplorer } from "@/features/services/overview/payment-service-explorer";
import "@/shared/styles/public-site.css";
import "@/shared/brand/consumer-site.css";
import "@/features/services/overview/payment-page.css";
import "@/shared/styles/service-blueprint.css";
import "@/features/use-cases/online-businesses/online-business-page.css";
import "@/shared/styles/enterprise-support.css";
import "@/shared/styles/attention-pages.css";

import "@/shared/styles/service-craft.css";

export default function OnlineBusinessesPage() {
  return <Shell>
    <div className="consumer-page consumer-payments service-blueprint online-business-page online-craft enterprise-support cw-online attention-site attention-online">
      <CommercialStructuredData path="/use-cases/online-businesses" page={pageDetails} />
      <section className="online-business-hero" aria-labelledby="online-business-title">
        <div className="page-container online-business-intro">
          <div><p className="eyebrow">Online businesses</p><h1 id="online-business-title">Payments for your{" "}<br /><span>next online store.</span></h1></div>
          <div className="online-business-copy">
            <p>Connect your store with Trolleys, an Etail Depot service. Get guidance on your merchant account and checkout setup.</p>
            <div className="online-business-actions">
              <PaymentPortalLink intent="register" />
              <SalesContactLink className="consumer-text-link">Talk with our team</SalesContactLink>
            </div>
            <p className="online-business-note">For US businesses accepting USD. Account approval and setup apply. Wallet availability depends on the customer’s card and device. ACH pricing is separate.</p>
          </div>
        </div>
        <section className="page-container online-business-journey" id="customer-checkout" aria-label="Payment journey">
          <h2 className="sr-only" id="payment-workflow-title">From order to payment record.</h2>
          <PaymentServiceExplorer />
        </section>
      </section>
      <div className="page-container">
        <section className="online-store-setup" id="plan-your-store" aria-labelledby="store-setup-title">
          <div>
            <p className="eyebrow">Before you connect</p>
            <h2 id="store-setup-title">Another store or brand?</h2>
            <p>A new website does not automatically need another merchant ID. We can help you confirm the account setup for your store and trading name.</p>
            <p className="online-store-support">Already use Trolleys? <Link prefetch={false} href="/company/contact#account-support">Get account support</Link>.</p>
          </div>
          <ul className="online-store-paths">
            <li>
              <h3><Link prefetch={false} href="/resources/merchant-account-setup#additional-mid">Adding another DBA</Link></h3>
              <p>See how to request another merchant account under the same company. Account approval is required.</p>
            </li>
            <li>
              <h3><Link prefetch={false} href="/resources/woocommerce-gateway-integration">Connecting WooCommerce</Link></h3>
              <p>Follow the WordPress.com setup guide. Other hosts need a setup check.</p>
            </li>
            <li>
              <h3><Link prefetch={false} href="/developers/getting-started">Your account is approved</Link></h3>
              <p>Match your store to the account details in your welcome email, then choose your checkout connection.</p>
            </li>
          </ul>
        </section>
        <section className="cw-order-outcome" aria-labelledby="order-outcome-title"><div><p className="eyebrow">After checkout</p><h2 id="order-outcome-title">Know whether an order is paid.</h2><p>Confirm the payment before fulfillment or another attempt. A browser message alone does not establish the outcome.</p><Link prefetch={false} href="/services/reconciliation" className="consumer-text-link">Compare payment records</Link></div><dl><div><dt>Payment confirmed</dt><dd>Match the amount and reference to the order before fulfillment. Capture and bank receipt are separate.</dd></div><div><dt>Result unclear</dt><dd>Check the existing payment attempt before requesting another payment. An interruption is not a decline.</dd></div><div><dt>Customer needs a refund</dt><dd>Return to the original transaction. Follow the refund’s own status and reference.</dd></div></dl></section>
        <section className="payment-sharing-note" id="payment-channels" aria-labelledby="payment-sharing-title">
          <div className="payment-sharing-copy" id="request-details">
            <p className="eyebrow">Payment requests</p><h2 id="payment-sharing-title">Send a payment request{" "}<br />when the order is ready.</h2>
            <p>Share a hosted payment page for orders arranged by phone, email or another channel.</p>
            <p className="payment-sharing-qualification">Available options depend on your account setup.</p>
            <Link href="/developers/developer-tools#payment-requests" className="consumer-text-link">Use payment requests</Link>
          </div>
          <PaymentLinkArt />
        </section>
      </div>
    </div>
  </Shell>;
}

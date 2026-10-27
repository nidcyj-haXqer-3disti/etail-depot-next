import { serviceExample } from "@/modules/public-site/service-model";
import { CommerceProductArt } from "./commerce-product-art";
import { Icon } from "./icon";
import { NetworkMark } from "./network-brands";
import "./partner-workflow-art.css";

const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: serviceExample.currency }).format(serviceExample.amountCents / 100);

export function PlatformOnboardingArt() {
  return <div className="platform-stage-art" role="group" aria-label="Merchant account application">
    <div className="platform-art-sheet">
      <div className="platform-art-heading"><Icon name="business" /><span>Merchant account</span></div>
      <div className="platform-business-profile"><span className="platform-business-monogram" aria-hidden="true"><Icon name="business" /></span><div><strong>Your business</strong><span>Business profile</span></div></div>
      <ul className="platform-application-items"><li>Business details<Icon name="document" /></li><li>Owners and representatives<Icon name="person" /></li><li>Payout account<Icon name="bank" /></li></ul>
      <div className="platform-art-footnote"><span>Application</span><Icon name="arrow" /><span>Review</span></div>
    </div>
  </div>;
}

export function PlatformCheckoutArt() {
  return <div className="platform-stage-art" role="group" aria-label="Checkout and order reference">
    <div className="platform-art-sheet">
      <div className="platform-art-heading"><Icon name="lock" /><span>Customer checkout</span></div>
      <div className="platform-checkout-purchase"><span className="platform-product-image"><CommerceProductArt /></span><div><strong>{serviceExample.description}</strong><span>Order {serviceExample.orderReference}</span></div></div>
      <div className="platform-checkout-total"><span>Order total</span><strong>{amount}<small>{serviceExample.currency}</small></strong></div>
      <div className="platform-checkout-method"><NetworkMark network="visa" /><span>Card ending in 4242</span></div>
      <div className="platform-art-footnote"><Icon name="link" /><span>Order reference · {serviceExample.orderReference}</span></div>
    </div>
  </div>;
}

export function PlatformPayoutArt() {
  return <div className="platform-stage-art" role="group" aria-label="Payout reconciliation">
    <div className="platform-art-sheet">
      <div className="platform-art-heading"><Icon name="document" /><span>Payout breakdown</span></div>
      <div className="platform-payout-lines"><div><span>Payments</span><Icon name="card" /></div><div><span>Fees and adjustments</span><span aria-hidden="true">− / +</span></div><div className="platform-payout-total"><strong>Payout total</strong><Icon name="bank" /></div></div>
      <div className="platform-deposit"><Icon name="bank" /><div><strong>Bank deposit</strong><span>Match to your bank statement</span></div></div>
    </div>
  </div>;
}

/** Static service relationships, without an implied API contract or live account. */
export function PlatformIntegrationArt() {
  return <figure className="platform-integration-art" aria-labelledby="responsibilities-title">
    <div className="platform-integration-diagram" id="responsibilities" role="group" aria-labelledby="responsibilities-title">
      <h3 id="responsibilities-title" className="visually-hidden">A clear division of responsibilities.</h3>
      <div className="platform-system platform-system--software">
        <div className="platform-system-heading"><Icon name="layers" /><h3>Your software</h3></div>
        <div className="platform-system-body">
          <div className="platform-system-function"><Icon name="box" /><div><strong>Orders and invoices</strong></div></div>
          <div className="platform-system-function"><Icon name="message" /><div><strong>Fulfillment and customers</strong></div></div>
        </div>
      </div>
      <div className="platform-data-paths" role="group" aria-label="Connection between software and merchant services">
        <div className="platform-data-path"><span>Checkout</span><span className="platform-path-line" aria-hidden="true"><Icon name="arrow" /></span><small>Order reference</small></div>
        <div className="platform-data-path platform-data-path--return"><span>Payment records</span><span className="platform-path-line" aria-hidden="true"><Icon name="arrow" /></span><small>Status and references</small></div>
      </div>
      <div className="platform-system platform-system--payments">
        <div className="platform-system-heading"><Icon name="card" /><h3>Merchant services</h3></div>
        <div className="platform-system-body">
          <div className="platform-system-function"><Icon name="person" /><div><strong>Account and checkout</strong></div></div>
          <div className="platform-system-function"><Icon name="document" /><div><strong>Transactions and payouts</strong></div></div>
        </div>
      </div>
    </div>
  </figure>;
}

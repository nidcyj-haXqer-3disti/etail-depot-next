import Image from "next/image";
import { serviceExample } from "@/modules/public-site/service-model";
import { Icon } from "./icon";
import { CommerceProductArt } from "./commerce-product-art";
import { NetworkMark } from "./network-brands";
import { LedgixCardFace, WalletCardArt } from "./wallet-card-art";

const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: serviceExample.currency }).format(serviceExample.amountCents / 100);

/** Static checkout composition. All apparent fields are text, not payment controls. */
export function MerchantCheckoutArt() {
  return <figure className="bp-checkout-art" aria-label="Customer checkout summary">
    <div className="bp-checkout-window">
      <div className="bp-art-bar"><span><Icon name="lock" />Online checkout</span><span>{serviceExample.business}</span></div>
      <div className="bp-checkout-body">
        <div className="bp-order-summary">
          <span className="bp-order-symbol"><CommerceProductArt /></span>
          <p>{serviceExample.description}</p><span>Order {serviceExample.orderReference}</span>
          <div className="bp-checkout-amount">{amount}<span>USD</span></div>
          <div className="bp-art-rule" /><p className="bp-small">1 pair · Chalk / Teal</p>
        </div>
        <div className="bp-payment-fields">
          <p className="bp-art-label">Payment details</p>
          <div className="bp-wallet-pair">
            <span><Image src="/brand/wallets/apple-pay.svg" width={165.52107} height={105.9651} alt="Apple Pay" unoptimized loading="eager" /></span>
            <span><Image src="/brand/wallets/google-pay.svg" width={1094} height={742} alt="Google Pay" unoptimized loading="eager" /></span>
          </div>
          <p className="bp-card-divider">Or pay by card</p>
          <dl className="bp-checkout-fields">
            <div className="bp-field-wide"><dt>Card number</dt><dd><span>•••• •••• •••• 4242</span><NetworkMark network="visa" /></dd></div>
            <div><dt>Expiry</dt><dd>MM / YY</dd></div><div><dt>Security code</dt><dd>•••</dd></div>
            <div className="bp-field-wide"><dt>Name on card</dt><dd>•••• ••••••</dd></div>
          </dl>
          <div className="bp-pay-label" aria-hidden="true"><Icon name="lock" />Pay {amount}</div>
          <div className="bp-bank-option"><Icon name="bank" /><span>ACH bank payment</span></div>
        </div>
      </div>
    </div>
    <figcaption>Checkout preview. No payment is made.</figcaption>
  </figure>;
}

/** A service relationship diagram, not a connected platform or an account dashboard. */
export function PlatformServicesArt() {
  return <figure className="bp-platform-art" aria-label="Your software and merchant services">
    <div className="bp-platform-app">
      <div className="bp-art-bar"><span><Icon name="layers" />Your software</span><span>Order details</span></div>
      <div className="bp-platform-order"><span className="commerce-product-thumbnail"><CommerceProductArt /></span><div><span>Order {serviceExample.orderReference}</span><strong>{serviceExample.description}</strong></div><strong>{amount}<span>{serviceExample.currency}</span></strong></div>
      <div className="bp-platform-work"><span>Customers</span><span>Orders</span><span>Fulfillment</span></div>
    </div>
    <div className="bp-connection-line"><span>Merchant account connection</span></div>
    <div className="bp-platform-services">
      <div className="bp-art-bar"><span><Icon name="card" />Merchant services</span><span>Etail Depot</span></div>
      <div className="bp-service-nodes">
        <div><Icon name="person" /><strong>Onboarding</strong><span>Application and review</span></div>
        <div><Icon name="card" /><strong>Checkout</strong><span>Cards, wallets and ACH</span></div>
        <div><Icon name="document" /><strong>Transactions</strong><span>Records and account actions</span></div>
        <div><Icon name="bank" /><strong>Payouts</strong><span>Deposits and reconciliation</span></div>
      </div>
    </div>
  </figure>;
}

export function CardProgramArt() {
  return <div className="bp-card-stage">
    <div className="bp-card-display" aria-hidden="true"><div className="bp-card-face"><LedgixCardFace /></div><div className="bp-card-caption"><span>Virtual Visa secured credit card</span></div></div>
    <WalletCardArt variant="preview" />
  </div>;
}

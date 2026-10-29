import { CommerceProductArt } from "./commerce-product-art";
import { productFacts } from "@/shared/product-facts";
import { serviceExample } from "@/modules/public-site/service-model";
import { Icon } from "./icon";
import { NetworkMark } from "./network-brands";
import "./payment-lifecycle-art.css";

type PaymentLifecycleArtProps = { variant?: "home" | "partner" | "merchant" };

function amount(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: serviceExample.currency }).format(cents / 100);
}

/** Static transaction summary; the net calculation is not a bank deposit. */
export function PaymentLifecycleArt({ variant = "home" }: PaymentLifecycleArtProps) {
  if (variant === "merchant") return <MerchantPaymentRecord />;
  return (
    <figure className={`payment-lifecycle-art payment-lifecycle-art--${variant}`} aria-label="Card payment summary">
      <div className="pla-sheet">
        <div className="pla-toolbar">
          <span className="pla-title"><Icon name="document" />Payment details</span>
          <span className="pla-business">{serviceExample.business}</span>
        </div>

        <div className="pla-body">
          <div className="pla-overview">
            <div className="pla-amount-row">
              <p className="pla-amount">{amount(serviceExample.amountCents)}<span>{serviceExample.currency}</span></p>
              <span className="pla-status"><Icon name="check" />Captured</span>
            </div>
            <div className="pla-product"><span className="commerce-product-thumbnail"><CommerceProductArt /></span><div><p className="pla-description">{serviceExample.description}</p><p className="pla-product-detail">1 pair · Chalk / Teal</p></div></div>
          </div>

          <dl className="pla-details">
            <div><dt>Order</dt><dd>{serviceExample.orderReference}</dd></div>
            <div><dt>Payment method</dt><dd className="pla-card"><span className="pla-card-brand"><NetworkMark network="visa" /></span><span><span aria-hidden="true">•••• </span><span className="pla-card-prefix">Card ending in </span>4242</span></dd></div>
          </dl>

          <dl className="pla-totals">
            <div className="pla-fee"><dt>Processing fee<span>{productFacts.payments.cardRateLabel}</span></dt><dd>−{amount(serviceExample.processingFeeCents)}</dd></div>
            <div className="pla-net"><dt>After card processing</dt><dd>{amount(serviceExample.netAmountCents)}</dd></div>
          </dl>
        </div>
      </div>
      <figcaption>Excludes other fees and adjustments.<br />Bank deposit is confirmed separately.</figcaption>
    </figure>
  );
}

/** A merchant transaction record, distinct from its later settlement and deposit. */
function MerchantPaymentRecord() {
  return <figure className="payment-lifecycle-art payment-lifecycle-art--merchant" aria-label="Card payment summary">
    <div className="pla-sheet">
      <div className="pla-toolbar"><span className="pla-title"><Icon name="document" />Transaction details</span><span className="pla-business">{serviceExample.business}</span></div>
      <div className="pla-record-body">
        <dl className="pla-record-summary">
          <div className="pla-record-value"><dt>Payment amount</dt><dd>{amount(serviceExample.amountCents)}<span>{serviceExample.currency}</span></dd></div>
          <div className="pla-record-status"><dt>Status</dt><dd><span className="pla-status"><Icon name="check" />Captured</span></dd></div>
          <div className="pla-record-reference"><dt>Order reference</dt><dd>{serviceExample.orderReference}</dd></div>
        </dl>
        <div className="pla-record-purchase"><span className="commerce-product-thumbnail"><CommerceProductArt /></span><div><p>{serviceExample.description}</p><span>1 pair · Chalk / Teal</span></div></div>
        <div className="pla-record-method"><span>Payment method</span><span className="pla-card"><span className="pla-card-brand"><NetworkMark network="visa" /></span><span><span aria-hidden="true">•••• </span><span className="pla-card-prefix">Card ending in </span>4242</span></span></div>
        <div className="pla-processing">
          <p>Payment to deposit</p>
          <ol aria-label="Capture, settlement, payout calculation and bank deposit">
            <li className="pla-processing-current"><span>1</span><strong>Capture</strong></li>
            <li><span>2</span><strong>Settlement</strong></li>
            <li><span>3</span><strong>Payout calculation</strong></li>
            <li><span>4</span><strong>Bank deposit</strong></li>
          </ol>
          <p className="pla-processing-note">Fees, refunds and chargeback adjustments, where applicable.</p>
        </div>
        <dl className="pla-record-totals">
          <div><dt>Payment amount</dt><dd>{amount(serviceExample.amountCents)}</dd></div>
          <div><dt>Processing fee<span>{productFacts.payments.cardRateLabel}</span></dt><dd>−{amount(serviceExample.processingFeeCents)}</dd></div>
          <div className="pla-record-net"><dt>After card processing</dt><dd>{amount(serviceExample.netAmountCents)}</dd></div>
        </dl>
      </div>
    </div>
    <figcaption>Excludes other fees and adjustments.<br />Bank deposit is confirmed separately.</figcaption>
  </figure>;
}

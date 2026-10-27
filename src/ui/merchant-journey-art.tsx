import { CommerceProductArt } from "./commerce-product-art";
import { productFacts } from "@/shared/product-facts";
import { serviceExample } from "@/modules/public-site/service-model";
import { PaymentArtworkHeader } from "./payment-artwork-header";
import { Icon } from "./icon";
import "./merchant-journey-art.css";

function amount(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: serviceExample.currency }).format(cents / 100);
}

/** A storefront thumbnail identifies the sales channel, not a particular purchase. */
function EcommerceStorefrontArt() {
  return <div className="onboarding-storefront" aria-hidden="true">
    <svg viewBox="0 0 320 196" fill="none">
      <path d="M0 28H320" stroke="#d8e2dc" />
      <circle cx="15" cy="14" r="2.5" fill="#b6c9c1" /><circle cx="25" cy="14" r="2.5" fill="#b6c9c1" /><circle cx="35" cy="14" r="2.5" fill="#b6c9c1" />
      <rect x="66" y="7" width="188" height="14" rx="4" fill="#f1f5f2" />
      <text x="160" y="17" textAnchor="middle" fill="#52676a" fontSize="9">Online store</text>
      <text x="16" y="49" fill="#023941" fontSize="12" fontWeight="600">Your business</text>
      <text x="239" y="49" fill="#52676a" fontSize="9">Shop</text>
      <path d="M285 42h10l1 10h-12l1-10Zm2 0v-2a3 3 0 0 1 6 0v2" stroke="#023941" strokeWidth="1.2" strokeLinejoin="round" />
      <rect x="12" y="61" width="296" height="67" rx="5" fill="#edf2ed" />
      <text x="26" y="87" fill="#023941" fontSize="16" fontWeight="500">Everyday essentials.</text>
      <text x="26" y="109" fill="#52676a" fontSize="9">Explore the collection</text>
      <path d="M136 106h10m-3-3 3 3-3 3" stroke="#023941" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m253 73-14 7 6 12 8-4v27h28V88l8 4 6-12-14-7-9 4-9-4Z" fill="#fff" stroke="#b8cbc3" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M263 74c1 7 8 7 10 0M253 88V81m28 7V81M255 112h24" stroke="#cbd8d0" strokeWidth="1.2" />
      <rect x="12" y="140" width="90" height="43" rx="4" fill="#f4f4f0" />
      <rect x="115" y="140" width="90" height="43" rx="4" fill="#eef3f1" />
      <rect x="218" y="140" width="90" height="43" rx="4" fill="#f4f4f0" />
      <path d="M46 155h22l2 21H44l2-21Z" fill="#d5ddd1" stroke="#81968a" strokeWidth="1.1" strokeLinejoin="round" /><path d="M51 156v-4a6 6 0 0 1 12 0v4" stroke="#81968a" strokeWidth="1.2" />
      <path d="M147 166c0-10 5-15 13-15s13 5 13 15h-26Z" fill="#023941" /><path d="M143 167h34c-2 5-25 6-34 0Z" fill="#315d60" /><path d="M159 152c-4 5-4 9-4 14" stroke="#83a49b" strokeWidth="1.1" />
      <rect x="259" y="146" width="8" height="32" rx="3" fill="#d8caba" /><rect x="254" y="153" width="18" height="18" rx="5" fill="#fff" stroke="#9bada5" strokeWidth="1.1" /><path d="M263 157v5l4 2" stroke="#023941" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  </div>;
}

/** Read-only application specimen. Submitted information is not an approval. */
export function MerchantOnboardingArt() {
  return <div className="merchant-journey-art onboarding-art">
    <div className="mja-window payment-artwork-surface">
      <PaymentArtworkHeader caption="Merchant application" icon="document" />
      <div className="onboarding-workspace">
        <div className="onboarding-sidebar"><p className="mja-small-heading">Your application</p><ol className="onboarding-checklist">
          {[["Business", "Submitted"], ["Ownership", "Submitted"], ["Bank account", "Submitted"], ["Review", "In progress"]].map(([title, status], index) => <li key={title} className={index === 3 ? "onboarding-step-current" : ""}><span className="onboarding-step-mark" aria-hidden="true">{index === 3 ? "4" : <Icon name="check" />}</span><div><strong>{title}</strong><span>{status}</span></div></li>)}
        </ol></div>
        <div className="onboarding-content">
          <div className="mja-content-heading"><h4>Application summary</h4><span className="mja-status"><span aria-hidden="true" />In review</span></div>
          <section className="onboarding-business" aria-label="Business information required for an application">
            <div className="onboarding-profile"><EcommerceStorefrontArt /><div className="onboarding-profile-copy"><p>Business profile</p><h5>{serviceExample.business}</h5><span>Ecommerce retailer</span></div></div>
            <dl className="onboarding-fields"><div><dt>Business location</dt><dd>United States</dd></div><div><dt>Sales channel</dt><dd>Ecommerce website</dd></div></dl>
          </section>
          <div className="onboarding-submissions"><div><Icon name="person" /><div><h5>Owners and representative</h5><p>Submitted for review</p></div></div><div><Icon name="bank" /><div><h5>Bank account</h5><p>Submitted for verification</p></div></div></div>
          <div className="onboarding-next"><span className="onboarding-next-icon"><Icon name="document" /></span><div><h5>What happens next</h5><p>Your application is reviewed. If more information is needed, you’ll be asked to provide it. Account setup follows approval.</p></div></div>
        </div>
      </div>
    </div>
    <p className="mja-art-note">Eligibility and account approval apply.</p>
  </div>;
}

/** Statement specimen: net proceeds and confirmed bank receipt are separate. */
export function MerchantPayoutArt() {
  return <div className="merchant-journey-art payout-art">
    <div className="mja-window payment-artwork-surface">
      <PaymentArtworkHeader caption="Payout summary" icon="bank" />
      <div className="payout-workspace">
        <div className="payout-statement">
          <div className="payout-statement-heading"><div><p className="mja-small-heading">After card processing</p><p className="payout-net-amount">{amount(serviceExample.netAmountCents)}<span>{serviceExample.currency}</span></p></div><span className="payout-bank-icon"><Icon name="bank" /></span></div>
          <p className="payout-scope">One domestic online card payment</p>
          <dl className="payout-totals"><div><dt>Customer payment</dt><dd>{amount(serviceExample.amountCents)}</dd></div><div><dt>Processing fee <span>{productFacts.payments.cardRateLabel}</span></dt><dd>−{amount(serviceExample.processingFeeCents)}</dd></div></dl>
          <div className="payout-transaction"><p className="mja-small-heading">Included payment</p><div className="payout-transaction-line"><span className="commerce-product-thumbnail"><CommerceProductArt /></span><div><strong>{serviceExample.description}</strong><span>Order {serviceExample.orderReference}</span></div><strong className="payout-transaction-amount">{amount(serviceExample.amountCents)}</strong></div></div>
          <p className="payout-adjustments">Calculation excludes optional services, refunds, reserves and other adjustments.</p>
        </div>
        <aside className="payout-deposit" aria-label="Bank receipt is a separate confirmation">
          <p className="mja-small-heading">To your bank</p><h4>Track your payout.</h4>
          <ol className="payout-trail">
            <li className="payout-trail-complete"><span className="payout-trail-mark" aria-hidden="true"><Icon name="check" /></span><div><strong>Capture</strong><span>Payment recorded against {serviceExample.orderReference}.</span></div></li>
            <li><span className="payout-trail-mark" aria-hidden="true">2</span><div><strong>Settlement</strong><span>Funds move between the issuing and acquiring sides.</span></div></li>
            <li><span className="payout-trail-mark" aria-hidden="true">3</span><div><strong>Payout calculation</strong><span>Match payments, fees and adjustments to the payout.</span></div></li>
            <li><span className="payout-trail-mark" aria-hidden="true">4</span><div><strong>Bank deposit</strong><span>Confirm the deposit against your bank statement.</span></div></li>
          </ol>
          <div className="payout-receipt-note"><Icon name="bank" /><p>Bank receipt is a separate confirmation.</p></div>
          <details><summary>How to check a deposit</summary><p>Compare the merchant’s deposit record with the relevant bank entry, including fees and adjustments. Your account’s funding terms apply.</p></details>
        </aside>
      </div>
    </div>
  </div>;
}

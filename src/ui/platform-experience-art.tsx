import { Icon } from "./icon";
import { NetworkMark } from "./network-brands";
import { CommerceProductArt } from "./commerce-product-art";
import { serviceExample } from "@/modules/public-site/service-model";

/** Static invoice and checkout composition. No inputs, customer data or payment action. */
export function PlatformPaymentArt() {
  return <figure className="platform-payment-art" aria-labelledby="platform-payment-caption">
    <div className="platform-art-stage" role="img" aria-label="Freight invoice INV 08421 for shipment FT 02854, with an amount due of 1,240 dollars and a card checkout. The invoice reference connects the payment to reconciliation."><div aria-hidden="true">
      <div className="platform-payment-window">
        <div className="platform-payment-toolbar"><span className="platform-payment-emblem"><Icon name="box" /></span><span>Freight payments</span><span className="platform-payment-context">Invoice payment</span></div>
        <div className="platform-payment-body">
          <div className="platform-invoice">
            <p className="platform-art-label">Shipment invoice</p><p className="platform-art-heading">Freight services</p>
            <dl className="platform-invoice-details"><div><dt>Invoice reference</dt><dd>INV 08421</dd></div><div><dt>Shipment reference</dt><dd>FT 02854</dd></div><div><dt>Service</dt><dd>Domestic freight</dd></div></dl>
            <dl className="platform-invoice-total"><dt>Amount due</dt><dd>$1,240.00<span>USD</span></dd></dl>
          </div>
          <div className="platform-checkout">
            <p className="platform-art-heading">Payment details</p>
            <div className="platform-checkout-method"><Icon name="card" /><span>Credit or debit card</span><NetworkMark network="visa" decorative /></div>
            <dl className="platform-checkout-fields">
              <div className="platform-checkout-field-wide"><dt>Card number</dt><dd><span>•••• •••• •••• ••••</span><Icon name="card" /></dd></div>
              <div><dt>Expiry date</dt><dd>MM / YY</dd></div><div><dt>Security code</dt><dd><span>•••</span></dd></div>
              <div className="platform-checkout-field-wide"><dt>Name on card</dt><dd>Full name</dd></div>
            </dl>
            <div className="platform-checkout-action"><Icon name="lock" /><span>Review payment</span><Icon name="arrow" /></div>
          </div>
        </div>
        <div className="platform-payment-footer"><strong>One invoice reference.</strong><span>From payment to reconciliation.</span></div>
      </div>
    </div>
    </div><figcaption id="platform-payment-caption">Business context stays with the payment.</figcaption>
  </figure>;
}


type PlatformIndustry = "commerce-marketplaces" | "freight-platforms" | "travel-platforms" | "legal-software";

const artDescriptions: Record<PlatformIndustry, string> = {
  "commerce-marketplaces": "Marketplace order and linked payment record. Order 10482 contains one Designer sneaker from Studio Store for 100 US dollars. The payment is captured, with no refunds recorded. The seller and order reference stay together; capture does not mean a seller payout has arrived.",
  "freight-platforms": "Freight invoice and payment allocation. Invoice INV 08421 for shipment FT 02854 totals 1,240 dollars, made up of 1,100 dollars in transportation and a 140 dollar fuel charge. The allocation identifies the same invoice and shipment.",
  "travel-platforms": "Travel planning record and fee invoice. Trip TR 0428 is a Lisbon and Porto itinerary. Its separate 250 dollar planning fee is payable to the travel advisor, not a payment for the trip itself.",
  "legal-software": "Matter invoice and receiving account. Matter MT 0084 has an invoice of 1,850 dollars for earned professional fees. The receiving account is an operating account, not a trust account.",
};

function RecordHeading({ icon, title, reference }: { icon: string; title: string; reference: string }) {
  return <div className="industry-window-heading"><span className="industry-window-symbol"><Icon name={icon} /></span><strong>{title}</strong><span className="industry-window-reference">{reference}</span></div>;
}

/** Original static product compositions. The records are fictional; no controls or live payment action. */
export function PlatformIndustryArt({ industry }: { industry: PlatformIndustry }) {
  return <figure className={`industry-product-art industry-product-art--${industry}`} role="img" aria-label={artDescriptions[industry]}><div className="industry-product-scene" aria-hidden="true">
    {industry === "commerce-marketplaces" && <>
      <div className="industry-marketplace-window">
        <RecordHeading icon="business" title="Marketplace order" reference={serviceExample.orderReference} />
        <div className="industry-marketplace-seller"><span className="industry-seller-monogram">S</span><div><span className="industry-art-kicker">Sold by</span><strong>Studio Store</strong></div><span className="industry-marketplace-category">Footwear</span></div>
        <div className="industry-marketplace-item"><span className="industry-marketplace-product"><CommerceProductArt /></span><div><strong>{serviceExample.description}</strong><span>Chalk / Teal · 1 pair</span></div></div>
        <div className="industry-marketplace-total"><span>Order total</span><strong>$100.00 <span>USD</span></strong></div>
      </div>
      <div className="industry-marketplace-payment"><div className="industry-marketplace-payment-heading"><span><Icon name="link" />Payment record</span><span>{serviceExample.orderReference}</span></div><div className="industry-marketplace-payment-values"><div><span>Card payment</span><strong>Captured</strong></div><div><span>Refunds</span><strong>$0.00</strong></div></div></div>
    </>}
    {industry === "freight-platforms" && <>
      <div className="industry-freight-window">
        <RecordHeading icon="box" title="Freight invoice" reference="INV 08421" />
        <div className="industry-freight-route"><div><span>Origin</span><strong>Los Angeles</strong></div><div className="industry-route-line"><i /><span /><Icon name="arrow" /></div><div><span>Destination</span><strong>Phoenix</strong></div></div>
        <div className="industry-freight-charges"><div><span>Transportation</span><strong>$1,100.00</strong></div><div><span>Fuel charge</span><strong>$140.00</strong></div></div>
      </div>
      <div className="industry-shipment-reference"><div className="industry-allocation-heading"><Icon name="link" /><strong>Payment allocation</strong></div><div className="industry-allocation-fields"><div><span>Invoice</span><strong>INV 08421</strong></div><div><span>Shipment</span><strong>FT 02854</strong></div><div><span>Amount</span><strong>$1,240.00</strong></div></div></div>
    </>}
    {industry === "travel-platforms" && <>
      <div className="industry-booking-window">
        <div className="industry-travel-map"><svg viewBox="0 0 460 170" preserveAspectRatio="xMidYMid slice" fill="none"><path d="M0 0h460v170H0z" fill="#e9e9dc"/><path d="M225-20c-66 36-13 70-81 100S60 132 67 190H490V-20Z" fill="#f6f5ec"/><path d="M225-20c-66 36-13 70-81 100S60 132 67 190M277-20c-66 36-13 70-81 100S112 132 119 190M329-20c-66 36-13 70-81 100S164 132 171 190M381-20c-66 36-13 70-81 100S216 132 223 190M433-20c-66 36-13 70-81 100S268 132 275 190" stroke="#d6dbca"/><path d="M121 133c33-58 132 3 205-73" stroke="#5e7c62" strokeWidth="2" strokeDasharray="3 5"/><circle cx="121" cy="133" r="6" fill="#fff" stroke="#486b50" strokeWidth="2"/><circle cx="326" cy="60" r="7" fill="#486b50" stroke="#fff" strokeWidth="3"/></svg><span className="industry-trip-label"><Icon name="layers" />Trip TR 0428</span></div>
        <div className="industry-booking-body"><span className="industry-art-kicker">Custom itinerary</span><strong>Lisbon &amp; Porto</strong></div>
      </div>
      <div className="industry-travel-payment"><span className="industry-art-kicker">Planning fee</span><strong>$250.00</strong><div className="industry-travel-reference"><span>Payable to</span><strong>Travel advisor</strong></div></div>
    </>}
    {industry === "legal-software" && <>
      <div className="industry-matter-folder"><div /><div /><div /></div>
      <div className="industry-matter-window">
        <RecordHeading icon="document" title="Matter invoice" reference="MT 0084" />
        <div className="industry-matter-body"><span className="industry-art-kicker">Invoice INV 0348</span><strong>Professional fees</strong><div className="industry-matter-amount">$1,850<span>.00</span></div><div className="industry-matter-invoice"><span>Payment purpose</span><strong>Earned fees</strong></div></div>
        <div className="industry-matter-account"><Icon name="bank" /><div><span>Receiving account</span><strong>Operating account</strong></div></div>
      </div>
    </>}
  </div></figure>;
}

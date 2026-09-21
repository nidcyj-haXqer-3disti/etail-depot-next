"use client";

import { useId, useRef, useState } from "react";
import { saleRecordsOffer } from "@/shared/product-facts";
import { paymentExamples, type PaymentExamplePurpose } from "@/modules/public-site/payment-examples";
import { estimateDomesticCardFee, formatUsdCents } from "@/modules/public-site/fee-estimate";
import { PaymentOffer } from "./payment-offer";
import { usePaymentExample } from "./payment-example-context";
import { PaymentChannelPreview } from "./payment-channel-preview";
import { DisputeReadinessArt } from "./dispute-readiness-art";
import { Icon } from "./icon";
import "./payment-experience.css";

const saleTypes = Object.keys(paymentExamples) as PaymentExamplePurpose[];
const typeDescriptions = { goods: "Products & orders", services: "Projects & appointments", information: "Research & insights" } as const;

function SaleThumbnail({type}: {type: PaymentExamplePurpose}) {
  return <span className="sale-thumbnail" data-sale={type} aria-hidden="true">
    {type === "goods" ? <><span className="sale-parcel"><i /></span><span className="sale-bag"><i /></span></>
      : type === "services" ? <span className="sale-calendar"><i /><span><b /><b /><b /><b /><b /><b /></span><Icon name="person" /></span>
      : <span className="sale-report"><i /><i /><span><b /><b /><b /><b /></span><em /></span>}
  </span>;
}
const serviceExample = estimateDomesticCardFee("100", true)!;

export function PaymentExperience() {
  const [saleRecords, setSaleRecords] = useState(false);
  const { purpose, setPurpose } = usePaymentExample();
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const example = paymentExamples[purpose];

  return <div className="payment-experience">
    <section className="page-container consumer-product-section payment-sharing" id="payment-channels" aria-labelledby="payment-channels-title">
      <div className="consumer-section-heading"><div><p className="eyebrow">Built around your business</p><h2 id="payment-channels-title">One payment link.<br /><span>More ways to get paid.</span></h2></div><p>Share one payment link by text, email, social, QR code or your website.</p></div>
      <div className="sale-type-tabs" role="tablist" aria-label="What you sell">
        {saleTypes.map((type, index) => <button key={type} type="button" role="tab" id={`${id}-${type}`} aria-label={paymentExamples[type].name} aria-selected={purpose === type} aria-controls={`${id}-sale`} tabIndex={purpose === type ? 0 : -1} ref={element => {tabs.current[index] = element;}} onClick={() => setPurpose(type)} onKeyDown={event => {
          let next = index;
          if (event.key === "ArrowRight") next = (index + 1) % saleTypes.length;
          else if (event.key === "ArrowLeft") next = (index + saleTypes.length - 1) % saleTypes.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = saleTypes.length - 1;
          else return;
          event.preventDefault(); setPurpose(saleTypes[next]!); tabs.current[next]?.focus();
        }}><SaleThumbnail type={type} /><span className="sale-choice-caption"><strong>{paymentExamples[type].name}</strong><small>{typeDescriptions[type]}</small></span><span className="sale-choice-check" aria-hidden="true"><Icon name="check" /></span></button>)}
      </div>
      <div className="sale-type-panel" role="tabpanel" id={`${id}-sale`} aria-labelledby={`${id}-${purpose}`} tabIndex={0}>
        <p className="payment-use-case">{example.benefit}</p>
        <PaymentChannelPreview purpose={purpose} />
      </div>
    </section>

    <section className="dispute-readiness-section" id="dispute-readiness" aria-labelledby="dispute-readiness-title">
      <span id="sale-records" className="payment-anchor" aria-hidden="true" />
      <div className="page-container">
        <div className="dispute-readiness-heading">
          <div><p className="eyebrow">Trolleys · Dispute readiness</p><h2 id="dispute-readiness-title">Make your sale clear.<br /><span>Before doubt becomes<br className="dispute-heading-break" /> a dispute.</span></h2><p className="dispute-introduction">A charge shows an amount. Order Insight helps show the purchase behind it—connecting your sale details to participating banks when a customer has questions.</p></div>
          <div className="dispute-price"><span>Optional service</span><strong>+{saleRecordsOffer.rateLabel}</strong><p>{saleRecordsOffer.feeBasis}.</p><div className="dispute-price-example"><strong>{formatUsdCents(serviceExample.serviceCents)}</strong><span>Trolleys fee on a {formatUsdCents(serviceExample.amountCents)} payment</span></div><p className="dispute-price-extra">Payment processing is separate</p><a href="#fees">Estimate your fees<Icon name="arrow" /></a></div>
        </div>
        <DisputeReadinessArt purpose={purpose} />
        <ul className="dispute-benefits">
          <li><span><Icon name="business" /></span><div><h3>Help customers remember.</h3><p>Help customers recognize your business and their purchase when reviewing a charge at a participating bank.</p></div></li>
          <li><span><Icon name="bank" /></span><div><h3>Give the bank more context.</h3><p>Make merchant, transaction and purchase details available through Order Insight to help answer payment inquiries.</p></div></li>
          <li><span><Icon name="shield" /></span><div><h3>Get ahead of eligible fraud disputes.</h3><p>Qualifying Visa online fraud disputes may be deflected before a chargeback with the required transaction history and evidence.</p></div></li>
        </ul>
        <div className="dispute-service-note"><p>Available for eligible enrolled payments. Coverage depends on the transaction, participating bank and available data; dispute outcomes are not guaranteed.</p><a href="https://www.visa.com/en-us/products/order-insight" target="_blank" rel="noopener noreferrer">Explore Order Insight at Visa<Icon name="arrow" /></a></div>
      </div>
    </section>
    <PaymentOffer saleRecords={saleRecords} onSaleRecordsChange={setSaleRecords} />
  </div>;
}

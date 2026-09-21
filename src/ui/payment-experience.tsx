"use client";

import { useId, useRef, useState } from "react";
import { saleRecordsOffer } from "@/shared/product-facts";
import { paymentExamples, type PaymentExamplePurpose } from "@/modules/public-site/payment-examples";
import { PaymentOffer } from "./payment-offer";
import { usePaymentExample } from "./payment-example-context";
import { PaymentChannelPreview } from "./payment-channel-preview";
import { DisputeReadinessArt } from "./dispute-readiness-art";
import { Icon } from "./icon";
import "./payment-experience.css";

const saleTypes = Object.keys(paymentExamples) as PaymentExamplePurpose[];
const typeIcons = { goods: "box", services: "person", information: "insight" } as const;

export function PaymentExperience() {
  const [saleRecords, setSaleRecords] = useState(false);
  const { purpose, setPurpose } = usePaymentExample();
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const example = paymentExamples[purpose];

  return <div className="payment-experience">
    <section className="page-container consumer-product-section payment-sharing" id="payment-channels" aria-labelledby="payment-channels-title">
      <div className="consumer-section-heading"><div><p className="eyebrow">Meet customers where they are</p><h2 id="payment-channels-title">One payment link.<br /><span>So many possibilities.</span></h2></div><p>Send a text. Share a QR code. Add a button to your website. Make paying a natural next step for your customer.</p></div>
      <div className="sale-type-tabs" role="tablist" aria-label="What you sell">
        {saleTypes.map((type, index) => <button key={type} type="button" role="tab" id={`${id}-${type}`} aria-selected={purpose === type} aria-controls={`${id}-sale`} tabIndex={purpose === type ? 0 : -1} ref={element => {tabs.current[index] = element;}} onClick={() => setPurpose(type)} onKeyDown={event => {
          let next = index;
          if (event.key === "ArrowRight") next = (index + 1) % saleTypes.length;
          else if (event.key === "ArrowLeft") next = (index + saleTypes.length - 1) % saleTypes.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = saleTypes.length - 1;
          else return;
          event.preventDefault(); setPurpose(saleTypes[next]!); tabs.current[next]?.focus();
        }}><Icon name={typeIcons[type]} /><span>{paymentExamples[type].name}</span></button>)}
      </div>
      <div className="sale-type-panel" role="tabpanel" id={`${id}-sale`} aria-labelledby={`${id}-${purpose}`} tabIndex={0}>
        <div className="payment-use-case"><h3>{example.headline}</h3><p>{example.benefit}</p></div>
        <PaymentChannelPreview purpose={purpose} />
      </div>
    </section>

    <section className="dispute-readiness-section" id="dispute-readiness" aria-labelledby="dispute-readiness-title">
      <span id="sale-records" className="payment-anchor" aria-hidden="true" />
      <div className="page-container">
        <div className="dispute-readiness-heading"><div><p className="eyebrow">Trolleys · Dispute readiness</p><h2 id="dispute-readiness-title">Be ready when<br /><span>a payment is questioned.</span></h2></div><div className="dispute-price"><span>Optional service</span><strong>+{saleRecordsOffer.rateLabel}</strong><p>of eligible enrolled successful payments<br />Plus vendor fees and processing</p><a href="#fees">See pricing<Icon name="arrow" /></a></div></div>
        <div className="dispute-readiness-grid">
          <div className="dispute-value"><p className="dispute-intro">Give every payment a clearer story. With Order Insight, Trolleys connects purchase details to participating banks—helping customers recognize charges and reducing avoidable confusion.</p>
            <ul className="dispute-benefits">
              <li><span><Icon name="business" /></span><div><h3>Make your business recognizable.</h3><p>Help customers connect the charge to what they bought, with useful details in supported banking experiences.</p></div></li>
              <li><span><Icon name="bank" /></span><div><h3>Give the bank a clearer picture.</h3><p>Put enhanced merchant, transaction and purchase information within reach of the bank’s support team.</p></div></li>
              <li><span><Icon name="shield" /></span><div><h3>Help prevent eligible fraud disputes.</h3><p>Qualifying Visa online fraud disputes can be deflected before a chargeback when the required transaction history and evidence are available.</p></div></li>
            </ul>
          </div>
          <DisputeReadinessArt purpose={purpose} />
        </div>
        <div className="dispute-service-note"><p>Available for eligible enrolled payments. Coverage depends on the transaction, participating bank and available data; dispute outcomes are not guaranteed.</p><a href="https://www.visa.com/en-us/products/order-insight" target="_blank" rel="noopener noreferrer">Explore Order Insight at Visa<Icon name="arrow" /></a></div>
      </div>
    </section>
    <PaymentOffer saleRecords={saleRecords} onSaleRecordsChange={setSaleRecords} />
  </div>;
}

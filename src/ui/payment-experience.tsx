"use client";

import { useState } from "react";
import { saleRecordsOffer } from "@/shared/product-facts";
import { PaymentOffer } from "./payment-offer";
import { usePaymentExample } from "./payment-example-context";
import { DisputeReadinessArt } from "./dispute-readiness-art";
import { Icon } from "./icon";
import "./payment-experience.css";

export function PaymentExperience() {
  const [saleRecords, setSaleRecords] = useState(false);
  const { purpose } = usePaymentExample();
  return <div className="payment-experience">
    <section className="dispute-readiness-section" id="dispute-readiness" aria-labelledby="dispute-readiness-title">
      <span id="sale-records" className="payment-anchor" aria-hidden="true" />
      <div className="page-container">
        <div className="dispute-readiness-heading">
          <div><p className="dispute-product-name"><Icon name="layers" />{saleRecordsOffer.brandName}</p><h2 id="dispute-readiness-title">After the payment,<br /><span>keep the story clear.</span></h2></div>
          <div className="dispute-intro-details"><p className="dispute-introduction">Help customers recognize what they paid for. Clarity connects purchase details to participating banks through Order Insight, helping answer questions before they become disputes.</p><div className="dispute-price"><span>Optional service</span><strong>+{saleRecordsOffer.rateLabel}</strong><p>{saleRecordsOffer.feeBasis}.</p></div></div>
        </div>
        <DisputeReadinessArt purpose={purpose} />
        <ul className="dispute-benefits">
          <li><span><Icon name="business" /></span><div><h3>Make purchases familiar.</h3><p>Help customers recognize your business and their purchase when reviewing a charge at a participating bank.</p></div></li>
          <li><span><Icon name="bank" /></span><div><h3>Answer with the details.</h3><p>Make merchant, transaction and purchase details available through Order Insight to help answer payment inquiries.</p></div></li>
          <li><span><Icon name="shield" /></span><div><h3>Get ahead of eligible fraud disputes.</h3><p>Qualifying Visa online fraud disputes may be deflected before a chargeback with the required transaction history and evidence.</p></div></li>
        </ul>
        <div className="dispute-service-note"><p>Available for eligible enrolled payments. Coverage depends on the transaction, participating bank and available data; dispute outcomes are not guaranteed.</p><a href="https://www.visa.com/en-us/products/order-insight" target="_blank" rel="noopener noreferrer">Explore Order Insight at Visa<Icon name="arrow" /></a></div>
      </div>
    </section>
    <PaymentOffer saleRecords={saleRecords} onSaleRecordsChange={setSaleRecords} />
  </div>;
}

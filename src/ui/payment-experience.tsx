"use client";

import { useState } from "react";
import Link from "next/link";
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
    <PaymentOffer saleRecords={saleRecords} onSaleRecordsChange={setSaleRecords} />
    <section className="dispute-readiness-section" id="dispute-readiness" aria-labelledby="dispute-readiness-title">
      <span id="sale-records" className="payment-anchor" aria-hidden="true" />
      <div className="page-container">
        <div className="dispute-readiness-heading">
          <div><p className="dispute-product-name"><Icon name="layers" />{saleRecordsOffer.brandName}</p><h2 id="dispute-readiness-title">Help prevent<br /><span>chargebacks.</span></h2></div>
          <div className="dispute-intro-details"><p className="dispute-introduction">Help customers recognize a charge before they dispute it. Clarity uses Order Insight to share purchase details with participating banks and help prevent eligible Visa online fraud disputes.</p><div className="dispute-price"><span>Optional service</span><strong>+{saleRecordsOffer.rateLabel}</strong><p>{saleRecordsOffer.feeBasis}.</p></div></div>
        </div>
        <DisputeReadinessArt purpose={purpose} />
        <ul className="dispute-benefits">
          <li><span><Icon name="business" /></span><div><h3>Help customers recognize charges.</h3><p>Help customers recognize your business and their purchase when reviewing a charge at a participating bank.</p></div></li>
          <li><span><Icon name="bank" /></span><div><h3>Give banks purchase details.</h3><p>Make merchant, transaction and purchase details available through Order Insight to help answer payment inquiries.</p></div></li>
          <li><span><Icon name="shield" /></span><div><h3>Help prevent eligible fraud disputes.</h3><p>Eligible Visa online fraud disputes may be stopped before they become chargebacks, provided the payment history and evidence meet the requirements.</p></div></li>
        </ul>
        <div className="dispute-service-note"><p>Available for eligible payments enrolled in Clarity. Coverage depends on the payment, whether the bank participates and the information available. No dispute outcome is guaranteed. <Link href="/guides/what-is-a-chargeback">Understand chargebacks and how to respond</Link>.</p><a href="https://www.visa.com/en-us/products/order-insight" target="_blank" rel="noopener noreferrer">Explore Order Insight at Visa<Icon name="arrow" /></a></div>
      </div>
    </section>
  </div>;
}

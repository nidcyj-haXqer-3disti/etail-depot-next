"use client";

import { useState } from "react";
import { estimateDomesticCardFee, formatUsdCents } from "@/modules/public-site/fee-estimate";
import { productFacts, saleRecordsOffer } from "@/shared/product-facts";

export function PaymentFeeEstimate({saleRecords, onSaleRecordsChange}: {saleRecords: boolean; onSaleRecordsChange: (enabled: boolean) => void}) {
  const [amount, setAmount] = useState("100");
  const estimate = estimateDomesticCardFee(amount, saleRecords);
  return <div className="fee-estimate" aria-labelledby="fee-estimate-title">
    <h3 id="fee-estimate-title">Estimate your fees.</h3>
    <label className="fee-input-label" htmlFor="payment-amount">Payment amount <span>USD</span></label>
    <div className="fee-input"><span aria-hidden="true">$</span><input id="payment-amount" type="text" inputMode="decimal" autoComplete="off" value={amount} onChange={event => setAmount(event.target.value)} maxLength={9} aria-describedby={estimate ? "fee-estimate-note" : "fee-estimate-error fee-estimate-note"} aria-invalid={!estimate} /></div>
    <fieldset className="fee-service-option"><legend>Optional service</legend>
      <label className="fee-checkbox"><input id="addon-sale-records" type="checkbox" checked={saleRecords} onChange={event => onSaleRecordsChange(event.target.checked)} aria-describedby="sale-records-estimate-price" />{saleRecordsOffer.name}</label>
      <p className="fee-estimate-note" id="sale-records-estimate-price">{saleRecordsOffer.rateLabel} {saleRecordsOffer.feeBasis}. Payment processing is separate.</p>
    </fieldset>
    <div className="fee-result" aria-live="polite" aria-atomic="true">
      {estimate ? <dl>
        <div><dt>{productFacts.payments.offerName}</dt><dd>−{formatUsdCents(estimate.processingCents)}</dd></div>
        {saleRecords && <div><dt>{saleRecordsOffer.name}</dt><dd>−{formatUsdCents(estimate.serviceCents)}</dd></div>}
        <div className="fee-net"><dt>Estimated remaining</dt><dd>{formatUsdCents(estimate.subtotalCents)}</dd></div>
      </dl> : <p className="fee-error" id="fee-estimate-error">Enter an amount from $1 to $100,000, with up to two decimal places.</p>}
    </div>
    <p className="fee-estimate-note" id="fee-estimate-note">Estimate excludes international, conversion, manual entry and other applicable charges. Selecting this example does not enroll you or charge a fee.</p>
  </div>;
}

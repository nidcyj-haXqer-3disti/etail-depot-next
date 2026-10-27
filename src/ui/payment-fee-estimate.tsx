"use client";

import { useState } from "react";
import { useClientReady } from "./use-client-ready";
import { estimateDomesticCardFee, formatUsdCents } from "@/modules/public-site/fee-estimate";
import { productFacts } from "@/shared/product-facts";

export function PaymentFeeEstimate() {
  const ready = useClientReady();
  const [amount, setAmount] = useState("100");
  const [composing, setComposing] = useState(false);
  const estimate = composing ? null : estimateDomesticCardFee(amount);
  const percentage = productFacts.payments.cardRateBasisPoints / 100;

  return <section className="fee-estimate" aria-labelledby="fee-estimate-title">
    <h3 id="fee-estimate-title">Calculate your processing fee.</h3>
    <label className="fee-input-label" htmlFor="payment-amount">Payment amount <span>USD</span></label>
    <div className="fee-input"><span aria-hidden="true">$</span><input id="payment-amount" disabled={!ready} type="text" inputMode="decimal" autoComplete="off" value={amount} onChange={event => setAmount(event.target.value)}
      onCompositionStart={() => setComposing(true)}
      onCompositionEnd={event => { setAmount(event.currentTarget.value); setComposing(false); }}
      aria-describedby={composing ? "fee-estimate-pending fee-estimate-note" : estimate ? "fee-estimate-note" : "fee-estimate-error fee-estimate-note"}
      aria-invalid={!composing && !estimate} /></div>
    <div className="fee-result" aria-live="polite" aria-atomic="true" aria-busy={composing}>
      {composing ? <p id="fee-estimate-pending">Finish entering the amount to calculate the fee.</p> : estimate ? <dl>
        <div className="fee-percentage"><dt>{percentage}% of the payment</dt><dd>{formatUsdCents(estimate.percentageCents)}</dd></div>
        <div><dt>Fixed fee</dt><dd>{formatUsdCents(estimate.fixedCents)}</dd></div>
        <div className="fee-total"><dt>Processing fee</dt><dd>{formatUsdCents(estimate.processingCents)}</dd></div>
        <div className="fee-net"><dt>After card processing</dt><dd>{formatUsdCents(estimate.subtotalCents)}</dd></div>
      </dl> : <p className="fee-error" id="fee-estimate-error">Enter an amount from $1 to $100,000, with up to two decimal places. Leave out currency symbols and commas.</p>}
    </div>
    <p className="fee-estimate-note" id="fee-estimate-note">For one domestic online card payment. Excludes international cards, currency conversion, payments entered by the merchant and other applicable charges. This is not a guaranteed payout.</p>
  </section>;
}

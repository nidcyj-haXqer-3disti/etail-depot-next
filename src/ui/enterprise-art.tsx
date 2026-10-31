import { AccountProfileArt } from "./service-workflow-art";

export function AccountSetupArt() {
  return <AccountProfileArt />;
}

export function PayoutRecordArt() {
  return <figure className="ec-reconciliation-art" aria-label="Card payment summary: 100 dollars less a 3 dollar 20 cent processing fee, before other fees and adjustments. Bank deposit is confirmed separately." role="img"><div aria-hidden="true" className="ec-report-paper"><div className="ec-report-top"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3ZM9 7h6M9 11h6M9 15h3"></path></svg>Payment breakdown</span><span>Order #10482</span></div><div className="ec-record-line"><span>Card payment</span><strong>$100.00</strong></div><div className="ec-record-line"><span>Processing fee</span><strong>$3.20</strong></div><div className="ec-record-line ec-report-total"><span>After card processing</span><strong>$96.80</strong></div><p className="ec-record-caption">2.9% + 30¢. Before other fees and adjustments.</p></div><div aria-hidden="true" className="ec-reconcile-band"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 8 9-5 9 5H3Zm2 3v7m5-7v7m4-7v7m5-7v7M3 21h18"></path></svg><div><strong>Bank deposit</strong><p>Confirm against your bank statement.</p></div><span className="ec-reference-arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"></path></svg></span></div></figure>;
}

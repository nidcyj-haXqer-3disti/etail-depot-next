import { Icon } from "./icon";
import { PlatformRecordArt } from "./service-workflow-art";

export function MerchantOperationsArt() {
  return <figure className="cw-merchant-art" role="img" aria-label="Merchant payment activity diagram for Studio Store: account information, a captured card payment for order 10482, and separate payout reconciliation">
    <div className="cw-workbench" aria-hidden="true"><div className="cw-workbench-heading"><span className="cw-store-mark">S</span><div><strong>Studio Store</strong><span>Merchant account</span></div><small>USD</small></div>
      <div className="cw-workbench-tabs"><span>Account</span><strong>Payments</strong><span>Reports</span></div>
      <div className="cw-payment-focus"><small>Card payment</small><div><strong>$100.00</strong><span className="cw-art-tag">Captured</span></div><p>Order #10482</p></div>
      <dl className="cw-payment-fields"><div><dt>Business</dt><dd>Studio Store</dd></div><div><dt>Purchase</dt><dd>Designer sneaker</dd></div><div><dt>Payment method</dt><dd>Card</dd></div></dl>
      <div className="cw-payment-record-footer"><span>Order reference</span><i /><span>Payment record</span></div>
    </div>
    <div className="cw-merchant-reconcile" aria-hidden="true"><Icon name="bank" className="cw-reconciliation-icon" /><div><strong>Payout reconciliation</strong><span>Match the report to the bank deposit.</span></div></div>
  </figure>;
}

export function PlatformIntegrationArt() {
  return <PlatformRecordArt />;
}

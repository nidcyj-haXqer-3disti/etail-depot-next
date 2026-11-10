import { ServiceArtMotion, ServiceFlowMark } from "../components/service-art-motion";
import { Label } from "@/features/services/shared/artwork-primitives";
import { Icon } from "@/shared/ui/icon";
import shared from "../shared/service-detail.module.css";
import s from "./payout-artwork.module.css";

const sales = [
  { order: "1048", cents: 12800 },
  { order: "1047", cents: 6400 },
  { order: "1046", cents: 24000 },
];
const gross = sales.reduce((total, sale) => total + sale.cents, 0);
// The existing 2.9% + 30 cent offer, rounded for each example card sale.
const fees = sales.reduce((total, sale) => total + Math.round(sale.cents * 290 / 10000) + 30, 0);
const net = gross - fees;
const dollars = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export function PayoutsArt({ title, caption }: { title: string; caption: string }) {
  return <ServiceArtMotion className={shared.art} workflow="payouts" label={title}>
    <div className={`${shared.scene} ${s.scene}`}>
      <div className={s.heading}><Label icon="document">Example payout</Label><span>USD</span></div>
      <div className={s.paper}>
        <div className={s.paperHeading}><strong>Sales included</strong><span>3 card payments</span></div>
        <dl className={s.sales}>{sales.map(sale => <div key={sale.order}><dt>#{sale.order}</dt><dd>{dollars(sale.cents)}</dd></div>)}</dl>
        <dl className={s.calculation}>
          <div><dt>Total sales</dt><dd>{dollars(gross)}</dd></div>
          <div><dt>Processing fees</dt><dd>−{dollars(fees)}</dd></div>
          <div><dt>Other adjustments</dt><dd>$0.00</dd></div>
        </dl>
        <div className={s.total}><div><span>Net payout</span><small>Reference P1048</small></div><strong>{dollars(net)}</strong></div>
      </div>
      <div className={s.connection}><ServiceFlowMark /><span>Matched to the bank credit</span></div>
      <div className={s.bank}>
        <div className={s.bankHeading}><span className={s.bankIcon} data-motion-part="bank-mark"><Icon name="bank" /></span><div><strong>Business checking</strong><span>Account ending 2108</span></div></div>
        <div className={s.bankCredit}><div><span>Card processing deposit</span><small>Reference P1048</small></div><strong>+{dollars(net)}</strong></div>
        <span className={s.posted}><Icon name="check" />Posted by your bank</span>
      </div>
      <p className={s.note}>Example fees: 2.9% + 30¢ per card sale. Other fees and adjustments may apply.</p>
    </div>
    <figcaption>{caption}</figcaption>
  </ServiceArtMotion>;
}

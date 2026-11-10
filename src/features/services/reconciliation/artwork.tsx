import { ServiceArtMotion } from "../components/service-art-motion";
import { Label } from "@/features/services/shared/artwork-primitives";
import { Icon } from "@/shared/ui/icon";
import shared from "../shared/service-detail.module.css";
import s from "./reconciliation-artwork.module.css";

const sales = [
  { method: "Visa", count: 8, amount: "$1,860.00" },
  { method: "Mastercard", count: 4, amount: "$780.00" },
] as const;

export function ReconciliationArt({ title, caption }: { title: string; caption: string }) {
  return <ServiceArtMotion className={shared.art} workflow="reconciliation" label={title}>
    <div className={`${shared.scene} ${s.scene}`}>
      <div className={s.heading}><Label icon="link">Example reports</Label><span>Oct 2026 · USD</span></div>
      <div className={s.comparison}>
        {[
          { account: "Merchant account", report: "Summary Statement Report", icon: "business" },
          { account: "Gateway account", report: "Payment Batch Summary", icon: "card" },
        ].map((record, i) => <div className={`${s.record} ${i === 1 ? s.gateway : ""}`} key={record.account}>
          <div className={s.recordHeading}><Icon name={record.icon} /><strong>{record.account}</strong></div>
          <p className={s.reportName}>{record.report}</p>
          <div className={s.amount}><strong>$2,640.00</strong><span>Gross sales</span></div>
          <div className={s.chart} aria-hidden="true">
            {i === 0 ? <div className={s.donut}><span><strong>12</strong>sales</span></div> : <div className={s.bars}>
              <div><span className={s.visaBar} /><strong>8</strong></div>
              <div><span className={s.mastercardBar} /><strong>4</strong></div>
            </div>}
          </div>
          <dl className={s.details}>
            {sales.map((sale, index) => <div key={sale.method}><dt><span className={s.dot} data-motion-part="match-dot" data-motion-step={index + 1} aria-hidden="true" />{sale.method}<small>{sale.count} sales</small></dt><dd>{sale.amount}</dd></div>)}
            <div className={s.total}><dt>Total sales</dt><dd>12</dd></div>
          </dl>
        </div>)}
      </div>
      <div className={s.match}>
        <div className={s.matchLabel}><span data-motion-part="match-check" aria-hidden="true"><Icon name="check" /></span><strong>Sales totals match</strong></div>
        <div className={s.difference}><span>Difference</span><strong>$0.00</strong></div>
      </div>
    </div>
    <figcaption>{caption}</figcaption>
  </ServiceArtMotion>;
}

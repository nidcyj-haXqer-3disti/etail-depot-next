import { Label, Connector } from "@/features/services/shared/artwork-primitives";

import { Icon } from "../../../shared/ui/icon";

import s from "../shared/service-detail.module.css";

function Record({ label, value }: { label: string; value: string }) {
  return <div className={s.record}><span>{label}</span><strong>{value}</strong></div>;
}

export function PayoutsArt({ title, caption }: { title: string; caption: string }) {
  return <figure className={s.art} data-service-workflow="payouts" aria-label={title}>
    <div className={s.scene}>
<div className={s.sceneHeading}><Label icon="document">Payout breakdown</Label><strong>From activity to deposit.</strong></div>
        <div className={s.payoutPaper}><Record label="Included payments" value="Eligible activity" /><Record label="Fees" value="Processing charges" /><Record label="Adjustments" value="Refunds, disputes, reserves" /><div className={s.payoutTotal}><Icon name="layers" /><strong>Payout amount</strong></div></div>
        <Connector /><div className={s.outcome}><Icon name="bank" /><div><strong>Bank deposit</strong><span>Match the amount and reference</span></div></div>
        <p className={s.artFootnote}>Pending activity is not yet available for payout.</p>
    </div><figcaption>{caption}</figcaption>
  </figure>;
}

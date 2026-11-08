import { Label, Connector } from "@/features/services/shared/artwork-primitives";

import { Icon } from "../../../shared/ui/icon";

import s from "../shared/service-detail.module.css";

export function RefundsArt({ title, caption }: { title: string; caption: string }) {
  return <figure className={s.art} data-service-workflow="refunds" aria-label={title}>
    <div className={`${s.scene} ${s.refunds}`}>
<div className={s.sceneHeading}><Label icon="card">Original payment</Label><strong>The status determines the return.</strong></div>
        <div className={s.refundChecks}><Icon name="document" /><span>Check previous refunds and open disputes</span></div>
        <div className={s.refundRoutes}>
          <div><span>Uncaptured authorization</span><Connector /><strong>Reversal</strong></div>
          <div><span>Capture awaiting processing</span><Connector /><strong>Void</strong></div>
          <div><span>Eligible captured payment</span><Connector /><strong>Refund</strong></div>
        </div><div className={s.outcome}><Icon name="link" /><div><strong>Keep the return reference</strong><span>Follow its status with the original sale</span></div></div>
    </div><figcaption>{caption}</figcaption>
  </figure>;
}

import { ServiceArtMotion, ServiceFlowMark } from "../components/service-art-motion";
import { Label, Node } from "../shared/artwork-primitives";
import s from "../shared/service-detail.module.css";

export function AchPaymentsArt({ title, caption }: { title: string; caption: string }) {
  return <ServiceArtMotion className={s.art} workflow="ach" label={title}>
    <div className={s.scene}>
<div className={s.sceneHeading}><Label icon="bank">ACH payment</Label><strong>Permission. Validation. Payment.</strong></div>
        <div className={s.permissionPair}><Node icon="document" title="Authorization" detail="Customer permission" /><Node icon="shield" title="Account validation" detail="Required bank checks" /></div>
        <div className={s.bankFlow}><Node icon="bank" title="Customer bank" detail="US bank account" /><ServiceFlowMark direction="right" /><div className={s.processing}><span className={s.processingMark} data-motion-part="processing" aria-hidden="true" /><strong>Processing</strong><span>Follow the payment record</span></div></div>
        <div className={s.branch}><div><span>Payment result</span><strong>Completed</strong></div><div><span>If returned</span><strong>Review the reason</strong></div></div>
    </div><figcaption>{caption}</figcaption>
  </ServiceArtMotion>;
}

import { Label } from "@/features/services/shared/artwork-primitives";

import { Icon } from "../../../shared/ui/icon";

import s from "../shared/service-detail.module.css";

function Record({ label, value }: { label: string; value: string }) {
  return <div className={s.record}><span>{label}</span><strong>{value}</strong></div>;
}

export function DisputesArt({ title, caption }: { title: string; caption: string }) {
  return <figure className={s.art} data-service-workflow="disputes" aria-label={title}>
    <div className={s.scene}>
<div className={s.sceneHeading}><Label icon="document">Dispute notice</Label><strong>Review. Decide. Respond.</strong></div>
        <div className={s.notice}><Record label="Review the claim" value="Reason and amount" /><Record label="Respond in time" value="Case deadline" /></div>
        <div className={s.caseBranches}><div><span>Accept</span><strong>Record the decision</strong></div><div><span>Challenge</span><strong>Submit relevant evidence</strong><p>Purchase · Fulfillment · Communication</p></div></div>
        <div className={s.outcome}><Icon name="document" /><div><strong>Follow the case outcome</strong><span>Decision and account adjustment</span></div></div>
    </div><figcaption>{caption}</figcaption>
  </figure>;
}

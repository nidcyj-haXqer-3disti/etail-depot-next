import { Label } from "@/features/services/shared/artwork-primitives";

import { ReconciliationMatchArt } from "../components/merchant-record-art";
import s from "../shared/service-detail.module.css";

export function ReconciliationArt({ title, caption }: { title: string; caption: string }) {
  return <figure className={s.art} data-service-workflow="reconciliation" aria-label={title}>
    <div className={s.scene}>
<div className={s.sceneHeading}><Label icon="link">Reconciliation</Label><strong>Match the records.</strong></div>
        <ReconciliationMatchArt />
    </div><figcaption>{caption}</figcaption>
  </figure>;
}

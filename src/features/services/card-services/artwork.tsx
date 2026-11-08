import { Label, Node } from "@/features/services/shared/artwork-primitives";
import type { ReactNode } from "react";

import s from "../shared/service-detail.module.css";

export function CardServicesArt({ title, caption, cardFace }: { title: string; caption: string; cardFace: ReactNode }) {
  return <figure className={s.art} data-service-workflow="cards" aria-label={title}>
    <div className={s.scene}>
<div className={s.sceneHeading}><Label icon="lock">Virtual secured credit</Label><strong>One card. Two separate balances.</strong></div>
        <div className={s.cardFace}>{cardFace}</div>
        <div className={s.cardRecords}><Node icon="lock" title="Security deposit" detail="Backs the credit account" /><Node icon="document" title="Purchase balance" detail="Repaid in full each month" /></div>
    </div><figcaption>{caption}</figcaption>
  </figure>;
}

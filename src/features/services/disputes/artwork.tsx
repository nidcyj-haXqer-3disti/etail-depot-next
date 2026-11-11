import { ServiceArtMotion } from "../components/service-art-motion";
import { Label } from "@/features/services/shared/artwork-primitives";
import { Icon } from "@/shared/ui/icon";
import shared from "../shared/service-detail.module.css";
import s from "./dispute-artwork.module.css";

const supportingRecords = ["Order receipt", "Delivery tracking", "Customer messages"];

export function DisputesArt({ title, caption }: { title: string; caption: string }) {
  return <ServiceArtMotion className={shared.art} workflow="disputes" label={title}>
    <div className={`${shared.scene} ${s.scene}`}>
      <div className={s.heading}><Label icon="document">Dispute</Label><span>USD</span></div>
      <div className={s.notice}>
        <div className={s.caseBody}>
          <div className={s.caseHeading}><strong>Case D1046</strong><span className={s.status}>Response needed</span></div>
          <div className={s.amount}><span>Disputed amount</span><strong>$240.00</strong></div>
          <dl className={s.details}>
            <div><dt>Reason</dt><dd>Product not received</dd></div>
            <div><dt>Original order</dt><dd>#1046</dd></div>
          </dl>
        </div>
        <div className={s.deadline}><span>Respond by</span><strong><time dateTime="2026-11-18">18 Nov 2026</time></strong></div>
      </div>
      <div className={s.evidence}>
        <div className={s.evidenceHeading}><strong>Supporting records</strong><span>Not submitted</span></div>
        <ul className={s.records}>{supportingRecords.map((record, index) => <li key={record}><span className={s.document} data-motion-part="evidence" data-motion-step={index + 1}><Icon name="document" /></span><span>{record}</span></li>)}</ul>
        <p className={s.note}>Collected for review before a response is sent.</p>
      </div>
    </div>
    <figcaption>{caption}</figcaption>
  </ServiceArtMotion>;
}

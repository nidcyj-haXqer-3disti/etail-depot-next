import { ServiceArtMotion, ServiceFlowMark } from "../components/service-art-motion";
import { Label } from "@/features/services/shared/artwork-primitives";
import { Icon } from "@/shared/ui/icon";
import shared from "../shared/service-detail.module.css";
import s from "./refund-artwork.module.css";

export function RefundsArt({ title, caption }: { title: string; caption: string }) {
  return <ServiceArtMotion className={shared.art} workflow="refunds" label={title}>
    <div className={`${shared.scene} ${s.scene}`}>
      <div className={s.heading}><Label icon="document">Partial refund</Label><span>USD</span></div>
      <div className={s.payment}>
        <div className={s.recordHeading}><strong>Order #1048</strong><span className={s.settled}><Icon name="check" />Settled</span></div>
        <div className={s.originalAmount}><span>Original payment</span><strong>$150.00</strong></div>
        <div className={s.purchase}><span>Cotton towel set<small>2 × $75.00</small></span><span className={s.method}><Icon name="card" />Visa ending 4242</span></div>
      </div>
      <div className={s.connection}><ServiceFlowMark direction="up" /><span>Refund linked to order #1048</span></div>
      <div className={s.refund}>
        <div className={s.recordHeading}><strong>Partial refund</strong><span className={s.pending}>Pending</span></div>
        <div className={s.refundAmount}><strong>$75.00</strong><span>1 item returned</span></div>
        <dl className={s.refundDetails}>
          <div><dt>Refund reference</dt><dd>RF1048</dd></div>
          <div><dt>Return to</dt><dd>Original Visa ending 4242</dd></div>
        </dl>
      </div>
      <div className={s.balance}><span>Sale balance if completed</span><strong>$75.00</strong></div>
      <p className={s.note}>Pending does not confirm receipt by the customer.</p>
    </div>
    <figcaption>{caption}</figcaption>
  </ServiceArtMotion>;
}

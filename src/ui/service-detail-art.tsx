import type { ReactNode } from "react";
import type { ServiceKind } from "@/modules/public-site/service-detail-content";
import { Icon } from "./icon";
import { MerchantApplicationArt } from "./merchant-application-art";
import { PaymentChoiceArt, ReconciliationMatchArt } from "./merchant-record-art";
import s from "./service-detail.module.css";

function Label({ icon, children }: { icon: string; children: ReactNode }) {
  return <span className={s.artLabel}><Icon name={icon} />{children}</span>;
}
function Node({ icon, title, detail }: { icon: string; title: string; detail?: string }) {
  return <div className={s.node}><span className={s.nodeIcon}><Icon name={icon} /></span><div><strong>{title}</strong>{detail && <span>{detail}</span>}</div></div>;
}
function Connector() { return <span className={s.connector} aria-hidden="true"><Icon name="arrow" /></span>; }
function Record({ label, value }: { label: string; value: string }) {
  return <div className={s.record}><span>{label}</span><strong>{value}</strong></div>;
}

/** Original process diagrams, without account data, live states or transaction controls. */
type ServiceDetailArtProps = { title: string; caption: string } & (
  | { kind: ServiceKind; cardFace?: never }
  | { kind: "cards"; cardFace: ReactNode }
);

export function ServiceDetailArt({ kind, title, caption, cardFace }: ServiceDetailArtProps) {
  if (kind === "onboarding") return <MerchantApplicationArt title={title} caption={caption} />;
  return <figure className={s.art} data-service-workflow={kind} aria-label={title}>
    <div className={kind === "refunds" ? `${s.scene} ${s.refunds}` : s.scene}>
      {kind === "methods" && <PaymentChoiceArt />}
      {kind === "ach" && <>
        <div className={s.sceneHeading}><Label icon="bank">ACH payment</Label><strong>Permission. Validation. Payment.</strong></div>
        <div className={s.permissionPair}><Node icon="document" title="Authorization" detail="Customer permission" /><Node icon="shield" title="Account validation" detail="Required bank checks" /></div>
        <div className={s.bankFlow}><Node icon="bank" title="Customer bank" detail="US bank account" /><Connector /><div className={s.processing}><span className={s.processingMark} aria-hidden="true" /><strong>Processing</strong><span>Follow the payment record</span></div></div>
        <div className={s.branch}><div><span>Payment result</span><strong>Completed</strong></div><div><span>If returned</span><strong>Review the reason</strong></div></div>
      </>}
      {kind === "payouts" && <>
        <div className={s.sceneHeading}><Label icon="document">Payout breakdown</Label><strong>From activity to deposit.</strong></div>
        <div className={s.payoutPaper}><Record label="Included payments" value="Eligible activity" /><Record label="Fees" value="Processing charges" /><Record label="Adjustments" value="Refunds, disputes, reserves" /><div className={s.payoutTotal}><Icon name="layers" /><strong>Payout amount</strong></div></div>
        <Connector /><div className={s.outcome}><Icon name="bank" /><div><strong>Bank deposit</strong><span>Match the amount and reference</span></div></div>
        <p className={s.artFootnote}>Pending activity is not yet available for payout.</p>
      </>}
      {kind === "reconciliation" && <>
        <div className={s.sceneHeading}><Label icon="link">Reconciliation</Label><strong>Match the records.</strong></div>
        <ReconciliationMatchArt />
      </>}
      {kind === "refunds" && <>
        <div className={s.sceneHeading}><Label icon="card">Original payment</Label><strong>The status determines the return.</strong></div>
        <div className={s.refundChecks}><Icon name="document" /><span>Check previous refunds and open disputes</span></div>
        <div className={s.refundRoutes}>
          <div><span>Uncaptured authorization</span><Connector /><strong>Reversal</strong></div>
          <div><span>Capture awaiting processing</span><Connector /><strong>Void</strong></div>
          <div><span>Eligible captured payment</span><Connector /><strong>Refund</strong></div>
        </div><div className={s.outcome}><Icon name="link" /><div><strong>Keep the return reference</strong><span>Follow its status with the original sale</span></div></div>
      </>}
      {kind === "disputes" && <>
        <div className={s.sceneHeading}><Label icon="document">Dispute notice</Label><strong>Review. Decide. Respond.</strong></div>
        <div className={s.notice}><Record label="Review the claim" value="Reason and amount" /><Record label="Respond in time" value="Case deadline" /></div>
        <div className={s.caseBranches}><div><span>Accept</span><strong>Record the decision</strong></div><div><span>Challenge</span><strong>Submit relevant evidence</strong><p>Purchase · Fulfillment · Communication</p></div></div>
        <div className={s.outcome}><Icon name="document" /><div><strong>Follow the case outcome</strong><span>Decision and account adjustment</span></div></div>
      </>}
      {kind === "cards" && <>
        <div className={s.sceneHeading}><Label icon="lock">Virtual secured credit</Label><strong>One card. Two separate balances.</strong></div>
        <div className={s.cardFace}>{cardFace}</div>
        <div className={s.cardRecords}><Node icon="lock" title="Security deposit" detail="Backs the credit account" /><Node icon="document" title="Purchase balance" detail="Repaid in full each month" /></div>
      </>}
    </div><figcaption>{caption}</figcaption>
  </figure>;
}

import Image from "next/image";
import type { ReactNode } from "react";
import type { ServiceKind } from "@/modules/public-site/service-detail-content";
import { Icon } from "./icon";
import { LedgixCardFace } from "./wallet-card-art";
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
export function ServiceDetailArt({ kind, title, caption }: { kind: ServiceKind | "cards"; title: string; caption: string }) {
  return <figure className={s.art} data-service-workflow={kind} aria-label={title}>
    <div className={kind === "refunds" ? `${s.scene} ${s.refunds}` : s.scene}>
      {kind === "onboarding" && <>
        <div className={s.sceneHeading}><Label icon="business">Merchant application</Label><strong>Your business comes first.</strong></div>
        <div className={s.onboardingGrid}>
          <div className={s.profilePaper}><div className={s.paperHeading}><Image src="/brand/symbol.png" alt="" width={34} height={22} unoptimized /><span>Business profile</span></div><Node icon="business" title="Business" detail="Activity and sales channels" /><Node icon="person" title="Ownership" detail="Owners and representatives" /><Node icon="bank" title="Bank account" detail="Where payouts are received" /></div>
          <div className={s.accountStages}><div><span>01</span><strong>Account review</strong><small>Information and eligibility</small></div><div><span>02</span><strong>Agreement</strong><small>Fees and service terms</small></div><div><span>03</span><strong>Activation</strong><small>After approval and setup</small></div></div>
        </div>
      </>}
      {kind === "methods" && <>
        <div className={s.sceneHeading}><Label icon="card">Customer checkout</Label><strong>A familiar way to pay.</strong></div>
        <div className={s.checkoutPaper}>
          <div className={s.method}><div><Icon name="card" /><strong>Cards</strong></div><div className={s.networkMarks}><Image src="/brand/networks/visa-blue.svg" alt="Visa" width={38} height={26} unoptimized /><Image src="/brand/networks/mastercard.svg" alt="Mastercard" width={32} height={26} unoptimized /><Image src="/brand/networks/american-express.svg" alt="American Express" width={26} height={26} unoptimized /><Image src="/brand/networks/discover.jpg" alt="Discover" width={42} height={26} unoptimized /></div></div>
          <div className={s.method}><div><Icon name="card" /><strong>Digital wallets</strong></div><div className={s.walletMarks}><Image src="/brand/wallets/apple-pay.svg" alt="Apple Pay" width={44} height={29} unoptimized /><Image src="/brand/wallets/google-pay.svg" alt="Google Pay" width={48} height={29} unoptimized /></div></div>
          <div className={s.method}><div><Icon name="bank" /><strong>Bank payments</strong></div><span className={s.achMark}>ACH</span></div>
        </div><Connector /><div className={s.outcome}><Icon name="link" /><div><strong>One connected order</strong><span>Payment reference and status</span></div></div>
      </>}
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
        <p className={s.artFootnote}>Pending activity belongs to a later payout.</p>
      </>}
      {kind === "reconciliation" && <>
        <div className={s.sceneHeading}><Label icon="link">Reconciliation</Label><strong>Two matches. One clear balance.</strong></div>
        <div className={s.matchRecords}><Node icon="card" title="Payment activity" detail="Sales, fees and adjustments" /><div className={s.matchLink}><span>Match included activity</span><Connector /></div><Node icon="document" title="Payout report" detail="Included transactions and total" /><div className={s.matchLink}><span>Match amount and reference</span><Connector /></div><Node icon="bank" title="Bank statement" detail="Posted credit and date" /></div>
        <div className={s.exception}><Icon name="insight" /><span>Any difference stays open for investigation.</span></div>
      </>}
      {kind === "refunds" && <>
        <div className={s.sceneHeading}><Label icon="card">Original payment</Label><strong>The status determines the return.</strong></div>
        <div className={s.refundChecks}><Icon name="document" /><span>Check previous refunds and open disputes</span></div>
        <div className={s.refundRoutes}>
          <div><span>Uncaptured authorization</span><Connector /><strong>Reversal</strong></div>
          <div><span>Before settlement</span><Connector /><strong>Void</strong></div>
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
        <div className={s.cardFace}><LedgixCardFace /></div>
        <div className={s.cardRecords}><Node icon="lock" title="Security deposit" detail="Backs the credit account" /><Node icon="document" title="Purchase balance" detail="Repaid in full each month" /></div>
      </>}
    </div><figcaption>{caption}</figcaption>
  </figure>;
}

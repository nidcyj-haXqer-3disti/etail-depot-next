import { applePay, googlePay } from "./artwork-assets";
import Image from "next/image";
import type { ReactNode } from "react";
import type { CommercialPage } from "@/modules/public-site/commercial-content";
import { Icon } from "./icon";
import s from "./service-product-art.module.css";

type Kind = "onboarding" | "methods" | "payouts" | "adjustments" | "ach";
function Badge({ icon, children }: { icon: string; children: ReactNode }) {
  return <span className={s.badge}><Icon name={icon} />{children}</span>;
}
function Steps({ items }: { items: readonly string[] }) {
  return <ol className={s.steps}>{items.map((item, i) => <li key={item}><span>{String(i + 1).padStart(2, "0")}</span><strong>{item}</strong></li>)}</ol>;
}
function Record({ title, items, dark = false }: { title: string; items: readonly (readonly [string, string])[]; dark?: boolean }) {
  return <div className={`${s.record}${dark ? ` ${s.dark}` : ""}`}><strong className={s.recordTitle}>{title}</strong><dl>{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>;
}

/** Original workflow illustrations. No simulated controls, account state or transaction data. */
export function ServiceProductArt({ kind, art }: { kind: Kind; art: CommercialPage["art"] }) {
  return <figure className={s.art} data-service-workflow={kind} aria-label={art.title}>
    <div className={`${s.canvas} cw-workflow-surface`}>
      {kind === "onboarding" && <>
        <div className={s.businessCard}><Badge icon="business">Business profile</Badge><strong>Your business.<br />Your merchant account.</strong><div className={s.businessFacts}><span><Icon name="person" />Ownership</span><span><Icon name="box" />Sales activity</span><span><Icon name="bank" />Bank details</span></div></div>
        <div className={s.accountSheet}><div className={s.sheetHeading}><Icon name="document" /><strong>Account setup</strong></div><dl><div><dt>Business review</dt><dd>Activity and eligibility</dd></div><div><dt>Merchant agreement</dt><dd>Fees and payout terms</dd></div><div><dt>Payment configuration</dt><dd>Methods and access</dd></div></dl><div className={s.sheetFoot}><Icon name="lock" />Approval before activation</div></div>
        <Steps items={["Apply", "Review", "Configure", "Activate"]} />
      </>}
      {kind === "methods" && <>
        <div className={s.orderContext}><Badge icon="box">Customer purchase</Badge><span>Order reference · Amount · Merchant</span></div>
        <div className={s.checkoutSheet}><div className={s.sheetHeading}><strong>Payment methods</strong><Icon name="lock" /></div><div className={s.methodChoices}>
          <div><span className={s.methodSymbol}><Icon name="card" /></span><strong>Credit and debit cards</strong><span>Visa · Mastercard · Amex · Discover</span></div>
          <div><span className={s.methodSymbol}><Icon name="card" /></span><strong>Digital wallets</strong><span className={s.walletMarks}><Image src={applePay} width={43} height={26} alt="Apple Pay" unoptimized loading="eager" /><Image src={googlePay} width={52} height={26} alt="Google Pay" unoptimized loading="eager" /></span></div>
          <div><span className={s.methodSymbol}><Icon name="bank" /></span><strong>ACH bank payment</strong><span>From a US bank account</span></div>
        </div><div className={s.sheetFoot}><Icon name="link" />Payment result linked to the order</div></div>
      </>}
      {kind === "payouts" && <>
        <Badge icon="bank">From payment to bank deposit</Badge>
        <div className={s.payoutPair}><Record title="Payout report" items={[["Payments", "Included activity"], ["Fees", "Processing charges"], ["Adjustments", "Refunds and chargebacks"], ["Payout", "Reference and amount"]]} /><div className={s.depositCard}><Icon name="bank" /><span>Bank statement</span><strong>Deposit</strong><p>Match the amount,<br />date and reference.</p></div></div>
        <Steps items={["Capture", "Settlement", "Payout calculation", "Bank deposit"]} />
      </>}
      {kind === "adjustments" && <>
        <div className={s.paymentOrigin}><Badge icon="card">Original payment</Badge><span>Purchase and transaction reference</span></div>
        <div className={s.branchPair}><div className={s.branch}><Badge icon="arrow">Merchant action</Badge><strong>Refund</strong><ol><li>Check the payment</li><li>Return the amount</li><li>Follow refund status</li></ol></div><div className={`${s.branch} ${s.dark}`}><Badge icon="document">Cardholder challenge</Badge><strong>Dispute</strong><ol><li>Review the reason</li><li>Respond by the deadline</li><li>Track the outcome</li></ol></div></div>
      </>}
      {kind === "ach" && <>
        <div className={s.achPair}><Record title="Invoice or order" items={[["Purchase", "Order reference"], ["Amount", "Authorized total"], ["Method", "ACH bank payment"]]} /><div className={s.bankCard}><Icon name="bank" /><span>US bank account</span><strong>ACH</strong><p>Customer authorization<br />before submission.</p></div></div>
        <Steps items={["Authorize", "Process", "Reconcile"]} />
        <div className={s.returnNote}><Icon name="document" /><span><strong>Return received?</strong> Check the reason before another attempt.</span></div>
      </>}
    </div><figcaption>{art.caption}</figcaption>
  </figure>;
}

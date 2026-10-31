import Image from "next/image";
import type { ReactNode } from "react";
import type { CommercialPage, CommercialPath } from "@/modules/public-site/commercial-content";
import { Icon } from "./icon";
import styles from "./service-operation-art.module.css";

type Artwork = CommercialPage["art"];
export const workflowArtPaths = ["/merchant-onboarding", "/payment-methods", "/payouts-and-reconciliation", "/refunds-and-disputes", "/payment-partnerships"] as const;

function Mark() {
  return <span className={styles.mark}><Image src="/brand/symbol.png" alt="" width={36} height={22} unoptimized /></span>;
}
function Frame({ art, icon, kind, children }: { art: Artwork; icon: string; kind: string; children: ReactNode }) {
  return <figure className={styles.art} data-service-workflow={kind} aria-label={art.title}>
    <div className={`${styles.surface} cw-workflow-surface`}>
      <div className={styles.heading}><Icon name={icon} /><strong>{art.title}</strong></div>
      {children}
    </div>
    <figcaption className={styles.caption}>{art.caption}</figcaption>
  </figure>;
}
function Purchase({ title = "Original payment", detail = "Order and transaction reference" }: { title?: string; detail?: string }) {
  return <div className={styles.purchase}><span className={styles.iconTile}><Icon name="document" /></span><div><strong>{title}</strong><span>{detail}</span></div></div>;
}

export function ServiceWorkflowArt({ path, art }: { path: CommercialPath; art: Artwork }) {
  if (path === "/merchant-onboarding") return <Frame art={art} icon="business" kind="onboarding">
    <div className={styles.profile}><div className={styles.profileIdentity}><span className={styles.store}><Icon name="business" /></span><div><span>01 · Business profile</span><strong>Online business</strong></div></div><div className={styles.profileFields}>{[["person","Ownership"],["box","Sales activity"],["bank","Payout account"]].map(([icon,label])=><span key={label}><Icon name={icon}/>{label}</span>)}</div></div>
    <ol className={styles.timeline}>{art.steps.slice(1).map((step,index)=><li key={step.title}><span className={styles.number}>{String(index+2).padStart(2,"0")}</span><div><strong>{step.title}</strong><span>{step.detail}</span></div><Icon name={index===2?"card":"document"}/></li>)}</ol>
    <div className={styles.boundary}><Icon name="lock"/><span>Account approval before payment acceptance</span></div>
  </Frame>;
  if (path === "/payment-methods") return <Frame art={art} icon="card" kind="methods">
    <div className={styles.body}><Purchase title="Customer purchase" detail="Keep the order reference"/>
      <div className={styles.methods}>
        <div><span className={styles.methodIcon}><Icon name="card"/></span><div><strong>Credit and debit cards</strong><span>Authorization and capture</span></div></div>
        <div><span className={styles.methodIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M20 7V4H6a3 3 0 0 0-3 3v12h17V7H6a1.5 1.5 0 0 1 0-3"/><path d="M20 11h-6v5h6m-3-2.5h.1"/></svg></span><div><strong>Digital wallets</strong><span>Eligible card and supported device</span><div className={styles.wallets}><Image src="/brand/wallets/apple-pay.svg" width={44} height={28} alt="Apple Pay" unoptimized/><Image src="/brand/wallets/google-pay.svg" width={54} height={28} alt="Google Pay" unoptimized/></div></div></div>
        <div><span className={styles.methodIcon}><Icon name="bank"/></span><div><strong>ACH bank payments</strong><span>Bank processing and return handling</span></div></div>
      </div>
    </div>
    <div className={styles.boundary}><Icon name="document"/><span>Confirm the payment result before fulfillment</span></div>
  </Frame>;
  if (path === "/payouts-and-reconciliation") return <Frame art={art} icon="bank" kind="payouts">
    <ol className={`${styles.timeline} ${styles.payoutTimeline}`}>
      <li><span className={styles.number}>01</span><div><strong>Capture</strong><span>Payment submitted for processing</span></div><Icon name="card"/></li>
      <li><span className={styles.number}>02</span><div><strong>Settlement</strong><span>Processing and settlement records</span></div><Icon name="layers"/></li>
      <li><span className={styles.number}>03</span><div className={styles.calculation}><strong>Payout calculation</strong><div className={styles.report}><span>Included payments</span><span>Processing fees</span><span>Refunds and chargebacks</span><span>Other account adjustments</span><div><strong>Payout report</strong><span>Reference and amount</span></div></div></div></li>
      <li className={styles.deposit}><span className={styles.number}>04</span><div><strong>Bank deposit</strong><span>Match the report to the bank statement</span></div><Icon name="bank"/></li>
    </ol>
  </Frame>;
  if (path === "/refunds-and-disputes") return <Frame art={art} icon="document" kind="adjustments">
    <div className={styles.body}><Purchase/><div className={styles.branch}>
      <div className={styles.branchCard}><span className={styles.branchIcon}><Icon name="arrow"/></span><span className={styles.small}>Merchant action</span><strong>Refund</strong><ul><li>Amount to return</li><li>Refund reference</li><li>Refund status</li></ul></div>
      <div className={`${styles.branchCard} ${styles.dark}`}><span className={styles.branchIcon}><Icon name="document"/></span><span className={styles.small}>Cardholder challenge</span><strong>Dispute</strong><ul><li>Reason and deadline</li><li>Supporting records</li><li>Case outcome</li></ul></div>
    </div></div><div className={styles.recordFoot}><Icon name="link"/><span>Two processes. The same original payment.</span></div>
  </Frame>;
  return <Frame art={art} icon="layers" kind="partnerships">
    <div className={styles.body}><div className={styles.platform}><Icon name="layers"/><span>Your software</span><strong>The purchase experience</strong><span>Orders, invoices and bookings</span></div><div className={styles.branch}>
      <div className={styles.branchCard}><span className={styles.branchIcon}><Icon name="business"/></span><span className={styles.small}>The selling business</span><strong>Merchant</strong><ul><li>Customer relationship</li><li>Account agreement</li><li>Purchase and delivery</li></ul></div>
      <div className={`${styles.branchCard} ${styles.dark}`}><Mark/><span className={styles.small}>Merchant services</span><strong>Etail Depot</strong><ul><li>Account setup</li><li>Payment acceptance</li><li>Operational support</li></ul></div>
    </div></div><div className={styles.recordFoot}><Icon name="link"/><span>Merchant, order and payment references</span></div>
  </Frame>;
}

export function BankPaymentArt({art}:{art:Artwork}) {
  return <Frame art={art} icon="bank" kind="bank-payments"><div className={styles.bankGrid}>
    <div className={styles.invoice}><span className={styles.iconTile}><Icon name="document"/></span><span className={styles.small}>The purchase</span><strong>Invoice or order</strong><dl><div><dt>Reference</dt><dd>Purchase record</dd></div><div><dt>Amount</dt><dd>Authorized total</dd></div><div><dt>Method</dt><dd>ACH bank payment</dd></div></dl></div>
    <div className={styles.bankProcess}><div className={styles.bankIdentity}><span className={styles.iconTile}><Icon name="bank"/></span><div><span>ACH</span><strong>From authorization to reconciliation.</strong></div></div><ol className={styles.timeline}>{art.steps.map((step,index)=><li key={step.title}><span className={styles.number}>{String(index+1).padStart(2,"0")}</span><div><strong>{step.title}</strong><span>{step.detail}</span></div></li>)}</ol><div className={styles.return}><Icon name="document"/><div><strong>Return received?</strong><span>Match the reason to the original payment before another attempt.</span></div></div></div>
  </div></Frame>;
}

export function PlatformRecordArt() {
  const rows=[{icon:"business",label:"Account",from:"Business reference",direction:"→",to:"Merchant account",note:"Approval and permissions"},{icon:"card",label:"Checkout",from:"Order or invoice",direction:"↔",to:"Payment result",note:"Status and transaction reference"},{icon:"document",label:"Reporting",from:"Reconciliation",direction:"←",to:"Payment records",note:"Refund and payout references"}];
  return <figure className={`${styles.art} ${styles.integration}`} aria-label="Integration responsibilities: your software supplies merchant and purchase references; merchant services return payment results and reporting references. Assigned specifications determine the implementation.">
    <div className={styles.surface}><div className={styles.integrationHeader}><div><Icon name="layers"/><strong>Your software</strong></div><div><Mark/><strong>Merchant services</strong></div></div>
      <div className={styles.integrationRows}>{rows.map(row=><div className={styles.integrationRow} key={row.label}><span className={styles.integrationLabel}><Icon name={row.icon}/>{row.label}</span><div className={styles.referencePair}><strong>{row.from}</strong><span className={styles.referenceDirection} aria-hidden="true">{row.direction}</span><div><strong>{row.to}</strong><span>{row.note}</span></div></div></div>)}</div>
      <div className={styles.recordFoot}><Icon name="link"/><span>Keep the business reference with every payment.</span></div>
    </div>
  </figure>;
}

export function AccountProfileArt() {
  return <figure className={`${styles.art} ${styles.accountProfile}`} aria-label="Business information needed for account setup: Studio Store, an online retail business in the United States, prepares company details, ownership information and payout bank details.">
    <div className={styles.surface}><div className={styles.heading}><Icon name="business"/><strong>Business profile</strong></div><div className={styles.profile}><div className={styles.profileIdentity}><span className={styles.store}><Icon name="business"/></span><div><strong>Studio Store</strong><span>Online retail · United States</span></div></div></div><ol className={styles.timeline}>{[["business","Business information","Company and activity"],["person","Business owners","Ownership and representatives"],["bank","Payout account","Receiving bank details"]].map(([icon,title,detail],i)=><li key={title}><span className={styles.number}>{String(i+1).padStart(2,"0")}</span><div><strong>{title}</strong><span>{detail}</span></div><Icon name={icon}/></li>)}</ol><div className={styles.boundary}><Icon name="lock"/><span>Submitted through your account service.</span></div></div>
  </figure>;
}

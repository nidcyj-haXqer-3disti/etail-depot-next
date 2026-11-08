import { brandSymbol } from "../../../shared/ui/artwork/artwork-assets";
import Image from "next/image";
import type { ReactNode } from "react";
import type { CommercialPage, CommercialPath } from "@/features/commercial-catalog";
import { Icon } from "../../../shared/ui/icon";
import styles from "./service-operation-art.module.css";
import { ServiceProductArt } from "./service-product-art";

type Artwork = CommercialPage["art"];
export const workflowArtPaths = ["/services/merchant-onboarding", "/services/payment-methods", "/services/payouts", "/services/refunds", "/use-cases/software-platforms/partnerships"] as const;

function Mark({ priority = false }: { priority?: boolean }) {
  return <span className={styles.mark}><Image src={brandSymbol} alt="" width={36} height={22} unoptimized preload={priority} loading={priority ? undefined : "eager"} /></span>;
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
export function ServiceWorkflowArt({ path, art }: { path: CommercialPath; art: Artwork }) {
  const kinds = { "/services/merchant-onboarding": "onboarding", "/services/payment-methods": "methods", "/services/payouts": "payouts", "/services/refunds": "adjustments" } as const;
  if (path in kinds) return <ServiceProductArt kind={kinds[path as keyof typeof kinds]} art={art} />;
  return <Frame art={art} icon="layers" kind="partnerships">
    <div className={styles.body}><div className={styles.platform}><Icon name="layers"/><span>Your software</span><strong>The purchase experience</strong><span>Orders, invoices and bookings</span></div><div className={styles.branch}>
      <div className={styles.branchCard}><span className={styles.branchIcon}><Icon name="business"/></span><span className={styles.small}>The selling business</span><strong>Merchant</strong><ul><li>Customer relationship</li><li>Account agreement</li><li>Purchase and delivery</li></ul></div>
      <div className={`${styles.branchCard} ${styles.dark}`}><Mark priority/><span className={styles.small}>Merchant services</span><strong>Etail Depot</strong><ul><li>Account setup</li><li>Payment acceptance</li><li>Account support</li></ul></div>
    </div></div><div className={styles.recordFoot}><Icon name="link"/><span>Merchant, order and payment references</span></div>
  </Frame>;
}

export function BankPaymentArt({ art }: { art: Artwork }) {
  return <ServiceProductArt kind="ach" art={art} />;
}

export function PlatformRecordArt() {
  const rows=[{icon:"business",label:"Account",from:"Business reference",direction:"→",to:"Merchant account",note:"Approval and permissions"},{icon:"card",label:"Checkout",from:"Order or invoice",direction:"↔",to:"Payment result",note:"Status and transaction reference"},{icon:"document",label:"Reporting",from:"Reconciliation",direction:"←",to:"Payment records",note:"Refund and payout references"}];
  return <figure className={`${styles.art} ${styles.integration}`} aria-label="Integration responsibilities: your software supplies merchant and purchase references; merchant services return payment results and reporting references. Follow the integration specifications provided for your account.">
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

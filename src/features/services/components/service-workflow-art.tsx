import { BrandImage } from "../../../shared/brand/brand-image";
import type { ReactNode } from "react";
import type { CommercialPage, CommercialPath } from "@/features/commercial-catalog";
import { Icon } from "../../../shared/ui/icon";
import styles from "./service-operation-art.module.css";
import { ServiceProductArt } from "./service-product-art";

type Artwork = CommercialPage["art"];
export const workflowArtPaths = ["/services/merchant-onboarding", "/services/payment-methods", "/services/payouts", "/services/refunds", "/use-cases/software-platforms/partnerships"] as const;

function Mark() {
  return <span className={styles.mark}><BrandImage brand="symbol" alt="" width={800} height={484} className={styles.markImage} /></span>;
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
      <div className={`${styles.branchCard} ${styles.dark}`}><Mark/><span className={styles.small}>Merchant services</span><strong>Trolleys</strong><ul><li>Account setup</li><li>Payment acceptance</li><li>Account support</li></ul></div>
    </div></div><div className={styles.recordFoot}><Icon name="link"/><span>Merchant, order and payment references</span></div>
  </Frame>;
}

export function BankPaymentArt({ art }: { art: Artwork }) {
  return <ServiceProductArt kind="ach" art={art} />;
}

export function AccountProfileArt() {
  return <figure className={`${styles.art} ${styles.accountProfile}`} aria-label="Business information needed for account setup: Studio Store, an online retail business in the United States, prepares company details, ownership information and payout bank details.">
    <div className={styles.surface}><div className={styles.heading}><Icon name="business"/><strong>Business profile</strong></div><div className={styles.profile}><div className={styles.profileIdentity}><span className={styles.store}><Icon name="business"/></span><div><strong>Studio Store</strong><span>Online retail · United States</span></div></div></div><ol className={styles.timeline}>{[["business","Business information","Company and activity"],["person","Business owners","Ownership and representatives"],["bank","Payout account","Receiving bank details"]].map(([icon,title,detail],i)=><li key={title}><span className={styles.number}>{String(i+1).padStart(2,"0")}</span><div><strong>{title}</strong><span>{detail}</span></div><Icon name={icon}/></li>)}</ol><div className={styles.boundary}><Icon name="lock"/><span>Submitted through your account service.</span></div></div>
  </figure>;
}

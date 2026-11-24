import { BrandImage } from "../../../shared/brand/brand-image";
import { Icon } from "../../../shared/ui/icon";
import styles from "./service-operation-art.module.css";

function Mark() {
  return <span className={styles.mark}><BrandImage brand="symbol" alt="" width={800} height={484} className={styles.markImage} /></span>;
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

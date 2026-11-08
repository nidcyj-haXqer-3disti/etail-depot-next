import { Icon } from "../../../shared/ui/icon";
import styles from "./platform-journey-art.module.css";

const stages = [
  { icon: "business", record: "Merchant account", fields: ["Business profile", "Account review"], title: "Onboard the business.", detail: "Review business details and complete account setup after approval." },
  { icon: "card", record: "Order reference", fields: ["Customer purchase", "Payment result"], title: "Connect the checkout.", detail: "Match every purchase to its receiving merchant account." },
  { icon: "document", record: "Payment record", fields: ["Original transaction", "Refunds and disputes"], title: "Follow the payment.", detail: "Keep status and account activity with the original transaction." },
  { icon: "bank", record: "Payout report", fields: ["Payments and adjustments", "Bank deposit"], title: "Reconcile the deposit.", detail: "Match the payout report with the bank statement." },
] as const;

export function PlatformJourneyArt() {
  return <figure className={styles.journey} aria-label="Merchant workflow through your software: account setup, checkout, payment records and bank reconciliation.">
    <div className={styles.context}><Icon name="layers" /><strong>Your software</strong><span>Connected merchant records</span></div>
    <ol className={styles.stages}>
      {stages.map((stage, index) => <li key={stage.record}>
        <div className={`${styles.record} ${index === stages.length - 1 ? styles.deposit : ""}`}>
          <div className={styles.recordHeading}><Icon name={stage.icon} /><strong>{stage.record}</strong></div>
          <div className={styles.fields}>{stage.fields.map(field => <span key={field}>{field}</span>)}</div>
        </div>
        <div className={styles.description}><span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{stage.title}</h3><p>{stage.detail}</p></div>
      </li>)}
    </ol>
  </figure>;
}

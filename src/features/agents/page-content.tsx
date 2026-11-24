import { Shell } from "@/shared/layout/shell";
import { PublicPageStructuredData } from "@/shared/seo/structured-data";
import { GuidanceReference } from "./guidance-reference";
import { NextStep } from "./next-step";
import { pageJsonLd } from "./metadata";
import styles from "./next-step.module.css";

export default function AgentsPage() {
  return <Shell>
    <PublicPageStructuredData json={pageJsonLd()} />
    <div className="page-container">
      <NextStep />
      <details className={styles.notes}>
        <summary>Using your brief with an assistant</summary>
        <p>Your brief includes your choices, an ordered plan, who handles each step and how to check it is complete. Each step links to the relevant Trolleys guidance. Share a setup brief with your AI assistant or web team to plan the work. For an account or payment issue, use the support instructions in your brief.</p>
        <p>An assistant should use the linked guidance, identify missing information and treat your selections as unverified. Account approval, sign in and payment actions stay with you and the authorized provider. Keep passwords, API keys, payment details and private account documents out of the brief.</p>
      </details>
      <GuidanceReference />
    </div>
  </Shell>;
}

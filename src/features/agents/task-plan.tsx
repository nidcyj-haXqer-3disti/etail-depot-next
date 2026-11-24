import Link from "next/link";
import type { TaskPlanStep } from "./task-plans";
import styles from "./next-step.module.css";

export function TaskPlan({ steps }: { steps: readonly TaskPlanStep[] }) {
  return <ol className={styles.plan}>
    {steps.map(step => <li key={step.id}>
      <h4>{step.title}</h4>
      {step.condition && <p className={styles.condition}><strong>Before this step:</strong> {step.condition}</p>}
      <p>{step.action}</p>
      <dl><div><dt>Who</dt><dd>{step.owner}</dd></div><div><dt>Complete when</dt><dd>{step.complete}</dd></div></dl>
      <Link prefetch={false} href={step.source.href}>{step.source.label}</Link>
    </li>)}
  </ol>;
}

import { setupPlan, setupScenarios } from "./setup-paths";
import { TaskPlan } from "./task-plan";
import styles from "./next-step.module.css";

/** Rendered into the page at build time, including when no JavaScript is available. */
export function GuidanceReference() {
  const scenarios = setupScenarios();
  const groups = [...new Set(scenarios.map(item => item.answers[0]))];
  return <section className={styles.catalogue} id="task-reference" aria-labelledby="task-reference-title">
    <h2 id="task-reference-title">Task reference</h2>
    <p>Browse the same plans without answering questions. Match the situation first, then follow the linked guide. An assistant can read these instructions directly.</p>
    {groups.map(group => {
      const matches = scenarios.filter(item => item.answers[0] === group);
      const key = (id: string) => id.startsWith("application:") ? "application" : id;
      const results = [...new Map(matches.map(item => [key(item.result.id), item.result])).values()];
      return <details key={group} className={styles.referenceGroup} id={`tasks-${group}`}>
        <summary>{matches[0].selections[0].answer}</summary>
        {results.map(result => <details key={result.id} className={styles.referenceEntry}>
          <summary><h3>{result.title}</h3></summary>
          <p className={styles.applies}>Use this plan when:</p>
          <ul className={styles.situations}>{matches.filter(item => key(item.result.id) === key(result.id)).map(item => <li key={item.answers.join("/")}>{item.selections.slice(1).map(selection => selection.answer).join(" · ")}</li>)}</ul>
          <p>{result.body}</p><p>{result.note}</p>
          <TaskPlan steps={setupPlan(result).steps} />
        </details>)}
      </details>;
    })}
  </section>;
}

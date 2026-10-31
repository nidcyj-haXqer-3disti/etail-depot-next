import { industryCases } from "@/modules/public-site/industry-content";

type IndustryCase = typeof industryCases[keyof typeof industryCases];

export function IndustryWorkflow({ page }: { page: IndustryCase }) {
  return <details className="platform-case-details">
    <summary aria-label={`${page.label}: payment flow and account requirements`}>Payment flow and account requirements<span className="platform-case-toggle" aria-hidden="true">+</span></summary>
    <div className="platform-case-expanded">
      <p className="platform-case-context">{page.intro}</p><h4>{page.workflowTitle}</h4>
      <ol className="platform-case-steps">{page.workflow.map((step, i) => <li key={step.title}><span className="platform-step-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><div><h5>{step.title}</h5><p>{step.body}</p></div></li>)}</ol>
      <div className="platform-case-scope"><h4>{page.scopeTitle}</h4><p>{page.scope}</p></div>
    </div>
  </details>;
}

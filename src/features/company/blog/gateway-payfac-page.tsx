import { BlogArticlePage } from "./article-page";
import { gatewayPayfacArticle, gatewayPayfacBody as body } from "./gateway-payfac-content";
import s from "./blog.module.css";

export function GatewayPayfacPage() {
  return <BlogArticlePage article={gatewayPayfacArticle}>
    {body.sections.map(section => <section id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
      <h2 id={`${section.id}-title`} data-source-block>{section.title}</h2>
      {section.paragraphs.map(paragraph => <p key={paragraph} data-source-block>{paragraph}</p>)}
      {section.comparison && <table className={s.comparison}>
        <caption>Payment gateway and payment facilitator</caption>
        <thead><tr><th scope="col">Responsibility</th><th scope="col">Payment gateway</th><th scope="col">Payment facilitator</th></tr></thead>
        <tbody>{section.comparison.map(([label, gateway, facilitator]) => <tr key={label}>
          <th scope="row" data-source-block>{label}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Payment gateway</span><span data-source-block>{gateway}</span></td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Payment facilitator</span><span data-source-block>{facilitator}</span></td>
        </tr>)}</tbody>
      </table>}
    </section>)}
  </BlogArticlePage>;
}

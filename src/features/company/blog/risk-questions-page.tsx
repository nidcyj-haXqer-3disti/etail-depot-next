import { BlogArticlePage } from "./article-page";
import { riskQuestionsArticle, riskQuestionsBody as body } from "./risk-questions-content";
import s from "./risk-questions.module.css";

function ArticleParagraph({ text, lead }: { text: string; lead: string }) {
  return <p data-source-block>{lead && <strong>{lead}</strong>}{text.slice(lead.length)}</p>;
}

export function RiskQuestionsPage() {
  return <BlogArticlePage article={riskQuestionsArticle}>
    {body.intro.map(paragraph => <ArticleParagraph key={paragraph.text} {...paragraph} />)}
    {body.sections.map(section => <section id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
      <h2 id={`${section.id}-title`} data-source-block>{section.title}</h2>
      {section.blocks.map((block, index) => block.type === "paragraph"
        ? <ArticleParagraph key={index} {...block} />
        : <div className={s.matrix} key={index}><table aria-labelledby={`${section.id}-title`}>
          <thead><tr>
            <th scope="col"><span data-source-block>{block.headers[0]}</span> <span data-source-block>{block.headers[1]}</span></th>
            {block.headers.slice(2).map(label => <th scope="col" key={label} data-source-block>{label}</th>)}
          </tr></thead>
          <tbody>{block.rows.map(([number, question, ...answers]) => <tr key={number}>
            <th scope="row"><span className={s.number} data-source-block>{number}</span> <span data-source-block>{question}</span></th>
            {answers.map((answer, i) => <td key={block.headers[i + 2]}>
              <span className={s.label} aria-hidden="true">{block.headers[i + 2]}</span>
              <span data-source-block>{answer}</span>
            </td>)}
          </tr>)}</tbody>
        </table></div>
      )}
    </section>)}
  </BlogArticlePage>;
}

import { BlogArticlePage } from "./article-page";
import { riversidePaymentsArticle, riversidePaymentsBody as body } from "./content";
import s from "./blog.module.css";

export function RiversidePaymentsPage() {
  const [columns, ...rows] = body.comparison;
  return <BlogArticlePage article={riversidePaymentsArticle}>
    {body.intro.map(paragraph => <p key={paragraph} data-source-block>{paragraph}</p>)}
    {body.sections.map(section => <section id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
      <h2 id={`${section.id}-title`} data-source-block>{section.title}</h2>
      {section.paragraphs.map(paragraph => <p key={paragraph} data-source-block>{paragraph}</p>)}
    </section>)}
    <section id="the-two-models" aria-labelledby="the-two-models-title">
      <h2 id="the-two-models-title" data-source-block>{body.comparisonTitle}</h2>
      <table className={s.comparison} role="table" aria-labelledby="the-two-models-title">
        <thead role="rowgroup"><tr role="row">{columns.map(column => <th role="columnheader" scope="col" key={column} data-source-block>{column}</th>)}</tr></thead>
        <tbody role="rowgroup">{rows.map(([topic, ...cells]) => <tr role="row" key={topic}>
          <th role="rowheader" scope="row" data-source-block>{topic}</th>
          {cells.map((cell, index) => <td role="cell" key={index}>
            <span className={s.comparisonLabel} aria-hidden="true">{columns[index + 1]}</span>
            <span data-source-block>{cell}</span>
          </td>)}
        </tr>)}</tbody>
      </table>
    </section>
    <section id="before-you-sign" aria-labelledby="before-you-sign-title">
      <h2 id="before-you-sign-title" data-source-block>{body.closingTitle}</h2>
      {body.closing.map(paragraph => <p key={paragraph} data-source-block>{paragraph}</p>)}
      <section id="article-sources" aria-labelledby="article-sources-title" className={s.sources}>
        <h2 id="article-sources-title" data-source-block>{body.sourcesTitle}</h2>
        <ul>{body.sources.map((parts, index) => <li key={index} data-source-block>{parts.map((part, partIndex) => part.href
          ? <a key={partIndex} href={part.href} rel="noopener noreferrer">{part.text}</a>
          : <span key={partIndex}>{part.text}</span>)}</li>)}</ul>
      </section>
    </section>
  </BlogArticlePage>;
}

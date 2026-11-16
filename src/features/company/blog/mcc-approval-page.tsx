import { BlogArticlePage } from "./article-page";
import { mccApprovalArticle, mccApprovalBody as body } from "./mcc-approval-content";

function ArticleParagraph({ text, lead }: { text: string; lead: string }) {
  return <p data-source-block>{lead && <strong>{lead}</strong>}{text.slice(lead.length)}</p>;
}

export function MccApprovalPage() {
  return <BlogArticlePage article={mccApprovalArticle}>
    {body.intro.map(paragraph => <ArticleParagraph key={paragraph.text} {...paragraph} />)}
    {body.sections.map(section => <section id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
      <h2 id={`${section.id}-title`} data-source-block>{section.title}</h2>
      {section.paragraphs.map(paragraph => <ArticleParagraph key={paragraph.text} {...paragraph} />)}
    </section>)}
  </BlogArticlePage>;
}

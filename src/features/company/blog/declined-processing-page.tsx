import { BlogArticlePage } from "./article-page";
import { declinedProcessingArticle, declinedProcessingBody as body } from "./content";

export function DeclinedProcessingPage() {
  return <BlogArticlePage article={declinedProcessingArticle}>
    <p data-source-block>{body.intro}</p>
    {body.sections.map(section => <section id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
      <h2 id={`${section.id}-title`} data-source-block>{section.title}</h2>
      {section.paragraphs.map(paragraph => <p key={paragraph} data-source-block>{paragraph}</p>)}
    </section>)}
  </BlogArticlePage>;
}

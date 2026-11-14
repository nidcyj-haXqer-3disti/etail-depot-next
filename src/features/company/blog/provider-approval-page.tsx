import { BlogArticlePage } from "./article-page";
import { providerApprovalArticle, providerApprovalBody as body } from "./content";

export function ProviderApprovalPage() {
  return <BlogArticlePage article={providerApprovalArticle}>
    {body.intro.map(paragraph => <p key={paragraph} data-source-block>{paragraph}</p>)}
    {body.sections.map(section => <section id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
      <h2 id={`${section.id}-title`} data-source-block>{section.title}</h2>
      {section.paragraphs.map(paragraph => <p key={paragraph} data-source-block>{paragraph}</p>)}
    </section>)}
  </BlogArticlePage>;
}

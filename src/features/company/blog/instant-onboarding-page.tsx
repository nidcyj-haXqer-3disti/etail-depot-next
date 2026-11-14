import { BlogArticlePage } from "./article-page";
import { instantOnboardingArticle, instantOnboardingParagraphs } from "./content";

export function InstantOnboardingPage() {
  return <BlogArticlePage article={instantOnboardingArticle}>
    {instantOnboardingParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
  </BlogArticlePage>;
}

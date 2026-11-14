import { BlogArticlePage } from "./article-page";
import { riskCommunicationArticle, riskCommunicationParagraphs } from "./content";

export function RiskCommunicationPage() {
  return <BlogArticlePage article={riskCommunicationArticle}>
    {riskCommunicationParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
  </BlogArticlePage>;
}

import { BlogArticlePage } from "./article-page";
import { merchantSupportArticle, merchantSupportParagraphs } from "./content";

export function MerchantSupportPage() {
  return <BlogArticlePage article={merchantSupportArticle}>
    {merchantSupportParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
  </BlogArticlePage>;
}

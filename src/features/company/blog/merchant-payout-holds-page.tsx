import { BlogArticlePage } from "./article-page";
import { merchantPayoutHoldsArticle, merchantPayoutHoldsParagraphs } from "./content";

export function MerchantPayoutHoldsPage() {
  return <BlogArticlePage article={merchantPayoutHoldsArticle}>
    {merchantPayoutHoldsParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
  </BlogArticlePage>;
}

import { BlogArticlePage } from "./article-page";
import { frozenFundsArticle, frozenFundsParagraphs } from "./content";

export function FrozenFundsPage() {
  return <BlogArticlePage article={frozenFundsArticle}>
    {frozenFundsParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
  </BlogArticlePage>;
}

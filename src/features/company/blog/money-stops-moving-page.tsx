import { BlogArticlePage } from "./article-page";
import { moneyStopsMovingArticle, moneyStopsMovingBody } from "./content";

export function MoneyStopsMovingPage() {
  return <BlogArticlePage article={moneyStopsMovingArticle}>
    <p>{moneyStopsMovingBody.opening}</p>
    <section aria-labelledby="merchant-side">
      <h2 id="merchant-side">{moneyStopsMovingBody.heading}</h2>
      {moneyStopsMovingBody.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </section>
  </BlogArticlePage>;
}

import { BlogArticlePage } from "./article-page";
import { cardBrandArticle, cardBrandBody as body } from "./card-brand-content";

function ArticleText({ text, lead }: { text: string; lead: string }) {
  return <>{lead && <strong>{lead}</strong>}{text.slice(lead.length)}</>;
}

export function CardBrandPage() {
  return <BlogArticlePage article={cardBrandArticle}>
    {body.sections.map(section => <section id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
      <h2 id={`${section.id}-title`} data-source-block>{section.title}</h2>
      {section.blocks.map((block, index) => {
        if (block.type === "paragraph") return <p key={index} data-source-block><ArticleText {...block} /></p>;
        const List = block.type === "ol" ? "ol" : "ul";
        return <List key={index}>{block.items.map(item => <li key={item.text} data-source-block><ArticleText {...item} /></li>)}</List>;
      })}
    </section>)}
  </BlogArticlePage>;
}

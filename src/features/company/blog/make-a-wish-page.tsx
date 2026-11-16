import { Fragment } from "react";
import { BlogArticlePage } from "./article-page";
import { makeAWishArticle, makeAWishBody as body } from "./make-a-wish-content";

function ArticleParagraph({ text }: { text: string }) {
  const address = "trolleys@etaildepot.com";
  return <p data-source-block>{text.split(address).map((part, index) => <Fragment key={index}>
    {index > 0 && <a href={`mailto:${address}`}>{address}</a>}{part}
  </Fragment>)}</p>;
}

export function MakeAWishPage() {
  return <BlogArticlePage article={makeAWishArticle}>
    {body.intro.map(paragraph => <ArticleParagraph key={paragraph} text={paragraph} />)}
    {body.sections.map(section => <section id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
      <h2 id={`${section.id}-title`} data-source-block>{section.title}</h2>
      {section.blocks.map((block, index) => {
        if (block.type === "paragraph") return <ArticleParagraph key={index} text={block.text} />;
        const List = block.type === "ol" ? "ol" : "ul";
        return <List key={index}>{block.items.map(item => <li key={item} data-source-block>{item}</li>)}</List>;
      })}
    </section>)}
  </BlogArticlePage>;
}

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Shell } from "@/shared/layout/shell";
import { ResponsiveContentsFocus } from "@/shared/ui/responsive-contents-focus";
import { articleDate, relatedArticles, type BlogArticle } from "./content";
import { articleJsonLd } from "./metadata";
import s from "./blog.module.css";

/** Presentation only. The route supplies editorial copy as children. */
type ArticleProps = { article: BlogArticle; children: ReactNode };

export function BlogArticlePage({ article, children }: ArticleProps) {
  return <Shell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd(article) }} />
    <BlogArticleContent article={article}>{children}</BlogArticleContent>
    {article.sections.length > 0 ? <ResponsiveContentsFocus rootSelector="[data-reading-article]" desktopSelector="[data-article-contents]" mobileSelector="[data-article-mobile-contents]" breakpoint={760} /> : null}
  </Shell>;
}

export function BlogArticleContent({ article, children }: ArticleProps) {
  const related = relatedArticles(article);
  const sectionLinks = <ol>{article.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol>;
  return <div className={`${s.page} ${s.article}`}><article data-reading-article>
      <header className={`${s.articleHeader} ${article.sections.length ? s.withContentsHeader : ""}`}>
        <Link className={s.backLink} prefetch={false} href="/company/blog"><span aria-hidden="true">←</span> All articles</Link>
        {(article.publishedAt || article.readingTime) && <p className={s.articleMeta}>{article.publishedAt && <time dateTime={article.publishedAt}>{articleDate(article.publishedAt)}</time>}{article.readingTime && <span>{article.readingTime}</span>}</p>}
        <h1>{article.title}</h1>
        <div className={s.attribution}>
          <p className={s.byline}>By {article.author.url ? <a rel="author" href={article.author.url}>{article.author.name}</a> : article.author.name}</p>
          {article.updatedAt && <p className={s.updated}>Updated <time dateTime={article.updatedAt}>{articleDate(article.updatedAt)}</time></p>}
        </div>
        <p className={s.articleDeck}>{article.description}</p>
      </header>
      {article.cover && <figure className={s.articleCover}><Image src={article.cover.src} width={article.cover.width} height={article.cover.height} alt={article.cover.alt} loading="eager" sizes="(max-width: 760px) 100vw, 1020px" />{article.cover.caption && <figcaption>{article.cover.caption}</figcaption>}</figure>}
      <div className={`${s.readingLayout} ${article.sections.length ? "" : s.withoutContents}`}>
        {article.sections.length > 0 && <aside className={s.contents} data-article-contents aria-label="Article contents"><nav aria-label="In this article"><p>In this article</p>{sectionLinks}</nav></aside>}
        <div className={s.body}>
          {article.sections.length > 0 && <details className={s.mobileContents} data-article-mobile-contents><summary>In this article <span aria-hidden="true">⌄</span></summary><nav aria-label="In this article">{sectionLinks}</nav></details>}
          {children}
          {article.sources?.length ? <aside className={s.sources} aria-label="Sources">
            <h2>Sources</h2>
            <ul>{article.sources.map(source => <li key={source.href}><a href={source.href} rel={source.href.startsWith("https://") ? "noopener noreferrer" : undefined}>{source.label}</a></li>)}</ul>
          </aside> : null}
          <div className={s.articleEnd}><Link className={s.textLink} prefetch={false} href="/company/blog"><span aria-hidden="true">←</span> Back to the Blog</Link></div>
        </div>
      </div>
    </article>
    {related.length > 0 && <aside className={`${s.related} ${article.sections.length ? s.withContentsRelated : ""}`} aria-labelledby="related-articles-title">
      <h2 id="related-articles-title">Continue reading</h2>
      <ul>{related.map(entry => <li key={entry.path}>
        <Link prefetch={false} href={entry.path}>{entry.title}</Link>
      </li>)}</ul>
    </aside>}
  </div>;
}

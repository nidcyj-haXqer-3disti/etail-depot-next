import Image from "next/image";
import Link from "next/link";
import { Shell } from "@/shared/layout/shell";
import { articleDate, blogArticles, type BlogArticle } from "./content";
import { pageJsonLd } from "./metadata";
import s from "./blog.module.css";

export function BlogPage() {
  return <Shell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageJsonLd() }} />
    <BlogIndexContent articles={blogArticles} />
  </Shell>;
}

/** Render only the exact editorial registry; drafts retain their noindex boundary. */
export function BlogIndexContent({ articles: entries }: { articles: readonly BlogArticle[] }) {
  const [featured, ...articles] = entries;
  return <div className={s.page}>
      <header className={s.heading}>
        <p className={s.eyebrow}>Company</p>
        <h1>Etail Depot Blog</h1>
      </header>
      {featured ? <>
        <article className={`${s.featured} ${featured.cover ? s.withCover : s.textOnly}`} aria-labelledby="featured-article-title">
          <div className={s.featuredCopy}>
            {featured.publishedAt && <p className={s.articleMeta}><time dateTime={featured.publishedAt}>{articleDate(featured.publishedAt)}</time></p>}
            <h2 id="featured-article-title"><a href={featured.path}>{featured.title}</a></h2>
            <p className={s.summary}>{featured.summary}</p>
            <p className={s.featuredByline}>By {featured.author.name}</p>
          </div>
          {featured.cover && <a className={s.coverLink} href={featured.path} aria-label={`Read: ${featured.title}`}><Image src={featured.cover.src} width={featured.cover.width} height={featured.cover.height} alt={featured.cover.alt} loading="eager" sizes="(max-width: 760px) 100vw, 60vw" /></a>}
        </article>
        {articles.length > 0 && <section className={s.latest} aria-labelledby="latest-title">
          <h2 id="latest-title">More articles</h2>
          <div className={s.articleGrid}>{articles.map((article, index) => <article key={article.path}>
            {article.cover && <a className={s.cardCover} href={article.path} aria-label={`Read: ${article.title}`}><Image src={article.cover.src} width={article.cover.width} height={article.cover.height} alt={article.cover.alt} loading="lazy" sizes="(max-width: 760px) 100vw, 50vw" /></a>}
            {article.publishedAt ? <p className={s.articleMeta}><time dateTime={article.publishedAt}>{articleDate(article.publishedAt)}</time></p> : articles[index % 2 === 0 ? index + 1 : index - 1]?.publishedAt ? <div className={`${s.articleMeta} ${s.datePlaceholder}`} aria-hidden="true" /> : null}
            <h3><a href={article.path}>{article.title}</a></h3>
            <p className={s.cardSummary}>{article.summary}</p>
            <p className={s.cardByline}>By {article.author.name}</p>
          </article>)}</div>
        </section>}
      </> : <section className={s.empty} aria-labelledby="blog-empty-title">
        <h2 id="blog-empty-title">Articles are coming soon.</h2>
        <Link className={s.textLink} prefetch={false} href="/">Back to home <span aria-hidden="true">→</span></Link>
      </section>}
    </div>;
}

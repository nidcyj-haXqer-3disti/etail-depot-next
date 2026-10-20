"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { GUIDE_TOPICS, PUBLISHED_GUIDES, paginateGuides, searchGuides } from "@/modules/public-site/guide-catalog";
import "./guide-library.css";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function GuideLibrary() {
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [sort, setSort] = useState<"recommended" | "title">("recommended");
  const [page, setPage] = useState(1);
  const search = useRef<HTMLInputElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const topics = GUIDE_TOPICS.map(item => ({ ...item, count: PUBLISHED_GUIDES.filter(guide => guide.topic === item.id).length }));
  const matches = useMemo(() => searchGuides(PUBLISHED_GUIDES, { query, topic, sort }), [query, topic, sort]);
  const results = paginateGuides(matches, page);
  const selectedTopic = topics.find(item => item.id === topic);
  const filtered = Boolean(query.trim() || topic !== "all");

  function reset() {
    setQuery(""); setTopic("all"); setPage(1);
    search.current?.focus();
  }

  function changeTopic(next: string) {
    setTopic(next); setPage(1);
  }

  function changePage(next: number) {
    setPage(next);
    resultsHeading.current?.focus();
    resultsHeading.current?.scrollIntoView({ block: "start" });
  }

  return <div className="guide-library">
    <header className="guide-library-header">
      <div className="page-container">
        <nav className="payment-guide-breadcrumb" aria-label="Breadcrumb">
          <ol><li><Link href="/">Home</Link></li><li aria-current="page">Guides</li></ol>
        </nav>
        <div className="guide-library-header-grid">
        <div className="guide-library-heading">
          <h1>Guides</h1>
          <p>Clear answers to payment and business questions.</p>
        </div>
        <div className="guide-library-search" role="search" aria-label="Guides">
          <label htmlFor="guide-search">Search guides</label>
          <div className="guide-library-search-field">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>
            <input ref={search} id="guide-search" type="search" autoComplete="off" maxLength={160} placeholder="Search a topic or question" aria-controls="guide-results" value={query} disabled={!ready} onChange={event => { setQuery(event.target.value); setPage(1); }} />
            {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); setPage(1); search.current?.focus(); }}>Clear</button>}
          </div>
        </div>
        </div>
      </div>
    </header>
    <div className="page-container guide-library-layout">
      <aside className="guide-library-topics" aria-labelledby="guide-topics-title">
        <h2 id="guide-topics-title">Browse by topic</h2>
        <select className="guide-library-topic-select" aria-labelledby="guide-topics-title" aria-controls="guide-results" value={topic} disabled={!ready} onChange={event => changeTopic(event.target.value)}>
          <option value="all">All topics ({PUBLISHED_GUIDES.length})</option>
          {topics.map(item => <option value={item.id} key={item.id}>{item.label} ({item.count})</option>)}
        </select>
        <ul>
          <li><button type="button" disabled={!ready} aria-pressed={topic === "all"} onClick={() => changeTopic("all")}><span>All topics</span><span className="guide-library-count" aria-hidden="true">{PUBLISHED_GUIDES.length}</span></button></li>
          {topics.map(item => <li key={item.id}><button type="button" disabled={!ready} aria-pressed={topic === item.id} onClick={() => changeTopic(item.id)}><span>{item.label}</span><span className="guide-library-count" aria-hidden="true">{item.count}</span></button></li>)}
        </ul>
      </aside>
      <section id="guide-results" className="guide-library-results" aria-labelledby="guide-results-title">
        <div className="guide-library-toolbar">
          <div>
            <h2 id="guide-results-title" ref={resultsHeading} tabIndex={-1}>{query.trim() ? "Search results" : selectedTopic?.label ?? "All guides"}</h2>
            <p role="status" aria-live="polite" aria-atomic="true">{results.total} {results.total === 1 ? "guide" : "guides"}{query.trim() ? ` for “${query.trim()}”` : ""}</p>
          </div>
          <div className="guide-library-filters">
            {filtered && <button className="guide-library-reset" type="button" onClick={reset}>Clear filters</button>}
            <div><label htmlFor="guide-sort">Sort by</label><select id="guide-sort" value={sort} disabled={!ready} onChange={event => { setSort(event.target.value === "title" ? "title" : "recommended"); setPage(1); }}><option value="recommended">Suggested</option><option value="title">Title A–Z</option></select></div>
          </div>
        </div>
        {results.items.length ? <ul className="guide-library-list">
          {results.items.map(guide => <li key={guide.path}><Link href={guide.path} className="guide-library-card" prefetch={false}>
            <div className="guide-library-card-copy"><h3>{guide.title}</h3><p className="guide-library-summary">{guide.description}</p></div>
            <span className="guide-library-arrow" aria-hidden="true">→</span>
          </Link></li>)}
        </ul> : <div className="guide-library-empty"><h3>{selectedTopic?.count === 0 ? "No guides in this section yet" : "No guides found"}</h3><p>{selectedTopic?.count === 0 ? "Browse another topic to read the guides available now." : "Try a shorter phrase or clear the filters to browse all guides."}</p><button type="button" onClick={reset}>Show all guides</button></div>}
        {results.totalPages > 1 && <nav className="guide-library-pagination" aria-label="Guide result pages"><button type="button" disabled={results.page <= 1} onClick={() => changePage(results.page - 1)}>Previous</button><span>Page {results.page} of {results.totalPages}</span><button type="button" disabled={results.page >= results.totalPages} onClick={() => changePage(results.page + 1)}>Next</button></nav>}
      </section>
    </div>
  </div>;
}

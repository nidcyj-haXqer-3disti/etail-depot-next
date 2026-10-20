"use client";

import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { GUIDE_TOPICS, PUBLISHED_GUIDES, type GuideTopicId } from "@/modules/public-site/guide-catalog";
import "./guide-library.css";

type Topic = GuideTopicId | "all";
const topicChangeEvent = "guide-topic-change";
const topics = GUIDE_TOPICS.map(topic => ({
  ...topic,
  count: PUBLISHED_GUIDES.filter(guide => guide.topic === topic.id).length,
}));

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener(topicChangeEvent, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(topicChangeEvent, onChange);
  };
}

function getTopic(): Topic {
  return GUIDE_TOPICS.find(topic => window.location.hash === `#topic=${topic.id}`)?.id ?? "all";
}

// Static HTML includes every guide; the fragment is read only after hydration.
const getServerTopic = () => null;

function changeTopic(value: string) {
  const topic = GUIDE_TOPICS.find(item => item.id === value)?.id;
  const hash = topic ? `#topic=${topic}` : "";
  if (window.location.hash === hash) return;
  window.history.pushState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
  // pushState does not emit hashchange or popstate.
  window.dispatchEvent(new Event(topicChangeEvent));
}

export function GuideLibrary() {
  const snapshot = useSyncExternalStore<Topic | null>(subscribe, getTopic, getServerTopic);
  const topic = snapshot ?? "all";
  const ready = snapshot !== null;
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const selectedTopic = topics.find(item => item.id === topic);
  const guides = topic === "all" ? PUBLISHED_GUIDES : PUBLISHED_GUIDES.filter(guide => guide.topic === topic);

  function showAllGuides() {
    changeTopic("all");
    resultsHeading.current?.focus();
  }

  return <div className="guide-library">
    <header className="guide-library-header">
      <div className="page-container">
        <nav className="payment-guide-breadcrumb" aria-label="Breadcrumb">
          <ol><li><Link href="/">Home</Link></li><li aria-current="page">Guides</li></ol>
        </nav>
        <div className="guide-library-heading">
          <h1>Guides</h1>
          <p>Clear answers to payment and business questions.</p>
        </div>
      </div>
    </header>
    <div className="page-container guide-library-layout">
      <aside className="guide-library-topics" aria-labelledby="guide-topics-title">
        <h2 id="guide-topics-title">Browse by topic</h2>
        <select className="guide-library-topic-select" aria-labelledby="guide-topics-title" aria-controls="guide-results" value={topic} disabled={!ready} onChange={event => changeTopic(event.target.value)}>
          <option value="all">All guides ({PUBLISHED_GUIDES.length})</option>
          {topics.map(item => <option value={item.id} key={item.id}>{item.label} ({item.count})</option>)}
        </select>
        <ul>
          <li><button type="button" disabled={!ready} aria-pressed={topic === "all"} aria-controls="guide-results" onClick={() => changeTopic("all")}><span>All guides</span><span className="guide-library-count" aria-hidden="true">{PUBLISHED_GUIDES.length}</span></button></li>
          {topics.map(item => <li key={item.id}><button type="button" disabled={!ready} aria-pressed={topic === item.id} aria-controls="guide-results" onClick={() => changeTopic(item.id)}><span>{item.label}</span><span className="guide-library-count" aria-hidden="true">{item.count}</span></button></li>)}
        </ul>
      </aside>
      <section id="guide-results" className="guide-library-results" aria-labelledby="guide-results-title">
        <div className="guide-library-toolbar">
          <h2 id="guide-results-title" ref={resultsHeading} tabIndex={-1}>{selectedTopic?.label ?? "All guides"}</h2>
          <p role="status" aria-live="polite" aria-atomic="true">{guides.length} {guides.length === 1 ? "guide" : "guides"}</p>
        </div>
        {guides.length ? <ul className="guide-library-list">
          {guides.map(guide => <li key={guide.path}><Link href={guide.path} className="guide-library-card" prefetch={false}>
            <div className="guide-library-card-copy"><h3>{guide.title}</h3><p className="guide-library-summary">{guide.description}</p></div>
            <span className="guide-library-arrow" aria-hidden="true">→</span>
          </Link></li>)}
        </ul> : <div className="guide-library-empty">
          <h3>No guides in this section yet</h3>
          <p>Browse another topic to read the guides available now.</p>
          <button type="button" onClick={showAllGuides}>All guides</button>
        </div>}
      </section>
    </div>
  </div>;
}

import Link from "next/link";
import { StandardsCollections } from "./standards-collections";
import "./guide-directory.css";

export function GuideDirectory() {
  return <div className="guides-directory page-container">
    <header className="guides-directory-heading"><h1>Payment code reference</h1><p className="guides-directory-intro">Find a code’s meaning, read a payment message or check a field format. Choose the collection that matches your source.</p></header>
    <StandardsCollections />
    <aside className="guides-implementation" aria-labelledby="guides-implementation-title">
      <div><h2 id="guides-implementation-title">Looking for implementation steps?</h2><p>Documentation covers merchant account setup, checkout connections and payment operations.</p></div>
      <Link href="/docs">Open documentation<span aria-hidden="true">→</span></Link>
    </aside>
  </div>;
}

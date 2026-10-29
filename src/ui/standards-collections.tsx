import Link from "next/link";
import "./standards-collections.css";

export function StandardsCollections() {
  return <section className="standards-collections" aria-label="Reference collections">
    <div className="standards-collections-grid">
      <Link href="/guides/iso-20022" prefetch={false}><span className="standards-collection-tag">Financial messaging</span><h2>ISO 20022</h2><p>Published definitions across 140 external code sets, with message references and source releases.</p><span className="standards-collection-open">Browse ISO 20022 <span aria-hidden="true">→</span></span></Link>
      <Link href="/guides/iso-8583" prefetch={false}><span className="standards-collection-tag">Card payment messages</span><h2>ISO 8583</h2><p>An independent implementation reference for message types, field formats, byte encoding and bitmaps.</p><span className="standards-collection-open">Browse ISO 8583 <span aria-hidden="true">→</span></span></Link>
    </div>
  </section>;
}

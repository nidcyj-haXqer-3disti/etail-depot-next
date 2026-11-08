import Link from "next/link";
import "./standards-collections.css";

export function StandardsCollections() {
  return <section className="standards-collections" aria-label="Reference collections">
    <div className="standards-collections-grid">
      <Link href="/resources/guides/iso-20022" prefetch={false}><span className="standards-collection-tag">Financial messaging</span><h2>ISO 20022</h2><p>Look up a code within its external code set. Find its definition, message references and source release across 140 sets.</p><div className="standards-collection-art" aria-hidden="true"><span>Code set</span><i>→</i><span>Code</span><i>→</i><strong>Definition</strong></div></Link>
      <Link href="/resources/guides/iso-8583" prefetch={false}><span className="standards-collection-tag">Card payment messages</span><h2>ISO 8583</h2><p>Explore message types, fields and bitmaps, with independent explanations and clearly identified sources.</p><div className="standards-collection-art standards-message-art" aria-hidden="true"><strong>Message</strong><i>→</i><span>Bitmap</span><i>→</i><span>Fields</span></div></Link>
    </div>
  </section>;
}

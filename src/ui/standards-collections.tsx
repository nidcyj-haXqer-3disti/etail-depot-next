import Link from "next/link";
import "./standards-collections.css";

export function StandardsCollections() {
  return <section className="standards-collections" aria-labelledby="standards-collections-title">
    <div className="standards-collections-heading"><h2 id="standards-collections-title">Payment references</h2></div>
    <div className="standards-collections-grid">
      <Link href="/guides/iso-20022" prefetch={false}><span className="standards-collection-tag">Financial messaging</span><h3>ISO 20022</h3><p>Browse 140 external code sets, with definitions, message references and source release details.</p><span className="standards-collection-open">Browse ISO 20022 <span aria-hidden="true">→</span></span></Link>
      <Link href="/guides/iso-8583" prefetch={false}><span className="standards-collection-tag">Card payment messages</span><h3>ISO 8583</h3><p>Read message types and field formats through an independent reference to open source implementations.</p><span className="standards-collection-open">Browse ISO 8583 <span aria-hidden="true">→</span></span></Link>
    </div>
  </section>;
}

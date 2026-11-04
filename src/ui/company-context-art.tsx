import { brandSymbol } from "./artwork-assets";
import Image from "next/image";
import { legalIdentity } from "@/shared/legal-identity";
import { Icon } from "./icon";
import styles from "./company-reference-art.module.css";

export function CompanyContextArt({ kind }: { kind: "company" | "trust" | "facilitator" }) {
  if (kind === "company") return <figure className={styles.art} aria-label="Etail Depot merchant services, software partnerships and card services.">
    <div className={styles.surface}>
      <div className={styles.brand}><Image src={brandSymbol} alt="" width={80} height={49} unoptimized preload /><div><strong>Etail Depot</strong><span>{legalIdentity.company}</span></div></div>
      <div className={styles.merchant}><div className={styles.merchantHeading}><Icon name="business" /><strong>Merchant services</strong></div><div className={styles.functions}><span><Icon name="business" />Account setup</span><span><Icon name="card" />Checkout</span><span><Icon name="document" />Reporting</span></div></div>
      <div className={styles.related}><div><Icon name="layers" /><strong>Software platforms</strong><p>Merchant services connected to your software.</p></div><div><Icon name="card" /><strong>Card services</strong><p>A virtual secured credit card account.</p></div></div>
    </div>
    <figcaption>Merchant and card services have separate account terms.</figcaption>
  </figure>;
  if (kind === "trust") return <figure className={styles.art} aria-label="Service documents: account agreement, security documentation and privacy notice.">
    <div className={styles.documents}><div className={styles.documentHeader}><Icon name="document" /><strong>Your service documents.</strong></div><ul className={styles.documentList}>
      {[{ icon: "document", title: "Account agreement", text: "Services, permitted activity and commercial terms." }, { icon: "lock", title: "Security documentation", text: "Provider, systems covered and review period." }, { icon: "person", title: "Privacy notice", text: "How information is used and how to exercise your rights." }].map(item => <li key={item.title}><span className={styles.documentSymbol}><Icon name={item.icon} /></span><div><strong>{item.title}</strong><p>{item.text}</p></div></li>)}
    </ul></div><figcaption>Check each document’s scope against the service you use.</figcaption>
  </figure>;
  return <figure className="company-context-art facilitator-context">
    <div className="context-art-heading"><Icon name="layers" /><h2>The merchant service relationship</h2></div>
    <div className="facilitator-relationship"><div><Icon name="business" /><h3>Merchant</h3><p>The sale and customer relationship</p></div><div className="facilitator-etail"><Image src={brandSymbol} alt="" width={800} height={484} unoptimized preload /><h3>Etail Depot</h3><p>Merchant service and payment facilitation</p></div><div><Icon name="bank" /><h3>Acquiring partner</h3><p>The acquiring arrangement</p></div></div>
    <div className="facilitator-network-context"><div><span>Card network</span><p>Participation and transaction rules</p></div><div><span>Card issuer</span><p>The customer’s card account</p></div></div>
    <figcaption>This diagram shows the participants in a card payment. Card messages and settlement follow the applicable network rules and account agreements.</figcaption>
  </figure>;
}

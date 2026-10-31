import Image from "next/image";
import { legalIdentity } from "@/shared/legal-identity";
import { Icon } from "./icon";

export function CompanyContextArt({ kind }: { kind: "company" | "trust" | "facilitator" }) {
  if (kind === "company") return <figure className="company-context-art company-identity">
    <div className="company-identity-name"><Image src="/brand/symbol.png" alt="" width={800} height={484} unoptimized /><div><span>Etail Depot</span><strong>{legalIdentity.company}</strong></div></div>
    <div className="company-identity-services"><div><Icon name="business" /><h2>Merchant services</h2><p>Account setup, online checkout and reporting.</p></div><div><Icon name="layers" /><h2>Software partnerships</h2><p>Merchant services connected to your software.</p></div></div>
    <figcaption><span>Card services</span><p>A separate secured credit card account.</p></figcaption>
  </figure>;
  if (kind === "trust") return <figure className="company-context-art trust-documents">
    <div className="context-art-heading"><Icon name="document" /><h2>Your service documents.</h2></div>
    <dl><div><dt>Account agreement</dt><dd>The service, permitted activity and commercial terms.</dd></div><div><dt>Security documentation</dt><dd>The named provider, systems covered and review period.</dd></div><div><dt>Privacy notice</dt><dd>How information is used and how to exercise your rights.</dd></div></dl>
    <figcaption>Check the scope of each document against the service you use.</figcaption>
  </figure>;
  return <figure className="company-context-art facilitator-context">
    <div className="context-art-heading"><Icon name="layers" /><h2>The merchant service relationship</h2></div>
    <div className="facilitator-relationship"><div><Icon name="business" /><h3>Merchant</h3><p>The sale and customer relationship</p></div><div className="facilitator-etail"><Image src="/brand/symbol.png" alt="" width={800} height={484} unoptimized /><h3>Etail Depot</h3><p>Merchant service and payment facilitation</p></div><div><Icon name="bank" /><h3>Acquiring partner</h3><p>The acquiring arrangement</p></div></div>
    <div className="facilitator-network-context"><div><span>Card network</span><p>Participation and transaction rules</p></div><div><span>Card issuer</span><p>The customer’s card account</p></div></div>
    <figcaption>Participant relationships, not a flow of funds. Card messages and settlement follow the applicable network rules and account agreements.</figcaption>
  </figure>;
}

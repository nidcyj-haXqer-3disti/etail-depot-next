import Link from "next/link";
import { legalPageMetadata } from "@/modules/public-site/legal-metadata";
import { legalDocumentGroups, legalDocuments } from "@/modules/public-site/legal-center";
import { legalIdentity } from "@/shared/legal-identity";
import { Shell } from "@/ui/shell";
import "@/ui/legal-document.css";
export const metadata = legalPageMetadata("/legal");
export default function Page() {
  return <Shell><div className="legal-center">
    <header className="legal-center-hero page-container">
      <h1>Legal</h1>
      <p>Merchant service terms, privacy and security by region.</p>
    </header>
    <div className="page-container legal-center-body">
      <section className="legal-center-region" aria-labelledby="united-states">
        <h2 id="united-states">United States</h2>
        {legalDocumentGroups.map(group => <section className="legal-center-group" key={group.title} aria-labelledby={`group-${group.title.replaceAll(" ", "").toLowerCase()}`}>
          <div><h3 id={`group-${group.title.replaceAll(" ", "").toLowerCase()}`}>{group.title}</h3><p>{group.description}</p></div>
          <div className="legal-center-links">{legalDocuments.filter(document => document.group === group.title).map(document => <Link href={`/legal/${document.slug}`} key={document.slug}><h4>{document.title}</h4><p>{document.description}</p></Link>)}</div>
        </section>)}
      </section>
      <section className="legal-center-region legal-center-region-upcoming" aria-labelledby="international">
        <h2 id="international">International</h2>
        <p>Coming soon</p>
      </section>
      <section className="legal-center-group" aria-labelledby="website-documents"><div><h2 id="website-documents">Website</h2><p>For visitors to etaildepot.com.</p></div><div className="legal-center-links">
        <Link href="/terms"><h3>Website Terms of Use</h3><p>Using our website, documentation, Guides and tools.</p></Link>
        <Link href="/privacy"><h3>Website Privacy Policy</h3><p>Information handled when you browse or contact us.</p></Link>
      </div></section>
      <p className="legal-center-contact">Legal and privacy questions: <a href={`mailto:${legalIdentity.complianceEmail}`}>{legalIdentity.complianceEmail}</a></p>
    </div>
  </div></Shell>;
}

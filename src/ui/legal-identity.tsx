import { legalIdentity } from "@/shared/legal-identity";

export function LegalBrands() {
  return <div className="legal-brand-grid">{legalIdentity.brands.map(brand => <div className="legal-brand" key={brand.name}>
    <h3>{brand.name}<span>{brand.service}</span></h3>
    <p>{brand.operator}</p>
    {brand.name === "Ledgix" ? <p className="legal-brand-access">{brand.domain}</p> : <a className="legal-brand-access" href={brand.website} referrerPolicy="no-referrer" rel="external noreferrer">{brand.domain}</a>}
  </div>)}</div>;
}

export function LegalContacts() {
  return <>
    <p><strong>{legalIdentity.company}</strong></p>
    <div className="legal-office-grid">
      {legalIdentity.offices.map(office => <div className="legal-office" key={office.label}>
        <h3>{office.label}</h3>
        <address>
          {office.address.map(line => <span key={line}>{line}</span>)}
          <a href={office.phoneHref}>{office.phone}</a>
        </address>
      </div>)}
    </div>
    <dl className="legal-contact-list">
      {legalIdentity.brands.map(brand => <div key={brand.name}>
        <dt>{brand.name} · {brand.service}</dt><dd><a href={`mailto:${brand.email}`}>{brand.email}</a></dd>
      </div>)}
      <div><dt>Privacy, legal &amp; compliance</dt><dd><a href={`mailto:${legalIdentity.complianceEmail}`}>{legalIdentity.complianceEmail}</a></dd></div>
    </dl>
    <p>Include the service name and a brief description of your request. Do not email passwords, verification codes, complete card or bank account numbers, or identity documents.</p>
  </>;
}

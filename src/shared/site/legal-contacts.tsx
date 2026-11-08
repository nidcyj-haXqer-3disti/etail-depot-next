import { legalIdentity } from "@/shared/site/legal-identity";

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
      <div><dt>Privacy, legal &amp; compliance</dt><dd><a href={`mailto:${legalIdentity.complianceEmail}`}>{legalIdentity.complianceEmail}</a></dd></div>
    </dl>
    <p>Include the service name and a brief description of your request. Do not email passwords, verification codes, complete card or bank account numbers, or identity documents.</p>
  </>;
}

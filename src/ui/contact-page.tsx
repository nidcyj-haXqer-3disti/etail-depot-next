import { COMMERCIAL_PAGES } from "@/modules/public-site/commercial-content";
import { legalIdentity } from "@/shared/legal-identity";
import { hostedServices } from "@/shared/hosted-services";
import { Shell } from "./shell";
import { CommercialStructuredData } from "./commercial-structured-data";
import { Icon } from "./icon";
import { PaymentPortalLink } from "./service-entry";
import { ContactHero } from "./contact-hero";
import contactStyles from "./contact-enquiries.module.css";
import "./connected-resources.css";
import "./public-site.css";
import "./brand-pages.css";
import "./commercial-pages.css";
import "./company-context.css";
import "./enterprise-support.css";

function ContactOptions() {
  const contacts = [
    { id: "cards", title: "Card inquiries", text: "Ask about the secured credit card, deposits or wallet support. An inquiry is not an application.", email: hostedServices.cards.email, href: hostedServices.cards.contactHref },
    { id: "compliance", title: "Privacy and compliance", text: "Contact us about privacy, data rights or a compliance matter involving the service.", email: legalIdentity.complianceEmail, href: `mailto:${legalIdentity.complianceEmail}` },
  ];
  return <div id="contact-options" className={`commercial-contacts container ${contactStyles.directory}`}>
    <section id="payment-review" className={contactStyles.merchant} aria-labelledby="contact-merchant-title" data-merchant-contact>
      {["platforms", "integration", "account-support"].map(id => <span key={id} id={id} className={contactStyles.bookmark} aria-hidden="true" />)}
      <div className={contactStyles.copy}>
        <h2 id="contact-merchant-title">Merchant services</h2>
        <p>Account eligibility, processing costs, software partnerships and integration documentation.</p>
        <p className={contactStyles.support}>For account support, include the relevant transaction or payout reference.</p>
      </div>
      <a className={contactStyles.email} href={hostedServices.payments.contactHref}><span>{hostedServices.payments.email}</span><Icon name="mail" /></a>
    </section>
    <div className="commercial-contact-list">
      {contacts.map(contact => <section key={contact.id} id={contact.id} className={contactStyles.specialist} aria-labelledby={`${contact.id}-title`}><div><h2 id={`${contact.id}-title`}>{contact.title}</h2><p>{contact.text}</p></div><a className={contactStyles.email} href={contact.href}><span>{contact.email}</span><Icon name="mail" /></a></section>)}
    </div>
    <div className="contact-application" id="merchant-application"><div><h2>Ready to apply?</h2><p>Merchant applications open at Trolleys, an Etail Depot service. Submit business documents through the secure account service. Account approval and setup apply.</p></div><PaymentPortalLink className="text-link">Open merchant application</PaymentPortalLink></div>
  </div>;
}

export function ContactPage() {
  const page = COMMERCIAL_PAGES["/contact"];
  return <Shell><CommercialStructuredData path="/contact" /><div className="brand-page commercial-page enterprise-support company-context cw-company company-context-contact"><ContactHero heading={page.heading} intro={page.intro} /><ContactOptions /></div></Shell>;
}

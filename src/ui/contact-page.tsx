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
    { id: "integration", title: "Integration documentation", text: "Request documentation and access requirements for your service. Include your merchant account status.", label: "Contact the integration team", href: `${hostedServices.payments.contactHref}?subject=Integration%20documentation` },
    { id: "account-support", title: "Merchant account support", text: "Describe the account or payment issue and include any relevant transaction or payout reference.", label: "Contact merchant support", href: hostedServices.payments.contactHref },
    { id: "cards", title: "Card inquiries", text: "Ask about the secured credit card, deposits or wallet support. An inquiry is not an application.", label: "Contact card services", href: hostedServices.cards.contactHref },
    { id: "compliance", title: "Privacy and compliance", text: "Contact us about privacy, data rights or a compliance matter involving the service.", label: "Contact compliance", href: `mailto:${legalIdentity.complianceEmail}` },
  ];
  return <div id="contact-options" className="commercial-contacts container">
    <section className={contactStyles.sales} aria-labelledby="contact-sales-title">
      <h2 id="contact-sales-title">Contact sales.</h2>
      <div className={contactStyles.choices}>
        <article id="payment-review" aria-labelledby="business-enquiry-title" className={contactStyles.choice}>
          <h3 id="business-enquiry-title">For your business</h3>
          <p>Ask about account eligibility, processing costs or changing providers.</p>
          <a className={contactStyles.action} href={`${hostedServices.payments.contactHref}?subject=Merchant%20services%20enquiry`}>Email business sales<Icon name="mail" /></a>
          <span className="commercial-contact-email">{hostedServices.payments.email}</span>
        </article>
        <article id="platforms" aria-labelledby="platform-enquiry-title" className={contactStyles.choice}>
          <h3 id="platform-enquiry-title">For your software platform</h3>
          <p>Merchant onboarding, checkout and reporting for your software.</p>
          <a className={contactStyles.action} href={`${hostedServices.payments.contactHref}?subject=Software%20platform%20partnership`}>Email platform sales<Icon name="mail" /></a>
          <span className="commercial-contact-email">{hostedServices.payments.email}</span>
        </article>
      </div>
    </section>
    <section className="contact-existing" aria-labelledby="contact-existing-title">
      <h2 id="contact-existing-title">Account help and integration.</h2>
      <div className="commercial-contact-list">
        {contacts.map(contact => <article key={contact.id} id={contact.id}><div><h3>{contact.title}</h3><p>{contact.text}</p></div><div className="commercial-contact-action"><a className="text-link" href={contact.href}>{contact.label}<Icon name="mail" /></a><span className="commercial-contact-email">{contact.href.slice("mailto:".length).split("?")[0]}</span></div></article>)}
      </div>
    </section>
    <div className="contact-application" id="merchant-application"><div><h2>Ready to apply?</h2><p>Merchant applications open at Trolleys, an Etail Depot service. Submit business documents through the secure account service. Account approval and setup apply.</p></div><PaymentPortalLink className="text-link">Open merchant application</PaymentPortalLink></div>
  </div>;
}

export function ContactPage() {
  const page = COMMERCIAL_PAGES["/contact"];
  return <Shell><CommercialStructuredData path="/contact" /><div className="brand-page commercial-page enterprise-support company-context cw-company company-context-contact"><ContactHero heading={page.heading} intro={page.intro} /><ContactOptions /></div></Shell>;
}

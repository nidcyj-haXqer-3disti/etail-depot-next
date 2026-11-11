import "../../../shared/ui/artwork/site-artwork-polish-company.css";
import { merchantAccountGuidance } from "@/shared/site/merchant-account-guidance";
import { contactContent } from "./content";

import { legalIdentity } from "@/shared/site/legal-identity";
import { hostedServices } from "@/shared/site/hosted-services";
import { Shell } from "../../../shared/layout/shell";
import { CommercialStructuredData } from "../../../shared/seo/commercial-structured-data";
import { Icon } from "../../../shared/ui/icon";
import { PaymentPortalLink } from "../../../shared/ui/merchant-portal-link";
import { ContactHero } from "./contact-hero";
import { SalesBookingLink } from "@/shared/ui/sales-booking/sales-booking-link";
import { salesBookingUrl } from "@/shared/site/sales-booking-url";
import contactStyles from "./contact-enquiries.module.css";
import "../../../shared/styles/connected-resources.css";
import "../../../shared/styles/public-site.css";
import "../../../shared/styles/brand-pages.css";
import "../../../shared/styles/commercial-pages.css";
import "../../../shared/styles/company-context.css";
import "../../../shared/styles/enterprise-support.css";

function ContactOptions() {
  const bookingUrl = salesBookingUrl(hostedServices.sales.bookingUrl);
  const contacts = [
    { id: "cards", title: "Card inquiries", text: "Ask about the secured credit card, deposits or wallet support. An inquiry is not an application.", email: hostedServices.cards.email, href: hostedServices.cards.contactHref },
    { id: "compliance", title: "Privacy and compliance", text: "Contact us about privacy, data rights or a compliance matter involving the service.", email: legalIdentity.complianceEmail, href: `mailto:${legalIdentity.complianceEmail}` },
  ];
  return <div id="contact-options" className={`commercial-contacts container ${contactStyles.directory}`}>
    <section id="payment-review" className={contactStyles.merchant} aria-labelledby="contact-merchant-title" data-merchant-contact>
      <span id="platforms" className={contactStyles.bookmark} aria-hidden="true" />
      <div className={contactStyles.copy}>
        <h2 id="contact-merchant-title">Talk with our sales team</h2>
        <p>Discuss card and ACH payments, processing costs or payments for your software platform.</p>
      </div>
      <div className={contactStyles.actions}>
        {bookingUrl ? <SalesBookingLink url={bookingUrl} /> : <a className={contactStyles.email} href={hostedServices.payments.contactHref}><span>{hostedServices.payments.email}</span><Icon name="mail" /></a>}
      </div>
    </section>
    <section id="account-support" className={contactStyles.accountSupport} aria-labelledby="contact-support-title">
      <span id="integration" className={contactStyles.bookmark} aria-hidden="true" />
      <div className={contactStyles.copy}>
        <h2 id="contact-support-title">Account and integration support</h2>
        <p>Get help with an existing merchant account, a payment, a payout or your store’s connection.</p>
        <p className={contactStyles.detail}>For a payment or payout question, include its reference.</p>
      </div>
      <a className={contactStyles.email} href={hostedServices.payments.contactHref}><span>{hostedServices.payments.email}</span><Icon name="mail" /></a>
    </section>
    <div className="commercial-contact-list">
      {contacts.map(contact => <section key={contact.id} id={contact.id} className={contactStyles.specialist} aria-labelledby={`${contact.id}-title`}><div><h2 id={`${contact.id}-title`}>{contact.title}</h2><p>{contact.text}</p></div><a className={contactStyles.email} href={contact.href}><span>{contact.email}</span><Icon name="mail" /></a></section>)}
    </div>
    <div className="contact-application" id="merchant-application"><div><h2>Ready to apply?</h2><p>{merchantAccountGuidance.application} Enter your email on Welcome, then choose Register. Account approval and setup apply.</p></div><PaymentPortalLink intent="register" className="text-link" /></div>
  </div>;
}

export function ContactPage() {
  const page = contactContent;
  return <Shell><CommercialStructuredData page={contactContent} path="/company/contact" /><div className="brand-page commercial-page enterprise-support company-context cw-company company-context-contact"><ContactHero heading={page.heading} intro={page.intro} /><ContactOptions /></div></Shell>;
}

import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { applicantNameArticle } from "./applicant-name-content";

export function ApplicantNamePage() {
  return <BlogArticlePage article={applicantNameArticle}>
    <p>Your customers may have known the business for years without ever seeing its legal name. Then a merchant application asks for it, and a routine field becomes an argument between the owner, the bookkeeper and the person building the website.</p>
    <p>The brand team wants the shop name. The bookkeeper has the tax record. The bank statement has a third version. Choosing whichever looks most familiar may get the form filled in, but it leaves the reviewer to reconstruct who is applying.</p>

    <section id="the-applicant" aria-labelledby="the-applicant-title">
      <h2 id="the-applicant-title">Start with the business taking responsibility.</h2>
    <p>The legal applicant is the person or entity seeking the account. A trading name describes how that business presents itself. The distinction remains even when the trading name appears on every order.</p>
    <p>IRS Form SS-4 separates the legal name from the trade name. For a sole proprietor, its instructions identify the individual in the legal-name field and the DBA separately. A trading name alone does not turn a sole proprietorship into a separate company.</p>
    <p>On a Trolleys application, use the legal business name and tax information requested from your records, with the DBA in its own field. If the entity or tax treatment makes that pairing unclear, resolve it with your tax adviser and implementation contact. Do not substitute whichever number or name happens to make a validation message disappear.</p>
    </section>

    <section id="a-brand-can-stay" aria-labelledby="a-brand-can-stay-title">
      <h2 id="a-brand-can-stay-title">The same shop can have a different applicant.</h2>
    <p>A move from sole proprietorship to an LLC is easy to miss from the outside. The website, products and owner may all look unchanged. Inside the business, the legal relationship may have changed substantially.</p>
    <p>Before reusing an old application, establish which business now sells to customers, which business holds the receiving bank account and which business will accept the merchant agreement. Tax identification and account requirements depend on the actual structure. The new logo does not settle them, and neither does keeping the old logo.</p>
    <p>The reverse also happens: a company changes its shop name while remaining the same legal entity. That is a different event. Treating every rebrand as a new company creates as much confusion as treating every new company as a rebrand.</p>
    </section>

    <section id="make-the-relationship-readable" aria-labelledby="make-the-relationship-readable-title">
      <h2 id="make-the-relationship-readable-title">Give the reviewer the relationship, not a puzzle.</h2>
    <p>The goal is to explain why different names belong together, not to make every document display the same words. Connect the legal name, DBA and website, then point to the records that support that relationship. Editing a statement to show the storefront name would hide the difference without proving the connection. If a record is wrong, correct it through the organization that issued or maintains it.</p>
    <p>Trolleys, an Etail Depot service, identifies the legal and trading names in the Merchant Service Order. Read that identification before accepting. It is the point where a familiar storefront becomes a specific business with specific payment responsibilities.</p>
    <p>Our <Link href="/resources/merchant-account-setup" prefetch={false}>account setup guide</Link> shows where those details go. The commercial reason for doing it carefully is simpler: the account should belong to the business that will stand behind the sale.</p>
    </section>
  </BlogArticlePage>;
}

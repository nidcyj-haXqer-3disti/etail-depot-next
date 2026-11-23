import { BlogArticlePage } from "./article-page";
import { addressPurposeArticle } from "./address-purpose-content";

export function AddressPurposePage() {
  return <BlogArticlePage article={addressPurposeArticle}>
    <p>The owner works from home, keeps stock at a warehouse and receives business mail at a separate address. A merchant application asks for address evidence.</p>
    <p>Which address?</p>
    <p>The answer matters more than finding the nearest utility bill. An address only helps a reviewer when it is connected to the right person or business and to the purpose of the request.</p>

    <section id="person-business-purpose" aria-labelledby="person-business-purpose-title">
      <h2 id="person-business-purpose-title">Read the field as a full question.</h2>
    <p>A request for an owner’s residential address concerns the individual. A request for the business’s operating address concerns the business activity. A mailing address tells someone where correspondence goes. Those can be the same place, but that needs to be true rather than convenient.</p>
    <p>An office lease in a company’s name does not automatically establish where an owner lives. A personal utility bill does not automatically establish that a separate company occupies commercial premises. Even a perfectly legible record can answer the wrong question.</p>
    <p>Stripe’s published verification guidance distinguishes identity evidence from proof of a person’s home address. When address evidence is requested, it must identify the person concerned. Trolleys applicants need to follow their own request. The broader lesson is that finding the right street address in a document is only half the job; the record also has to identify whose address it establishes.</p>
    </section>

    <section id="home-business" aria-labelledby="home-business-title">
      <h2 id="home-business-title">Working from home deserves an accurate answer.</h2>
    <p>A home-based business may have a sound reason for wanting to keep an owner’s address away from its public website. That privacy concern should be discussed directly rather than solved by putting a mail forwarding address in every field.</p>
    <p>Ask which information is required for private verification, which may appear on customer-facing records and which public contact arrangements are acceptable for the business. Do not assume the same address must be displayed everywhere, or promise that every submitted detail will remain invisible in every downstream system.</p>
    <p>For Trolleys, the Merchant Service Order identifies the applicant and its address, while the account setup process separately collects business and owner information. If a shared address genuinely serves both purposes, explain that. If different locations serve different purposes, preserve the distinction.</p>
    <p>For a home-based owner, that distinction matters twice: the reviewer needs accurate information, and the owner needs to know which details customers will see. Treating every address field as the same question serves neither need.</p>
    </section>
  </BlogArticlePage>;
}

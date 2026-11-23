import { BlogArticlePage } from "./article-page";
import { foreignRecordsArticle } from "./foreign-records-content";

export function ForeignRecordsPage() {
  return <BlogArticlePage article={foreignRecordsArticle}>
    <p>The owner has the document. It is genuine, current and issued by the right authority. It is also in a language the payment reviewer may not read.</p>
    <p>The obvious next step seems to be paying for a translation. Sometimes that will be necessary. But first, establish that the underlying record is one the reviewer can accept for the specific request.</p>
    <p>Translation cannot turn proof of registration into proof of current ownership. Certification cannot turn an address document into an identity document. Spending more on presentation will not change what the original record establishes.</p>

    <section id="three-decisions" aria-labelledby="three-decisions-title">
      <h2 id="three-decisions-title">Resolve acceptance, language and authentication separately.</h2>
    <p>A request for “translated documents” is not yet a usable brief for the work you are buying. First confirm which record from the issuing jurisdiction answers the verification request. Then establish whether the original-language copy is required and what qualifications or certification the translation needs. If authentication or an apostille is requested, establish exactly which record needs it and why before ordering it.</p>
    <p>There is no universal rule that every foreign document in merchant onboarding needs an apostille, a notarized translation or a particular English-language form. Provider and country requirements differ. Stripe’s published verification list, for example, organizes accepted evidence by country and verification purpose. That structure illustrates the need for a specific answer rather than a universal document pack.</p>
    <p>Keep the original record and its translation connected. Ask how to submit them together and whether all pages are needed. A translated excerpt may omit a qualification, date or issuing detail the reviewer needs to understand the document.</p>
    </section>

    <section id="commercial-sequence" aria-labelledby="commercial-sequence-title">
      <h2 id="commercial-sequence-title">Confirm eligibility before commissioning the document work.</h2>
    <p>If the applicant or an owner has an international connection, start with the supported business arrangement. The fact that a document can be translated does not establish that the payment provider supports the applicant.</p>
    <p>For Trolleys, describe the company’s jurisdiction, operating location and relevant ownership arrangements to the implementation team. Ask for the account-specific requirements, then obtain the requested evidence. The current public terms do not publish a universal foreign-document acceptance policy.</p>
    <p>Use the approved secure channel when it is time to provide sensitive records. A preliminary question can identify the document type and issuing country without attaching the owner’s full identity file to a sales email.</p>
    <p>Give the translator those confirmed requirements when asking for a quote. That lets both sides price the same job, including the pages and certification actually requested. A carefully commissioned translation is useful. An expensive translation of an unaccepted document is another delay.</p>
    </section>
  </BlogArticlePage>;
}

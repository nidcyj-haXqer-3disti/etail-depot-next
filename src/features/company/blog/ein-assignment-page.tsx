import { BlogArticlePage } from "./article-page";
import { einAssignmentArticle } from "./ein-assignment-content";

export function EinAssignmentPage() {
  return <BlogArticlePage article={einAssignmentArticle}>
    <p>The file is labeled EIN. It has the business name, an address and a signature. It looks official enough to send with the merchant application.</p>
    <p>But what does it establish? If it is a completed Form SS-4, it records a request for an Employer Identification Number. A reviewer asking for confirmation of an assigned EIN is asking a different question.</p>
    <p>This is an easy mistake for a new owner to make, particularly when an accountant or formation service handled the application and sent back a folder of documents. The filename is convenient. The document’s purpose is what matters.</p>

    <section id="confirmation" aria-labelledby="confirmation-title">
      <h2 id="confirmation-title">Find the record of the assigned number.</h2>
    <p>The IRS offers ways to confirm an existing EIN. Depending on the situation, those include an Entity transcript or Letter 147C. Eligible Business Tax Account users can also obtain a digital CP575, which the IRS describes as a substitute for the original CP575A-J notice series and Letter 147C.</p>
    <p>That does not mean every owner has access to every route, or that a payment reviewer accepts every record for the same purpose. Ask which confirmation the reviewer needs. The IRS’s current instructions are the right place to establish how to obtain an available record.</p>
    <p>Keep a confirmation you already have in the business’s controlled records. Before asking for another copy or starting another application, establish whether the EIN has already been assigned. Duplicate paperwork will not clarify which business an existing number belongs to.</p>
    </section>

    <section id="the-next-question" aria-labelledby="the-next-question-title">
      <h2 id="the-next-question-title">A confirmed EIN still leaves other questions open.</h2>
    <p>Proof that a number was assigned does not establish the current owners, the person authorized to sign, the receiving bank account or whether the business is approved for payment processing. Those questions can require different evidence.</p>
    <p>When another request arrives, establish whether the reviewer still needs proof of assignment or has moved on to a different question. For a Trolleys applicant, ask which fact remains unverified and respond with the relevant record through the approved secure process. Keep track of what the confirmation has already answered. Otherwise an owner can keep replacing a valid tax document while the actual ownership or account question remains untouched.</p>
    </section>
  </BlogArticlePage>;
}

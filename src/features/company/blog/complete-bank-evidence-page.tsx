import { BlogArticlePage } from "./article-page";
import { completeBankEvidenceArticle } from "./complete-bank-evidence-content";

export function CompleteBankEvidencePage() {
  return <BlogArticlePage article={completeBankEvidenceArticle}>
    <p>The merchant wants to prove the account is real without sharing every transaction. So they crop the statement down to the balance and upload that image.</p>
    <p>The privacy instinct is understandable. The result may no longer show who holds the account, which bank issued the statement or which period it covers.</p>
    <p>Those are not decorative details. Depending on the request, they may be precisely what the reviewer needs to connect the business, the account and the evidence.</p>

    <section id="what-is-being-checked" aria-labelledby="what-is-being-checked-title">
      <h2 id="what-is-being-checked-title">Find out what the statement is supposed to establish.</h2>
    <p>Bank ownership verification and a review of financial activity can require different information. If the question concerns the receiving account’s owner, a cropped balance does not answer it. If the question concerns activity over a period, a single page selected for its closing figure may omit the relevant history.</p>
    <p>Stripe’s bank verification guidance calls for complete, uncropped evidence with account-holder and account-number information. Other reviewers set their own requirements. Before masking a statement, establish which pages and details your reviewer needs and what redaction it permits.</p>
    <p>Guessing can defeat the privacy goal. If the first crop is rejected, the merchant may send another image, then a fuller copy, without ever resolving what was needed. There are now more versions of the same sensitive record in circulation. Agreeing on an acceptable alternative or permitted redaction first gives the submission a defined scope.</p>
    </section>

    <section id="original-file" aria-labelledby="original-file-title">
      <h2 id="original-file-title">Work from the bank’s record.</h2>
    <p>Where the bank provides a statement download, start with that genuine file and follow the requested submission format. Do not assemble a new statement from separate screenshots, replace the account name or edit a date. If the bank’s record is wrong, ask the bank about correcting it.</p>
    <p>If the problem is that the first statement has not been issued, say so. Ask whether another bank-issued record is acceptable. A screenshot and a statement are different formats, and acceptance depends on the actual process.</p>
    <p>For a Trolleys application, clarify the requirement through the implementation contact and send bank evidence through the designated secure channel. Keep full bank details out of the ordinary support thread used to ask the question.</p>
    <p>Cropping can feel like control over sensitive information. In practice, control means knowing who receives the record, why they need it and which details can safely be withheld without defeating the review.</p>
    </section>
  </BlogArticlePage>;
}

import { BlogArticlePage } from "./article-page";
import { missingVerificationArticle } from "./missing-verification-content";

export function MissingVerificationPage() {
  return <BlogArticlePage article={missingVerificationArticle}>
    <p>The application asks for a document the business cannot produce. The owner uploads the closest thing available. It comes back. They upload it again with a different filename.</p>
    <p>Nothing about the underlying question has changed.</p>
    <p>A document can be unavailable for several reasons. It has not been issued yet. It was lost. The issuing country uses a different record. Or the business is trying to support a fact that is not actually true. Those situations need different responses.</p>

    <section id="state-the-gap" aria-labelledby="state-the-gap-title">
      <h2 id="state-the-gap-title">Describe the exact gap.</h2>
    <p>Start with what was requested, why it is unavailable and which genuine evidence you do have. If the first bank statement is pending, give the expected issue date. If a record was lost, explain whether a replacement is available. If the jurisdiction uses another document, identify it without claiming the reviewer must accept it.</p>
    <p>Then ask what the reviewer is trying to establish. Ownership of an account, legal existence of a company and a person’s authority to sign are distinct facts. A proposed alternative only helps if it addresses the outstanding fact.</p>
    <p>Provider document lists vary by country and verification purpose. That makes a specific question worthwhile, but it does not create a right to substitute anything convenient. Some requests can be resolved through another accepted record; others may have to wait.</p>
    </section>

    <section id="do-not-invent-the-proof" aria-labelledby="do-not-invent-the-proof-title">
      <h2 id="do-not-invent-the-proof-title">A missing document should not become an invented one.</h2>
    <p>Do not manufacture a statement, backdate a letter or use another company’s record as if it belonged to the applicant. If the business arrangement itself is incomplete, explain that. A company still waiting for its bank account has a different problem from one waiting for its first statement.</p>
    <p>That distinction changes what the owner does next. If an existing fact lacks a record, the work is to obtain acceptable evidence. If the bank account or signing authority does not yet exist, the business arrangement needs attention first. Treating both as an upload problem keeps the team busy while the real decision waits.</p>
    <p>For Trolleys, the current terms separate starting an application from approval and activation. Ask what work can continue, which item remains blocking and how the reviewer wants the response recorded. Keep the discussion attached to the existing application rather than opening several versions in search of a different answer.</p>
    </section>

    <section id="a-useful-response" aria-labelledby="a-useful-response-title">
      <h2 id="a-useful-response-title">Ask for a defined next action.</h2>
    <p>The best answer is concrete: an accepted alternative, a corrected request, a document to obtain from a named issuer, or a requirement that cannot yet be met. Keep that instruction with the application notes and submit sensitive records through the approved channel.</p>
    <p>If the request remains unclear, ask the account contact to clarify it with the reviewing team. Repeated uploads without an explanation create work without improving the evidence.</p>
    <p>The number of files uploaded is a poor measure of progress. A useful response leaves one fewer question about the business unanswered, or makes clear why the application has to wait.</p>
    </section>
  </BlogArticlePage>;
}

import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { billingQuestionsArticle } from "./billing-questions-content";

export function BillingQuestionsPage() {
  return <BlogArticlePage article={billingQuestionsArticle}>
    <p>A new line appears on the statement. The amount is small enough to ignore this month, which is exactly how an unexplained recurring cost can survive for years.</p>
    <p>The merchant does not need to assume misconduct to ask a firm question. A legitimate charge should have an identifiable service or event, an agreed basis and a calculation that produces the amount billed. “That is a standard fee” supplies none of those details.</p>

    <section id="a-question-with-an-answer" aria-labelledby="a-question-with-an-answer-title">
      <h2 id="a-question-with-an-answer-title">Make the question difficult to misunderstand</h2>
    <p>“My fees are too high” invites a general answer. Identifying one charge by account, statement period, description and amount gives support a question it can answer precisely. The explanation should connect that charge to an agreed term, the event or service that triggered it and the calculation. Those details can go through the approved support channel without unnecessary customer or card data.</p>
    <p>This separates several problems that require different remedies. A correctly priced service may have been enabled by mistake. A valid recurring charge may have been collected twice. A new price may have been applied before its effective date. Or a cryptic description may conceal an entirely ordinary charge the merchant already agreed to pay.</p>
    <p>A courtesy credit can make the conversation feel finished while leaving next month’s charge untouched. If the same line returns, the merchant must notice it, find the previous correspondence and argue the same point again. The credit has returned money without removing the work. A resolution needs to say whether the service was removed, a rate or quantity was corrected, or the original fee was valid.</p>
    </section>

    <section id="close-the-loop" aria-labelledby="close-the-loop-title">
      <h2 id="close-the-loop-title">Follow the answer into the account records</h2>
    <p>Keep the support reference and written resolution with the statement. Then verify any promised correction against the account record or subsequent bill. A message saying a credit was requested is different from a record showing it was applied.</p>
    <p>Trolleys’ <Link href="/company/legal/fees#billing-record" prefetch={false}>billing terms</Link> require the invoice to distinguish charges, credits, amounts already collected and the remaining balance. They also state that an invoice cannot create a fee the merchant did not agree to. Those are useful standards for a billing conversation: show what is owed and show why.</p>
    <p>Raise the issue promptly, using any inquiry or dispute procedure in the applicable agreement. Canceling a payment authorization or ignoring an entire bill can create separate problems and does not, by itself, settle the disputed item.</p>
    <p>The next statement is where the answer becomes useful. Finance should be able to recognize the promised correction or explain why the charge remains. Having to reopen the same conversation is a sign that the account still depends on someone remembering a favor instead of understanding a rule.</p>
    </section>
  </BlogArticlePage>;
}

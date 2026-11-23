import { BlogArticlePage } from "./article-page";
import { firstBankStatementArticle } from "./first-bank-statement-content";

export function FirstBankStatementPage() {
  return <BlogArticlePage article={firstBankStatementArticle}>
    <p>You have opened the business bank account. The store is nearly ready. Then payment onboarding asks for a bank statement, and the bank says the first one will arrive after the month ends.</p>
    <p>There is no missing file to find. The document has not been issued.</p>
    <p>For an owner with stock purchased and a launch date approaching, waiting can feel unreasonable. But the useful question is what the reviewer needs to establish and whether another genuine record can establish it.</p>

    <section id="purpose-of-the-request" aria-labelledby="purpose-of-the-request-title">
      <h2 id="purpose-of-the-request-title">Bank ownership and trading history are different requests.</h2>
    <p>If the purpose is to verify the receiving account, ask what evidence can connect the account holder to that account. If the purpose is to review trading history or financial activity, a newly issued account confirmation may not answer it.</p>
    <p>For example, Stripe lists several forms of bank ownership evidence for US businesses, including a bank statement, a voided or canceled check, or a letter on bank letterhead. Those are its requirements. They illustrate why asking about an alternative can be worthwhile, but do not establish what Trolleys or another reviewer will accept.</p>
    <p>Tell the reviewer when the account opened, what the bank can issue now and when the first statement is expected. Ask whether the available record would answer this particular request before spending time obtaining it. That gives the reviewer a concrete choice to assess; asking only for “something instead of a statement” leaves the purpose and the proposed evidence unclear.</p>
    </section>

    <section id="launch-timing" aria-labelledby="launch-timing-title">
      <h2 id="launch-timing-title">Keep the launch plan honest about what is ready.</h2>
    <p>Do not borrow the parent company’s statement, use a personal account without confirmation or create a statement-shaped document to satisfy the upload field. Each can replace a timing problem with a question about the applicant’s identity and funding arrangements.</p>
    <p>For Trolleys merchants, submitting an application and activating processing are separate events. Ask which parts of the review can proceed while bank evidence is outstanding and what still prevents activation. A completed form is not a promise that checkout can open on a chosen date.</p>
    <p>Meanwhile, the business can finish work that does not depend on accepting payments: product information, delivery terms, refund policies and staff preparation. That keeps the launch moving without treating a document request as permission to process.</p>
    <p>Keep the bank’s expected issue date separate from the date evidence is accepted and processing is activated. The first statement arriving does not, by itself, finish the review. A launch plan built around the bank’s calendar can otherwise repeat the original mistake: treating one completed step as proof that the whole payment arrangement is ready.</p>
    </section>
  </BlogArticlePage>;
}

import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { personalBusinessExpensesArticle } from "./personal-business-expenses-content";

export function PersonalBusinessExpensesPage() {
  return <BlogArticlePage article={personalBusinessExpensesArticle}>
    <p>The company has agreed to repay you, but your credit card bill is due first. The purchase was for work. The payment deadline still belongs to your account.</p>
    <p>That gap is easy to overlook when a personal card solves an immediate problem. A supplier needs payment, a renewal cannot wait or the person with the company card is unavailable. Getting the purchase through feels like finishing the task. It also creates a repayment and recordkeeping task that can outlast the urgency.</p>
    <p>Using a personal card for a business purchase can be possible, as Chase’s guidance explains. Check the card agreement and the business’s expense policy before making a planned purchase. If someone else must approve it, establish what is covered and how repayment will happen before committing your own credit.</p>
    <p>Approval and reimbursement can arrive on different dates. Ask when the money will be sent, what records are required and who can resolve a delay. An expense marked “approved” in company software does not pay the card issuer. You remain responsible for meeting the terms of your account.</p>
    <p>This matters even when you trust the business to repay you. A delayed reimbursement can leave you carrying a balance you expected to clear. Meeting a minimum payment may avoid being late while still leaving an <Link href="/company/blog/credit-card-interest" prefetch={false}>interest charge</Link>. Before fronting a substantial purchase, consider whether the company should pay the supplier directly instead.</p>
    <section id="one-purchase" aria-labelledby="one-purchase-title">
      <h2 id="one-purchase-title">The bank feed can make one purchase look like two</h2>
      <p>Imagine an owner paying for the company’s domain renewal with a personal card. The receipt goes into the bookkeeping system. Later, the business transfers money to the owner, and that transfer appears in the business bank feed.</p>
      <p>There is one domain purchase. If the transfer is also categorized as a new domain expense, the records can count the same cost twice. The money going to the owner needs to connect back to the purchase already recorded.</p>
      <p>Intuit’s guidance separates recording a purchase made with personal funds from recording the reimbursement. Its owner funding accounts are examples of how that can work in QuickBooks, not a universal classification for every business. Have the person responsible for the books choose the treatment that fits the entity and arrangement.</p>
      <p>The evidence should make that connection easy to follow. Keep the supplier’s invoice or receipt, the business purpose, the relevant payment detail and the reimbursement reference together. The IRS notes that a combination of records may be needed to establish an expense. A card statement can help show a payment, but it may not explain what was bought or why the business needed it.</p>
      <p>Provide the transaction information needed for review without casually circulating unrelated personal spending. Use the company’s secure expense process and retain the original records. Clear <Link href="/company/blog/expense-receipts" prefetch={false}>receipts and purchase details</Link> are more useful than a personal statement with an unexplained line highlighted.</p>
    </section>
    <section id="employee-repayment" aria-labelledby="employee-repayment-title">
      <h2 id="employee-repayment-title">Employees need a repayment process they can rely on</h2>
      <p>For an owner, paying personally may be a deliberate way to support the business. For an employee, the same practice can mean lending the company part of their available credit. A routine purchasing process should make that burden visible instead of treating it as an unlimited convenience.</p>
      <p>Set a clear approval and reimbursement process, including what to do when the purchase is too large to fund personally. Keep the person paying informed when an expense needs clarification. They should not have to discover a missing receipt requirement when they are already waiting for the transfer.</p>
      <p>The accounting and tax treatment also deserves attention. In the United States, IRS accountable plan rules for employee reimbursements require a business connection, adequate accounting within a reasonable period and the return of excess amounts within a reasonable period. Qualifying reimbursements are not reported as pay; payments outside those rules can have different payroll treatment.</p>
      <p>Those employee rules should not be applied automatically to every owner transfer. The business structure, the person’s role and the actual arrangement matter. Calling a payment a reimbursement does not by itself establish its tax treatment, and keeping a receipt does not make every purchase deductible.</p>
      <p>If personal payments become routine, revisit how the business buys. Compare <Link href="/company/blog/business-credit-card-vs-personal" prefetch={false}>business and personal card arrangements</Link>, direct supplier payments and the access employees need. Move recurring suppliers deliberately, confirming the new billing method and keeping the older records available.</p>
      <p>An occasional personal payment should end with a clear record and a settled obligation. When the same people repeatedly wait to be repaid, the business has a purchasing problem to fix before the next bill arrives.</p>
    </section>
  </BlogArticlePage>;
}

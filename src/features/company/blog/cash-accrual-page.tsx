import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cashAccrualArticle } from "./cash-accrual-content";
import s from "./blog.module.css";

const projectTiming = [
  ["April", "Record the contractor payment as an expense. There is no customer receipt, so this project shows a loss for the month.", "Record the earned service revenue and contractor expense. Record the unpaid customer invoice as a receivable."],
  ["May", "Record the customer payment as income. There is no further contractor payment for this project.", "Apply the customer payment to the receivable. Collection does not create another sale or repeat April’s expense."],
] as const;

export function CashAccrualPage() {
  return <BlogArticlePage article={cashAccrualArticle}>
    <section id="timing-is-the-difference" aria-labelledby="timing-is-the-difference-title">
      <h2 id="timing-is-the-difference-title">Separate reporting timing from payment timing</h2>
      <p>A service may be completed before the customer pays. Supplier work may also be used before its bill is settled. Accrual records can show the related revenue, expense, receivable or payable before cash moves. The recognition rules still matter: issuing an invoice alone does not establish that revenue has been earned.</p>
      <p>Cash reporting generally follows receipts and payments, but you still need to know which customers owe you and which bills remain due. Keep those operational records even when they do not appear as receivables or payables in a cash basis report. The guides to <Link href="/company/blog/accrued-revenue-vs-deferred-revenue" prefetch={false}>revenue timing</Link> and <Link href="/company/blog/accrued-expenses-vs-accounts-payable" prefetch={false}>unbilled and billed costs</Link> explain those distinctions.</p>
      <p>Neither method makes every bank deposit income or every withdrawal an expense. Borrowing, owner contributions, asset purchases and transfers need their own treatment.</p>
      <p>For US tax reporting, cash basis does not mean only the bank posting date matters. Income can be constructively received when it is available without substantial restrictions, even before you take possession. Advance expenses and capital costs can also need different treatment from an immediate deduction.</p>
    </section>
    <section id="compare-one-project" aria-labelledby="compare-one-project-title">
      <h2 id="compare-one-project-title">Compare the same project across two months</h2>
      <p>Assume a business completes a service in April, uses and pays for related contractor work that month, and collects the full customer invoice in May. The fee exceeds the contractor cost. The service and cost qualify for April recognition under accrual accounting. There are no taxes, prepayments, assets, bad debts or other transactions.</p>
      <table className={s.comparison}>
        <caption>A simplified timing comparison for one completed service</caption>
        <thead><tr><th scope="col">Month</th><th scope="col">Cash basis</th><th scope="col">Accrual basis</th></tr></thead>
        <tbody>{projectTiming.map(([month, cash, accrual]) => <tr key={month}>
          <th scope="row">{month}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Cash basis</span>{cash}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Accrual basis</span>{accrual}</td>
        </tr>)}</tbody>
      </table>
      <p>Under these assumptions, both methods report the same total project profit across the two months. Cash reporting places the cost in April and the income in May. Accrual reporting brings them together in April. In either case, cash leaves in April and arrives in May.</p>
      <p><strong>The accounting method changes the reporting period, not the payment dates.</strong> An accrual profit does not mean the customer has paid. A strong cash basis month may include collections for work completed earlier.</p>
    </section>
    <section id="choose-with-purpose" aria-labelledby="choose-with-purpose-title">
      <h2 id="choose-with-purpose-title">Review the requirements before switching</h2>
      <p>Discuss the reporting purpose and the transition with your accountant. Management reports, lender requirements and tax returns can have different rules. Start with these questions:</p>
      <ul>
        <li><strong>Who needs the statements?</strong> Check the accounting basis and reporting framework required by lenders, investors or owners.</li>
        <li><strong>What timing needs to be tracked?</strong> Review unpaid invoices and bills, inventory, customer advances and costs covering more than one period.</li>
        <li><strong>What does the change require?</strong> Confirm tax eligibility, the effective period, any consent procedures and adjustments needed to avoid counting income or expenses twice or leaving them out.</li>
      </ul>
      <p><strong>A report setting does not approve a tax method change.</strong> US tax accounting method changes generally require IRS consent. Some qualify for automatic procedures; others require a separate request. Form 3115 and its current instructions explain the process. Do not rely on a revenue threshold copied from an old article.</p>
      <p>Keep the basis consistent and label your reports. Use the <Link href="/company/blog/cash-flow-statement" prefetch={false}>cash flow statement</Link> to review past cash movements, and a separate forecast for upcoming bills and collections. Neither accounting method guarantees that the money will be available when a payment is due.</p>
    </section>
  </BlogArticlePage>;
}

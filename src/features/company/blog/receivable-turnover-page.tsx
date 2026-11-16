import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { receivableTurnoverArticle } from "./receivable-turnover-content";
import s from "./blog.module.css";

export function ReceivableTurnoverPage() {
  return <BlogArticlePage article={receivableTurnoverArticle}>
    <p>A customer who pays on the last day of a 60-day agreement has kept their promise. Your business still had to wait 60 days for the money. That distinction matters when a report says you are collecting slowly.</p>
    <p>Payment terms are part of what you sell. They can help a customer place an order, make room for a larger contract or meet a purchasing requirement. They also decide how long the customer gets to hold money your business has already earned.</p>
    <p>Accounts receivable turnover measures net credit sales against the average amount customers owe during the same period. It puts a number on the relationship between selling and collecting. The useful question is whether that relationship makes sense for the business you agreed to do.</p>

    <section id="measure-the-wait" aria-labelledby="measure-the-wait-title">
      <h2 id="measure-the-wait-title">Start with the sales that leave money owed</h2>
      <p>Here, credit sales means sales on account: you let the customer pay later. It does not mean every sale paid with a credit card. Keep customer invoice balances distinct from amounts a payment processor has yet to settle. They represent different waits.</p>
      <p><strong className={s.editorialFormula}>Accounts receivable turnover = net credit sales ÷ average accounts receivable.</strong></p>
      <p>Use a defined period. Take its credit sales after related returns, allowances and discounts. Exclude sales paid immediately. For a simple average receivables balance, add the opening and closing customer balances and divide by two. OpenStax sets out this calculation; use the same receivables basis when comparing periods.</p>
      <p>A year of sales divided by one unusually quiet month’s balance will not describe a year of collection. Even opening and closing balances can miss a busy season between them. Where balances fluctuate substantially, a consistently calculated monthly average can give a more representative view. Keep the method visible so next year’s comparison measures the same thing.</p>
      <p>Stripe also identifies a less obvious distortion: including cash sales can improve the ratio without improving collection of the invoices still outstanding. If the sales mix changes, separate that change from the performance of customers who actually receive terms.</p>
      <p>The result expresses how many times sales cover the average receivables balance during the period. It does not mean each invoice was paid that many times, or prove that every customer paid. To express the ratio as an estimated collection period:</p>
      <p><strong className={s.editorialFormula}>Estimated collection days = days in the period ÷ turnover for that period.</strong></p>
      <p>Use 365 for a 365-day year, not for an unannualized quarter. This is an estimate from aggregate balances, not a measurement of each invoice’s actual time to payment. A zero or negative average receivables balance makes turnover unsuitable for this interpretation. A zero turnover also cannot produce a finite collection period. Investigate the inputs rather than reporting a misleading result.</p>
    </section>

    <section id="terms-or-late-payment" aria-labelledby="terms-or-late-payment-title">
      <h2 id="terms-or-late-payment-title">Is the customer late, or paying exactly as agreed?</h2>
      <p>Before calling a collection period too long, read the terms behind the sales. An account promised more time cannot fairly be judged against one promised less. OpenStax’s receivables management guidance connects collection performance to credit policy: who receives terms, how much they can owe and when payment is due.</p>
      <p>A lower turnover after you deliberately extend terms may reflect that decision. It still means more waiting, but chasing customers before the agreed due date will not explain whether the decision was worthwhile. Review the sales it enabled alongside the cash you must commit while waiting.</p>
      <p>Nor should you maximize turnover at any cost. Demanding immediate payment might shorten the wait and lose customers whose purchasing process requires terms. Offering a discount might accelerate cash while reducing what you earn. The target should fit the economics of the customer relationship, rather than a universal number borrowed from an unrelated business.</p>
      <p>Then open the invoice aging report. Intuit describes its purpose clearly: show which balances remain outstanding, which are past due and how long they have been overdue. That detail can expose an old unpaid balance hidden inside an otherwise healthy average. Compare customers against their own due dates before treating them as one collection problem.</p>
      <p>Look at what is stopping a particular invoice from being paid. A missing purchase order, a disputed quantity and an invoice that never reached accounts payable need different responses. Our article on <Link href="/company/blog/important-invoice-management-tips" prefetch={false}>invoice management</Link> covers the records that help keep the bill moving through that process.</p>
      <p>When payment is overdue, make the next conversation specific. Identify the invoice, confirm the balance and find out whether the customer is disputing it or simply has not scheduled payment. The article on <Link href="/company/blog/writing-a-letter-for-outstanding-payment" prefetch={false}>writing about an outstanding payment</Link> focuses on that conversation.</p>
      <p>Keep the agreed wait separate from the avoidable delay. You may decide to offer the same terms again, negotiate different ones or correct a billing problem. Those are business decisions a ratio can inform. The number cannot make them for you.</p>
    </section>
  </BlogArticlePage>;
}

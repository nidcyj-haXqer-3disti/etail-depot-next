import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardReconciliationArticle } from "./card-reconciliation-content";

export function CardReconciliationPage() {
  return <BlogArticlePage article={cardReconciliationArticle}>
    <p>A card bill can disappear from the to do list before anyone has really looked at the spending. Autopay runs, the bank balance falls and the team moves on. The payment worked. Whether the books tell the right story is still an open question.</p>
    <p>That distinction matters when the same records inform purchasing decisions, expense reviews and tax preparation. An imported transaction can be genuine and still be recorded in the wrong place. A paid balance can include a purchase nobody has explained.</p>
    <p>Business credit card reconciliation compares the issuer’s statement with the card account in your books, then investigates the differences. Here, the card belongs to your business and is used for spending. Matching money from customers’ card payments is a separate <Link href="/services/reconciliation" prefetch={false}>merchant payment reconciliation</Link> task.</p>
    <section id="purchase-and-payment" aria-labelledby="purchase-and-payment-title">
      <h2 id="purchase-and-payment-title">One purchase can appear more than once</h2>
      <p>A purchase appears in the card feed. Later, the repayment appears in the bank feed. Both are real movements, but they have different jobs in the accounts.</p>
      <p>The purchase creates an amount owed to the card issuer. What the business acquired determines the other side of the entry: it might be an expense, inventory, equipment or a prepayment. Paying the card then reduces the amount owed and the cash in the bank.</p>
      <p><strong>If the purchase is already recorded, the repayment is not another purchase expense.</strong> Treating both as spending can overstate expenses and leave the card account wrong. The fact that both entries came from a bank connection does not make their classification correct.</p>
      <p>The repayment can also arrive through both connected accounts: money leaving the bank and money credited to the card. Those records need to be matched to the same repayment. Creating a fresh entry for each side can duplicate it. Intuit’s payment workflow explicitly provides for pairing these transactions.</p>
      <p>Interest and fees need their own treatment when charged. They should not disappear inside a general “card payment” expense, nor should they be added again if already recorded. A supplier refund needs the same care: link it to the original purchase and its classification. A credit for returned stock is not a new customer sale.</p>
    </section>
    <section id="balance-and-evidence" aria-labelledby="balance-and-evidence-title">
      <h2 id="balance-and-evidence-title">The balance can be right for the wrong reason</h2>
      <p>A zero reconciliation difference tells you that the matched totals agree. It does not establish that every purchase was authorized or assigned to the right account. Two errors can also offset each other. An omitted purchase and an omitted credit for the same amount leave the closing balance unchanged while both records are missing.</p>
      <p>The statement shows what the issuer posted. A receipt or invoice helps explain what was bought. The business purpose connects that purchase to the company’s work. These records answer different questions, which is why a familiar supplier name and a matching amount are not always enough.</p>
      <p>The IRS says supporting records should identify the payee, amount, payment evidence, date and what was purchased or received. It also notes that more than one document may be needed. A downloaded statement is useful evidence; it does not automatically supply every missing detail or establish a deduction.</p>
      <p>With employee cards, retain the cardholder and purchase details even when the issuer collects everything into one bill. A consolidated payment should not erase who made the purchase or why. Resolving those questions while the purchase is still familiar is easier than asking someone to reconstruct it months later.</p>
    </section>
    <section id="unfinished-work" aria-labelledby="unfinished-work-title">
      <h2 id="unfinished-work-title">Keep the unfinished work visible</h2>
      <p>Some differences reflect timing. A repayment may already be recorded in the books but reach the issuer after the statement closes. Comparing the same account and closing date makes that gap understandable. Adding an expense merely to remove it creates a new error.</p>
      <p>The useful follow through is specific: keep the payment reference, find the later card credit and match it to the repayment already recorded. This is the same discipline that makes <Link href="/company/blog/bank-reconciliation-statement" prefetch={false}>bank reconciliation</Link> useful. A difference needs an explanation and evidence of resolution.</p>
      <p>A refund promised by a supplier also needs follow through. If the issuer has not posted it, keep it on the open items list rather than marking it received. When it arrives, match the credit to the refund record so the correction is counted once. An unrecognized charge needs prompt contact with the issuer through its official channel and handling under the business card agreement.</p>
      <p>Automation can bring the records together. Someone still needs to resolve the exceptions and approve corrections. The result worth keeping is a card balance you can explain, supported purchases and a clear record of anything still outstanding. “The bill was paid” is only part of that answer.</p>
    </section>
  </BlogArticlePage>;
}

import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardChoiceArticle } from "./card-choice-content";

export function CardChoicePage() {
  return <BlogArticlePage article={cardChoiceArticle}>
    <p>It is easy to compare two cards by the rewards they earn. The harder comparison starts with a purchase that goes wrong, a bill the business cannot cover or an employee who needs permission to spend.</p>
    <p>Those situations reveal what the account actually does. A business credit card is intended for company purchases; a personal card is intended for consumer spending. Beyond that basic distinction, the agreement determines much of what you are taking on. Putting the company’s name on a card does not, by itself, move every risk away from its owner.</p>
    <p>Start with the debt. Chase explains that a business card can require a personal guarantee, leaving the owner responsible if the company cannot pay. Other arrangements may place repayment responsibility with the company. The application and agreement, rather than the name printed on an employee’s card, establish who has promised to repay.</p>
    <p>Credit reporting is a separate question. A business card application may involve a personal credit inquiry, and account activity may affect consumer credit depending on the issuer’s reporting practices. Ask which bureaus receive routine activity and what is reported if the account becomes delinquent. A guarantee describes a repayment obligation; it does not tell you the complete reporting policy.</p>
    <p>That distinction matters if the purpose is <Link href="/company/blog/common-mistakes-when-building-business-credit" prefetch={false}>building the company’s credit history</Link>. The label “business card” is not enough to establish which record the account will build or how it could affect yours.</p>
    <section id="billing-protections" aria-labelledby="billing-protections-title">
      <h2 id="billing-protections-title">A familiar dispute process may not carry over</h2>
      <p>In the United States, business purpose credit cards are generally outside Regulation Z’s consumer credit rules. Certain card issuance and unauthorized use provisions still apply. The distinction matters because the federal billing error process that applies to a consumer card does not apply in the same way to a business purpose card.</p>
      <p>The CFPB’s interpretation also addresses occasional mixed use. A business purchase on a consumer purpose card does not automatically remove its Regulation Z coverage. An occasional personal purchase on a business purpose card does not bring the consumer billing error rules with it.</p>
      <p>That is not permission to ignore the card agreement’s spending restrictions. It describes the federal rule’s scope. Other applicable law and issuer commitments may also matter.</p>
      <p>Before switching, read how the proposed account handles disputed charges: where to report them, the deadline, the evidence required and what must be paid during review. Do not assume the process you used with your personal card will be identical.</p>
    </section>
    <section id="purchasing-work" aria-labelledby="purchasing-work-title">
      <h2 id="purchasing-work-title">The everyday advantage should be less work</h2>
      <p>For a solo owner making a few purchases, the immediate issue may be keeping company expenses separate and preserving the receipts. Once other people need to buy, the comparison becomes more practical. Who can place an order without waiting for the owner, and who can see what was spent?</p>
      <p>A business card program can offer named employee cards, individual controls and transaction records. Capital One, for example, distinguishes employees authorized to buy from account managers who have broader administrative access. These are specific permissions to evaluate, not features to assume every business card provides.</p>
      <p>Compare that arrangement with <Link href="/company/blog/shared-company-credit-cards" prefetch={false}>passing one card number around the company</Link>. A separate card and identifiable transaction history can make a purchase easier to trace. Someone still needs to approve the expense, collect its receipt and review whether it belongs in the budget. Card software can support that work; it does not decide which purchases the business needs.</p>
      <p>The statement should also fit the way the company pays. Some products allow a revolving balance. Others are designed for full payment, sometimes with a separate option to carry eligible amounts. Capital One’s business card guidance describes these differences. Read the terms for the particular product rather than assuming all business cards work like the personal card already in your wallet.</p>
      <p>If the plan depends on carrying a balance, include <Link href="/company/blog/credit-card-interest" prefetch={false}>interest and applicable fees</Link> in the purchase cost. A reward does not compensate for a repayment schedule the business cannot meet. If the plan is to pay in full, check that expected receipts arrive before the bill is due.</p>
      <p>There is no need to choose by appearance or by the word “business” alone. Choose around the work the account needs to do and the obligations it creates. Rewards belong in the comparison after you understand the bill you could owe and the process you would use to challenge it.</p>
    </section>
  </BlogArticlePage>;
}

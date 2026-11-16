import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardExpensePolicyArticle } from "./card-expense-policy-content";

export function CardExpensePolicyPage() {
  return <BlogArticlePage article={cardExpensePolicyArticle}>
    <p>Consider a software subscription the company approved last year. Since then, the price has risen, the team has added users and the person who originally bought it has changed roles. The card keeps paying. Nobody is quite sure how much of the current bill the original approval covers.</p>
    <p>An expense policy earns its place in that moment. It should tell the person responsible whether to renew, ask for approval or stop the purchase while someone decides. “Use the card responsibly” leaves all three possibilities open.</p>
    <p>A corporate credit card expense policy defines purchasing permission: who may buy, for what purpose, within which limits and with whose approval. Possessing a company card makes payment possible. It does not settle those decisions.</p>
    <section id="renewal-permission" aria-labelledby="renewal-permission-title">
      <h2 id="renewal-permission-title">Approval needs an end point</h2>
      <p>For a recurring service, decide what the approval actually covers. It might cover a named plan at an agreed cost until its next renewal. It might permit adjustments within a defined budget. Either arrangement can be workable if the buyer and approver understand it the same way.</p>
      <p>Specify what happens when the price, number of users or contract term changes. Name the person who reviews the change and the person who can reach the supplier’s billing settings. A reminder sent after the cancellation deadline may leave the business paying for a decision it never consciously made.</p>
      <p>The amount also needs a clear meaning. Say whether an approval includes tax, delivery and other charges. For a service billed monthly under an annual commitment, consider the full commitment when deciding who must approve it. A small first payment can attach the company to a much larger obligation.</p>
      <p>Card controls can help enforce parts of the policy. Stripe Issuing, for example, supports spending limits and restrictions by merchant category or country. Its documentation also notes limits to enforcement, including later tips and fees that can take spending beyond a configured limit. Check the features and behavior of the actual card program.</p>
      <p>Merchant categories describe the seller’s business. They do not explain why an employee bought a particular item. An allowed supplier and a successful authorization cannot establish that a purchase was necessary, approved or within the company’s agreed purpose.</p>
      <p>That is why the policy should make permitted routine purchases easy to recognize. Reserve additional approval for decisions that need it, with clear limits and a named decision maker. Sending every ordinary purchase through an unclear approval chain gives people a reason to find their own route around it.</p>
    </section>
    <section id="policy-in-practice" aria-labelledby="policy-in-practice-title">
      <h2 id="policy-in-practice-title">Write for the day something goes wrong</h2>
      <p>A policy that works only when every receipt is available and every manager is at their desk will leave predictable gaps. Name an alternate approver for urgent purchases. Explain where the decision should be recorded and who reviews an exception afterward. An emergency should have an authorized route through the process.</p>
      <p>The same applies when an employee cannot use the company card. If <Link href="/company/blog/can-you-use-a-personal-credit-card-for-business" prefetch={false}>paying personally</Link> is permitted, explain approval and reimbursement before asking someone to use their own credit. A blocked company payment should not silently become an employee’s financial obligation.</p>
      <p>For ordinary purchases, ask for records that explain what was bought and why: the supplier document, business purpose and relevant project or team. The IRS’s Publication 463, which covers travel, gifts and car expenses, emphasizes timely records and supporting evidence. Apply the requirements relevant to the expense rather than treating a company policy as proof of tax deductibility.</p>
      <p>A <Link href="/company/blog/expense-receipts" prefetch={false}>missing receipt</Link> needs a review process, too. Explain how to request a replacement and who can assess other evidence. If a personal purchase was made by mistake, give employees a prompt way to report and resolve it. An unclear rule can turn a straightforward correction into an argument about what someone should have known.</p>
      <p>Keep reporting channels appropriate to the problem. Suspected card compromise belongs with the issuer and card administrator promptly. A purchase that lacked internal approval needs internal review. Expense submissions should identify the transaction without collecting full card credentials. The FTC advises businesses to retain only necessary sensitive information and restrict access to people who need it.</p>
      <p>Before issuing the policy, give it to someone who will actually use the card. Ask them to work through the renewal, an urgent purchase and a missing receipt. If they cannot tell who decides or what to do next, revise the rule. Assign someone to maintain those answers as people, suppliers and card features change. The policy is ready when an employee can make the next purchasing decision without having to guess.</p>
    </section>
  </BlogArticlePage>;
}

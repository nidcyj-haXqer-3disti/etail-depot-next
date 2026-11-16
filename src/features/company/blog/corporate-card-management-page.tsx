import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { corporateCardManagementArticle } from "./corporate-card-management-content";

export function CorporateCardManagementPage() {
  return <BlogArticlePage article={corporateCardManagementArticle}>
    <p>Suppose an employee needs a higher card limit for a business trip. A manager approves it, the administrator makes the change and the employee books the travel. The trip ends. The receipts arrive. The higher limit stays.</p>
    <p>Nobody has necessarily broken a rule. The original decision had a good reason. What is missing is the decision that brings the card back to normal.</p>
    <p>Corporate credit card management lives in that gap between what the business approved and what the account still allows. A new project, a colleague’s leave or an urgent purchase can justify a change. Each can also leave behind permission that no longer serves its original purpose.</p>
    <section id="temporary-permissions" aria-labelledby="temporary-permissions-title">
      <h2 id="temporary-permissions-title">Temporary needs a return date</h2>
      <p>When a limit changes, the useful record includes why it changed, who approved it, when it should be reviewed and who will restore the usual setting. Record the previous setting, too. “Reduce the limit afterward” leaves the next administrator guessing what afterward means and what the limit used to be.</p>
      <p>Use an automatic end date if the card program supports one. Otherwise, assign the follow-up when making the change. A billing cycle resetting the amount available to spend is not evidence that a temporary permission has ended. Check the actual setting and its period.</p>
      <p>Capital One’s business employee card tools, for example, allow administrators to manage spend limits during a billing cycle and view spending and pending transactions. Those controls help administer an account. They do not know that a trip is over or that a project has been canceled.</p>
      <p>Review before restoring a limit if legitimate purchases are still expected. The traveler may need to settle a final bill. Another employee may be taking over the project. The aim is to give the current work the access it needs, with a fresh decision where necessary.</p>
      <p>If the same exception keeps returning, investigate the ordinary rule. The team may need a different allowance or a better way to buy from that supplier. A permanent change can be reasonable when someone approves it deliberately. Repeated temporary changes should not make that decision by accident.</p>
    </section>
    <section id="unfinished-purchases" aria-labelledby="unfinished-purchases-title">
      <h2 id="unfinished-purchases-title">Changing the card does not finish the purchase</h2>
      <p>Card permissions and transaction outcomes need separate attention. A lower limit or a frozen card does not, by itself, explain the charges already in progress. Capital One notes that some account activity can continue under its card controls, including credits, returns and certain other transactions. The actual program’s rules matter.</p>
      <p>A pending authorization also needs to be read in context. Stripe’s issuing documentation distinguishes the authorization that holds funds from the transaction created when a purchase is captured. A hold can be reversed or expire without capture. Seeing an authorization and a completed transaction is a reason to check their relationship before treating them as two purchases.</p>
      <p>Follow an expected refund through to the account record. Keep the supplier’s confirmation and the original purchase reference, then identify the resulting credit. A promise to refund and a posted refund describe different stages. If a charge suggests compromise, contact the issuer promptly through its official channel; do not wait for the routine expense review.</p>
      <p>Unwanted subscriptions have another distinction. Blocking payment does not necessarily cancel the supplier agreement. Capital One explicitly separates blocking a recurring transaction from canceling a subscription. The person responsible needs to confirm the cancellation with the supplier and resolve any remaining charges under the agreed terms.</p>
      <p>Give each unfinished purchase a specific next action. One needs a receipt, another a refund reference, another a cancellation confirmation. A general reminder to “sort out the card” makes it easy for everyone to assume someone else is doing it. Expense questions also need a separate path from meeting the issuer’s payment requirements; follow the account’s terms and dispute instructions.</p>
    </section>
    <section id="current-access" aria-labelledby="current-access-title">
      <h2 id="current-access-title">The account should reflect the team you have now</h2>
      <p>The same problem applies to administrator access. Someone may receive broader permissions to cover a colleague’s absence, then keep them long after the colleague returns. The FTC recommends limiting sensitive information to people who need it and ending access when employees leave or change roles.</p>
      <p>Review spending access and account administration separately. Capital One distinguishes authorized users, who can use their cards and review their own activity, from account managers with wider account and payment permissions. Use the roles available in your program rather than sharing a manager’s login to solve a short absence.</p>
      <p>A useful review asks what has changed: people, projects, limits and suppliers. Keep the <Link href="/company/blog/create-a-corporate-credit-card-expense-policy" prefetch={false}>expense policy</Link> as the basis for decisions, then check that the live permissions still match them. When responsibility moves, transfer the relevant supplier access as well as the <Link href="/company/blog/shared-company-credit-cards" prefetch={false}>card responsibilities</Link>.</p>
      <p>The business does not need to approve the same ordinary purchase every day. It needs to notice when yesterday’s exception has become today’s default. A trip should leave behind its expenses and receipts, not an unexplained increase in what someone can spend.</p>
    </section>
  </BlogArticlePage>;
}

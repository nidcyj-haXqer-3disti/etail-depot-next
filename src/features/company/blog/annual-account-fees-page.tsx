import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { annualAccountFeesArticle } from "./annual-account-fees-content";

export function AnnualAccountFeesPage() {
  return <BlogArticlePage article={annualAccountFeesArticle}>
    <p>An annual charge has a convenient way of becoming familiar. It appears, the team searches last year’s statement, finds the same line and decides it must belong there.</p>
    <p>That proves the charge is recurring. It does not prove that the business still needs the service, that the amount remains correct or that the original agreement authorized the latest renewal.</p>
    <p>The harder question is what the fee still buys. A gateway subscription, optional tool or separately agreed account service may have been sensible when it was selected. If the website or operating model has changed, the reason for retaining it may have changed too. A label such as “annual service” gives the owner too little information to make that decision.</p>
    <p>Little use is not the same as little value. A service may remain important to an occasional task, while a familiar tool may have been replaced entirely. The useful question is what work the business would lose, have to replace or no longer need if it stopped renewing. That asks for an operating reason, rather than a defense of last year’s purchase.</p>
    <p>The billing period matters as much as the billing date. A charge for the coming year raises different cancellation and credit questions from a charge covering the year just completed. Neither a refund nor proration should be assumed. The accepted terms should explain the treatment, including what happens if the merchant closes the account partway through the period.</p>
    <p>Annual costs also belong in a fair comparison between providers. Dividing an annual charge by twelve can help a budget, but it does not change when the cash leaves the business. A low monthly offer with a large annual addition may require a different decision from a genuinely monthly service.</p>
    <p>For Trolleys, the <Link href="/company/legal/fees" prefetch={false}>fee schedule and account documents</Link> establish the applicable charges. An invoice is a record of those obligations, not a way to introduce an unagreed annual fee. Any account-specific annual service should be identifiable in the accepted commercial terms.</p>
    <p>A modest renewal need not become a procurement exercise. It does need an owner who understands the service and can review it before the relevant deadline. Last year’s payment is useful evidence of cost. The reason to pay again has to come from the work the business expects the service to do next.</p>
  </BlogArticlePage>;
}

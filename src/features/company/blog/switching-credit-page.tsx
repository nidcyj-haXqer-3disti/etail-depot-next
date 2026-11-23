import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { switchingCreditArticle } from "./switching-credit-content";

export function SwitchingCreditPage() {
  return <BlogArticlePage article={switchingCreditArticle}>
    <p>A new provider offers to help with the cost of leaving the old one. The merchant sees a smaller obstacle to switching. The finance team still needs an answer to a less exciting question: which bill does the offer actually pay?</p>
    <p>A cash reimbursement and a credit against future processing fees have different effects. One may replenish money the business has spent; the other reduces a later bill. Neither automatically releases the merchant from the old agreement.</p>
    <p>Helcim’s published contract buyout illustrates the distinction. It asks for evidence of qualifying cancellation costs and describes a credit toward future Helcim processing fees. The merchant still follows the old provider’s closure process and pays the applicable old charges. The offer should be evaluated as written, not converted mentally into cash available before departure.</p>
    <p>Eligibility, proof and claim deadlines determine whether the advertised benefit reaches the merchant at all. Repayment or forfeiture conditions, where present, affect how long the business must keep it in view. A useful comparison uses the terms of this offer, including the amount the merchant can retain, rather than the largest number in the headline.</p>
    <p>Suppose, in a fictional offer, a $600 credit expires after six months and the merchant expects only $50 a month in eligible fees. At that activity level, just $300 would be used before expiry. If the old provider’s cancellation bill is $600 due now, the merchant still has to fund that payment. The same headline amount describes two different things: an immediate cash obligation and a conditional reduction in future costs.</p>
    <p>Then compare the ongoing arrangement without the incentive. An introductory credit can make a sound move easier. It cannot repair a checkout incompatibility or compensate indefinitely for unsuitable service terms.</p>
    <p>For a Trolleys proposal, any account-specific concession needs to appear in the <Link href="/company/legal/fees#billing-record" prefetch={false}>accepted commercial terms</Link>, with its scope and effective date. A provider’s advertised program does not establish a Trolleys offer.</p>
    <p>A switching credit deserves two entries in the decision: the usable saving and the date it becomes useful. Keeping those entries separate makes a modest but usable credit easier to judge against a larger promise the business may never collect.</p>
  </BlogArticlePage>;
}

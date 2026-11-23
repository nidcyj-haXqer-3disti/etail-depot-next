import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { savingsGuaranteeArticle } from "./savings-guarantee-content";

export function SavingsGuaranteePage() {
  return <BlogArticlePage article={savingsGuaranteeArticle}>
    <p>A savings guarantee has its most important moment after the first disappointing bill. The merchant expected to spend less. It now needs to know whether the provider owes it anything.</p>
    <p>An estimate can be wrong without triggering a remedy. A guarantee needs terms that say when the promise has been missed and what the provider will do about it. Those terms are part of the offer, not paperwork to discover after switching.</p>
    <p>Start with the comparison. If the old provider’s bill includes services the new proposal leaves out, the apparent saving may not describe the same purchase. If the estimate uses the merchant’s strongest month, the result may not survive a quiet one. If the card mix changes, a rate comparison may need to distinguish that change from the provider’s pricing.</p>
    <p>A useful guarantee defines the activity and costs it measures, the period and the records required. It also says what the merchant must do to make a claim. A remedy can be much narrower than the headline: a credit, a limited refund or another specified action. The business should not assume that missing the target automatically cancels its contract or reimburses all switching costs.</p>
    <p>Consider a hypothetical guarantee whose only remedy is a credit against future service charges. Even if the merchant qualifies for the credit, it must decide whether continuing with the service makes commercial sense. A remedy that requires staying has a different value from money the business can use to leave. The conditions for receiving the remedy belong in the comparison alongside the advertised saving.</p>
    <p>Any account-specific savings commitment for Trolleys would need to be expressly accepted in the <Link href="/company/legal/merchant-services#service-order" prefetch={false}>commercial documents</Link>, with the responsible party and terms identified. Our view is that a comparison should be useful even without a guarantee attached: consistent activity, complete costs and assumptions the merchant can inspect.</p>
    <p>There are therefore two judgments to make: whether the proposal is likely to reduce costs, and whether the guarantee meaningfully limits the damage if it does not. A convincing answer to the first does not settle the second. The headline earns its place in the decision only when the merchant can explain what happens after the saving fails to appear.</p>
  </BlogArticlePage>;
}

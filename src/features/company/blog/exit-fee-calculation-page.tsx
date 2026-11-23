import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { exitFeeCalculationArticle } from "./exit-fee-calculation-content";

export function ExitFeeCalculationPage() {
  return <BlogArticlePage article={exitFeeCalculationArticle}>
    <p>A business asks what it will cost to leave and receives a number. Without the clause and calculation behind it, the number is difficult to evaluate and impossible to budget confidently.</p>
    <p>Some arrangements specify a fixed charge. Others use a formula tied to a remaining period or a defined measure of fees. The label “early termination” does not establish which arrangement applies, or whether the charge is triggered at all.</p>

    <section id="reproduce-the-number" aria-labelledby="reproduce-the-number-title">
      <h2 id="reproduce-the-number-title">Ask for the inputs as well as the total</h2>
    <p>The provider should identify the accepted clause, the event it considers a termination and the relevant dates. If a formula is involved, ask for the billing records and definitions used in it. Gross sales, total processing charges and the provider’s own revenue are different bases. Substituting one for another can materially change the result.</p>
    <p>For a hypothetical formula of $75 per remaining month, eight remaining months produce $600. That arithmetic is simple. Whether there are actually eight months remaining, whether partial months count and whether that formula applies to the circumstances require the contract. This is an illustration, not a Trolleys fee or a statement about what any court would enforce.</p>
    <p>Separate the proposed termination charge from ordinary amounts already owed. Outstanding service fees, customer refunds and disputes do not become cancellation penalties merely because they remain after closure. For the departure decision, the distinction is consequential: amounts the business would owe even if it stayed should not be presented as a new cost created by moving.</p>
    </section>

    <section id="a-number-is-not-a-ruling" aria-labelledby="a-number-is-not-a-ruling-title">
      <h2 id="a-number-is-not-a-ruling-title">A correct calculation does not settle every question</h2>
    <p>An amount can follow a written formula and still be disputed on other grounds. Applicability, notice, a provider breach and legal enforceability may require separate analysis. A material disagreement deserves qualified advice; a spreadsheet cannot resolve it.</p>
    <p>Trolleys’ <Link href="/company/legal/merchant-services#termination" prefetch={false}>public closure terms</Link> permit a merchant to request closure at any time and preserve existing obligations. They do not publish a standard early termination formula. Any proposed account-specific charge needs an accepted basis, and a separate provider agreement must be considered within its own scope.</p>
    <p>Waiting for a termination charge to fall is a second decision. The business may pay service fees during the wait and postpone savings available elsewhere. The smallest exit charge is therefore not necessarily the least costly departure date. Compare the complete cost of leaving now with the complete cost of waiting, using the same assumptions about the replacement service.</p>
    <p>Before accepting a fixed commitment elsewhere, request an exit calculation for a plausible departure date. It reveals what changing the business’s plans could cost while that risk can still be negotiated, rather than after the owner has already decided to move.</p>
    </section>
  </BlogArticlePage>;
}

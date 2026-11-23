import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { contractPriorityArticle } from "./contract-priority-content";

export function ContractPriorityPage() {
  return <BlogArticlePage article={contractPriorityArticle}>
    <p>The proposal says the setup fee is waived. The fee schedule says it is payable. The salesperson says not to worry because everyone knows what was agreed.</p>
    <p>The problem has not been resolved. It has been passed to the person who will open the first bill.</p>
    <p>A merchant should not have to rely on the original salesperson remaining available to preserve a price. The documents need to carry the agreement after the conversation ends.</p>

    <section id="resolve-the-specific-conflict" aria-labelledby="resolve-the-specific-conflict-title">
      <h2 id="resolve-the-specific-conflict-title">Find the rule for this term</h2>
    <p>There is no safe universal answer that a quote always wins, or that the longest document always wins. The accepted agreement, its stated order of priority, the parties’ authority and applicable law matter. A commercial schedule may control pricing while another agreement governs the bank’s obligations. Those documents can cover different things without one replacing the other.</p>
    <p>Trolleys’ <Link href="/company/legal/merchant-services#account-documents" prefetch={false}>account document terms</Link> make that division explicit. The Service Order controls the commercial terms accepted with Etail. An expressly identified signed amendment controls the clause it changes. Applicable provider agreements retain their own subject matter, and mandatory law and network requirements remain applicable.</p>
    <p>That structure makes a practical correction possible: identify the account, the fee, the document version and the exact term being replaced or varied. Obtain the required acceptance from the responsible parties. A vague assurance that the merchant has a “special deal” leaves all the important details unsettled.</p>
    <p>The temptation is to leave a small waiver unresolved so a large launch can proceed. That transfers the work to a later moment, when checkout already depends on the relationship and finance is trying to close a real bill. The amount may be modest; the instruction still needs to be settled once. Repeatedly asking the merchant to explain the exception leaves the original conflict in place.</p>
    </section>

    <section id="keep-the-finished-agreement" aria-labelledby="keep-the-finished-agreement-title">
      <h2 id="keep-the-finished-agreement-title">The corrected copy is the one the business needs</h2>
    <p>After correction, keep the complete accepted set, including the documents incorporated by reference. Saving the favorable page alone can omit a condition elsewhere. Keeping only a link can also leave the business unable to show which version it accepted if the online text later changes.</p>
    <p>If the contradiction concerns a material obligation that remains disputed, get appropriate professional advice before relying on a preferred interpretation. This is especially important when separate legal parties are involved. A provider cannot casually waive another party’s rights through a sales conversation.</p>
    <p>The completed agreement should let the person opening the first bill recognize whether the promise was delivered. If that person must still ask what the salesperson meant, the handoff is unfinished, however many documents the parties have signed.</p>
    </section>
  </BlogArticlePage>;
}

import { BlogArticlePage } from "./article-page";
import { addressHistoryArticle } from "./address-history-content";

export function AddressHistoryPage() {
  return <BlogArticlePage article={addressHistoryArticle}>
    <p>The new lease is signed. Orders ship from the new warehouse. The bank statement still shows the old office, and the tax record has not caught up.</p>
    <p>Then a payment application asks for a consistent business address.</p>
    <p>For the owner, there is no mystery. The business moved. For a reviewer who only sees the documents, there are several addresses with no explanation of which one is current or what each one represents.</p>

    <section id="explain-the-sequence" aria-labelledby="explain-the-sequence-title">
      <h2 id="explain-the-sequence-title">Give the discrepancy a timeline.</h2>
    <p>Establish which address changed, when it changed and which records have already been updated. A warehouse relocation, a change of mailing address and an owner moving home are different events. Avoid describing all of them as the company’s new address.</p>
    <p>A short explanation can identify the date of the move, the role of each location and the status of updates. For example: the warehouse moved after the statement was issued, the office stayed put, and the bank’s mailing address update is pending. That sequence explains why the documents differ. Pair it with the particular evidence requested; a folder of records without a timeline leaves the reviewer to reconstruct the connection.</p>
    <p>Where a record is inaccurate, correct it with the issuing or maintaining organization. A new address typed over a downloaded statement destroys the distinction between an authentic older record and an altered one.</p>
    </section>

    <section id="different-updates" aria-labelledby="different-updates-title">
      <h2 id="different-updates-title">One update does not tell every organization.</h2>
    <p>Government, bank and merchant records have their own update processes. Florida’s annual report system, for example, distinguishes changes to principal office, mailing and registered office addresses. Completing a state filing is not a reason to assume the bank or payment provider has the same update.</p>
    <p>For Trolleys, confirm the business and approved locations recorded for the account. If the move also changes how you sell or fulfill orders, explain that separately. A move into a fulfillment facility or away from a customer-facing location may involve more than an address correction.</p>
    <p>If the application is already under review, use the existing account or case reference when reporting the change. Starting a second application with the new address can create another set of records to reconcile. Ask how to amend the current one.</p>
    </section>

    <section id="current-record" aria-labelledby="current-record-title">
      <h2 id="current-record-title">Aim for an accurate current record and an explainable history.</h2>
    <p>Perfect visual agreement between old documents is not the objective. A statement issued before the move can legitimately show the earlier address. What matters is whether the reviewer can establish the current facts and accept the evidence provided.</p>
    <p>The remaining question should be specific enough to act on: which current fact is still unverified, and which updated record would establish it? Without that answer, another upload can produce another mismatch rather than resolve the first.</p>
    <p>Keep that dated explanation with the application while the original records are corrected. It gives the next person handling the case a way to understand the older statement without asking the owner to explain the whole move again.</p>
    </section>
  </BlogArticlePage>;
}

import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { applicantEntityArticle } from "./applicant-entity-content";

export function ApplicantEntityPage() {
  return <BlogArticlePage article={applicantEntityArticle}>
    <p>A group launches another store. It reuses the website team, finance staff and product supplier, so copying the payment setup feels like the last routine task.</p>
    <p>Then someone asks whether the store belongs to the existing company or to the new subsidiary.</p>
    <p>That answer changes the application. Shared staff can make two businesses look operationally similar without making them the same applicant.</p>

    <section id="seller-first" aria-labelledby="seller-first-title">
      <h2 id="seller-first-title">Start with the seller customers are buying from.</h2>
    <p>Identify the business responsible for the sale, its contractual obligations and the approved arrangement for receiving funds. Follow that identity through the storefront terms, invoices, bank records and intended merchant agreement. Imagine a customer asking for a refund after the new store opens. If finance must first decide whether the parent or subsidiary made the sale, the application left a business decision unresolved.</p>
    <p>If the new store is another DBA of the same company, the discussion concerns an additional trading name and the appropriate account scope. If a subsidiary is the seller, another legal entity is involved. A parent’s existing merchant approval should not be assumed to cover it.</p>
    <p>Trolleys’ <Link href="/resources/merchant-account-setup" prefetch={false}>additional location process</Link> is described for another DBA under the same LLC or corporation. A different legal company requires confirmation of the correct application. Using one login to view authorized accounts does not make the underlying companies interchangeable.</p>
    </section>

    <section id="new-subsidiary" aria-labelledby="new-subsidiary-title">
      <h2 id="new-subsidiary-title">A new subsidiary can inherit experience without inheriting approval.</h2>
    <p>The team may have years of successful processing history. Present that experience accurately as group or related-business history, alongside the new applicant’s own position. Do not relabel the parent’s bank or processing statement as the subsidiary’s record.</p>
    <p>Tax identifiers deserve the same care. IRS guidance distinguishes a corporate subsidiary from a division and describes different situations in which a new EIN is needed. Other entity and tax arrangements can require different treatment. Establish the correct tax identity with the responsible adviser rather than borrowing the parent’s number to complete the form.</p>
    <p>Give the reviewer a clear ownership connection and explain what has actually moved: the brand, customer contracts, staff, inventory or future sales. For example, a subsidiary might sell the goods while the parent still buys and stores them. Naming both companies is only the start; explaining their roles lets the reviewer follow the proposed sale without treating every group record as the applicant’s own.</p>
    </section>

    <section id="after-approval" aria-labelledby="after-approval-title">
      <h2 id="after-approval-title">Keep the structure visible after the application.</h2>
    <p>Once the arrangement is approved, retain the mapping between legal entity, DBA, merchant account, gateway credentials and receiving bank account. Staff need it when finding an order, handling a refund or answering a dispute.</p>
    <p>The same discipline makes expansion easier. The next store can be added through the right process instead of inheriting a connection whose original scope nobody remembers.</p>
    <p>For a Trolleys merchant, the Service Order records the business and approved account activity. Check that it describes the store you are opening. A group should be able to grow without leaving its customer, accountant or payment provider uncertain about which company made the sale.</p>
    </section>
  </BlogArticlePage>;
}

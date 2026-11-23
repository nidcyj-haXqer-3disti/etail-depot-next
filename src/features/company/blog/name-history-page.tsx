import { BlogArticlePage } from "./article-page";
import { nameHistoryArticle } from "./name-history-content";

export function NameHistoryPage() {
  return <BlogArticlePage article={nameHistoryArticle}>
    <p>The new brand goes live. The team changes the website, social accounts and email signatures. Customers see one coherent business.</p>
    <p>The payment application sees an old tax name, a new storefront name and a bank document from somewhere in between.</p>
    <p>The website shows the result of the rebrand. The application needs the connection between the two names. Without it, the reviewer cannot tell from the presentation alone whether an established company renamed itself or a different business took over the store.</p>

    <section id="what-changed" aria-labelledby="what-changed-title">
      <h2 id="what-changed-title">Was the company renamed, or did the business change hands?</h2>
    <p>A new trading name, a legal name amendment and a sale to another entity are different events. The same website can remain online through all three.</p>
    <p>Establish whether the applicant is the same legal business. If it is, identify the evidence linking the earlier name to the current one. If another entity now sells to customers, explain the change of seller rather than treating the application as a spelling correction.</p>
    <p>IRS guidance generally does not require a new EIN merely because a business changes its name. Other structural changes can produce different requirements. The business should confirm its actual tax position, not infer continuity from the fact that the website and products stayed the same.</p>
    </section>

    <section id="connect-the-records" aria-labelledby="connect-the-records-title">
      <h2 id="connect-the-records-title">Preserve the evidence of the change.</h2>
    <p>The reviewer may need an amendment, registration record or other accepted evidence showing the relationship between the names. Ask what establishes that connection for the account. Two documents showing different names do not explain their relationship merely because you submit them together. Use the accepted record of the change to connect them, and a short explanation to show where each belongs in the history.</p>
    <p>Update the underlying records through their proper processes. The IRS’s business-name procedures vary by entity type; a website edit does not update its records. Nor should you assume a completed tax update has changed the bank or merchant account.</p>
    <p>Keep older documents authentic. An earlier statement with the previous name can be part of a valid history. Replacing that name inside the file makes it harder to establish what the bank actually issued.</p>
    </section>

    <section id="customer-recognition" aria-labelledby="customer-recognition-title">
      <h2 id="customer-recognition-title">The change also has a customer-facing side.</h2>
    <p>For an existing Trolleys merchant, confirm which account details and customer-facing descriptions need review before using the new identity. The Merchant Service Order identifies legal and trading names and approved websites. A new name should be connected to the right account, not simply pasted into whichever gateway field is easiest to edit.</p>
    <p>Think about the customer with an order placed before the rebrand who asks for a refund afterward. Staff should still be able to find the sale and explain the relationship between the names. Preserve the account and order references that make that possible.</p>
    <p>A successful name change leaves a clear path from the earlier business records to the current business presentation. That path helps the payment reviewer, the finance team and the customer who remembers the name on their original purchase.</p>
    </section>
  </BlogArticlePage>;
}

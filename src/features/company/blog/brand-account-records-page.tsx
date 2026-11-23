import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { brandAccountRecordsArticle } from "./brand-account-records-content";

export function BrandAccountRecordsPage() {
  return <BlogArticlePage article={brandAccountRecordsArticle}>
    <p>A customer remembers the shop where they placed an order. The bank statement may show a name associated with the payment account. The accountant needs to identify the business and account behind both.</p>
    <p>The customer should be able to recognize the purchase without learning the group’s organizational structure. Staff need enough of that structure to find the correct payment. When names do not connect clearly, support has to translate between the two, and blended records can leave the finance team guessing as well.</p>

    <section id="recognition-and-accountability" aria-labelledby="recognition-and-accountability-title">
      <h2 id="recognition-and-accountability-title">Customer recognition and account separation need to work together</h2>
    <p>Begin with the actual legal business, its trading names, websites and approved merchant accounts. A DBA is a trading name; it does not by itself create a new legal entity. Nor does common ownership authorize every brand to process through whichever account is easiest to connect.</p>
    <p>Confirm the permitted customer-facing description for each account and where it appears. The business should not assume that a gateway setting can override every issuer’s display behavior. Receipts and customer support information should help the buyer recognize the purchase, while remaining consistent with the approved seller and account.</p>
    <p>Inside the business, preserve account references alongside the trading names. Consider a hypothetical rebrand: today’s staff know the new name, but a customer asks about an earlier purchase under the old one. Keeping the name used at the time connected to a stable account identifier helps staff follow that history. The identifier connects the order, gateway record, merchant account activity and any later refund or dispute even when the public name changes.</p>
    </section>

    <section id="one-login-is-not-one-account" aria-labelledby="one-login-is-not-one-account-title">
      <h2 id="one-login-is-not-one-account-title">Shared access should preserve the distinctions</h2>
    <p>Trolleys’ <Link href="/resources/merchant-account-setup" prefetch={false}>account setup guide</Link> explains additional approved locations or DBAs and the associated account workflow. The Back Office Operations Portal can provide access across authorized merchant accounts. That access does not turn them into one interchangeable processing account; gateway credentials and activity still need the correct account mapping.</p>
    <p>Before choosing a provider for several brands, ask the team to demonstrate a practical task: find the activity for one account, identify the responsible seller and then compare the group without losing the account-level detail. Confirm which staff can see or act on each account and what the exports retain.</p>
    <p>Group pricing is a separate question from this operational structure. A shared discount does not prove that one statement or one set of credentials is appropriate for every store.</p>
    <p>Good account separation should shorten a customer conversation. Staff can recognize the brand the buyer mentions, find the corresponding account and explain the payment without asking the customer to untangle the group’s internal names. That is the practical value of preserving distinctions behind a business that may look simple from the outside.</p>
    </section>
  </BlogArticlePage>;
}

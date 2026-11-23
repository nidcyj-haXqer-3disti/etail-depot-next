import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { reopeningAccountArticle } from "./reopening-account-content";

export function ReopeningAccountPage() {
  return <BlogArticlePage article={reopeningAccountArticle}>
    <p>The shop is reopening. The owner finds the old login, enables checkout and sees a familiar dashboard. Months of inactivity appear to have changed nothing.</p>
    <p>But the supplier is different, the bank account has changed and the person who received payment notices no longer works there.</p>
    <p>The saved settings survived the closure. The routines that made those settings useful may not have. A bank destination, notice address or delivery promise can remain technically present after the person responsible for it has changed. Credentials are weak evidence that the operation is ready.</p>

    <section id="status" aria-labelledby="status-title">
      <h2 id="status-title">First establish what the account is allowed to do.</h2>
    <p>Distinguish an open but quiet account from one that was restricted, formally paused under a supported arrangement or closed. Ask the provider to confirm the current status and any steps required before new processing. Do not infer permission from the presence of a login screen or an old API key.</p>
    <p>If the account remains open, compare the proposed reopening with its approved business, websites, methods and conditions. New products, longer delivery times or a different seller may require more than a routine restart. Tell Trolleys what the business now intends to do and obtain required approval before accepting the changed activity.</p>
    <p>Do not try to discover the account’s status by submitting repeated live charges. Use the provider’s approved verification and testing process after the account path is clear.</p>
    </section>

    <section id="operating-memory" aria-labelledby="operating-memory-title">
      <h2 id="operating-memory-title">Rebuild the operational memory before the first new order.</h2>
    <p>Confirm the authorized bank destination through the secure process. Review staff access, account protection and where notices arrive. Remove access that is no longer needed, while preserving an authorized person who can complete the restart.</p>
    <p>Look at the unfinished past as well as the planned future. Earlier orders may still have support, refund or dispute obligations. The business needs access to the relevant records and a clear way to act on them. New sales do not make those old records disposable.</p>
    <p>Then follow the reopened customer journey through today’s operation. Suppose the old product page promises dispatch from stock, but the replacement supplier needs a production period before shipping. The page and the checkout could work perfectly while making a promise the reopened shop cannot keep. Read the offer, receipt and customer contact instructions with the people who will fulfill the first sale, not only the person restoring the website.</p>
    <p>The <Link href="/company/blog/merchant-account-costs-inactive-months" prefetch={false}>cost of an inactive account</Link> is a separate commercial question. For reopening, the decision is whether the account and the operation support the business you are about to run.</p>
    <p>Trolleys requires accurate continuing account information. Treat the old setup as a record to reconcile with the current business. The operational review should establish how a new order reaches today’s team under a promise that team can meet, while an earlier customer retains an authorized route to help.</p>
    </section>
  </BlogArticlePage>;
}

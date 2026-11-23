import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { postContractRecordsArticle } from "./post-contract-records-content";

export function PostContractRecordsPage() {
  return <BlogArticlePage article={postContractRecordsArticle}>
    <p>Imagine a merchant closing an account in March. In April, the accountant asks about a transaction from February. The report is behind a login that no longer works.</p>
    <p>The record has not become less important because the provider relationship ended. The business has simply lost its convenient route to it.</p>

    <section id="access-and-rights" aria-labelledby="access-and-rights-title">
      <h2 id="access-and-rights-title">Owning a business record does not guarantee an active dashboard</h2>
    <p>The agreement may distinguish rights in information from continued access to software. A merchant should not assume that a right to obtain certain records means the portal will remain open indefinitely. It also should not assume that every file visible in the portal is free to export, republish or retain without limits.</p>
    <p>Authorize.net, for example, warns that closing an account ends access to its Merchant Interface and recommends retrieving needed transaction history and statements beforehand. Another provider may have a different process. Establish the account’s actual retrieval route, available formats and any applicable charges before closure.</p>
    <p>An export needs to preserve an explanation, not merely a collection of rows. The business should be able to connect payments, refunds and fees using stable references and understand the dates and currencies. A screenshot of a balance cannot show how the individual items produced it. Equally, a detailed file is of limited use if nobody retained the report definitions needed to read it.</p>
    </section>

    <section id="retain-what-is-needed" aria-labelledby="retain-what-is-needed-title">
      <h2 id="retain-what-is-needed-title">Preservation is a responsibility, not permission to keep everything</h2>
    <p>Trolleys’ <Link href="/company/legal/merchant-services#termination" prefetch={false}>closure terms</Link> require each party to provide the records it owes and preserve records required by the agreement or law. The <Link href="/company/legal/merchant-services#information" prefetch={false}>information terms</Link> keep confidentiality and lawful retention obligations in place. Closing an account does not turn customer information into unrestricted marketing data.</p>
    <p>Assign an owner to the retained records, restrict access and use an appropriate retention schedule. Do not export raw payment credentials or unnecessary personal information simply because the business is leaving. If a needed record is unavailable, identify the responsible record holder and request an authorized copy through the secure process.</p>
    <p>Before the login disappears, have the person who will use the records try to explain a completed payment and any related adjustments from the retained material alone. That exercise exposes missing context while there is still a straightforward way to retrieve it. The retained records are ready to outlast the account when the finance team can carry the explanation forward without depending on the old dashboard or a former employee’s password.</p>
    </section>
  </BlogArticlePage>;
}

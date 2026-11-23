import { BlogArticlePage } from "./article-page";
import { charityChangeArticle } from "./charity-change-content";

export function CharityChangePage() {
  return <BlogArticlePage article={charityChangeArticle}>
    <p>A charity changes its name and expands its work. The new campaign is ready, but the donation page still displays its former name, and the payment account holds documents supplied several years earlier.</p>
    <p>The team may see a branding task. Donors and the payment provider need to understand which organization is receiving the money and whether the current arrangements support the proposed campaign.</p>
    <p>Start by identifying the change itself. A new name, an amended mission, a change in legal structure and a lost registration are not interchangeable events.</p>

    <section id="which-record" aria-labelledby="which-record-title">
      <h2 id="which-record-title">Separate the records that answer different questions.</h2>
    <p>Formation under state law, federal tax status, fundraising permissions and merchant-account approval serve different purposes. Updating one does not establish that the others have changed correctly. Nor does an ordinary registration update automatically mean the organization has lost its tax exemption.</p>
    <p>The IRS requires organizations that file Form 990 or 990-EZ to report relevant name, address, structural and operational changes on the annual information return. Its name-change guidance also provides ways to report a new name and seek an affirmation letter. Those procedures do not replace the payment provider’s account-update process.</p>
    <p>An old certificate may establish a genuine historical fact while leaving the new campaign unexplained. A name change and a broader fundraising purpose need different explanations, even if they were announced together. Have the organization’s responsible adviser identify the current status, effective dates and any restrictions affecting the campaign, then supply the requested evidence through the secure account process. More certificates cannot resolve an unexplained change in what the organization intends to do.</p>
    </section>

    <section id="donor-and-account" aria-labelledby="donor-and-account-title">
      <h2 id="donor-and-account-title">Make the current organization recognizable to the donor.</h2>
    <p>Review the named recipient, campaign purpose, receipt and contact route. If funds are being collected for another organization or beneficiary, make that relationship explicit and obtain the required approval. A charity’s own merchant account should not be assumed to authorize unrelated collections simply because the cause is worthwhile.</p>
    <p>Do not promise that every contribution is tax deductible merely because the website uses the word charity. Any statement about deductibility should match the current organization, transaction and applicable rules. A ticket, merchandise purchase and contribution may need different explanations.</p>
    <p>Trolleys’ acceptable-use terms require specific written approval for charitable fundraising and relevant collection for another beneficiary. They also require immediate reporting of lost eligibility and stopping affected processing until written approval to resume. If the change could affect the approved campaign, resolve that account question before continuing it.</p>
    <p>Earlier contributions still need traceable records. Updating the public name should not overwrite the purpose described when a donor contributed. Keep that earlier campaign description connected to the original payment reference and explain how the old and new names relate. A single current mission statement cannot, by itself, answer a donor’s question about what a previous appeal said.</p>
    <p>The current campaign needs a clear account of who receives the contribution and what the appeal promises. The earlier campaign needs its own accurate record. Keeping both understandable lets a charity explain how its work has changed without asking donors to reconstruct the organization’s history from inconsistent names and receipts.</p>
    </section>
  </BlogArticlePage>;
}

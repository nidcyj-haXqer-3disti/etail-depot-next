import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { platformProviderMoveArticle } from "./platform-provider-move-content";

export function PlatformProviderMovePage() {
  return <BlogArticlePage article={platformProviderMoveArticle}>
    <p>The message arrives from software the business already trusts: payments are moving to a new partner. There may be a date, a few benefits and a button to continue.</p>
    <p>The merchant needs to know whether it is being notified of an infrastructure change or asked to enter a new payment relationship. Familiar software does not make those the same event.</p>

    <section id="separate-the-two-agreements" aria-labelledby="separate-the-two-agreements-title">
      <h2 id="separate-the-two-agreements-title">Find the decision inside the announcement</h2>
    <p>Establish who will provide the merchant service and whether a new account, approval or agreement is required. Identify the legal business and locations covered. Then compare fees, funding arrangements, reserves, permitted activity and the contacts responsible for support.</p>
    <p>The platform may coordinate the process, but its role needs to be clear. Authority to supply software does not automatically authorize it to accept every merchant term, share every record or change every collection arrangement on the business’s behalf. Review the actual permissions and agreements rather than assuming them from a long customer relationship.</p>
    <p>Ask what choices the merchant has and what happens if the change is not accepted by the stated date. If declining the payment move would also mean leaving essential software, the alternative includes replacing that software and its working routines. That consequence belongs beside the fee comparison. Otherwise the owner may compare two processing prices when the real decision is whether to remain on the platform at all.</p>
    </section>

    <section id="keep-the-customer-history" aria-labelledby="keep-the-customer-history-title">
      <h2 id="keep-the-customer-history-title">Require an answer for the payments already made</h2>
    <p>The new partner may handle future sales while earlier refunds, disputes or balances remain elsewhere. Saved credentials and recurring schedules also need explicit treatment. Request a clear division of responsibilities with dates and contacts, including any action customers must take.</p>
    <p>Trolleys’ <Link href="/company/legal/software-platforms" prefetch={false}>software platform terms</Link> distinguish software services from the approved merchant payment arrangement. Account-specific services and provider roles belong in the Merchant Service Order. A software connection alone does not establish approval for every business or transfer earlier obligations.</p>
    <p>If Trolleys is part of a proposed platform move, bring the platform name and existing payment arrangement to the account discussion, along with any deadline the platform has given. Separate what has been confirmed for the merchant from what the platform has announced generally. An unanswered account question still needs an answer when the software release date is fixed.</p>
    <p>The platform may have good reasons to change partners. Its merchant customers still bear the effects on price, access and daily work. The announcement needs to leave them with enough information to decide what they will accept, while there is still time to act.</p>
    </section>
  </BlogArticlePage>;
}

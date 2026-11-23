import { BlogArticlePage } from "./article-page";
import { conditionalLaunchArticle } from "./conditional-launch-content";

export function ConditionalLaunchPage() {
  return <BlogArticlePage article={conditionalLaunchArticle}>
    <p>The account email says approved. The developer can open the gateway. Marketing schedules the launch.</p>
    <p>Then someone notices the remaining condition: verification of the bank account, a final website change or a requirement tied to a particular payment method. The team had read the same message and reached three different conclusions.</p>
    <p>“Approved” needs a subject. Approved for which business, which activity and which next action?</p>

    <section id="permission-to-process" aria-labelledby="permission-to-process-title">
      <h2 id="permission-to-process-title">Read the condition before scheduling the customer promise.</h2>
    <p>Ask whether the decision permits live processing now, permits it only after a stated requirement is satisfied or covers a narrower activity than the planned launch. A conditional approval is not a universal status with one meaning across providers. Follow the actual notice and obtain clarification where its effect is unclear.</p>
    <p>For Trolleys, activation confirmation must identify the approved business, websites, methods, currencies and territories. Where specific written approval is required, its scope also matters: the activity, channels, limits, conditions and any expiry. A developer credential or successful transaction does not expand it.</p>
    <p>This is especially relevant when the launch adds something late. Card approval does not, by itself, establish that ACH or another method is enabled for the account. A wallet may need its own domain setup even when the underlying card arrangement is ready. Ask which commercial requirements, additional information and technical setup apply to the method you actually intend to offer.</p>
    <p>For each remaining condition, record what would establish that it has been satisfied. Sending requested information and receiving confirmation that a restriction has been cleared are different events. An internal launch board should preserve that distinction instead of turning “submitted” into “ready.” Resolve it before advertising an option customers cannot yet use.</p>
    </section>

    <section id="permission-and-funding" aria-labelledby="permission-and-funding-title">
      <h2 id="permission-and-funding-title">A working checkout does not answer when the business can use the money.</h2>
    <p>Separate the permission to accept payment from the account’s funding position. Confirm that the approved receiving account is in place, whether any verification or restriction remains and which payout schedule and reserve terms apply. An enabled payout arrangement still does not promise the arrival time of every individual payment.</p>
    <p>Trolleys’ payout terms distinguish transaction availability, deductions, reserves, payout initiation and receiving-bank timing. Your launch budget needs to reflect those conditions. A campaign can generate genuine orders before the corresponding funds are available for stock or fulfillment.</p>
    <p>Suppose the launch plan relies on the first customer receipts to pay the supplier. If those funds are not available when the supplier needs them, a technically successful launch can immediately create orders the business cannot dispatch on time. The developer’s connection test and finance’s funding plan are therefore answering different parts of the same customer promise. Bring those answers together before marketing commits to a delivery date.</p>
    <p>If the date moves, revisit the facts that changed. A larger initial campaign, new products or a different delivery model may need review even if the original technical connection remains intact.</p>
    <p>A launch date becomes credible when the account conditions, the technical connection and the fulfillment budget all support it. Until then, the word “approved” may be accurate and the launch plan may still be premature.</p>
    </section>
  </BlogArticlePage>;
}

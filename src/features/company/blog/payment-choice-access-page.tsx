import { BlogArticlePage } from "./article-page";
import { paymentChoiceAccessArticle } from "./payment-choice-access-content";

export function PaymentChoiceAccessPage() {
  return <BlogArticlePage article={paymentChoiceAccessArticle}>
    <p>The checkout shows three attractive payment tiles. One is highlighted. Selecting another opens a new panel. A message appears above the total.</p>
    <p>A sighted reviewer can often infer the sequence from the design. A customer using a screen reader needs the page to communicate those same facts through its controls and content. An image labeled with a brand name is not, by itself, a usable method selector.</p>
    <p>A store can get the logo descriptions right and still leave the buyer unsure whether a choice took effect. Recognizing a brand answers “What is this?” It does not answer “Am I paying with it?” The latter question becomes decisive when the next action asks the customer to commit.</p>

    <section id="method-and-state" aria-labelledby="method-and-state-title">
      <h2 id="method-and-state-title">A selection has to be understandable without its color.</h2>
    <p>The customer needs to identify the payment group, hear the available choices and know which one is selected. A meaningful group label gives the controls context. Each choice needs an accessible name and the appropriate role and state, rather than a collection of clickable pictures.</p>
    <p>W3C’s guidance on grouped controls and Name, Role, Value addresses how that information reaches assistive technology. To the customer, the requirement is more immediate: “What method am I on, and how do I change it?” A visual highlight answers only part of that question.</p>
    <p>When selecting a method reveals fields, the relationship should be understandable. When a method is unavailable, the page should not invite the customer to select a dead end. If availability depends on a supported device or account configuration, explain the available path without announcing a service the customer cannot use.</p>
    <p>Names alone cannot make the choice usable. Someone navigating by keyboard must be able to reach the controls, change the selection and continue. A perfectly labeled control is still a dead end if the buyer cannot operate it.</p>
    </section>

    <section id="changes-and-results" aria-labelledby="changes-and-results-title">
      <h2 id="changes-and-results-title">Announce the consequence, not every movement on the page.</h2>
    <p>Suppose a method opens a verification step, reveals additional fields or changes a relevant order detail. The customer needs to know what happened and what to do next. They should not have to search the entire page to discover a message that a sighted buyer sees immediately.</p>
    <p>W3C’s Status Messages guidance covers messages about progress, results or errors added without changing the user’s context. Those messages can be made available to assistive technology without taking focus. A new verification page or dialog needs its own accessible transition. That does not mean making every visual animation speak. Repeated or unnecessary announcements can bury the important result.</p>
    <p>Errors deserve the same precision. “There is a problem” leaves the buyer guessing. A useful error identifies the field or action, explains the correction where possible and remains associated with the relevant control. Payment declines may have limited detail; do not manufacture an explanation the provider did not supply.</p>
    <p>A hosted field and the store around it can each be usable on their own while the handoff between them fails. If verification ends and the customer returns to a page that gives no understandable result, knowing how to operate the field no longer helps them decide what to do. Provider-controlled components need to keep their supported behavior, while the merchant’s team has to account for the purchase across that boundary.</p>
    <p>That is why an automated pass is incomplete evidence. It can find some missing information; it cannot tell the business whether a customer understood a changed method or a canceled verification. Observing the actual purchase with assistive technology and experienced users answers a different, necessary question.</p>
    <p>The visual design promises that a buyer can see their choice take effect. The rest of checkout has to make the same promise understandable without relying on that view. A recognizable logo starts the conversation; the selected method and the payment result finish it.</p>
    </section>
  </BlogArticlePage>;
}

import { BlogArticlePage } from "./article-page";
import { keyboardCheckoutArticle } from "./keyboard-checkout-content";

export function KeyboardCheckoutPage() {
  return <BlogArticlePage article={keyboardCheckoutArticle}>
    <p>The screenshot is convincing. The fields fit, the total is visible and the payment button sits neatly at the bottom. Then someone taps into an address.</p>
    <p>The keyboard opens. The button disappears, a floating bar occupies the remaining space and the error the customer needs to read sits above the visible area. The checkout did not fail to load. It failed during use.</p>
    <p>This is why a mobile review needs a person entering and correcting information, not just a smaller browser window.</p>

    <section id="typing-layout" aria-labelledby="typing-layout-title">
      <h2 id="typing-layout-title">Design for the space left after typing begins.</h2>
    <p>Chrome’s viewport guidance explains that the area used to lay out a page and the area currently visible to the customer can differ when an onscreen keyboard appears. Browser behavior and settings matter. A control attached to the bottom of the page layout is not necessarily attached to the visible space above the keyboard.</p>
    <p>A screenshot rewards the compact arrangement before any work begins. The customer needs a different arrangement while entering an address: enough room to see the field, understand a correction and reach the next action. Protecting the original composition can come at the expense of that work.</p>
    <p>An error near the bottom of the form exposes the problem. The customer may have to close the keyboard to read it, reopen the keyboard to fix it, then find the field again after the page moves. What appears in a report as one failed attempt may contain several rounds of that work.</p>
    <p>A persistent total, chat button, cookie panel and payment action may each have a reasonable owner inside the business. On the phone, they share one small space. Someone has to make the decision for the whole purchase, including which elements can move out of the way while the customer types.</p>
    <p>Stability does not mean preventing every layout change. The keyboard itself changes what is available. The goal is to avoid unexpected jumps, covered controls and lost context while adapting to that change.</p>
    </section>

    <section id="postal-entry" aria-labelledby="postal-entry-title">
      <h2 id="postal-entry-title">A convenient keyboard must still contain the characters needed.</h2>
    <p>A numeric keypad can help with a numeric postal format. It can obstruct a customer whose supported destination uses letters. Changing the delivery country should not leave the previous country’s entry assumptions behind.</p>
    <p>The HTML standard explicitly identifies US postal codes as unsuitable for number inputs. They are identifiers, not quantities to calculate. A postal-code field should preserve meaningful leading zeroes and accept the supported format. A keyboard hint can assist entry, but it is not validation and does not guarantee identical behavior on every device.</p>
    <p>Typing each field in a tidy sequence tells only one story. A buyer might use autofill, notice an old address and change the country halfway through. The form then has to accommodate a correction, not just an entry. If its keyboard or remaining values still assume the previous destination, the shortcut has given the customer another problem to undo.</p>
    <p>Hosted card fields have provider-controlled behavior that the store should not attempt to override. That boundary does not excuse a chat bubble covering the address or a fixed total hiding the correction. Those surrounding elements are still part of the merchant’s checkout.</p>
    <p>A useful review on physical phones follows those moments of revision, including the unit-number error or the address changed after autofill. The merchant can then see where effort accumulates before a customer gives up or asks for help. Repeatedly closing and reopening the keyboard may look like a small interaction defect to the team. To the buyer, it is the work required to finish one address.</p>
    <p>A good mobile checkout does not merely fit a phone. It leaves the customer enough space to finish buying.</p>
    </section>
  </BlogArticlePage>;
}

import { BlogArticlePage } from "./article-page";
import { checkoutZoomArticle } from "./checkout-zoom-content";

export function CheckoutZoomPage() {
  return <BlogArticlePage article={checkoutZoomArticle}>
    <p>Someone makes the text larger because they want to read it. The store responds by cutting off the delivery option, overlapping the order total and turning a button into half a word.</p>
    <p>The visual design may have looked balanced at its default size. That balance was dependent on the customer leaving everything exactly as the designer expected.</p>
    <p>Checkout needs a more durable arrangement. The customer must still be able to understand what they are buying, what it costs and which action commits them to the purchase.</p>

    <section id="content-can-move" aria-labelledby="content-can-move-title">
      <h2 id="content-can-move-title">Let the layout change before the meaning does.</h2>
    <p>Two columns can become one. A label can wrap. A summary can move below the fields. These changes can preserve the purchase far better than shrinking text back down or cutting off content to protect a tidy box.</p>
    <p>Consider a delivery option containing a service name, an arrival estimate and a price. At a larger text size, keeping the original row height may leave only the name visible. One customer gets a choice with its cost and timing; another gets a label and a working button. The software may accept both selections, but it has not given both buyers the same basis for choosing.</p>
    <p>Totals need similar care. The currency, amount, discount and shipping description should remain associated and understandable. If the order summary is collapsible, its control must remain available and indicate its state. The customer should not have to remember a price that can no longer be reached.</p>
    <p>W3C treats text resizing and reflow as distinct accessibility concerns. Its Resize Text criterion addresses enlargement to 200% without losing content or functionality, with specified exceptions. Reflow addresses presentation at a narrow equivalent width without requiring scrolling in two directions for ordinary vertically scrolling content, while recognizing content that genuinely needs a two-dimensional layout.</p>
    <p>The standards give the team a starting point, not a certificate for the whole checkout. A narrow browser window is also not identical to every customer’s text settings. The purchase has to survive the changes people actually make to read it.</p>
    </section>

    <section id="read-and-complete" aria-labelledby="read-and-complete-title">
      <h2 id="read-and-complete-title">Review a purchase, not an isolated heading.</h2>
    <p>The failure is often a lost relationship. A price drifts away from its delivery option. An error expands into the next field. A total remains visible while its currency is clipped. The words may all exist somewhere on the page, yet the customer can no longer confidently connect them.</p>
    <p>Short placeholder content conceals that weakness. A one-word sample label makes a fixed box look generous; a real delivery description exposes what the box will discard. Enlarging the text is a way to discover whether the layout treats the customer’s purchase information as essential or merely as whatever fits.</p>
    <p>Floating controls sharpen that decision. If a chat button stays visible while the shipping charge disappears beneath it, the layout has given an invitation to ask questions priority over the information that could answer them. That is a commercial choice hidden inside a positioning rule.</p>
    <p>If the field remains readable but the bank verification return does not, the purchase still has a gap. Follow it through to confirmation and the help route. The measure is whether the customer can understand and complete the same transaction with the settings they need, without being asked to see less comfortably in order to buy.</p>
    </section>
  </BlogArticlePage>;
}

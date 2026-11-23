import { BlogArticlePage } from "./article-page";
import { customerNameArticle } from "./customer-name-content";

export function CustomerNamePage() {
  return <BlogArticlePage article={customerNameArticle}>
    <p>The customer enters their name and continues. No error appears. On the order confirmation, the last part is missing.</p>
    <p>For the merchant, that may look like a minor display defect. For the customer, it is evidence that something they entered has already changed. For fulfillment, it may become a practical problem when the recipient cannot be identified correctly.</p>
    <p>A name field is not finished when it accepts typing. The value must travel through the systems that use it without an unexplained alteration.</p>
    <p>The W3C’s internationalization guidance describes why names do not fit one universal first-name, last-name model. Some people use one name. Order, spacing, script and the meaning of different parts vary. A design built around a short familiar example can work perfectly for its designer and still misrepresent the customer.</p>
    <p>Payment and delivery services may impose particular field requirements. The store has to accommodate those without inventing extra restrictions of its own. A system that needs two fields cannot safely obtain them by guessing where every customer’s name should divide.</p>
    <p>There are several points at which an accepted name can be damaged. The checkout may allow more characters than the order record. An export may remove accents. A label template may crop the display even though the complete value is still stored. A customer-service search may rely on the shortened version. Those are different faults and need different corrections.</p>
    <p>The distinction matters to the customer-service response. If the full name is stored and only the label is cropped, asking the customer to enter it again will not repair the label. If the order record has already discarded part of the name, widening the display will not bring it back. Treating both as a small form defect sends the repair to the wrong place.</p>
    <p>Following synthetic test names through the order gives the web and operations teams a shared view of the fault without copying customer information into development tools. The useful result is a name that survives the handoff, not two teams each reporting that their own screen works.</p>
    <p>The U.S. Web Design System supports long names, accents, punctuation and complete name display on confirmation pages. That guidance sets an expectation for the customer experience; it does not remove a shipping or payment service’s limits. The merchant still needs to know where those limits are and what happens when a name reaches them.</p>
    <p>A limit that cannot yet be removed calls for an honest explanation and a correction or assistance route before payment. “Your name is invalid” blames the person for the software’s limitation. Accepting the name and shortening it later merely postpones that conversation.</p>
    <p>A recipient name and a cardholder name may also serve different purposes. A gift order should not become impossible merely because those people differ. Follow the payment provider’s supported field requirements while preserving the intended recipient in fulfillment.</p>
    <p>A business can spend heavily on a personal shopping experience and then shorten the customer’s name without asking. Preserving it through the order is less conspicuous work, but it is part of making that promise credible.</p>
  </BlogArticlePage>;
}

import { BlogArticlePage } from "./article-page";
import { checkoutFieldPurposeArticle } from "./checkout-field-purpose-content";

export function CheckoutFieldPurposePage() {
  return <BlogArticlePage article={checkoutFieldPurposeArticle}>
    <p>The company-name box looks harmless until someone buying a birthday present stops to decide what to put in it. The phone-number box looks routine until the customer wonders whether the store is about to call.</p>
    <p>Neither field is inherently wrong. A carrier may need a delivery contact. A business purchaser may need the company identified correctly on an invoice. The mistake is requiring an answer without knowing what the answer is for.</p>
    <p>A required field can force an entry without producing useful information. If a shopper has no company, insisting on a company name may produce “N/A” rather than information an invoice or courier can use. The form looks more complete while the business learns nothing.</p>

    <section id="operational-need" aria-labelledby="operational-need-title">
      <h2 id="operational-need-title">Follow the answer into the business.</h2>
    <p>A scheduled furniture delivery may need a contact number because a dispatcher will use it. The same explanation does not carry over to a downloadable product. Requiring both buyers to complete the same form can conceal two very different operational needs.</p>
    <p>The U.S. Web Design System advises collecting phone numbers only when needed and explaining the expected contact. For a store, that explanation should describe the real use. “For delivery updates” is reassuring only if it accurately reflects what the business will do with the number.</p>
    <p>The explanation belongs beside the field, where it can answer the buyer’s immediate question. It is also a useful test inside the business. If the team cannot say who will use the number and for what, it has not yet found a customer-facing reason to require it.</p>
    <p>Company name deserves the same scrutiny. An optional business name may belong on an invoice or help a courier find commercial premises. It should not force a consumer to invent an employer. Nor should its removal break orders from genuine business customers.</p>
    <p>Shopify exposes settings for company-name collection and other checkout fields. A setting alone does not resolve what a carrier, invoice system or payment connection needs. That decision belongs to the business operating the store, with its web team confirming what the platform can support.</p>
    </section>

    <section id="optional-still-has-a-purpose" aria-labelledby="optional-still-has-a-purpose-title">
      <h2 id="optional-still-has-a-purpose-title">Optional should mean the order can proceed without it.</h2>
    <p>“Optional” is a promise. If checkout accepts an empty company field but the shipping integration later rejects it, the business has broken that promise after taking the order. The dependency needs to be resolved before the label changes.</p>
    <p>A requirement that applies only to scheduled delivery belongs with that choice. Discovering it at the payment button makes the buyer repeat work the store could have explained earlier.</p>
    <p>Format rules need a reason too. A contact number should tolerate the supported formats your customers reasonably use, while still meeting the receiving system’s requirements. A formatted display and the value sent to a carrier may differ. The merchant’s team should reconcile that deliberately, rather than asking customers to guess which spaces or country code the software expects.</p>
    <p>Trolleys merchants should keep the distinction between required payment information and optional store information clear. Do not remove a field required by the approved payment connection because a general conversion article recommends shorter forms. Conversely, a payment connection is not a reason to collect unrelated marketing details.</p>
    <p>Follow an empty field through a realistic order before defending its place in checkout. If the dispatcher cannot arrange delivery, there is a need to explain. If nothing changes except a blank column in a report, requiring the buyer to fill that column deserves a harder argument.</p>
    </section>
  </BlogArticlePage>;
}

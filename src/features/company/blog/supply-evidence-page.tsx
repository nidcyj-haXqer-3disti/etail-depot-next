import { BlogArticlePage } from "./article-page";
import { supplyEvidenceArticle } from "./supply-evidence-content";

export function SupplyEvidencePage() {
  return <BlogArticlePage article={supplyEvidenceArticle}>
    <p>The store has excellent product photographs and a supplier invoice. The reviewer asks where the stock is.</p>
    <p>For an owner who has already paid the supplier, that can feel like the same question twice. It is not necessarily the same question. The invoice can describe a purchase while the goods are still being made, waiting for collection or held somewhere the merchant cannot yet release them.</p>

    <section id="what-each-record-establishes" aria-labelledby="what-each-record-establishes-title">
      <h2 id="what-each-record-establishes-title">Explain what the records establish today.</h2>
    <p>A purchase order records an order placed. A supplier invoice records what the supplier billed. A payment record can support that an amount was paid. A stock report describes inventory at a particular point. None should be asked to prove all the others.</p>
    <p>An authentic invoice can still prove a purchase after every unit from that purchase has been sold. Its authenticity does not make it a current stock count. Distinguish goods available for new customer orders from inbound stock, units already reserved and items still to be manufactured. If another business owns the goods until sale or dispatch, explain the arrangement rather than describing everything as inventory you own.</p>
    <p>Stripe’s published review guidance includes inventory photographs and supplier purchase or shipment records among its evidence examples. Their different purposes matter more than the size of the document bundle. For a Trolleys review, the evidence needs to answer the particular request.</p>
    </section>

    <section id="supplier-relationship" aria-labelledby="supplier-relationship-title">
      <h2 id="supplier-relationship-title">A supplier relationship should explain what happens next.</h2>
    <p>The relevant details may include which entity supplies the product, what it has committed to provide, the expected timing and the merchant’s responsibility when supply fails. An impressive supplier name does not answer those questions on its own.</p>
    <p>If stock is shipped directly to customers, describe who receives the order, who reports dispatch and how the store learns about a missing or substituted item. If stock is held at an outside warehouse, identify how the merchant can verify quantities and release an order.</p>
    <p>Keep the evidence tied to the applicant. A related company’s invoice or a supplier’s general catalog can be useful context, but it should not be presented as proof of this merchant’s purchase or available stock.</p>
    </section>

    <section id="the-next-order" aria-labelledby="the-next-order-title">
      <h2 id="the-next-order-title">The evidence needs to fit the sales plan.</h2>
    <p>A photograph of a few units may show that the product exists. It does not explain how a large launch will be supplied. Connect current stock and confirmed incoming supply to the volume forecast, and identify anything still conditional.</p>
    <p>Trolleys requires accurate product and delivery information and notice of material changes. If a replacement supplier changes the lead time, fulfillment route or product itself, assess the account implications before continuing under an outdated description.</p>
    <p>Commercial records belong in the approved review channel. If evidence of a purchase or shipment does not yet exist, that absence is part of the supply story, not a gap to disguise in the presentation.</p>
    <p>The useful supplier story ends with an ordinary customer order: what will be available, who will release it and what the merchant will do if the expected supply does not arrive.</p>
    </section>
  </BlogArticlePage>;
}

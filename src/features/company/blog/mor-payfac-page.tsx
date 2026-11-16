import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { morPayfacArticle } from "./mor-payfac-content";
import s from "./blog.module.css";

const responsibilities = [
  ["The sale", "Your business sells to the customer and uses the payment service to accept payment.", "The provider takes the merchant role for covered sales, often through a reseller arrangement."],
  ["The work included", "Account onboarding, payment acceptance and support within the merchant agreement.", "The agreed transaction services, which may include indirect tax administration and buyer billing support."],
  ["What still needs checking", "Your obligations as the selling merchant, supported payment methods and account terms.", "Eligible products and markets, retained product responsibilities and who ultimately bears adjustments."],
] as const;

export function MorPayfacPage() {
  return <BlogArticlePage article={morPayfacArticle}>
    <p>Two proposals arrive for your online business. Both promise a smoother checkout, a choice of payment methods and help when something goes wrong. One offers a merchant of record service. The other offers payment acceptance through a payment facilitator.</p>
    <p>Comparing only the transaction rate misses the biggest difference: are you paying someone to help you accept payments, or to take the merchant role in the sale?</p>
    <p>That distinction affects the agreement the customer sees, the handling of refunds and the work that remains with your business. It deserves an answer before anyone chooses a checkout design.</p>

    <section id="the-role-behind-the-checkout" aria-labelledby="the-role-behind-the-checkout-title">
      <h2 id="the-role-behind-the-checkout-title">Start with the sale, not the payment screen</h2>
      <p>A merchant of record is the entity taking responsibility for the transaction in the merchant role. In a commercial merchant of record service, another company takes that role for the sales covered by its agreement. It may do so by reselling your product to the buyer.</p>
      <p>Paddle’s buyer terms provide a concrete example: the buyer purchases from Paddle as an authorized reseller, while the supplier makes the product available under a separate agreement. The supplier has not disappeared. The purchase relationship and the delivery of the product have different participants.</p>
      <p>A payment facilitator describes a different role. Mastercard defines it as a service provider registered by an acquirer to facilitate transactions for submerchants. That acquiring arrangement enables merchant payment acceptance. It does not, by itself, appoint the facilitator as the reseller of everything those merchants sell.</p>
      <p>The labels answer different questions. A business can be the merchant of record for its own sales while using a payment facilitator. A provider may also offer different services under different agreements. Ask which relationship applies to the particular offer, rather than treating the two labels as mutually exclusive types of company.</p>
      <table className={s.comparison}>
        <caption>Compare the proposed relationship, then confirm its terms</caption>
        <thead><tr><th scope="col">Question</th><th scope="col">Direct merchant setup through a PayFac</th><th scope="col">Merchant of record service</th></tr></thead>
        <tbody>{responsibilities.map(([question, facilitator, merchantOfRecord]) => <tr key={question}>
          <th scope="row">{question}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Direct merchant setup through a PayFac</span>{facilitator}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Merchant of record service</span>{merchantOfRecord}</td>
        </tr>)}</tbody>
      </table>
      <p>The name printed on a card statement can help a buyer recognize a purchase, but it is not the whole agreement. Read the customer terms, the merchant or supplier agreement and the scope of service together.</p>
    </section>

    <section id="follow-a-canceled-purchase" aria-labelledby="follow-a-canceled-purchase-title">
      <h2 id="follow-a-canceled-purchase-title">Follow one purchase through a cancellation</h2>
      <p>Imagine a software business selling an annual subscription. A customer buys it, has trouble using a feature and asks to cancel. This is an ordinary support problem, but it exposes what each proposal actually covers.</p>
      <p>Start with the product question. Who explains the feature, fixes a defect or confirms what was promised? A provider that answers billing questions is not necessarily supplying technical support for your software. Your team still needs a clear way to receive and resolve the product complaint.</p>
      <p>Then follow the refund. Who can approve it, who sends it and how does it affect the amount due to your business? Having a provider administer a refund does not necessarily mean that provider absorbs the cost.</p>
      <p>Paddle’s supplier agreement, for example, assigns it the refund process while also allowing it to recover specified refunds, chargebacks and related costs from the supplier. That is a particular contract, not a rule for every merchant of record. It illustrates why “handles refunds” and “pays for refunds” need separate answers.</p>
      <p>Apply the same care to tax promises. A merchant of record service may administer transaction taxes for its covered sales, but the scope matters. Stripe’s Managed Payments documentation, for example, distinguishes countries where it handles indirect tax compliance from those where responsibility remains with the business. It also separates transaction support from product support.</p>
      <p>Ask about the products, customers and countries you actually intend to serve, including sales outside the proposed arrangement. Do not read a transaction tax service as an answer to every tax obligation of your company. Have the relevant legal and tax allocation reviewed for your business before relying on it.</p>
      <p>Now compare the commercial offers again. Include the work being transferred, the work retained, any separate services and the treatment of refunds and other adjustments. A narrower processing quote and a broader merchant of record package are not interchangeable just because both charge by transaction.</p>
    </section>

    <section id="where-trolleys-fits" aria-labelledby="where-trolleys-fits-title">
      <h2 id="where-trolleys-fits-title">Where Trolleys fits</h2>
      <p>Trolleys, an Etail Depot service, provides <Link href="/services/payment-facilitator" prefetch={false}>merchant services through a payment facilitator model</Link>. Your business is reviewed for its activity, accepts the applicable merchant agreement and uses the payment methods enabled for its account.</p>
      <p>In this standard relationship, you sell the goods or services and handle your customer commitments and fulfillment. Trolleys supports account onboarding, payment acceptance and account operations. The merchant service does not make Trolleys the reseller of your products or transfer your product and tax responsibilities to us.</p>
      <p>That is a practical fit for a business seeking payment acceptance and support while continuing to sell directly. The questions to bring us are specific: what do you sell, how do customers order, when do you deliver and what happens when someone needs a refund? Those answers help establish the account and connection your business needs.</p>
      <p>For a software platform, distinguish your own subscription sales from the sales made by businesses using your software. Our <Link href="/use-cases/software-platforms/payment-models" prefetch={false}>platform payment models</Link> start with that selling relationship. Adding checkout does not authorize a platform to collect for independent sellers, hold their funds or distribute payments without an approved structure.</p>
      <p>If you need another company to resell eligible products and take specified merchant of record responsibilities, evaluate that agreement as a separate commercial choice. If you need a merchant service for your own sales, <Link href="/company/contact" prefetch={false}>talk with our team about Trolleys</Link>. The useful comparison is the responsibility you want to transfer and the relationship you want to keep.</p>
    </section>

    <p>Before comparing the Pay buttons, ask both providers to explain the same customer purchase, cancellation and refund. The proposal worth understanding is the one that tells you who does the work, who bears the cost and what your business still promises the customer.</p>
  </BlogArticlePage>;
}

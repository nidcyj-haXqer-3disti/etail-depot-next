import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentServiceProvidersArticle } from "./payment-service-providers-content";
import s from "./blog.module.css";

const serviceTasks = [
  ["Customer checkout", "A way for customers to enter payment details or choose a supported method.", "Which checkout options work with our website, and who connects them?"],
  ["Payment processing", "The connection and records needed to submit payments and follow their results.", "Where do we check whether a payment succeeded, failed or is still pending?"],
  ["Funding", "The arrangements and reporting for money due to the merchant.", "What are the payout schedule, deductions, possible restrictions and destination account?"],
  ["Daily operations", "Tools and support for refunds, disputes, reporting and account changes.", "Which tasks can our team complete, and when do we need the provider’s help?"],
] as const;

export function PaymentServiceProvidersPage() {
  return <BlogArticlePage article={paymentServiceProvidersArticle}>
    <p>Consider two proposals that both say “online payments.” One includes a hosted checkout and the transaction exports your team needs. The other requires a separate website integration and an additional reporting service. The same description can leave very different amounts of work with the merchant.</p>
    <section id="map-the-package" aria-labelledby="map-the-package-title">
      <h2 id="map-the-package-title">Separate the service into merchant tasks</h2>
      <p>Stripe and Adyen describe PSPs as providers that help businesses accept electronic payments and connect with the systems behind them. A provider may perform several functions itself or arrange them through other companies.</p>
      <p>A gateway connects checkout to payment processing. A processor handles transaction messages and related processing work. An acquirer supports the merchant’s card acceptance relationship. PSP describes the broader service offered to the business; it does not replace those underlying roles.</p>
      <table className={s.comparison}>
        <caption>Four parts of a payment service to check</caption>
        <thead><tr><th scope="col">Merchant task</th><th scope="col">The service may provide</th><th scope="col">Ask the provider</th></tr></thead>
        <tbody>{serviceTasks.map(([task, service, question]) => <tr key={task}>
          <th scope="row">{task}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">The service may provide</span>{service}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Ask the provider</span>{question}</td>
        </tr>)}</tbody>
      </table>
      <p>Ask which entities provide these services and which agreements apply. The <Link href="/company/blog/merchant-accounts-and-acquiring" prefetch={false}>merchant accounts and acquiring article</Link> explains the account relationship. Do not assume every PSP uses the same onboarding process, funding arrangement or support model.</p>
      <p>For Trolleys, an Etail Depot service, the <Link href="/services/payment-facilitator" prefetch={false}>payment facilitator model</Link> explains its merchant service role and acquiring relationships. The service name does not make Etail a bank or the issuer of your customer’s card.</p>
    </section>
    <section id="check-availability" aria-labelledby="check-availability-title">
      <h2 id="check-availability-title">Check what your account can actually use</h2>
      <p>A provider can advertise many payment methods without enabling every one for every merchant. Business eligibility, country, currency and the chosen integration can affect availability. Stripe’s payment method documentation, for example, separates country and currency support from product and integration support.</p>
      <p>Ask for the configuration available to your legal entity and sales model. If you need recurring payments, saved payment details or a particular wallet, confirm the required activation, customer consent and website setup. A feature listed in a product catalog is not evidence that it is ready in your checkout.</p>
      <p>Keep the currency the customer pays in separate from the currency you receive. Ask about conversion, associated charges and the bank account that can receive payouts. A claim about accepting several currencies does not answer those funding questions.</p>
      <p>Trolleys’ <Link href="/services/payment-methods" prefetch={false}>payment methods page</Link> describes cards, digital wallets and ACH through the methods enabled for the account. Wallet availability also depends on the customer’s card and device. Recurring billing is available through Cybersource when enabled for the merchant account.</p>
    </section>
    <section id="compare-inclusions" aria-labelledby="compare-inclusions-title">
      <h2 id="compare-inclusions-title">Make an inclusion list for your purchase</h2>
      <p>For each feature you need, record whether it is included, costs extra, requires another provider or must be built by your own team. Include setup, ongoing operation and the ability to retrieve records if you change services later.</p>
      <p>Use that list with the complete fee schedule. A processing rate does not explain every account, software or optional service charge. Trolleys’ <Link href="/pricing" prefetch={false}>pricing page</Link> should be read alongside the terms supplied for your account.</p>
      <p>Ask the provider to demonstrate one sale and one refund. Follow the order reference into the payment record, identify any fees or adjustments and see how the activity appears in the relevant reports. Check payout records separately from confirmation that the deposit reached your bank.</p>
      <p>Finally, confirm who completes the connection and launch checks. Etail’s <Link href="/developers/getting-started" prefetch={false}>after approval guide</Link> separates account access from the website setup and testing still needed before launch.</p>
    </section>
    <section id="keep-your-own-responsibilities-visible" aria-labelledby="keep-your-own-responsibilities-visible-title">
      <h2 id="keep-your-own-responsibilities-visible-title">Know what remains with your business</h2>
      <p>Using a PSP can reduce the payment work your team performs directly. It does not transfer every responsibility for the sale to the provider. Make these four areas explicit:</p>
      <ol>
        <li><strong>Customers and fulfillment.</strong> Your business presents the offer, delivers the purchase, communicates with customers and follows its applicable cancellation and refund obligations.</li>
        <li><strong>Security.</strong> Confirm which systems and processes remain in your scope and what compliance evidence is required. Using hosted payment fields does not mean there is nothing left to check.</li>
        <li><strong>Payment operations.</strong> Assign someone to monitor unresolved payments, check records and provide evidence when a customer disputes a charge.</li>
        <li><strong>Account terms.</strong> Keep eligibility, fees, payout conditions, restrictions and support responsibilities documented. Tell the provider when your business activity or account information changes.</li>
      </ol>
      <p>The PCI Security Standards Council says outsourcing payment processing does not remove a merchant’s responsibility for protecting account data. Merchants must check the provider’s compliance for the services used, document shared responsibilities and confirm their own validation obligations with the organization managing their compliance program.</p>
      <p>Etail’s <Link href="/company/legal/merchant-services" prefetch={false}>merchant services terms</Link> set out the responsibilities for approved Trolleys accounts. The practical goal is a service you can operate: you know what is enabled, where to find the records and who handles the next action when something needs attention.</p>
    </section>
  </BlogArticlePage>;
}

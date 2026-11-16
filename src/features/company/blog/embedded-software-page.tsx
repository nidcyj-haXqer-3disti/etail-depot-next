import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { embeddedSoftwareArticle } from "./embedded-software-content";
import s from "./blog.module.css";

const models = [
  ["License", "A specified feature or software version under an agreed license.", "Which device or account receives the right, its duration, and whether updates or transfers are included."],
  ["Subscription", "Access to an optional service during the subscribed period.", "Which devices are enrolled, when billing starts and stops, and how partial periods are charged."],
  ["Usage", "Measured activity, such as completed analysis jobs or another defined unit.", "What counts, how events are recorded, and how duplicate, late or corrected usage affects the bill."],
] as const;

export function EmbeddedSoftwarePage() {
  return <BlogArticlePage article={embeddedSoftwareArticle}>
    <section id="value" aria-labelledby="value-title">
      <h2 id="value-title">Identify what continues to create value</h2>
      <p>Separate the device’s included functions from optional software and ongoing services. A permanent local capability might fit a one time license. Remote monitoring, storage or regularly delivered analysis may support a recurring charge if customers value the continuing service. Metered pricing needs a unit customers can understand and verify.</p>
      <p>Avoid choosing a subscription merely because recurring revenue is attractive to the seller. Ask what changes for the customer each billing period and what costs continue for the manufacturer. Hosting, support, updates and account administration can make a small monthly price expensive to serve.</p>
      <p>Make the included product and the optional purchase clear before the device is sold. Describe whether a feature works locally, depends on a cloud connection or includes ongoing support. A permanent license does not by itself explain what happens to a separate cloud service.</p>
      <p>If your goal is to let other businesses accept payments inside your software, that is a different commercial model. Our <Link href="/use-cases/software-platforms" prefetch={false}>software platforms page</Link> covers that payment relationship.</p>
    </section>
    <section id="device-records" aria-labelledby="device-records-title">
      <h2 id="device-records-title">Connect the device, customer and access rights</h2>
      <p>The buyer, device owner, operator and invoice payer may be different people. Keep those relationships distinct from the license or service entitlement: the right to use a particular feature. A paid invoice must be associated with the right device or account, and a replacement device should not accidentally create a second bill.</p>
      <p>Billing software can track subscription and feature access states, but device enforcement and offline behavior need their own design. Stripe Entitlements, for example, maps product features to customer access rights and notifies the application when they change. Your application still has to grant or remove access. A billing record alone does not activate software inside a device.</p>
      <p>Keep payment state separate from subscription state. Stripe’s documentation notes that an active subscription does not always mean every invoice is paid. Decide how trials, invoice terms, delayed payments and recovery periods affect access under your own agreement.</p>
      <p>Thales distinguishes the license agreement, which defines the rights, from the mechanism the software uses to enforce them. Choose a licensing approach that fits the device and its connection limits. Test that an approved access change actually reaches the intended device, and that support can identify a failed activation.</p>
    </section>
    <section id="billable-unit" aria-labelledby="billable-unit-title">
      <h2 id="billable-unit-title">Specify what the bill counts</h2>
      <p>A customer may own a fleet but enroll only some devices in optional cloud analytics. Under an enrolled device policy, the enrolled devices determine the quantity. Ownership alone does not establish the billable quantity. If all licensed devices are charged instead, say so before purchase.</p>
      <table className={s.comparison}>
        <caption>Define the purchase and its billing rule together</caption>
        <thead><tr><th scope="col">Model</th><th scope="col">What the customer buys</th><th scope="col">What to define</th></tr></thead>
        <tbody>{models.map(([model, purchase, rule]) => <tr key={model}>
          <th scope="row">{model}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What the customer buys</span>{purchase}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to define</span>{rule}</td>
        </tr>)}</tbody>
      </table>
      <p>Define when enrollment starts, whether partial months are prorated and how customers remove a device. Give customers a record that lets them check the billed quantity and period. Make replacement and temporary deactivation rules visible to the team preparing invoices.</p>
      <p>For usage billing, distinguish no recorded activity from activity that has not arrived yet. Stripe’s metering documentation, for example, describes asynchronous processing, duplicate prevention and invoice timing limits. A late event being accepted does not guarantee that a finalized invoice will change.</p>
      <p>Keep a traceable usage record and a correction process. Confirm when usage must reach your billing provider, and test an interrupted connection before relying on a monthly usage total. Do not count a retried transmission as a second use of the service.</p>
    </section>
    <section id="lifecycle" aria-labelledby="lifecycle-title">
      <h2 id="lifecycle-title">Design changes and endings before launch</h2>
      <ul>
        <li><strong>Transfer.</strong> Explain whether a license follows the device when it is resold or stays with the original account. Confirm the new owner’s rights and the old owner’s access separately.</li>
        <li><strong>Replacement.</strong> Move valid rights to a replacement device using a traceable process, without creating unintended duplicate access or another subscription.</li>
        <li><strong>Connectivity loss.</strong> Define what remains available offline and how usage is handled when connectivity returns. Test the chosen licensing method rather than assuming continuous cloud access.</li>
        <li><strong>Nonpayment and cancellation.</strong> Describe which optional services end, when charges stop, how customers retrieve their data and which included device functions remain available.</li>
      </ul>
      <p>Review any effect on safety critical or essential device behavior with the relevant engineering and legal specialists. Commercial access rules must fit the product’s obligations. Pilot the complete lifecycle, including support and cancellation, before projecting revenue across every unit shipped.</p>
      <p>Payment collection is one part of that lifecycle. Our <Link href="/company/blog/saas-payment-processing" prefetch={false}>SaaS payment processing article</Link> covers the relationship between recurring charges, invoices and service access.</p>
    </section>
  </BlogArticlePage>;
}

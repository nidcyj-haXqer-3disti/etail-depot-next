import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { interchangeFeesArticle } from "./interchange-fees-content";
import s from "./blog.module.css";

const feeComponents = [
  ["Interchange", "The amount transferred between the acquiring and issuing sides under the applicable network schedule.", "Which transaction category and schedule were used?"],
  ["Network charges", "Separate charges associated with using the card network.", "Are they included in the quoted rate or listed separately?"],
  ["Provider charges", "The agreed charge for processing and related provider services.", "Which part is markup, and how is it calculated?"],
  ["Other account or service fees", "Additional charges that apply under the account’s terms.", "What service or event triggered each charge?"],
] as const;

export function InterchangeFeesPage() {
  return <BlogArticlePage article={interchangeFeesArticle}>
    <p>A higher processing bill does not, by itself, show that your agreed price went up. The card mix may have changed, transactions may have qualified differently or another charge may explain the difference. Understanding interchange helps you investigate those possibilities while keeping it separate from the full price of accepting cards.</p>
    <section id="separate-the-components" aria-labelledby="separate-the-components-title">
      <h2 id="separate-the-components-title">Interchange is only part of your processing bill</h2>
      <p>Visa distinguishes interchange between banks from the merchant discount, the price a merchant agrees with its financial institution. Mastercard likewise describes interchange as one component of merchant pricing. The card network’s published schedule is not a quote for your complete processing service.</p>
      <table className={s.comparison}>
        <caption>Separate the components before comparing the total</caption>
        <thead><tr><th scope="col">Component</th><th scope="col">What it covers</th><th scope="col">What to ask</th></tr></thead>
        <tbody>{feeComponents.map(([component, meaning, question]) => <tr key={component}>
          <th scope="row">{component}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it covers</span>{meaning}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to ask</span>{question}</td>
        </tr>)}</tbody>
      </table>
      <p>Your agreement determines whether those components are itemized or bundled. If interchange is already included in a flat rate, do not add it to that rate again. If a quote passes it through separately, check the network charges and provider markup alongside it.</p>
      <p>The <Link href="/company/blog/interchange-plus-vs-flat-rate-pricing" prefetch={false}>interchange-plus and flat-rate comparison</Link> explains how to apply both offers to the same payment activity.</p>
    </section>
    <section id="understand-qualification" aria-labelledby="understand-qualification-title">
      <h2 id="understand-qualification-title">Check the criteria attached to the rate</h2>
      <p>There is no single interchange rate for every card purchase. Card type, payment channel and region can affect the applicable category. The same sales total can therefore produce different underlying costs when the transaction mix changes.</p>
      <p>Mastercard’s guidance identifies requirements such as merchant category, the time between authorization and clearing, and submitted transaction data. A payment must meet all requirements for the applicable rate. Clearing is the submission of the transaction information used to complete the payment after authorization.</p>
      <p>Ask your provider which category was applied and what supports it. If the category changed, request an explanation tied to the affected transactions. A missing required field or a timing issue is a different question from a customer using a different card product.</p>
      <p>Use accurate business and sale information. Correct genuine errors with your provider; do not invent transaction data or choose an inaccurate merchant category to seek a lower rate. Check the schedule and requirements that applied to the transaction period and market.</p>
    </section>
    <section id="read-the-calculation" aria-labelledby="read-the-calculation-title">
      <h2 id="read-the-calculation-title">Read the calculation as well as the percentage</h2>
      <p>A charge may combine a percentage of the payment amount with a fixed transaction fee. Ask for both parts, the calculation base and the rounding method. Comparing only the percentage can miss a meaningful part of the cost.</p>
      <p>A basis point is one hundredth of a percentage point, written as 0.01 percentage points. It is a rate unit, not a fixed cent charge. A percentage varies with the payment value; a fixed fee depends on how many chargeable transactions occur.</p>
      <p>For the same total sales volume, more small payments mean more fixed transaction charges than fewer large payments when the same fixed fee applies. Use both sales volume and transaction count in a comparison. Keep any minimums, caps and separate account fees visible.</p>
      <p>Changing the provider’s markup does not change the network schedule. It can change your agreed cost, but a smaller markup alone is not proof of a lower complete bill. Ask for a calculation using your actual activity and all applicable charges.</p>
    </section>
    <section id="investigate-cost-changes" aria-labelledby="investigate-cost-changes-title">
      <h2 id="investigate-cost-changes-title">Ask what changed when costs rise</h2>
      <p>Before treating a higher average cost as a rate increase, check four possible causes:</p>
      <ol>
        <li><strong>Payment mix.</strong> Did card types, issuer countries, sales channels or average order values change?</li>
        <li><strong>Qualification.</strong> Was a different category applied, and which requirement explains the difference?</li>
        <li><strong>Schedule.</strong> Did a network rate or eligibility requirement change for the relevant period?</li>
        <li><strong>Other charges.</strong> Is the difference a provider, network or optional-service fee rather than interchange?</li>
      </ol>
      <p>Keep representative transaction references and the relevant statements. Ask the provider to explain the changed line items and compare similar transactions before drawing a conclusion about the whole account. A global average or a rate from another country may not apply to your business.</p>
      <p>For merchants using Trolleys, an Etail Depot service, compare the <Link href="/pricing" prefetch={false}>published pricing</Link> with your accepted account terms and the <Link href="/company/legal/fees" prefetch={false}>Fees and billing schedule</Link>. An underlying interchange change does not, by itself, explain a new charge under your agreement.</p>
      <p>If you are requesting competing quotes, the <Link href="/company/blog/payment-processing-rfp" prefetch={false}>payment processing RFP checklist</Link> helps you ask for consistent answers. The useful result is a clear explanation of what changed, what you agreed to pay and whether anything needs correcting.</p>
    </section>
  </BlogArticlePage>;
}

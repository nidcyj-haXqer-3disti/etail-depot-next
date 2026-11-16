import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { achEftArticle } from "./ach-eft-content";
import s from "./blog.module.css";

const paymentTerms = [
  ["EFT", "A broad description of moving money electronically.", "Which network or bank service does this arrangement use?"],
  ["ACH credit", "An instruction that sends money through the ACH Network.", "Who schedules the payment and supplies its invoice reference?"],
  ["ACH debit", "An authorized collection through the ACH Network.", "Who initiates the debit, and what permission covers the collection?"],
] as const;

export function AchEftPage() {
  return <BlogArticlePage article={achEftArticle}>
    <p>A supplier form may ask for “EFT details,” while your bank calls its service “ACH payments.” Those labels can describe the same arrangement. The important question is what the payment will do, not which acronym sounds more suitable.</p>
    <section id="category-and-route" aria-labelledby="category-and-route-title">
      <h2 id="category-and-route-title">Separate the broad term from the payment service</h2>
      <p>In ordinary business language, EFT describes electronic money movement. ACH identifies a particular network that supports both payments sent to an account and authorized collections from an account. Other electronic payment methods have their own processes.</p>
      <table className={s.comparison}>
        <caption>Use the label to start a question, not to assume the entire payment process</caption>
        <thead><tr><th scope="col">Term</th><th scope="col">What it describes</th><th scope="col">What to confirm</th></tr></thead>
        <tbody>{paymentTerms.map(([term, meaning, confirm]) => <tr key={term}>
          <th scope="row">{term}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it describes</span>{meaning}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to confirm</span>{confirm}</td>
        </tr>)}</tbody>
      </table>
      <p>The label EFT alone does not establish a fee, an arrival time or a cancellation process. Two providers may use it for different services. Ask for the named method before comparing their terms.</p>
      <p>The <Link href="/company/blog/ach-payments" prefetch={false}>ACH payments article</Link> explains how credits and debits pass through the banks. If you are comparing ACH with a specific alternative, the <Link href="/company/blog/ach-vs-wire-transfers" prefetch={false}>ACH and wire comparison</Link> addresses that choice.</p>
    </section>
    <section id="supplier-request" aria-labelledby="supplier-request-title">
      <h2 id="supplier-request-title">Clarify who sends or collects the money</h2>
      <p>A supplier asks a buyer to enable EFT payments. This could mean that the buyer will send ACH credits to the supplier, or that the supplier wants permission to collect ACH debits from the buyer.</p>
      <p>For a credit arrangement, the buyer schedules the payment using the supplier’s receiving instructions. For a debit arrangement, the supplier initiates a collection under the agreed authorization. Providing details for receiving money does not by itself authorize someone to take money from that account.</p>
      <p>The answer determines who schedules payment, what approval record is needed and who checks a missing transfer. Once agreed, use the specific description in your invoice instructions and internal records instead of leaving the arrangement labeled only “EFT.”</p>
    </section>
    <section id="account-rules" aria-labelledby="account-rules-title">
      <h2 id="account-rules-title">Read legal definitions in context</h2>
      <p>Everyday terminology and legal coverage are not interchangeable. US Regulation E defines the accounts and transfers covered by its rules. Its account definition focuses on consumer accounts established primarily for personal, family or household purposes. Do not assume a business account carries the same protections.</p>
      <p>Section 1005.3 excludes transfers through Fedwire and similar wire systems used primarily between financial institutions or businesses. Its official interpretation also explains that a later ACH transfer to a consumer account may be covered even when the earlier Fedwire transfer is exempt.</p>
      <p>That distinction is why a broad statement such as “all electronic transfers have the same protections” is unreliable. Other rules can apply to an excluded transfer. Ask which account agreement and rules govern the particular payment before relying on a cancellation right or complaint deadline.</p>
    </section>
    <section id="confirm-arrangement" aria-labelledby="confirm-arrangement-title">
      <h2 id="confirm-arrangement-title">Put the payment arrangement in writing</h2>
      <ol>
        <li><strong>Method and direction.</strong> Name the network or bank service and who initiates the transfer. Distinguish sending a payment from authorizing a collection.</li>
        <li><strong>Account and country.</strong> Identify the relevant account type, the countries involved and the currency. Check the terms for that arrangement.</li>
        <li><strong>Timing and status.</strong> Ask what accepted, settled and available mean, what deadlines apply and which record confirms receipt.</li>
        <li><strong>Permission and support.</strong> Confirm the required approval or authorization, the support contact and the process for a missing, incorrect or disputed payment.</li>
      </ol>
      <p>“Send an ACH credit using these bank instructions” is more actionable than “pay by EFT,” when an ACH credit is the agreed method. A debit arrangement needs its own clear authorization and collection instructions.</p>
      <p>For Trolleys’ <Link href="/services/ach-payments" prefetch={false}>ACH payment service</Link>, setup connects customer authorization, bank account validation and payment status. Availability, fees, limits and payout terms depend on the merchant account.</p>
    </section>
  </BlogArticlePage>;
}

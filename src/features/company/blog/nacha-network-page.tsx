import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { nachaNetworkArticle } from "./nacha-network-content";
import s from "./blog.module.css";

const participants = [
  ["Nacha", "Develops and administers the Operating Rules for ACH participants.", "Use its guidance to understand requirements, rather than to locate an individual payment."],
  ["Originating bank", "Receives payment instructions and sends entries into ACH processing.", "Your initiating bank or provider is the starting point for submission and processing questions."],
  ["ACH operator", "Exchanges and processes entries between participating institutions and performs settlement functions.", "Banks use an operator to move entries through the network."],
  ["Receiving bank", "Receives entries for the accounts it serves and handles posting.", "The account holder can ask it about an expected credit or an unfamiliar debit."],
] as const;

export function NachaNetworkPage() {
  return <BlogArticlePage article={nachaNetworkArticle}>
    <p>“Contact Nacha” sounds plausible when an ACH payment is missing. In practice, the useful starting point is the bank or provider handling the instruction. Nacha’s role is network governance, not a customer payment desk.</p>
    <section id="roles" aria-labelledby="roles-title">
      <h2 id="roles-title">Separate the rules from the payment route</h2>
      <p>Nacha’s Operating Rules define participants’ roles and responsibilities. Its work also includes rules enforcement, education and guidance. The organizations moving and posting payments have separate operational roles.</p>
      <figure className={s.editorialRoleMap} aria-labelledby="ach-roles-caption">
        <figcaption id="ach-roles-caption">Four roles in the ACH network</figcaption>
        <dl className={s.editorialGovernance}>
          {participants.slice(0, 1).map(([participant, role, meaning]) => <div key={participant}>
            <dt>{participant}</dt>
            <dd><p>{role}</p><p>{meaning}</p></dd>
          </div>)}
        </dl>
        <dl className={s.editorialNetworkRoles}>
          {participants.slice(1).map(([participant, role, meaning]) => <div key={participant}>
            <dt>{participant}</dt>
            <dd><p>{role}</p><p>{meaning}</p></dd>
          </div>)}
        </dl>
      </figure>
      <p>The Federal Reserve Banks and The Clearing House’s Electronic Payments Network, or EPN, are the two national ACH operators. The Federal Reserve explains that the operators exchange payments when the originating and receiving banks use different operators.</p>
      <h3>Originating does not always mean the payer’s bank</h3>
      <p>The originating bank, often called the ODFI, submits the entry. For an ACH credit, that instruction sends funds to the recipient. For an ACH debit, the collecting business initiates the entry, and the receiving bank handles the debit to the payer’s account. Our <Link href="/company/blog/ach-credit" prefetch={false}>ACH credit article</Link> explains the difference.</p>
      <p>Your business may use a payment provider instead of submitting instructions directly to a bank. Know which service accepts your instructions, reports the result and handles support. The provider’s dashboard is one view of the process, not the whole network.</p>
    </section>
    <section id="questions" aria-labelledby="questions-title">
      <h2 id="questions-title">Take a payment question to the right team</h2>
      <h3>A supplier cannot find a payment</h3>
      <p>Suppose a buyer sees “submitted” in its payment service, but the supplier has received nothing. Nacha cannot locate that transfer: its guidance explicitly says it has no access to individual payment information.</p>
      <p>The buyer should ask the initiating bank or provider:</p>
      <ol>
        <li><strong>What does submitted mean?</strong> Confirm whether the instruction was only saved or was actually sent for processing.</li>
        <li><strong>What information identifies the entry?</strong> Check the amount, destination and dates, and ask whether an ACH trace number is available.</li>
        <li><strong>Has an exception been reported?</strong> Ask about a rejection, return or other recorded problem instead of assuming the payment is simply late.</li>
        <li><strong>Who takes the next action?</strong> Establish which team is investigating and what the supplier should provide to its own bank.</li>
      </ol>
      <p>The supplier can ask its receiving bank about the expected credit. Keep the <Link href="/company/blog/ach-trace-number" prefetch={false}>trace information</Link> and the provider’s case reference together. A trace number helps identify an entry; it is not by itself proof that the recipient can use the funds.</p>
      <p>A question about authorization belongs with the bank or provider supporting the proposed collection. Explain the account type, how the customer gives permission and whether payments will repeat. Those details affect the requirements.</p>
    </section>
    <section id="business-responsibility" aria-labelledby="business-responsibility-title">
      <h2 id="business-responsibility-title">Turn the requirements into a working process</h2>
      <p>Before launching an ACH arrangement, agree who handles authorization evidence, account changes, customer notices, failed payments, returns and record retention. Obtain the requirements for the particular service rather than copying a generic checklist.</p>
      <p>Ask your provider which tasks it performs and which remain with your business. For example, a provider may process a collection while your team remains responsible for supplying the required customer authorization. Our <Link href="/company/blog/ach-verification" prefetch={false}>ACH verification article</Link> separates account checks from permission to debit.</p>
      <p>Nacha publishes rule changes with effective dates. When a change affects your service, record the applicable date, the person responsible and any update needed to your forms or operating process. A future rule announcement is not the same as a requirement already in force.</p>
      <p>Give staff one contact for payment investigations and a clear route for requirements questions. Tell customers which bank or provider is investigating and what information is needed. Do not promise that Nacha can release their funds or confirm their available balance.</p>
    </section>
  </BlogArticlePage>;
}

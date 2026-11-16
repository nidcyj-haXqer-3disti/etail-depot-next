import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { creditDebitArticle } from "./credit-debit-content";
import s from "./blog.module.css";

const cardComparison = [
  ["Source of funds", "The customer borrows from the card issuer and repays it under their card agreement.", "The payment generally draws on money in the customer’s bank or credit union account."],
  ["Effect of a hold", "A pending authorization can reduce the credit available for other purchases.", "A pending authorization can reduce the bank funds available for other spending."],
  ["Cost to your business", "Your merchant pricing agreement determines the charges that apply.", "Your merchant pricing agreement also applies. Debit is not automatically free or cheaper for your business."],
] as const;

export function CreditDebitPage() {
  return <BlogArticlePage article={creditDebitArticle}>
    <p>A customer pays by card, sees a pending amount in their banking app and asks whether the order went through. Answering that question takes more than knowing the card’s logo. You need the payment record, its status and an understanding of how a hold affects that customer.</p>
    <section id="customer-funds" aria-labelledby="customer-funds-title">
      <h2 id="customer-funds-title">Understand where the money comes from</h2>
      <p>Credit cards let customers borrow. Debit cards generally use money in a linked bank account. Prepaid cards use a balance loaded onto the card. Some debit arrangements include overdraft, so a debit card does not always mean the customer can spend only the balance already available.</p>
      <table className={s.comparison}>
        <caption>Credit and debit cards from a merchant’s perspective</caption>
        <thead><tr><th scope="col">What changes</th><th scope="col">Credit card</th><th scope="col">Debit card</th></tr></thead>
        <tbody>{cardComparison.map(([question, credit, debit]) => <tr key={question}>
          <th scope="row">{question}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Credit card</span>{credit}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Debit card</span>{debit}</td>
        </tr>)}</tbody>
      </table>
      <p>The same network logo can appear on credit, debit and prepaid cards. It identifies the payment network, not the source of the customer’s funds. Our <Link href="/company/blog/credit-card-networks" prefetch={false}>card networks guide</Link> explains the distinction.</p>
      <p>This comparison is about accepting customer payments. Choosing a card to finance your own business expenses is a separate decision.</p>
    </section>
    <section id="merchant-cost" aria-labelledby="merchant-cost-title">
      <h2 id="merchant-cost-title">Compare the price your business pays</h2>
      <p>Start with your accepted fee schedule. A blended price can charge the same rate for eligible credit and debit payments even when the underlying costs differ. An itemized arrangement can pass through different costs. The word “debit” alone does not tell you what a sale will cost.</p>
      <p>Visa distinguishes interchange between financial institutions from the merchant price agreed with the acquiring institution. In the United States, Federal Reserve rules limit interchange for certain debit transactions, with exemptions for some issuers and card programs. Those limits do not set your complete processing price.</p>
      <p>To compare your costs, use the card types and order sizes your business actually receives. Check transaction charges, fixed fees and any relevant international or other additional fees. Compare the same sales mix under each proposed agreement rather than applying one advertised rate to every transaction.</p>
      <p>For merchants using Trolleys, an Etail Depot service, use the <Link href="/pricing" prefetch={false}>current pricing page</Link> and your accepted fee schedule. Do not substitute a published interchange table for your account’s terms.</p>
    </section>
    <section id="holds-and-refunds" aria-labelledby="holds-and-refunds-title">
      <h2 id="holds-and-refunds-title">Explain pending payments and refunds</h2>
      <p>A hold can affect both types of customer. On credit, it reduces spending room on the card. On debit, it can reduce money available for other purchases or bills. This makes an unexplained pending payment a practical concern even when your store has not completed the sale.</p>
      <p>Check the order and gateway record before requesting another payment. A customer’s pending entry does not by itself tell you whether the payment was captured, canceled or left unresolved. The <Link href="/company/blog/card-authorization" prefetch={false}>authorization guide</Link> explains those stages.</p>
      <p>For an order that will not proceed, the appropriate action depends on the recorded payment state. An authorization that has not been captured may need cancellation or reversal. A captured payment may need a refund. Follow the gateway’s supported action for that transaction.</p>
      <p>A refund request and the customer seeing the money are different events. Issuer processing affects when a card refund appears; an early reversal can instead remove the original charge. Explain the recorded status, give the customer the available reference and use your provider’s expected timing. Do not promise an immediate debit refund simply because the original payment used bank funds.</p>
      <p>Trolleys’ <Link href="/services/refunds" prefetch={false}>refund service</Link> explains the merchant workflow. For questions about available funds or a statement entry, the customer should contact their card issuer through its official support channel.</p>
    </section>
    <section id="customer-charges" aria-labelledby="customer-charges-title">
      <h2 id="customer-charges-title">Check the rules before adding a fee</h2>
      <p>Your processing cost and a fee you add to the customer’s bill are separate matters. Do not assume a payment fee is allowed simply because your business pays to accept the card.</p>
      <p>For U.S. Visa transactions, the published surcharge rules prohibit surcharges on debit and prepaid cards. Selecting “credit” when using a debit card does not turn it into a credit card or make a debit surcharge permissible.</p>
      <p>Credit card surcharges also have conditions. Before adding one, confirm the applicable network requirements, local law, disclosures and supported checkout configuration with your provider. This article does not establish that surcharging is enabled for your Trolleys account.</p>
    </section>
    <section id="checkout-checks" aria-labelledby="checkout-checks-title">
      <h2 id="checkout-checks-title">Make both work at checkout</h2>
      <p>Most customers want to pay and receive a clear result. Keep the card choice simple while preparing your team for the differences behind it.</p>
      <ol>
        <li><strong>Confirm acceptance.</strong> Ask which credit, debit and prepaid cards your account and checkout support. A logo on your website does not activate a payment method.</li>
        <li><strong>Check the records.</strong> Learn where your provider shows payment status and, when available, card funding type. Keep the order and payment references together.</li>
        <li><strong>Test the follow-up.</strong> Use the provider’s approved test setup to check unsuccessful payments, cancellations and refunds as well as successful purchases.</li>
        <li><strong>Prepare customer support.</strong> Give your team clear wording for a pending authorization, a refund in progress and a question that belongs with the issuer.</li>
      </ol>
      <p>For a Trolleys store, begin with the <Link href="/services/payment-methods" prefetch={false}>available payment methods</Link> and confirm what is enabled for your account. Then check the full purchase and refund flow before inviting customers to use it.</p>
    </section>
  </BlogArticlePage>;
}

import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { merchantCategoryCodesArticle } from "./merchant-category-codes-content";
import s from "./blog.module.css";

const businessRecords = [
  ["MCC", "A classification of the business activity used in card processing. Many businesses can share the same code."],
  ["Merchant ID (MID)", "An identifier for a merchant account or processing relationship in the relevant system. It does not describe the industry."],
  ["DBA or trading name", "The name customers know the business by. It may differ from the legal company name."],
  ["Sales channel", "How you sell, such as through a website, at a physical store or by phone. This does not fully describe what customers buy."],
  ["Statement descriptor", "The business identification shown with a card payment on the customer’s statement. It helps the customer recognize the purchase."],
] as const;

export function MerchantCategoryCodesPage() {
  return <BlogArticlePage article={merchantCategoryCodesArticle}>
    <p>Knowing your MCC helps you check whether your payment account describes the business you actually run. The useful question is not which code looks most favorable. It is whether the assigned classification fits your products, services and account setup.</p>
    <section id="what-mcc-describes" aria-labelledby="what-mcc-describes-title">
      <h2 id="what-mcc-describes-title">What an MCC describes</h2>
      <p>An MCC usually describes the merchant’s main business activity. It is not a list of every item in a customer’s basket. Some codes instead identify particular merchants or transaction types, so the general description is not the whole rulebook.</p>
      <p>Visa’s Merchant Data Standards Manual generally uses the business’s primary activity, measured by annual sales in local currency. It places responsibility for correct assignment with acquirers and their agents. Mastercard likewise requires the acquirer to ensure that the MCC reflects the merchant’s primary business, with specific rules for certain transactions.</p>
      <p>Your role is to describe the business accurately and ask the provider to confirm the classification. An industry choice in an application supplies information for that review. Stripe, for example, says it evaluates accounts and may use the business website to determine the appropriate MCC.</p>
      <p>“Online business” is not enough detail. Explain what customers purchase and how you deliver it. Selling goods through a website and selling professional services through a website share a channel, but they do not necessarily share a business classification.</p>
    </section>
    <section id="mcc-and-account-records" aria-labelledby="mcc-and-account-records-title">
      <h2 id="mcc-and-account-records-title">Keep classification separate from account details</h2>
      <p>Several fields can appear together in an application or merchant portal. They answer different questions:</p>
      <dl className={s.identifierList}>
        {businessRecords.map(([label, detail]) => <div key={label}>
          <dt>{label}</dt><dd>{detail}</dd>
        </div>)}
      </dl>
      <p>A company can operate several DBAs or merchant accounts. Those account identifiers do not replace the classification of the activity behind each account. Two accounts carrying different MIDs can still have the same MCC when their activities warrant it.</p>
      <p>The MCC also does not identify an individual order. Keep purchase descriptions, customer agreements, delivery evidence and refund records with the transaction. Our <Link href="/company/blog/merchant-accounts-and-acquiring" prefetch={false}>merchant account guide</Link> explains the account and acquiring roles.</p>
    </section>
    <section id="why-correct-code-matters" aria-labelledby="why-correct-code-matters-title">
      <h2 id="why-correct-code-matters-title">Why the correct code matters</h2>
      <p>Networks and payment providers use MCC information for reporting, risk assessment and processing rules. It can also affect interchange treatment and how issuers apply spending controls. An accurate classification helps the account information reflect the activity being processed.</p>
      <p>An MCC is not a complete price quote. Your total cost depends on the applicable processing arrangement and account terms. Ask the provider to explain the fees for your business rather than selecting a different description in the hope of getting a lower rate. Trolleys’ <Link href="/pricing" prefetch={false}>pricing page</Link> explains its current offer.</p>
      <p>Customer rewards are a separate question. Chase explains that it groups merchant codes into rewards categories, and that a purchase may not qualify even when the store or an item appears to fit the category. Refer customers to their card issuer’s terms instead of promising points or cash back based only on your MCC.</p>
      <p>A classification is not account approval. It does not authorize an undisclosed seller, restricted activity or a new payment arrangement. The <Link href="/company/legal/merchant-services" prefetch={false}>merchant services terms</Link> describe Trolleys’ account information and approval requirements.</p>
    </section>
    <section id="when-business-changes" aria-labelledby="when-business-changes-title">
      <h2 id="when-business-changes-title">Review the code when your business changes</h2>
      <p>Ask for a review when a new product line, service or sales model materially changes what the account processes. Explain the change and the sales mix rather than choosing a replacement code yourself.</p>
      <p>For a business with several activities or outlets, the answer may involve a primary classification or separate treatment. Visa has both general rules and circumstances requiring multiple MCCs. Your provider needs the details of each operation to apply the relevant rules.</p>
      <p>Another website or DBA should therefore be discussed as its own account setup question. Do not assume the company’s existing approval or code covers it. Trolleys’ <Link href="/resources/merchant-account-setup" prefetch={false}>merchant account setup guide</Link> explains requesting another MID for a different DBA under the same company. A new MID does not, by itself, establish that a different MCC is needed.</p>
      <p>Keep your website, application and account records consistent. If you plan a material change, ask what review or written approval is needed before processing the new activity.</p>
    </section>
    <section id="check-your-mcc" aria-labelledby="check-your-mcc-title">
      <h2 id="check-your-mcc-title">Ask your provider to confirm the assignment</h2>
      <p>A public code directory can help you understand possible classifications. It cannot confirm the code actually assigned to your account. Prepare these four items for a useful review:</p>
      <ol>
        <li><strong>The account to check.</strong> Identify the company, DBA, website and MID. Ask where the assigned MCC is recorded and whether the answer applies to the relevant card network and account.</li>
        <li><strong>What customers buy.</strong> Describe the main products or services, how you sell them and when customers receive them. Provide the relevant website pages or product information.</li>
        <li><strong>The reason for the question.</strong> Explain a suspected mismatch or a business change. Supply the sales breakdown requested, with its period clearly stated. Distinguish actual sales from forecasts.</li>
        <li><strong>The confirmed outcome.</strong> Keep the provider’s response, any account changes, their effective date and any further instructions. Check that your team uses the updated information.</li>
      </ol>
      <p>Send account documents through the secure method requested by the provider. A general inquiry should not include passwords, verification codes or customer card details.</p>
      <p>If you are preparing a new application, start with <Link href="/company/blog/get-a-merchant-account" prefetch={false}>what to prepare for a merchant account</Link>. Existing Trolleys merchants can use the account support details on our <Link href="/company/contact" prefetch={false}>Contact page</Link> to ask where their classification is recorded.</p>
      <p>The aim is a confirmed classification that matches your business, supported by accurate account information.</p>
    </section>
  </BlogArticlePage>;
}

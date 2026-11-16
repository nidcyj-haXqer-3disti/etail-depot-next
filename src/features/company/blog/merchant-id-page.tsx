import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { merchantIdArticle } from "./merchant-id-content";
import s from "./blog.module.css";

const accountReferences = [
  ["Processing MID", "The merchant account in a particular processing arrangement. Use the provider’s exact label and value."],
  ["Gateway or provider account ID", "The account inside that provider’s system. It is not automatically the same as the processing MID."],
  ["Order or payment reference", "A purchase, payment attempt or payment operation. It helps locate a transaction within the account."],
  ["Merchant category code (MCC)", "The classification of the business activity. Many merchants can share the same code."],
] as const;

export function MerchantIdPage() {
  return <BlogArticlePage article={merchantIdArticle}>
    <p>A support request can contain the correct order number and still lead to the wrong place if it names the wrong merchant account. The useful record is the account ID together with the provider, store and payment reference.</p>
    <section id="what-mid-identifies" aria-labelledby="what-mid-identifies-title">
      <h2 id="what-mid-identifies-title">What your merchant ID identifies</h2>
      <p>Your payment processor or acquiring provider assigns the relevant merchant identifier as part of the account setup. Some providers give merchants a provider account ID rather than a separate acquiring MID. Stripe, for example, describes its users as having a Stripe account ID rather than an individual MID.</p>
      <p>The labels matter because an account can contain many payments, and one company can have several accounts. Adyen’s structure, for example, places one or more merchant accounts under a company account. Account structures and names depend on the provider.</p>
      <dl className={s.identifierList}>
        {accountReferences.map(([identifier, detail]) => <div key={identifier}>
          <dt>{identifier}</dt><dd>{detail}</dd>
        </div>)}
      </dl>
      <p>Do not identify an account solely by the length or appearance of its number. A Cybersource Organization ID can contain a company name, while another provider uses a different format. Copy the value exactly, including any letters or leading zeros.</p>
      <p>A MID is also different from the name customers see on their statement. That name helps customers recognize the seller; it does not replace the provider’s account reference. Our <Link href="/company/blog/merchant-category-codes" prefetch={false}>MCC guide</Link> explains business classification and the other account fields.</p>
    </section>
    <section id="find-your-mid" aria-labelledby="find-your-mid-title">
      <h2 id="find-your-mid-title">Where to find your merchant ID</h2>
      <p>Start with records supplied by your own provider. Check the welcome or approval documents, merchant account details and processing statements available to authorized staff. Keep the label shown beside the ID, rather than copying an unexplained number.</p>
      <p>If you cannot find it, ask account support: “Which merchant identifier do you need, and where can I find it for this store?” A number in a bank deposit description may be shortened or refer to the deposit. Confirm it against the provider’s records before using it as a MID.</p>
      <p>For the gateway account, Visa Acceptance identifies the <strong>Organization ID</strong> as the name formerly called the Cybersource Merchant ID. Its support instructions show it in Business Center under <strong>Account Management → Users</strong>. If that screen is unavailable to your user, check the account welcome email or ask the authorized account administrator.</p>
      <p>Finding the gateway Organization ID does not confirm the acquiring or processing MID. Ask which one is required whenever a form or support message simply says “merchant ID.”</p>
    </section>
    <section id="etail-account-details" aria-labelledby="etail-account-details-title">
      <h2 id="etail-account-details-title">Keep your Trolleys account details together</h2>
      <p>After approval, your Trolleys welcome information pairs the store name and processing MID with its Cybersource Organization ID and User ID. Keep that pairing intact when connecting a website or contacting support.</p>
      <p>The <strong>Back Office Operations Portal</strong> is where you follow your merchant accounts and their activity. The <strong>Cybersource Business Center</strong> manages the selected store’s gateway, including its payment records and API credentials. One portal’s login details do not automatically identify the right account in the other.</p>
      <p>Use the store name or DBA, website and processing MID to confirm the intended account. Then match it to the gateway details supplied for that store. The <Link href="/developers/getting-started" prefetch={false}>Getting started page</Link> explains the two portals and the steps after approval.</p>
      <p>For another DBA under the same LLC or corporation, Trolleys’ <Link href="/resources/merchant-account-setup" prefetch={false}>merchant account setup guide</Link> explains the <strong>+ Location</strong> request for an additional MID. The new application still needs approval and connection to the intended checkout. Another location does not become ready to process simply because it appears in a list.</p>
    </section>
    <section id="help-locate-payment" aria-labelledby="help-locate-payment-title">
      <h2 id="help-locate-payment-title">Help support locate the right payment</h2>
      <p>Account and payment references work together. Adyen, for example, lists the merchant account, the merchant’s own reference and a separate PSP reference for the payment. Its troubleshooting guidance includes checking that you are looking in the correct account.</p>
      <p>For a payment question, provide these details through the provider’s verified support channel:</p>
      <ol>
        <li><strong>Account.</strong> Name the provider, legal company, store or DBA and the requested account ID. Say whether you are checking a live or test account.</li>
        <li><strong>Payment.</strong> Include the order reference and the gateway or processor transaction reference, if available. For a refund or dispute, include its own reference as well.</li>
        <li><strong>Search details.</strong> Give the amount, currency, date and approximate time with the time zone. Describe what status you can see.</li>
        <li><strong>The question.</strong> Say whether the payment is missing, the two account reports disagree, or a recorded payout has not reached the bank. These need different investigations.</li>
      </ol>
      <p>Matching the <Link href="/services/reconciliation" prefetch={false}>merchant and gateway reports</Link> helps establish which payment is in question. Checking a <Link href="/services/payouts" prefetch={false}>payout to your bank</Link> is a separate step. A MID alone does not show that a particular payment succeeded or reached the bank.</p>
    </section>
    <section id="keep-account-records" aria-labelledby="keep-account-records-title">
      <h2 id="keep-account-records-title">Keep account records accurate and protected</h2>
      <p>Maintain a short account list for authorized staff: provider, company, DBA, website, account IDs and whether the account is live or test. Save identifiers as text in a spreadsheet so leading zeros are preserved. Store passwords and API secrets separately in your approved secure system.</p>
      <p>A MID is an identifier, not a password or proof that someone may change the account. Use verified support channels and send only the information needed. Do not include login passwords, one time verification codes, secret API keys or full customer card details in a routine payment inquiry.</p>
      <p>When <Link href="/company/blog/switch-payment-processors" prefetch={false}>switching payment processors</Link>, keep the previous account ID associated with its earlier transactions. Do not relabel old payments with the replacement account’s ID. Confirm how to retrieve statements and manage remaining refunds or disputes before closing access.</p>
      <p>The aim is a clear account record that helps your team find the right store and payment without guessing. Existing Trolleys merchants can find account support details on our <Link href="/company/contact" prefetch={false}>Contact page</Link>.</p>
    </section>
  </BlogArticlePage>;
}

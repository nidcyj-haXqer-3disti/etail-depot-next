import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { gettingMerchantAccountArticle } from "./getting-merchant-account-content";
import s from "./blog.module.css";

const applicationDetails = [
  ["Legal name and DBA", "Use the legal business name from your records. Enter the trading name customers know separately where the form asks for a DBA."],
  ["Monthly volume", "The total amount you expect to process through this account in one month. It is a money amount, not the number of orders."],
  ["Average ticket", "The average amount of one sale. Divide the sales total by the number of sales for the same period and payment activity."],
  ["Highest card order", "The largest single credit card order you expect to accept, rather than your average sale or monthly total."],
  ["Delivery and billing", "Explain when customers pay, when you deliver and whether you take deposits, advance orders or recurring payments."],
] as const;

export function GettingMerchantAccountPage() {
  return <BlogArticlePage article={gettingMerchantAccountArticle}>
    <p>A merchant account application gives the provider a picture of your business: who operates it, what customers buy and how payments will work. Clear answers make that picture easier to review. They do not replace the provider’s decision or the setup needed to begin accepting payments.</p>
    <section id="confirm-business-fit" aria-labelledby="confirm-business-fit-title">
      <h2 id="confirm-business-fit-title">Confirm the account fits your business</h2>
      <p>Before completing a long form, confirm that the provider supports your goods or services, business location and sales channels. Explain whether customers pay through a website, in person, by phone or on a recurring basis. Ask about the specific payment methods and store connection you intend to use.</p>
      <p>Describe the actual offer. Advance bookings, custom orders and services delivered over several months can require a different review from goods shipped immediately. If another provider restricted or closed an account, answer any questions about that history accurately.</p>
      <p>A merchant account is not the business bank account that receives your payouts, and it is not the checkout form on your website. Our <Link href="/company/blog/merchant-accounts-and-acquiring" prefetch={false}>merchant accounts and acquiring article</Link> explains those roles. Confirm which services come together and which need separate setup.</p>
    </section>
    <section id="prepare-your-records" aria-labelledby="prepare-your-records-title">
      <h2 id="prepare-your-records-title">Prepare consistent business records</h2>
      <p>Gather the business, ownership, tax and bank information requested by your provider. Depending on the account and business, supporting documents may include registration records, identification, bank evidence or previous processing statements. Follow the application’s actual requirements rather than assuming every provider needs the same documents.</p>
      <p>Check names and contact details before entering them. Your legal company name and storefront name can differ. Record each in the appropriate field and provide the requested evidence connecting them. If bank records use a different name, ask what documentation is needed; do not alter the records to make them look consistent.</p>
      <p>Choose a business contact who can respond to review questions. Use a phone number the business controls and monitors. In the Trolleys application, use the bank’s ACH routing number and account number, not the debit card number. Keep any leading zeros and check the confirmation fields.</p>
      <p>Submit sensitive records through the verified application portal or another secure method approved by the provider. Keep login passwords and verification codes private.</p>
    </section>
    <section id="explain-your-sales" aria-labelledby="explain-your-sales-title">
      <h2 id="explain-your-sales-title">Explain how you sell</h2>
      <p>Sales questions help the reviewer understand the activity expected on the account. Use processing history where available. For a new business, provide realistic estimates and explain their basis when asked. These common fields describe different things:</p>
      <dl className={s.identifierList}>
        {applicationDetails.map(([label, detail]) => <div key={label}>
          <dt>{label}</dt><dd>{detail}</dd>
        </div>)}
      </dl>
      <p>Follow the form’s scope. If it asks for card volume, do not substitute total revenue from every payment method. Explain seasonal peaks or unusually large orders instead of presenting them as an ordinary month.</p>
      <p>Your website should support the same account of the business. Make the products or services, prices and currency clear. Customers should be able to find contact details and the delivery, refund, return or cancellation policies that apply to their purchase. For subscriptions, explain the billing schedule and how to cancel.</p>
      <p>Do not rewrite your offer just to fit an application category. If a field does not describe your model well, ask the provider how to explain it.</p>
    </section>
    <section id="review-and-apply" aria-labelledby="review-and-apply-title">
      <h2 id="review-and-apply-title">Review the terms and complete the application</h2>
      <p>Read the agreement and fee schedule before accepting them. Confirm transaction charges, recurring account fees, payout conditions, any reserve provisions, contract duration and cancellation requirements. Ask how changes to your website, ownership or business activity must be reported. Keep a copy of the terms you accept.</p>
      <p>Use the <Link href="/company/blog/choose-a-merchant-services-provider" prefetch={false}>provider comparison checklist</Link> if any part of the offer is unclear. For merchants using Trolleys, an Etail Depot service, review the <Link href="/company/legal/payouts-and-reserves" prefetch={false}>payout and reserve terms</Link> alongside your account agreement.</p>
      <p>Review the completed application, correct errors and sign only if you are authorized to act for the business. The provider may request further information during underwriting, its review of the business and expected payment activity. Respond through the approved channel and follow the application status. Timing and the decision depend on the account and review.</p>
      <p>Applying with Trolleys? The <Link href="/resources/merchant-account-setup" prefetch={false}>merchant account setup guide</Link> shows the Welcome page, business application and review process. Creating your Trolleys login does not approve or activate merchant services.</p>
    </section>
    <section id="finish-account-setup" aria-labelledby="finish-account-setup-title">
      <h2 id="finish-account-setup-title">Finish setup after approval</h2>
      <p>Use your approval and welcome instructions to complete the connection. Before opening checkout to customers, confirm these four items:</p>
      <ol>
        <li><strong>Account approval.</strong> Confirm the approved company, store or DBA, merchant ID and any account conditions. Another store’s approval does not establish that this account is ready.</li>
        <li><strong>Payment setup.</strong> Connect the intended store to the correct live gateway account, enable the approved methods and complete the provider’s testing process. A successful sandbox payment is not a live payment.</li>
        <li><strong>Operating access.</strong> Confirm that staff can find transactions, manage permitted refunds, monitor disputes and access the right account reports.</li>
        <li><strong>Funding information.</strong> Check the receiving bank details and account payout terms. Know where to follow a payout and who to contact if its status needs investigation.</li>
      </ol>
      <p>For Trolleys merchants, the Back Office Operations Portal and Cybersource Business Center have different roles and sign in details. The <Link href="/developers/getting-started" prefetch={false}>after approval setup guide</Link> explains the account information your web team needs. Our <Link href="/services/payouts" prefetch={false}>payout guide</Link> explains how to follow funding.</p>
      <p>The goal is an approved account your business can use and manage, with the payment connection, staff access and funding arrangements understood before launch.</p>
    </section>
  </BlogArticlePage>;
}

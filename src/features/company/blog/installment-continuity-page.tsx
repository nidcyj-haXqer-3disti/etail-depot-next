import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { installmentContinuityArticle } from "./installment-continuity-content";

export function InstallmentContinuityPage() {
  return <BlogArticlePage article={installmentContinuityArticle}>
    <p>A customer bought once and agreed to pay over time. The merchant’s processor change should not turn that agreement into a second purchase or an unexpected new collection.</p>
    <p>The first question is who is collecting the installments. A merchant scheduling several card charges and a financing provider collecting repayments are different arrangements, even if the customer sees similar monthly amounts.</p>

    <section id="identify-the-obligation" aria-labelledby="identify-the-obligation-title">
      <h2 id="identify-the-obligation-title">Establish who owns the remaining work</h2>
    <p>Consider a fictional merchant-managed purchase of $900 in three $300 installments. With one installment completed and no other adjustments, $600 remains. Recreating the plan from its original $900 price would lose credit for a payment already made. The migration needs the remaining obligation, its due dates and any changes or refunds, alongside a supported payment method and authority for future collections. A customer record alone does not establish those facts.</p>
    <p>With third-party financing, the customer’s repayment relationship may sit with the finance provider. Affirm’s published WebSell arrangement, for example, describes merchants receiving payment upfront while customers pay over time. That structure is different from the merchant continuing to collect each installment itself. The financing and merchant agreements determine the responsibilities; changing the ordinary card processor does not automatically move the financing arrangement.</p>
    <p>Do not recreate those customer repayments as new merchant card charges just because the storefront changes. Identify the responsible provider and confirm the handling of returns, refunds and customer inquiries under the original arrangement.</p>
    </section>

    <section id="preserve-the-promise" aria-labelledby="preserve-the-promise-title">
      <h2 id="preserve-the-promise-title">Move only what is supported and authorized</h2>
    <p>For a supported migration of merchant-managed collections, reconcile the remaining obligation before activating a replacement schedule. Include payments that are pending, disputed or being refunded. Decide which system performs the next collection and stop overlapping instructions through the approved process.</p>
    <p>If the customer must authorize a new arrangement or provide a payment method again, explain what that action continues. Showing the original purchase, payments already credited and remaining schedule helps the customer distinguish a request to maintain the plan from a request to buy again. Preserve the agreed price and payment history; any change to the commercial terms needs its own valid basis.</p>
    <p>Trolleys’ recurring-payment capability, where enabled, does not establish that it can assume a financing contract or every installment plan. Discuss the exact <Link href="/company/legal/merchant-services#service-order" prefetch={false}>account scope and payment arrangement</Link> before treating it as transferable.</p>
    <p>The customer should be able to understand the remaining obligation after the switch just as well as before it. A different provider behind the checkout is an internal change to manage, not a reason to make the customer pay twice or lose credit for what was already paid.</p>
    </section>
  </BlogArticlePage>;
}

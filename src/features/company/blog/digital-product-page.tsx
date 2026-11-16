import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { digitalProductArticle } from "./digital-product-content";
import s from "./blog.module.css";

const costs = [
  ["Creation", "Research, writing, design, testing and any licensed materials.", "Separate the initial production work from later updates."],
  ["Selling and delivery", "Store or marketplace fees, payment charges and file or course hosting.", "Check the actual plan and charges that apply to each sale."],
  ["Support", "Questions, access recovery, file problems and refund handling.", "Record the time spent and the problems customers repeatedly encounter."],
  ["Ongoing work", "Maintenance, marketing, administration and other overhead.", "Keep these costs in the budget even when copying another file costs very little."],
] as const;

export function DigitalProductPage() {
  return <BlogArticlePage article={digitalProductArticle}>
    <section id="define" aria-labelledby="define-title">
      <h2 id="define-title">Sell a specific usable result</h2>
      <p>Describe the product narrowly enough that a buyer can judge whether it fits. A scheduling spreadsheet for a particular type of business is easier to evaluate than a promise to “transform productivity.” Provide a representative sample, required software, file formats and any limits on customization.</p>
      <p>State whether the purchase covers one person or a team, whether commercial use is permitted and what updates or support are included. A downloadable file and an ongoing hosted service create different expectations after purchase. Explain whether access ends, whether later versions cost extra and how the customer gets help.</p>
      <p>Confirm you have the necessary rights to the material you sell, including images, fonts, code and contributed content. The US Copyright Office explains that owners control rights such as copying and distribution, subject to legal exceptions. Check the applicable license or permission before including someone else’s work in your product.</p>
      <p>Keep the first offer small enough to finish and test. A complete template with useful instructions is easier to evaluate than a large bundle that leaves buyers unsure where to begin.</p>
    </section>
    <section id="economics" aria-labelledby="economics-title">
      <h2 id="economics-title">Count support as part of delivery</h2>
      <p>Copying a file at low technical cost does not make the business costless. Use actual costs and time records rather than assuming every new sale is passive income. The price needs to support the work around the product as well as the product itself.</p>
      <figure className={s.financialMovements}>
        <figcaption>Costs to include before choosing a price</figcaption>
        <dl>{costs.map(([cost, include, check]) => <div key={cost}>
          <dt>{cost}</dt>
          <dd><p>{include}</p><p className={s.financialQuestion}>{check}</p></dd>
        </div>)}</dl>
      </figure>
      <p>Keep gross sales separate from what remains after fees, refunds and operating costs. Account for taxes according to the rules that apply to your business and sales. Use the same period when comparing sales with support and maintenance work.</p>
      <p>If a revised instruction sheet reduces avoidable support requests, it may improve the economics more reliably than adding another product. Review the questions people ask before changing the price or expanding the catalog.</p>
    </section>
    <section id="delivery" aria-labelledby="delivery-title">
      <h2 id="delivery-title">Connect payment to the right access</h2>
      <p>Use the payment provider’s confirmed outcome to decide when to release paid access. A customer reaching a thank you page is not enough evidence by itself. Stripe’s fulfillment documentation explains that a customer can pay successfully and then lose their connection before the return page loads.</p>
      <p>For automated delivery, the store or delivery service should handle payment notifications, delayed outcomes and repeated notifications for the same order. Stripe’s guidance checks payment status and records fulfillment so repeated events do not create duplicate access. Confirm how your chosen platform handles this before promising instant delivery.</p>
      <p>If a selling platform already provides payment confirmation and digital delivery, use and test that supported connection. Custom code is not required simply because the product is digital. Check that it delivers the correct file, course or access permission for the item purchased.</p>
      <p>Keep the order reference, purchased version and delivery record connected. A customer who loses a download email should have a recovery path tied to the original purchase. Shopify’s Digital Products documentation, for example, provides an order based process to resend the download email and manage access limits.</p>
      <p>Verify the buyer before restoring access or changing the delivery address. For externally hosted content, also check the destination’s sharing permissions. Sending a link does not itself restrict who can open the content, and turning off a delivery link may not remove access at the destination.</p>
    </section>
    <section id="validate" aria-labelledby="validate-title">
      <h2 id="validate-title">Test usefulness before enlarging the catalog</h2>
      <ul>
        <li><strong>Understanding.</strong> Can a prospective buyer explain what is included, the usage rights and what they still need to do?</li>
        <li><strong>First use.</strong> Can someone complete the intended task using the product and its instructions, without help from its creator?</li>
        <li><strong>Recovery.</strong> Can support restore legitimate access, correct a file problem and apply the stated refund policy without an unnecessary second charge?</li>
        <li><strong>Maintenance.</strong> Who will update the product when its underlying software or assumptions change, and how will existing buyers receive eligible updates?</li>
      </ul>
      <p>Use the provider’s supported test mode to check purchase and delivery, including a payment that fails or remains pending. Open the delivered product as a customer rather than from the owner’s account. An email arriving successfully does not prove its file or link is usable.</p>
      <p>Review tax, consumer rights and refund obligations for the actual product and selling locations; do not assume digital delivery removes them. Make the product’s terms and support contact available before purchase.</p>
      <p>Expand only after evidence from real use supports the offer. A functioning checkout proves collection works, not that the product solves a valuable problem. For the store itself, see our <Link href="/company/blog/create-an-online-shop" prefetch={false}>online shop setup article</Link>. If the software belongs inside a physical device, our <Link href="/company/blog/embedded-software-monetization" prefetch={false}>embedded software article</Link> covers that different licensing and access model.</p>
    </section>
  </BlogArticlePage>;
}

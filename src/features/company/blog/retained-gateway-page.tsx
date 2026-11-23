import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { retainedGatewayArticle } from "./retained-gateway-content";

export function RetainedGatewayPage() {
  return <BlogArticlePage article={retainedGatewayArticle}>
    <p>A merchant has a working checkout and a reason to change its processing arrangement. Rebuilding the storefront would add expense without solving the original problem. Keeping Authorize.net may look like the obvious compromise.</p>
    <p>It can be a sensible option. But keeping the gateway and keeping the merchant account are different decisions. The gateway sits between the store and a particular processing arrangement; the new provider must support that arrangement, not merely recognize the gateway’s name.</p>

    <section id="what-stays-connected" aria-labelledby="what-stays-connected-title">
      <h2 id="what-stays-connected-title">Ask for a supported account connection</h2>
    <p>Authorize.net documents a process for changing the connected processor using information supplied for the new merchant account. An owner or administrator must be involved, and a reseller-subsidized account can require the reseller’s approval. Its documentation says a supported update does not require changing the existing website or API configuration.</p>
    <p>That continuity can remove a major source of work, but it can also make the change look smaller than it is. Staff see the familiar checkout while the business is accepting a different processing relationship behind it. Establish which merchant account, acquiring connection and enabled services the proposal covers. A sales statement that the provider “works with Authorize.net” is not confirmation for this specific account.</p>
    <p>The retained gateway also has its own commercial arrangement. Find out who will bill for it after the change and whether any existing subsidy or bundled charge ends. Closing the old processing agreement should not accidentally close the gateway the store intends to keep.</p>
    </section>

    <section id="the-history-still-matters" aria-labelledby="the-history-still-matters-title">
      <h2 id="the-history-still-matters-title">Give earlier transactions their own plan</h2>
    <p>A new sale after the switch is only part of the work. The team also needs the provider’s documented treatment of transactions already in progress, refunds and failed batches, tied to the effective change. Those actions can follow different routes from a new sale. A familiar screen does not tell staff which account is responsible for an earlier payment. Without that distinction, the merchant can preserve the checkout and still leave support unable to answer an old-order question.</p>
    <p>Trolleys’ published connection guides use Cybersource. Keeping an existing Authorize.net account therefore requires explicit compatibility confirmation for the proposed Trolleys arrangement; it is not an option to assume from this article. Bring the gateway account type and current integration to a <Link href="/use-cases/switch-merchant-services" prefetch={false}>switching discussion</Link> before making commitments.</p>
    <p>The value of keeping the gateway is that fewer parts may need to change, leaving the team more attention for the parts that do. The proposal should make that boundary visible: the retained connection, the new account responsibilities and the route for earlier transactions. Then continuity becomes something the merchant can verify, rather than an assumption borrowed from an unchanged checkout screen.</p>
    </section>
  </BlogArticlePage>;
}

import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { mixedOfferArticle } from "./mixed-offer-content";

export function MixedOfferPage() {
  return <BlogArticlePage article={mixedOfferArticle}>
    <p>The store sells home accessories. Most orders are familiar retail purchases. It also sells a paid membership, takes deposits for custom installations and has started listing products sold by independent sellers.</p>
    <p>Home accessories is still a reasonable description of the brand. It is an incomplete description of the proposed payment activity.</p>
    <p>A merchant application needs enough detail to show the differences that matter. The largest revenue line should not conceal a smaller activity with a different seller, delivery period or billing arrangement.</p>
    <p>The product navigation may put all these purchases in one menu. The obligations do not become uniform with it. A shipped lamp, a monthly membership and an installation deposit leave the business owing different things after payment.</p>
    <p>A revenue estimate can give the mix proportion. It cannot make an undisclosed activity approved merely because its share is small. Be especially clear about regulated, restricted or otherwise materially different products.</p>
    <p>Keep customer terms aligned with the actual purchase. A return policy for a shipped item may not explain cancellation of a membership or the treatment of a custom-work deposit. The application should connect each material offer to its own customer promise.</p>
    <p>Do not choose the easiest industry label and trim the description to fit it. Provide the actual product mix so the responsible provider can determine classification and supported scope. A merchant category code is not a menu of permissions the business can select for itself.</p>
    <p>Trolleys’ acceptable-use terms require specific written approval for activities identified for review and make clear that approval of one activity does not approve another seller or business. Existing account access or a successful payment does not settle that approval.</p>
    <p>A planned offer can be discussed before it is sold. Keeping that distinction visible gives the business a chance to establish the requirements while a launch is still adjustable, rather than after customers have already paid.</p>
    <p>A small experiment can therefore deserve a large part of the conversation. Its share of revenue may be minor; its effect on the seller, billing arrangement or delivery promise may be substantial.</p>
    <p>For a Trolleys merchant, report relevant changes to products, delivery and sales model and obtain any required approval. The <Link href="/company/blog/merchant-category-codes" prefetch={false}>merchant category code article</Link> explains why classification should follow the business rather than its preferred label.</p>
    <p>The aim is an account that reflects what customers can actually buy. A concise description can do that, provided it includes the differences instead of averaging them away.</p>
  </BlogArticlePage>;
}

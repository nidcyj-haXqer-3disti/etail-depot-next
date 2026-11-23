import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { providerExclusivityArticle } from "./provider-exclusivity-content";

export function ProviderExclusivityPage() {
  return <BlogArticlePage article={providerExclusivityArticle}>
    <p>A second provider might solve a real problem: reach a customer group, support another channel or provide a carefully designed alternative when the primary connection fails. The integration team can explain how to connect it.</p>
    <p>Someone still needs to establish whether the business has promised the first provider particular activity or volume. A successful test payment cannot answer that question.</p>
    <p>Exclusivity can be defined by a company, channel, territory, payment method or other scope. Read the actual wording rather than assuming it covers every sale or none of them. A minimum commitment can also make a move expensive without prohibiting it. Redirecting sales may reduce eligible activity below an agreed threshold even when a second provider is allowed.</p>
    <p>The distinction changes the commercial conversation. If the proposed use falls outside an exclusivity provision, document why. If it falls inside, obtain the required written amendment or consent before relying on a sales representative’s informal reassurance. Where the wording is material and disputed, have it reviewed by someone qualified to interpret the agreement.</p>
    <p>Approval by the second provider is independent. Permission from the first does not authorize the new account to process a different business, location or transaction type. The merchant also needs a clear plan for duplicates, refunds, disputes and reporting across the two arrangements. A second provider should not become an automatic retry for a payment whose result is still unknown.</p>
    <p>For a Trolleys account, use the <Link href="/company/legal/merchant-services#account-documents" prefetch={false}>accepted Service Order and incorporated documents</Link> to establish the permitted business and services. Do not infer a blanket exclusivity rule from the fact that the account exists, or infer unrestricted routing from the fact that a gateway can connect.</p>
    <p>The strongest case for a second provider names the gap it closes and the obligations it leaves behind. That allows the business to negotiate from a defined need. Adding another integration without understanding the first commitment can produce two bills and one unresolved contract problem.</p>
  </BlogArticlePage>;
}

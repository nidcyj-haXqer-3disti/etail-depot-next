import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { overseasOwnerArticle } from "./overseas-owner-content";

export function OverseasOwnerPage() {
  return <BlogArticlePage article={overseasOwnerArticle}>
    <p>Form the company. Obtain the tax number. Open the website. Add payments.</p>
    <p>That sequence looks straightforward in a launch plan. For a business whose owner lives outside the United States, the last step may raise questions the earlier steps never answered.</p>
    <p>A US entity, a US customer base and an owner’s residence describe different parts of the business. Completing one part does not establish that a particular merchant service supports the whole arrangement.</p>

    <section id="before-spending" aria-labelledby="before-spending-title">
      <h2 id="before-spending-title">Ask about the actual arrangement before paying to build it.</h2>
    <p>A useful eligibility question identifies where the applicant is formed, where its owners live, where it operates, what it sells and how it expects to receive payouts. Ask which parts are supported and which still require review. A reply that only says “we support US companies” leaves the ownership and operating facts unanswered; ask the responder to address those facts explicitly.</p>
    <p>An EIN is a tax identifier. The IRS has procedures for international applicants, but obtaining a number does not establish payment processing eligibility. Similarly, an address service or a US bank account does not independently decide whether the merchant application is acceptable.</p>
    <p>The cost of leaving that question late is more than another round of paperwork. Once integration work is paid for and a launch date is public, the business has an incentive to treat a partial answer as a complete one. Resolve eligibility while changing the plan is still an ordinary decision, before everyone is waiting for activation.</p>
    </section>

    <section id="trolleys-scope" aria-labelledby="trolleys-scope-title">
      <h2 id="trolleys-scope-title">What the current Trolleys terms establish.</h2>
    <p>Trolleys’ published Merchant Services Terms identify the applicant as a United States business. They do not provide a blanket promise that every foreign-resident owner is accepted, or a blanket statement that every such owner is excluded.</p>
    <p>Bring the actual arrangement to the implementation team and ask for the applicable eligibility and documentation requirements. The <Link href="/services/merchant-onboarding" prefetch={false}>merchant onboarding page</Link> explains the service; the decision still concerns the particular applicant and its activity.</p>
    <p>Keep preliminary eligibility discussions separate from document submission. The first question can describe countries and roles without attaching passports, tax records or bank details to an ordinary email. Once the process is confirmed, supply requested evidence through the designated secure channel.</p>
    </section>

    <section id="truthful-arrangement" aria-labelledby="truthful-arrangement-title">
      <h2 id="truthful-arrangement-title">Do not create a local representative on paper only.</h2>
    <p>If the owner lives abroad, do not present a friend’s address as the owner’s home or list a local employee as an owner to simplify the form. A genuine authorized representative may have a legitimate role, but that role should be accurately described and supported.</p>
    <p>The provider needs to understand the real business. So does the owner: who can administer the account, who receives requests, what documents are accepted and what remains conditional before activation.</p>
    <p>An early, specific answer is commercially valuable even when it changes the plan. It lets the business choose a supported route before the website, customers and inventory are waiting for a payment connection.</p>
    </section>
  </BlogArticlePage>;
}

import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { writtenSalesTermsArticle } from "./written-sales-terms-content";

export function WrittenSalesTermsPage() {
  return <BlogArticlePage article={writtenSalesTermsArticle}>
    <p>“We will take care of that” is reassuring during a sales call. Six months later, it is a poor instruction for a support team that was not on the call.</p>
    <p>The merchant may remember a fee waiver. The salesperson may have meant a discretionary credit after activation. Billing may have received neither instruction. Nobody has to be dishonest for the business to end up paying something it thought had been removed.</p>

    <section id="make-the-promise-observable" aria-labelledby="make-the-promise-observable-title">
      <h2 id="make-the-promise-observable-title">Write down what the business should be able to observe</h2>
    <p>In the hypothetical waiver conversation, the next question is what finance should see. Will the setup fee be absent, or will a later credit offset it? If a credit is intended, when should it appear and what must happen first? Those answers expose a difference that the reassuring phrase concealed.</p>
    <p>A useful commitment gives the next employee enough detail to recognize delivery: the affected account and service, the promised result, its timing and its conditions. Precision matters most in the few words that different teams could reasonably understand in different ways. Resolving those words can make a short commitment much more useful.</p>
    <p>The person accepting the commitment must have authority for the party making it. A payment representative cannot bind a separate bank, software provider or equipment lessor merely because their services appear in the same sales discussion.</p>
    <p>The Minnesota Attorney General advises businesses to have promised processing features recorded in the contract. The practical benefit goes beyond a later dispute: the people delivering the service receive something they can implement.</p>
    </section>

    <section id="put-the-promise-where-it-belongs" aria-labelledby="put-the-promise-where-it-belongs-title">
      <h2 id="put-the-promise-where-it-belongs-title">The agreement is also an operating instruction</h2>
    <p>Trolleys’ <Link href="/company/legal/merchant-services#service-order" prefetch={false}>Merchant Service Order</Link> is where account services, commercial terms and agreed variations are recorded. The <Link href="/company/legal/merchant-services#account-documents" prefetch={false}>document priority rules</Link> identify how an express amendment changes a clause. The merchant should receive the completed accepted documents, not just an email saying they will be updated later.</p>
    <p>Keep correspondence that explains the commercial discussion, but do not treat a loose collection of messages as a substitute for resolving the agreement itself. If a requested term cannot be approved, knowing that before signing is valuable. The business can decide whether the remaining offer is still acceptable.</p>
    <p>A promise has survived the sales handoff when an ordinary billing or support employee can find it, understand it and act within their authority to deliver it. The merchant should not need a personal relationship with the original salesperson to explain what the business bought.</p>
    </section>
  </BlogArticlePage>;
}

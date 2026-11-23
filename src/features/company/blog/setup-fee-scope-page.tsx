import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { setupFeeScopeArticle } from "./setup-fee-scope-content";

export function SetupFeeScopePage() {
  return <BlogArticlePage article={setupFeeScopeArticle}>
    <p>“Setup included” sounds complete. It can mean that somebody created an account and sent credentials. It can also mean that a team connected the store, checked the payment flow and made sure the merchant could operate it.</p>
    <p>Those are different purchases. A fee labeled “setup” tells the owner very little until the work behind it is defined.</p>

    <section id="what-ready-means" aria-labelledby="what-ready-means-title">
      <h2 id="what-ready-means-title">Ready for the first payment is an incomplete finish line</h2>
    <p>A working Pay button is important. So is what happens after it is pressed. The order needs the correct status. A repeated request should not produce an avoidable duplicate. The team needs to understand where a refund is issued and how its records relate to the original payment.</p>
    <p>These are appropriate acceptance questions for implementation work. They are not a promise that every setup service includes custom development. A provider creating the merchant account and a web team implementing checkout may have different responsibilities. The scope needs to say where each one stops.</p>
    <p>The same applies to account approval. Technical configuration does not itself authorize every business activity or payment method. A developer can complete an integration while an account still has conditions to satisfy. Calling both steps “setup” invites a misunderstanding about what is ready.</p>
    </section>

    <section id="what-remains-after-handover" aria-labelledby="what-remains-after-handover-title">
      <h2 id="what-remains-after-handover-title">The useful deliverable survives the person who installed it</h2>
    <p>The merchant should know who controls the account, where operational instructions live and whom to contact when an issue crosses between the website and the gateway. Credentials belong in appropriate secure access, not in a public guide or a forgotten contractor’s inbox.</p>
    <p>The handover proves its value when the person who installed checkout is unavailable. Can the team handle an ordinary refund, recognize a mismatched payment record and reach the right support contact? They do not need to become developers. They do need enough operational knowledge to avoid turning every routine question into another paid call to the installer.</p>
    <p>This is why the dollar amount alone is a weak way to judge a setup fee. A free account opening may be perfectly adequate for a merchant with its own capable web team. A paid implementation may be good value when it removes real work and ends with verifiable results. A charge with no defined outcome is harder to defend.</p>
    <p>For Trolleys merchants, <Link href="/developers/getting-started" prefetch={false}>getting started</Link> separates approved account access from the work of connecting a custom website. That distinction helps the owner assign the work rather than assume that one welcome email completed the whole project.</p>
    <p>The simplest commercial test is to describe what will be true when setup is finished. If neither side can do that clearly, they have not yet agreed what the fee buys.</p>
    </section>
  </BlogArticlePage>;
}

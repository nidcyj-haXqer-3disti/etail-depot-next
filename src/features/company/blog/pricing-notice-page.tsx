import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { pricingNoticeArticle } from "./pricing-notice-content";

export function PricingNoticePage() {
  return <BlogArticlePage article={pricingNoticeArticle}>
    <p>The increase is modest. The notice is buried in an inbox used by someone who left the company. By the time finance sees the new rate, the business has already paid it.</p>
    <p>Keeping a current notice contact sounds like administration until that contact is the only route by which the owner learns the price is changing.</p>

    <section id="time-to-decide" aria-labelledby="time-to-decide-title">
      <h2 id="time-to-decide-title">The notice should enable a commercial decision</h2>
    <p>A useful notice identifies the old and new charge, the activity it affects, the effective date and the merchant’s options. Apply it to a representative period of your own business. An increase in a fixed transaction charge can affect a high-volume, small-order seller differently from a business collecting fewer large invoices.</p>
    <p>A higher price does not, by itself, make moving the better choice. A reliable service may still be worth its new cost, and a switch demands work of its own. The notice gives the business time to compare those consequences. Its value is the opportunity to accept, challenge or leave deliberately, rather than being forced into a rushed response.</p>
    <p>That opportunity has a timetable. Clarifying the calculation, negotiating and arranging any transition all use it. The deadline for a response and the date the new price starts may be different. Do not assume that continuing a support conversation suspends either one.</p>
    <p>If the notice arrives late or is unclear, retain it and raise the specific defect promptly. Establish the provider’s position on the effective date and any remedy. Whether a disputed notice satisfies legal requirements can depend on the agreement and applicable law; the account team should not substitute a general reassurance for a documented answer.</p>
    </section>

    <section id="the-trolleys-position" aria-labelledby="the-trolleys-position-title">
      <h2 id="the-trolleys-position-title">What the Trolleys terms say</h2>
    <p>Under our <Link href="/company/legal/merchant-services#changes" prefetch={false}>published merchant terms</Link>, material adverse changes and increases in Etail’s fees ordinarily require at least 30 days’ written notice, or longer where the law or Service Order requires it. The notice identifies the change, date and options. A merchant may end the affected service before the change takes effect without a charge solely for rejecting it.</p>
    <p>The change must also follow the acceptance process specified in the Service Order and permitted by law. The terms preserve an exception for a change strictly required sooner by law or a binding provider or network requirement, with as much notice as permitted. Existing obligations and separate provider terms still need to be considered. This is not a promise that ending a service removes every amount already owed.</p>
    <p>A monitored address is only the beginning. Someone must be responsible for turning the notice into a decision and bringing it to whoever can make that decision before the relevant deadline. Otherwise, a message can be read, forwarded and filed while the opportunity it offered quietly expires.</p>
    </section>
  </BlogArticlePage>;
}

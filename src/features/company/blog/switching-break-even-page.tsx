import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { switchingBreakEvenArticle } from "./switching-break-even-content";

export function SwitchingBreakEvenPage() {
  return <BlogArticlePage article={switchingBreakEvenArticle}>
    <p>A lower rate creates an opportunity to save money. Moving to it consumes money and attention before that saving arrives.</p>
    <p>Somebody has to change the integration, reconcile the first new reports, explain the refund process and make sure the old arrangement ends properly. In a small business, that somebody may also be the person launching a product or fixing fulfillment. The proposal can show a saving while the project remains a poor use of the team’s next month.</p>
    <p>This is the decision behind the rate comparison: does the improvement justify the work of reaching it?</p>

    <section id="the-cost-of-moving" aria-labelledby="the-cost-of-moving-title">
      <h2 id="the-cost-of-moving-title">The saving starts later than the spending</h2>
    <p>Implementation costs are paid while the existing service may still be running. The new arrangement may receive only part of the volume during transition. A projected monthly saving at full volume should not be counted from the day the merchant signs.</p>
    <p>For a deliberately simple illustration, $6,000 of switching cost takes 15 months to recover from a steady $400 net monthly saving. If the transition delays that saving, recovery takes longer. If the new service adds a recurring charge, subtract it before using the monthly figure. The example is arithmetic, not a forecast for a Trolleys merchant.</p>
    <p>Internal work belongs in the decision even when it does not create an extra cash invoice. Existing staff still have limited time. Keep their effort visible alongside the external spend, without confusing the economic value of that time with cash the business must pay out.</p>
    <p>Saved payment details can make the scope more substantial. Migration can require coordination between providers, record mapping and changes to the merchant’s integration. Stripe’s migration documentation describes these dependencies. A store should establish its own transfer scope and continuity plan before assuming that existing customers will move with a configuration change.</p>
    </section>

    <section id="the-reason-to-move" aria-labelledby="the-reason-to-move-title">
      <h2 id="the-reason-to-move-title">Some reasons to switch are worth more than the fee saving</h2>
    <p>A merchant may be leaving because support is ineffective, the integration no longer fits or the service cannot support approved plans for the business. Those can be sound reasons even if the rate saving alone produces a long payback period.</p>
    <p>Name the problem and establish how the replacement will solve it. A lower price does not prove that support will improve. A broader feature list does not prove that the required workflow works. The operational benefit needs evidence of its own.</p>
    <p>The timing deserves the same scrutiny as the saving. A switch just before a planned store rebuild could make the team do some integration work twice. Combining the projects might reduce that effort, while waiting means living with the present service for longer. The cheapest moment to move is not necessarily the earliest one. Lower volume, a delayed launch or a smaller realized saving can change the balance again.</p>
    </section>

    <section id="a-decision-worth-making" aria-labelledby="a-decision-worth-making-title">
      <h2 id="a-decision-worth-making-title">The merchant should be able to choose either answer</h2>
    <p>Trolleys’ <Link href="/use-cases/switch-merchant-services" prefetch={false}>switching guidance</Link> puts account review, approved capabilities and existing obligations into the decision. A new provider cannot release money held by the old one, and approval of the new account should precede reliance on it.</p>
    <p>For an owner considering Trolleys, the useful proposal connects the improvement to the work required to achieve it. A store spending hours on reconciliation may value a better operating process more than a modest fee saving. A store whose service works well may reasonably decide that the same saving does not justify a move.</p>
    <p>That choice is the purpose of the calculation. The lowest quote should have to compete for the merchant’s money and attention just as any other business investment does.</p>
    </section>
  </BlogArticlePage>;
}

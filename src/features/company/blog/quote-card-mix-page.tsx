import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { quoteCardMixArticle } from "./quote-card-mix-content";

export function QuoteCardMixPage() {
  return <BlogArticlePage article={quoteCardMixArticle}>
    <p>The most persuasive number in a payment proposal is often the annual saving. The most revealing part is the activity used to calculate it.</p>
    <p>A single sales total says little about how those payments arrived. A domestic debit purchase, a commercial card order and a card issued abroad may carry different costs under the proposed agreement. A quote built around a cheaper mix of payments can appear to beat your current provider without offering a better price for your business.</p>

    <section id="the-hidden-assumption" aria-labelledby="the-hidden-assumption-title">
      <h2 id="the-hidden-assumption-title">The customer is part of the price</h2>
    <p>Card networks publish interchange schedules with distinctions between card products and transaction conditions. Those schedules describe part of the payment system’s economics. Your merchant price depends on the agreement with your provider, including how much of that variation is passed through or absorbed.</p>
    <p>A blended rate can simplify the bill by combining several costs into one price. A more itemized arrangement can make underlying variation visible. Neither presentation, on its own, establishes which offer will cost less.</p>
    <p>Suppose the current statement includes commercial cards and cards issued abroad, while the new proposal models only standard domestic consumer cards. The sales total may match perfectly. The payment activity does not. Repricing the actual card mix could remove the apparent saving before the providers have changed a single charge.</p>
    <p>The comparison becomes useful when both providers price the same payments. If the card detail is unavailable, a proposal can show a range using stated assumptions. That gives the owner a way to judge the uncertainty. A precise annual saving built on an undisclosed card mix offers confidence the calculation has not earned.</p>
    </section>

    <section id="what-a-proposal-should-prove" aria-labelledby="what-a-proposal-should-prove-title">
      <h2 id="what-a-proposal-should-prove-title">A saving should be traceable</h2>
    <p>A merchant should be able to follow the proposed saving back to a particular change: a smaller provider margin, a lower fixed charge, an included service or a different treatment of certain payments. “Our rate is lower” does not establish any of those things unless the rates cover the same activity.</p>
    <p>This is especially important when a business is changing. A domestic store opening international delivery has a different question from a store staying within its existing market. The first needs a forecast for the customers it hopes to acquire; the second has a stronger historical basis. Both deserve to know how much confidence to place in the number.</p>
    <p>For Trolleys merchants, the fee calculation is tied to the payment and the accepted account terms. The <Link href="/company/legal/fees#calculation" prefetch={false}>published calculation rules</Link> are part of that explanation, including how an international card is identified.</p>
    <p>Before trusting the annual saving, change one of its assumptions. Use more of the cards your customers actually carry. Remove a growth forecast you cannot defend. If the saving disappears, the proposal has revealed the condition on which it depended. That is information worth having before signing.</p>
    </section>
  </BlogArticlePage>;
}

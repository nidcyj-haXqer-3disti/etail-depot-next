import { BlogArticlePage } from "./article-page";
import { seasonalCapacityArticle } from "./seasonal-capacity-content";

export function SeasonalCapacityPage() {
  return <BlogArticlePage article={seasonalCapacityArticle}>
    <p>Imagine a business that is quiet for much of the year, then takes more orders in November than in the other months combined.</p>
    <p>An annual total divided by twelve makes that business look steady. It also removes the very month the payment provider needs to understand.</p>
    <p>For a seasonal merchant, a useful forecast follows the calendar of the business. It shows when customers pay, when orders leave and when returns or cancellations are likely to follow.</p>

    <section id="show-the-peak" aria-labelledby="show-the-peak-title">
      <h2 id="show-the-peak-title">Show the peak and the obligations that follow it.</h2>
    <p>A large month can contain an even more concentrated weekend. Explain the campaign dates, expected order amounts and relevant history. Distinguish repeat seasonal demand from a new promotion whose response is uncertain.</p>
    <p>The peak also has an operating shape. Stock may be ready before the campaign while packing capacity stretches dispatch across several weeks. In that case, the sales graph rises faster than completed deliveries. That gap belongs in the forecast.</p>
    <p>A seasonal rise is not proof of a problem. The revealing figure may be the number of paid orders still waiting to leave. If the campaign accepts orders faster than the team packs them, that queue grows even while parcels go out every day. A quiet sales day afterward does not mean the busy period is over; the team still has the accumulated work.</p>
    <p>Returns, refunds and customer questions can arrive after advertising stops and seasonal staff leave. Explain how the business handles that period. A busy December followed by an understaffed January can create a different customer experience from the one the launch team promised.</p>
    <p>If the business has prior history, use comparable periods and identify changes in products, prices, delivery or sales channels. Last year’s successful store collection campaign does not fully describe this year’s nationwide shipping launch.</p>
    <p>PayPal notes that changes in selling patterns or buyer complaints can prompt requests for additional business information. That is one provider’s process, but it illustrates why the story after the sale matters alongside the headline volume.</p>
    </section>

    <section id="before-the-first-rush" aria-labelledby="before-the-first-rush-title">
      <h2 id="before-the-first-rush-title">Make the payment conversation part of seasonal planning.</h2>
    <p>Trolleys asks merchants to report relevant expected volume and delivery changes; material changes outside the approved scope require the appropriate written approval. Share the actual campaign plan and confirm any account limits or conditions before the rush.</p>
    <p>A stronger response to demand may require a second packing shift, a later delivery allocation or a decision to stop taking orders. The payment conversation should reflect that response as the forecast changes. Advance discussion gives the provider the actual plan; it does not guarantee a review or payout outcome.</p>
    <p>The useful question is not only how much the business hopes to sell. It is what the business will owe customers at its busiest point, and whether the team can keep those promises when the promotion works.</p>
    </section>
  </BlogArticlePage>;
}

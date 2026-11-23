import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { volumeCommitmentArticle } from "./volume-commitment-content";

export function VolumeCommitmentPage() {
  return <BlogArticlePage article={volumeCommitmentArticle}>
    <p>The merchant expects a strong year. The provider offers a better rate in return for a commitment. Both sides can see the attraction while the forecast is rising.</p>
    <p>The agreement earns closer attention when the forecast falls. A delayed launch, a lost customer or a change in sales channel can leave the business paying for an expectation it did not fulfill.</p>

    <section id="four-different-meanings" aria-labelledby="four-different-meanings-title">
      <h2 id="four-different-meanings-title">Not every volume figure is a commitment</h2>
    <p>An estimate supplied during account review helps the provider understand expected activity. An approved processing limit defines a boundary for the account. A discount tier may lower the price after actual activity reaches a threshold. A minimum volume or fee commitment can create an obligation if activity is insufficient. These figures should not be treated as synonyms.</p>
    <p>A commitment is only as clear as its measuring rule. The business might be promising sales volume, a transaction count or a minimum amount of eligible fees. Included accounts, measurement periods and refund treatment can change the result. A group can exceed its headline sales forecast and still fall short of a commitment that counts only part of that activity.</p>
    <p>Stripe’s pricing policy, for example, describes minimum fee commitments when included in a pricing agreement and separately explains progressive pricing tiers. The distinction matters: earning a discount through actual use and promising a minimum spend expose the merchant to different risks.</p>
    </section>

    <section id="price-the-shortfall" aria-labelledby="price-the-shortfall-title">
      <h2 id="price-the-shortfall-title">Evaluate the weak year before signing for the strong one</h2>
    <p>The difficulty is that the shortfall and the weaker business can arrive together. A lost customer reduces receipts just as the commitment may require a higher rate, a separate charge or another contractual consequence. The discounted proposal should therefore be read alongside the cost of a plausible weak period, when the business has less activity over which to spread that obligation.</p>
    <p>The measuring period can sharpen that problem. A strong December may not cure a weak spring if the commitment is measured monthly. An annual forecast can look reassuring while concealing the periods in which the obligation is most difficult to meet. The proposed agreement must show which result the business is accepting.</p>
    <p>The business should also understand whether changes in ownership, locations or approved activity affect the calculation. Opening another merchant account does not automatically add its volume to the commitment, and a commitment does not authorize processing outside the account’s approved scope.</p>
    <p>Trolleys merchants should distinguish the information supplied for approval from commercial obligations in the <Link href="/company/legal/merchant-services#service-order" prefetch={false}>Merchant Service Order</Link>. The published terms do not turn every forecast into a standard minimum-volume promise. Any negotiated commitment needs an express accepted basis, while material changes to the business still need to be reported under the account terms.</p>
    <p>A commitment may still be a sensible exchange. The merchant can decide that the saving justifies a downside it understands and can carry. That is a different judgment from believing the sales forecast strongly enough to leave the shortfall calculation blank.</p>
    </section>
  </BlogArticlePage>;
}

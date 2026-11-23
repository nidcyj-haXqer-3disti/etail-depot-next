import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { walletButtonDesignArticle } from "./wallet-button-design-content";

export function WalletButtonDesignPage() {
  return <BlogArticlePage article={walletButtonDesignArticle}>
    <p>The storefront has a carefully chosen typeface, restrained colors and generous spacing. At checkout, a familiar wallet button arrives in black or white. Someone asks the designer to make it match.</p>
    <p>There is a worthwhile design problem here, but it is not necessarily inside the button. Customers may recognize that control precisely because the merchant did not redraw it.</p>
    <p>The store and the wallet are doing different jobs in the same purchase. The merchant explains the goods, price and delivery. The familiar payment control helps the customer recognize how to pay. Making both look identical can blur that useful distinction.</p>

    <section id="design-around-control" aria-labelledby="design-around-control-title">
      <h2 id="design-around-control-title">Use the room the provider actually gives you.</h2>
    <p>Google Pay supplies payment buttons and supported configuration options. Its brand guidance requires the proper assets, clear contrast and appropriate spacing. That is different from taking a logo file, choosing a new font and constructing an imitation button.</p>
    <p>Before redesigning, establish what the platform or gateway provides. Some integrations control the button appearance and placement; others expose supported options. A general wallet API capability does not mean the installed plugin lets a merchant change it.</p>
    <p>The product description, order summary, typography and space around the total give the store ample room to establish its identity. They also carry the facts a customer needs before choosing the wallet. Improving that relationship does more for a coherent design than making a payment mark share the heading font: the order remains clearly the merchant’s, and the payment method remains recognizable.</p>
    <p>A dark button on a dark panel may fit the palette while becoming difficult to see. A colored outline added to compensate may create a new unofficial treatment. Choose an approved variation that works on the intended background, then review the whole block rather than correcting one color in isolation.</p>
    </section>

    <section id="small-screen" aria-labelledby="small-screen-title">
      <h2 id="small-screen-title">Give the button enough space to remain itself.</h2>
    <p>A desktop row of three payment options can become three cramped objects on a phone. Compressing them until the labels barely fit protects the row at the expense of the purchase.</p>
    <p>Use the integration’s supported responsive sizing and layout. Where supported, stacking controls can be more understandable than forcing them side by side. Keep their proportions, spacing and readable labels intact. Do not crop a label, stretch a mark or substitute your own shortened wallet name to recover a few pixels.</p>
    <p>The neatest default row can conceal the design’s priorities. If a longer supported label has to be cut to keep three buttons aligned, the arrangement is protecting symmetry by removing information. Allowing a different supported layout gives up a row, not the store’s identity.</p>
    <p>Appearance also has to survive interaction. Focus, selection and the transition to the next screen are part of the design, not finishing checks after it. A buyer who cannot tell which method is active has encountered a design problem even if every logo is perfectly aligned. Our article on <Link href="/company/blog/screen-reader-payment-options" prefetch={false}>accessible payment choices</Link> examines that part of the purchase.</p>
    <p>The design succeeds when the buyer experiences one coherent store and a familiar way to pay. Uniform color is a much smaller achievement.</p>
    </section>
  </BlogArticlePage>;
}

import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { walletCardChangeArticle } from "./wallet-card-change-content";

export function WalletCardChangePage() {
  return <BlogArticlePage article={walletCardChangeArticle}>
    <p>The test order succeeds with the card the wallet selected first. The team marks wallet checkout complete.</p>
    <p>The next buyer chooses a different card. Perhaps this is a business expense, perhaps they are keeping household spending on another account. The purchase has not changed. The customer has simply decided how to pay for it.</p>
    <p>That small decision tests a different promise from the first successful order. Accepting the default shows that the checkout can proceed when the buyer changes nothing. Selecting another card asks it to preserve the purchase while honoring a change the customer chooses to make within the supported flow.</p>

    <section id="the-final-choice" aria-labelledby="the-final-choice-title">
      <h2 id="the-final-choice-title">A card change is not a new shopping intention.</h2>
      <p>Apple provides a payment-method selection event so an integration can respond when the customer chooses a method inside the sheet. The web team has a technical job to do. The merchant has a commercial question to answer: does the order still mean what the buyer intended?</p>
      <p>The product, quantity and delivery choice should not change silently with the card. If the supported flow changes an amount or needs different information, the customer needs to see and confirm that consequence. A control that can update the total is not permission to add a card-specific charge.</p>
      <p>Consider a gift order. The shipping address describes where the gift should go; the selected card may carry the buyer’s billing information. Replacing one with the other could leave the payment valid and the delivery wrong. The customer should not have to anticipate that software mistake while choosing a card.</p>
      <p>The receipt matters for the same reason. A label left over from the first selection may make a correctly processed payment look wrong. The customer chose the other card for a reason; seeing the original one on the receipt gives them a reason to question the charge. The order should describe the method actually used, with the safe information the provider supplies, rather than repeat an earlier screen state.</p>
    </section>

    <section id="a-useful-test" aria-labelledby="a-useful-test-title">
      <h2 id="a-useful-test-title">Change the sequence, then inspect the records.</h2>
      <p>A default-card success proves that one purchase can work. Changing cards, changing back and returning from verification asks whether the order stays coherent while the buyer makes decisions. Those scenarios belong in the provider’s documented test setup; our <Link href="/company/blog/accept-apple-pay-as-a-business" prefetch={false}>Apple Pay setup article</Link> explains the separate sandbox and controlled live validation requirements.</p>
      <p>Leaving the wallet is particularly easy to misread. Apple documents that its cancellation event can occur after the payment-authorized event has been sent. Closing the sheet therefore does not establish that no payment occurred. A reassuring “You have not been charged” message, or an immediate invitation to pay again, can be wrong. The submitted attempt needs to be resolved through the provider’s payment-status process.</p>
      <p>For a Trolleys merchant, the useful evidence is the completed test order, its gateway reference and the final method recorded through the supported connection. Those records can expose a mismatch that the checkout screen concealed. Payment credentials, tokens and unnecessary personal information do not belong in screenshots or ordinary support messages.</p>
      <p>The merchant’s evidence and the customer’s account of the purchase should converge on the same result. If the buyer changed cards, the receipt should not tell the story of the first selection. If the buyer closed the wallet, the page should not invent a payment outcome. The promise is to follow the customer’s choice and report what actually happened.</p>
    </section>
  </BlogArticlePage>;
}

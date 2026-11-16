import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { digitalWalletsArticle } from "./digital-wallets-content";

export function DigitalWalletsPage() {
  return <BlogArticlePage article={digitalWalletsArticle}>
    <p>Picture a customer checking a receipt after paying with their phone. The order is right. The amount is right. The last four card digits are unfamiliar. They reach for the physical card and the numbers do not match.</p>
    <p>That mismatch can be normal. With Apple Pay, the number used for payment differs from the number printed on the card. A customer can have one credit account represented by different payment credentials. A receipt showing different digits is therefore not, by itself, evidence that a second account was charged.</p>
    <p>The distinction is small enough to disappear during a quick purchase and important enough to complicate a return. Merchants offering digital wallets need to understand both moments.</p>
    <p>When you add an existing credit card to a supported wallet, you are enabling another way to use that account. You are not opening a new credit line simply by adding it. The issuer still manages the card account and its bill. This discussion concerns payments funded by an enrolled card, rather than a separate wallet balance or financing product.</p>
    <p>Apple Pay uses a device specific account number and security information unique to the transaction. The merchant receives that payment credential instead of the original card number. This is why the unfamiliar digits can be part of the protection, rather than a sign that something went wrong.</p>
    <p>Other wallet flows need their own explanation. Google Pay on the web supports both cards saved to a Google Account and Android device tokens. It is inaccurate to promise that every payment bearing a wallet logo uses the same type of replacement number. The useful question is what the particular payment record represents.</p>
    <section id="payment-decisions" aria-labelledby="payment-decisions-title">
      <h2 id="payment-decisions-title">The phone and the issuer have different jobs</h2>
      <p>A card working at one checkout does not establish that it can be added to every wallet. Enrollment depends on the issuer, card, region and supported device. Google’s guidance distinguishes a card saved for online payments from one ready for contactless payment in a shop. A physical card’s contactless symbol does not establish that it supports Google Wallet.</p>
      <p>That matters when someone changes phones. An enrollment failure is a different problem from a declined purchase. If the issuer has refused to add the card, explain that the request concerns wallet enrollment when contacting its support team. Asking about a missing purchase sends the investigation in the wrong direction.</p>
      <p>Being ready to use the wallet is another step away from having a payment approved. Confirming with a fingerprint, face or device passcode is part of authorizing use of the wallet. Apple states that Apple Pay transactions still go to card issuers for approval. A wallet cannot override an issuer’s decision to decline.</p>
      <p>For the merchant, the <Link href="/company/blog/card-authorization" prefetch={false}>payment authorization result</Link> still matters. A customer successfully opening the wallet is not evidence that the order has been paid. When the result is unclear, check the order and provider transaction record before asking the customer to repeat the purchase.</p>
      <p>Security also needs that distinction. Google explicitly tells merchants to keep their existing risk checks when accepting Google Pay. Less card entry can improve the payment experience without making every purchase legitimate or every order ready to fulfill.</p>
    </section>
    <section id="after-checkout" aria-labelledby="after-checkout-title">
      <h2 id="after-checkout-title">The receipt has to make sense after checkout</h2>
      <p>A merchant should be able to find the original order without making the customer solve the wallet’s numbering system. Start with the order reference and use the amount, purchase date and payment record together. The last four digits help identify a credential; they should not be the only route to finding the sale.</p>
      <p>The wallet’s activity screen is useful, but it is not the whole accounting record. Google warns that merchants may not share every purchase detail with Wallet and that wallet transactions do not replace the original receipt. The issuer’s statement and the merchant’s receipt still have their own roles.</p>
      <p>Refunds are where the distinction becomes especially practical. Apple says a refund for an Apple Pay card purchase goes back to the payment card, although it can take several days to appear on the statement. Some merchants need the last four digits of the Apple Pay card number. Those can be found in Wallet and may differ from the physical card.</p>
      <p>When a terminal requires the card for the return, Apple’s instructions use Wallet on the device used for the purchase. An online merchant should follow its provider’s refund process for the original transaction. An unfamiliar card ending is a reason to identify the payment correctly, not to send money to a new destination supplied in a message.</p>
      <p>Offering <Link href="/company/blog/accept-apple-pay-as-a-business" prefetch={false}>Apple Pay on your website</Link> can remove effort from checkout. Keeping that benefit means carrying the same clarity into the receipt, support conversation and refund. The customer should finish with a purchase they recognize, even when the number used to pay is unfamiliar.</p>
    </section>
  </BlogArticlePage>;
}

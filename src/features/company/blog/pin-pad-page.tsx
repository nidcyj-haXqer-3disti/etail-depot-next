import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { pinPadArticle } from "./pin-pad-content";

export function PinPadPage() {
  return <BlogArticlePage article={pinPadArticle}>
    <p>Imagine finishing a sale, handing over the receipt and then noticing that the terminal charged a different amount from the order. The customer entered the correct PIN. The payment was approved. The mistake happened before either of those things.</p>
    <p>That possibility is easy to overlook when buying a payment device. The questions tend to be about its screen, speed and supported cards. A quieter question matters just as much: who puts the amount on that screen, and what connects the resulting payment to the sale?</p>
    <p>A PIN pad lets the customer enter a personal identification number as part of cardholder verification. It may sit inside a larger payment terminal with a card reader and display. Its job does not include deciding whether an employee entered the right order total.</p>
    <p>The PIN itself can be checked in different places. Adyen describes online PIN verification with the card issuer and offline PIN verification with the chip on the card. In that terminology, “offline” describes the PIN check. It does not, by itself, promise that the entire payment can proceed without a network connection. Nor is a successful PIN check the same thing as <Link href="/company/blog/card-authorization" prefetch={false}>payment authorization</Link>.</p>

    <section id="where-the-amount-comes-from" aria-labelledby="where-the-amount-comes-from-title">
      <h2 id="where-the-amount-comes-from-title">The handoff before the customer pays</h2>
      <p>Stripe describes two common arrangements. With an integrated checkout, the point of sale software sends the purchase amount to the terminal, which handles the card interaction and returns a result. With a standalone terminal, a member of staff enters the amount on the device. Both can accept a payment. They leave different work for the business.</p>
      <p>Consider the standalone arrangement first. Someone reads the order total, types it into another screen and hands the terminal to the customer. That extra entry is a chance to transpose digits, miss a discount or use the total from the wrong order. The payment system can approve the amount it received without knowing that the business meant something else.</p>
      <p>For that reason, checking the displayed amount belongs before payment, while a correction is still straightforward. Give the customer time to read it. Then give them privacy to enter their PIN. Staff should help with the device or its prompts, never ask the customer to say the PIN aloud or write it down for them.</p>
      <p>An integrated terminal removes the need to retype the amount in that flow. It does not fix a wrong price or an incorrect order in the checkout software. The benefit is a more reliable transfer of the information the business has already entered, not an independent audit of the sale.</p>
      <p>The return journey deserves attention too. Can the employee open the order and find the corresponding payment? Can someone handling a customer question identify the amount actually charged without relying on the memory of the person who took it? These are useful questions to put to a provider during a demonstration, especially if several people share a checkout.</p>
      <p>Adyen is explicit about the administrative consequence of its standalone setup: merchants need to reconcile terminal transactions against sales and returns manually. A standalone device may suit a business perfectly well, but that matching work still needs an owner. A successful payment on the terminal is not evidence that a separate order system updated itself.</p>
      <p>If an amount error is discovered afterward, begin with the actual payment record and its current status. Use the provider’s supported cancellation or refund process where appropriate, then record any agreed correction against the sale. Adyen’s standalone instructions, for example, distinguish an attempt to cancel an unfinished payment from refunding an approved one when cancellation has failed.</p>
      <p>Changing the order total alone does not change what the customer was charged. Keep the original payment and any correction understandable, and tell the customer what happened. Our <Link href="/services/refunds" prefetch={false}>refunds page</Link> explains why the original transaction matters when returning money.</p>
    </section>

    <section id="device-and-checkout" aria-labelledby="device-and-checkout-title">
      <h2 id="device-and-checkout-title">A secure device still needs a sound setup</h2>
      <p>Amount accuracy and PIN security are separate responsibilities. The business needs both. A certification label on the hardware should not become a reason to stop asking how the checkout works around it.</p>
      <p>PCI SSC explains that PIN Transaction Security approval addresses security requirements for payment devices. A PTS approved terminal does not, on its own, make a merchant PCI DSS compliant or reduce the scope of that assessment. A validated Point-to-Point Encryption solution can help reduce scope, but that is a property of the deployed solution, not a promise attached to every PIN pad.</p>
      <p>The same PCI guidance calls for attention to the installed applications, configuration, vendor support and updates. Where a third party manages the terminals, responsibilities still need to be clear. Ask who maintains the device, which checkout connection they support and how you obtain help when the equipment or payment records do not behave as expected.</p>
      <p>A good demonstration should therefore continue past the approval screen. Have the provider show where the amount came from, where the payment appears afterward and how an amount mistake would be corrected. Those ordinary moments reveal more about running the checkout than a polished demonstration of PIN entry alone.</p>
    </section>
  </BlogArticlePage>;
}

import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { foreignFeeQuestionsArticle } from "./foreign-fee-questions-content";

export function ForeignFeeQuestionsPage() {
  return <BlogArticlePage article={foreignFeeQuestionsArticle}>
    <p>“Why did you charge me more?”</p>
    <p>It is an uncomfortable question when your receipt shows exactly the price the customer accepted. They are looking at their card account. You are looking at your order system. Both of you may be reading the records correctly.</p>
    <p>Currency conversion or a foreign transaction fee can explain the difference. So can a mistake in the amount your business actually submitted. The customer should not have to know which explanation applies before asking you for help.</p>
    <p>“That is your bank” may eventually be the right answer. It is a poor opening answer when you have not checked your own side.</p>

    <section id="check-the-original-charge" aria-labelledby="check-the-original-charge-title">
      <h2 id="check-the-original-charge-title">Start with the charge you can verify</h2>
      <p>Pull the original payment record, not just the order total. Confirm the amount, the currency and the status. Check whether the customer is referring to this payment, a pending entry, a separate fee or another transaction. If your completed charge differs from the agreed price, deal with that discrepancy first.</p>
      <p>Then compare like with like. A receipt in US dollars and a card account in euros will not carry the same number. The customer’s converted amount is not, by itself, evidence that your business increased the price.</p>
      <p>There are three currencies worth keeping separate: the currency charged at checkout, the currency of the customer’s card account and the currency in which your business receives settlement. They can be different. The conversion affecting your customer is not necessarily the conversion affecting your business.</p>
      <p>A foreign transaction fee is another matter. A card issuer may charge one under the card’s terms, alongside any currency conversion. The fee can also depend on the countries involved. A customer paying in their own currency may still face an issuer fee for a purchase from a business in another country.</p>
      <p>This distinction appears in US consumer credit guidance as well. The CFPB’s interpretation includes certain issuer fees on US dollar purchases outside the United States or with a foreign merchant. Paying in dollars does not, on its own, answer the fee question. That guidance concerns US consumer credit; the customer’s particular card terms determine what their issuer charges.</p>
      <p>Do not quote a familiar percentage as if it applies to every card. Give the customer the original charge amount and currency you have verified. Their issuer can then explain its conversion and any fee it assessed against that charge.</p>
    </section>

    <section id="currency-choice-at-checkout" aria-labelledby="currency-choice-at-checkout-title">
      <h2 id="currency-choice-at-checkout-title">A currency choice needs an explanation before the sale</h2>
      <p>Some checkouts separately offer dynamic currency conversion, or DCC. This offers the customer a converted price in their card’s home currency at the point of payment. It is different from simply showing an estimated local price on a product page.</p>
      <p>Where DCC is offered, Visa calls for the local and converted amounts, currency symbols, exchange rate and any fees or markup to be shown. The customer must be able to accept or decline the conversion. The merchant must not make that decision for them.</p>
      <p>A customer choosing their home currency has chosen a conversion offer. They have not necessarily eliminated every fee their issuer might charge. Equally, declining that offer does not tell you the final amount that will appear on their card account.</p>
      <p>For a Trolleys merchant, the starting point is the payment setup approved for the account. Do not add a currency selector because another store has one, or promise DCC without confirming that it is available for your arrangement. A clear checkout with an explicit charge currency is more useful than a choice your business cannot explain.</p>
      <p>Your own processing costs belong in a separate conversation. An international card fee assessed to your merchant account is not automatically a fee charged to your customer. A smaller net payout does not mean the customer paid too little, just as a larger card statement amount does not prove your business collected more.</p>
    </section>

    <section id="answer-the-customer" aria-labelledby="answer-the-customer-title">
      <h2 id="answer-the-customer-title">Make the next answer useful</h2>
      <p>Once you have checked the payment, answer with facts the customer can use. For a hypothetical order whose completed charge is confirmed as USD 180, that might sound like this:</p>
      <blockquote><p>We checked the payment for your order and confirmed a charge of USD 180. The receipt shows that amount and currency. If your card account shows a converted amount or an additional issuer fee, your card issuer can explain how it was calculated. If it shows a different original charge from us, please let us know so we can investigate.</p></blockquote>
      <p>That response gives the customer something to take to their issuer. It also leaves room to correct a merchant error. Send the receipt and the relevant payment reference through your normal support channel. Ask only for the information needed to identify the discrepancy, not an entire unredacted statement.</p>
      <p>Trolleys, an Etail Depot service, helps merchants work from their <Link href="/services/reconciliation" prefetch={false}>merchant account and gateway records</Link>. Those records help establish what happened to the payment your business accepted. If the amount, status or account fee is unclear, <Link href="/company/contact#account-support" prefetch={false}>account support</Link> can help investigate the merchant side. An issuer’s separate charge still needs an explanation from that issuer.</p>
      <p>Do not issue a refund simply to make two unexplained numbers match. First establish what happened and whether a refund is due under your terms. If you do <Link href="/services/refunds" prefetch={false}>refund the purchase</Link>, confirm the amount and currency returned. Do not promise that the customer’s issuer will reverse its fee or use the original exchange rate.</p>
      <p>A customer who understands the charge has less reason to distrust the checkout. That trust starts before payment, with a clear price and currency, and continues afterward with a merchant who can explain the record.</p>
    </section>
  </BlogArticlePage>;
}

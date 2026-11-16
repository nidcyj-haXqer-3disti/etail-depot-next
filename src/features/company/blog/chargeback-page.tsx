import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { chargebackArticle } from "./chargeback-content";

export function ChargebackPage() {
  return <BlogArticlePage article={chargebackArticle}>
    <p>Imagine a customer’s order has left the warehouse. Your team has answered a delivery question, marked the order complete and moved on. Weeks later, a dispute notice arrives. The sale you counted as finished needs someone’s attention again.</p>
    <p>The temptation is to send the receipt and say that the customer paid. But the payment itself may not be in question. The customer might be saying that the goods never arrived, that a promised refund is missing or that they never authorized the purchase.</p>
    <p>Those are different claims. Treating them as the same problem is where a merchant can lose time without improving the response.</p>

    <section id="chargeback-or-refund" aria-labelledby="chargeback-or-refund-title">
      <h2 id="chargeback-or-refund-title">A chargeback is not a refund</h2>
      <p>A chargeback reverses all or part of a card transaction through the card issuer’s dispute process. The issuer is the bank or institution that issued the customer’s card. The reversal passes to the acquiring side of the payment relationship and can be deducted from your merchant account.</p>
      <p>A refund starts with your business returning money through its payment service. A chargeback brings an outside process into the sale, with a stated reason, response requirements and a deadline. A customer emailing you about an order is not, by itself, a formal chargeback.</p>
      <p>A notice also does not settle every question about what happened. Where a response is permitted, you may be able to challenge the claim with relevant records. Accepting a valid dispute can be the appropriate decision too. Neither a reflexive challenge nor an immediate refund should replace checking the facts.</p>
      <p>The account impact needs its own attention. A disputed amount, a case fee and a later adjustment are different entries. Cybersource’s reporting definitions distinguish those amounts from the case reference, reason and response date. Keep the equivalent records in your own account together so the person answering the case and the person reviewing the money are discussing the same event.</p>
      <p>Fees and response options depend on your account terms and the applicable process. Do not assume that submitting evidence returns the money, or that a favorable result automatically returns every fee.</p>
    </section>

    <section id="answer-the-actual-claim" aria-labelledby="answer-the-actual-claim-title">
      <h2 id="answer-the-actual-claim-title">The receipt does not answer every claim</h2>
      <p>For a claim that goods were not received, the useful question is whether they reached the customer as agreed. For a missing refund, it is whether the credit was due and what happened to it. The same receipt cannot establish both.</p>
      <p>Visa’s guidance separates those dispute conditions. Mastercard likewise tells merchants to address the reason given in the notice. Your records should make that connection easy to follow: the order being discussed, the relevant event and the document that supports your response.</p>
      <p>A delivery record may help explain a delivery dispute. A refund reference, date and amount can help locate a credit. Customer correspondence may explain an agreed change. None of those records is a universal guarantee of a successful response.</p>
      <p>Think about the person reading the case. They were not in your warehouse and did not answer the customer’s call. A short explanation tied to the relevant documents is more useful than asking them to reconstruct the sale from an undifferentiated folder of attachments.</p>
      <p>Use the deadline and submission instructions in the actual notice. Do not plan around a generic number of days found online. Assign a person to the case and confirm that the response was submitted through the required channel, rather than merely saved as a draft.</p>
    </section>

    <section id="avoid-a-second-return-of-funds" aria-labelledby="avoid-a-second-return-of-funds-title">
      <h2 id="avoid-a-second-return-of-funds-title">Do not pay twice to end the argument</h2>
      <p>The awkward moment comes when customer service wants to issue a refund while someone else is handling the chargeback. Both people may be trying to solve the same problem. Without a shared record, they can create another one.</p>
      <p>Before returning money on a disputed payment, check the existing case and any earlier refund. Follow the account’s dispute instructions. Our <Link href="/services/refunds" prefetch={false}>refund guidance</Link> makes this distinction explicit: returning money does not automatically close an open dispute.</p>
      <p>If a refund was already processed, provide its matching reference and records through the case process. If the customer says they have withdrawn the complaint, confirm the case status and any required response with your payment service. A reassuring email is not a substitute for an account record showing what has happened.</p>
      <p>For a business with several stores, match the notice to the correct merchant account and trading name as well as the order. One customer relationship can involve more than one store. A refund made against the wrong transaction will not explain the disputed one.</p>
      <p>Keep following the case after submission. Record the outcome and any financial adjustment against the original payment. “We sent the documents” and “the account is reconciled” describe different stages of the work.</p>
    </section>

    <section id="learn-from-the-next-order" aria-labelledby="learn-from-the-next-order-title">
      <h2 id="learn-from-the-next-order-title">The business lesson is in the next order</h2>
      <p>Chargebacks can expose genuine customer problems, misunderstandings or disputed claims your records do not support. Calling every case fraud makes it harder to see which part of the customer experience needs attention.</p>
      <p>Look for something specific. Are buyers surprised by the name on their statement? Are delivery dates changing without a message? Is support promising refunds that nobody has processed? Visa identifies clear policies, recognizable merchant names and timely updates as ways to reduce avoidable disputes.</p>
      <p>Trolleys, an Etail Depot service, helps merchants manage the account side of this work. Our <Link href="/services/disputes" prefetch={false}>dispute management service</Link> connects the claim, deadline and supporting records with the original payment. Your team supplies the facts of the sale; case outcomes follow the applicable network process.</p>
      <p>When you need help, bring the case reference, the affected merchant account and the response deadline to our <Link href="/company/contact" prefetch={false}>merchant support team</Link>. Ask what action is available and where the response belongs. A useful support conversation starts with the actual case, not a promise that every chargeback can be won.</p>
    </section>

    <p>The goal is to protect a legitimate sale, correct a genuine mistake and avoid repeating the same problem with the next customer. Good payment records should help you do all three.</p>
  </BlogArticlePage>;
}

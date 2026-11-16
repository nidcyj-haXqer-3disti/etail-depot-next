import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { swiftTracingArticle } from "./swift-tracing-content";

export function SwiftTracingPage() {
  return <BlogArticlePage article={swiftTracingArticle}>
    <p>Imagine an overseas buyer has ordered USD 8,400 of stock. The goods are packed, and the carrier is due that afternoon. Your agreement requires payment before dispatch. The buyer emails a bank document and asks you to release the shipment.</p>
    <p>The document carries the right amount, your company name and a long payment reference. Your bank account still has no matching credit.</p>
    <p>This is the moment when “we sent it” and “we received it” become different commercial facts. You do not need to accuse the buyer of anything. You need to find out what the document confirms and whether the condition for shipping has been met.</p>

    <section id="read-the-payment-record" aria-labelledby="read-the-payment-record-title">
      <h2 id="read-the-payment-record-title">Read the record for what it actually confirms</h2>
      <p>A SWIFT payment usually means a bank transfer whose instructions use the Swift financial messaging network. Swift explains that it sends payment instructions between institutions; banks and other participating institutions carry out the movement of funds.</p>
      <p>That distinction explains why the sender’s document and your account can tell different parts of the same story. An instruction may have been submitted. The sender may have been debited. The payment may have reached the receiving bank. Your business still needs to establish whether the intended account has been credited.</p>
      <p>Swift itself identifies the final stretch between arrival at the beneficiary bank and credit to the customer’s account as a place where delays can occur. Arrival at the bank and availability to your business should not be treated as interchangeable.</p>
      <p>Ask what the supplied record represents: a request, a released transfer, a tracking update or confirmation of beneficiary credit. Read its status and date. A logo, amount and reference make a document recognizable; they do not establish its authenticity or turn every status into “received.” Verify the relevant information through your bank.</p>
      <p>You may hear someone call the document an MT103. Do not make that label the only thing your accounts team knows to request. Swift’s coexistence period for MT and ISO 20022 cross-border payment instructions between financial institutions ended on 22 November 2025. Its current documentation describes conversion arrangements for certain older instructions and delivery in ISO 20022 format.</p>
      <p>That change concerns interbank messaging. It does not mean every customer advice must look identical, or that an older-looking document is automatically fraudulent. Ask the bank for its current payment advice, trace reference and confirmed status. Your business needs the result, not a debate over the document’s heading.</p>
    </section>

    <section id="trace-the-original-transfer" aria-labelledby="trace-the-original-transfer-title">
      <h2 id="trace-the-original-transfer-title">Ask for the trace, not another copy of the same PDF</h2>
      <p>A useful reference for a Swift payment is the UETR, short for Unique End-to-end Transaction Reference. Swift describes it as a 36-character reference carried with the payment instruction so institutions can identify the same payment along its route.</p>
      <p>It serves a different purpose from your invoice number or the bank’s BIC. The invoice identifies the commercial obligation. The BIC identifies an organization or branch. The UETR helps the institutions follow the transfer. None of those identifiers, standing alone, confirms that your account received the money.</p>
      <p>Ask the buyer to obtain the available trace information from the sending bank. Give your own bank the amount, currency, date, expected recipient details and reference through its secure channel. Keep both sides focused on the original transfer. The buyer’s bank can investigate its outgoing instruction while your bank checks for the incoming credit.</p>
      <p>Ask for a specific update: which stage is confirmed, whether beneficiary credit is confirmed, whether any information is needed and who is handling the next inquiry. A bank may need time to investigate. Ask when to expect its next update rather than turning an estimate into a promised arrival date.</p>
      <p>A UETR gives the investigation a common reference. It does not give every business direct access to Swift’s tracking systems. Use the access or tracking service your bank actually provides. Avoid putting payment documents or account details into an unfamiliar website merely because it advertises a SWIFT search.</p>
      <p>If the payment cannot yet be located, keep it unresolved. A second transfer can arrive alongside the first. If the bank confirms rejection or return, establish where the funds are and what correction is needed before arranging a replacement. A request to investigate, amend or recall a transfer is not confirmation that the money has come back.</p>
    </section>

    <section id="release-the-order" aria-labelledby="release-the-order-title">
      <h2 id="release-the-order-title">Make the shipping decision against the agreement</h2>
      <p>For the imagined USD 8,400 order, the agreed condition was payment before dispatch. The accounts team should confirm the relevant credit with its bank before treating that condition as met. If management chooses to release the goods sooner, record that as an authorized commercial exception, with the exposure understood.</p>
      <p>A business that has agreed credit terms may make a different decision. The point is to follow the agreed terms and the evidence available. Do not quietly turn a payment document into cash received because the carrier is waiting.</p>
      <p>Give the buyer a useful response. Acknowledge the advice, explain that the credit remains unconfirmed and identify the reference being investigated. Keep a named person responsible for the follow-up. Repeatedly forwarding the same document between sales, accounts and the warehouse adds activity without answering the payment question.</p>
      <p>Once receipt is confirmed, match the amount and currency to the invoice before closing the issue. A short receipt needs its own explanation and treatment under the agreed terms. Keep the bank’s result with the order so the next person does not restart the investigation.</p>
      <p>The same discipline matters in merchant services, though the records are different. Trolleys, an Etail Depot service, helps merchants compare <Link href="/services/reconciliation" prefetch={false}>merchant account and gateway reports</Link>. A gateway approval, completed payment activity and a <Link href="/services/payouts" prefetch={false}>merchant bank deposit</Link> describe separate stages. Use the relevant record for the question you are trying to answer.</p>
      <p>For a Trolleys payout issue, <Link href="/company/contact#account-support" prefetch={false}>account support</Link> can help with the available merchant records and payout reference. Our current <Link href="/company/legal/payouts-and-reserves#scope" prefetch={false}>funding arrangements</Link> cover USD payouts to approved US bank accounts. They do not establish an outgoing international wire service. Take a separate customer or supplier bank-transfer inquiry to the bank or provider handling that transfer.</p>
      <p>The buyer’s document is a starting point for a conversation backed by records. The decision to release goods should rest on the payment terms and the confirmed position, with any exception made deliberately.</p>
    </section>
  </BlogArticlePage>;
}

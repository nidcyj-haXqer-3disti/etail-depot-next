import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardDataStorageArticle } from "./card-data-storage-content";

export function CardDataStoragePage() {
  return <BlogArticlePage article={cardDataStorageArticle}>
    <p>Imagine a customer having trouble paying. They email a photograph of their card, hoping it will help. A colleague forwards the message to support. The ticket system saves the attachment, and a later export copies it into a shared folder.</p>
    <p>Nobody decided to build a card database. The business now has several places holding card details anyway.</p>
    <p>This is the less visible side of storing customer card information. A company can choose a carefully protected checkout and still create exposure through an ordinary attempt to help a customer. The payment provider may never see those extra copies. Your team still has to deal with them.</p>

    <section id="solve-the-problem-without-the-card" aria-labelledby="solve-the-problem-without-the-card-title">
      <h2 id="solve-the-problem-without-the-card-title">Help the customer without keeping the card</h2>
      <p>The customer wants to finish an order. Your colleague wants to find out what went wrong. Neither goal is served by leaving a card photograph in a growing email thread.</p>
      <p>Start with the order or payment reference, the approximate time and the problem the customer saw. Use the approved account tools to locate the attempt. If the customer needs to enter payment information again, direct them to the approved payment channel. A support conversation should not become a second checkout.</p>
      <p>PCI SSC’s guidance for unexpected card data is direct: remove it immediately and securely, or bring the affected channel and systems into the protected card-data environment under the applicable requirements. Staff should not forward it or reply with the sensitive material still attached. Follow the business’s security procedure and involve the responsible person promptly.</p>
      <p>That procedure needs to account for the copies, not just the original message. In our scenario, the support ticket and shared-folder export matter too. If compromise is suspected, follow the incident process for containment, evidence and notification rather than improvising a cleanup.</p>
      <p>There is also a customer-experience lesson here. A failed-payment message that explains how to get help gives the customer something better to do than send a card photo. Give support staff a useful response they can send without repeating sensitive data. Make the safe route the easy one during a busy afternoon.</p>
    </section>

    <section id="keep-the-record-that-serves-the-task" aria-labelledby="keep-the-record-that-serves-the-task-title">
      <h2 id="keep-the-record-that-serves-the-task-title">A useful payment record does not need every field</h2>
      <p>An order record explains what was bought. A payment reference connects that order to a transaction. Limited card details help identify the method a customer used. A saved-payment reference supports a permitted future payment through the provider’s system. Those records serve different purposes.</p>
      <p>For an enabled saved-card or recurring arrangement, use the provider’s supported storage and billing process, with the required customer agreement. Copying the card into a spreadsheet is not a substitute. Nor does holding a saved method give the business permission to charge it for anything it chooses.</p>
      <p>Some cardholder data, including a full card number, can be retained for a justified purpose with the required protections. That does not make it necessary in every customer record. Before adding a field, ask what task actually requires it and whether an existing transaction or provider reference already serves that purpose.</p>
      <p><strong>Card security codes are different.</strong> Merchants must not keep them after authorization, even encrypted. Customer permission does not create an exception. They are not needed for card-on-file or recurring transactions, so “we may need it for the next order” is not a valid reason to retain one.</p>
      <p>A screen showing only the last few digits also proves less than it appears to. Masking hides digits from view; the full number may remain behind the display. Truncation removes part of the stored number. Review what is actually retained and exported, not only what staff can see on the customer profile.</p>
      <p>This is worth checking when software changes. A new support connector, reporting export or error logger may copy fields the original checkout never intended to distribute. Ask the person responsible for the integration to trace those destinations using appropriate test data, without creating another production-data export for the review.</p>
    </section>

    <section id="decide-when-the-record-is-finished" aria-labelledby="decide-when-the-record-is-finished-title">
      <h2 id="decide-when-the-record-is-finished-title">“Just in case” is not a retention policy</h2>
      <p>Keeping a record should come with a reason, an owner and a point at which it is no longer needed. PCI DSS does not set one universal retention period for cardholder data. Storage must be limited to the relevant business, legal or regulatory need, protected while retained and securely disposed of when that need ends.</p>
      <p>Deleting a customer-facing saved-card entry should not be assumed to erase every related record. Ask what the provider removes, what your own systems retain and how backups and permitted records are handled. An order history may still have a legitimate purpose after the customer stops using a saved method. That does not justify retaining prohibited security codes.</p>
      <p>For a Trolleys merchant, describe the intended use before adding another way to collect payment details. Trolleys, an Etail Depot service, supports account-specific payment arrangements; stored credentials and recurring billing apply when enabled for the approved account. Our <Link href="/developers/getting-started" prefetch={false}>account and integration guidance</Link> helps your team begin with the correct connection.</p>
      <p>For help with an existing payment, <Link href="/company/contact#payment-review" prefetch={false}>contact our team</Link> with the merchant account and transaction reference. Do not attach card photographs, full card numbers, security codes or API secrets. Our <Link href="/company/legal/security-policy" prefetch={false}>security policy</Link> explains the shared responsibilities and how to report a suspected incident.</p>
      <p>Outsourcing processing can reduce direct handling of payment data. It does not remove every merchant responsibility or make unrelated office systems part of the provider’s protection. Confirm the obligations for your actual environment with your acquirer or payment brand, with qualified help where needed.</p>
    </section>

    <p>The customer should be able to buy again without your business collecting a trail of card details. Keep the records that help you serve them, give staff a safe way to resolve problems and know where the sensitive information stops. That is a better foundation for repeat business than remembering everything.</p>
  </BlogArticlePage>;
}

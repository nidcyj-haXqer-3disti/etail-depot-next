import { BlogArticlePage } from "./article-page";
import { reviewResponseArticle } from "./review-response-content";

export function ReviewResponsePage() {
  return <BlogArticlePage article={reviewResponseArticle}>
    <p>The request asks how customers receive their orders. The merchant sends the warehouse contract, a supplier invoice and a shipping screenshot. The same question comes back.</p>
    <p>That can feel like nobody read the files. It can also mean the files never answered the question: how long after payment does this business deliver, and what happens when it cannot?</p>
    <p>A good response connects the fact to its evidence. More attachments are useful only when they make that connection clearer.</p>

    <section id="answer-before-attachments" aria-labelledby="answer-before-attachments-title">
      <h2 id="answer-before-attachments-title">Give the reviewer an answer they can verify.</h2>
    <p>Suppose a store normally dispatches stocked items within two business days but sells personalized items with a longer production period. Its warehouse agreement can explain who handles dispatch without establishing when production finishes. A shipping screenshot can show that one parcel left without describing the promise made for every personalized order. State both delivery arrangements, identify the products using each one and connect each explanation to the customer terms and operating records that support it.</p>
    <p>Where a request is unclear, ask which fact remains unresolved. A question about who owns the company is different from a question about who may sign for it. A request to verify the receiving bank account may differ from a request to understand the business’s available cash.</p>
    <p>Keep the original question beside the answer and identify the supporting file and period. This forces a useful distinction between what the merchant knows, what the document establishes and what still needs evidence. If the requested record is unavailable, say why and ask about an acceptable alternative. Renaming an unsuitable document does not change the fact it can prove.</p>
    </section>

    <section id="one-current-response" aria-labelledby="one-current-response-title">
      <h2 id="one-current-response-title">Several people can help. Someone must reconcile their answers.</h2>
    <p>The owner knows the commercial plan. Finance has the statements. Operations knows the delivery backlog. Assign one person to assemble the response and resolve conflicts before it is sent, without giving that person authority they do not hold.</p>
    <p>A forecast prepared last month and a new launch plan may both be genuine. If they disagree, explain the change. Do not make the reviewer discover it by comparing attachments. Record who supplies each outstanding answer and when it can realistically be ready. If the stated deadline cannot be met, raise that before it passes; do not assume an extension.</p>
    <p>Trolleys requires accurate, current information and responses by the reasonable deadline stated in the request. Use the designated secure account service for sensitive records. A short status list can identify the request and owner without circulating passports, full bank details or private statements to everyone involved.</p>
    <p>When the business has answered, distinguish delivery of the response from resolution of the request. Ask whether the stated fact and evidence satisfy the requirement or leave something outstanding. An internal task can be complete because finance uploaded its file while the underlying question remains open; the person coordinating the response needs to track both.</p>
    <p>The best response may be shorter than the first one. A clear explanation of the two delivery schedules, tied to the relevant records, does more work than another unlabeled warehouse attachment. The merchant has answered the question instead of merely proving that files were sent.</p>
    </section>
  </BlogArticlePage>;
}

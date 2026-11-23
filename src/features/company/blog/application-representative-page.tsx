import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { applicationRepresentativeArticle } from "./application-representative-content";

export function ApplicationRepresentativePage() {
  return <BlogArticlePage article={applicationRepresentativeArticle}>
    <p>The founder forwards the application to the person who gets things done. That person finds the bank document, answers the follow-up email and reaches the signature page.</p>
    <p>Only then does the business ask what they are allowed to sign.</p>
    <p>For a small team, delegation is sensible. The problem is leaving the boundary of that delegation until the final click. A merchant agreement creates responsibilities that outlast the afternoon spent completing it.</p>

    <section id="different-jobs" aria-labelledby="different-jobs-title">
      <h2 id="different-jobs-title">Give each person a defined job.</h2>
    <p>Someone can coordinate the application without being an owner. Someone can know the daily sales activity without being authorized to accept the agreement. A person responsible for managing the company may also need to be identified separately from its investors.</p>
    <p>FinCEN’s CDD guidance recognizes that a person opening an account can provide ownership information without being a beneficial owner. That does not grant everyone permission to sign every agreement. The recipient’s process and the business’s actual authority arrangements still matter.</p>
    <p>For Trolleys, the individual accepting the Merchant Services Terms for a business must have authority to bind it. Establish that authority before reaching the agreement. If evidence is requested, ask what the reviewer accepts for this entity and this action.</p>
    </section>

    <section id="founder-unavailable" aria-labelledby="founder-unavailable-title">
      <h2 id="founder-unavailable-title">The founder’s absence should not become someone else’s guess.</h2>
    <p>A founder may be traveling, on leave or no longer responsible for operations. The right response is to identify another properly authorized person, where the business’s arrangements permit one, and confirm the application process for that person.</p>
    <p>A job title, shared inbox or access to the founder’s login does not by itself settle signing authority. Do not sign in another person’s name to keep a launch date. If the business cannot identify a valid signer, that is a governance question to resolve before acceptance, not a website problem to work around.</p>
    <p>It also matters what is being accepted. Authority to sign for a company and an obligation to provide a personal guarantee are separate questions. Read the actual signature and guarantee language rather than assuming the preparer, owner and guarantor must all be the same person.</p>
    </section>

    <section id="delegation-that-works" aria-labelledby="delegation-that-works-title">
      <h2 id="delegation-that-works-title">Delegate the work without losing accountability.</h2>
    <p>A useful handoff identifies who verifies the company facts, who answers ownership questions and who reviews and accepts the terms. It also carries unresolved questions to the authorized reviewer. A fully populated form can look settled even when an answer was only assumed; the coordinator should not have to invent certainty to finish the preparation. Sensitive documents should go through the approved channel with only the necessary access.</p>
    <p>If an outside accountant or consultant will submit records, confirm that the provider permits that role and how it is recorded. Upload permission should not silently turn into authority to make declarations, change bank details or accept commercial terms.</p>
    <p>Our <Link href="/resources/merchant-account-setup" prefetch={false}>account setup guide</Link> shows the Trolleys application sequence. Decide who owns each responsibility before starting it, and give the signer time to review what was prepared. Delegation saves the owner from gathering every document personally; it should still leave the consequential decisions with the people authorized to make them.</p>
    </section>
  </BlogArticlePage>;
}

import { BlogArticlePage } from "./article-page";
import { representativeSuccessionArticle } from "./representative-succession-content";

export function RepresentativeSuccessionPage() {
  return <BlogArticlePage article={representativeSuccessionArticle}>
    <p>The departing director completes the handover. Suppliers have a new contact, the company website has been updated and the remaining team can still see sales in the dashboard.</p>
    <p>Weeks later, a verification request goes to the director’s old inbox. Nobody notices until the deadline is close.</p>
    <p>A representative change is easy to underestimate because ordinary transactions may continue. The weakness appears when the account needs a decision rather than another payment.</p>

    <section id="separate-roles" aria-labelledby="separate-roles-title">
      <h2 id="separate-roles-title">The director, representative and administrator may be different people.</h2>
    <p>Establish which role the departing person actually held. They may have been the recorded company representative, an authorized signer, an account administrator or simply the main contact. A change to one role does not automatically change the others.</p>
    <p>Identify the person who now has the relevant authority for the business and confirm the provider’s replacement process. Do not rename the former director’s login or allow a successor to sign as that person. The current record should show who is actually acting and why they are entitled to do so.</p>
    <p>A company decision appointing a successor can support that explanation. Ask what evidence the account provider needs rather than assuming a particular board document or job title is sufficient in every case.</p>
    </section>

    <section id="a-working-handoff" aria-labelledby="a-working-handoff-title">
      <h2 id="a-working-handoff-title">A useful handoff includes the next difficult notice.</h2>
    <p>A notice needs both a destination and a person able to act on it. Forwarding the former director’s email can solve delivery while leaving authority unresolved. Confirm where account-review requests, dispute notices and important service messages will arrive, then establish the authorized recipient’s access through the approved process. A message sitting in a shared inbox is still waiting if nobody there can make the required decision.</p>
    <p>Keep staff permissions tied to their jobs. Someone preparing evidence may not need authority to change bank details. Someone reading reports may not need permission to issue refunds. Trolleys’ security terms require access to be limited to the role and removed when no longer needed.</p>
    <p>If the director has already left and no authorized administrator remains, use the provider’s recovery and authority-verification process. Explain the situation and supply requested evidence securely. Possession of a saved password or verification device is not a substitute for legitimate authority.</p>
    <p>Do not delay removing inappropriate access simply to preserve convenience. Arrange the replacement and continuing work through the secure account channel. If instructions from former and current officers conflict, make that conflict explicit rather than asking a staff member to choose privately which instruction to follow.</p>
    <p>Before calling the handoff complete, walk a hypothetical verification request through the new arrangement. The recipient should know whose decision is needed, where the supporting record is held and how an authorized response is sent. This exposes the gap a dashboard login cannot reveal: access to yesterday’s sales is different from authority to answer tomorrow’s account question.</p>
    </section>
  </BlogArticlePage>;
}

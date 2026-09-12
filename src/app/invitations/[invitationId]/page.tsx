import Link from "next/link";
import { notFound, unstable_rethrow } from "next/navigation";
import { getRequestSession } from "@/platform/http/context";
import { getResourceInvitation } from "@/modules/access/resource-service";
import { invitationIdFromNextPath } from "@/shared/auth-continuation";
import { resourceInvitationProjectionSchema } from "@/shared/resource-invitation-response";
import { ResourceInvitation } from "@/ui/resource-invitation";
import { SandboxEntry } from "@/ui/sandbox-entry";
import { getSandboxOverview } from "@/modules/sandbox/service";
import { Shell } from "@/ui/shell";
import "@/ui/workspace/workspace.css";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata = { title: "Your invitation", robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default async function Page({ params }: { params: Promise<{ invitationId: string }> }) {
  const { invitationId } = await params;
  if (!invitationIdFromNextPath(`/invitations/${invitationId}`)) notFound();
  const next = `/invitations/${invitationId}`, login = `/login?next=${encodeURIComponent(next)}`;
  const session = await getRequestSession();
  if (!session) return <Shell><section className="page-container services-page"><h1>You’ve been invited</h1><p>Sign in with the email address your invitation was sent to. You’ll review the details before accepting.</p><div className="consumer-action-row"><Link className="consumer-button consumer-button-primary" href={login}>Sign in</Link><Link className="consumer-button consumer-button-secondary" href={`${login}&mode=register`}>Create a login</Link></div></section></Shell>;
  const invitation = await (async () => {
    try { return resourceInvitationProjectionSchema.parse(await getResourceInvitation(session.personId, invitationId)); }
    catch (failure) { unstable_rethrow(failure); return null; }
  })();
  const profile = invitation ? await getSandboxOverview(session.personId) : null;
  return <Shell authenticated><div className="page-container services-page">{invitation ? profile&&!profile.joined ? <><h1>Finish your profile</h1><SandboxEntry initial={profile} invitationHref={next}/></> : <ResourceInvitation key={invitation.id} initial={invitation}/> : <section className="ws-panel"><h1>This invitation isn’t available</h1><p>Sign in with the email address it was sent to, or ask its sender to check the invitation.</p><div className="consumer-action-row"><Link className="consumer-button consumer-button-secondary" href={login}>Sign in again</Link><Link href="/services">Your dashboard</Link></div></section>}</div></Shell>;
}

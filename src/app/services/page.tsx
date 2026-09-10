import {getSandboxOverview} from "@/modules/sandbox/service";
import {SandboxEntry} from "@/ui/sandbox-entry";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getRequestSession } from "@/platform/http/context";
import { listInvitationsForPerson } from "@/modules/access/service";
import { Shell, PageNotice } from "@/ui/shell";
import { ServiceChoices } from "@/ui/service-choices";
import { hasOperatorAccess } from "@/modules/operations/service";
import { InvitationsInbox } from "@/ui/workspace/invitations-inbox";
import "@/ui/workspace/workspace.css";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Your services"};
export default async function Page(){
 const session=await getRequestSession().catch(()=>undefined);
 if(session===undefined)return <PageNotice title="We couldn’t load your session"><p>Please try signing in again.</p></PageNotice>;
 if(!session)redirect("/login");
 const sandbox=await getSandboxOverview(session.personId);
 const operator=await hasOperatorAccess(session.personId).catch(()=>false);
 const invitations=await listInvitationsForPerson(session.personId).catch(()=>null);
 return <Shell authenticated><section className="page-container services-page"><div className="page-heading"><p className="eyebrow">YOUR ETAIL DEPOT</p><h1>{sandbox.joined?"Your services":"Choose your first service"}</h1><p>{sandbox.joined?"Cards for your people. Payments for your business.":"One login. Two ways to put it to work."}</p></div>{sandbox.joined?<>{invitations?(invitations.length>0&&<InvitationsInbox invitations={invitations}/>):<p role="status">Your invitation inbox couldn’t load. Refresh to try again.</p>}<ServiceChoices/>{invitations?.length===0&&<InvitationsInbox invitations={invitations}/>}<div className="services-account-tools"><SandboxEntry initial={sandbox} showMemberCode/><div className="services-help-tools"><h2>Help and account settings</h2><p>Manage sign-in, find an answer or get back to an invitation.</p><Link href="/security">Sign-in &amp; security</Link><Link href="/help">Help center</Link>{operator&&<Link href="/operations">Open customer care</Link>}</div></div></>:<SandboxEntry initial={sandbox}/>}</section></Shell>;
}

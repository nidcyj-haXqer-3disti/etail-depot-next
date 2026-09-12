import Link from "next/link";
import {listInvitationsForPerson} from "@/modules/access/service";
import {getSandboxOverview} from "@/modules/sandbox/service";
import {SandboxEntry} from "@/ui/sandbox-entry";
import { redirect } from "next/navigation";
import { getRequestSession } from "@/platform/http/context";
import { Shell, PageNotice } from "@/ui/shell";
import { ServiceChoices } from "@/ui/service-choices";
import "@/ui/workspace/workspace.css";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Your dashboard"};
export default async function Page(){
 const session=await getRequestSession().catch(()=>undefined);
 if(session===undefined)return <PageNotice title="We couldn’t load your session"><p>Please try signing in again.</p></PageNotice>;
 if(!session)redirect("/login");
 const [sandbox,invitations]=await Promise.all([getSandboxOverview(session.personId),listInvitationsForPerson(session.personId)]);
 const pending=invitations.filter(row=>row.status==="PENDING"&&row.canRespond&&row.targetKind!=="SERVICE");
 return <Shell authenticated><section className={`page-container services-page${sandbox.joined?" services-hub":""}`}><div className="page-heading"><h1>{sandbox.joined?"Your dashboard":"Welcome to Etail Depot"}</h1></div>{pending.length>0&&<aside className="services-invitation-next" aria-label="New invitations"><p>{pending.length===1?"You have a new invitation.":`You have ${pending.length} new invitations.`}</p><Link className="consumer-button consumer-button-secondary" href={pending.length===1?`/invitations/${pending[0]!.id}`:"/shared-access"}>Review {pending.length===1?"invitation":"invitations"}</Link></aside>}{sandbox.joined?<ServiceChoices/>:<SandboxEntry initial={sandbox}/>}</section></Shell>;
}

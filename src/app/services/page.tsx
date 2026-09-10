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
 const operator=await hasOperatorAccess(session.personId).catch(()=>false);
 const invitations=await listInvitationsForPerson(session.personId).catch(()=>null);
 return <Shell authenticated><section className="page-container services-page"><div className="page-heading"><p className="eyebrow">YOUR ETAIL DEPOT</p><h1>What would you like to manage?</h1><p>Your cards and your business, in one place.</p></div><ServiceChoices/>{operator&&<p><Link className="consumer-button consumer-button-secondary" href="/operations">Open customer care</Link></p>}<p><Link className="consumer-button consumer-button-secondary" href="/security">Sign-in &amp; security</Link></p>{invitations?<InvitationsInbox invitations={invitations}/>:<p role="status">Your invitation inbox couldn’t load. Refresh to try again.</p>}</section></Shell>;
}

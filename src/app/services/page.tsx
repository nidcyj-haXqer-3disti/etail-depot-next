import {getSandboxOverview} from "@/modules/sandbox/service";
import {SandboxEntry} from "@/ui/sandbox-entry";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getRequestSession } from "@/platform/http/context";
import { Shell, PageNotice } from "@/ui/shell";
import { ServiceChoices } from "@/ui/service-choices";
import { hasOperatorAccess } from "@/modules/operations/service";
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
 return <Shell authenticated><section className="page-container services-page"><div className="page-heading"><h1>{sandbox.joined?"Your services":"Choose your first service"}</h1><p>Manage your cards or your business payments.</p></div>{sandbox.joined?<><ServiceChoices/><div className="services-account-tools"><div className="services-help-tools"><h2>Account support</h2><Link href="/security">Sign-in &amp; security</Link><Link href="/help">Help center</Link>{operator&&<Link href="/operations">Open customer care</Link>}</div></div></>:<SandboxEntry initial={sandbox}/>}</section></Shell>;
}

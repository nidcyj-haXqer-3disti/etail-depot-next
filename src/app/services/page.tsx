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
 const sandbox=await getSandboxOverview(session.personId);
 return <Shell authenticated><section className={`page-container services-page${sandbox.joined?" services-hub":""}`}><div className="page-heading"><h1>{sandbox.joined?"Your dashboard":"Welcome to Etail Depot"}</h1></div>{sandbox.joined?<ServiceChoices/>:<SandboxEntry initial={sandbox}/>}</section></Shell>;
}

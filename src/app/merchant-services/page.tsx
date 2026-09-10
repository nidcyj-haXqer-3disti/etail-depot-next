import {getSandboxOverview} from "@/modules/sandbox/service";
import {SandboxEntry} from "@/ui/sandbox-entry";
import { redirect } from "next/navigation";
import { getRequestSession } from "@/platform/http/context";
import { getMerchantDashboard } from "@/modules/acquiring/dashboard-service";
import { MerchantDashboard } from "@/ui/workspace/merchant-dashboard";
import { MerchantShell } from "@/ui/workspace/merchant-shell";
import { PageNotice } from "@/ui/shell";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Merchant services"};
export default async function Page(){
 const session=await getRequestSession().catch(()=>undefined);
 if(session===undefined)return <PageNotice title="We couldn’t load your session"><p>Please try signing in again.</p></PageNotice>;
 if(!session)redirect("/login");
 const sandbox=await getSandboxOverview(session.personId);
 const dashboard=await getMerchantDashboard(session.personId).catch(()=>null);
 if(!dashboard)return <PageNotice title="Merchant services couldn’t load" authenticated><p>Please retry. Your selected merchant and saved records have not changed.</p></PageNotice>;
 return <MerchantShell><SandboxEntry initial={sandbox}/><MerchantDashboard initial={dashboard}/></MerchantShell>;
}

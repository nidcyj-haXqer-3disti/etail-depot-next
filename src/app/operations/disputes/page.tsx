import {redirect} from "next/navigation";
import Link from "next/link";
import "@/ui/operations.css";
import {getRequestSession} from "@/platform/http/context";
import {SecurityError} from "@/platform/security/origin";
import {getOperatorDisputes} from "@/modules/disputes/service";
import {MerchantDisputes} from "@/ui/workspace/merchant-disputes";
import {MerchantNavigationBoundary} from "@/ui/workspace/merchant-navigation-state";
import {Shell,PageNotice} from "@/ui/shell";
export const dynamic="force-dynamic";
export default async function Page(){
 const session=await getRequestSession();if(!session)redirect("/login");
 let disputes:Awaited<ReturnType<typeof getOperatorDisputes>>|null=null;
 try{disputes=await getOperatorDisputes(session.personId);}catch(error){if(!(error instanceof SecurityError&&[403,404].includes(error.status)))throw error;}
 if(!disputes)return <PageNotice authenticated title="Access required"><p>You need an explicit dispute review assignment.</p></PageNotice>;
 return <MerchantNavigationBoundary><Shell authenticated><div className="page-container ops-processing-page"><Link className="service-back" href="/operations">Back to customer care</Link><MerchantDisputes disputes={disputes} operator/></div></Shell></MerchantNavigationBoundary>;
}

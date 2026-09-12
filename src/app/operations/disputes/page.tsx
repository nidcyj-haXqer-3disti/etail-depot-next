import {redirect} from "next/navigation";
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
 return <MerchantNavigationBoundary><Shell authenticated><MerchantDisputes disputes={disputes} operator/></Shell></MerchantNavigationBoundary>;
}

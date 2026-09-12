import {redirect} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {SecurityError} from "@/platform/security/origin";
import {getPayerDispute} from "@/modules/disputes/service";
import {PayerDispute} from "@/ui/workspace/merchant-disputes";
import {MerchantNavigationBoundary} from "@/ui/workspace/merchant-navigation-state";
import {Shell,PageNotice} from "@/ui/shell";
export const dynamic="force-dynamic";
export const metadata={title:"Payment help"};
export default async function Page({params}:{params:Promise<{paymentId:string}>}){
 const session=await getRequestSession();if(!session)redirect("/login");
 let data:Awaited<ReturnType<typeof getPayerDispute>>|null=null;
 try{data=await getPayerDispute(session.personId,(await params).paymentId);}catch(error){if(!(error instanceof SecurityError&&[403,404].includes(error.status)))throw error;}
 if(!data)return <PageNotice authenticated title="Payment unavailable"><p>This payment is not available with your current card access.</p></PageNotice>;
 return <MerchantNavigationBoundary><Shell authenticated><PayerDispute {...data}/></Shell></MerchantNavigationBoundary>;
}

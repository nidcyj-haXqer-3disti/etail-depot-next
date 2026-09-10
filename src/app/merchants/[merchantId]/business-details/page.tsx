import Link from "next/link";
import {redirect,unstable_rethrow} from "next/navigation";
import {z} from "zod";
import {getRequestSession} from "@/platform/http/context";
import {getMerchantBusinessDetails} from "@/modules/acquiring/service";
import {MerchantBusinessDetails} from "@/ui/workspace/merchant-entry";
import {MerchantShell} from "@/ui/workspace/merchant-shell";
import {PageNotice} from "@/ui/shell";
export const dynamic="force-dynamic";
export const metadata={title:"Merchant business details"};
export default async function Page({params}:{params:Promise<{merchantId:string}>}) {
 const session=await getRequestSession().catch(()=>undefined);
 if(session===undefined)return <PageNotice title="We couldn’t load your session"><p>Please retry.</p></PageNotice>;
 if(!session)redirect("/login");
 const data=await (async()=>{try {
  const {merchantId}=await params;if(!z.uuid().safeParse(merchantId).success)throw new Error("Invalid merchant");
  return await getMerchantBusinessDetails(session.personId,merchantId);
 }catch(error){unstable_rethrow(error);return null;} })();
 if(!data)return <PageNotice title="Merchant setup is unavailable" authenticated><p>Check your merchant access or retry.</p><Link href="/merchant-services">Return to Merchant overview</Link></PageNotice>;
 const {merchantId}=data;
 return <MerchantShell merchantId={merchantId} name={data.name} kind="MASTER" tab="verification" primaryAccess={data.primaryAccess}><Link href={`/merchants/${merchantId}?tab=verification`}>Back to payment setup</Link><MerchantBusinessDetails initial={data}/></MerchantShell>;
}

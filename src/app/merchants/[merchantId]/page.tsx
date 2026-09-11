import {getMerchantSupportPaymentPreview,listMerchantSupportCases} from "@/modules/cases/service";
import type { MerchantSupportContext } from "@/ui/workspace/cases";
import {getMerchantOperations} from "@/modules/acquiring/operations-service";
import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getRequestSession } from "@/platform/http/context";
import { getMerchantWorkspace } from "@/modules/acquiring/service";
import { getMerchantAccessOverview } from "@/modules/access/merchant-service";
import { MerchantWorkspace } from "@/ui/workspace/merchant-workspace";
import { MerchantShell, type MerchantTab } from "@/ui/workspace/merchant-shell";
import { PageNotice } from "@/ui/shell";
import { EmptyState } from "@/ui/workspace/primitives";
import { SecurityError } from "@/platform/security/origin";
import type { MerchantWorkspaceProjection } from "@/modules/acquiring/contracts";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata = { title: "Merchant workspace" };
export default async function Page({ params, searchParams }: { params: Promise<{ merchantId: string }>; searchParams: Promise<{ tab?: string | string[]; payment?:string|string[] }> }) {
  const session = await getRequestSession().catch(() => undefined);
  if (session === undefined) return <PageNotice title="We couldn’t load your session"><p>Please retry. Your saved records have not changed.</p></PageNotice>;
  if (!session) redirect("/login");
  const { merchantId } = await params;
  const query = await searchParams;
  const tab: MerchantTab = query.tab === "payments" || query.tab === "people" || query.tab === "verification" || query.tab === "help" ? query.tab : "channels";
  const retryNotice = <PageNotice title="We couldn’t load this merchant" authenticated><p>Your saved records and selected merchant have not changed. Retry this page when the service is available.</p><Link href={`/merchants/${merchantId}?tab=${tab}`}>Retry this merchant</Link></PageNotice>;
  let workspace: MerchantWorkspaceProjection | null = null;
  if (z.uuid().safeParse(merchantId).success) {
    try { workspace = await getMerchantWorkspace(session.personId, merchantId); }
    catch (error) { if (!(error instanceof SecurityError && [403,404].includes(error.status))) return retryNotice; }
  }
  if (!workspace) return <MerchantShell><h1>Merchant unavailable</h1><div className="mn-panel"><EmptyState title="This merchant is not available to you" description="Your access or the merchant status may have changed. No other merchant has been selected."><Link className="consumer-button consumer-button-secondary" href="/merchant-services">Choose an available merchant</Link></EmptyState></div></MerchantShell>;
  const access = tab === "people" && workspace.canReadPeople ? await getMerchantAccessOverview(session.personId, merchantId).catch(() => undefined) : undefined;
  const support:MerchantSupportContext|undefined=tab==="help"?await(async()=>{
    try {
      const initialCases=await listMerchantSupportCases(session.personId,merchantId,{q:""});
      let linkedPayment:MerchantSupportContext["linkedPayment"]=null;
      let paymentUnavailable=Boolean(query.payment);
      if(typeof query.payment==="string"&&z.uuid().safeParse(query.payment).success){
        try {linkedPayment=await getMerchantSupportPaymentPreview(session.personId,merchantId,query.payment.toLowerCase());paymentUnavailable=false;}
        catch(error){if(!(error instanceof SecurityError&&[403,404].includes(error.status)))throw error;}
      }
      return {kind:"MERCHANT",merchantId,serviceId:workspace.merchant.master.serviceId,merchantName:workspace.merchant.displayName,primaryName:workspace.merchant.master.displayName,initialCases,linkedPayment,paymentUnavailable};
    }catch{return undefined;}
  })():undefined;
  return <MerchantWorkspace support={support} workspace={workspace} tab={tab} access={access} operations={tab!=="help"&&(workspace.primaryAccess || workspace.merchant.status === "ACTIVE") ? await getMerchantOperations(session.personId,merchantId).catch(()=>undefined) : undefined} />;
}

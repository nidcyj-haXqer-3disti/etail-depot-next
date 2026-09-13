import {resolveCustomerPage,customerLoginHref} from "../customer-route";
import {listTerminalDisputes} from "@/modules/disputes/service";
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
import {merchantActivityReturn} from "@/shared/merchant-activity";
export async function renderMerchantTerminal(merchantId:string,searchParams:Promise<Record<string,string|string[]|undefined>>,pathname=`/merchants/${merchantId}`) {
  const route=await resolveCustomerPage(pathname,searchParams);
  if(!route)return <PageNotice title="This terminal view is unavailable"><p>Choose an available payment terminal.</p><Link href="/merchant-services/terminals">Your payment terminals</Link></PageNotice>;
  const session = await getRequestSession().catch(() => undefined);
  if (session === undefined) return <PageNotice title="We couldn’t load your session"><p>Please retry. Your saved records have not changed.</p></PageNotice>;
  if (!session) redirect(customerLoginHref(route.href));
  const query = route.query;
  if(query.returnTo!==undefined&&!merchantActivityReturn(query.returnTo))return <PageNotice title="This terminal view is unavailable" authenticated><p>Choose the terminal from your payment dashboard.</p><Link href="/merchant-services/terminals">Your payment terminals</Link></PageNotice>;
  const tab: MerchantTab = query.tab === "payments" || query.tab === "people" || query.tab === "verification" || query.tab === "help" || query.tab === "disputes" ? query.tab : "channels";
  const retryNotice = <PageNotice title="We couldn’t load this payment terminal" authenticated><p>Your saved records have not changed. Reload this payment terminal to try again.</p><Link href={route.href}>Reload payment terminal</Link></PageNotice>;
  let workspace: MerchantWorkspaceProjection | null = null;
  if (z.uuid().safeParse(merchantId).success) {
    try { workspace = await getMerchantWorkspace(session.personId, merchantId); }
    catch (error) { if (!(error instanceof SecurityError && [403,404].includes(error.status))) return retryNotice; }
  }
  if (!workspace) return <MerchantShell><h1>Payment terminal unavailable</h1><div className="mn-panel"><EmptyState title="This payment terminal is not available to you" description="Your access or the terminal status may have changed. Choose a payment terminal you can use."><Link className="consumer-button consumer-button-secondary" href="/merchant-services">Choose a payment terminal</Link></EmptyState></div></MerchantShell>;
  const accessRead = workspace.canReadPeople ? getMerchantAccessOverview(session.personId, merchantId).catch(() => undefined) : Promise.resolve(undefined);
  const supportRead:Promise<MerchantSupportContext|undefined>=(async()=>{
    try {
      const initialCases=await listMerchantSupportCases(session.personId,merchantId,{q:""});
      let linkedPayment:MerchantSupportContext["linkedPayment"]=null;
      let paymentUnavailable=tab==="help"&&Boolean(query.payment);
      if(tab==="help"&&typeof query.payment==="string"&&z.uuid().safeParse(query.payment).success){
        try {linkedPayment=await getMerchantSupportPaymentPreview(session.personId,merchantId,query.payment.toLowerCase());paymentUnavailable=false;}
        catch(error){if(!(error instanceof SecurityError&&[403,404].includes(error.status)))throw error;}
      }
      return {kind:"MERCHANT",merchantId,serviceId:workspace.merchant.merchant.serviceId,merchantName:workspace.merchant.displayName,primaryName:workspace.merchant.merchant.displayName,initialCases,linkedPayment,paymentUnavailable};
    }catch{return undefined;}
  })();
  const overviewHref=merchantActivityReturn(typeof query.returnTo==="string"?query.returnTo:null)??undefined;
  const [access,support,disputes,operations]=await Promise.all([accessRead,supportRead,listTerminalDisputes(session.personId,merchantId).catch(()=>undefined),(workspace.ownerAccess||workspace.merchant.status==="ACTIVE")?getMerchantOperations(session.personId,merchantId).catch(()=>undefined):Promise.resolve(undefined)]);
  return <MerchantWorkspace disputes={disputes} overviewHref={overviewHref} support={support} workspace={workspace} tab={tab} access={access} operations={operations} />;
}

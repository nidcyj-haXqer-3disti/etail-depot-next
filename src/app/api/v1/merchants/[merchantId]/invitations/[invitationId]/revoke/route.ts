import {apiRoute,json,readJson} from "@/platform/http/context";
import {revokeMerchantInvitation} from "@/modules/access/merchant-service";
import {invitationDecisionSchema} from "@/modules/access/contracts";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{merchantId:string;invitationId:string}>}) {
  return apiRoute(request,async session=>{
    const {merchantId,invitationId}=await context.params;
    return json(await revokeMerchantInvitation(session!.personId,requireAcquiringRouteId(merchantId),requireAcquiringRouteId(invitationId),await readJson(request,invitationDecisionSchema)));
  },{authenticated:true});
}

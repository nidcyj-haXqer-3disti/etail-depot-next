import {apiRoute,json,readJson} from "@/platform/http/context";
import {revokeMerchantAccess} from "@/modules/access/merchant-service";
import {invitationDecisionSchema} from "@/modules/access/contracts";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{merchantId:string;assignmentId:string}>}) {
  return apiRoute(request,async session=>{
    const {merchantId,assignmentId}=await context.params;
    return json(await revokeMerchantAccess(session!.personId,requireAcquiringRouteId(merchantId),requireAcquiringRouteId(assignmentId),await readJson(request,invitationDecisionSchema)));
  },{authenticated:true});
}

import {apiRoute,json} from "@/platform/http/context";
import {SecurityError} from "@/platform/security/origin";
import {getMerchantBusinessDetails} from "@/modules/acquiring/service";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{merchantId:string}>}) {
  return apiRoute(request,async session=>{
    if(new URL(request.url).searchParams.size)throw new SecurityError("INVALID_REQUEST",422);
    const {merchantId}=await context.params;
    return json(await getMerchantBusinessDetails(session!.personId,requireAcquiringRouteId(merchantId)));
  },{authenticated:true});
}

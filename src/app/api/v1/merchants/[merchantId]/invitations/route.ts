import {apiRoute,json,readJson} from "@/platform/http/context";
import {createMerchantInvitation} from "@/modules/access/merchant-service";
import {createMerchantInvitationSchema} from "@/modules/access/merchant-contracts";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{merchantId:string}>}) {
  return apiRoute(request,async session=>{
    const {merchantId}=await context.params;
    return json(await createMerchantInvitation(session!.personId,requireAcquiringRouteId(merchantId),await readJson(request,createMerchantInvitationSchema)));
  },{authenticated:true});
}

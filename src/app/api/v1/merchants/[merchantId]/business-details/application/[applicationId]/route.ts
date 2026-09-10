import {apiRoute,json,readJson} from "@/platform/http/context";
import {updateMerchantSetup} from "@/modules/acquiring/service";
import {updateMerchantSetupSchema} from "@/modules/acquiring/contracts";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function PATCH(request:Request,context:{params:Promise<{merchantId:string;applicationId:string}>}) {
  return apiRoute(request,async session=>{const {merchantId,applicationId}=await context.params;return json(await updateMerchantSetup(session!.personId,requireAcquiringRouteId(merchantId),requireAcquiringRouteId(applicationId),await readJson(request,updateMerchantSetupSchema)));},{authenticated:true});
}

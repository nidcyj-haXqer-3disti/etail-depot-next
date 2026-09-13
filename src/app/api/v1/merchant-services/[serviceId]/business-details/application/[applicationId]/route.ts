import {apiRoute,json,readJson} from "@/platform/http/context";
import {updateMerchantAccountSetup} from "@/modules/acquiring/service";
import {updateMerchantSetupSchema} from "@/modules/acquiring/contracts";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function PATCH(request:Request,context:{params:Promise<{serviceId:string;applicationId:string}>}){
 return apiRoute(request,async session=>{const {serviceId,applicationId}=await context.params;return json(await updateMerchantAccountSetup(session!.personId,requireAcquiringRouteId(serviceId),requireAcquiringRouteId(applicationId),await readJson(request,updateMerchantSetupSchema)));},{authenticated:true});
}

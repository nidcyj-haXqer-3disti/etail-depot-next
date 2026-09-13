import {apiRoute,json,readJson} from "@/platform/http/context";
import {submitMerchantAccountSetup} from "@/modules/acquiring/service";
import {submitMerchantSetupSchema} from "@/modules/acquiring/contracts";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{serviceId:string;applicationId:string}>}){
 return apiRoute(request,async session=>{const {serviceId,applicationId}=await context.params;return json(await submitMerchantAccountSetup(session!.personId,requireAcquiringRouteId(serviceId),requireAcquiringRouteId(applicationId),await readJson(request,submitMerchantSetupSchema)));},{authenticated:true});
}

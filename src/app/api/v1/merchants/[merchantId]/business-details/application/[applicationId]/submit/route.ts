import {apiRoute,json,readJson} from "@/platform/http/context";
import {submitMerchantSetup} from "@/modules/acquiring/service";
import {submitMerchantSetupSchema} from "@/modules/acquiring/contracts";
import {requireAcquiringRouteId} from "@/modules/acquiring/routes";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{merchantId:string;applicationId:string}>}) {
  return apiRoute(request,async session=>{const {merchantId,applicationId}=await context.params;return json(await submitMerchantSetup(session!.personId,requireAcquiringRouteId(merchantId),requireAcquiringRouteId(applicationId),await readJson(request,submitMerchantSetupSchema)));},{authenticated:true});
}

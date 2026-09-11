import { apiRoute, json } from "@/platform/http/context";
import { serviceIdSchema as merchantIdSchema } from "@/platform/http/contracts";
import { SecurityError } from "@/platform/security/origin";
import { getMerchantSupportCase } from "@/modules/cases/service";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request:Request,context:{params:Promise<{merchantId:string;caseId:string}>}) {
  return apiRoute(request,async session=>{
    const params=await context.params;
    const service=merchantIdSchema.safeParse(params.merchantId), resource=merchantIdSchema.safeParse(params.caseId);
    if(!service.success)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
    if(!resource.success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
    return json(await getMerchantSupportCase(session!.personId,service.data,resource.data));
  },{authenticated:true});
}

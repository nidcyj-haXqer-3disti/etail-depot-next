import { apiRoute, json, readJson } from "@/platform/http/context";
import { serviceIdSchema as merchantIdSchema } from "@/platform/http/contracts";
import { SecurityError } from "@/platform/security/origin";
import { withdrawMerchantSupportCase } from "@/modules/cases/service";
import { withdrawSupportCaseSchema } from "@/modules/cases/contracts";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request:Request,context:{params:Promise<{merchantId:string;caseId:string}>}) {
  return apiRoute(request,async session=>{
    const params=await context.params;
    const service=merchantIdSchema.safeParse(params.merchantId), resource=merchantIdSchema.safeParse(params.caseId);
    if(!service.success)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
    if(!resource.success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
    return json(await withdrawMerchantSupportCase(session!.personId,service.data,resource.data,await readJson(request,withdrawSupportCaseSchema)));
  },{authenticated:true});
}

import { apiRoute, json, readJson } from "@/platform/http/context";
import { serviceIdSchema } from "@/platform/http/contracts";
import { SecurityError } from "@/platform/security/origin";
import { withdrawSupportCase } from "@/modules/cases/service";
import { withdrawSupportCaseSchema } from "@/modules/cases/contracts";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request:Request,context:{params:Promise<{serviceId:string;caseId:string}>}) {
  return apiRoute(request,async session=>{
    const params=await context.params;
    const service=serviceIdSchema.safeParse(params.serviceId), resource=serviceIdSchema.safeParse(params.caseId);
    if(!service.success)throw new SecurityError("SERVICE_UNAVAILABLE",404);
    if(!resource.success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
    return json(await withdrawSupportCase(session!.personId,service.data,resource.data,await readJson(request,withdrawSupportCaseSchema)));
  },{authenticated:true});
}

import { apiRoute, json, readJson } from "@/platform/http/context";
import { serviceIdSchema } from "@/platform/http/contracts";
import { SecurityError } from "@/platform/security/origin";
import { listSupportCases, createSupportCase } from "@/modules/cases/service";
import { createSupportCaseSchema, supportCaseQuerySchema } from "@/modules/cases/contracts";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request:Request,context:{params:Promise<{serviceId:string}>}) {
  return apiRoute(request,async session=>{
    const id=serviceIdSchema.safeParse((await context.params).serviceId);
    if(!id.success)throw new SecurityError("SERVICE_UNAVAILABLE",404);
    const params=new URL(request.url).searchParams;
    if([...params.keys()].some(key=>params.getAll(key).length!==1))throw new SecurityError("INVALID_REQUEST",422);
    const query=supportCaseQuerySchema.safeParse(Object.fromEntries(params));
    if(!query.success)throw new SecurityError("INVALID_REQUEST",422);
    return json(await listSupportCases(session!.personId,id.data,query.data));
  },{authenticated:true});
}
export async function POST(request:Request,context:{params:Promise<{serviceId:string}>}) {
  return apiRoute(request,async session=>{
    const id=serviceIdSchema.safeParse((await context.params).serviceId);
    if(!id.success)throw new SecurityError("SERVICE_UNAVAILABLE",404);
    return json(await createSupportCase(session!.personId,id.data,await readJson(request,createSupportCaseSchema)));
  },{authenticated:true});
}

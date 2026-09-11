import { apiRoute, json, readJson } from "@/platform/http/context";
import { serviceIdSchema as merchantIdSchema } from "@/platform/http/contracts";
import { SecurityError } from "@/platform/security/origin";
import { listMerchantSupportCases, createMerchantSupportCase } from "@/modules/cases/service";
import { createMerchantSupportCaseSchema, supportCaseQuerySchema } from "@/modules/cases/contracts";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request:Request,context:{params:Promise<{merchantId:string}>}) {
  return apiRoute(request,async session=>{
    const id=merchantIdSchema.safeParse((await context.params).merchantId);
    if(!id.success)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
    const params=new URL(request.url).searchParams;
    if([...params.keys()].some(key=>params.getAll(key).length!==1))throw new SecurityError("INVALID_REQUEST",422);
    const query=supportCaseQuerySchema.safeParse(Object.fromEntries(params));
    if(!query.success)throw new SecurityError("INVALID_REQUEST",422);
    return json(await listMerchantSupportCases(session!.personId,id.data,query.data));
  },{authenticated:true});
}
export async function POST(request:Request,context:{params:Promise<{merchantId:string}>}) {
  return apiRoute(request,async session=>{
    const id=merchantIdSchema.safeParse((await context.params).merchantId);
    if(!id.success)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
    return json(await createMerchantSupportCase(session!.personId,id.data,await readJson(request,createMerchantSupportCaseSchema)));
  },{authenticated:true});
}

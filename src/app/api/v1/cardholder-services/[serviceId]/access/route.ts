import { apiRoute, json } from "@/platform/http/context";
import { z } from "zod";
import { SecurityError } from "@/platform/security/origin";
import { getAccessOverview } from "@/modules/access/service";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{serviceId:string}>}) {
 return apiRoute(request,async session=>{
  const params=await context.params;
  if(!z.uuid().safeParse(params.serviceId).success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  return json(await getAccessOverview(session!.personId,params.serviceId));
 },{authenticated:true});
}

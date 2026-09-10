import { apiRoute, json, readJson } from "@/platform/http/context";
import { z } from "zod";
import { SecurityError } from "@/platform/security/origin";
import { updateMemberAccess } from "@/modules/access/service";
import { updateAccessSchema } from "@/modules/access/contracts";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function PATCH(request:Request,context:{params:Promise<{serviceId:string;personId:string}>}) {
 return apiRoute(request,async session=>{
  const params=await context.params;
  if(!z.uuid().safeParse(params.serviceId).success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  if(!z.uuid().safeParse(params.personId).success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  const input=await readJson(request,updateAccessSchema);
  return json(await updateMemberAccess(session!.personId,params.serviceId,params.personId,input));
 },{authenticated:true});
}

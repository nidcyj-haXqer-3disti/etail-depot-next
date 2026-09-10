import { apiRoute, json, readJson } from "@/platform/http/context";
import { z } from "zod";
import { SecurityError } from "@/platform/security/origin";
import { acceptInvitation } from "@/modules/access/service";
import { invitationDecisionSchema } from "@/modules/access/contracts";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request,context:{params:Promise<{invitationId:string}>}) {
 return apiRoute(request,async session=>{
  const params=await context.params;
  if(!z.uuid().safeParse(params.invitationId).success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  const input=await readJson(request,invitationDecisionSchema);
  return json(await acceptInvitation(session!.personId,params.invitationId,input));
 },{authenticated:true});
}

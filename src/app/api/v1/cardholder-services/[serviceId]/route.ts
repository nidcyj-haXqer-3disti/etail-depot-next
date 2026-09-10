import { apiRoute, json } from "@/platform/http/context";
import { serviceIdSchema } from "@/platform/http/contracts";
import { SecurityError } from "@/platform/security/origin";
import { getServiceForPerson } from "@/modules/services/service";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request,context:{params:Promise<{serviceId:string}>}) {
  return apiRoute(request,async(session)=>{
    const result=serviceIdSchema.safeParse((await context.params).serviceId);
    if(!result.success) throw new SecurityError("SERVICE_UNAVAILABLE",404);
    return json(await getServiceForPerson(session!.personId,result.data));
  },{authenticated:true});
}

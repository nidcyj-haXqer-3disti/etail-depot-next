import { apiRoute, json, readJson } from "@/platform/http/context";
import { serviceIdSchema } from "@/platform/http/contracts";
import { SecurityError } from "@/platform/security/origin";
import { getNotificationPreferences, saveNotificationPreferences } from "@/modules/workspace/service";
import { notificationCommandSchema } from "@/modules/workspace/contracts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request:Request,context:{params:Promise<{serviceId:string}>}) {
  return apiRoute(request,async session=>{
    const serviceId=serviceIdSchema.safeParse((await context.params).serviceId);
    if(!serviceId.success)throw new SecurityError("SERVICE_UNAVAILABLE",404);
    return json(await getNotificationPreferences(session!.personId,serviceId.data));
  },{authenticated:true});
}
export async function PUT(request: Request, context: { params: Promise<{ serviceId: string }> }) {
  return apiRoute(request, async session => {
    const params = await context.params;
    const serviceId = serviceIdSchema.safeParse(params.serviceId);
    if (!serviceId.success) throw new SecurityError("SERVICE_UNAVAILABLE", 404);
    const input = await readJson(request, notificationCommandSchema);
    const saved=await saveNotificationPreferences(session!.personId, serviceId.data, input);
    return json({...saved,serviceId:serviceId.data,personId:session!.personId,commandId:input.commandId});
  }, { authenticated: true });
}

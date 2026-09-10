import { apiRoute, json } from "@/platform/http/context";
import { serviceIdSchema } from "@/platform/http/contracts";
import { SecurityError } from "@/platform/security/origin";
import { getActivity } from "@/modules/workspace/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request, context: { params: Promise<{ serviceId: string; activityId: string }> }) {
  return apiRoute(request, async session => {
    const params = await context.params;
    const serviceId = serviceIdSchema.safeParse(params.serviceId);
    if (!serviceId.success) throw new SecurityError("SERVICE_UNAVAILABLE", 404);
    const resourceId = serviceIdSchema.safeParse(params.activityId);
    if (!resourceId.success) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
    return json(await getActivity(session!.personId, serviceId.data, resourceId.data));
  }, { authenticated: true });
}

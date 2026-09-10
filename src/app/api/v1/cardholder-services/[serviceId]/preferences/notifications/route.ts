import { apiRoute, json, readJson } from "@/platform/http/context";
import { serviceIdSchema } from "@/platform/http/contracts";
import { SecurityError } from "@/platform/security/origin";
import { saveNotificationPreferences } from "@/modules/workspace/service";
import { notificationCommandSchema } from "@/modules/workspace/contracts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function PUT(request: Request, context: { params: Promise<{ serviceId: string }> }) {
  return apiRoute(request, async session => {
    const params = await context.params;
    const serviceId = serviceIdSchema.safeParse(params.serviceId);
    if (!serviceId.success) throw new SecurityError("SERVICE_UNAVAILABLE", 404);
    const input = await readJson(request, notificationCommandSchema);
    return json(await saveNotificationPreferences(session!.personId, serviceId.data, input));
  }, { authenticated: true });
}

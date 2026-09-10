import { apiRoute, json } from "@/platform/http/context";
import { serviceIdSchema } from "@/platform/http/contracts";
import { SecurityError } from "@/platform/security/origin";
import { getWorkspace } from "@/modules/workspace/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request, context: { params: Promise<{ serviceId: string }> }) {
  return apiRoute(request, async session => {
    const params = await context.params;
    const serviceId = serviceIdSchema.safeParse(params.serviceId);
    if (!serviceId.success) throw new SecurityError("SERVICE_UNAVAILABLE", 404);
    return json(await getWorkspace(session!.personId, serviceId.data));
  }, { authenticated: true });
}

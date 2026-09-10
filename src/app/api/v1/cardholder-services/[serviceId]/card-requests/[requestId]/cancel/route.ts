import { apiRoute, json, readJson } from "@/platform/http/context";
import { serviceIdSchema } from "@/platform/http/contracts";
import { SecurityError } from "@/platform/security/origin";
import { cancelCardRequest } from "@/modules/workspace/service";
import { versionedCommandSchema } from "@/modules/workspace/contracts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request, context: { params: Promise<{ serviceId: string; requestId: string }> }) {
  return apiRoute(request, async session => {
    const params = await context.params;
    const serviceId = serviceIdSchema.safeParse(params.serviceId);
    if (!serviceId.success) throw new SecurityError("SERVICE_UNAVAILABLE", 404);
    const resourceId = serviceIdSchema.safeParse(params.requestId);
    if (!resourceId.success) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
    const input = await readJson(request, versionedCommandSchema);
    return json(await cancelCardRequest(session!.personId, serviceId.data, resourceId.data, input));
  }, { authenticated: true });
}

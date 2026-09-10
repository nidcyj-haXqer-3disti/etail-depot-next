import { apiRoute, json, readJson } from "@/platform/http/context";
import { updateReportDefinition, deleteReportDefinition } from "@/modules/reports/service";
import { reportDefinitionUpdateSchema, reportDefinitionDeleteSchema } from "@/modules/reports/contracts";
import { requireReportRouteId } from "@/modules/reports/routes";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ serviceId: string; definitionId: string }> };
export async function PATCH(request: Request, context: Context) {
  return apiRoute(request, async session => {
    const { serviceId, definitionId } = await context.params;
    return json(await updateReportDefinition(session!.personId, requireReportRouteId(serviceId), requireReportRouteId(definitionId, "RESOURCE_UNAVAILABLE"), await readJson(request, reportDefinitionUpdateSchema)));
  }, { authenticated: true });
}
export async function DELETE(request: Request, context: Context) {
  return apiRoute(request, async session => {
    const { serviceId, definitionId } = await context.params;
    return json(await deleteReportDefinition(session!.personId, requireReportRouteId(serviceId), requireReportRouteId(definitionId, "RESOURCE_UNAVAILABLE"), await readJson(request, reportDefinitionDeleteSchema)));
  }, { authenticated: true });
}

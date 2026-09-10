import { apiRoute, json, readJson } from "@/platform/http/context";
import { createReportDefinition } from "@/modules/reports/service";
import { reportDefinitionCommandSchema } from "@/modules/reports/contracts";
import { requireReportRouteId } from "@/modules/reports/routes";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request, context: { params: Promise<{ serviceId: string }> }) {
  return apiRoute(request, async session => {
    const { serviceId } = await context.params;
    return json(await createReportDefinition(session!.personId, requireReportRouteId(serviceId), await readJson(request, reportDefinitionCommandSchema)));
  }, { authenticated: true });
}

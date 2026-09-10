import { apiRoute, json } from "@/platform/http/context";
import { getHistoricalReport } from "@/modules/reports/service";
import { requireReportRouteId, reportRouteFilters } from "@/modules/reports/routes";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request, context: { params: Promise<{ serviceId: string }> }) {
  return apiRoute(request, async session => {
    const { serviceId } = await context.params;
    return json(await getHistoricalReport(session!.personId, requireReportRouteId(serviceId), reportRouteFilters(request)));
  }, { authenticated: true });
}

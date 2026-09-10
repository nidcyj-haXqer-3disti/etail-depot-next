import { apiRoute } from "@/platform/http/context";
import { exportHistoricalReport } from "@/modules/reports/service";
import { requireReportRouteId, reportRouteFilters } from "@/modules/reports/routes";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request, context: { params: Promise<{ serviceId: string }> }) {
  return apiRoute(request, async session => {
    const { serviceId } = await context.params;
    const result = await exportHistoricalReport(session!.personId, requireReportRouteId(serviceId), reportRouteFilters(request));
    return new Response(result.csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${result.filename}"`,
      "Cache-Control": "private, no-store, max-age=0", "Vary": "Cookie, Origin", "X-Content-Type-Options": "nosniff" } });
  }, { authenticated: true });
}

import { apiRoute, json } from "@/platform/http/context";
import { getOperatorCase } from "@/modules/operations/service";
export const runtime = "nodejs";
export async function GET(request: Request, { params }: { params: Promise<{ caseId: string }> }) { return apiRoute(request, async session => json(await getOperatorCase(session!.personId, (await params).caseId)), { authenticated: true }); }

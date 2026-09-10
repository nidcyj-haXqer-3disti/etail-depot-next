import { apiRoute, json, readJson } from "@/platform/http/context";
import { operatorResponseSchema, respondToCase } from "@/modules/operations/service";
export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ caseId: string }> }) { return apiRoute(request, async session => json(await respondToCase(session!.personId, (await params).caseId, await readJson(request, operatorResponseSchema))), { authenticated: true }); }

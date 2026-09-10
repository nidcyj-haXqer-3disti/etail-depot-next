import { apiRoute, json } from "@/platform/http/context";
import { getOperatorQueue } from "@/modules/operations/service";
export const runtime = "nodejs";
export async function GET(request: Request) { return apiRoute(request, async session => json(await getOperatorQueue(session!.personId)), { authenticated: true }); }

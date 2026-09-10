import { apiRoute, json, readJson } from "@/platform/http/context";
import { revokeSelectedSessions } from "@/modules/identity/security";
import { revokeSessionsSchema } from "@/modules/identity/security-contracts";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return apiRoute(request, async session => json(await revokeSelectedSessions(session!, await readJson(request, revokeSessionsSchema))), { authenticated: true });
}

import { apiRoute, json } from "@/platform/http/context";
import { getActiveSessions } from "@/modules/identity/security";
export const runtime = "nodejs";
export async function GET(request: Request) {
  return apiRoute(request, async session => json(await getActiveSessions(session!)), { authenticated: true });
}

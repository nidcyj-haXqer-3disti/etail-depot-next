import { apiRoute, json, readJson } from "@/platform/http/context";
import { recoveryRequestSchema } from "@/modules/identity/email-contracts";
import { requestPasswordRecovery } from "@/modules/identity/password-login";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return apiRoute(request, async () => {
    const { email } = await readJson(request, recoveryRequestSchema);
    await requestPasswordRecovery(email);
    return json({ recoveryRequested: true });
  });
}

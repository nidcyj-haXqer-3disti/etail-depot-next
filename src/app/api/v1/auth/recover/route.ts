import { apiRoute, json, readJson } from "@/platform/http/context";
import { recoveryRequestSchema } from "@/modules/identity/email-contracts";
import { requestPasswordRecovery } from "@/modules/identity/password-login";
import { saveInvitationContinuation } from "@/modules/identity/continuation";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return apiRoute(request, async () => {
    const { email, nextPath } = await readJson(request, recoveryRequestSchema);
    await requestPasswordRecovery(email);
    const continuation = await saveInvitationContinuation(nextPath);
    return json({ recoveryRequested: true }, 200, continuation ? { "Set-Cookie": continuation } : undefined);
  });
}

import { apiRoute, json, readJson } from "@/platform/http/context";
import { registrationSchema } from "@/modules/identity/email-contracts";
import { registerWithPassword } from "@/modules/identity/password-login";
import { saveInvitationContinuation } from "@/modules/identity/continuation";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return apiRoute(request, async () => {
    const { email, password, nextPath } = await readJson(request, registrationSchema);
    await registerWithPassword(email, password);
    const continuation = await saveInvitationContinuation(nextPath);
    return json({ registrationRequested: true }, 200, continuation ? { "Set-Cookie": continuation } : undefined);
  });
}

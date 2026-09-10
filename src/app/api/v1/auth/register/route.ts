import { apiRoute, json, readJson } from "@/platform/http/context";
import { registrationSchema } from "@/modules/identity/email-contracts";
import { registerWithPassword } from "@/modules/identity/password-login";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return apiRoute(request, async () => {
    const { email, password } = await readJson(request, registrationSchema);
    await registerWithPassword(email, password);
    return json({ registrationRequested: true });
  });
}

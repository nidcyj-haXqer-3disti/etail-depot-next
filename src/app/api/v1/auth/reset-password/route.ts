import { apiRoute, json, readJson } from "@/platform/http/context";
import { passwordResetSchema } from "@/modules/identity/email-contracts";
import { resetPasswordFromLink } from "@/modules/identity/password-login";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return apiRoute(request, async () => {
    const { token, password } = await readJson(request, passwordResetSchema);
    await resetPasswordFromLink(token, password);
    return json({ passwordReset: true });
  });
}

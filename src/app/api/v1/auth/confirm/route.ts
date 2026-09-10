import { apiRoute, json, readJson } from "@/platform/http/context";
import { emailConfirmationSchema } from "@/modules/identity/email-contracts";
import { confirmEmailLink } from "@/modules/identity/password-login";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return apiRoute(request, async () => {
    const { token } = await readJson(request, emailConfirmationSchema);
    await confirmEmailLink(token);
    return json({ confirmed: true });
  });
}

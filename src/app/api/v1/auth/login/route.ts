import { apiRoute, readJson } from "@/platform/http/context";
import { passwordLoginSchema } from "@/platform/http/contracts";
import { SecurityError } from "@/platform/security/origin";
export const runtime="nodejs";
export async function POST(request:Request) {
  return apiRoute(request,async()=>{
    await readJson(request,passwordLoginSchema);
    throw new SecurityError("HOSTED_IDENTITY_NOT_READY",503);
  });
}

import { apiRoute, json, readJson, getSessionService } from "@/platform/http/context";
import { emptyCommandSchema } from "@/platform/http/contracts";
export const runtime="nodejs";
export async function POST(request:Request) {
  return apiRoute(request,async()=>{
    await readJson(request,emptyCommandSchema);
    return json({signedOut:true},200,{"Set-Cookie":await getSessionService().logout(request.headers.get("cookie"))});
  });
}

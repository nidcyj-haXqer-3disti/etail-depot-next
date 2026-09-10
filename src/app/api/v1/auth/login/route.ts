import { apiRoute, json, readJson, getSessionService } from "@/platform/http/context";
import { passwordLoginSchema } from "@/platform/http/contracts";
import { passwordLogin } from "@/modules/identity/password-login";
export const runtime="nodejs";
export async function POST(request:Request) {
  return apiRoute(request,async()=>{
    const {email,password}=await readJson(request,passwordLoginSchema);
    const cookie=await passwordLogin(email,password,request.headers.get("cookie"),getSessionService());
    return json({authenticated:true},200,{"Set-Cookie":cookie});
  });
}

import { apiRoute, json, readJson, getSessionService } from "@/platform/http/context";
import { fixtureLoginSchema } from "@/platform/http/contracts";
import { getRuntimeConfig } from "@/platform/config";
import { assertFixtureIdentityAllowed } from "@/modules/identity";
import { bindIdentity } from "@/modules/services/service";
export const runtime="nodejs";
export async function POST(request:Request) {
  return apiRoute(request,async()=>{
    const config=getRuntimeConfig();
    assertFixtureIdentityAllowed({...config,fixtureIdentityEnabled:config.localFixtureIdentity});
    const {persona}=await readJson(request,fixtureLoginSchema);
    const identity=await bindIdentity("urn:etail:isolated-fixture",persona,`Fictional ${persona}`);
    // Reauthentication revokes the browser's previous session before issuing another.
    await getSessionService().logout(request.headers.get("cookie"));
    const issued=await getSessionService().issue(identity);
    return json({authenticated:true},200,{"Set-Cookie":issued.cookie});
  });
}

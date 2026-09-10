import { expect, test } from "@playwright/test";
import { sessionOverviewSchema } from "../../src/modules/identity/security-contracts";
const baseURL="http://127.0.0.1:3100";
const headers={Origin:baseURL,"Content-Type":"application/json"};

test("session API scopes sign-ins, rejects foreign origins and revokes the selected other browser",async({request,playwright})=>{
  expect((await request.get("/api/v1/auth/sessions")).status()).toBe(401);
  await request.post("/api/v1/auth/local-fixture",{headers,data:{persona:"owner"}});
  const other=await playwright.request.newContext({baseURL});
  const viewer=await playwright.request.newContext({baseURL});
  try {
    await other.post("/api/v1/auth/local-fixture",{headers,data:{persona:"owner"}});
    await viewer.post("/api/v1/auth/local-fixture",{headers,data:{persona:"viewer"}});
    const read=await other.get("/api/v1/auth/sessions");expect(read.headers()["cache-control"]).toContain("no-store");
    const id=sessionOverviewSchema.parse(await read.json()).sessions.find(item=>item.current)!.id;
    const foreign=sessionOverviewSchema.parse(await (await viewer.get("/api/v1/auth/sessions")).json()).sessions.find(item=>item.current)!.id;
    for(const origin of [undefined,"https://attacker.example"])expect((await request.post("/api/v1/auth/sessions/revoke",{headers:{"Content-Type":"application/json",...(origin?{Origin:origin}:{})},data:{familyIds:[id]}})).status()).toBe(403);
    expect((await request.post("/api/v1/auth/sessions/revoke",{headers,data:{familyIds:[id,foreign]}})).status()).toBe(404);
    expect((await other.get("/api/v1/services")).status()).toBe(200);
    const result=await request.post("/api/v1/auth/sessions/revoke",{headers,data:{familyIds:[id]}});
    expect(result.status()).toBe(200);sessionOverviewSchema.parse(await result.json());
    expect((await other.get("/api/v1/services")).status()).toBe(401);
    expect((await viewer.get("/api/v1/services")).status()).toBe(200);
    expect((await request.get("/api/v1/services")).status()).toBe(200);
  }finally{await other.dispose();await viewer.dispose();}
});

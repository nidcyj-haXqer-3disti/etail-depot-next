import { expect,test } from "@playwright/test";
import { membershipEstimateSchema } from "../../src/modules/membership/contracts";
const input={salesMinor:"10000000",paymentCount:1000,purchasesMinor:"2400000",brandCostPercent:"1.90"};
const headers={Origin:"http://127.0.0.1:3100","Content-Type":"application/json"};
test("membership calculator validates inputs, preserves unknown costs and never changes service state",async({request})=>{
  expect((await request.post("/api/v1/membership/estimate",{headers,data:input})).status()).toBe(401);
  await request.post("/api/v1/auth/local-fixture",{headers,data:{persona:"owner"}});
  const before=await (await request.get("/api/v1/services")).json();
  const response=await request.post("/api/v1/membership/estimate",{headers,data:input});
  expect(response.status()).toBe(200);expect(response.headers()["cache-control"]).toContain("no-store");
  expect(membershipEstimateSchema.parse(await response.json()).difference?.minor).toBe("60000");
  const missing=await request.post("/api/v1/membership/estimate",{headers,data:{...input,brandCostPercent:null}});
  expect(membershipEstimateSchema.parse(await missing.json()).plans[1]?.netAnnualCost).toBeNull();
  expect((await request.post("/api/v1/membership/estimate",{headers,data:{...input,role:"PRIMARY"}})).status()).toBe(422);
  expect((await request.post("/api/v1/membership/estimate",{headers:{...headers,Origin:"https://attacker.example"},data:input})).status()).toBe(403);
  expect(await (await request.get("/api/v1/services")).json()).toEqual(before);
});

import { readFileSync } from "node:fs";
import { expect,it } from "vitest";
import { serviceProjectionSchema, fixtureLoginSchema, generateFoundationOpenApi, emptyCommandSchema } from "../../src/platform/http/contracts";
it("generated OpenAPI exactly matches executable foundation schemas",()=>{
  expect(JSON.parse(readFileSync("contracts/generated/foundation-openapi.json","utf8"))).toEqual(generateFoundationOpenApi());
});
it("commands reject injected role/service fields and fictional authentication is constrained",()=>{
  expect(fixtureLoginSchema.safeParse({persona:"owner",role:"PRIMARY"}).success).toBe(false);
  expect(fixtureLoginSchema.safeParse({persona:"administrator"}).success).toBe(false);
  expect(emptyCommandSchema.safeParse({serviceId:"other"}).success).toBe(false);
});
it("service projections reject plans as service types and numeric fake service IDs",()=>{
  expect(serviceProjectionSchema.safeParse({id:123,type:"PREMIER",role:"PRIMARY",version:1,status:"ACTIVE",displayName:"Invalid",capabilities:[],peopleCount:0}).success).toBe(false);
});

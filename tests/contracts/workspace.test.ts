import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { workspaceOperations, workspaceActivitySchema, notificationPreferencesSchema, cardholderDashboardQuerySchema } from "../../src/modules/workspace/api-contracts";
import { generateFoundationOpenApi } from "../../src/platform/http/contracts";

it("declares every implemented local workspace operation, path identifier and request schema",()=>{
  const api=generateFoundationOpenApi();
  expect(workspaceOperations).toHaveLength(21);
  expect(workspaceOperations).toContainEqual(expect.objectContaining({path:"/api/v1/cardholder-services/{serviceId}/preferences/notifications",method:"get",authenticated:true}));
  for(const operation of workspaceOperations) {
    const sourcePath=`src/app${operation.path.replaceAll(/\{([^}]+)\}/g,"[$1]")}/route.ts`;
    const source=readFileSync(sourcePath,"utf8");
    expect(source).toContain(`export async function ${operation.method.toUpperCase()}`);
    expect(source).toContain("apiRoute");
    const definition=api.paths[operation.path]![operation.method] as {parameters:{in:string;name:string}[];security:unknown[];requestBody?:unknown};
    const expected=[...operation.path.matchAll(/\{([^}]+)\}/g)].map(match=>match[1]);
    expect(definition.parameters.filter(parameter=>parameter.in==="path").map(parameter=>parameter.name)).toEqual(expected);
    expect(definition.security).toEqual([{appSession:[]}]);
    if("request" in operation) expect(definition.requestBody).toBeDefined();
  }
});
it("prevents a saved preference projection from claiming delivery and money from silently changing type",()=>{
  expect(notificationPreferencesSchema.safeParse({serviceActivity:true,cardControls:true,caseUpdates:true,version:1,delivery:"SENT"}).success).toBe(false);
  expect(workspaceActivitySchema.safeParse({id:"x",serviceId:"x",amount:{minor:100,currency:"USD",formatted:"$1.00"}}).success).toBe(false);
});
it("bounds card ownership filters and literal search independently of request filters",()=>{
  expect(cardholderDashboardQuerySchema.parse({cardScope:"MANAGED",cardSearch:"  Name %_  ",page:"2",requestPage:"1",requestStatus:"BLOCKED",requestSearch:"draft"})).toEqual({cardScope:"MANAGED",cardSearch:"Name %_",page:"2",requestPage:"1",requestStatus:"BLOCKED",requestSearch:"draft"});
  for(const query of [{cardScope:"SECONDARY"},{cardScope:["OWN","MANAGED"]},{cardSearch:["one","two"]},{cardSearch:"x".repeat(101)},{page:"01"},{page:"100000"},{holderId:"untrusted"}])expect(cardholderDashboardQuerySchema.safeParse(query).success).toBe(false);
});

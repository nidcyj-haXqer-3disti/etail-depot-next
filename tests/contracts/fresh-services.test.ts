import {expect,it} from "vitest";
import {createCardholderServiceSchema} from "../../src/modules/services/cardholder-contracts";
import {operatorResponseSchema} from "../../src/modules/operations/contracts";
import {operatorCaseSchema,operatorQueueSchema} from "../../src/modules/operations/api-contracts";
import {fixtureLoginSchema,generateFoundationOpenApi} from "../../src/platform/http/contracts";

const id="11111111-1111-4111-8111-111111111111";
it("service enrollment accepts a name and retry key but no browser ownership or kind",()=>{
  expect(createCardholderServiceSchema.parse({commandId:id,displayName:"My cards"})).toEqual({commandId:id,displayName:"My cards"});
  for(const injected of [{kind:"MERCHANT"},{primaryPersonId:id},{permissions:["cards.create"]},{serviceId:id}])expect(createCardholderServiceSchema.safeParse({commandId:id,...injected}).success).toBe(false);
});
it("operator response accepts only the versioned case response and never supplied authority",()=>{
  const input={commandId:id,expectedVersion:1,message:"Here is the next step.",resolve:false};
  expect(operatorResponseSchema.safeParse(input).success).toBe(true);
  for(const injected of [{serviceId:id},{actorId:id},{canRespond:true},{author:"SUPPORT"}])expect(operatorResponseSchema.safeParse({...input,...injected}).success).toBe(false);
  expect(operatorResponseSchema.safeParse({...input,expectedVersion:0}).success).toBe(false);
});
it("operator projections include explicit authors and refuse credentials or undeclared data",()=>{
  const item={id,reference:"CASE-example",subject:"Card question",status:"OPEN",serviceName:"My cards",serviceKind:"CARDHOLDER",customer:"Jamie",updatedAt:"2026-09-10T00:00:00.000Z"};
  expect(operatorQueueSchema.safeParse([item]).success).toBe(true);
  expect(operatorQueueSchema.safeParse(Array.from({length:101},()=>item)).success).toBe(false);
  const detail={id,serviceId:id,reference:"CASE-example",subject:"Card question",status:"OPEN",version:1,serviceName:"My cards",customer:"Jamie",canRespond:true,messages:[{id,body:"Please help.",author:"CUSTOMER",createdAt:"2026-09-10T00:00:00.000Z"}]};
  expect(operatorCaseSchema.safeParse(detail).success).toBe(true);
  expect(operatorCaseSchema.safeParse({...detail,token:"not-a-real-token"}).success).toBe(false);
});
it("declares two explicit enrollment commands and assigned support paths without retired endpoints",()=>{
  const {paths}=generateFoundationOpenApi();
  expect(paths["/api/v1/cardholder-services"]).toHaveProperty("post");
  expect(paths["/api/v1/merchants"]).toHaveProperty("post");
  expect(paths["/api/v1/operations/cases/{caseId}/responses"]).toHaveProperty("post");
  expect(paths["/api/v1/merchants/{merchantId}/gateway"]).toHaveProperty("put");
  expect(Object.keys(paths).some(path=>path.includes("/accounts/")||path.includes("relationship")||path.includes("disputes")||path.includes("/services/{serviceId}/test-gateway"))).toBe(false);
  expect(fixtureLoginSchema.safeParse({persona:"operator"}).success).toBe(true);
});

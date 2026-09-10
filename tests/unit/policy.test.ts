import { describe, expect, it } from "vitest";
import { ACTIONS, evaluate, type PolicyScope } from "../../src/modules/policy/evaluate";
import { getRuntimeConfig } from "../../src/platform/config";
const base:PolicyScope={actorPersonId:"person-a",serviceId:"service-a",resourceServiceId:"service-a",membershipServiceId:"service-a",membershipPersonId:"person-a",membershipState:"ACCEPTED",primaryPersonId:"person-a",primaryMembershipState:"ACCEPTED",role:"PRIMARY",serviceKind:"CARDHOLDER",status:"ACTIVE"};
describe("one deny-by-default policy",()=>{
  it.each(["PRIMARY","SECONDARY"] as const)("%s can read its accepted service summary but cannot spend or issue",role=>{
    expect(evaluate({...base,role},"service.read").allowed).toBe(true);
    for(const action of ["cards.create","spend.authorize","invented.action"]) expect(evaluate({...base,role},action).allowed).toBe(false);
  });
  it.each([{resourceServiceId:"other"},{membershipServiceId:"other"},{membershipPersonId:"other"},{membershipState:"REVOKED"},{status:"CLOSED"}])("rejects scope/lifecycle mismatch %j",change=>{
    for(const action of ACTIONS) expect(evaluate({...base,...change},action).allowed).toBe(false);
  });
  it("service membership remains required independently of service kind",()=>{
    expect(evaluate({...base,serviceKind:"CARDHOLDER",membershipState:"REVOKED"},"service.read").allowed).toBe(false);
    expect(evaluate({...base,serviceKind:"CARDHOLDER"},"service.read").allowed).toBe(true);
  });
  it("only the named primary has cardholder governance",()=>{
    expect(evaluate({...base,role:"SECONDARY",primaryPersonId:"other"},"people.read").allowed).toBe(false);
    expect(evaluate({...base,grants:["people.read"]},"people.read").allowed).toBe(true);
  });
});
describe("runtime gates",()=>{
  it("cannot enable real money",()=>expect(()=>getRuntimeConfig({APP_ENV:"local",ENABLE_REAL_MONEY:"true"})).toThrow("REAL_MONEY_DISABLED"));
  it("cannot enable local fixtures on a deployment",()=>expect(()=>getRuntimeConfig({APP_ENV:"local",NETLIFY:"true",ENABLE_LOCAL_FIXTURE_IDENTITY:"true"})).toThrow("HOSTED_ENVIRONMENT_REQUIRED"));
  it("requires stable new site binding for hosted operation",()=>expect(()=>getRuntimeConfig({APP_ENV:"production",ETAIL_PUBLIC_ORIGIN:"https://new.example"})).toThrow("NEW_SITE_BINDING_REQUIRED"));
  it("hosted login cannot be enabled by flag",()=>expect(getRuntimeConfig({HOSTED_IDENTITY_READY:"true"}).hostedIdentityReady).toBe(false));
});

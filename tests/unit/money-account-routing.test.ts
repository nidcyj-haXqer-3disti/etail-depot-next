import {describe,expect,it} from "vitest";
import {moneyAccountHref,moneyAccountReturn} from "../../src/ui/money-account-routing";

const accountId="10000000-0000-4000-8000-000000000001",reviewId="10000000-0000-4000-8000-000000000002";
const terminalId="10000000-0000-4000-8000-000000000003";

describe("money account return navigation",()=>{
 it("allows no return destination for either independent service",()=>{
  for(const kind of ["CARDHOLDER","MERCHANT"] as const){
   expect(moneyAccountReturn(undefined,kind)).toBeNull();expect(moneyAccountReturn(null,kind)).toBeNull();
  }
 });
 it("preserves a validated terminal investigation without confusing its page with money history",()=>{
  const investigation=`/merchant-services?view=unit%3A${terminalId}&activity=payments&period=custom&from=2026-09-01&to=2026-09-12&q=Order+%26+garden&status=COLLECTED&page=2`;
  expect(moneyAccountReturn(investigation,"MERCHANT")).toBe(investigation);
  const href=moneyAccountHref(accountId,moneyAccountReturn(investigation,"MERCHANT"),{task:"add",review:reviewId,page:"1"});
  const result=new URL(href,"https://etail.invalid");
  expect(result.pathname).toBe(`/money-accounts/${accountId}`);
  expect(result.searchParams.get("task")).toBe("add");expect(result.searchParams.get("review")).toBe(reviewId);expect(result.searchParams.get("page")).toBe("1");
  expect(result.searchParams.get("returnTo")).toBe(investigation);
  expect(new URL(result.searchParams.get("returnTo")!,"https://etail.invalid").searchParams.get("page")).toBe("2");
  expect(result.searchParams.getAll("returnTo")).toHaveLength(1);
 });
 it.each([
  "", "https://example.test/merchant-services", "//example.test/merchant-services", "javascript:alert(1)",
  "/cardholder-services", "/services", "/merchant-services-other", "/merchant-services/../services",
  "/merchant-services#private", "/merchant-services?returnTo=%2Fservices", "/merchant-services?unknown=1",
  "/merchant-services?activity=unknown", "/merchant-services?activity=payments&activity=refunds",
  "/merchant-services?page=0", "/merchant-services?period=custom&from=2026-02-30",
  "/merchant-services?view=unit:wrong", "/merchant-services?q=hidden%0Atext",
 ])("rejects an unsafe or malformed merchant return %s",value=>{
  expect(()=>moneyAccountReturn(value,"MERCHANT")).toThrow("INVALID_MONEY_RETURN");
 });
 it("rejects duplicate page parameters and cross-service returns",()=>{
  expect(()=>moneyAccountReturn(["/merchant-services","/merchant-services"],"MERCHANT")).toThrow("INVALID_MONEY_RETURN");
  expect(()=>moneyAccountReturn("/merchant-services?page=1&page=2","MERCHANT")).toThrow("INVALID_MONEY_RETURN");
  expect(()=>moneyAccountReturn("/merchant-services","CARDHOLDER")).toThrow("INVALID_MONEY_RETURN");
  expect(()=>moneyAccountReturn("/cardholder-services","CARDHOLDER")).toThrow("INVALID_MONEY_RETURN");
 });
 it("leaves card money routes free of merchant context",()=>{
  expect(moneyAccountHref(accountId)).toBe(`/money-accounts/${accountId}`);
  expect(moneyAccountHref(accountId,null,{task:"withdraw"})).toBe(`/money-accounts/${accountId}?task=withdraw`);
 });
});

import {describe,expect,it} from "vitest";
import customerRedirect from "../../netlify/edge-functions/customer-redirect";

const origin="https://etail-depot-next.netlify.app";
const card="10000000-0000-4000-8000-000000000001";
const terminal="10000000-0000-4000-8000-000000000002";
const record="10000000-0000-4000-8000-000000000003";
const account="10000000-0000-4000-8000-000000000004";
function request(path:string,init?:RequestInit){return new Request(origin+path,init);}

describe("customer bookmark edge redirects",()=>{
 it.each([
  [`/cardholder-services?view=cards&focus=${card}`,`/cardholder-services/cards/${card}`],
  [`/cardholder-services/cards/${card}?view=cards&focus=${card}`,`/cardholder-services/cards/${card}`],
  [`/merchants/${terminal}?tab=channels&channel=${record}`,`/merchant-services/terminals/${terminal}/channels/${record}`],
 ])("redirects %s once and passes its clean second hop to the page",(legacy,canonical)=>{
  const incoming=request(legacy),first=customerRedirect(incoming);
  expect(first).toBeInstanceOf(Response);expect(first!.status).toBe(307);
  expect(first!.headers.get("location")).toBe(origin+canonical);
  const secondRequest=new Request(first!.headers.get("location")!);
  expect(secondRequest.method).toBe("GET");
  expect(customerRedirect(secondRequest)).toBeUndefined();
  expect(incoming.url).toBe(origin+legacy);
 });

 it.each([
  "/cardholder-services",
  "/cardholder-services/cards",
  `/cardholder-services/cards/${card}/invite`,
  `/merchant-services/terminals/${terminal}`,
  `/merchant-services/terminals/${terminal}/channels/${record}`,
  `/merchant-services/terminals/${terminal}/payments?payment=${record}`,
  `/money-accounts/${account}/withdraw?review=${record}&history=payouts`,
 ])("does not redirect an already clean request %s",path=>{
  expect(customerRedirect(request(path))).toBeUndefined();
 });

 it("preserves the RSC request key while removing old page selectors",()=>{
  const first=customerRedirect(request(`/cardholder-services?view=cards&focus=${card}&_rsc=fixture`,{headers:{RSC:"1","Next-Router-Prefetch":"1"}}))!;
  expect(first.headers.get("location")).toBe(`${origin}/cardholder-services/cards/${card}?_rsc=fixture`);
  expect(customerRedirect(new Request(first.headers.get("location")!,{headers:{RSC:"1"}}))).toBeUndefined();
 });

 it("preserves the exact terminal receipt and its return investigation through both hops",()=>{
  const back=`/merchant-services?view=unit%3A${terminal}&activity=refunds&period=all&page=3`;
  const query=new URLSearchParams({tab:"payments",payment:record,paymentSearch:"Garden & kitchen",returnTo:back});
  const first=customerRedirect(request(`/merchants/${terminal}?${query}`))!;
  const expectedQuery=new URLSearchParams({payment:record,paymentSearch:"Garden & kitchen",returnTo:back});
  expect(first.status).toBe(307);
  expect(first.headers.get("location")).toBe(`${origin}/merchant-services/terminals/${terminal}/payments?${expectedQuery}`);
  const destination=new URL(first.headers.get("location")!);
  expect(destination.searchParams.getAll("payment")).toEqual([record]);
  expect(destination.searchParams.get("returnTo")).toBe(back);
  expect(destination.searchParams.has("tab")).toBe(false);
  expect(customerRedirect(new Request(destination))).toBeUndefined();
 });

 it("preserves a saved money review, history page and exact return destination",()=>{
  const back=`/merchant-services/terminals?view=unit%3A${terminal}&terminalUse=others`;
  const incoming=new URLSearchParams({task:"withdraw",review:record,history:"balance",page:"2",returnTo:back});
  const first=customerRedirect(request(`/money-accounts/${account}?${incoming}`))!;
  const expected=new URLSearchParams({review:record,history:"balance",page:"2",returnTo:back});
  expect(first.status).toBe(307);
  expect(first.headers.get("location")).toBe(`${origin}/money-accounts/${account}/withdraw?${expected}`);
  const target=new URL(first.headers.get("location")!);
  expect(target.searchParams.get("review")).toBe(record);
  expect(target.searchParams.get("returnTo")).toBe(back);
  expect(target.searchParams.has("task")).toBe(false);
  expect(customerRedirect(new Request(target))).toBeUndefined();
 });

 it.each([
  ["/cardholder-services?view=overview","/cardholder-services"],
  ["/merchant-services?section=overview&activity=payments&period=all","/merchant-services"],
  ["/merchant-services?section=funds&activity=payments&period=all","/merchant-services"],
 ])("cleans redundant same-path overview selectors without redirecting again",(legacy,clean)=>{
  const response=customerRedirect(request(legacy))!;
  expect(response.status).toBe(307);expect(response.headers.get("location")).toBe(origin+clean);
  expect(new URL(response.headers.get("location")!).pathname).toBe(new URL(origin+legacy).pathname);
  expect(customerRedirect(new Request(response.headers.get("location")!))).toBeUndefined();
 });

 it.each([
  `/cardholder-services?focus=${card}&focus=${card}`,
  `/cardholder-services?view=cards&view=activity`,
  `/cardholder-services/cards/${card}?focus=${record}`,
  `/merchant-services/terminals/${terminal}/channels/${record}?channel=${card}`,
  `/merchants/${terminal}?tab=channels&channel=${record}&channel=${record}`,
  `/merchant-services/terminals/${terminal}/payments?tab=people`,
  `/money-accounts/${account}/withdraw?task=add&review=${record}`,
  `/money-accounts/${account}?task=withdraw&review=${record}&review=${record}`,
 ])("leaves duplicate or conflicting selectors for the page to reject: %s",path=>{
  const incoming=request(path);
  expect(customerRedirect(incoming)).toBeUndefined();
  expect(incoming.url).toBe(origin+path);
 });

 it.each(["POST","PUT","PATCH","DELETE","OPTIONS"])("does not consume or redirect a %s request",async method=>{
  const incoming=request(`/cardholder-services?view=cards`,{method,body:"unchanged command body",headers:{"Content-Type":"text/plain"}});
  expect(customerRedirect(incoming)).toBeUndefined();
  expect(incoming.bodyUsed).toBe(false);
  expect(await incoming.text()).toBe("unchanged command body");
 });

 it.each(["GET","HEAD"])("returns an empty private %s redirect without cookies or reflected request data",async method=>{
  const incoming=request(`/cardholder-services?view=cards`,{method,headers:{Cookie:"fixture-session=private",Authorization:"Bearer fixture-only","X-Private-Context":"not-for-response"}});
  const response=customerRedirect(incoming)!;
  expect(response.status).toBe(307);expect(response.body).toBeNull();expect(await response.text()).toBe("");
  expect(Object.fromEntries(response.headers)).toEqual({
   "cache-control":"private, no-store",
   location:origin+"/cardholder-services/cards",
   "referrer-policy":"no-referrer",
   "x-content-type-options":"nosniff",
  });
  expect(response.headers.has("set-cookie")).toBe(false);
  expect(response.headers.has("authorization")).toBe(false);
  expect(customerRedirect(new Request(response.headers.get("location")!,{method}))).toBeUndefined();
 });

 it.each([
  "/login?view=cards",
  "/api/v1/cardholder-services?view=cards",
  "/cardholder-services/not-a-route",
  "/cardholder-services/%63ards",
  "/merchant-services/terminals/not-a-terminal",
  "/https://outside.example/cardholder-services?view=cards",
  "//outside.example/cardholder-services?view=cards",
  "/cardholder-services?focus=https%3A%2F%2Foutside.example",
  "/money-accounts/not-an-account?task=withdraw",
 ])("does not invent a redirect for an invalid or external-looking path: %s",path=>{
  expect(customerRedirect(request(path))).toBeUndefined();
 });
});

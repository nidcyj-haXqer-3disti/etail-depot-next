import {randomUUID} from "node:crypto";
import {describe,expect,it} from "vitest";
import {activityRange,merchantActivityHref,merchantActivityReturn,parseMerchantActivityApiQuery,parseMerchantActivityQuery,type MerchantActivityRow} from "../../src/modules/acquiring/activity-contracts";
import {projectMerchantActivity,merchantActivityCsv} from "../../src/modules/acquiring/activity-service";
import type {MerchantDashboardView} from "../../src/modules/acquiring/dashboard-contracts";

const money=(minor:string)=>({minor,currency:"USD" as const,formatted:`$${(Number(minor)/100).toFixed(2)}`});
const unit=randomUUID(),foreign=randomUUID(),now=new Date("2026-09-11T12:00:00Z");
const view:MerchantDashboardView={id:`merchant:${randomUUID()}`,name:"Primary network",description:"",unitIds:[unit],totals:{collected:money("5000"),refunded:money("5000"),transferred:money("0"),available:money("0"),settled:money("0"),pending:money("0"),bank:money("0"),channelCount:1,activeChannelCount:0},payments:[],transfers:[],paymentsHasMore:false,transfersHasMore:false};
function row(patch:Partial<Omit<MerchantActivityRow,"href">>={}):Omit<MerchantActivityRow,"href"> {const id=randomUUID();return {id,kind:"payment",merchantId:unit,merchantName:"Market",description:"Order",amount:money("5000"),status:"REFUNDED",reference:"test-payment",at:"2026-09-06T23:59:59.000Z",paymentId:id,paymentReference:"test-payment",...patch};}

describe("merchant activity filters and projections",()=>{
 it("separates account home from saved payment investigations and preserves filters across account destinations",()=>{
  expect(parseMerchantActivityQuery().section).toBe("overview");
  expect(parseMerchantActivityQuery({view:view.id}).section).toBe("overview");
  for(const input of [{activity:"refunds"},{q:"saved reference"},{period:"last7"},{page:"2"}])expect(parseMerchantActivityQuery(input).section).toBe("activity");
  const original=parseMerchantActivityQuery({view:view.id,activity:"refunds",q:"saved reference",period:"last30",page:"2"});
  for(const section of ["overview","channels","merchants","funds","settings","activity"] as const){
   const href=merchantActivityHref(original,{section});
   expect(parseMerchantActivityQuery(new URL(href,"https://etail.invalid").searchParams)).toEqual({...original,section});
   expect(merchantActivityReturn(href)).toBe(href);
  }
 });
 it("keeps payment and later refund dates separate and generates exact scoped return links",()=>{
  const payment=row(),refund=row({kind:"refund",status:"COMPLETED",at:"2026-09-08T00:00:00.000Z",paymentId:payment.id,reference:"test-refund"});
  const query=parseMerchantActivityQuery({view:view.id,period:"custom",from:"2026-08-31",to:"2026-09-06",q:"test-payment"});
  const result=projectMerchantActivity(query,view,[payment,refund,row({merchantId:foreign,amount:money("990000")})],now);
  expect(result.periodTotals).toMatchObject({collected:{minor:"5000"},refunded:{minor:"0"}});
  expect(result.rows).toHaveLength(1);expect(result.totalCount).toBe(1);
  const detail=new URL(result.rows[0].href,"https://etail.invalid");
  expect(detail.pathname).toBe(`/merchants/${unit}`);expect(detail.searchParams.get("payment")).toBe(payment.id);
  expect(detail.searchParams.get("returnTo")).toBe(merchantActivityHref(query));
  expect(view.totals.available?.minor).toBe("0");
  expect(projectMerchantActivity({...query,activity:"refunds",from:"2026-09-08",to:"2026-09-08"},view,[payment,refund],now).rows[0].id).toBe(refund.id);
 });
 it("paginates tied timestamps deterministically and exports the full filtered selection safely",()=>{
  const records=Array.from({length:31},()=>row({description:'=HYPERLINK("example")',status:"APPROVED"}));
  const query=parseMerchantActivityQuery({view:view.id});
  const first=projectMerchantActivity(query,view,records,now),second=projectMerchantActivity({...query,page:2},view,records,now);
  expect(first.rows).toHaveLength(25);expect(second.rows).toHaveLength(6);expect(new Set([...first.rows,...second.rows].map(item=>item.id)).size).toBe(31);
  expect(projectMerchantActivity({...query,page:99},view,records,now).rows).toEqual([]);
  const exported=projectMerchantActivity({...query,page:2},view,records,now,true);
  expect(exported.rows).toHaveLength(31);expect(merchantActivityCsv(exported).split("\r\n")).toHaveLength(33);
  expect(merchantActivityCsv(exported)).toContain('"\'=HYPERLINK(""example"")"');
 });
 it("never turns missing scope or missing payment authority into a combined financial total/export",()=>{
  const query=parseMerchantActivityQuery();
  expect(projectMerchantActivity(query,undefined,[row()],now)).toMatchObject({available:false,rows:[],totalCount:0,periodTotals:{collected:null,refunded:null,transferred:null}});
  expect(()=>projectMerchantActivity(query,undefined,[row()],now,true)).toThrow("MERCHANT_ACTIVITY_UNAVAILABLE");
  expect(()=>projectMerchantActivity(query,{...view,totals:{...view.totals,collected:null}},[],now,true)).toThrow("MERCHANT_ACTIVITY_UNAVAILABLE");
 });
 it("checks strict calendar dates, duplicate fields and local-only return destinations",()=>{
  for(const raw of [{from:"2026-02-30"},{period:"custom"},{from:"2026-09-11",to:"2026-09-10"},{page:"0"},{view:"merchant:wrong"},new URLSearchParams("view=all&view=all")])expect(()=>parseMerchantActivityQuery(raw)).toThrow("INVALID_ACTIVITY_FILTER");
  expect(merchantActivityReturn("https://example.test/merchant-services")).toBeNull();
  expect(merchantActivityReturn("//example.test/merchant-services")).toBeNull();
  expect(merchantActivityReturn("/merchant-services-other")).toBeNull();
  expect(merchantActivityReturn("/merchant-services?returnTo=https://example.test")).toBeNull();
  expect(merchantActivityReturn("/merchant-services?activity=payments#hidden")).toBeNull();
  expect(merchantActivityReturn("/merchant-services?activity=payments&activity=refunds")).toBeNull();
  expect(merchantActivityReturn("/merchant-services?activity=refunds&page=2")).toContain("activity=refunds");
  expect(activityRange(parseMerchantActivityQuery({period:"lastMonth"}),now)).toEqual({from:"2026-08-01",to:"2026-08-31"});
  expect(activityRange(parseMerchantActivityQuery({period:"last7"}),now)).toEqual({from:"2026-09-05",to:"2026-09-11"});
 });
 it("rejects unknown API filters and duplicate format/filter keys without rejecting page-owned parameters",()=>{
  for(const raw of ["unknown=1","returnTo=%2Fservices","format=json","format=csv&format=csv","page=1&page=2","activity=payments&activity=payments"])
   expect(()=>parseMerchantActivityApiQuery(new URLSearchParams(raw))).toThrow("INVALID_ACTIVITY_FILTER");
  const parsed=parseMerchantActivityApiQuery(new URLSearchParams("activity=refunds&format=csv&page=2"));
  expect(parsed.exporting).toBe(true);expect(parsed.filters.has("format")).toBe(false);
  expect(parseMerchantActivityQuery(parsed.filters)).toMatchObject({activity:"refunds",page:2});
  expect(parseMerchantActivityQuery({_rsc:"framework",page:"2"}).page).toBe(2);
 });
});

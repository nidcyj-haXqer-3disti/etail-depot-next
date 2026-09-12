import { SecurityError } from "../../platform/security/origin";
import { formatMoney } from "../workspace/service";
import type { MerchantDashboardView } from "./dashboard-contracts";
import { ACTIVITY_EXPORT_LIMIT, ACTIVITY_PAGE_SIZE, activityRange, merchantActivityHref, type MerchantActivityProjection, type MerchantActivityQuery, type MerchantActivityRow } from "./activity-contracts";

/** Input records have already passed the same transaction's per-unit payment read policy. */
export function projectMerchantActivity(query:MerchantActivityQuery, view:MerchantDashboardView|undefined, records:Omit<MerchantActivityRow,"href">[], now:Date, exporting=false):MerchantActivityProjection {
  const range=activityRange(query,now), completeScope=!!view&&view.totals.collected!==null;
  const scoped=records.filter(row=>view?.unitIds.includes(row.merchantId));
  const inPeriod=scoped.filter(row=>(!range.from||row.at.slice(0,10)>=range.from)&&(!range.to||row.at.slice(0,10)<=range.to));
  const total=(kind:MerchantActivityRow["kind"])=>completeScope?formatMoney(inPeriod.filter(row=>row.kind===kind&&(kind!=="transfer"||row.status==="COMPLETED")&&row.status!=="DECLINED").reduce((amount,row)=>amount+BigInt(row.amount.minor),0n)):null;
  const search=query.q.toLocaleLowerCase("en-US");
  const matching=inPeriod.filter(row=>`${row.kind}s`===query.activity&&(query.status==="ALL"||query.status==="COLLECTED"?query.status!=="COLLECTED"||row.status!=="DECLINED":row.status===query.status)&&(!search||[row.id,row.description,row.reference,row.paymentReference??"",row.merchantName].some(value=>value.toLocaleLowerCase("en-US").includes(search)))).sort((a,b)=>b.at.localeCompare(a.at)||a.id.localeCompare(b.id));
  if(exporting&&(!view||!completeScope))throw new SecurityError("MERCHANT_ACTIVITY_UNAVAILABLE",403);
  if(exporting&&matching.length>ACTIVITY_EXPORT_LIMIT)throw new SecurityError("EXPORT_RANGE_TOO_LARGE",422);
  const pageCount=Math.max(1,Math.ceil(matching.length/ACTIVITY_PAGE_SIZE));
  // Keep a requested out-of-range page visible and empty; never silently show a different page.
  const page=exporting?matching:matching.slice((query.page-1)*ACTIVITY_PAGE_SIZE,query.page*ACTIVITY_PAGE_SIZE);
  const returnTo=merchantActivityHref(query);
  return {query,range,asOf:now.toISOString(),available:!!view,completeScope,rows:page.map(row=>({...row,href:`/merchants/${row.merchantId}?${new URLSearchParams({tab:"payments",...(row.kind==="transfer"?{activity:"transfers",transfer:row.id}:{payment:row.paymentId!}),returnTo})}`})),totalCount:matching.length,pageCount,pageSize:ACTIVITY_PAGE_SIZE,periodTotals:{collected:total("payment"),refunded:total("refund"),transferred:total("transfer")}};
}

function csvCell(value:string){return `"${(/^[\s]*[=+@\-]/.test(value)?"'":"")+value.replaceAll('"','""')}"`;}
export function merchantActivityCsv(activity:MerchantActivityProjection):string {
  const heading=["Record type","Record ID","Merchant","Date (UTC)","Description","Status","Amount (USD)","Reference","Original payment reference"];
  const rows=activity.rows.map(row=>[row.kind,row.id,row.merchantName,row.at,row.description,row.status,`${BigInt(row.amount.minor)/100n}.${(BigInt(row.amount.minor)%100n).toString().padStart(2,"0")}`,row.reference,row.paymentReference??""]);
  return [heading,...rows].map(row=>row.map(csvCell).join(",")).join("\r\n")+"\r\n";
}

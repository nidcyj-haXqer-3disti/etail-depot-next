import {activityRange,merchantActivityHref,ACTIVITY_PAGE_SIZE,type MerchantActivityQuery} from "../../shared/merchant-activity";
import {formatMoney} from "../workspace/service";
import type {JournalKind,LedgerBucket} from "../ledger/contracts";
import type {MerchantStatementProjection,MerchantStatementRow} from "./statement-contracts";

export const MERCHANT_POSITION_BUCKETS:LedgerBucket[]=["MERCHANT_CAPTURE_PENDING","MERCHANT_AVAILABLE","MERCHANT_SETTLED","MERCHANT_REFUND_PENDING","MERCHANT_PAYOUT_PENDING","PAYOUT_CLEARING","MONEY_AVAILABLE","MONEY_WITHDRAWAL_PENDING"];
// These journals move already-owned money between positions. A terminal-only
// projection must not misclassify their account-side leg as new money in/out.
const internal=new Set<JournalKind>(["NETWORK_AVAILABLE","MERCHANT_SETTLEMENT","DEPOSIT_RESERVE","DEPOSIT_RELEASE","MERCHANT_PAYOUT","MONEY_CUTOVER","MONEY_WITHDRAWAL_RESERVE","MONEY_WITHDRAWAL_RELEASE","NETWORK_REFUND_RESERVE","NETWORK_REFUND_RELEASE"]);
const labels:Partial<Record<JournalKind,[MerchantStatementRow["kind"],string]>>={
 MERCHANT_PAYMENT:["payment","Payment received"],NETWORK_CAPTURE:["payment","Payment received"],NETWORK_AVAILABLE:["settlement","Payment funds available"],
 MERCHANT_REFUND:["refund","Payment refunded"],NETWORK_REFUND_RESERVE:["refund","Refund requested"],NETWORK_REFUND_COMPLETE:["refund","Refund completed"],NETWORK_REFUND_RELEASE:["refund","Refund failed · money released"],
 MERCHANT_SETTLEMENT:["settlement","Payments settled"],DEPOSIT_RESERVE:["settlement","Settlement requested"],DEPOSIT_RELEASE:["settlement","Settlement returned"],MERCHANT_PAYOUT:["settlement","Settlement completed"],
 MONEY_FUNDING:["funding","Money added"],MONEY_CUTOVER:["transfer","Balance transferred"],MONEY_WITHDRAWAL_RESERVE:["payout","Payout requested"],MONEY_WITHDRAWAL_COMPLETE:["payout","Payout completed"],MONEY_WITHDRAWAL_RELEASE:["payout","Payout failed · money released"],
};
export interface StatementJournal {id:string;kind:JournalKind;referenceId:string;createdAt:Date;lines:{bucket:LedgerBucket;deltaMinor:bigint;terminalId:string|null}[]}
export interface StatementRecordContext {description?:string;reference?:string;terminalId:string|null;terminalName:string|null;businessName:string;href:string|null;status?:MerchantStatementRow["status"]}
export function statementJournalRow(journal:StatementJournal,context:StatementRecordContext):MerchantStatementRow {
 const [kind,label]=labels[journal.kind]??["transfer","Money movement"];
 let net=internal.has(journal.kind)?0n:journal.lines.reduce((sum,line)=>sum+(MERCHANT_POSITION_BUCKETS.includes(line.bucket)?line.deltaMinor:0n),0n);
 // A refund may debit the owner's shared available position. A terminal user
 // sees only its exact gateway counter-entry, never that private account leg.
 if(net===0n&&["MERCHANT_PAYMENT","MERCHANT_REFUND","NETWORK_CAPTURE","NETWORK_REFUND_COMPLETE"].includes(journal.kind))net=-journal.lines.reduce((sum,line)=>sum+(line.bucket==="GATEWAY_CLEARING"?line.deltaMinor:0n),0n);
 const movement=journal.lines.reduce((max,line)=>{const absolute=line.deltaMinor<0n?-line.deltaMinor:line.deltaMinor;return absolute>max?absolute:max;},0n);
 const pending=["NETWORK_CAPTURE","DEPOSIT_RESERVE","MONEY_WITHDRAWAL_RESERVE","NETWORK_REFUND_RESERVE"].includes(journal.kind);
 const failed=["DEPOSIT_RELEASE","MONEY_WITHDRAWAL_RELEASE","NETWORK_REFUND_RELEASE"].includes(journal.kind);
 return {id:journal.id,journalId:journal.id,reference:context.reference??journal.referenceId,at:journal.createdAt.toISOString(),kind,description:context.description?`${label} · ${context.description}`:label,status:context.status??(failed?"FAILED":pending?"PENDING":"COMPLETED"),effect:net>0n?"CREDIT":net<0n?"DEBIT":"INTERNAL",amount:formatMoney(movement),credit:net>0n?formatMoney(net):null,debit:net<0n?formatMoney(-net):null,terminalId:context.terminalId,terminalName:context.terminalName,businessName:context.businessName,href:context.href};
}
export function projectMerchantStatement(query:MerchantActivityQuery,scope:{name:string;available:boolean;completeScope:boolean;includesAccountMovements:boolean},records:MerchantStatementRow[],now:Date):MerchantStatementProjection {
 const range=activityRange(query,now),search=query.q.toLocaleLowerCase("en-US");
 const filtered=records.filter(row=>(!range.from||row.at.slice(0,10)>=range.from)&&(!range.to||row.at.slice(0,10)<=range.to)&&(!search||[row.description,row.reference,row.terminalName??"",row.businessName].some(value=>value.toLocaleLowerCase("en-US").includes(search)))&&
  (query.section!=="activity"||(query.activity==="payments"?row.kind==="payment":query.activity==="refunds"?row.kind==="refund":["payout","settlement","transfer"].includes(row.kind)))&&
  (query.status==="ALL"||query.status==="COLLECTED"?query.status!=="COLLECTED"||row.status!=="DECLINED":query.status==="DECLINED"?row.status==="DECLINED":query.status==="REFUNDED"?row.kind==="refund"||row.status==="REFUNDED":row.kind==="payment"&&row.status==="COMPLETED"))
  .sort((a,b)=>b.at.localeCompare(a.at)||a.id.localeCompare(b.id));
 const total=(key:"credit"|"debit")=>formatMoney(filtered.reduce((sum,row)=>sum+BigInt(row[key]?.minor??"0"),0n));
 // Totals cover this exact filtered statement, never just the current page and
 // never an inferred opening/closing or spendable account balance.
 return {...scope,query,range,asOf:now.toISOString(),rows:filtered.slice((query.page-1)*ACTIVITY_PAGE_SIZE,query.page*ACTIVITY_PAGE_SIZE),totalCount:filtered.length,pageSize:ACTIVITY_PAGE_SIZE,pageCount:Math.max(1,Math.ceil(filtered.length/ACTIVITY_PAGE_SIZE)),totals:scope.completeScope?[{currency:"USD",credit:total("credit"),debit:total("debit")}]:[]};
}
export function statementReturn(query:MerchantActivityQuery){return merchantActivityHref(query);}

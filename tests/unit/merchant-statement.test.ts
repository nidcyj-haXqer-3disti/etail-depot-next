import {randomUUID} from "node:crypto";
import {describe,it,expect} from "vitest";
import {merchantActivityHref,parseMerchantActivityFilters} from "../../src/shared/merchant-activity";
import {merchantStatementProjectionSchema} from "../../src/modules/acquiring/statement-contracts";
import {projectMerchantStatement,statementJournalRow,type StatementJournal} from "../../src/modules/acquiring/statement-projection";

const terminalId=randomUUID(),context={terminalId,terminalName:"Market",businessName:"Flowers",href:null};
const now=new Date("2026-09-14T12:00:00Z"),scope={name:"Flowers",available:true,completeScope:true,includesAccountMovements:true};
function journal(kind:StatementJournal["kind"],lines:[StatementJournal["lines"][number]["bucket"],bigint][],date=now):StatementJournal{return {id:randomUUID(),kind,referenceId:randomUUID(),createdAt:date,lines:lines.map(([bucket,deltaMinor])=>({bucket,deltaMinor,terminalId}))};}
function row(kind:StatementJournal["kind"],lines:[StatementJournal["lines"][number]["bucket"],bigint][],date=now){return statementJournalRow(journal(kind,lines,date),context);}

describe("merchant statement accounting projection",()=>{
 it("searches the displayed receipt reference while retaining journal identity and fallback references",()=>{
  const saved=journal("MERCHANT_PAYMENT",[["MERCHANT_AVAILABLE",250n]]),receipt=statementJournalRow(saved,{...context,reference:"RECEIPT-250",href:`/merchants/${terminalId}?payment=${saved.referenceId}`});
  expect(receipt).toMatchObject({id:saved.id,journalId:saved.id,reference:"RECEIPT-250"});
  const result=projectMerchantStatement(parseMerchantActivityFilters({section:"overview",q:"receipt-250"}),scope,[receipt],now);
  expect(result.rows).toEqual([receipt]);expect(result.totals[0].credit.minor).toBe("250");
  expect(statementJournalRow(saved,context).reference).toBe(saved.referenceId);
 });
 it("credits a network payment once through availability, settlement, payout reservation and completion",()=>{
  const records=[row("NETWORK_CAPTURE",[["GATEWAY_CLEARING",-1250n],["MERCHANT_CAPTURE_PENDING",1250n]]),row("NETWORK_AVAILABLE",[["MERCHANT_CAPTURE_PENDING",-1250n],["MERCHANT_AVAILABLE",1250n]]),row("MERCHANT_SETTLEMENT",[["MERCHANT_AVAILABLE",-1250n],["MONEY_AVAILABLE",1250n]]),row("MONEY_WITHDRAWAL_RESERVE",[["MONEY_AVAILABLE",-1000n],["MONEY_WITHDRAWAL_PENDING",1000n]]),row("MONEY_WITHDRAWAL_COMPLETE",[["MONEY_WITHDRAWAL_PENDING",-1000n],["MONEY_WITHDRAWN",1000n]])];
  const result=projectMerchantStatement(parseMerchantActivityFilters(),scope,records,now);
  expect(result.totals[0]).toMatchObject({credit:{minor:"1250"},debit:{minor:"1000"}});expect(result.rows.filter(row=>row.effect==="INTERNAL")).toHaveLength(3);
  expect(merchantStatementProjectionSchema.safeParse(result).success).toBe(true);expect(result).not.toHaveProperty("balance");
 });
 it("never credits a failed payout release as new money",()=>{
  const result=projectMerchantStatement(parseMerchantActivityFilters(),scope,[row("MONEY_WITHDRAWAL_RESERVE",[["MONEY_AVAILABLE",-900n],["MONEY_WITHDRAWAL_PENDING",900n]]),row("MONEY_WITHDRAWAL_RELEASE",[["MONEY_WITHDRAWAL_PENDING",-900n],["MONEY_AVAILABLE",900n]])],now);
  expect(result.totals[0]).toMatchObject({credit:{minor:"0"},debit:{minor:"0"}});expect(result.rows.find(row=>row.status==="FAILED")?.effect).toBe("INTERNAL");
 });
 it.each(["MERCHANT_AVAILABLE","MONEY_AVAILABLE"] as const)("refunds from %s debit once after the pending reservation",bucket=>{
  const result=projectMerchantStatement(parseMerchantActivityFilters(),scope,[row("NETWORK_REFUND_RESERVE",[[bucket,-700n],["MERCHANT_REFUND_PENDING",700n]]),row("NETWORK_REFUND_COMPLETE",[["MERCHANT_REFUND_PENDING",-700n],["GATEWAY_CLEARING",700n]])],now);
  expect(result.totals[0]).toMatchObject({credit:{minor:"0"},debit:{minor:"700"}});
 });
 it("shows a terminal refund from the exact clearing counter-entry without exposing shared money",()=>{
  expect(row("MERCHANT_REFUND",[["GATEWAY_CLEARING",750n]])).toMatchObject({debit:{minor:"750"},credit:null,effect:"DEBIT"});
  expect(row("MERCHANT_SETTLEMENT",[["MERCHANT_AVAILABLE",-750n]])).toMatchObject({debit:null,credit:null,effect:"INTERNAL"});
 });
 it("keeps historical settlement clearing and cutover internal",()=>{
  const result=projectMerchantStatement(parseMerchantActivityFilters(),scope,[row("MERCHANT_PAYOUT",[["MERCHANT_PAYOUT_PENDING",-500n],["PAYOUT_CLEARING",500n]]),row("MONEY_CUTOVER",[["PAYOUT_CLEARING",-500n],["MONEY_AVAILABLE",500n]])],now);
  expect(result.totals[0]).toMatchObject({credit:{minor:"0"},debit:{minor:"0"}});
 });
 it("totals the exact filtered statement before pagination with integer precision",()=>{
  const records=Array.from({length:26},()=>row("MERCHANT_PAYMENT",[["GATEWAY_CLEARING",-999999999999n],["MERCHANT_AVAILABLE",999999999999n]]));
  records.push(row("MERCHANT_PAYMENT",[["MERCHANT_AVAILABLE",123n]],new Date("2026-08-01T00:00:00Z")));
  const query=parseMerchantActivityFilters({section:"overview",period:"custom",from:"2026-09-01",to:"2026-09-30",page:"2"});
  const result=projectMerchantStatement(query,scope,records,now);expect(result.rows).toHaveLength(1);expect(result.totalCount).toBe(26);expect(result.totals[0].credit.minor).toBe("25999999999974");
  expect(projectMerchantStatement({...query,page:3},scope,records,now).rows).toEqual([]);
  expect(projectMerchantStatement({...query,q:"absent"},scope,records,now).totals[0].credit.minor).toBe("0");
 });
 it("withholds totals for incomplete authorized scope and retains legacy refund investigation",()=>{
  const records=[row("MERCHANT_PAYMENT",[["MERCHANT_AVAILABLE",100n]]),row("MERCHANT_REFUND",[["MERCHANT_AVAILABLE",-100n]])];
  const result=projectMerchantStatement(parseMerchantActivityFilters({activity:"refunds"}),{...scope,completeScope:false},records,now);
  expect(result.rows).toHaveLength(1);expect(result.rows[0].kind).toBe("refund");expect(result.totals).toEqual([]);
 });
 it("restores the full statement without changing terminal scope when investigation filters are cleared",()=>{
  const records=[{...row("MERCHANT_PAYMENT",[["MERCHANT_AVAILABLE",100n]]),status:"REFUNDED" as const},row("MERCHANT_REFUND",[["MERCHANT_AVAILABLE",-100n]]),row("MONEY_WITHDRAWAL_COMPLETE",[["MONEY_WITHDRAWAL_PENDING",-50n],["MONEY_WITHDRAWN",50n]])];
  const query=parseMerchantActivityFilters({view:`unit:${terminalId}`,activity:"payments",status:"REFUNDED"});
  const filtered=projectMerchantStatement(query,scope,records,now);
  expect(filtered.rows).toHaveLength(1);expect(filtered.totals[0]).toMatchObject({credit:{minor:"100"},debit:{minor:"0"}});
  const clearHref=merchantActivityHref(query,{section:"overview",activity:"payments",status:"ALL",q:"",period:"all",from:"",to:"",page:1});
  const cleared=parseMerchantActivityFilters(new URL(clearHref,"https://etail.invalid").searchParams);
  expect(cleared.view).toBe(query.view);expect(cleared.section).toBe("overview");
  const full=projectMerchantStatement(cleared,scope,records,now);
  expect(full.rows).toHaveLength(3);expect(full.totals[0]).toMatchObject({credit:{minor:"100"},debit:{minor:"150"}});
 });
});

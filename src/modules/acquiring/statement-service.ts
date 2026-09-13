import {customerHref} from "../../shared/customer-routes";
import {and,eq,inArray,or} from "drizzle-orm";
import {getDb} from "../../platform/database/client";
import {evaluate} from "../policy/evaluate";
import {getServiceMoneyAccount} from "../money/service";
import {moneyFundingIntents,moneyTopups,moneyWithdrawalIntents,moneyWithdrawals,moneyWithdrawalEvents} from "../money/schema";
import {ledgerEntries,ledgerJournals} from "../ledger/schema";
import {merchantNow} from "../access/merchant-scope";
import {formatMoney} from "../workspace/service";
import {listMerchantScopes} from "./service";
import {merchantTestPayments,merchantTestRefunds} from "./operations-schema";
import {networkPaymentOperations,networkRefundOperations} from "./network-schema";
import {merchantDeposits,merchantDepositEvents} from "./settlement-schema";
import {parseMerchantActivityQuery,type MerchantActivityQueryInput} from "./activity-contracts";
import {merchantRecordHref} from "../../shared/merchant-activity";
import {projectMerchantStatement,statementJournalRow,statementReturn,type StatementJournal,type StatementRecordContext} from "./statement-projection";
import type {MerchantStatementProjection,MerchantStatementRow} from "./statement-contracts";

/** One read snapshot and the same terminal/money policy as the servicing tools.
 * No request, provider event, journal or balance is created by this projection. */
export async function getMerchantStatement(personId:string,input:MerchantActivityQueryInput={}):Promise<MerchantStatementProjection>{
 const query=parseMerchantActivityQuery(input);
 return getDb().transaction(async tx=>{
  const scopes=await listMerchantScopes(tx,personId),now=await merchantNow(tx);
  const selected=scopes.filter(scope=>query.view==="all"||query.view===`unit:${scope.terminal.id}`||query.view===`merchant:${scope.merchantService.id}`);
  const readable=selected.filter(scope=>evaluate(scope.policy,"payments.read").allowed),terminalIds=readable.map(scope=>scope.terminal.id);
  const fullServices=[...new Set(readable.filter(scope=>scope.ownerAccess).map(scope=>scope.merchantService.id))].filter(serviceId=>scopes.filter(scope=>scope.merchantService.id===serviceId).every(scope=>terminalIds.includes(scope.terminal.id)));
  // A single terminal selection never attributes a business payout to that
  // terminal, even if it happens to be the business's only current terminal.
  const includeAccounts=query.view.startsWith("unit:")?[]:fullServices;
  const accounts=[];
  for(const serviceId of [...new Set(readable.filter(scope=>scope.ownerAccess).map(scope=>scope.merchantService.id))]){
   const account=await getServiceMoneyAccount(tx,serviceId);
   if(!evaluate({targetKind:"MONEY_ACCOUNT",actorPersonId:personId,ownerPersonId:account.ownerPersonId,moneyAccountId:account.id,resourceMoneyAccountId:account.id,serviceKind:account.serviceKind,status:account.status},"money.read").allowed)continue;
   accounts.push({...account,serviceId});
  }
  const accountIds=accounts.map(account=>account.id),visibleAccountIds=new Set(accounts.filter(account=>includeAccounts.includes(account.serviceId)).map(account=>account.id));
  const name=query.view==="all"?"All payment terminals":selected.length?(query.view.startsWith("unit:")?selected[0]!.terminal.displayName:selected[0]!.merchantService.displayName):"Unavailable statement";
  const scope={name,available:selected.length>0,completeScope:selected.length>0&&selected.length===readable.length,includesAccountMovements:visibleAccountIds.size>0};
  if(!terminalIds.length)return projectMerchantStatement(query,scope,[],now);
  const lines=await tx.select({entry:ledgerEntries,journal:ledgerJournals}).from(ledgerEntries).innerJoin(ledgerJournals,eq(ledgerJournals.id,ledgerEntries.journalId)).where(or(inArray(ledgerEntries.merchantUnitId,terminalIds),...(accountIds.length?[inArray(ledgerEntries.moneyAccountId,accountIds)]:[])));
  const payments=await tx.select().from(merchantTestPayments).where(inArray(merchantTestPayments.merchantUnitId,terminalIds));
  const refunds=await tx.select().from(merchantTestRefunds).where(inArray(merchantTestRefunds.merchantUnitId,terminalIds));
  const network=await tx.select().from(networkPaymentOperations).where(inArray(networkPaymentOperations.terminalId,terminalIds));
  const refundRequests=await tx.select().from(networkRefundOperations).where(inArray(networkRefundOperations.terminalId,terminalIds));
  const ownerTerminalIds=readable.filter(scope=>scope.ownerAccess).map(scope=>scope.terminal.id);
  const deposits=ownerTerminalIds.length?await tx.select({deposit:merchantDeposits,event:merchantDepositEvents}).from(merchantDeposits).leftJoin(merchantDepositEvents,eq(merchantDepositEvents.depositId,merchantDeposits.id)).where(inArray(merchantDeposits.merchantUnitId,ownerTerminalIds)):[];
  const withdrawals=accountIds.length?await tx.select({withdrawal:moneyWithdrawals,intent:moneyWithdrawalIntents,event:moneyWithdrawalEvents}).from(moneyWithdrawals)
   .innerJoin(moneyWithdrawalIntents,and(eq(moneyWithdrawalIntents.id,moneyWithdrawals.intentId),eq(moneyWithdrawalIntents.moneyAccountId,moneyWithdrawals.moneyAccountId),eq(moneyWithdrawalIntents.actorId,moneyWithdrawals.actorId),eq(moneyWithdrawalIntents.amountMinor,moneyWithdrawals.amountMinor),eq(moneyWithdrawalIntents.confirmCommandId,moneyWithdrawals.commandId)))
   .leftJoin(moneyWithdrawalEvents,eq(moneyWithdrawalEvents.withdrawalId,moneyWithdrawals.id)).where(inArray(moneyWithdrawals.moneyAccountId,accountIds)):[];
  const topups=accountIds.length?await tx.select({topup:moneyTopups,intent:moneyFundingIntents}).from(moneyTopups).innerJoin(moneyFundingIntents,and(eq(moneyFundingIntents.confirmCommandId,moneyTopups.commandId),eq(moneyFundingIntents.moneyAccountId,moneyTopups.moneyAccountId),eq(moneyFundingIntents.actorId,moneyTopups.actorId),eq(moneyFundingIntents.amountMinor,moneyTopups.amountMinor))).where(inArray(moneyTopups.moneyAccountId,accountIds)):[];
  const groups=new Map<string,{journal:StatementJournal;accountId:string|null}>();
  for(const {entry,journal} of lines){
   let group=groups.get(journal.id);
   if(!group){group={journal:{id:journal.id,kind:journal.kind,referenceId:journal.referenceId,createdAt:journal.createdAt,lines:[]},accountId:null};groups.set(journal.id,group);}
   group.journal.lines.push({bucket:entry.bucket,deltaMinor:entry.deltaMinor,terminalId:entry.merchantUnitId});
   if(entry.moneyAccountId)group.accountId=entry.moneyAccountId;
  }
  const returnTo=statementReturn(query),records:MerchantStatementRow[]=[];
  for(const {journal,accountId} of groups.values()){
   const terminalId=journal.lines.find(line=>line.terminalId)?.terminalId??null;
   const terminal=terminalId?readable.find(scope=>scope.terminal.id===terminalId):undefined;
   if(terminalId&&!terminal)continue;
   if(!terminalId&&(!accountId||!visibleAccountIds.has(accountId)))continue;
   if(terminal&&!terminal.ownerAccess&&!["MERCHANT_PAYMENT","MERCHANT_REFUND","NETWORK_CAPTURE","NETWORK_AVAILABLE","NETWORK_REFUND_RESERVE","NETWORK_REFUND_COMPLETE","NETWORK_REFUND_RELEASE"].includes(journal.kind))continue;
   const account=accountId?accounts.find(account=>account.id===accountId):undefined;
   const context:StatementRecordContext={terminalId,terminalName:terminal?.terminal.displayName??null,businessName:terminal?.merchantService.displayName??account?.displayName??name,href:null};
   const refund=refunds.find(row=>row.id===journal.referenceId&&row.journalId===journal.id);
   const refundRequest=refundRequests.find(row=>row.id===journal.referenceId);
   const payment=payments.find(row=>row.id===(refund?.paymentId??refundRequest?.paymentOperationId??journal.referenceId));
   const operation=network.find(row=>row.id===(refundRequest?.paymentOperationId??journal.referenceId));
   if(terminal&&(journal.kind.startsWith("NETWORK_")||["MERCHANT_PAYMENT","MERCHANT_REFUND"].includes(journal.kind))){
    context.description=payment?.description??operation?.description;
    context.reference=refund?.testReference??payment?.testReference;
    context.href=merchantRecordHref(terminal.terminal.id,{tab:"payments",...(payment?{payment:payment.id}:{})},returnTo);
    if(journal.kind==="NETWORK_CAPTURE"||journal.kind==="MERCHANT_PAYMENT")context.status=payment?refunds.some(row=>row.paymentId===payment.id)?"REFUNDED":"COMPLETED":"PENDING";
    if(journal.kind==="NETWORK_REFUND_RESERVE")context.status=[...groups.values()].some(group=>group.journal.referenceId===journal.referenceId&&group.journal.kind==="NETWORK_REFUND_COMPLETE")?"COMPLETED":[...groups.values()].some(group=>group.journal.referenceId===journal.referenceId&&group.journal.kind==="NETWORK_REFUND_RELEASE")?"FAILED":"PENDING";
   }
   const deposit=deposits.find(row=>row.deposit.id===journal.referenceId&&(row.deposit.journalId===journal.id||row.event?.journalId===journal.id));
   if(deposit&&terminal){context.reference=`DEP-${deposit.deposit.id.slice(0,8).toUpperCase()}`;context.status=deposit.event?.outcome??"PENDING";context.href=merchantRecordHref(terminal.terminal.id,{tab:"payments",activity:"transfers",transfer:deposit.deposit.id},returnTo);}
   const withdrawal=withdrawals.find(row=>row.withdrawal.id===journal.referenceId&&(row.withdrawal.journalId===journal.id||row.event?.journalId===journal.id));
   if(withdrawal&&accountId===withdrawal.withdrawal.moneyAccountId){
    context.reference=`OUT-${withdrawal.withdrawal.id.slice(0,8).toUpperCase()}`;
    context.href=customerHref(`/money-accounts/${accountId}`,{task:"withdraw",review:withdrawal.intent.id,returnTo});
    context.status=withdrawal.event?.outcome??"PENDING";
   }
   const topup=topups.find(row=>row.topup.id===journal.referenceId&&row.topup.journalId===journal.id);
   if(topup&&accountId===topup.topup.moneyAccountId){context.reference=`ADD-${topup.topup.id.slice(0,8).toUpperCase()}`;context.href=customerHref(`/money-accounts/${accountId}`,{task:"add",review:topup.intent.id,returnTo});}
   records.push(statementJournalRow(journal,context));
  }
  // A request without a posted journal remains visible with no money effect.
  for(const operation of network.filter(row=>!payments.some(payment=>payment.networkOperationId===row.id)&&![...groups.values()].some(group=>group.journal.kind==="NETWORK_CAPTURE"&&group.journal.referenceId===row.id))){
   const terminal=readable.find(scope=>scope.terminal.id===operation.terminalId)!;
   records.push({id:operation.id,journalId:null,reference:operation.id,at:operation.createdAt.toISOString(),kind:"payment",description:operation.description,status:"PENDING",effect:"NONE",amount:formatMoney(operation.amountMinor),credit:null,debit:null,terminalId:operation.terminalId,terminalName:terminal.terminal.displayName,businessName:terminal.merchantService.displayName,href:merchantRecordHref(operation.terminalId,{tab:"payments"},returnTo)});
  }
  for(const payment of payments.filter(row=>row.outcome==="DECLINED")){
   const terminal=readable.find(scope=>scope.terminal.id===payment.merchantUnitId)!;
   records.push({id:payment.id,journalId:null,reference:payment.testReference,at:payment.createdAt.toISOString(),kind:"payment",description:payment.description,status:"DECLINED",effect:"NONE",amount:formatMoney(payment.amountMinor),credit:null,debit:null,terminalId:payment.merchantUnitId,terminalName:terminal.terminal.displayName,businessName:terminal.merchantService.displayName,href:merchantRecordHref(payment.merchantUnitId,{tab:"payments",payment:payment.id},returnTo)});
  }
  return projectMerchantStatement(query,scope,records,now);
 },{isolationLevel:"repeatable read"});
}

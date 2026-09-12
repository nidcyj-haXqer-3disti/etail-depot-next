/** Read-only verification of the clean preview's canonical, permission-filtered service projections. */
import pg from "pg";
import {sql} from "drizzle-orm";
import {getDb,closeDatabase} from "../src/platform/database/client";
import {getRuntimeConfig} from "../src/platform/config";
import {SecurityError} from "../src/platform/security/origin";
import {people,services,serviceMembers,cards,serviceActivity} from "../src/platform/database/schema";
import {getOperatorQueue,getOperatorCase} from "../src/modules/operations/service";
import {getSupportCase} from "../src/modules/cases/service";
import {operatorServiceAccess} from "../src/modules/operations/schema";
import {getCardholderDashboard,getCardholderDashboardDetail} from "../src/modules/workspace/dashboard-service";
import {getMerchantDashboard} from "../src/modules/acquiring/dashboard-service";
import {getMerchantWorkspace} from "../src/modules/acquiring/service";
import {getMerchantOperations,getDepositProcessingQueue} from "../src/modules/acquiring/operations-service";
import {getCardholderFunds,getCardholderTopup,getCardSpending} from "../src/modules/workspace/service";
import {cardholderTopups,cardSpendingLimits,cardLimitChanges} from "../src/modules/workspace/funding-schema";
import {moneyTopups} from "../src/modules/money/schema";
import {cardCheckoutAttempts} from "../src/modules/acquiring/card-checkout-schema";
import {merchantTestPayments,merchantTestRefunds,merchantTestPayouts} from "../src/modules/acquiring/operations-schema";
import {merchantSettlements,merchantSettlementItems,merchantDeposits,merchantDepositItems,merchantDepositEvents} from "../src/modules/acquiring/settlement-schema";
import {ledgerEntries,ledgerJournals} from "../src/modules/ledger/schema";

const target=await import(new URL("./clean-preview-target.mjs",import.meta.url).href) as {
  previewDatabase:string;previewSeedKey:string;verifyPreviewRuntime:()=>Promise<void>;
  verifyPreviewDatabase:(client:pg.Client)=>Promise<void>;
};
const connectionString=`postgres://etail_local@127.0.0.1:55439/${target.previewDatabase}`;
const config=getRuntimeConfig();
if(config.appEnv!=="local"||!config.localFixtureIdentity||process.env.ENABLE_REAL_MONEY!=="false"||process.env.DATABASE_URL!==connectionString||
  (process.env.CI&&process.env.CI!=="false")||process.env.NETLIFY||process.env.SITE_ID||process.env.CONTEXT)throw new Error("Only the exact local clean preview can be verified.");
function assert(value:unknown,message:string):asserts value {if(!value)throw new Error(message);}
let deniedResourceChecks=0;
async function denied(run:()=>Promise<unknown>) {
  try {await run();}catch(error){if(error instanceof SecurityError&&[403,404].includes(error.status)){deniedResourceChecks++;return;}throw error;}
  throw new Error("An unauthorized resource was visible.");
}
await target.verifyPreviewRuntime();
const client=new pg.Client({connectionString,connectionTimeoutMillis:5000,application_name:"etail-clean-preview-scope-verification"});
let connected=false;
try {
  await client.connect();connected=true;
  await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
  await target.verifyPreviewDatabase(client);
  const marker=await client.query<{result:{primaryId:string;secondaryId:string;operatorId:string;serviceId:string;merchantServiceId:string;supportCaseId:string;primaryCardId:string;secondaryCardId:string;primaryMerchantId:string;submerchantIds:string[]}}>("SELECT result FROM public._etail_preview_seed WHERE key=$1",[target.previewSeedKey]);
  assert(marker.rows.length===1&&marker.rows[0]?.result,"The completed preview seed has no result marker.");
  const ids=marker.rows[0]!.result;
  await client.query("COMMIT");
  const primary=await getCardholderDashboard(ids.primaryId),secondary=await getCardholderDashboard(ids.secondaryId);
  assert(primary.person.displayName==="Alex Morgan"&&primary.cards.length===2&&primary.cardCount===2&&primary.ownCardCount===1&&primary.managedCardCount===1&&primary.profiles.length===1&&primary.primaryService?.canAddCard,"Alex's primary card service differs from the clean seed.");
  assert(primary.cards.every(card=>card.accessRole==="OWNER")&&primary.activity.length===5&&primary.activity.filter(row=>row.direction==="DEBIT").length===4&&primary.activity.filter(row=>row.direction==="CREDIT").length===1,"Primary activity must contain four connected purchases and one paired refund.");
  const alex=primary.cards.find(card=>card.id===ids.primaryCardId),jamie=primary.cards.find(card=>card.id===ids.secondaryCardId);
  assert(alex?.available.minor==="28400"&&alex.spending.cardId===ids.primaryCardId&&alex.spending.allowance.minor==="50000"&&alex.spending.used.minor==="21600"&&alex.spending.remaining.minor==="28400"&&alex.spending.available.minor===alex.available.minor&&alex.spending.version===1,"Alex's gross purchases must retain the refunded amount within this card’s total allowance.");
  assert(jamie?.available.minor==="13200"&&jamie.spending.cardId===ids.secondaryCardId&&jamie.spending.allowance.minor==="15000"&&jamie.spending.used.minor==="1800"&&jamie.spending.remaining.minor==="13200"&&jamie.spending.available.minor===jamie.available.minor&&jamie.spending.version===1,"Jamie's own spending allowance must use its independent total card allowance.");
  const funds=await getCardholderFunds(ids.primaryId,ids.serviceId);
  assert(funds.available.minor==="46400"&&funds.source==="SANDBOX_BANK"&&funds.topups.length===1&&funds.topups[0]?.amount.minor==="65000"&&funds.topups[0]?.serviceId===ids.serviceId&&funds.cards.length===2&&!funds.hasMore,"One explicit $650 group top-up must reconcile to $464 after $234 purchases and the $48 refund.");
  assert(funds.cards.find(person=>person.id===ids.primaryCardId)?.spending.available.minor==="28400"&&funds.cards.find(person=>person.id===ids.secondaryCardId)?.spending.available.minor==="13200","The funding and card projections must agree on each card’s available spending.");
  assert(secondary.person.displayName==="Jamie Morgan"&&secondary.primaryService===null&&secondary.cards.length===1&&secondary.cardCount===1&&secondary.ownCardCount===1&&secondary.managedCardCount===0&&secondary.profiles.length===1&&secondary.cards[0]?.id===ids.secondaryCardId&&secondary.cards[0]?.accessRole==="CARDHOLDER","Jamie must have exactly one secondary card service.");
  assert(secondary.activity.length===1&&secondary.activity[0]?.cardId===ids.secondaryCardId&&secondary.activity[0]?.amount.minor==="1800"&&secondary.requests.length===0&&secondary.cardholders.length===0&&!secondary.profiles[0]?.canAddCard&&!secondary.profiles[0]?.canInvite,"Secondary activity, request or management scope is too broad.");
  assert(secondary.cards[0]?.spending.used.minor==="1800"&&secondary.cards[0]?.spending.allowance.minor==="15000"&&secondary.cards[0]?.available.minor==="13200","Secondary spending must show only Jamie's current allowance.");
  const own=await getCardholderDashboardDetail(ids.secondaryId,{card:ids.secondaryCardId});
  assert(own?.workspace.cards.length===1&&own.workspace.cards.every(card=>card.holderId===ids.secondaryId&&card.spending.cardId===ids.secondaryCardId)&&own.workspace.activity.length===1&&own.workspace.activity.every(row=>row.cardId===ids.secondaryCardId)&&own.workspace.people.length===0&&own.workspace.cardholderOptions.length===0&&own.workspace.cardRequests.length===0,"Secondary detail must contain only the named cardholder's cards and activity.");
  const privateKeys=new Set(["balances","settlements","disputes","funds","topups","sourceLabel","groupBalance","groupAvailable"]);
  function hasPrivateFundingKey(value:unknown):boolean{return typeof value==="object"&&value!==null&&Object.entries(value).some(([key,child])=>privateKeys.has(key)||hasPrivateFundingKey(child));}
  assert(!hasPrivateFundingKey(secondary)&&!hasPrivateFundingKey(own.workspace)&&!JSON.stringify(own.workspace).includes(ids.primaryCardId)&&!JSON.stringify(secondary).includes(funds.topups[0]!.id),"Secondary projections cannot include primary cards, group balances or funding source/receipt details.");
  assert(own.workspace.capabilities.filter(item=>["cardholder.funds.read","cardholder.funds.add","cardholder.limits.manage"].includes(item.action)).every(item=>!item.allowed),"Secondary membership must not grant group funding or limit management.");
  const ownSpending=await getCardSpending(ids.secondaryId,ids.serviceId,ids.secondaryCardId);
  assert(ownSpending.cardId===ids.secondaryCardId&&ownSpending.available.minor==="13200"&&ownSpending.used.minor==="1800","The scoped spending reader must agree with Jamie's card.");
  await denied(()=>getCardholderDashboardDetail(ids.secondaryId,{card:ids.primaryCardId}));
  await denied(()=>getCardholderDashboardDetail(ids.secondaryId,{new:"1"}));
  await denied(()=>getCardholderFunds(ids.secondaryId,ids.serviceId));
  await denied(()=>getCardholderTopup(ids.secondaryId,ids.serviceId,funds.topups[0]!.id));
  await denied(()=>getCardSpending(ids.secondaryId,ids.serviceId,ids.primaryCardId));

  const primaryMerchant=await getMerchantDashboard(ids.primaryId),secondaryMerchant=await getMerchantDashboard(ids.secondaryId);
  assert(primaryMerchant.units.length===3&&primaryMerchant.merchants.length===1&&primaryMerchant.units.every(unit=>unit.ownerAccess&&unit.setupState==="READY"),"Primary merchant hierarchy or test readiness differs from the seed.");
  assert(primaryMerchant.units.map(unit=>unit.name).sort().join("|")==="Etail Studio|Online store|Pop-up shop","Unexpected merchant names in the active preview.");
  const popup=primaryMerchant.units.find(unit=>unit.name==="Pop-up shop")!,online=primaryMerchant.units.find(unit=>unit.name==="Online store")!;
  assert(secondaryMerchant.units.length===1&&secondaryMerchant.units[0]?.id===popup.id&&!secondaryMerchant.units[0]?.ownerAccess&&secondaryMerchant.moneyAccounts.length===0,"Jamie's merchant directory must expose only the delegated Pop-up shop.");
  const popupOperations=await getMerchantOperations(ids.secondaryId,popup.id),onlineOperations=await getMerchantOperations(ids.primaryId,online.id);
  assert(popupOperations.availableFunds===null&&popupOperations.settledFunds===null&&popupOperations.pendingDeposits===null&&popupOperations.bankFunds===null&&popupOperations.payments.length===1&&popupOperations.payments[0]?.amount.minor==="1800"&&!popupOperations.canPayout&&!popupOperations.canConfigureGateway&&!popupOperations.canEnroll&&popupOperations.payments.every(payment=>!payment.canRefund),"Secondary merchant controls or scoped funds are incorrect.");
  const allMerchantFunds=primaryMerchant.views.find(view=>view.id==="all")?.totals;
  assert(allMerchantFunds?.collected?.minor==="23400"&&allMerchantFunds.refunded?.minor==="4800"&&["0","4800"].includes(allMerchantFunds.transferred?.minor??"")&&allMerchantFunds.available?.minor==="13800"&&allMerchantFunds.settled?.minor==="0"&&allMerchantFunds.pending?.minor==="0"&&primaryMerchant.moneyAccounts[0]?.available.minor==="4800","Primary merchant totals must reconcile all collections, refunds and the completed deposit without mixing current buckets.");
  const popupFunds=secondaryMerchant.views.find(view=>view.id==="all")?.totals;
  assert(popupFunds?.collected?.minor==="1800"&&popupFunds.refunded?.minor==="0"&&popupFunds.transferred===null&&popupFunds.available===null&&popupFunds.bank===null,"Jamie's combined merchant view must remain the Pop-up shop only.");
  assert(onlineOperations.availableFunds?.minor==="0"&&onlineOperations.settledFunds?.minor==="0"&&onlineOperations.pendingDeposits?.minor==="0"&&onlineOperations.bankFunds?.minor==="4800"&&onlineOperations.payments.length===2&&onlineOperations.payments.every(payment=>payment.amount.minor==="4800")&&onlineOperations.payments.filter(payment=>payment.status==="REFUNDED").length===1&&onlineOperations.payouts.length+onlineOperations.settlements.length===1,"Online store's refund and completed deposit must leave $48 in Merchant money, not collection funds.");
  const deposit=onlineOperations.payouts[0],settlement=onlineOperations.settlements[0],depositedPayment=onlineOperations.payments.find(payment=>payment.status==="APPROVED");
  assert(depositedPayment?.canRefund&&depositedPayment.refundSource==="GROUP_MONEY","Settled payment refunds use Merchant money.");
  if(deposit)assert(deposit.status==="COMPLETED"&&deposit.amount.minor==="4800"&&deposit.processedAt!==null&&deposit.retryReview===null&&deposit.payments.length===1&&deposit.payments[0]?.id===depositedPayment?.id,"A preserved completed deposit must retain exact attribution.");
  else assert(settlement?.amount.minor==="4800"&&settlement.terminalId===online.id,"A fresh settlement must credit the correct Merchant money account.");
  const secondaryChannels=await getMerchantWorkspace(ids.secondaryId,popup.id);
  assert(secondaryChannels.channels.length===1&&secondaryChannels.channels[0]?.presentations.length===7,"The secondary should see its single seven-presentation channel.");
  await denied(()=>getMerchantWorkspace(ids.secondaryId,ids.primaryMerchantId));
  await denied(()=>getMerchantWorkspace(ids.secondaryId,online.id));

  const operatorQueue=await getOperatorQueue(ids.operatorId),operatorCase=await getOperatorCase(ids.operatorId,ids.supportCaseId);
  assert(operatorQueue.length===1&&operatorQueue[0]?.id===ids.supportCaseId&&operatorCase.canRespond,"Assigned support must receive Jamie’s case.");
  const customerCase=await getSupportCase(ids.secondaryId,ids.serviceId,ids.supportCaseId);
  assert(customerCase.messages.length===1&&customerCase.privacy==="CUSTOMER_AND_ASSIGNED_SUPPORT","Customer case visibility must name the assigned support boundary.");
  await denied(()=>getOperatorQueue(ids.primaryId));
  await denied(()=>getOperatorQueue(ids.secondaryId));
  await denied(()=>getSupportCase(ids.primaryId,ids.serviceId,ids.supportCaseId));
  await denied(()=>getMerchantWorkspace(ids.operatorId,ids.primaryMerchantId));
  const operatorCards=await getCardholderDashboard(ids.operatorId);
  assert(operatorCards.cards.length===0&&operatorCards.profiles.length===0,"Support assignment must not enroll an operator as a customer.");
  assert((await getMerchantDashboard(ids.operatorId)).units.length===0,"Deposit processing authority must not grant a merchant customer workspace.");
  assert((await getDepositProcessingQueue(ids.operatorId)).length===0&&(await getDepositProcessingQueue(ids.primaryId)).length===0&&(await getDepositProcessingQueue(ids.secondaryId)).length===0,"The completed seed deposit must not remain pending, and customer roles must not acquire an operator queue.");
  await denied(()=>getCardholderFunds(ids.operatorId,ids.serviceId));
  const counts=await getDb().execute(sql`SELECT
    (SELECT count(*) FROM ${people})::int AS people,(SELECT count(*) FROM ${services})::int AS services,
    (SELECT count(*) FROM ${serviceMembers})::int AS memberships,(SELECT count(*) FROM ${operatorServiceAccess})::int AS operator_assignments,
    (SELECT count(*) FROM ${operatorServiceAccess} WHERE ${operatorServiceAccess.personId}=${ids.operatorId} AND ${operatorServiceAccess.state}='ACCEPTED' AND ${operatorServiceAccess.canProcessDeposits} AND ${operatorServiceAccess.serviceId}=${ids.merchantServiceId})::int AS deposit_operator_assignments,
    (SELECT count(*) FROM ${operatorServiceAccess} WHERE ${operatorServiceAccess.canProcessDeposits} AND (${operatorServiceAccess.personId}<>${ids.operatorId} OR ${operatorServiceAccess.serviceId}<>${ids.merchantServiceId}))::int AS unexpected_deposit_authority,
    (SELECT count(*) FROM ${cards})::int AS cards,(SELECT count(*) FROM ${cards} WHERE ${cards.requestId} IS NULL)::int AS historical_cards,
    (SELECT count(*) FROM ${serviceActivity} WHERE ${serviceActivity.cardId} IS NULL)::int AS unattributed_activity,
    (SELECT count(*) FROM ${serviceActivity} WHERE ${serviceActivity.direction}='DEBIT')::int AS purchases,
    (SELECT count(*) FROM ${serviceActivity} WHERE ${serviceActivity.direction}='CREDIT')::int AS card_refunds,
    ((SELECT count(*) FROM ${moneyTopups})+(SELECT count(*) FROM ${cardholderTopups}))::int AS topups,(SELECT count(*) FROM ${cardSpendingLimits})::int AS spending_limits,
    (SELECT count(*) FROM ${cardLimitChanges})::int AS limit_changes,(SELECT count(*) FROM ${cardCheckoutAttempts})::int AS checkouts,
    (SELECT count(*) FROM ${merchantTestPayments})::int AS merchant_payments,
    (SELECT count(*) FROM ${merchantTestPayments} INNER JOIN ${cardCheckoutAttempts} ON ${cardCheckoutAttempts.id}=${merchantTestPayments.cardCheckoutId} INNER JOIN ${serviceActivity} ON ${serviceActivity.id}=${merchantTestPayments.cardActivityId}
      WHERE ${merchantTestPayments.actorId} IS NULL AND ${merchantTestPayments.guestOrderId} IS NULL AND ${merchantTestPayments.outcome}='APPROVED'
      AND ${serviceActivity.direction}='DEBIT' AND ${serviceActivity.amountMinor}=${merchantTestPayments.amountMinor}
      AND ${cardCheckoutAttempts.amountMinor}=${merchantTestPayments.amountMinor} AND ${cardCheckoutAttempts.cardId}=${serviceActivity.cardId}
      AND ${cardCheckoutAttempts.cardServiceId}=${ids.serviceId})::int AS paired_payments,
    (SELECT count(*) FROM ${merchantTestRefunds})::int AS merchant_refunds,
    (SELECT count(*) FROM ${merchantSettlements})::int AS settlements,(SELECT count(*) FROM ${merchantSettlementItems})::int AS settlement_items,
    (SELECT count(*) FROM ${merchantDeposits})::int AS deposits,(SELECT count(*) FROM ${merchantDepositItems})::int AS deposit_items,
    (SELECT count(*) FROM ${merchantDepositEvents} WHERE ${merchantDepositEvents.depositId}=${deposit?.id??"00000000-0000-4000-8000-000000000000"} AND ${merchantDepositEvents.actorId}=${ids.operatorId} AND ${merchantDepositEvents.outcome}='COMPLETED')::int AS completed_by_operator,
    (SELECT count(*) FROM ${merchantDepositEvents})::int AS deposit_events,
    (SELECT count(*) FROM ${merchantTestPayouts})::int AS historical_payouts,
    (SELECT count(*) FROM ${ledgerJournals} WHERE ${ledgerJournals.kind} IN ('MONEY_FUNDING','GROUP_FUNDING'))::int AS group_funding_journals,
    (SELECT count(*) FROM ${ledgerJournals} WHERE ${ledgerJournals.kind}='CARD_FUNDING')::int AS historical_card_funding,
    (SELECT count(*) FROM ${ledgerEntries} WHERE ${ledgerEntries.bucket}='CARD_AVAILABLE')::int AS historical_card_balances`);
  const row=counts.rows[0];
  assert(row?.people===3&&row?.services===2&&row?.memberships===3&&row?.operator_assignments===2&&row?.cards===2&&row?.historical_cards===0&&row?.unattributed_activity===0,"The prepared baseline differs from the exact three-person, two-service dataset.");
  assert(row.topups===1&&row.spending_limits===2&&row.limit_changes===2&&row.group_funding_journals===1&&row.historical_card_funding===0&&row.historical_card_balances===0,"The seed must explicitly fund one card money account and set two card allowances without per-card balances.");
  assert(row.purchases===4&&row.card_refunds===1&&row.checkouts===4&&row.merchant_payments===4&&row.paired_payments===4&&row.merchant_refunds===1,"Each seeded merchant collection must be paired to its original card checkout and one full refund must restore the card group.");
  assert(row.settlements===1&&row.settlement_items===1&&row.deposits===(deposit?1:0)&&row.deposit_items===(deposit?1:0)&&row.deposit_events===(deposit?1:0)&&row.completed_by_operator===(deposit?1:0)&&row.historical_payouts===0&&row.deposit_operator_assignments===1&&row.unexpected_deposit_authority===0,"Exactly one settlement must preserve either its historical completed deposit or the fresh direct Merchant money credit.");
  console.log(JSON.stringify({result:"PASS",database:target.previewDatabase,primary:{name:primary.person.displayName,cards:2,activity:5,merchantUnits:3,groupAvailable:"46400",totalAllowance:"50000",grossSpend:"21600",remaining:"28400"},secondary:{name:secondary.person.displayName,cards:1,activity:1,merchantUnits:1,totalAllowance:"15000",grossSpend:"1800",remaining:"13200",canManagePrimary:false},connected:{purchases:4,refunds:1,deposits:1,merchantAwaiting:"13800",sandboxBank:"4800"},operator:{assignments:2,depositProcessingAssignments:1,completedDeposits:1,pendingDeposits:0,cases:1,customerEnrollments:0},historicalRows:0,deniedResourceChecks,scope:"Original prepared baseline with lifetime card allowances; read-only projections, no command execution, API server, provider or real money"}));
}finally{if(connected)await client.end();await closeDatabase();}

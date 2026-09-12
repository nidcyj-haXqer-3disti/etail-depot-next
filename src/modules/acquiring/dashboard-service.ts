import {getServiceMoneyAccount,readServiceMoneyAvailable} from "../money/service";
import { and, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../platform/database/client";
import { merchantNow } from "../access/merchant-scope";
import { requireServiceReader } from "../services/service-reader";
import { evaluate } from "../policy/evaluate";
import { getBalance } from "../ledger/service";
import { formatMoney } from "../workspace/service";
import { listMerchantScopes } from "./service";
import { paymentChannels } from "./schema";
import {merchantDeposits,merchantDepositEvents} from "./settlement-schema";
import { channelActivations, merchantTestPayments, merchantTestRefunds, testGateways, testMerchantEnrollments } from "./operations-schema";
import type { MerchantCollectionAvailability, MerchantDashboardProjection, MerchantDashboardTotals, MerchantDashboardUnit, MerchantDashboardView, MerchantDashboardPayment, MerchantDashboardTransfer } from "./dashboard-contracts";
import {parseMerchantActivityQuery,type MerchantActivityQueryInput,type MerchantActivityRow} from "./activity-contracts";
import {projectMerchantActivity} from "./activity-service";

/** One scoped read snapshot: service hierarchy and operation summaries, with no service-container projection. */
export async function getMerchantDashboard(personId:string,input:MerchantActivityQueryInput={},options:{exportRows?:boolean}={}):Promise<MerchantDashboardProjection> {
 const query=parseMerchantActivityQuery(input);
 return getDb().transaction(async tx=>{
  const scopes=await listMerchantScopes(tx,personId),now=await merchantNow(tx);
  const {canCreatePrimary}=await requireServiceReader(tx,personId);
  const eligible=canCreatePrimary;
  const paymentIds=scopes.filter(scope=>evaluate(scope.policy,"payments.read").allowed).map(scope=>scope.terminal.id);
  const channelIds=scopes.filter(scope=>evaluate(scope.policy,"channels.read").allowed).map(scope=>scope.terminal.id);
  const primaryServiceIds=[...new Set(scopes.map(scope=>scope.merchantService.id))],unitIds=scopes.map(scope=>scope.terminal.id);
  const payments=paymentIds.length?await tx.select().from(merchantTestPayments).where(inArray(merchantTestPayments.merchantUnitId,paymentIds)).orderBy(desc(merchantTestPayments.createdAt),merchantTestPayments.id):[];
  const refunds=paymentIds.length?await tx.select().from(merchantTestRefunds).where(inArray(merchantTestRefunds.merchantUnitId,paymentIds)):[];
  const ownedPaymentIds=scopes.filter(scope=>scope.ownerAccess&&evaluate(scope.policy,"payments.read").allowed).map(scope=>scope.terminal.id);
  const deposits=ownedPaymentIds.length?await tx.select({deposit:merchantDeposits,event:merchantDepositEvents}).from(merchantDeposits).leftJoin(merchantDepositEvents,eq(merchantDepositEvents.depositId,merchantDeposits.id)).where(inArray(merchantDeposits.merchantUnitId,ownedPaymentIds)).orderBy(desc(merchantDeposits.createdAt),merchantDeposits.id):[];
  const payouts=deposits.map(({deposit,event})=>({...deposit,status:event?.outcome??"PENDING" as const,activityAt:event?.createdAt??deposit.createdAt,testReference:`DEP-${deposit.id.slice(0,8).toUpperCase()}`}));
  const channels=channelIds.length?await tx.select().from(paymentChannels).where(inArray(paymentChannels.merchantUnitId,channelIds)):[];
  const activations=channelIds.length?await tx.select().from(channelActivations).where(inArray(channelActivations.merchantUnitId,channelIds)):[];
  const gateways=primaryServiceIds.length?await tx.select().from(testGateways).where(inArray(testGateways.serviceId,primaryServiceIds)):[];
  const enrollments=unitIds.length?await tx.select().from(testMerchantEnrollments).where(inArray(testMerchantEnrollments.merchantUnitId,unitIds)):[];
  // Used one-time channels must not appear ready even to a channel reader without payment-record access.
  const approvedUses=channelIds.length?await tx.select({channelId:merchantTestPayments.channelId}).from(merchantTestPayments).where(and(inArray(merchantTestPayments.merchantUnitId,channelIds),eq(merchantTestPayments.outcome,"APPROVED"))):[];
  const used=new Set(approvedUses.map(row=>row.channelId));
  const units:MerchantDashboardUnit[]=[];
  for(const scope of scopes) {
   const unit=scope.terminal,canReadPayments=paymentIds.includes(unit.id),canReadChannels=channelIds.includes(unit.id);
   const gateway=gateways.find(row=>row.serviceId===scope.merchantService.id),enrollment=enrollments.find(row=>row.merchantUnitId===unit.id);
   const setupState:MerchantDashboardUnit["setupState"]=!scope.policy.operating?"PAUSED":!gateway?"NOT_CONFIGURED":gateway.mode==="DISABLED"?"DISABLED":enrollment?.status!=="ENROLLED"?"NOT_ENROLLED":"READY";
   const visibleChannels=channels.filter(row=>row.merchantUnitId===unit.id);
   const liveChannels=visibleChannels.filter(row=>row.status==="DRAFT"&&row.expiresAt>now);
   const activeChannelCount=liveChannels.filter(row=>setupState==="READY"&&activations.some(active=>active.channelId===row.id&&active.status==="ACTIVE")&&(row.usage==="REUSABLE"||!used.has(row.id))).length;
   const canCreateChannel=eligible&&evaluate(scope.policy,"channels.create").allowed;
   const helpAction={label:"Open help",href:`/merchants/${unit.id}?tab=help`};
   const setupAction={label:"Review payment setup",href:`/merchants/${unit.id}?tab=verification`};
   const channelAction={label:"View payment requests",href:`/merchants/${unit.id}?tab=channels`};
   // This suggests an existing scoped page, never supplies command authority.
   // Payment setup alone is not a ready channel, or a published customer checkout.
   const collectionAvailability:MerchantCollectionAvailability=!scope.policy.operating
    ?{code:"PAUSED",title:"Payments are unavailable",description:"Review this payment terminal’s status and settings. Existing records remain available within your access.",action:setupAction}
    :setupState!=="READY"
      ?scope.ownerAccess
        ?{code:"SETUP_REQUIRED",title:"Payment setup needs attention",description:"Review payment settings before creating a request to receive payments.",action:setupAction}
        :{code:"OWNER_ACTION_REQUIRED",title:"Your account owner needs to finish setup",description:`Ask ${scope.merchantService.displayName} to review payment settings for this terminal. Your access does not let you enable payments.`,action:helpAction}
      :!eligible
        ?{code:"ACCESS_RESTRICTED",title:"Payment access needs attention",description:"Creating payment requests is not available for this setup. Open Help to review your access.",action:helpAction}
        :!canReadChannels
          ?{code:"ACCESS_RESTRICTED",title:"Payment requests are not shared with you",description:scope.ownerAccess?"Your current access does not include payment requests. Open Help to review your access.":`Ask ${scope.merchantService.displayName} to review your payment request access. You can still use the records shared with you.`,action:helpAction}
          :!visibleChannels.length
            ?canCreateChannel
              ?{code:"CHANNEL_REQUIRED",title:"Create a payment request",description:"Payments are ready. Choose an amount and create a payment request.",action:{label:"Create payment request",href:`/merchants/${unit.id}?tab=channels&new=1`}}
              :{code:"ACCESS_RESTRICTED",title:"No payment requests are available to you",description:scope.ownerAccess?"Open Help to review your available payment tools.":`Ask ${scope.merchantService.displayName} to create or share a payment request with you.`,action:helpAction}
            :!activeChannelCount
              ?{code:"CHANNEL_REVIEW_REQUIRED",title:"Your payment requests need attention",description:"Your saved payment requests cannot accept payments right now. Open a request to see what needs attention.",action:channelAction}
              :{code:"READY",title:"A payment request is ready",description:"A payment request is ready. Open it to review and share its payment link.",action:channelAction};
   const total=(values:{amountMinor:bigint}[])=>formatMoney(values.reduce((sum,row)=>sum+row.amountMinor,0n));
   units.push({id:unit.id,name:unit.displayName,merchantServiceId:scope.merchantService.id,merchantName:scope.merchantService.displayName,ownerAccess:scope.ownerAccess,status:unit.status,canOpen:evaluate(scope.policy,"merchant.read").allowed,canAddTerminal:evaluate(scope.policy,"merchant.terminals.create").allowed&&scope.policy.operating&&eligible,canCreateChannel,canReadPeople:evaluate(scope.policy,"merchant.people.read").allowed,setupState,collectionAvailability,totals:{
    collected:canReadPayments?total(payments.filter(row=>row.merchantUnitId===unit.id&&row.outcome==="APPROVED")):null,
    refunded:canReadPayments?total(refunds.filter(row=>row.merchantUnitId===unit.id)):null,
    transferred:scope.ownerAccess&&canReadPayments?total(payouts.filter(row=>row.merchantUnitId===unit.id&&row.status==="COMPLETED")):null,
    available:scope.ownerAccess&&canReadPayments?formatMoney(await getBalance(tx,{serviceId:scope.merchantService.id,merchantUnitId:unit.id,bucket:"MERCHANT_AVAILABLE"})):null,
    settled:scope.ownerAccess&&canReadPayments?formatMoney(await getBalance(tx,{serviceId:scope.merchantService.id,merchantUnitId:unit.id,bucket:"MERCHANT_SETTLED"})):null,
    pending:scope.ownerAccess&&canReadPayments?formatMoney(await getBalance(tx,{serviceId:scope.merchantService.id,merchantUnitId:unit.id,bucket:"MERCHANT_PAYOUT_PENDING"})):null,
    bank:scope.ownerAccess&&canReadPayments?formatMoney(await getBalance(tx,{serviceId:scope.merchantService.id,merchantUnitId:unit.id,bucket:"PAYOUT_CLEARING"})):null,
    channelCount:canReadChannels?visibleChannels.length:null,
    activeChannelCount:canReadChannels?activeChannelCount:null,
   }});
  }
  const merchants=[...new Set(scopes.map(scope=>scope.merchantService.id))].map(serviceId=>{const scope=scopes.find(scope=>scope.merchantService.id===serviceId)!;return {serviceId,name:scope.merchantService.displayName,ownerAccess:scope.ownerAccess,unitIds:units.filter(unit=>unit.merchantServiceId===serviceId).map(unit=>unit.id)};});
  const moneyAccounts:MerchantDashboardProjection["moneyAccounts"]=[];
  for(const merchant of merchants.filter(item=>item.ownerAccess)){
   const account=await getServiceMoneyAccount(tx,merchant.serviceId);
   const existing=moneyAccounts.find(item=>item.id===account.id);
   if(existing)existing.merchantServiceIds.push(merchant.serviceId);
   else moneyAccounts.push({id:account.id,name:account.displayName,available:formatMoney(await readServiceMoneyAvailable(tx,merchant.serviceId)),merchantServiceIds:[merchant.serviceId]});
  }
  const paymentRows:MerchantDashboardPayment[]=payments.map(row=>({id:row.id,merchantId:row.merchantUnitId,merchantName:units.find(unit=>unit.id===row.merchantUnitId)!.name,description:row.description,amount:formatMoney(row.amountMinor),status:refunds.some(refund=>refund.paymentId===row.id)?"REFUNDED":row.outcome,reference:row.testReference,at:row.createdAt.toISOString()}));
  const transferRows:MerchantDashboardTransfer[]=payouts.map(row=>({id:row.id,merchantId:row.merchantUnitId,merchantName:units.find(unit=>unit.id===row.merchantUnitId)!.name,amount:formatMoney(row.amountMinor),reference:row.testReference,at:row.activityAt.toISOString(),status:row.status}));
  function view(id:string,name:string,description:string,ids:string[]):MerchantDashboardView {
   const selected=units.filter(unit=>ids.includes(unit.id));
   const amount=(key:"collected"|"refunded"|"transferred"|"available"|"settled"|"pending"|"bank")=>selected.every(unit=>unit.totals[key]!==null)?formatMoney(selected.reduce((sum,unit)=>sum+BigInt(unit.totals[key]!.minor),0n)):null;
   const count=(key:"channelCount"|"activeChannelCount")=>selected.every(unit=>unit.totals[key]!==null)?selected.reduce((sum,unit)=>sum+unit.totals[key]!,0):null;
   const totals:MerchantDashboardTotals={collected:amount("collected"),refunded:amount("refunded"),transferred:amount("transferred"),available:amount("available"),settled:amount("settled"),pending:amount("pending"),bank:amount("bank"),channelCount:count("channelCount"),activeChannelCount:count("activeChannelCount")};
   const recentPayments=paymentRows.filter(row=>ids.includes(row.merchantId)),recentTransfers=transferRows.filter(row=>ids.includes(row.merchantId));
   return {id,name,description,unitIds:ids,totals,payments:recentPayments.slice(0,12),transfers:recentTransfers.slice(0,6),paymentsHasMore:recentPayments.length>12,transfersHasMore:recentTransfers.length>6};
  }
  const views=[view("all","All payment terminals","Payments from the terminals you can access.",unitIds),...merchants.map(merchant=>view(`merchant:${merchant.serviceId}`,merchant.name,"Payments from every terminal in this business.",merchant.unitIds)),...units.map(unit=>view(`unit:${unit.id}`,unit.name,`Payment terminal for ${unit.merchantName}.`,[unit.id]))];
  const activityRecords:Omit<MerchantActivityRow,"href">[]=[
   ...paymentRows.map(row=>({...row,kind:"payment" as const,paymentId:row.id,paymentReference:row.reference})),
   ...refunds.map(row=>({id:row.id,kind:"refund" as const,merchantId:row.merchantUnitId,merchantName:units.find(unit=>unit.id===row.merchantUnitId)!.name,description:payments.find(payment=>payment.id===row.paymentId)!.description,amount:formatMoney(row.amountMinor),status:"COMPLETED" as const,reference:row.testReference,at:row.createdAt.toISOString(),paymentId:row.paymentId,paymentReference:payments.find(payment=>payment.id===row.paymentId)!.testReference})),
   ...transferRows.map(row=>({...row,kind:"transfer" as const,description:"Deposit",status:row.status,paymentId:null,paymentReference:null})),
  ];
  return {mode:"TEST",canCreateMerchant:canCreatePrimary,merchants,moneyAccounts,units,views,activity:projectMerchantActivity(query,views.find(view=>view.id===query.view),activityRecords,now,options.exportRows)};
 },{isolationLevel:"repeatable read"});
}

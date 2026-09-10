import { and, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../platform/database/client";
import { merchantNow } from "../access/merchant-scope";
import { requireServiceReader } from "../services/service-reader";
import { evaluate } from "../policy/evaluate";
import { getBalance } from "../ledger/service";
import { formatMoney } from "../workspace/service";
import { listMerchantScopes, merchantChannelVisible } from "./service";
import { paymentChannels } from "./schema";
import { channelActivations, merchantTestPayments, merchantTestRefunds, merchantTestPayouts, testGateways, testMerchantEnrollments } from "./operations-schema";
import type { MerchantDashboardProjection, MerchantDashboardTotals, MerchantDashboardUnit, MerchantDashboardView, MerchantDashboardPayment, MerchantDashboardTransfer } from "./dashboard-contracts";

/** One scoped read snapshot: service hierarchy and operation summaries, with no service-container projection. */
export async function getMerchantDashboard(personId:string):Promise<MerchantDashboardProjection> {
 return getDb().transaction(async tx=>{
  const scopes=await listMerchantScopes(tx,personId),now=await merchantNow(tx);
  const {canCreatePrimary}=await requireServiceReader(tx,personId);
  const eligible=canCreatePrimary;
  const paymentIds=scopes.filter(scope=>evaluate(scope.policy,"payments.read").allowed).map(scope=>scope.unit.id);
  const channelIds=scopes.filter(scope=>evaluate(scope.policy,"channels.read").allowed).map(scope=>scope.unit.id);
  const primaryServiceIds=[...new Set(scopes.map(scope=>scope.masterService.id))],unitIds=scopes.map(scope=>scope.unit.id);
  const payments=paymentIds.length?await tx.select().from(merchantTestPayments).where(inArray(merchantTestPayments.merchantUnitId,paymentIds)).orderBy(desc(merchantTestPayments.createdAt),merchantTestPayments.id):[];
  const refunds=paymentIds.length?await tx.select().from(merchantTestRefunds).where(inArray(merchantTestRefunds.merchantUnitId,paymentIds)):[];
  const payouts=paymentIds.length?await tx.select().from(merchantTestPayouts).where(inArray(merchantTestPayouts.merchantUnitId,paymentIds)).orderBy(desc(merchantTestPayouts.createdAt),merchantTestPayouts.id):[];
  const channels=channelIds.length?await tx.select().from(paymentChannels).where(inArray(paymentChannels.merchantUnitId,channelIds)):[];
  const activations=channelIds.length?await tx.select().from(channelActivations).where(inArray(channelActivations.merchantUnitId,channelIds)):[];
  const gateways=primaryServiceIds.length?await tx.select().from(testGateways).where(inArray(testGateways.serviceId,primaryServiceIds)):[];
  const enrollments=unitIds.length?await tx.select().from(testMerchantEnrollments).where(inArray(testMerchantEnrollments.merchantUnitId,unitIds)):[];
  // Used one-time channels must not appear ready even to a channel reader without payment-record access.
  const approvedUses=channelIds.length?await tx.select({channelId:merchantTestPayments.channelId}).from(merchantTestPayments).where(and(inArray(merchantTestPayments.merchantUnitId,channelIds),eq(merchantTestPayments.outcome,"APPROVED"))):[];
  const used=new Set(approvedUses.map(row=>row.channelId));
  const units:MerchantDashboardUnit[]=[];
  for(const scope of scopes) {
   const unit=scope.unit,canReadPayments=paymentIds.includes(unit.id),canReadChannels=channelIds.includes(unit.id);
   const gateway=gateways.find(row=>row.serviceId===scope.masterService.id),enrollment=enrollments.find(row=>row.merchantUnitId===unit.id);
   const setupState:MerchantDashboardUnit["setupState"]=!scope.policy.operating?"PAUSED":!gateway?"NOT_CONFIGURED":gateway.mode==="DISABLED"?"DISABLED":enrollment?.status!=="ENROLLED"?"NOT_ENROLLED":"READY";
   const visibleChannels=channels.filter(row=>row.merchantUnitId===unit.id&&merchantChannelVisible(row,personId,scope.primaryAccess));
   const liveChannels=visibleChannels.filter(row=>row.status==="DRAFT"&&row.expiresAt>now);
   const total=(values:{amountMinor:bigint}[])=>formatMoney(values.reduce((sum,row)=>sum+row.amountMinor,0n));
   units.push({id:unit.id,name:unit.displayName,kind:unit.kind,primaryId:scope.master.id,primaryName:scope.master.displayName,primaryAccess:scope.primaryAccess,status:unit.status,canOpen:evaluate(scope.policy,"merchant.read").allowed,canAddSubmerchant:unit.kind==="MASTER"&&evaluate(scope.policy,"merchant.units.create").allowed&&scope.policy.operating&&eligible,canCreateChannel:eligible&&evaluate(scope.policy,"channels.create").allowed,setupState,totals:{
    collected:canReadPayments?total(payments.filter(row=>row.merchantUnitId===unit.id&&row.outcome==="APPROVED")):null,
    refunded:canReadPayments?total(refunds.filter(row=>row.merchantUnitId===unit.id)):null,
    transferred:canReadPayments?total(payouts.filter(row=>row.merchantUnitId===unit.id)):null,
    available:canReadPayments?formatMoney(await getBalance(tx,{serviceId:scope.masterService.id,merchantUnitId:unit.id,bucket:"MERCHANT_AVAILABLE"})):null,
    channelCount:canReadChannels?visibleChannels.length:null,
    activeChannelCount:canReadChannels?liveChannels.filter(row=>setupState==="READY"&&activations.some(active=>active.channelId===row.id&&active.status==="ACTIVE")&&(row.usage==="REUSABLE"||!used.has(row.id))).length:null,
   }});
  }
  const primaryNetworks=units.filter(unit=>unit.kind==="MASTER"&&unit.primaryAccess).map(root=>({primaryId:root.id,name:root.name,unitIds:units.filter(unit=>unit.primaryId===root.id).map(unit=>unit.id)}));
  const ownedRoots=new Set(primaryNetworks.map(row=>row.primaryId));
  const delegatedUnitIds=units.filter(unit=>!ownedRoots.has(unit.primaryId)).map(unit=>unit.id);
  const paymentRows:MerchantDashboardPayment[]=payments.map(row=>({id:row.id,merchantId:row.merchantUnitId,merchantName:units.find(unit=>unit.id===row.merchantUnitId)!.name,description:row.description,amount:formatMoney(row.amountMinor),status:refunds.some(refund=>refund.paymentId===row.id)?"REFUNDED":row.outcome,reference:row.testReference,at:row.createdAt.toISOString()}));
  const transferRows:MerchantDashboardTransfer[]=payouts.map(row=>({id:row.id,merchantId:row.merchantUnitId,merchantName:units.find(unit=>unit.id===row.merchantUnitId)!.name,amount:formatMoney(row.amountMinor),reference:row.testReference,at:row.createdAt.toISOString()}));
  function view(id:string,name:string,description:string,ids:string[]):MerchantDashboardView {
   const selected=units.filter(unit=>ids.includes(unit.id));
   const amount=(key:"collected"|"refunded"|"transferred"|"available")=>selected.every(unit=>unit.totals[key]!==null)?formatMoney(selected.reduce((sum,unit)=>sum+BigInt(unit.totals[key]!.minor),0n)):null;
   const count=(key:"channelCount"|"activeChannelCount")=>selected.every(unit=>unit.totals[key]!==null)?selected.reduce((sum,unit)=>sum+unit.totals[key]!,0):null;
   const totals:MerchantDashboardTotals={collected:amount("collected"),refunded:amount("refunded"),transferred:amount("transferred"),available:amount("available"),channelCount:count("channelCount"),activeChannelCount:count("activeChannelCount")};
   const recentPayments=paymentRows.filter(row=>ids.includes(row.merchantId)),recentTransfers=transferRows.filter(row=>ids.includes(row.merchantId));
   return {id,name,description,unitIds:ids,totals,payments:recentPayments.slice(0,12),transfers:recentTransfers.slice(0,6),paymentsHasMore:recentPayments.length>12,transfersHasMore:recentTransfers.length>6};
  }
  return {mode:"TEST",canCreatePrimary,primaryNetworks,delegatedUnitIds,units,views:[view("all","All your merchants","Your primary merchants and separately shared merchant work.",unitIds),...primaryNetworks.map(root=>view(`network:${root.primaryId}`,root.name,"Primary merchant and its submerchants.",root.unitIds)),...units.map(unit=>view(`unit:${unit.id}`,unit.name,unit.kind==="MASTER"?"This primary merchant’s own collections.":`Submerchant of ${unit.primaryName}.`,[unit.id]))]};
 },{isolationLevel:"repeatable read"});
}

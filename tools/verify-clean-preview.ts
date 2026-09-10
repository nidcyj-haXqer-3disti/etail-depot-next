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
import {getMerchantOperations} from "../src/modules/acquiring/operations-service";

const target=await import(new URL("./clean-preview-target.mjs",import.meta.url).href) as {
  previewDatabase:string;previewSeedKey:string;verifyPreviewRuntime:()=>Promise<void>;
  verifyPreviewDatabase:(client:pg.Client)=>Promise<void>;
};
const connectionString=`postgres://etail_local@127.0.0.1:55439/${target.previewDatabase}`;
const config=getRuntimeConfig();
if(config.appEnv!=="local"||!config.localFixtureIdentity||process.env.ENABLE_REAL_MONEY!=="false"||process.env.DATABASE_URL!==connectionString||
  (process.env.CI&&process.env.CI!=="false")||process.env.NETLIFY||process.env.SITE_ID||process.env.CONTEXT)throw new Error("Only the exact local clean preview can be verified.");
function assert(value:unknown,message:string):asserts value {if(!value)throw new Error(message);}
async function denied(run:()=>Promise<unknown>) {
  try {await run();}catch(error){if(error instanceof SecurityError&&[403,404].includes(error.status))return;throw error;}
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
  const ids=marker.rows[0]!.result;
  await client.query("COMMIT");
  const primary=await getCardholderDashboard(ids.primaryId),secondary=await getCardholderDashboard(ids.secondaryId);
  assert(primary.person.displayName==="Alex Morgan"&&primary.cards.length===2&&primary.cardCount===2&&primary.profiles.length===1&&primary.primaryService?.canAddCard,"Alex's primary card service differs from the clean seed.");
  assert(primary.cards.every(card=>card.accessRole==="PRIMARY")&&primary.activity.length===2,"Primary cards/activity must come only from canonical sandbox commands.");
  assert(primary.cards.find(card=>card.id===ids.primaryCardId)?.available.minor==="46500"&&primary.cards.find(card=>card.id===ids.secondaryCardId)?.available.minor==="13800","Canonical practice funds differ from the seeded allocation and purchases.");
  assert(secondary.person.displayName==="Jamie Morgan"&&secondary.primaryService===null&&secondary.cards.length===1&&secondary.profiles.length===1&&secondary.cards[0]?.id===ids.secondaryCardId&&secondary.cards[0]?.accessRole==="SECONDARY","Jamie must have exactly one secondary card service.");
  assert(secondary.activity.length===1&&secondary.activity[0]?.cardId===ids.secondaryCardId&&secondary.requests.length===0&&!secondary.profiles[0]?.canAddCard&&!secondary.profiles[0]?.canInvite,"Secondary activity, request or management scope is too broad.");
  const own=await getCardholderDashboardDetail(ids.secondaryId,{card:ids.secondaryCardId});
  assert(own?.workspace.cards.length===1&&!["balances","settlements","disputes"].some(key=>key in own.workspace),"Secondary detail cannot expose primary or merchant financial records.");
  await denied(()=>getCardholderDashboardDetail(ids.secondaryId,{card:ids.primaryCardId}));
  await denied(()=>getCardholderDashboardDetail(ids.secondaryId,{new:"1"}));

  const primaryMerchant=await getMerchantDashboard(ids.primaryId),secondaryMerchant=await getMerchantDashboard(ids.secondaryId);
  assert(primaryMerchant.units.length===3&&primaryMerchant.primaryNetworks.length===1&&primaryMerchant.units.every(unit=>unit.primaryAccess&&unit.setupState==="READY"),"Primary merchant hierarchy or test readiness differs from the seed.");
  assert(primaryMerchant.units.map(unit=>unit.name).sort().join("|")==="Etail Studio|Online store|Pop-up shop","Unexpected merchant names in the active preview.");
  const popup=primaryMerchant.units.find(unit=>unit.name==="Pop-up shop")!,online=primaryMerchant.units.find(unit=>unit.name==="Online store")!;
  assert(secondaryMerchant.units.length===1&&secondaryMerchant.units[0]?.id===popup.id&&!secondaryMerchant.units[0]?.primaryAccess&&secondaryMerchant.primaryNetworks.length===0,"Jamie's merchant directory must expose only the delegated Pop-up shop.");
  const popupOperations=await getMerchantOperations(ids.secondaryId,popup.id),onlineOperations=await getMerchantOperations(ids.primaryId,online.id);
  assert(popupOperations.availableFunds?.minor==="1800"&&popupOperations.payments.length===1&&!popupOperations.canPayout&&!popupOperations.canConfigureGateway&&!popupOperations.canEnroll&&popupOperations.payments.every(payment=>!payment.canRefund),"Secondary merchant controls or funds are incorrect.");
  assert(onlineOperations.availableFunds?.minor==="2800"&&onlineOperations.payments.length===2&&onlineOperations.payments.filter(payment=>payment.status==="REFUNDED").length===1&&onlineOperations.payouts.length===1,"Online store's canonical payment/refund/transfer examples are incorrect.");
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
  const counts=await getDb().execute(sql`SELECT
    (SELECT count(*) FROM ${people})::int AS people,(SELECT count(*) FROM ${services})::int AS services,
    (SELECT count(*) FROM ${serviceMembers})::int AS memberships,(SELECT count(*) FROM ${operatorServiceAccess})::int AS operator_assignments,
    (SELECT count(*) FROM ${cards} WHERE ${cards.requestId} IS NULL)::int AS historical_cards,
    (SELECT count(*) FROM ${serviceActivity} WHERE ${serviceActivity.cardId} IS NULL)::int AS unattributed_activity`);
  const row=counts.rows[0];
  assert(row?.people===3&&row?.services===2&&row?.memberships===3&&row?.operator_assignments===2&&row?.historical_cards===0&&row?.unattributed_activity===0,"The prepared baseline differs from the exact three-person, two-service dataset.");
  console.log(JSON.stringify({result:"PASS",database:target.previewDatabase,primary:{name:primary.person.displayName,cards:2,activity:2,merchantUnits:3,practiceAvailable:["46500","13800"]},secondary:{name:secondary.person.displayName,cards:1,activity:1,merchantUnits:1,canManagePrimary:false},operator:{assignments:2,cases:1,customerEnrollments:0},historicalRows:0,deniedResourceChecks:8,scope:"Prepared baseline projections only; read-only, no API server, provider or real-money execution"}));
}finally{if(connected)await client.end();await closeDatabase();}

/** Explicit preparation only. Canonical commands seed an empty, marked fresh generation once. */
import {prepareSeedMarker} from "./fresh-seed-marker";
import {createHash} from "node:crypto";
import pg from "pg";
import {sql} from "drizzle-orm";
import {getDb,closeDatabase} from "../src/platform/database/client";
import {cards,serviceActivity} from "../src/platform/database/schema";
import {getRuntimeConfig} from "../src/platform/config";
import {assertFixtureIdentityAllowed} from "../src/modules/identity";
import {bindIdentity,createCardholderService} from "../src/modules/services/service";
import {operatorServiceAccess} from "../src/modules/operations/schema";
import {createSupportCase} from "../src/modules/cases/service";
import {merchantSetupEligibility} from "../src/modules/services/schema";
import {createPrimaryMerchant} from "../src/modules/services/create-merchant";
import {createInvitation,acceptInvitation} from "../src/modules/access/service";
import {createMerchantInvitation} from "../src/modules/access/merchant-service";
import {startCardRequest,updateCardRequest,submitCardRequest,addCardholderFunds,setCardholderSpendingLimit} from "../src/modules/workspace/service";
import {getCardholderDashboard} from "../src/modules/workspace/dashboard-service";
import {createOwnedSubmerchant,createChannel,getMerchantWorkspace,startMerchantSetup,updateMerchantSetup,submitMerchantSetup} from "../src/modules/acquiring/service";
import {configureTestGateway,enrollTestMerchant,setChannelActivation,refundMerchantPayment,createMerchantPayout,getMerchantOperations,processMerchantDeposit} from "../src/modules/acquiring/operations-service";
import {publishGuestChannel} from "../src/modules/acquiring/guest-service";
import {prepareCardCheckout,confirmCardCheckout} from "../src/modules/acquiring/card-checkout-service";
import {getMerchantDashboard} from "../src/modules/acquiring/dashboard-service";

const target=await import(new URL("./clean-preview-target.mjs",import.meta.url).href) as {
  previewDatabase:string;testDatabase:string;previewSeedKey:string;
  verifyPreviewRuntime:()=>Promise<void>;
  verifyPreviewDatabase:(client:pg.Client,options?:{requireComplete?:boolean})=>Promise<void>;
};
const issuer="urn:etail:isolated-fixture";
const seedLock="70248967515366424";

const cardPermissions=["cards.read","cards.hold","cards.purchase","cards.freeze","cards.unfreeze","activity.read","notifications.manage"] as const;

function command(label:string) {
  const hex=createHash("sha256").update(`${target.previewSeedKey}:${label}`).digest("hex");
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-4${hex.slice(13,16)}-8${hex.slice(17,20)}-${hex.slice(20,32)}`;
}
function assert(condition:unknown,message:string):asserts condition {if(!condition)throw new Error(message);}

async function guard(preview:boolean) {
  const config=getRuntimeConfig();
  assertFixtureIdentityAllowed({...config,fixtureIdentityEnabled:config.localFixtureIdentity});
  const {databaseConnectionSettings}=await import(new URL("./run-with-database.mjs",import.meta.url).href) as {databaseConnectionSettings:(options:{preview:boolean})=>{target:string;ci:boolean;databaseName:string}};
  const settings=databaseConnectionSettings({preview});
  assert(config.appEnv===(preview?"local":"test") && process.env.ENABLE_REAL_MONEY==="false" && process.env.DATABASE_URL===settings.target,
    "Explicit fresh preparation requires its exact test/preview target, fixture identity and disabled real money.");
  if(!settings.ci)await target.verifyPreviewRuntime();
  return settings;
}

async function bootstrap() {
  const primary=await bindIdentity(issuer,"owner","Alex Morgan");
  const secondary=await bindIdentity(issuer,"viewer","Jamie Morgan");
  const operator=await bindIdentity(issuer,"operator","Morgan Support");
  await getDb().transaction(async tx=>{
    // Fixture declaration only. Binding identity does not create any service or membership.
    for(const personId of [primary.personId,secondary.personId]) await tx.insert(merchantSetupEligibility).values({personId,personaKind:"FICTIONAL_ADULT"}).onConflictDoNothing();
  });
  const service=await createCardholderService(primary.personId,{commandId:command("primary-cardholder-service"),displayName:"Alex Morgan"});
  return {primaryId:primary.personId,secondaryId:secondary.personId,operatorId:operator.personId,serviceId:service.serviceId};
}

async function issueCard(primaryId:string,serviceId:string,holderId:string,label:string,nickname:string) {
  const request=await startCardRequest(primaryId,serviceId,{commandId:command(`${label}-start`)});
  // Replay uses the original payload, including the original reviewed versions.
  await updateCardRequest(primaryId,serviceId,request.id,{commandId:command(`${label}-save`),expectedVersion:1,holderId,nickname,format:"VIRTUAL"});
  const issued=await submitCardRequest(primaryId,serviceId,request.id,{commandId:command(`${label}-issue`),expectedVersion:2});
  assert(issued.status==="ISSUED"&&issued.issuedCardId,"Canonical sandbox issuance did not complete.");
  return issued.issuedCardId;
}

async function seed(client:pg.Client,databaseName:string) {
  const {primaryId,secondaryId,operatorId,serviceId}=await bootstrap();
  const invite=await createInvitation(primaryId,serviceId,{commandId:command("card-invitation"),recipientId:secondaryId,role:"SECONDARY",permissions:[...cardPermissions],delegablePermissions:[],expiresInDays:7});
  await acceptInvitation(secondaryId,invite.id,{commandId:command("card-acceptance"),expectedVersion:1});
  await addCardholderFunds(primaryId,serviceId,{commandId:command("group-topup"),amountMinor:"65000",currency:"USD",source:"SANDBOX_BANK"});
  await setCardholderSpendingLimit(primaryId,serviceId,primaryId,{commandId:command("primary-limit"),expectedVersion:0,monthlyLimitMinor:"50000"});
  await setCardholderSpendingLimit(primaryId,serviceId,secondaryId,{commandId:command("secondary-limit"),expectedVersion:0,monthlyLimitMinor:"15000"});
  const primaryCardId=await issueCard(primaryId,serviceId,primaryId,"alex-card","Everyday");
  const secondaryCardId=await issueCard(primaryId,serviceId,secondaryId,"jamie-card","Daily spending");

  const merchant=await createPrimaryMerchant(primaryId,{commandId:command("primary-merchant"),displayName:"Etail Studio"});
  const workspace=await getMerchantWorkspace(primaryId,merchant.merchantId);
  const merchantServiceId=workspace.merchant.master.serviceId;
  const application=await startMerchantSetup(primaryId,merchant.merchantId,{commandId:command("merchant-setup-start")});
  await updateMerchantSetup(primaryId,merchant.merchantId,application.id,{commandId:command("merchant-setup-save"),expectedVersion:1,legalEntityType:"SOLE_PROPRIETOR",sellingName:"Etail Studio",legalName:"Alex Morgan",activityDescription:"Fictional studio selling homewares online and at pop-up events.",country:"US",fictionalDetailsConfirmed:true});
  await submitMerchantSetup(primaryId,merchant.merchantId,application.id,{commandId:command("merchant-setup-submit"),expectedVersion:2});
  const online=await createOwnedSubmerchant(primaryId,merchant.merchantId,{commandId:command("online-submerchant"),displayName:"Online store"});
  const popup=await createOwnedSubmerchant(primaryId,merchant.merchantId,{commandId:command("popup-submerchant"),displayName:"Pop-up shop"});
  await configureTestGateway(primaryId,merchant.merchantId,{commandId:command("gateway"),expectedVersion:0,enabled:true});
  for(const [key,id] of [["primary",merchant.merchantId],["online",online.id],["popup",popup.id]] as const) await enrollTestMerchant(primaryId,id,{commandId:command(`${key}-enroll`),expectedVersion:0,enabled:true});
  const helperInvite=await createMerchantInvitation(primaryId,popup.id,{commandId:command("popup-invitation"),recipientId:secondaryId,permissions:["merchant.read","channels.read","channels.create","channels.update","channels.close","payments.read","payments.simulate","channels.share"],delegablePermissions:[],expiresInDays:7,accessExpiresInDays:30});
  await acceptInvitation(secondaryId,helperInvite.id,{commandId:command("popup-acceptance"),expectedVersion:1});
  const channels=[];
  for(const [key,unitId,creatorId,description,amountMinor] of [
    ["primary",merchant.merchantId,primaryId,"Studio order invoice","12000"],
    ["online",online.id,primaryId,"Online homewares order","4800"],
    ["popup",popup.id,secondaryId,"Pop-up shop purchase","1800"],
  ] as const) {
    const channel=await createChannel(creatorId,unitId,{commandId:command(`${key}-channel`),description,amountMinor,currency:"USD",usage:"REUSABLE",expiresAt:"2027-09-09T00:00:00.000Z",presentations:["SMS","EMAIL","INVOICE","BILL","SOCIAL","QR","WEB"],visibility:"CREATOR_PRIVATE"});
    await setChannelActivation(creatorId,unitId,channel.id,{commandId:command(`${key}-activate`),expectedVersion:0,expectedChannelVersion:1,active:true});
    const publication=await publishGuestChannel(creatorId,unitId,channel.id,{commandId:command(`${key}-publish`),expectedChannelVersion:1});
    assert(publication.publication,"Seed checkout publication missing");
    channels.push({key,id:channel.id,unitId,publicationId:publication.publication.id});
  }
  const onlineChannel=channels.find(row=>row.key==="online")!,popupChannel=channels.find(row=>row.key==="popup")!,primaryChannel=channels.find(row=>row.key==="primary")!;
  async function pay(label:string,payerId:string,cardId:string,publicationId:string,expectedCardVersion:number){
    const prepared=await prepareCardCheckout(payerId,publicationId,{commandId:command(`${label}-review`),cardServiceId:serviceId,cardId,expectedCardVersion});
    const paid=await confirmCardCheckout(payerId,publicationId,prepared.id);assert(paid.receipt,"Seed payment needs a receipt");return paid.receipt.paymentId;
  }
  await pay("primary-sale",primaryId,primaryCardId,primaryChannel.publicationId,1);
  const onlinePayment=await pay("online-sale",primaryId,primaryCardId,onlineChannel.publicationId,2);
  const returned=await pay("online-return",primaryId,primaryCardId,onlineChannel.publicationId,3);
  await refundMerchantPayment(primaryId,online.id,returned,{commandId:command("online-refund"),expectedVersion:1,reason:"Customer returned the order"});
  await pay("popup-sale",secondaryId,secondaryCardId,popupChannel.publicationId,1);
  await getDb().transaction(async tx=>{
    for(const assignedServiceId of [serviceId,merchantServiceId])await tx.insert(operatorServiceAccess).values({serviceId:assignedServiceId,personId:operatorId,state:"ACCEPTED",canRespond:true,canProcessDeposits:assignedServiceId===merchantServiceId}).onConflictDoNothing();
  });
  const reviewToken=createHash("sha256").update(JSON.stringify({serviceId:merchantServiceId,merchantUnitId:online.id,payments:[{id:onlinePayment,amount:"4800"}]})).digest("hex");
  const deposit=await createMerchantPayout(primaryId,online.id,{commandId:command("online-deposit"),reviewToken});
  await processMerchantDeposit(operatorId,deposit.id,{commandId:command("online-deposit-completed"),outcome:"COMPLETED"});

  const primaryCards=await getCardholderDashboard(primaryId),secondaryCards=await getCardholderDashboard(secondaryId);
  assert(primaryCards.cards.length===2&&primaryCards.cards.some(card=>card.id===primaryCardId)&&primaryCards.cards.some(card=>card.id===secondaryCardId),"The primary preview must contain exactly two cards sharing one funded group.");
  assert(secondaryCards.primaryService===null&&secondaryCards.cards.length===1&&secondaryCards.cards[0]?.id===secondaryCardId&&secondaryCards.activity.length===1&&secondaryCards.activity.every(row=>row.cardId===secondaryCardId),"Jamie must have only the accepted secondary card and own activity.");
  const primaryMerchant=await getMerchantDashboard(primaryId),secondaryMerchant=await getMerchantDashboard(secondaryId);
  assert(primaryMerchant.units.length===3&&secondaryMerchant.units.length===1&&secondaryMerchant.units[0]?.id===popup.id&&!secondaryMerchant.units[0]?.primaryAccess,"Merchant previews must preserve primary and single-submerchant boundaries.");
  const secondaryOperations=await getMerchantOperations(secondaryId,popup.id);
  assert(!secondaryOperations.canPayout&&!secondaryOperations.canConfigureGateway&&secondaryOperations.payments.every(payment=>!payment.canRefund),"Delegation must not grant primary financial controls.");
  const supportCase=await createSupportCase(secondaryId,serviceId,{commandId:command("jamie-support-case"),topic:"CARD",subject:"A question about my card",message:"Could you explain how to freeze my card while I look for it?",transactionId:null});
  const stale=await getDb().execute(sql`SELECT
    (SELECT count(*) FROM ${cards} WHERE ${cards.requestId} IS NULL)::int AS historical_cards,
    (SELECT count(*) FROM ${serviceActivity} WHERE ${serviceActivity.cardId} IS NULL)::int AS unattributed_activity`);
  assert(stale.rows.every(row=>Object.values(row).every(value=>Number(value)===0)),"Only records produced by the canonical commands can enter the fresh seed.");
  const result={primaryId,secondaryId,operatorId,serviceId,merchantServiceId,primaryCardId,secondaryCardId,primaryMerchantId:merchant.merchantId,submerchantIds:[online.id,popup.id],channels,supportCaseId:supportCase.id,
    counts:{people:3,services:2,cards:2,purchases:4,primaryMerchants:1,submerchants:2,channels:3,testPayments:4,testRefunds:1,testTransfers:1,supportCases:1,operatorAssignments:2},realMoney:false};
  await client.query("UPDATE public._etail_preview_seed SET state='COMPLETE',completed_at=now(),result=$2::jsonb WHERE key=$1",[target.previewSeedKey,JSON.stringify(result)]);
  console.log(JSON.stringify({prepared:true,database:databaseName,...result}));
}

export async function runFreshServiceSeed(preview:boolean) {
  const settings=await guard(preview);
  const client=new pg.Client({connectionString:settings.target,connectionTimeoutMillis:5000,application_name:"etail-fresh-services-seed"});
  let connected=false,locked=false;
  try {
    await client.connect();connected=true;
    if(preview)await target.verifyPreviewDatabase(client,{requireComplete:false});
    else {
      const result=await client.query("SELECT current_database(),current_user,version(),inet_server_addr()::text AS address,pg_get_userbyid(d.datdba) AS owner,shobj_description(d.oid,'pg_database') AS marker,(inet_server_addr() <<= inet '10.0.0.0/8' OR inet_server_addr() <<= inet '172.16.0.0/12' OR inet_server_addr() <<= inet '192.168.0.0/16') AS container_address FROM pg_database d WHERE d.datname=current_database()");
      const row=result.rows[0];
      assert(row.current_database===target.testDatabase&&row.current_user===(settings.ci?"etail_ci":"etail_local")&&row.owner===row.current_user&&row.marker==="ETAIL_DEPOT_NEXT_GREENFIELD_2026:fresh-services-d69:test"&&/^PostgreSQL 18\.6(?:\s|$)/.test(row.version)&&(["127.0.0.1/32","::1/128"].includes(row.address)||(settings.ci&&row.container_address===true)),"The exact owned fresh test generation could not be verified.");
    }
    await client.query("SET lock_timeout='20s'");
    await client.query("SELECT pg_advisory_lock($1::bigint)",[seedLock]);locked=true;
    const marker=await prepareSeedMarker(client,target.previewSeedKey);
    if(marker.state==="COMPLETE") console.log(JSON.stringify({prepared:false,database:settings.databaseName,message:"Already prepared; existing data, permissions and user changes preserved.",result:marker.result}));
    else await seed(client,settings.databaseName);
  } finally {
    try {if(locked)await client.query("SELECT pg_advisory_unlock($1::bigint)",[seedLock]);}
    finally {if(connected)await client.end();await closeDatabase();}
  }
}

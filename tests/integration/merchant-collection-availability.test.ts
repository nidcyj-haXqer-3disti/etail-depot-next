import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {ledgerEntries} from "../../src/modules/ledger/schema";
import {merchantSetupEligibility} from "../../src/modules/services/schema";
import {acceptInvitation} from "../../src/modules/access/service";
import {merchantPermissionGrants} from "../../src/modules/access/schema";
import {createMerchantInvitation,getMerchantAccessOverview,revokeMerchantAccess} from "../../src/modules/access/merchant-service";
import {paymentChannels} from "../../src/modules/acquiring/schema";
import {createChannel,pauseMerchant} from "../../src/modules/acquiring/service";
import {getMerchantDashboard} from "../../src/modules/acquiring/dashboard-service";
import {merchantDashboardProjectionSchema} from "../../src/modules/acquiring/dashboard-contracts";
import {configureTestGateway,enrollTestMerchant,getMerchantOperations,setChannelActivation,simulateMerchantPayment} from "../../src/modules/acquiring/operations-service";
import {merchantAccessFixture,merchantOffer} from "../helpers/merchant-access";
import {paymentInput} from "../helpers/acquiring";

afterAll(closeDatabase);

it("distinguishes primary payment setup from a delegate's next step without enabling any command",async()=>{
  const f=await merchantAccessFixture();
  const unit=async(personId:string)=>(merchantDashboardProjectionSchema.parse(await getMerchantDashboard(personId))).units.find(row=>row.id===f.unit.id)!;
  const before=await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId,f.merchant.serviceId));
  expect((await unit(f.merchant.personId)).collectionAvailability).toMatchObject({code:"SETUP_REQUIRED",action:{href:`/merchants/${f.unit.id}?tab=verification`}});
  expect((await unit(f.operator.personId)).collectionAvailability).toMatchObject({code:"PRIMARY_ACTION_REQUIRED",action:{href:`/merchants/${f.unit.id}?tab=help`}});
  expect((await unit(f.operator.personId)).collectionAvailability.description).toContain(f.master.displayName);
  await expect(configureTestGateway(f.operator.personId,f.master.id,{commandId:randomUUID(),expectedVersion:0,enabled:true})).rejects.toMatchObject({status:404});
  await configureTestGateway(f.merchant.personId,f.master.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});
  expect((await unit(f.operator.personId)).collectionAvailability.code).toBe("PRIMARY_ACTION_REQUIRED");
  await enrollTestMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});
  for(const personId of [f.merchant.personId,f.operator.personId])expect(await unit(personId)).toMatchObject({setupState:"READY",totals:{activeChannelCount:0},collectionAvailability:{code:"CHANNEL_REQUIRED",action:{href:`/merchants/${f.unit.id}?tab=channels&new=1`}}});
  await configureTestGateway(f.merchant.personId,f.master.id,{commandId:randomUUID(),expectedVersion:1,enabled:false});
  expect((await unit(f.operator.personId)).collectionAvailability.code).toBe("PRIMARY_ACTION_REQUIRED");
  expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId,f.merchant.serviceId))).toEqual(before);
});

it("requires a visible active unexpired unused channel rather than payment setup alone",async()=>{
  const f=await merchantAccessFixture();
  await configureTestGateway(f.merchant.personId,f.master.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});
  await enrollTestMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});
  const unit=async(personId=f.operator.personId)=>(await getMerchantDashboard(personId)).units.find(row=>row.id===f.unit.id)!;
  const hidden=await createChannel(f.merchant.personId,f.unit.id,{...paymentInput(),presentations:["WEB"],visibility:"CREATOR_PRIVATE"});
  await setChannelActivation(f.merchant.personId,f.unit.id,hidden.id,{commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:hidden.version,active:true});
  expect(await unit()).toMatchObject({totals:{channelCount:0,activeChannelCount:0},collectionAvailability:{code:"CHANNEL_REQUIRED"}});
  expect(await unit(f.merchant.personId)).toMatchObject({collectionAvailability:{code:"READY"}});
  const channel=await createChannel(f.operator.personId,f.unit.id,{...paymentInput(),presentations:["WEB"],visibility:"CREATOR_PRIVATE"});
  expect(await unit()).toMatchObject({totals:{channelCount:1,activeChannelCount:0},collectionAvailability:{code:"CHANNEL_REVIEW_REQUIRED"}});
  await setChannelActivation(f.operator.personId,f.unit.id,channel.id,{commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:channel.version,active:true});
  expect(await unit()).toMatchObject({totals:{activeChannelCount:1},collectionAvailability:{code:"READY",action:{href:`/merchants/${f.unit.id}?tab=channels`}}});
  await simulateMerchantPayment(f.operator.personId,f.unit.id,channel.id,{commandId:randomUUID(),expectedChannelVersion:channel.version,outcome:"APPROVED"});
  expect(await unit()).toMatchObject({totals:{activeChannelCount:0},collectionAvailability:{code:"CHANNEL_REVIEW_REQUIRED"}});
  const expired=await createChannel(f.operator.personId,f.unit.id,{...paymentInput(),presentations:["WEB"],visibility:"CREATOR_PRIVATE"});
  await setChannelActivation(f.operator.personId,f.unit.id,expired.id,{commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:expired.version,active:true});
  // Isolated fixture time boundary; the canonical activation/payment paths remain unchanged.
  await getDb().update(paymentChannels).set({expiresAt:new Date(Date.now()-1000)}).where(eq(paymentChannels.id,expired.id));
  expect(await unit()).toMatchObject({totals:{channelCount:2,activeChannelCount:0},collectionAvailability:{code:"CHANNEL_REVIEW_REQUIRED"}});
});

it("keeps read-only and restricted collection access separate from usable payment commands",async()=>{
  const f=await merchantAccessFixture();
  await configureTestGateway(f.merchant.personId,f.master.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});
  await enrollTestMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});
  const offer=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.helper.personId,["merchant.read","channels.read"]));
  await acceptInvitation(f.helper.personId,offer.id,{commandId:randomUUID(),expectedVersion:offer.version});
  const unit=async(personId=f.helper.personId)=>(await getMerchantDashboard(personId)).units.find(row=>row.id===f.unit.id)!;
  expect(await unit()).toMatchObject({canCreateChannel:false,totals:{available:null},collectionAvailability:{code:"ACCESS_RESTRICTED",action:{href:`/merchants/${f.unit.id}?tab=help`}}});
  const shared=await createChannel(f.operator.personId,f.unit.id,{...paymentInput(),presentations:["WEB"],visibility:"ASSIGNED"});
  await setChannelActivation(f.operator.personId,f.unit.id,shared.id,{commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:shared.version,active:true});
  expect(await unit()).toMatchObject({canCreateChannel:false,collectionAvailability:{code:"READY",action:{label:"View payment channels"}}});
  expect(await getMerchantOperations(f.helper.personId,f.unit.id)).toMatchObject({canConfigureGateway:false,canEnroll:false,canPayout:false,canReadPayments:false,channels:[{canActivate:false}]});
  await expect(simulateMerchantPayment(f.helper.personId,f.unit.id,shared.id,{commandId:randomUUID(),expectedChannelVersion:shared.version,outcome:"APPROVED"})).rejects.toMatchObject({status:403});
  await getDb().update(merchantSetupEligibility).set({personaKind:"FICTIONAL_SUPERVISED"}).where(eq(merchantSetupEligibility.personId,f.operator.personId));
  expect(await unit(f.operator.personId)).toMatchObject({canCreateChannel:false,collectionAvailability:{code:"ACCESS_RESTRICTED"}});
  const member=(await getMerchantAccessOverview(f.merchant.personId,f.unit.id)).people.find(person=>person.personId===f.helper.personId)!;
  await getDb().delete(merchantPermissionGrants).where(and(eq(merchantPermissionGrants.assignmentId,member.id),eq(merchantPermissionGrants.action,"channels.read")));
  expect(await unit()).toMatchObject({totals:{channelCount:null,activeChannelCount:null},collectionAvailability:{code:"ACCESS_RESTRICTED",action:{href:`/merchants/${f.unit.id}?tab=help`}}});
  await revokeMerchantAccess(f.merchant.personId,f.unit.id,member.id,{commandId:randomUUID(),expectedVersion:member.version});
  expect((await getMerchantDashboard(f.helper.personId)).units).toEqual([]);
});

it("preserves readable primary history while a pause removes delegated collection access",async()=>{
  const f=await merchantAccessFixture();
  await pauseMerchant(f.merchant.personId,f.master.id,{commandId:randomUUID(),expectedVersion:f.master.version,reason:"Review collection setup"});
  const primary=await getMerchantDashboard(f.merchant.personId);
  expect(primary.units).toHaveLength(2);
  for(const unit of primary.units)expect(unit).toMatchObject({canCreateChannel:false,collectionAvailability:{code:"PAUSED",action:{href:`/merchants/${unit.id}?tab=verification`}}});
  expect((await getMerchantDashboard(f.operator.personId)).units).toEqual([]);
});

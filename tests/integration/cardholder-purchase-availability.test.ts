import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {cards,permissionGrants} from "../../src/platform/database/schema";
import {ledgerEntries} from "../../src/modules/ledger/schema";
import {merchantSetupEligibility} from "../../src/modules/services/schema";
import {getCardholderDashboardFocus} from "../../src/modules/workspace/dashboard-service";
import {controlCard,purchaseCard} from "../../src/modules/workspace/service";
import {cardPerson,cardPrimary,enrollCardholder,issuePracticeCard} from "../helpers/cardholder";

afterAll(closeDatabase);

it("explains the current purchase gate without allowing a primary to spend as another cardholder",async()=>{
  const primary=await cardPrimary("Primary manager"),secondary=await cardPerson("Named spender");
  await enrollCardholder(primary.personId,primary.serviceId,secondary);
  const issued=await issuePracticeCard(primary.personId,primary.serviceId,secondary,"Everyday","100");
  const focus=async(personId=secondary)=>(await getCardholderDashboardFocus(personId,issued.card.id)).card;
  const beforeRead=await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId,primary.serviceId));
  expect(await focus()).toMatchObject({canPurchase:true,purchaseAvailability:{code:"READY"}});
  expect(await focus(primary.personId)).toMatchObject({canPurchase:false,purchaseAvailability:{code:"OTHER_CARDHOLDER",title:"Named spender’s card"}});
  await expect(purchaseCard(primary.personId,primary.serviceId,issued.card.id,{commandId:randomUUID(),expectedVersion:issued.card.version,amountMinor:"1",description:"Cannot impersonate holder"})).rejects.toMatchObject({status:403});
  expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId,primary.serviceId))).toEqual(beforeRead);

  const frozen=await controlCard(primary.personId,primary.serviceId,issued.card.id,{commandId:randomUUID(),expectedVersion:issued.card.version,action:"freeze"});
  expect(await focus()).toMatchObject({canPurchase:false,purchaseAvailability:{code:"FROZEN",description:"Ask your primary cardholder to review the freeze before making a purchase."}});
  expect(await focus(primary.personId)).toMatchObject({canPurchase:false,purchaseAvailability:{code:"OTHER_CARDHOLDER"}});
  await expect(purchaseCard(secondary,primary.serviceId,issued.card.id,{commandId:randomUUID(),expectedVersion:frozen.version,amountMinor:"1",description:"Frozen remains denied"})).rejects.toMatchObject({code:"CARD_FROZEN"});

  await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,primary.serviceId),eq(permissionGrants.personId,secondary),eq(permissionGrants.action,"cards.purchase")));
  expect(await focus()).toMatchObject({canPurchase:false,purchaseAvailability:{code:"ACCESS_RESTRICTED"}});
  await expect(purchaseCard(secondary,primary.serviceId,issued.card.id,{commandId:randomUUID(),expectedVersion:frozen.version,amountMinor:"1",description:"Revoked access remains denied"})).rejects.toMatchObject({status:403});
  await getDb().update(permissionGrants).set({state:"ACCEPTED"}).where(and(eq(permissionGrants.serviceId,primary.serviceId),eq(permissionGrants.personId,secondary),eq(permissionGrants.action,"cards.purchase")));
  const active=await controlCard(primary.personId,primary.serviceId,issued.card.id,{commandId:randomUUID(),expectedVersion:frozen.version,action:"unfreeze"});
  const spent=await purchaseCard(secondary,primary.serviceId,issued.card.id,{commandId:randomUUID(),expectedVersion:active.version,amountMinor:"100",description:"Spend exact available funds"});
  expect(spent.card).toMatchObject({canPurchase:false,available:{minor:"0"},purchaseAvailability:{code:"NO_FUNDS"}});
  expect(await focus(primary.personId)).toMatchObject({canPurchase:false,purchaseAvailability:{code:"OTHER_CARDHOLDER"}});
  await expect(purchaseCard(secondary,primary.serviceId,issued.card.id,{commandId:randomUUID(),expectedVersion:spent.card.version,amountMinor:"1",description:"No funds remains denied"})).rejects.toMatchObject({code:"INSUFFICIENT_PRACTICE_FUNDS"});
});

it("keeps holder setup and card-holding permission explicit without creating guardian funding or changing cards",async()=>{
  const primary=await cardPrimary(),issued=await issuePracticeCard(primary.personId,primary.serviceId,primary.personId,"Setup card","100");
  const focus=async()=>(await getCardholderDashboardFocus(primary.personId,issued.card.id)).card;
  const before=await getDb().select().from(cards).where(eq(cards.id,issued.card.id));
  await getDb().update(merchantSetupEligibility).set({personaKind:"FICTIONAL_SUPERVISED"}).where(eq(merchantSetupEligibility.personId,primary.personId));
  expect(await focus()).toMatchObject({canPurchase:false,purchaseAvailability:{code:"SETUP_REQUIRED"}});
  expect((await focus()).purchaseAvailability.description).toContain("guardian funding");
  await expect(purchaseCard(primary.personId,primary.serviceId,issued.card.id,{commandId:randomUUID(),expectedVersion:issued.card.version,amountMinor:"1",description:"No invented supervised authority"})).rejects.toMatchObject({status:403});
  await getDb().delete(merchantSetupEligibility).where(eq(merchantSetupEligibility.personId,primary.personId));
  expect(await focus()).toMatchObject({canPurchase:false,purchaseAvailability:{code:"SETUP_REQUIRED",description:"Complete your sandbox setup before making a purchase."}});
  await getDb().insert(merchantSetupEligibility).values({personId:primary.personId,personaKind:"FICTIONAL_ADULT"});
  await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,primary.serviceId),eq(permissionGrants.personId,primary.personId),eq(permissionGrants.action,"cards.hold")));
  expect(await focus()).toMatchObject({canPurchase:false,purchaseAvailability:{code:"ACCESS_RESTRICTED"}});
  expect(await getDb().select().from(cards).where(eq(cards.id,issued.card.id))).toEqual(before);
});

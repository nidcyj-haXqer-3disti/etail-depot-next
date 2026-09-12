import {fundCardGroup,setPersonLimit} from "../helpers/cardholder";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { eq,sql } from "drizzle-orm";
import { afterAll,describe,expect,it } from "vitest";
import { closeDatabase,getDb } from "../../src/platform/database/client";
import { cards } from "../../src/platform/database/schema";
import { ledgerEntries } from "../../src/modules/ledger/schema";
import { controlCard,getWorkspace,purchaseCard } from "../../src/modules/workspace/service";
import { getCardholderDashboardDetail } from "../../src/modules/workspace/dashboard-service";
import { cardPerson,cardPrimary,enrollCardholder,issuePracticeCard } from "../helpers/cardholder";

afterAll(closeDatabase);
async function setup(){
 const primary=await cardPrimary("Restriction primary"),holder=await cardPerson("Restriction holder");
 await enrollCardholder(primary.personId,primary.serviceId,holder);
 const {card}=await (async()=>{await fundCardGroup(primary.personId,primary.serviceId,"3000");await setPersonLimit(primary.personId,primary.serviceId,holder,"3000");return issuePracticeCard(primary.personId,primary.serviceId,holder,"Controlled card");})();
 const journal=()=>getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId,primary.serviceId)).orderBy(ledgerEntries.id);
 return {...primary,holder,card,journal};
}
describe("primary and holder card restriction ownership",()=>{
 it("cannot remove a primary freeze with secondary permission or a forged unfreeze command",async()=>{
  const f=await setup(),before=await f.journal();
  const frozen=await controlCard(f.personId,f.serviceId,f.card.id,{commandId:randomUUID(),expectedVersion:f.card.version,action:"freeze"});
  expect(frozen).toMatchObject({status:"FROZEN",freeze:{primary:true,holder:false,reviewRequired:false}});
  const own=(await getWorkspace(f.holder,f.serviceId)).cards[0]!;
  expect(own).toMatchObject({canUnfreeze:false,canFreeze:true,canPurchase:false});
  expect(own.freeze.description).toContain("primary cardholder");
  await expect(controlCard(f.holder,f.serviceId,f.card.id,{commandId:randomUUID(),expectedVersion:own.version,action:"unfreeze"})).rejects.toMatchObject({code:"PRIMARY_FREEZE_ACTIVE",status:422});
  await expect(purchaseCard(f.holder,f.serviceId,f.card.id,{commandId:randomUUID(),expectedVersion:own.version,amountMinor:"1",description:"Blocked by primary"})).rejects.toMatchObject({code:"CARD_FROZEN"});
  expect((await getWorkspace(f.holder,f.serviceId)).cards[0]).toMatchObject({version:frozen.version,available:{minor:"3000"},freeze:{primary:true}});
  expect(await f.journal()).toEqual(before);
 });
 it("keeps both restrictions until an authorized removal and records truthful actor history",async()=>{
  const f=await setup(),before=await f.journal();
  let card=await controlCard(f.holder,f.serviceId,f.card.id,{commandId:randomUUID(),expectedVersion:f.card.version,action:"freeze"});
  const primaryView=(await getWorkspace(f.personId,f.serviceId)).cards[0]!;
  expect(primaryView).toMatchObject({canFreeze:true,canUnfreeze:true,freeze:{freezeLabel:"Keep card frozen"}});
  card=await controlCard(f.personId,f.serviceId,card.id,{commandId:randomUUID(),expectedVersion:card.version,action:"freeze"});
  expect(card.freeze).toMatchObject({primary:true,holder:true});
  const own=(await getWorkspace(f.holder,f.serviceId)).cards[0]!;
  expect(own.freeze.unfreezeLabel).toBe("Remove your freeze");
  card=await controlCard(f.holder,f.serviceId,card.id,{commandId:randomUUID(),expectedVersion:card.version,action:"unfreeze"});
  expect(card).toMatchObject({status:"FROZEN",canUnfreeze:false,canPurchase:false,freeze:{primary:true,holder:false}});
  const detail=await getCardholderDashboardDetail(f.holder,{card:card.id});
  expect(detail?.cardHistory?.events.map(event=>[event.label,event.actorName])).toEqual([["Unfreeze recorded","Restriction holder"],["Freeze recorded","Restriction primary"],["Freeze recorded","Restriction holder"]]);
  card=await controlCard(f.personId,f.serviceId,card.id,{commandId:randomUUID(),expectedVersion:card.version,action:"unfreeze"});
  expect(card).toMatchObject({status:"ACTIVE",freeze:{primary:false,holder:false,reviewRequired:false},available:{minor:"3000"}});
  expect((await getWorkspace(f.holder,f.serviceId)).cards[0]!.canPurchase).toBe(true);
  expect(await f.journal()).toEqual(before);
 });
 it("replayed earlier holder removal cannot undo a later primary freeze",async()=>{
  const f=await setup();
  let card=await controlCard(f.holder,f.serviceId,f.card.id,{commandId:randomUUID(),expectedVersion:f.card.version,action:"freeze"});
  const remove={commandId:randomUUID(),expectedVersion:card.version,action:"unfreeze" as const};
  card=await controlCard(f.holder,f.serviceId,card.id,remove);
  card=await controlCard(f.personId,f.serviceId,card.id,{commandId:randomUUID(),expectedVersion:card.version,action:"freeze"});
  expect(await controlCard(f.holder,f.serviceId,card.id,remove)).toMatchObject({status:"FROZEN",version:card.version,canUnfreeze:false,freeze:{primary:true}});
  const outsider=await cardPrimary("Unrelated restriction owner");
  await expect(getCardholderDashboardDetail(outsider.personId,{card:card.id})).rejects.toMatchObject({status:404});
 });
 it("primary removal explicitly clears holder and earlier restrictions without changing money",async()=>{
  const f=await setup(),before=await f.journal();
  // Represents a preserved pre-migration freeze with no reliable owner snapshot.
  await getDb().update(cards).set({status:"FROZEN",freezeReviewRequired:true,holderFrozen:true}).where(eq(cards.id,f.card.id));
  const holder=(await getWorkspace(f.holder,f.serviceId)).cards[0]!;
  expect(holder.freeze.description).toContain("earlier freeze");
  const remaining=await controlCard(f.holder,f.serviceId,f.card.id,{commandId:randomUUID(),expectedVersion:holder.version,action:"unfreeze"});
  expect(remaining).toMatchObject({status:"FROZEN",canUnfreeze:false,freeze:{reviewRequired:true,holder:false}});
  const primary=(await getWorkspace(f.personId,f.serviceId)).cards[0]!;
  expect(primary.freeze.unfreezeDescription).toContain("all current freezes");
  const active=await controlCard(f.personId,f.serviceId,primary.id,{commandId:randomUUID(),expectedVersion:primary.version,action:"unfreeze"});
  expect(active).toMatchObject({status:"ACTIVE",freeze:{reviewRequired:false,primary:false,holder:false}});
  expect(await f.journal()).toEqual(before);
 });
 it("concurrent primary and holder freezes preserve version checks and both accepted intents",async()=>{
  const f=await setup();
  const results=await Promise.allSettled([f.personId,f.holder].map(actor=>controlCard(actor,f.serviceId,f.card.id,{commandId:randomUUID(),expectedVersion:f.card.version,action:"freeze"})));
  expect(results.filter(result=>result.status==="fulfilled")).toHaveLength(1);
  const failed=results.findIndex(result=>result.status==="rejected");
  expect((results[failed] as PromiseRejectedResult).reason).toMatchObject({code:"STALE_VERSION"});
  const current=(await getWorkspace(f.personId,f.serviceId)).cards[0]!;
  const finished=await controlCard([f.personId,f.holder][failed]!,f.serviceId,current.id,{commandId:randomUUID(),expectedVersion:current.version,action:"freeze"});
  expect(finished).toMatchObject({status:"FROZEN",freeze:{primary:true,holder:true}});
 });
 it("the additive migration preserves frozen status, balances and versions without guessing provenance",async()=>{
  const migration=await readFile(new URL("../../netlify/database/migrations/20260911104524_card_restriction_ownership/migration.sql",import.meta.url),"utf8");
  await getDb().transaction(async tx=>{
   await tx.execute(sql`CREATE TEMPORARY TABLE cards (id text PRIMARY KEY,status text NOT NULL,balance bigint NOT NULL,version integer NOT NULL) ON COMMIT DROP`);
   await tx.execute(sql`INSERT INTO cards VALUES ('active','ACTIVE',1234,3),('frozen','FROZEN',9876,9)`);
   await tx.execute(sql.raw(migration));
   const rows=await tx.execute(sql`SELECT * FROM cards ORDER BY id`);
   expect(rows.rows).toMatchObject([{id:"active",status:"ACTIVE",balance:"1234",version:3,primaryFrozen:false,holderFrozen:false,freezeReviewRequired:false},{id:"frozen",status:"FROZEN",balance:"9876",version:9,primaryFrozen:false,holderFrozen:false,freezeReviewRequired:true}]);
  });
 });
});

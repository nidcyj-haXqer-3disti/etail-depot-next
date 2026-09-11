import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import pg from "pg";
import { afterAll, expect, it } from "vitest";
import { and, eq } from "drizzle-orm";
import { controlCard, getWorkspace, startCardRequest, updateCardRequest, submitCardRequest, purchaseCard } from "../../src/modules/workspace/service";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { cardRequests, workspaceCommands, cards, serviceActivity } from "../../src/platform/database/schema";
import { getBalance } from "../../src/modules/ledger";
import { ledgerEntries, ledgerJournals } from "../../src/modules/ledger/schema";
import { cardPrimary, cardPerson, enrollCardholder, fundCardGroup, setPersonLimit, issuePracticeCard } from "../helpers/cardholder";
afterAll(closeDatabase);

async function fixture(funds = "100", monthlyLimit = funds) {
  const owner=await cardPrimary("Concurrent card user");
  const serviceId=owner.serviceId;
  await fundCardGroup(owner.personId,serviceId,funds);
  await setPersonLimit(owner.personId,serviceId,owner.personId,monthlyLimit);
  const {card}=await issuePracticeCard(owner.personId,serviceId,owner.personId,"Control practice card");
  return {owner,serviceId,card};
}
async function blockedBy(observer:pg.Client,pid:number) {
  const deadline=Date.now()+5000;
  while(Date.now()<deadline) {
    const result=await observer.query<{pid:number}>("SELECT pid FROM pg_stat_activity WHERE datname=current_database() AND $1::integer=ANY(pg_blocking_pids(pid)) ORDER BY pid LIMIT 1",[pid]);
    if(result.rows[0]) return result.rows[0].pid;
    await delay(10);
  }
  throw new Error("Expected a real PostgreSQL lock wait for the workspace command.");
}
it("concurrent transport retries create one saved draft and one receipt; a deliberate new request remains separate",async()=>{
  const owner=await cardPrimary("Concurrent draft user"),serviceId=owner.serviceId,input={commandId:randomUUID()};
  const replies=await Promise.all(Array.from({length:8},()=>startCardRequest(owner.personId,serviceId,input)));
  expect(new Set(replies.map(row=>row.id)).size).toBe(1);
  expect(await getDb().select().from(cardRequests).where(and(eq(cardRequests.serviceId,serviceId),eq(cardRequests.creatorId,owner.personId)))).toHaveLength(1);
  expect(await getDb().select().from(workspaceCommands).where(eq(workspaceCommands.commandId,input.commandId))).toHaveLength(1);
  const separate=await startCardRequest(owner.personId,serviceId,{commandId:randomUUID()});
  expect(separate.id).not.toBe(replies[0]!.id);
});
it("two genuinely overlapping stale card forms cannot both change the row",async()=>{
  const {owner,serviceId,card}=await fixture();
  const locker=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-workspace-row-barrier"});
  const observer=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-workspace-observer"});
  const pending:Promise<unknown>[]=[];let open=false;
  try {
    await locker.connect();await observer.connect();await locker.query("BEGIN");open=true;
    const {rows:[row]}=await locker.query<{pid:number}>("SELECT pg_backend_pid() AS pid");
    await locker.query('SELECT id FROM cards WHERE id=$1 FOR UPDATE',[card.id]);
    const first=controlCard(owner.personId,serviceId,card.id,{commandId:randomUUID(),expectedVersion:1,action:"freeze"});pending.push(first);void first.catch(()=>undefined);
    const firstPid=await blockedBy(observer,row!.pid);
    const second=controlCard(owner.personId,serviceId,card.id,{commandId:randomUUID(),expectedVersion:1,action:"freeze"});pending.push(second);void second.catch(()=>undefined);
    const secondPid=await blockedBy(observer,firstPid);
    expect(secondPid).not.toBe(firstPid);
    await locker.query("COMMIT");open=false;
    expect(await first).toMatchObject({status:"FROZEN",version:2});
    await expect(second).rejects.toThrow("STALE_VERSION");
    expect((await getWorkspace(owner.personId,serviceId)).cards.find(row=>row.id===card.id)).toMatchObject({status:"FROZEN",version:2});
  } finally {
    if(open) await locker.query("ROLLBACK");
    await Promise.allSettled(pending);await Promise.all([locker.end(),observer.end()]);
  }
});
it("an in-flight grant revocation is rechecked after its row lock releases",async()=>{
  const {owner,serviceId,card}=await fixture();
  const locker=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-workspace-revocation-barrier"});
  const observer=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-workspace-observer"});
  const pending:Promise<unknown>[]=[];let open=false;
  try {
    await locker.connect();await observer.connect();await locker.query("BEGIN");open=true;
    const {rows:[row]}=await locker.query<{pid:number}>("SELECT pg_backend_pid() AS pid");
    await locker.query('UPDATE permission_grants SET state=\'REVOKED\' WHERE "serviceId"=$1 AND "personId"=$2 AND action=\'cards.freeze\'',[serviceId,owner.personId]);
    const change=controlCard(owner.personId,serviceId,card.id,{commandId:randomUUID(),expectedVersion:1,action:"freeze"});pending.push(change);void change.catch(()=>undefined);
    await blockedBy(observer,row!.pid);
    await locker.query("COMMIT");open=false;
    await expect(change).rejects.toThrow("ACTION_DENIED");
    expect((await getWorkspace(owner.personId,serviceId)).cards.find(row=>row.id===card.id)).toMatchObject({status:"ACTIVE",version:1});
  } finally {
    if(open) await locker.query("ROLLBACK");
    await Promise.allSettled(pending);await Promise.all([locker.end(),observer.end()]);
  }
});

async function fundedFixture() {
  const base = await fixture("10000", "20000");
  const draft = await startCardRequest(base.owner.personId,base.serviceId,{commandId:randomUUID()});
  const saved = await updateCardRequest(base.owner.personId,base.serviceId,draft.id,{commandId:randomUUID(),expectedVersion:1,holderId:base.owner.personId,nickname:"Concurrent practice",format:"VIRTUAL"});
  return {...base,draft:saved};
}
it("concurrent issuance retries produce one card and no new money or limit",async()=>{
  const {owner,serviceId,draft}=await fundedFixture();const input={commandId:randomUUID(),expectedVersion:draft.version};
  const before = await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId,serviceId)).orderBy(ledgerEntries.journalId,ledgerEntries.lineNumber);
  const replies=await Promise.all(Array.from({length:6},()=>submitCardRequest(owner.personId,serviceId,draft.id,input)));
  expect(new Set(replies.map(reply=>reply.issuedCardId)).size).toBe(1);
  expect(replies.every(reply=>reply.status==="ISSUED")).toBe(true);
  expect(await getDb().select().from(cards).where(eq(cards.requestId,draft.id))).toHaveLength(1);
  expect(await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.businessKey,`card-funding:${draft.id}`))).toHaveLength(0);
  expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId,serviceId)).orderBy(ledgerEntries.journalId,ledgerEntries.lineNumber)).toEqual(before);
  expect(await getDb().transaction(tx=>getBalance(tx,{serviceId,bucket:"GROUP_AVAILABLE"}))).toBe(10000n);
  const card=(await getWorkspace(owner.personId,serviceId)).cards.find(row=>row.id===replies[0]!.issuedCardId);
  expect(card).toMatchObject({available:{minor:"10000"},spending:{monthlyLimit:{minor:"20000"}}});
  expect(await getDb().select().from(workspaceCommands).where(eq(workspaceCommands.commandId,input.commandId))).toHaveLength(1);
});
it("overlapping purchases retain card-version checks and refreshed attempts cannot overspend group funds",async()=>{
  const {owner,serviceId,draft}=await fundedFixture();
  const issued=await submitCardRequest(owner.personId,serviceId,draft.id,{commandId:randomUUID(),expectedVersion:draft.version});const cardId=issued.issuedCardId!;
  const locker=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-purchase-backing-barrier"});
  const observer=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-purchase-observer"});
  const pending:Promise<unknown>[]=[];let open=false;
  try {
    await locker.connect();await observer.connect();await locker.query("BEGIN");open=true;
    const {rows:[row]}=await locker.query<{pid:number}>("SELECT pg_backend_pid() AS pid");
    await locker.query('SELECT id FROM cards WHERE id=$1 FOR UPDATE',[cardId]);
    const input={commandId:randomUUID(),expectedVersion:1,amountMinor:"6000",description:"Concurrent groceries"};
    const first=purchaseCard(owner.personId,serviceId,cardId,input);pending.push(first);void first.catch(()=>undefined);
    const firstPid=await blockedBy(observer,row!.pid);
    const second=purchaseCard(owner.personId,serviceId,cardId,{...input,commandId:randomUUID()});pending.push(second);void second.catch(()=>undefined);
    await blockedBy(observer,firstPid);await locker.query("COMMIT");open=false;
    const result=await first;expect(result.card.available.minor).toBe("4000");await expect(second).rejects.toThrow("STALE_VERSION");
    const replays=await Promise.all(Array.from({length:4},()=>purchaseCard(owner.personId,serviceId,cardId,input)));
    expect(new Set(replays.map(reply=>reply.activity.id)).size).toBe(1);
    await expect(purchaseCard(owner.personId,serviceId,cardId,{...input,commandId:randomUUID(),expectedVersion:2})).rejects.toThrow("INSUFFICIENT_PRACTICE_FUNDS");
    expect(await getDb().select().from(serviceActivity).where(eq(serviceActivity.cardId,cardId))).toHaveLength(1);
    expect(await getDb().transaction(tx=>getBalance(tx,{serviceId,bucket:"GROUP_AVAILABLE"}))).toBe(4000n);
    expect(await getDb().transaction(tx=>getBalance(tx,{serviceId,bucket:"CARD_SPENT",cardId}))).toBe(6000n);
  } finally {if(open)await locker.query("ROLLBACK");await Promise.allSettled(pending);await Promise.all([locker.end(),observer.end()]);}
});

it("overlapping purchases by different holders cannot spend the same shared group funds",async()=>{
  const {owner,serviceId,card}=await fixture("10000","10000");
  const secondId=await cardPerson("Concurrent secondary payer");
  await enrollCardholder(owner.personId,serviceId,secondId);
  await setPersonLimit(owner.personId,serviceId,secondId,"10000");
  const secondCard=(await issuePracticeCard(owner.personId,serviceId,secondId,"Secondary shared-funds card")).card;
  const locker=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-group-funds-barrier"});
  const observer=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-group-funds-observer"});
  const pending:Promise<unknown>[]=[];let open=false;
  const firstInput={commandId:randomUUID(),expectedVersion:card.version,amountMinor:"6000",description:"Primary shared-funds purchase"};
  const secondInput={commandId:randomUUID(),expectedVersion:secondCard.version,amountMinor:"6000",description:"Secondary shared-funds purchase"};
  try {
    await locker.connect();await observer.connect();await locker.query("BEGIN");open=true;
    const {rows:[row]}=await locker.query<{pid:number}>("SELECT pg_backend_pid() AS pid");
    await locker.query('SELECT id FROM cards WHERE id=$1 FOR UPDATE',[card.id]);
    const first=purchaseCard(owner.personId,serviceId,card.id,firstInput);pending.push(first);void first.catch(()=>undefined);
    const firstPid=await blockedBy(observer,row!.pid);
    const second=purchaseCard(secondId,serviceId,secondCard.id,secondInput);pending.push(second);void second.catch(()=>undefined);
    const secondPid=await blockedBy(observer,firstPid);expect(secondPid).not.toBe(firstPid);
    await locker.query("COMMIT");open=false;
    expect((await first).card.available.minor).toBe("4000");
    await expect(second).rejects.toThrow("INSUFFICIENT_PRACTICE_FUNDS");
    expect(await getDb().transaction(tx=>getBalance(tx,{serviceId,bucket:"GROUP_AVAILABLE"}))).toBe(4000n);
    expect(await getDb().transaction(tx=>getBalance(tx,{serviceId,cardId:card.id,bucket:"CARD_SPENT"}))).toBe(6000n);
    expect(await getDb().transaction(tx=>getBalance(tx,{serviceId,cardId:secondCard.id,bucket:"CARD_SPENT"}))).toBe(0n);
    expect(await getDb().select().from(serviceActivity).where(eq(serviceActivity.cardId,secondCard.id))).toEqual([]);
    expect(await getDb().select().from(workspaceCommands).where(eq(workspaceCommands.commandId,secondInput.commandId))).toEqual([]);
    const secondView=(await getWorkspace(secondId,serviceId)).cards.find(row=>row.id===secondCard.id)!;
    expect(secondView).toMatchObject({version:secondCard.version,available:{minor:"4000"},spending:{spentThisMonth:{minor:"0"},remainingThisMonth:{minor:"10000"}}});
  } finally {if(open)await locker.query("ROLLBACK");await Promise.allSettled(pending);await Promise.all([locker.end(),observer.end()]);}
},30_000);

it("overlapping purchases on different cards share one person's monthly limit even with enough group funds",async()=>{
  const {owner,serviceId,card}=await fixture("20000","10000");
  const secondCard=(await issuePracticeCard(owner.personId,serviceId,owner.personId,"Second card same person")).card;
  const locker=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-person-limit-barrier"});
  const observer=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-person-limit-observer"});
  const pending:Promise<unknown>[]=[];let open=false;
  const firstInput={commandId:randomUUID(),expectedVersion:card.version,amountMinor:"6000",description:"First card monthly spend"};
  const secondInput={commandId:randomUUID(),expectedVersion:secondCard.version,amountMinor:"6000",description:"Second card monthly spend"};
  try {
    await locker.connect();await observer.connect();await locker.query("BEGIN");open=true;
    const {rows:[row]}=await locker.query<{pid:number}>("SELECT pg_backend_pid() AS pid");
    await locker.query('SELECT id FROM cards WHERE id=$1 FOR UPDATE',[card.id]);
    const first=purchaseCard(owner.personId,serviceId,card.id,firstInput);pending.push(first);void first.catch(()=>undefined);
    const firstPid=await blockedBy(observer,row!.pid);
    const second=purchaseCard(owner.personId,serviceId,secondCard.id,secondInput);pending.push(second);void second.catch(()=>undefined);
    await blockedBy(observer,firstPid);await locker.query("COMMIT");open=false;
    expect((await first).card.available.minor).toBe("4000");
    await expect(second).rejects.toThrow("SPENDING_LIMIT_EXCEEDED");
    expect(await getDb().transaction(tx=>getBalance(tx,{serviceId,bucket:"GROUP_AVAILABLE"}))).toBe(14000n);
    expect(await getDb().transaction(tx=>getBalance(tx,{serviceId,cardId:secondCard.id,bucket:"CARD_SPENT"}))).toBe(0n);
    expect(await getDb().select().from(serviceActivity).where(eq(serviceActivity.cardId,secondCard.id))).toEqual([]);
    expect(await getDb().select().from(workspaceCommands).where(eq(workspaceCommands.commandId,secondInput.commandId))).toEqual([]);
    const view=await getWorkspace(owner.personId,serviceId);
    for(const row of view.cards)expect(row).toMatchObject({available:{minor:"4000"},spending:{monthlyLimit:{minor:"10000"},spentThisMonth:{minor:"6000"},remainingThisMonth:{minor:"4000"}}});
  } finally {if(open)await locker.query("ROLLBACK");await Promise.allSettled(pending);await Promise.all([locker.end(),observer.end()]);}
},30_000);

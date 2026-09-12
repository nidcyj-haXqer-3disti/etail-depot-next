import {randomUUID} from "node:crypto";
import {setTimeout as delay} from "node:timers/promises";
import pg from "pg";
import {afterAll,expect,it} from "vitest";
import {eq} from "drizzle-orm";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {terminalAssignments,accessCommands} from "../../src/modules/access/schema";
import {createMerchantInvitation,revokeMerchantAccess} from "../../src/modules/access/merchant-service";
import {acceptInvitation} from "../../src/modules/access/service";
import {loadTerminalScope} from "../../src/modules/access/merchant-scope";
import {createChannel} from "../../src/modules/acquiring/service";
import {paymentChannelCommands} from "../../src/modules/acquiring/schema";
import {merchantAccessFixture,merchantOffer} from "../helpers/merchant-access";
import {paymentInput} from "../helpers/acquiring";
import {decision} from "../helpers/access";
afterAll(closeDatabase);
async function waiters(observer:pg.Client,pid:number,count:number){const until=Date.now()+5000;while(Date.now()<until){const result=await observer.query("select count(*)::integer as n from pg_stat_activity where datname=current_database() and $1::integer=any(pg_blocking_pids(pid))",[pid]);if(result.rows[0].n>=count)return;await delay(10);}throw new Error("Merchant commands did not both reach the deterministic service-lock barrier.");}
async function barrier(serviceId:string,run:(locker:pg.Client,observer:pg.Client,pid:number)=>Promise<void>){const locker=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-merchant-access-barrier"}),observer=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-merchant-access-observer"});let open=false;try{await locker.connect();await observer.connect();await locker.query("BEGIN");open=true;const account=(await locker.query('select "moneyAccountId" from money_account_services where "serviceId"=$1',[serviceId])).rows[0];await locker.query("select pg_advisory_xact_lock(hashtextextended($1,0))",["money-account:"+account.moneyAccountId]);const {rows:[row]}=await locker.query("select pg_backend_pid() as pid");await run(locker,observer,row.pid);open=false;}finally{if(open)await locker.query("ROLLBACK");await Promise.all([locker.end(),observer.end()]);}}
it("simultaneous invitation and acceptance retries persist one offer and one assignment",async()=>{
 const f=await merchantAccessFixture(),input=merchantOffer(f.helper.personId);const invites=await Promise.all(Array.from({length:6},()=>createMerchantInvitation(f.merchant.personId,f.unit.id,input)));expect(new Set(invites.map(row=>row.id)).size).toBe(1);
 const accept=decision();await Promise.all(Array.from({length:6},()=>acceptInvitation(f.helper.personId,invites[0]!.id,accept)));
 expect(await getDb().select().from(terminalAssignments).where(eq(terminalAssignments.personId,f.helper.personId))).toHaveLength(1);expect(await getDb().select().from(accessCommands).where(eq(accessCommands.commandId,accept.commandId))).toHaveLength(1);
});
it("queued helper revocation blocks a saved channel retry before its receipt is returned",async()=>{
 const f=await merchantAccessFixture(),invite=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.helper.personId));await acceptInvitation(f.helper.personId,invite.id,decision());
 const assignment=(await getDb().transaction(tx=>loadTerminalScope(tx,f.helper.personId,f.unit.id))).assignment!;
 const input={...paymentInput(),commandId:randomUUID(),presentations:["WEB" as const],visibility:"CREATOR_PRIVATE" as const};await createChannel(f.helper.personId,f.unit.id,input);
 const promises:Promise<unknown>[]=[];
 try{await barrier(f.merchant.serviceId,async(locker,observer,pid)=>{
  const revoke=revokeMerchantAccess(f.merchant.personId,f.unit.id,assignment.id,decision());promises.push(revoke);void revoke.catch(()=>undefined);await waiters(observer,pid,1);
  const retry=createChannel(f.helper.personId,f.unit.id,input);promises.push(retry);void retry.catch(()=>undefined);await waiters(observer,pid,2);
  await locker.query("COMMIT");await expect(revoke).resolves.toMatchObject({state:"REVOKED"});await expect(retry).rejects.toMatchObject({code:"MERCHANT_UNAVAILABLE"});
 });}finally{await Promise.allSettled(promises);}
 expect(await getDb().select().from(paymentChannelCommands).where(eq(paymentChannelCommands.commandId,input.commandId))).toHaveLength(1);
});
it("merchant writes wait for parent service authority withdrawal, including accepted-invitation retries",async()=>{
 const f=await merchantAccessFixture(),invite=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.helper.personId)),accept=decision();await acceptInvitation(f.helper.personId,invite.id,accept);
 let pending:Promise<unknown>|undefined;
 try{await barrier(f.merchant.serviceId,async(locker,observer,pid)=>{
  await locker.query('update service_members set state=\'REVOKED\',version=version+1 where "serviceId"=$1 and "personId"=$2',[f.merchant.serviceId,f.merchant.personId]);
  pending=acceptInvitation(f.helper.personId,invite.id,accept);void pending.catch(()=>undefined);await waiters(observer,pid,1);await locker.query("COMMIT");await expect(pending).rejects.toMatchObject({code:"INVITER_ACCESS_CHANGED"});
 });}finally{if(pending)await Promise.allSettled([pending]);}
 expect(await getDb().select().from(terminalAssignments).where(eq(terminalAssignments.personId,f.helper.personId))).toHaveLength(1);
});

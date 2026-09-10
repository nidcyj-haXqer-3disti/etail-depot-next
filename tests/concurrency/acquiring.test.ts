import {randomUUID} from "node:crypto";
import {setTimeout as delay} from "node:timers/promises";
import pg from "pg";
import {afterAll,expect,it} from "vitest";
import {eq} from "drizzle-orm";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {merchantApplications,merchantApplicationCommands,paymentChannels,paymentChannelCommands} from "../../src/modules/acquiring/schema";
import {startMerchantSetup,updateMerchantSetup,createChannel} from "../../src/modules/acquiring/service";
import {acquiringFixture,completeSetup,paymentInput} from "../helpers/acquiring";
afterAll(closeDatabase);
const channelInput=()=>({...paymentInput(),presentations:["WEB"] as ["WEB"],visibility:"CREATOR_PRIVATE" as const});
async function blockedBy(observer:pg.Client,pid:number) {
 const deadline=Date.now()+5000;
 while(Date.now()<deadline) {const result=await observer.query("select pid from pg_stat_activity where datname=current_database() and $1::integer=any(pg_blocking_pids(pid)) limit 1",[pid]);if(result.rows[0])return;await delay(10);}
 throw new Error("Acquiring command did not wait on the shared service lock.");
}
it("concurrent setup starts and draft creation produce one effect; optimistic edits have one winner",async()=>{
 const f=await acquiringFixture(),start={commandId:randomUUID()};
 const starts=await Promise.all(Array.from({length:6},()=>startMerchantSetup(f.personId,f.merchantId,start)));
 expect(new Set(starts.map(row=>row.id))).toEqual(new Set([f.setup.id]));
 const input=channelInput(),drafts=await Promise.all(Array.from({length:6},()=>createChannel(f.personId,f.merchantId,input)));
 expect(new Set(drafts.map(row=>row.id)).size).toBe(1);
 expect(await getDb().select().from(paymentChannels).where(eq(paymentChannels.serviceId,f.serviceId))).toHaveLength(1);
 expect(await getDb().select().from(paymentChannelCommands).where(eq(paymentChannelCommands.serviceId,f.serviceId))).toHaveLength(1);
 const edits=await Promise.allSettled([updateMerchantSetup(f.personId,f.merchantId,f.setup.id,completeSetup(1)),updateMerchantSetup(f.personId,f.merchantId,f.setup.id,completeSetup(1))]);
 expect(edits.filter(row=>row.status==="fulfilled")).toHaveLength(1);expect(edits.filter(row=>row.status==="rejected")[0]).toMatchObject({reason:{code:"STALE_VERSION"}});
});
for(const kind of ["setup","payment"] as const)it(`${kind} mutation waits for grant revocation and cannot persist or replay through revoked authority`,async()=>{
 const f=await acquiringFixture();const input=kind==="setup"?completeSetup(1):channelInput();
 // Persist a receipt first, then test that a retry rechecks live permissions after waiting.
 if(kind==="setup")await updateMerchantSetup(f.personId,f.merchantId,f.setup.id,input as ReturnType<typeof completeSetup>);
 else await createChannel(f.personId,f.merchantId,input as ReturnType<typeof channelInput>);
 const locker=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-acquiring-revocation-barrier"}),observer=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-acquiring-lock-observer"});
 let open=false;let pending:Promise<unknown>|undefined;
 try {
  await locker.connect();await observer.connect();await locker.query("BEGIN");open=true;
  await locker.query("select pg_advisory_xact_lock(hashtextextended($1,0))",["workspace:"+f.serviceId]);
  const {rows:[owner]}=await locker.query("select pg_backend_pid() as pid");
  await locker.query('update permission_grants set state=\'REVOKED\' where "serviceId"=$1 and "personId"=$2 and action=$3',[f.serviceId,f.personId,kind==="setup"?"acquiring.setup":"channels.create"]);
  pending=kind==="setup"?updateMerchantSetup(f.personId,f.merchantId,f.setup.id,input as ReturnType<typeof completeSetup>):createChannel(f.personId,f.merchantId,input as ReturnType<typeof channelInput>);
  void pending.catch(()=>undefined);await blockedBy(observer,owner.pid);
  await locker.query("COMMIT");open=false;
  await expect(pending).rejects.toMatchObject({status:403,code:"ACTION_DENIED"});
  if(kind==="setup") {expect((await getDb().select().from(merchantApplications).where(eq(merchantApplications.serviceId,f.serviceId)))[0]!.version).toBe(2);expect(await getDb().select().from(merchantApplicationCommands).where(eq(merchantApplicationCommands.serviceId,f.serviceId))).toHaveLength(1);}
  else expect(await getDb().select().from(paymentChannelCommands).where(eq(paymentChannelCommands.serviceId,f.serviceId))).toHaveLength(1);
 } finally {if(open)await locker.query("ROLLBACK");if(pending)await Promise.allSettled([pending]);await Promise.all([locker.end(),observer.end()]);}
});

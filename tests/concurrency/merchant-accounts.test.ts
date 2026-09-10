import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import pg from "pg";
import { eq } from "drizzle-orm";
import { afterAll,expect,it } from "vitest";
import { closeDatabase,getDb } from "../../src/platform/database/client";
import { bindIdentity,listServicesForPerson } from "../../src/modules/services/service";
import { createPrimaryMerchant } from "../../src/modules/services/create-merchant";
import { merchantSetupEligibility,merchantServiceCommands } from "../../src/modules/services/schema";
afterAll(closeDatabase);
async function setup(){const actor=await bindIdentity("urn:etail:isolated-fixture",randomUUID(),"Fictional concurrent applicant");await getDb().insert(merchantSetupEligibility).values({personId:actor.personId,personaKind:"FICTIONAL_ADULT"});return {...actor,input:{commandId:randomUUID(),displayName:"Fictional concurrent studio"}};}
it("parallel identical retries create a single Merchant and preserve one business receipt",async()=>{
  const f=await setup();const results=await Promise.all(Array.from({length:5},()=>createPrimaryMerchant(f.personId,f.input)));
  expect(new Set(results.map(r=>r.serviceId)).size).toBe(1);
  expect((await listServicesForPerson(f.personId)).filter(a=>a.kind==="MERCHANT")).toHaveLength(1);
  expect(await getDb().select().from(merchantServiceCommands).where(eq(merchantServiceCommands.commandId,f.input.commandId))).toHaveLength(1);
});
it("an in-flight eligibility withdrawal blocks setup on another PostgreSQL connection",async()=>{
  const f=await setup(),locker=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-merchant-persona-barrier"}),observer=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-merchant-persona-observer"});
  let open=false,pending:Promise<unknown>|undefined;
  try{
    await locker.connect();await observer.connect();await locker.query("BEGIN");open=true;
    const {rows:[owner]}=await locker.query<{pid:number}>("SELECT pg_backend_pid() AS pid");
    await locker.query('UPDATE merchant_setup_eligibility SET "personaKind"=\'FICTIONAL_SUPERVISED\' WHERE "personId"=$1',[f.personId]);
    pending=createPrimaryMerchant(f.personId,f.input);void pending.catch(()=>undefined);
    let blocked=false;const deadline=Date.now()+5000;
    while(Date.now()<deadline){const result=await observer.query("SELECT 1 FROM pg_stat_activity WHERE datname=current_database() AND $1::integer=ANY(pg_blocking_pids(pid))",[owner!.pid]);if(result.rowCount){blocked=true;break;}await delay(10);}
    expect(blocked).toBe(true);await locker.query("COMMIT");open=false;
    await expect(pending).rejects.toThrow("MERCHANT_APPLICANT_REQUIRED");
    expect((await listServicesForPerson(f.personId)).filter(a=>a.kind==="MERCHANT")).toHaveLength(0);
  }finally{if(open)await locker.query("ROLLBACK");if(pending)await Promise.allSettled([pending]);await Promise.all([locker.end(),observer.end()]);}
});

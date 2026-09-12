import { setTimeout as delay } from "node:timers/promises";
import pg from "pg";
import { afterAll,expect,it } from "vitest";
import { and,eq } from "drizzle-orm";
import { closeDatabase,getDb } from "../../src/platform/database/client";
import { serviceMembers } from "../../src/platform/database/schema";
import { serviceInvitations,accessHistory } from "../../src/modules/access/schema";
import { createInvitation,acceptInvitation,revokeInvitation } from "../../src/modules/access/service";
import { accessFixture,offer,decision } from "../helpers/access";
afterAll(closeDatabase);
async function blockedBy(observer:pg.Client,pid:number) {const deadline=Date.now()+5000;while(Date.now()<deadline){const result=await observer.query<{pid:number}>("SELECT pid FROM pg_stat_activity WHERE datname=current_database() AND $1::integer=ANY(pg_blocking_pids(pid)) LIMIT 1",[pid]);if(result.rows[0])return result.rows[0].pid;await delay(10);}throw new Error("Expected an actual PostgreSQL access-command lock wait.");}
it("parallel request retries create exactly one invitation and one accepted membership",async()=>{
 const f=await accessFixture(),input=offer(f.recipient.personId);const invitations=await Promise.all(Array.from({length:5},()=>createInvitation(f.owner.personId,f.serviceId,input)));expect(new Set(invitations.map(i=>i.id)).size).toBe(1);
 const accept=decision();const accepted=await Promise.all(Array.from({length:5},()=>acceptInvitation(f.recipient.personId,invitations[0]!.id,accept)));expect(accepted.every(i=>i.status==="ACCEPTED"&&i.version===2)).toBe(true);
 expect(await getDb().select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,f.serviceId),eq(serviceMembers.personId,f.recipient.personId)))).toHaveLength(1);
 expect(await getDb().select().from(accessHistory).where(and(eq(accessHistory.serviceId,f.serviceId),eq(accessHistory.kind,"INVITATION_ACCEPTED")))).toHaveLength(1);
});
for(const firstOperation of ["accept","revoke"] as const)it(`serializes overlapping ${firstOperation}-first invitation acceptance and revocation`,async()=>{
 const f=await accessFixture(),invite=await createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId));
 const locker=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-access-row-barrier"}),observer=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-access-observer"});let open=false;const pending:Promise<unknown>[]=[];
 const accept=()=>acceptInvitation(f.recipient.personId,invite.id,decision()),revoke=()=>revokeInvitation(f.owner.personId,f.serviceId,invite.id,decision());
 try{await locker.connect();await observer.connect();await locker.query("BEGIN");open=true;const {rows:[row]}=await locker.query<{pid:number}>("SELECT pg_backend_pid() AS pid");await locker.query('SELECT id FROM service_invitations WHERE id=$1 FOR UPDATE',[invite.id]);
  const first=firstOperation==="accept"?accept():revoke();pending.push(first);void first.catch(()=>undefined);const firstPid=await blockedBy(observer,row!.pid);
  const second=firstOperation==="accept"?revoke():accept();pending.push(second);void second.catch(()=>undefined);expect(await blockedBy(observer,firstPid)).not.toBe(firstPid);
  await locker.query("COMMIT");open=false;expect(await first).toMatchObject({status:firstOperation==="accept"?"ACCEPTED":"REVOKED",version:2});await expect(second).rejects.toThrow("STALE_VERSION");
  const memberships=await getDb().select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,f.serviceId),eq(serviceMembers.personId,f.recipient.personId)));expect(memberships).toHaveLength(firstOperation==="accept"?1:0);
 }finally{if(open)await locker.query("ROLLBACK");await Promise.allSettled(pending);await Promise.all([locker.end(),observer.end()]);}
});
it("acceptance waiting on an in-flight owner access revocation cannot use old authority",async()=>{
 const f=await accessFixture(),invite=await createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId));const locker=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-delegation-revocation-barrier"}),observer=new pg.Client({connectionString:process.env.DATABASE_URL,application_name:"etail-access-observer"});let open=false;const pending:Promise<unknown>[]=[];
 try{await locker.connect();await observer.connect();await locker.query("BEGIN");open=true;const {rows:[row]}=await locker.query<{pid:number}>("SELECT pg_backend_pid() AS pid");await locker.query('UPDATE service_members SET state=\'REVOKED\',version=version+1 WHERE "serviceId"=$1 AND "personId"=$2',[f.serviceId,f.owner.personId]);
  const acceptance=acceptInvitation(f.recipient.personId,invite.id,decision());pending.push(acceptance);void acceptance.catch(()=>undefined);await blockedBy(observer,row!.pid);await locker.query("COMMIT");open=false;await expect(acceptance).rejects.toThrow("INVITER_ACCESS_CHANGED");
  expect(await getDb().select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,f.serviceId),eq(serviceMembers.personId,f.recipient.personId)))).toEqual([]);expect((await getDb().select().from(serviceInvitations).where(eq(serviceInvitations.id,invite.id)))[0]!.status).toBe("PENDING");
 }finally{if(open)await locker.query("ROLLBACK");await Promise.allSettled(pending);await Promise.all([locker.end(),observer.end()]);}
});

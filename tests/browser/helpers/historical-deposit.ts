import {createHash,randomUUID} from "node:crypto";
import {spawn,type ChildProcess} from "node:child_process";
import {createServer} from "node:net";
import {readdir,readFile} from "node:fs/promises";
import path from "node:path";
import {Pool,type PoolClient} from "pg";
import {and,eq} from "drizzle-orm";
import type {Page} from "@playwright/test";
import {validateLocalDatabaseTarget} from "../../../src/platform/database/local-target";
import {getDb,closeDatabase} from "../../../src/platform/database/client";
import {identityBindings} from "../../../src/platform/database/schema";
import {SessionService} from "../../../src/modules/identity";
import {sessionRepository} from "../../../src/platform/database/session-repository";

export interface HistoricalDepositBrowser {
 ownerId:string;operatorId:string;serviceId:string;terminalId:string;depositId:string;paymentReference:string;origin:string;
 signIn(page:Page):Promise<void>;close():Promise<void>;
}
async function unusedPort(){const socket=createServer();await new Promise<void>((resolve,reject)=>{socket.once("error",reject);socket.listen(0,"127.0.0.1",resolve);});const address=socket.address();if(!address||typeof address==="string")throw new Error("Expected a loopback test port");await new Promise<void>((resolve,reject)=>socket.close(error=>error?reject(error):resolve()));return address.port;}
async function migrate(client:PoolClient,names:string[]){for(const name of names){const source=await readFile(path.resolve("netlify/database/migrations",name,"migration.sql"),"utf8");await client.query("BEGIN");try{for(const statement of source.split("--> statement-breakpoint"))if(statement.trim())await client.query(statement);await client.query("COMMIT");}catch(error){await client.query("ROLLBACK");throw error;}}}

/** A historical fixture under its actual original SQL guards, then the real additive migrations.
 * No active-schema reservation writer exists: current SQL correctly rejects new legacy deposits.
 * Only this unique namespace in the marked TEST database receives these fictional records.
 */
async function createHistory(client:PoolClient,ids:{owner:string;operator:string;service:string;terminal:string;deposit:string;payment:string}){
 const channel=randomUUID(),settlement=randomUUID();
 await client.query("BEGIN");try{
  for(const [id,name] of [[ids.owner,"Historical browser merchant"],[ids.operator,"Historical browser processor"]]){
   await client.query('INSERT INTO people(id,"displayName") VALUES($1,$2)',[id,name]);
   await client.query('INSERT INTO identity_bindings("personId",issuer,subject) VALUES($1,\'urn:etail:isolated-fixture\',$2)',[id,randomUUID()]);
  }
  await client.query('INSERT INTO services(id,kind,"primaryPersonId","displayName",status) VALUES($1,\'MERCHANT\',$2,\'Historical browser merchant\',\'ACTIVE\')',[ids.service,ids.owner]);
  await client.query('INSERT INTO service_members("serviceId","personId",state) VALUES($1,$2,\'ACCEPTED\')',[ids.service,ids.owner]);
  for(const action of ["acquiring.read","payments.read","payouts.manage","payments.refund","gateway.manage"])await client.query('INSERT INTO permission_grants("serviceId","personId",action) VALUES($1,$2,$3)',[ids.service,ids.owner,action]);
  await client.query('INSERT INTO operator_service_access("serviceId","personId",state,"canProcessDeposits") VALUES($1,$2,\'ACCEPTED\',true)',[ids.service,ids.operator]);
  await client.query('INSERT INTO merchant_profiles("serviceId",status) VALUES($1,\'APPROVED\')',[ids.service]);
  await client.query('INSERT INTO merchant_units(id,kind,"masterServiceId","displayName") VALUES($1,\'MASTER\',$2,\'Historical browser terminal\')',[ids.terminal,ids.service]);
  await client.query('INSERT INTO payment_channels(id,"serviceId","merchantUnitId","creatorId",description,"amountMinor",usage,"expiresAt") VALUES($1,$2,$3,$4,\'Historical browser order\',1250,\'REUSABLE\',clock_timestamp()+interval \'7 days\')',[channel,ids.service,ids.terminal,ids.owner]);
  await client.query('INSERT INTO merchant_test_gateways("serviceId",mode,"updatedBy") VALUES($1,\'TEST_READY\',$2)',[ids.service,ids.owner]);
  await client.query('INSERT INTO merchant_test_enrollments("merchantUnitId","serviceId",status,"updatedBy") VALUES($1,$2,\'ENROLLED\',$3)',[ids.terminal,ids.service,ids.owner]);
  const at=(await client.query<{at:Date}>('SELECT clock_timestamp() AS at')).rows[0]!.at;
  // The old schema predates money accounts used by the current sole ledger writer.
  // These exact two-line original-schema fixtures pass all historical provenance guards.
  async function journal(kind:string,referenceId:string,debit:string,credit:string){const id=randomUUID(),lines=[{bucket:debit,deltaMinor:"-1250"},{bucket:credit,deltaMinor:"1250"}],digest=createHash("sha256").update(JSON.stringify({kind,referenceId,lines})).digest("hex");await client.query('INSERT INTO ledger_journals(id,"businessKey",kind,"referenceId",digest,"createdAt") VALUES($1,$2,$3,$4,$5,$6)',[id,`historical-browser:${kind}:${referenceId}`,kind,referenceId,digest,at]);for(const [index,line] of lines.entries())await client.query('INSERT INTO ledger_entries("journalId","lineNumber","serviceId","merchantUnitId",bucket,"deltaMinor") VALUES($1,$2,$3,$4,$5,$6)',[id,index+1,ids.service,ids.terminal,line.bucket,line.deltaMinor]);return id;}
  const paymentJournal=await journal("MERCHANT_PAYMENT",ids.payment,"GATEWAY_CLEARING","MERCHANT_AVAILABLE");
  await client.query('INSERT INTO merchant_test_payments(id,"serviceId","merchantUnitId","channelId","actorId","channelVersion","channelUsage",description,"amountMinor",outcome,"testReference","gatewayVersion","enrollmentVersion","journalId","createdAt") VALUES($1,$2,$3,$4,$5,1,\'REUSABLE\',\'Historical browser order\',1250,\'APPROVED\',$6,1,1,$7,$8)',[ids.payment,ids.service,ids.terminal,channel,ids.owner,`TEST-${ids.payment}`,paymentJournal,at]);
  const settled=await journal("MERCHANT_SETTLEMENT",settlement,"MERCHANT_AVAILABLE","MERCHANT_SETTLED");
  await client.query('INSERT INTO merchant_settlements(id,"serviceId","merchantUnitId","amountMinor","actorId","journalId","createdAt") VALUES($1,$2,$3,1250,$4,$5,$6)',[settlement,ids.service,ids.terminal,ids.owner,settled,at]);
  await client.query('INSERT INTO merchant_settlement_items("paymentId","settlementId","serviceId","merchantUnitId","amountMinor") VALUES($1,$2,$3,$4,1250)',[ids.payment,settlement,ids.service,ids.terminal]);
  const reserved=await journal("DEPOSIT_RESERVE",ids.deposit,"MERCHANT_SETTLED","MERCHANT_PAYOUT_PENDING"),reviewToken=createHash("sha256").update(JSON.stringify({settlementId:settlement,paymentId:ids.payment,amountMinor:"1250"})).digest("hex");
  await client.query('INSERT INTO merchant_deposits(id,"reviewToken","settlementId","serviceId","merchantUnitId","actorId","amountMinor","journalId","createdAt") VALUES($1,$2,$3,$4,$5,$6,1250,$7,$8)',[ids.deposit,reviewToken,settlement,ids.service,ids.terminal,ids.owner,reserved,at]);
  await client.query('INSERT INTO merchant_deposit_items("depositId","paymentId","amountMinor") VALUES($1,$2,1250)',[ids.deposit,ids.payment]);
  await client.query("COMMIT");
 }catch(error){await client.query("ROLLBACK");throw error;}
}

export async function startHistoricalDepositBrowser():Promise<HistoricalDepositBrowser>{
 if(process.env.APP_ENV!=="test"||process.env.ENABLE_REAL_MONEY!=="false"||process.env.NETLIFY||process.env.SITE_ID||process.env.CONTEXT)throw new Error("Historical deposit browser fixtures are isolated TEST only");
 const connectionString=validateLocalDatabaseTarget(process.env.DATABASE_URL,{ci:process.env.CI==="true"});if(new URL(connectionString).pathname!=="/etail_depot_next_services_test")throw new Error("Historical browser requires the marked test database");
 const schema=`d73_deposit_browser_${randomUUID().replaceAll("-","")}`,ids={owner:randomUUID(),operator:randomUUID(),service:randomUUID(),terminal:randomUUID(),deposit:randomUUID(),payment:randomUUID()};
 const administration=new Pool({connectionString,max:1,options:"-c search_path=pg_catalog"});let created=false,pool:Pool|undefined,child:ChildProcess|undefined;
 const previous={options:process.env.PGOPTIONS,origin:process.env.ETAIL_PUBLIC_ORIGIN};
 async function close(){if(child&&child.exitCode===null){const stopped=new Promise<void>(resolve=>child!.once("exit",()=>resolve()));child.kill("SIGTERM");await Promise.race([stopped,new Promise<void>(resolve=>{const timer=setTimeout(()=>{if(child?.exitCode===null)child.kill("SIGKILL");resolve();},5000);timer.unref();})]);}await closeDatabase();if(previous.options===undefined)delete process.env.PGOPTIONS;else process.env.PGOPTIONS=previous.options;if(previous.origin===undefined)delete process.env.ETAIL_PUBLIC_ORIGIN;else process.env.ETAIL_PUBLIC_ORIGIN=previous.origin;await pool?.end();if(created)await administration.query(`DROP SCHEMA "${schema}" CASCADE`);await administration.end();}
 try{
  const ownership=await administration.query("SELECT current_database() AS name,current_user AS role,pg_get_userbyid(datdba) AS owner,shobj_description(oid,'pg_database') AS marker FROM pg_database WHERE datname=current_database()");const row=ownership.rows[0];if(row?.name!=="etail_depot_next_services_test"||row.role!==(process.env.CI==="true"?"etail_ci":"etail_local")||row.owner!==row.role||row.marker!=="ETAIL_DEPOT_NEXT_GREENFIELD_2026:fresh-services-d69:test")throw new Error("Historical browser database ownership mismatch");
  await administration.query(`CREATE SCHEMA "${schema}"`);created=true;
  const options=`-c search_path=${schema},pg_catalog`;pool=new Pool({connectionString,max:1,options});const client=await pool.connect();
  try{const names=(await readdir(path.resolve("netlify/database/migrations"))).filter(name=>/^\d+_/.test(name)).sort();await migrate(client,names.filter(name=>name<"20260912055940"));await createHistory(client,ids);await migrate(client,names.filter(name=>name>="20260912055940"));}finally{client.release();}
  await closeDatabase();process.env.PGOPTIONS=options;const port=await unusedPort(),origin=`http://127.0.0.1:${port}`;process.env.ETAIL_PUBLIC_ORIGIN=origin;
  child=spawn(process.execPath,[path.resolve("node_modules/next/dist/bin/next"),"start","--hostname","127.0.0.1","--port",String(port)],{cwd:process.cwd(),env:{...process.env,PGOPTIONS:options,ETAIL_PUBLIC_ORIGIN:origin,ENABLE_LOCAL_FIXTURE_IDENTITY:"true"},stdio:"ignore"});let launchError=false;child.once("error",()=>{launchError=true;});
  const deadline=Date.now()+30000;let ready=false;while(Date.now()<deadline){if(launchError||child.exitCode!==null)throw new Error("Isolated historical browser server could not start");try{const response=await fetch(`${origin}/login`,{signal:AbortSignal.timeout(1500)});if(response.status===200){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,150));}if(!ready)throw new Error("Isolated historical browser server did not become ready");
  return {ownerId:ids.owner,operatorId:ids.operator,serviceId:ids.service,terminalId:ids.terminal,depositId:ids.deposit,paymentReference:`TEST-${ids.payment}`,origin,close,async signIn(page){const [identity]=await getDb().select().from(identityBindings).where(and(eq(identityBindings.personId,ids.operator),eq(identityBindings.issuer,"urn:etail:isolated-fixture")));if(!identity)throw new Error("Historical processor identity missing");const session=await new SessionService(sessionRepository,{appEnv:"test",publicOrigin:origin}).issue({personId:ids.operator,identityId:identity.id}),pair=session.cookie.split(";",1)[0]!;await page.context().addCookies([{name:pair.slice(0,pair.indexOf("=")),value:pair.slice(pair.indexOf("=")+1),url:origin,httpOnly:true,sameSite:"Strict",expires:Math.floor(session.record.expiresAt.getTime()/1000)}]);}};
 }catch(error){await close();throw error;}
}

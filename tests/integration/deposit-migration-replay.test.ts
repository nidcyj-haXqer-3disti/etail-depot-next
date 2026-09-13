import {createHash,randomUUID} from "node:crypto";
import {readdir,readFile} from "node:fs/promises";
import path from "node:path";
import {Pool,type PoolClient} from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import {afterAll,beforeAll,expect,it,vi} from "vitest";
import {validateLocalDatabaseTarget} from "../../src/platform/database/local-target";

// Only the connection factory changes: current domain commands and every SQL guard run unchanged.
const isolated=vi.hoisted(()=>({db:null as ReturnType<typeof drizzle>|null}));
vi.mock("../../src/platform/database/client",()=>({getDb:()=>{if(!isolated.db)throw new Error("Replay database is not ready");return isolated.db;},closeDatabase:async()=>{}}));
import {processMerchantDeposit,createMerchantSettlement,getMerchantOperations,refundMerchantPayment} from "../../src/modules/acquiring/operations-service";
import {getMerchantDashboard} from "../../src/modules/acquiring/dashboard-service";
import {merchantActivityCsv} from "../../src/modules/acquiring/activity-service";

const schema=`d73_deposit_replay_${randomUUID().replaceAll("-","")}`;
let pool:Pool,administration:Pool,created=false;
const owner=randomUUID(),operator=randomUUID(),merchant=randomUUID(),cardService=randomUUID(),terminal=randomUUID(),channel=randomUUID();
const batches=Array.from({length:3},()=>({payment:randomUUID(),settlement:randomUUID(),deposit:randomUUID()}));
let historicalJournalIds:string[]=[],beforeHash="",cardAccount="",merchantAccount="";
const migrationsRoot=path.resolve("netlify/database/migrations");
async function migrate(client:PoolClient,names:string[]){for(const name of names){const source=await readFile(path.join(migrationsRoot,name,"migration.sql"),"utf8");await client.query("BEGIN");try{for(const statement of source.split("--> statement-breakpoint"))if(statement.trim())await client.query(statement);await client.query("COMMIT");}catch(error){await client.query("ROLLBACK");throw new Error(`Replay migration ${name} failed`,{cause:error});}}}
async function journal(client:PoolClient,kind:string,referenceId:string,serviceId:string,terminalId:string|null,debit:string,credit:string,amount:string,at:Date){
 const id=randomUUID(),lines=[{serviceId,merchantUnitId:terminalId,bucket:debit,deltaMinor:`-${amount}`},{serviceId,merchantUnitId:terminalId,bucket:credit,deltaMinor:amount}],digest=createHash("sha256").update(JSON.stringify({kind,referenceId,lines})).digest("hex");
 await client.query('INSERT INTO ledger_journals(id,"businessKey",kind,"referenceId",digest,"createdAt") VALUES($1,$2,$3,$4,$5,$6)',[id,`migration-fixture:${kind}:${referenceId}`,kind,referenceId,digest,at]);
 for(let index=0;index<lines.length;index++){const line=lines[index]!;await client.query('INSERT INTO ledger_entries("journalId","lineNumber","serviceId","merchantUnitId",bucket,"deltaMinor") VALUES($1,$2,$3,$4,$5,$6)',[id,index+1,serviceId,terminalId,line.bucket,line.deltaMinor]);}
 return id;
}
async function snapshot(client:PoolClient,ids?:string[]){
 const journals=await client.query('SELECT to_jsonb(j) AS row FROM ledger_journals j WHERE ($1::uuid[] IS NULL OR id=ANY($1)) ORDER BY id',[ids??null]);
 // D73 adds a nullable account-scope column; it does not rewrite historical entry values.
 const entries=await client.query('SELECT to_jsonb(e)-\'moneyAccountId\' AS row FROM ledger_entries e WHERE ($1::uuid[] IS NULL OR "journalId"=ANY($1)) ORDER BY "journalId","lineNumber"',[ids??null]);
 return createHash("sha256").update(JSON.stringify({journals:journals.rows,entries:entries.rows})).digest("hex");
}
async function historicalFixtures(client:PoolClient){
 await client.query("BEGIN");try{
  for(const [id,name] of [[owner,"Migration money owner"],[operator,"Migration payment processor"]]){
   await client.query('INSERT INTO people(id,"displayName") VALUES($1,$2)',[id,name]);
   await client.query('INSERT INTO identity_bindings("personId",issuer,subject) VALUES($1,\'urn:etail:isolated-fixture\',$2)',[id,randomUUID()]);
   await client.query('INSERT INTO merchant_setup_eligibility("personId","personaKind") VALUES($1,\'FICTIONAL_ADULT\')',[id]);
  }
  await client.query('INSERT INTO services(id,kind,"primaryPersonId","displayName",status) VALUES($1,\'MERCHANT\',$3,\'Preserved merchant\',\'ACTIVE\'),($2,\'CARDHOLDER\',$3,\'Separate card money\',\'ACTIVE\')',[merchant,cardService,owner]);
  await client.query('INSERT INTO service_members("serviceId","personId",state) VALUES($1,$3,\'ACCEPTED\'),($2,$3,\'ACCEPTED\')',[merchant,cardService,owner]);
  for(const action of ["acquiring.read","payments.read","payouts.manage","payments.refund","gateway.manage"])await client.query('INSERT INTO permission_grants("serviceId","personId",action) VALUES($1,$2,$3)',[merchant,owner,action]);
  await client.query('INSERT INTO operator_service_access("serviceId","personId",state,"canProcessDeposits") VALUES($1,$2,\'ACCEPTED\',true)',[merchant,operator]);
  await client.query('INSERT INTO merchant_profiles("serviceId",status) VALUES($1,\'APPROVED\')',[merchant]);
  await client.query('INSERT INTO merchant_units(id,kind,"masterServiceId","displayName") VALUES($1,\'MASTER\',$2,\'Preserved terminal\')',[terminal,merchant]);
  await client.query('INSERT INTO payment_channels(id,"serviceId","merchantUnitId","creatorId",description,"amountMinor",usage,"expiresAt") VALUES($1,$2,$3,$4,\'Historical sale\',1000,\'REUSABLE\',clock_timestamp()+interval \'7 days\')',[channel,merchant,terminal,owner]);
  await client.query('INSERT INTO merchant_test_gateways("serviceId",mode,"updatedBy") VALUES($1,\'TEST_READY\',$2)',[merchant,owner]);
  await client.query('INSERT INTO merchant_test_enrollments("merchantUnitId","serviceId",status,"updatedBy") VALUES($1,$2,\'ENROLLED\',$3)',[terminal,merchant,owner]);
  const at=(await client.query<{at:Date}>('SELECT clock_timestamp() AS at')).rows[0]!.at;
  const topup=randomUUID(),funding=await journal(client,"GROUP_FUNDING",topup,cardService,null,"PRACTICE_SOURCE","GROUP_AVAILABLE","7000",at);
  await client.query('INSERT INTO cardholder_topups(id,"serviceId","actorId","amountMinor","journalId","createdAt") VALUES($1,$2,$3,7000,$4,$5)',[topup,cardService,owner,funding,at]);
  for(const [index,batch] of batches.entries()){
   const paymentJournal=await journal(client,"MERCHANT_PAYMENT",batch.payment,merchant,terminal,"GATEWAY_CLEARING","MERCHANT_AVAILABLE","1000",at);
   await client.query('INSERT INTO merchant_test_payments(id,"serviceId","merchantUnitId","channelId","actorId","channelVersion","channelUsage",description,"amountMinor",outcome,"testReference","gatewayVersion","enrollmentVersion","journalId","createdAt") VALUES($1,$2,$3,$4,$5,1,\'REUSABLE\',\'Historical sale\',1000,\'APPROVED\',$6,1,1,$7,$8)',[batch.payment,merchant,terminal,channel,owner,`TEST-${batch.payment}`,paymentJournal,at]);
   const settled=await journal(client,"MERCHANT_SETTLEMENT",batch.settlement,merchant,terminal,"MERCHANT_AVAILABLE","MERCHANT_SETTLED","1000",at);
   await client.query('INSERT INTO merchant_settlements(id,"serviceId","merchantUnitId","amountMinor","actorId","journalId","createdAt") VALUES($1,$2,$3,1000,$4,$5,$6)',[batch.settlement,merchant,terminal,owner,settled,at]);
   await client.query('INSERT INTO merchant_settlement_items("paymentId","settlementId","serviceId","merchantUnitId","amountMinor") VALUES($1,$2,$3,$4,1000)',[batch.payment,batch.settlement,merchant,terminal]);
   const reserved=await journal(client,"DEPOSIT_RESERVE",batch.deposit,merchant,terminal,"MERCHANT_SETTLED","MERCHANT_PAYOUT_PENDING","1000",at);
   const reviewToken=createHash("sha256").update(JSON.stringify({settlementId:batch.settlement,paymentId:batch.payment,amountMinor:"1000"})).digest("hex");
   await client.query('INSERT INTO merchant_deposits(id,"reviewToken","settlementId","serviceId","merchantUnitId","actorId","amountMinor","journalId","createdAt") VALUES($1,$2,$3,$4,$5,$6,1000,$7,$8)',[batch.deposit,reviewToken,batch.settlement,merchant,terminal,owner,reserved,at]);
   await client.query('INSERT INTO merchant_deposit_items("depositId","paymentId","amountMinor") VALUES($1,$2,1000)',[batch.deposit,batch.payment]);
   if(index===2){const paid=await journal(client,"MERCHANT_PAYOUT",batch.deposit,merchant,terminal,"MERCHANT_PAYOUT_PENDING","PAYOUT_CLEARING","1000",at);await client.query('INSERT INTO merchant_deposit_events("depositId","commandId","actorId",outcome,"journalId","createdAt") VALUES($1,$2,$3,\'COMPLETED\',$4,$5)',[batch.deposit,randomUUID(),operator,paid,at]);}
  }
  await client.query("COMMIT");
 }catch(error){await client.query("ROLLBACK");throw error;}
 historicalJournalIds=(await client.query<{id:string}>('SELECT id FROM ledger_journals ORDER BY id')).rows.map(row=>row.id);beforeHash=await snapshot(client);
}
beforeAll(async()=>{
 const connectionString=validateLocalDatabaseTarget(process.env.DATABASE_URL,{ci:process.env.CI==="true"});if(new URL(connectionString).pathname!=="/etail_depot_next_services_test")throw new Error("Migration replay uses only the isolated test database");
 administration=new Pool({connectionString,max:1});const marker=await administration.query("SELECT shobj_description(oid,'pg_database') AS marker FROM pg_database WHERE datname=current_database()");expect(marker.rows[0]?.marker).toBe("ETAIL_DEPOT_NEXT_GREENFIELD_2026:fresh-services-d69:test");
 expect(schema).toMatch(/^d73_deposit_replay_[a-f0-9]{32}$/);await administration.query(`CREATE SCHEMA "${schema}"`);created=true;
 pool=new Pool({connectionString,max:4,options:`-c search_path=${schema},pg_catalog`});isolated.db=drizzle({client:pool});
 const client=await pool.connect();try{const names=(await readdir(migrationsRoot)).filter(name=>/^\d+_/.test(name)).sort();const historical=names.filter(name=>name<"20260912055940"),current=names.filter(name=>name>="20260912055940");await migrate(client,historical);await historicalFixtures(client);await migrate(client,current);const accounts=await client.query<{serviceId:string;moneyAccountId:string}>('SELECT "serviceId","moneyAccountId" FROM money_account_services');cardAccount=accounts.rows.find(row=>row.serviceId===cardService)!.moneyAccountId;merchantAccount=accounts.rows.find(row=>row.serviceId===merchant)!.moneyAccountId;}finally{client.release();}
},30_000);
afterAll(async()=>{isolated.db=null;if(pool)await pool.end();if(created)await administration.query(`DROP SCHEMA "${schema}" CASCADE`);if(administration)await administration.end();});
async function balance(bucket:string,accountId?:string){const result=await pool.query('SELECT coalesce(sum("deltaMinor"),0)::text AS amount FROM ledger_entries WHERE bucket=$1 AND ($2::uuid IS NULL OR "moneyAccountId"=$2)',[bucket,accountId??null]);return result.rows[0]!.amount as string;}
it("migrates posted and pending deposit history without rewriting journals, double crediting or combining card and merchant funds",async()=>{
 expect(cardAccount).not.toBe(merchantAccount);expect(await balance("MONEY_AVAILABLE",cardAccount)).toBe("7000");expect(await balance("MONEY_AVAILABLE",merchantAccount)).toBe("1000");expect(await balance("PAYOUT_CLEARING")).toBe("0");expect(await balance("MERCHANT_PAYOUT_PENDING")).toBe("2000");
 const original=await pool.connect();try{expect(await snapshot(original,historicalJournalIds)).toBe(beforeHash);}finally{original.release();}
 const before=await getMerchantOperations(owner,terminal);expect(before.payouts).toHaveLength(3);expect(before.payments.find(payment=>payment.id===batches[0]!.payment)).toMatchObject({canRefund:false,refundSource:null});
 await expect(refundMerchantPayment(owner,terminal,batches[0]!.payment,{commandId:randomUUID(),reason:"Cannot refund reserved money",expectedVersion:1})).rejects.toMatchObject({code:"REFUND_DEPOSIT_RESERVED",status:409});
 const completed={commandId:randomUUID(),outcome:"COMPLETED" as const};expect((await processMerchantDeposit(operator,batches[0]!.deposit,completed)).status).toBe("COMPLETED");expect((await processMerchantDeposit(operator,batches[0]!.deposit,completed)).status).toBe("COMPLETED");expect(await balance("MONEY_AVAILABLE",merchantAccount)).toBe("2000");
 const failed={commandId:randomUUID(),outcome:"FAILED" as const};expect((await processMerchantDeposit(operator,batches[1]!.deposit,failed)).status).toBe("FAILED");expect((await processMerchantDeposit(operator,batches[1]!.deposit,failed)).status).toBe("FAILED");expect(await balance("MERCHANT_SETTLED")).toBe("1000");expect(await balance("MERCHANT_PAYOUT_PENDING")).toBe("0");expect(await balance("MONEY_AVAILABLE",merchantAccount)).toBe("2000");
 const returned=(await getMerchantOperations(owner,terminal)).payouts.find(deposit=>deposit.id===batches[1]!.deposit)!;expect(returned.retryReview?.amount.minor).toBe("1000");const release={commandId:randomUUID(),settlementId:batches[1]!.settlement,reviewToken:returned.retryReview!.token};const receipt=await createMerchantSettlement(owner,terminal,release);expect(await createMerchantSettlement(owner,terminal,release)).toEqual(receipt);expect(receipt.moneyAccountId).toBe(merchantAccount);expect(await balance("MERCHANT_SETTLED")).toBe("0");expect(await balance("MONEY_AVAILABLE",merchantAccount)).toBe("3000");expect(await balance("MONEY_AVAILABLE",cardAccount)).toBe("7000");
 for(const [batch,command] of [[batches[0]!,completed],[batches[1]!,failed]] as const){
  const processed=await processMerchantDeposit(operator,batch.deposit,command),eventDay=processed.processedAt!.slice(0,10);
  expect(Date.parse(processed.processedAt!)).toBeGreaterThan(Date.parse(processed.createdAt));
  const activity=await getMerchantDashboard(owner,{view:`unit:${terminal}`,activity:"transfers",period:"custom",from:eventDay,to:eventDay,q:processed.testReference},{exportRows:true});
  expect(activity.activity.rows).toMatchObject([{id:processed.id,status:command.outcome,at:processed.processedAt}]);expect(activity.activity.rows).toHaveLength(1);
  // Search narrows receipt rows; totals still include every completed deposit on that day.
  const completedOnDay=(await getMerchantOperations(owner,terminal)).payouts.filter(deposit=>deposit.status==="COMPLETED"&&deposit.processedAt?.slice(0,10)===eventDay);
  expect(activity.activity.periodTotals.transferred?.minor).toBe((BigInt(completedOnDay.length)*1000n).toString());
  const link=new URL(activity.activity.rows[0]!.href,"https://etail.invalid");expect(link.pathname).toBe(`/merchant-services/terminals/${terminal}/payments`);expect(link.searchParams.get("transfer")).toBe(processed.id);
  const csv=merchantActivityCsv(activity.activity);expect(csv).toContain(`"${processed.processedAt}"`);expect(csv).not.toContain(`"${processed.createdAt}"`);
 }
 const after=await pool.connect();try{expect(await snapshot(after,historicalJournalIds)).toBe(beforeHash);}finally{after.release();}
 expect((await pool.query('SELECT count(*)::int AS count FROM money_cutover_transfers')).rows[0]!.count).toBe(2);expect((await pool.query('SELECT count(*)::int AS count FROM merchant_settlement_credits')).rows[0]!.count).toBe(1);
},30_000);

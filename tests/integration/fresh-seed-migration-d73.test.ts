import {createHash,randomUUID} from "node:crypto";
import {readdir,readFile} from "node:fs/promises";
import path from "node:path";
import {Pool} from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import {afterAll,beforeAll,expect,it,vi} from "vitest";
import {validateLocalDatabaseTarget} from "../../src/platform/database/local-target";

const isolated=vi.hoisted(()=>({schema:"",db:null as ReturnType<typeof drizzle>|null}));
vi.mock("../../src/platform/database/client",()=>({getDb:()=>{if(!isolated.db)throw new Error("Fresh-seed test database is not ready");return isolated.db;},closeDatabase:async()=>{}}));
vi.mock("pg",async importOriginal=>{
 const actual=await importOriginal<typeof import("pg")>();
 // Only the seed CLI's connection is namespaced. Its exact database/runtime
 // ownership checks still run, and every domain command uses real SQL guards.
 class SeedClient {
  private readonly client;
  constructor(options:import("pg").ClientConfig){
   if(!/^d73_fresh_seed_[a-f0-9]{32}$/.test(isolated.schema))throw new Error("Invalid isolated seed schema");
   this.client=new actual.Client({...options,options:`-c search_path=${isolated.schema},pg_catalog`});
  }
  connect(){return this.client.connect();}
  end(){return this.client.end();}
  query(text:string,values?:unknown[]){
   // The production verifier deliberately pins public. This test-only adapter
   // points those same queries at the newly created namespace, never public data.
   const scoped=text.replace(/\bpublic\./g,`${isolated.schema}.`).replace(/'public'/g,`'${isolated.schema}'`);
   return this.client.query(scoped,values);
  }
 }
 return {...actual,default:{...actual.default,Client:SeedClient}};
});
import {runFreshServiceSeed} from "../../tools/fresh-service-seed";
import {prepareSeedMarker} from "../../tools/fresh-seed-marker";

const schema=`d73_fresh_seed_${randomUUID().replaceAll("-","")}`;
let pool:Pool,administration:Pool,created=false;
const migrationsRoot=path.resolve("netlify/database/migrations");
const seedKey="fresh-services-d69";

beforeAll(async()=>{
 const connectionString=validateLocalDatabaseTarget(process.env.DATABASE_URL,{ci:process.env.CI==="true"});
 if(new URL(connectionString).pathname!=="/etail_depot_next_services_test")throw new Error("Fresh-seed proof uses only the marked test database");
 administration=new Pool({connectionString,max:1});
 const marker=await administration.query("SELECT shobj_description(oid,'pg_database') AS marker FROM pg_database WHERE datname=current_database()");
 expect(marker.rows[0]?.marker).toBe("ETAIL_DEPOT_NEXT_GREENFIELD_2026:fresh-services-d69:test");
 expect(schema).toMatch(/^d73_fresh_seed_[a-f0-9]{32}$/);
 await administration.query(`CREATE SCHEMA "${schema}"`);created=true;isolated.schema=schema;
 pool=new Pool({connectionString,max:4,options:`-c search_path=${schema},pg_catalog`});isolated.db=drizzle({client:pool});
 const client=await pool.connect();
 try{
  expect((await client.query("SELECT current_schema() AS schema")).rows[0]?.schema).toBe(schema);
  await client.query('CREATE TABLE _etail_local_migrations(name text PRIMARY KEY,sha256 text NOT NULL,applied_at timestamptz NOT NULL DEFAULT clock_timestamp())');
  const names=(await readdir(migrationsRoot)).filter(name=>/^\d+_/.test(name)).sort();
  for(const name of names){
   const source=await readFile(path.join(migrationsRoot,name,"migration.sql"),"utf8");
   await client.query("BEGIN");try{
    for(const statement of source.split("--> statement-breakpoint"))if(statement.trim())await client.query(statement);
    await client.query('INSERT INTO _etail_local_migrations(name,sha256) VALUES($1,$2)',[`${name}/migration.sql`,createHash("sha256").update(source).digest("hex")]);
    await client.query("COMMIT");
   }catch(error){await client.query("ROLLBACK");throw new Error(`Fresh-seed migration ${name} failed`,{cause:error});}
  }
 }finally{client.release();}
},30_000);
afterAll(async()=>{isolated.db=null;if(pool)await pool.end();if(created)await administration.query(`DROP SCHEMA "${schema}" CASCADE`);if(administration)await administration.end();});

it("does not exempt an altered D73 configuration from the empty application check",async()=>{
 const client=await pool.connect();
 const scoped={query:(text:string,values?:unknown[])=>client.query(text.replace(/\bpublic\./g,`${schema}.`).replace(/'public'/g,`'${schema}'`),values)} as unknown as import("pg").Client;
 try{
  await expect(client.query("UPDATE money_model_cutover SET id=id")).rejects.toMatchObject({code:"23514"});
  await client.query("BEGIN");
  await client.query("ALTER TABLE money_model_cutover ADD COLUMN unexpected text");
  await expect(prepareSeedMarker(scoped,seedKey)).rejects.toThrow("D73 cutover must contain exactly its one valid");
  expect((await client.query("SELECT to_regclass($1) AS marker",[`${schema}._etail_preview_seed`])).rows[0]?.marker).toBeNull();
 }finally{await client.query("ROLLBACK");client.release();}
});

async function snapshot(){
 const tables=await pool.query<{tablename:string}>("SELECT tablename FROM pg_tables WHERE schemaname=$1 ORDER BY tablename",[schema]);
 const rows:unknown[]=[];
 for(const {tablename} of tables.rows){const table='"'+tablename.replaceAll('"','""')+'"';rows.push({table:tablename,rows:(await pool.query(`SELECT to_jsonb(t)::text AS row FROM ${table} t ORDER BY to_jsonb(t)::text`)).rows});}
 return createHash("sha256").update(JSON.stringify(rows)).digest("hex");
}

it("migrates an empty schema, completes the current canonical seed and preserves every row on repeated preparation",async()=>{
 expect((await pool.query("SELECT to_regclass($1) AS marker",[`${schema}._etail_preview_seed`])).rows[0]?.marker).toBeNull();
 expect((await pool.query("SELECT count(*)::int AS count FROM money_model_cutover")).rows[0]?.count).toBe(1);
 const logs=vi.spyOn(console,"log").mockImplementation(()=>{});
 try{
  await runFreshServiceSeed(false);
  const marker=(await pool.query('SELECT key,state,result FROM _etail_preview_seed')).rows;
  expect(marker).toHaveLength(1);expect(marker[0]).toMatchObject({key:seedKey,state:"COMPLETE",result:{realMoney:false,counts:{people:3,services:2,cards:2,merchants:1,terminals:3,purchases:4,testRefunds:1,settlements:1}}});
  expect((await pool.query('SELECT count(*)::int AS count FROM cards')).rows[0]?.count).toBe(2);
  expect((await pool.query('SELECT count(*)::int AS count FROM merchant_terminals')).rows[0]?.count).toBe(3);
  const accounts=await pool.query('SELECT a."serviceKind",coalesce(sum(e."deltaMinor"),0)::text AS available FROM money_accounts a LEFT JOIN ledger_entries e ON e."moneyAccountId"=a.id AND e.bucket=\'MONEY_AVAILABLE\' GROUP BY a."serviceKind" ORDER BY a."serviceKind"');
  expect(accounts.rows).toEqual([{serviceKind:"CARDHOLDER",available:"46400"},{serviceKind:"MERCHANT",available:"4800"}]);
  expect((await pool.query("SELECT count(*)::int AS count FROM ledger_journals WHERE kind='MONEY_FUNDING'")).rows[0]?.count).toBe(1);
  expect((await pool.query("SELECT count(*)::int AS count FROM money_cutover_transfers")).rows[0]?.count).toBe(0);
  const before=await snapshot();await runFreshServiceSeed(false);expect(await snapshot()).toBe(before);
  expect(logs.mock.calls.map(([message])=>JSON.parse(String(message)).prepared)).toEqual([true,false]);
 }finally{logs.mockRestore();}
},30_000);

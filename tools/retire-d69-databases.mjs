#!/usr/bin/env node
// Explicit local catalog retirement only. Never creates, migrates, seeds or drops a database.
import {constants,promises as fs} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import pg from 'pg';
import {verifyPreviewRuntime,previewSeedKey,previewDatabaseComment,testDatabaseComment} from './clean-preview-target.mjs';
import {assertDatabaseServer} from './run-with-database.mjs';

const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const projectKey='ETAIL_DEPOT_NEXT_GREENFIELD_2026';
const administration='postgres://etail_local@127.0.0.1:55439/etail_depot_next';
const lock='70248967515366420'; // Same session lock as explicit database preparation.
const receiptDirectory=path.join(projectRoot,'.local','fresh-services','d69-retirement');
const identifier=value=>'"'+value.replaceAll('"','""')+'"';
const sha=value=>createHash('sha256').update(value).digest('hex');
export const RETIREMENTS=Object.freeze([
  Object.freeze({name:'etail_depot_next_services_preview',backup:'etail_depot_next_services_preview_retired_d69',oldMarker:projectKey+':fresh-services-v1:preview',newMarker:projectKey+':fresh-services-d69:preview'}),
  Object.freeze({name:'etail_depot_next_services_test',backup:'etail_depot_next_services_test_retired_d69',oldMarker:projectKey+':fresh-services-v1:test',newMarker:projectKey+':fresh-services-d69:test'}),
]);
const names=RETIREMENTS.flatMap(item=>[item.name,item.backup]);
function assert(value,message){if(!value)throw new Error(message);}
function expectedOwner(row,marker){
  return row&&row.owner==='etail_local'&&row.marker===marker&&row.template===false&&/^[1-9][0-9]*$/.test(row.oid);
}
function validPlan(plan){
  assert(plan?.projectKey===projectKey&&plan.generation==='D69'&&plan.method==='rename-existing-database'&&
    typeof plan.createdAt==='string'&&Number.isFinite(Date.parse(plan.createdAt))&&
    Array.isArray(plan.sources)&&plan.sources.length===2,'Unexpected D69 retirement receipt.');
  for(const item of RETIREMENTS){
    const matches=plan.sources.filter(row=>row.name===item.name);
    assert(matches.length===1&&matches[0].backup===item.backup&&expectedOwner(matches[0],item.oldMarker)&&
      matches[0].allowConnections===true,'Retirement receipt does not identify the exact original owned database.');
  }
}
export function classifyRetirementCatalog(rows,plan){
  assert(rows.every(row=>names.includes(row.name))&&new Set(rows.map(row=>row.name)).size===rows.length,'Unexpected retirement catalog inventory.');
  if(plan)validPlan(plan);
  const lookup=name=>rows.find(row=>row.name===name);
  const old=RETIREMENTS.every(item=>{
    const source=lookup(item.name),record=plan?.sources.find(row=>row.name===item.name);
    return expectedOwner(source,item.oldMarker)&&!lookup(item.backup)&&
      typeof source.allowConnections==='boolean'&&
      (plan?source.oid===record.oid:source.allowConnections===true);
  });
  if(old)return 'READY';
  const retired=plan&&RETIREMENTS.every(item=>{
    const backup=lookup(item.backup),source=lookup(item.name);
    const record=plan.sources.find(row=>row.name===item.name);
    return expectedOwner(backup,item.oldMarker)&&backup.oid===record.oid&&backup.allowConnections===false&&
      (!source||(expectedOwner(source,item.newMarker)&&source.oid!==record.oid&&source.allowConnections===true));
  });
  if(retired)return 'RETIRED';
  throw new Error('Database names, generations, backup collisions or saved OIDs do not match; nothing may be adopted or overwritten.');
}
async function catalog(client){
  return (await client.query(`SELECT oid::text AS oid,datname AS name,
    pg_get_userbyid(datdba) AS owner,shobj_description(oid,'pg_database') AS marker,
    datistemplate AS template,datallowconn AS "allowConnections"
    FROM pg_database WHERE datname=ANY($1::text[]) ORDER BY datname`,[names])).rows;
}
async function privateDirectory(){
  for(const entry of [path.join(projectRoot,'.local'),path.join(projectRoot,'.local','fresh-services'),receiptDirectory]){
    try{await fs.mkdir(entry,{mode:0o700});}catch(error){if(error.code!=='EEXIST')throw error;}
    const stat=await fs.lstat(entry);
    assert(stat.isDirectory()&&!stat.isSymbolicLink()&&stat.uid===process.getuid(),'Retirement receipt path must be an owned ordinary directory.');
    assert((stat.mode&0o077)===0,'Retirement receipt directory must be private.');
  }
}
async function readReceipt(name){
  for(const entry of [path.join(projectRoot,'.local'),path.join(projectRoot,'.local','fresh-services'),receiptDirectory]){
    try{
      const stat=await fs.lstat(entry);
      assert(stat.isDirectory()&&!stat.isSymbolicLink()&&stat.uid===process.getuid()&&(stat.mode&0o077)===0,'Retirement receipt parent must be an owned private directory.');
    }catch(error){if(error.code==='ENOENT')return null;throw error;}
  }
  const filename=path.join(receiptDirectory,name);
  try{
    const stat=await fs.lstat(filename);
    assert(stat.isFile()&&!stat.isSymbolicLink()&&stat.uid===process.getuid()&&(stat.mode&0o777)===0o600,'Retirement receipt must be an ordinary private file.');
    return JSON.parse(await fs.readFile(filename,'utf8'));
  }catch(error){if(error.code==='ENOENT')return null;throw error;}
}
async function writeReceipt(name,value){
  const previous=await readReceipt(name);
  if(previous){assert(JSON.stringify(previous)===JSON.stringify(value),'An existing preservation receipt differs; never overwrite it.');return;}
  const handle=await fs.open(path.join(receiptDirectory,name),constants.O_WRONLY|constants.O_CREAT|constants.O_EXCL|constants.O_NOFOLLOW,0o600);
  try{await handle.writeFile(JSON.stringify(value,null,2)+'\n');await handle.sync();}finally{await handle.close();}
  const directory=await fs.open(receiptDirectory,constants.O_RDONLY);
  try{await directory.sync();}finally{await directory.close();}
}
async function noOtherConnections(client,allowed=[]){
  const sessions=await client.query("SELECT pid FROM pg_stat_activity WHERE datname=ANY($1::text[]) AND NOT(pid=ANY($2::integer[]))",[RETIREMENTS.map(item=>item.name),allowed]);
  assert(sessions.rows.length===0,'Stop the local preview and test clients first. Retirement never terminates database clients.');
}
async function transaction(client,work){
  await client.query('BEGIN');
  try{await work();await client.query('COMMIT');}catch(error){await client.query('ROLLBACK');throw error;}
}
async function setConnections(client,enabled,plan){
  assert(classifyRetirementCatalog(await catalog(client),plan)==='READY','Original source databases are no longer present.');
  await transaction(client,async()=>{
    for(const item of RETIREMENTS)await client.query('ALTER DATABASE '+identifier(item.name)+' ALLOW_CONNECTIONS '+(enabled?'true':'false'));
  });
}
async function snapshot(client,source){
  const tables={};
  const inventory=await client.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename COLLATE \"C\"");
  for(const {tablename} of inventory.rows){
    assert(/^[A-Za-z_][A-Za-z0-9_]*$/.test(tablename),'Unexpected public table identifier.');
    const records=await client.query('SELECT to_jsonb(record)::text AS value FROM public.'+identifier(tablename)+' AS record');
    const values=records.rows.map(row=>row.value).sort(),digest=createHash('sha256');
    for(const value of values)digest.update(Buffer.byteLength(value)+':'+value+'\n');
    const columns=await client.query("SELECT column_name,data_type,udt_name,is_nullable,column_default FROM information_schema.columns WHERE table_schema='public' AND table_name=$1 ORDER BY ordinal_position",[tablename]);
    tables[tablename]={count:values.length,digest:digest.digest('hex'),columnsDigest:sha(JSON.stringify(columns.rows))};
  }
  return {database:source.name,oid:source.oid,method:'Read-only PostgreSQL to_jsonb text; exact numeric text; order-independent SHA-256',tables};
}
function assertEnvironment(){
  assert(process.platform==='darwin'&&process.arch==='arm64'&&typeof process.getuid==='function'&&process.getuid()!==0,'Retirement requires the owned non-root macOS native runtime.');
  assert(process.env.APP_ENV==='local'&&process.env.ENABLE_REAL_MONEY==='false'&&
    (!process.env.CI||process.env.CI==='false')&&!process.env.NETLIFY&&!process.env.SITE_ID&&!process.env.CONTEXT&&
    !process.env.DATABASE_URL&&!process.env.NETLIFY_DB_URL,'Use explicit local/disabled-real-money execution with no ambient database URL; hosted and CI retirement are forbidden.');
  assert(previewSeedKey==='fresh-services-d69'&&previewDatabaseComment===RETIREMENTS[0].newMarker&&testDatabaseComment===RETIREMENTS[1].newMarker,'Apply the reviewed D69 generation patch before retirement.');
}
async function main(){
  const mode=process.argv[2];
  assert(process.argv.length===3&&['--check','--retire'].includes(mode),'Use retire-d69-databases.mjs --check|--retire. Both fixed local databases are selected together.');
  assertEnvironment();
  process.umask(0o077);
  await verifyPreviewRuntime();
  const client=new pg.Client({connectionString:administration,connectionTimeoutMillis:5000,application_name:'etail-d69-database-retirement'});
  const readers=[];
  let connected=false,locked=false,plan=null;
  try{
    await client.connect();connected=true;
    const identity=await client.query("SELECT version(),current_database(),current_user,inet_server_addr()::text AS address,current_setting('data_directory') AS directory,current_setting('port') AS port");
    assertDatabaseServer(identity.rows[0],{ci:false,preview:false});
    assert(identity.rows[0].directory===path.join(projectRoot,'.local','postgres','data')&&identity.rows[0].port==='55439','Unexpected native PostgreSQL data directory or port.');
    await client.query("SET lock_timeout='5s'");
    await client.query("SET statement_timeout='30s'");
    const acquired=await client.query('SELECT pg_try_advisory_lock($1::bigint) AS locked',[lock]);
    assert(acquired.rows[0]?.locked===true,'Explicit preparation is running; wait for it to finish before retirement.');
    locked=true;
    plan=await readReceipt('plan.json');
    const rows=await catalog(client),state=classifyRetirementCatalog(rows,plan);
    if(mode==='--check'){
      if(state==='READY')await noOtherConnections(client);
      console.log(JSON.stringify({mode:'READ_ONLY',state,databases:RETIREMENTS.map(item=>({source:item.name,backup:item.backup})),clientTermination:false,rowWrites:false}));
      return;
    }
    await privateDirectory();
    if(state==='RETIRED'){
      const preservation=await readReceipt('preservation.json');
      assert(preservation?.planDigest===sha(JSON.stringify(plan)),'Missing matching preservation evidence; do not manufacture a completed receipt.');
      await writeReceipt('complete.json',{projectKey,generation:'D69',planDigest:sha(JSON.stringify(plan)),preservationDigest:sha(JSON.stringify(preservation)),backups:RETIREMENTS.map(item=>({name:item.backup,oid:plan.sources.find(row=>row.name===item.name).oid,allowConnections:false}))});
      console.log(JSON.stringify({retired:false,state:'ALREADY_RETIRED',message:'The exact backup OIDs remain preserved; no database was changed.'}));
      return;
    }
    await noOtherConnections(client);
    if(!plan){
      plan={projectKey,generation:'D69',method:'rename-existing-database',createdAt:new Date().toISOString(),sources:RETIREMENTS.map(item=>({...rows.find(row=>row.name===item.name),backup:item.backup}))};
      validPlan(plan);
      await writeReceipt('plan.json',plan);
    }
    // An interrupted run may have disabled access before it could rename.
    // Restore only the exact saved original OIDs long enough to open our read-only snapshots.
    if(rows.some(row=>row.allowConnections===false))await setConnections(client,true,plan);
    for(const item of RETIREMENTS){
      const reader=new pg.Client({connectionString:administration.replace('/etail_depot_next','/'+item.name),connectionTimeoutMillis:5000,application_name:'etail-d69-preservation-read-only'});
      readers.push(reader);await reader.connect();
      await reader.query('SET default_transaction_read_only=on');
      const confirmed=await reader.query("SELECT current_database(),current_user,pg_backend_pid() AS pid,oid::text AS oid FROM pg_database WHERE datname=current_database()");
      const row=confirmed.rows[0];
      assert(row.current_database===item.name&&row.current_user==='etail_local'&&row.oid===plan.sources.find(source=>source.name===item.name).oid,'Preservation reader reached a different database.');
      reader.retirementPid=row.pid;
    }
    await noOtherConnections(client,readers.map(reader=>reader.retirementPid));
    // Prevent new connections before hashing. Existing snapshot readers remain read-only.
    await setConnections(client,false,plan);
    await noOtherConnections(client,readers.map(reader=>reader.retirementPid));
    const snapshots=[];
    for(let index=0;index<readers.length;index++){
      await readers[index].query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
      snapshots.push(await snapshot(readers[index],plan.sources.find(row=>row.name===RETIREMENTS[index].name)));
      await readers[index].query('COMMIT');
    }
    const preservation={projectKey,generation:'D69',planDigest:sha(JSON.stringify(plan)),snapshots};
    await writeReceipt('preservation.json',preservation);
    await Promise.all(readers.map(reader=>reader.end()));readers.length=0;
    await noOtherConnections(client);
    assert(classifyRetirementCatalog(await catalog(client),plan)==='READY','Catalog changed before retirement.');
    // The pair of renames commits together. There are no database/table deletion statements.
    await transaction(client,async()=>{
      for(const item of RETIREMENTS)await client.query('ALTER DATABASE '+identifier(item.name)+' RENAME TO '+identifier(item.backup));
    });
    assert(classifyRetirementCatalog(await catalog(client),plan)==='RETIRED','Retired OIDs could not be verified.');
    await writeReceipt('complete.json',{projectKey,generation:'D69',planDigest:sha(JSON.stringify(plan)),preservationDigest:sha(JSON.stringify(preservation)),backups:RETIREMENTS.map(item=>({name:item.backup,oid:plan.sources.find(row=>row.name===item.name).oid,allowConnections:false}))});
    console.log(JSON.stringify({retired:true,backups:RETIREMENTS.map(item=>item.backup),allowConnections:false,rowWrites:false,clientTermination:false,proof:'.local/fresh-services/d69-retirement/complete.json',next:'Run the existing explicit preview and test preparation commands.'}));
  }catch(error){
    // If renaming did not commit, leave the exact original databases usable.
    // A crash before this cleanup is safely recognized from the saved OIDs on retry.
    try{if(mode==='--retire'&&connected&&plan&&classifyRetirementCatalog(await catalog(client),plan)==='READY')await setConnections(client,true,plan);}catch{/* Receipt and catalog remain available for explicit recovery. */}
    throw error;
  }finally{
    await Promise.allSettled(readers.map(reader=>reader.end()));
    try{if(locked)await client.query('SELECT pg_advisory_unlock($1::bigint)',[lock]);}finally{if(connected)await client.end();}
  }
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  main().catch(error=>{console.error(error.message);process.exitCode=1;});
}

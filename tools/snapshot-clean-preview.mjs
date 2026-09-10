#!/usr/bin/env node
/** Read-only, all-public-table replay proof. Stores counts and hashes, never record bodies. */
import {constants,promises as fs} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import pg from 'pg';
import {previewDatabase,previewSeedKey,verifyPreviewRuntime,verifyPreviewDatabase} from './clean-preview-target.mjs';

const phase=process.argv[2];
if(!['before','after'].includes(phase)||process.argv.length!==3)throw new Error('Use snapshot-clean-preview.mjs before|after.');
const expected=`postgres://etail_local@127.0.0.1:55439/${previewDatabase}`;
if(process.env.DATABASE_URL!==expected||process.env.APP_ENV!=='local'||process.env.ENABLE_REAL_MONEY!=='false'||
  (process.env.CI&&process.env.CI!=='false')||process.env.NETLIFY||process.env.SITE_ID||process.env.CONTEXT)throw new Error('Snapshot requires the exact local clean preview and real money disabled.');
const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const directory=path.join(projectRoot,'.local',`preview-replay-${previewSeedKey}`);
const filename=path.join(directory,`${phase}.json`);
const sha=value=>createHash('sha256').update(value).digest('hex');
process.umask(0o077);

async function privateDirectory() {
  for(const entry of [path.join(projectRoot,'.local'),directory]) {
    try {await fs.mkdir(entry,{mode:0o700});}catch(error){if(error.code!=='EEXIST')throw error;}
    const stat=await fs.lstat(entry);
    if(!stat.isDirectory()||stat.isSymbolicLink()||(process.getuid&&stat.uid!==process.getuid()))throw new Error('Snapshot storage must be a project-owned private directory.');
    await fs.chmod(entry,0o700);
  }
}
async function privateRead(name) {
  const stat=await fs.lstat(name);
  if(!stat.isFile()||stat.isSymbolicLink()||(stat.mode&0o777)!==0o600||(process.getuid&&stat.uid!==process.getuid()))throw new Error('Snapshot must be an ordinary owner-only file.');
  return JSON.parse(await fs.readFile(name,'utf8'));
}
async function privateWrite(name,value) {
  const file=await fs.open(name,constants.O_WRONLY|constants.O_CREAT|constants.O_EXCL|constants.O_NOFOLLOW,0o600);
  try {await file.writeFile(`${JSON.stringify(value,null,2)}\n`);await file.sync();}finally{await file.close();}
}

await verifyPreviewRuntime();
await privateDirectory();
const client=new pg.Client({connectionString:expected,connectionTimeoutMillis:5000,application_name:'etail-clean-preview-noop-snapshot'});
let connected=false;
try {
  await client.connect();connected=true;
  await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
  await verifyPreviewDatabase(client);
  const tableRows=await client.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename COLLATE \"C\"");
  const tables={};
  for(const {tablename} of tableRows.rows) {
    if(!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tablename))throw new Error('Unexpected table identifier.');
    // PostgreSQL produces the canonical JSON text; bigint/decimal values never pass through JS numbers.
    const records=await client.query(`SELECT to_jsonb(record)::text AS value FROM public."${tablename}" AS record`);
    const rows=records.rows.map(row=>row.value).sort();
    const digest=createHash('sha256');
    for(const row of rows)digest.update(`${Buffer.byteLength(row)}:${row}\n`);
    const columns=await client.query('SELECT column_name,data_type,udt_name,is_nullable,column_default FROM information_schema.columns WHERE table_schema=\'public\' AND table_name=$1 ORDER BY ordinal_position',[tablename]);
    tables[tablename]={count:rows.length,digest:digest.digest('hex'),columnsDigest:sha(JSON.stringify(columns.rows))};
  }
  await client.query('COMMIT');
  const snapshot={database:previewDatabase,method:'PostgreSQL to_jsonb text; row-order-independent SHA-256; exact numeric text',tables};
  const digest=sha(JSON.stringify(snapshot));
  if(phase==='after') {
    const before=await privateRead(path.join(directory,'before.json'));
    if(JSON.stringify(before)!==JSON.stringify(snapshot)) {
      const changed=[...new Set([...Object.keys(before.tables??{}),...Object.keys(tables)])].filter(name=>JSON.stringify(before.tables?.[name])!==JSON.stringify(tables[name]));
      throw new Error(`Preview changed in public tables: ${changed.join(', ')}. No database writes were performed by this checker.`);
    }
  }
  await privateWrite(filename,snapshot);
  console.log(JSON.stringify({phase,database:previewDatabase,tables:Object.keys(tables).length,rows:Object.values(tables).reduce((sum,table)=>sum+table.count,0),digest,result:phase==='after'?'UNCHANGED':'CAPTURED',privateSnapshot:path.relative(projectRoot,filename),mode:'0600',directoryMode:'0700'}));
} finally {if(connected)await client.end();}

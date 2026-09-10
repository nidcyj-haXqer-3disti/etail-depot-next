#!/usr/bin/env node
// Only the two explicitly marked fresh-service databases can run application code.
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { previewDatabase, previewDatabaseComment, testDatabase, testDatabaseComment, verifyPreviewRuntime, verifyPreviewDatabase } from './clean-preview-target.mjs';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const administrationDatabase = 'etail_depot_next';

export function databaseConnectionSettings({ preview = false, env = process.env } = {}) {
  const hosted = Boolean(env.NETLIFY || env.SITE_ID || env.CONTEXT);
  if (preview && ((env.CI && env.CI !== 'false') || hosted)) throw new Error('Preview preparation and startup are local only, never CI or hosted.');
  if ((env.APP_ENV && !['local', 'test'].includes(env.APP_ENV)) || hosted || (env.ENABLE_REAL_MONEY && env.ENABLE_REAL_MONEY !== 'false')) throw new Error('Database tools require local/test execution and real money disabled.');
  const ci = env.CI === 'true', databaseName = preview ? previewDatabase : testDatabase;
  if (ci && !env.DATABASE_URL) throw new Error('CI requires an explicit fresh test DATABASE_URL.');
  const raw = env.DATABASE_URL ?? `postgres://etail_local@127.0.0.1:55439/${databaseName}`;
  let url; try { url = new URL(raw); } catch { throw new Error('Database URL is invalid.'); }
  if (raw !== url.href || /[\u0000-\u0020\u007f]/.test(raw) || raw.includes('?') || raw.includes('#') || !['postgres:', 'postgresql:'].includes(url.protocol) || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) throw new Error('Database tools require a canonical plain loopback PostgreSQL URL.');
  if (url.pathname !== `/${databaseName}`) throw new Error('The database must exactly match the selected fresh test/preview mode; old databases are recovery-only.');
  if (ci) {
    const port = Number(url.port || '5432');
    if (url.username !== 'etail_ci' || !Number.isInteger(port) || port < 1 || port > 65535) throw new Error('CI requires its isolated role and a valid loopback port.');
  } else if (url.port !== '55439' || url.username !== 'etail_local' || url.password) throw new Error('Local tools require the project-owned PostgreSQL runtime.');
  const administration = new URL(url);
  if (!ci) administration.pathname = `/${administrationDatabase}`;
  return { ci, preview, databaseName, administration: administration.href, target: url.href };
}

export function assertDatabaseServer(actual, settings) {
  if (!/^PostgreSQL 18\.6(?:\s|$)/.test(actual?.version ?? '') || /pglite/i.test(actual.version)) throw new Error('PostgreSQL18.6 is required.');
  if (!['127.0.0.1/32', '::1/128'].includes(actual.address) && !(settings.ci && actual.container_address === true)) throw new Error('The server address is not the expected local/container address.');
  if (actual.current_user !== (settings.ci ? 'etail_ci' : 'etail_local') || actual.current_database !== (settings.ci ? testDatabase : administrationDatabase)) throw new Error('The server did not confirm the expected administration identity.');
}
export function assertFreshDatabaseOwnership(existing, settings) {
  const marker = settings.preview ? previewDatabaseComment : testDatabaseComment;
  if (existing.owner !== (settings.ci ? 'etail_ci' : 'etail_local') || existing.marker !== marker) throw new Error('Fresh database name collision or ownership mismatch; refusing adoption.');
}

/** Catalog administration only. No table in any preserved database is read or changed. */
export async function prepareFreshDatabase(settings) {
  const expected = databaseConnectionSettings({preview: settings.preview, env: {CI: settings.ci ? 'true' : 'false', APP_ENV: settings.preview ? 'local' : 'test', ENABLE_REAL_MONEY: 'false', DATABASE_URL: settings.target}});
  if (settings.databaseName !== expected.databaseName || settings.administration !== expected.administration) throw new Error('Forged database settings are not accepted.');
  if (!settings.ci) await verifyPreviewRuntime();
  const client = new pg.Client({ connectionString: settings.administration, connectionTimeoutMillis: 5000, application_name: 'etail-fresh-services-prepare' });
  let connected = false, locked = false;
  try {
    await client.connect(); connected = true;
    const response = await client.query(`SELECT version(), current_database(), current_user, inet_server_addr()::text AS address,
      (inet_server_addr() <<= inet '10.0.0.0/8' OR inet_server_addr() <<= inet '172.16.0.0/12' OR inet_server_addr() <<= inet '192.168.0.0/16') AS container_address`);
    assertDatabaseServer(response.rows[0], settings);
    await client.query("SET lock_timeout = '20s'");
    await client.query('SELECT pg_advisory_lock(70248967515366420::bigint)'); locked = true;
    const result = await client.query("SELECT pg_get_userbyid(datdba) AS owner, shobj_description(oid, 'pg_database') AS marker FROM pg_database WHERE datname = $1", [settings.databaseName]);
    const marker = settings.preview ? previewDatabaseComment : testDatabaseComment;
    if (result.rowCount) {
      // The workflow creates one disposable, empty CI database before this tool runs.
      if (settings.ci && result.rows[0].owner === 'etail_ci' && result.rows[0].marker === null) {
        const populated = await client.query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema')) AS present");
        if (populated.rows[0]?.present) throw new Error('Unmarked CI database is populated; refusing adoption.');
        await client.query(`COMMENT ON DATABASE ${testDatabase} IS '${testDatabaseComment}'`);
      } else assertFreshDatabaseOwnership(result.rows[0], settings);
    } else {
      if (settings.ci) throw new Error('CI must supply its fresh test database.');
      // Identifiers and comments are fixed reviewed constants, never input strings.
      await client.query(settings.preview ? `CREATE DATABASE ${previewDatabase}` : `CREATE DATABASE ${testDatabase}`);
      await client.query(`COMMENT ON DATABASE ${settings.databaseName} IS '${marker}'`);
    }
    console.log(`Verified fresh ${settings.preview ? 'preview' : 'test'} database ownership.`);
  } finally {
    try { if (locked) await client.query('SELECT pg_advisory_unlock(70248967515366420::bigint)'); }
    finally { if (connected) await client.end(); }
  }
}
async function verifyPreview(settings) {
  await verifyPreviewRuntime();
  const client = new pg.Client({ connectionString: settings.target, connectionTimeoutMillis: 5000 });
  try { await client.connect(); await verifyPreviewDatabase(client); }
  finally { await client.end(); }
  console.log('Fresh preview verified; startup performs no migration or seed writes.');
}
function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: projectRoot, env, stdio: 'inherit' });
    const interrupt = () => child.kill('SIGINT'), stop = () => child.kill('SIGTERM');
    process.once('SIGINT', interrupt); process.once('SIGTERM', stop);
    const cleanup = () => { process.off('SIGINT', interrupt); process.off('SIGTERM', stop); };
    child.once('error', () => { cleanup(); reject(new Error('The installed tool could not start.')); });
    child.once('exit', (code, signal) => { cleanup(); resolve(code ?? (signal === 'SIGINT' ? 130 : 143)); });
  });
}
async function main() {
  const input = process.argv.slice(2), preparePreview = input[0] === '--prepare-preview';
  const preview = preparePreview || input[0] === '--preview'; if (preview) input.shift();
  const [tool, ...args] = input;
  if (preparePreview ? input.length !== 0 : !tool || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(tool)) throw new Error('Use [--preview] <installed-tool> [args], or --prepare-preview for explicit initialization.');
  const settings = databaseConnectionSettings({ preview });
  const targets = JSON.parse(await fs.readFile(path.join(projectRoot, 'project-targets.json'), 'utf8'));
  if (targets.project_key !== 'ETAIL_DEPOT_NEXT_GREENFIELD_2026' || targets.release?.real_money_allowed !== false) throw new Error('Unexpected project target.');
  const env = { ...process.env, PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH ?? ''}`, APP_ENV: preview ? 'local' : 'test', ENABLE_REAL_MONEY: 'false', ENABLE_LOCAL_FIXTURE_IDENTITY: 'true', ETAIL_PUBLIC_ORIGIN: 'http://127.0.0.1:3100', DATABASE_URL: settings.target };
  if (preview && !preparePreview) await verifyPreview(settings); else await prepareFreshDatabase(settings);
  for (const filename of preparePreview ? ['tools/migrate.ts', 'tools/seed-clean-preview.ts'] : preview ? [] : ['tools/migrate.ts', 'tools/seed-fixtures.ts']) {
    const code = await run(process.execPath, ['--import', 'tsx', filename], env);
    if (code !== 0) { process.exitCode = code; return; }
  }
  if (preparePreview) return;
  const executable = path.join(projectRoot, 'node_modules', '.bin', tool);
  await fs.access(executable, fs.constants.X_OK);
  process.exitCode = await run(executable, args, env);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(() => { console.error('Fresh database command failed; check the explicit target, ownership marker and preparation state. No preserved database was migrated or seeded.'); process.exitCode = 1; });

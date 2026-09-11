// Local/CI executor only. Netlify owns hosted migration execution.
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migrationsRoot = path.join(projectRoot, 'netlify', 'database', 'migrations');
const migrationLock = '70248967515366419';

function databaseUrl(): string {
  if (!['local', 'test'].includes(process.env.APP_ENV ?? '') || Boolean(process.env.NETLIFY || process.env.SITE_ID || process.env.CONTEXT) || process.env.ENABLE_REAL_MONEY !== 'false') {
    throw new Error('Migrations require an explicit local/test environment with real money disabled; hosted execution belongs to Netlify.');
  }
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must explicitly identify the isolated local database.');
  let url: URL;
  try { url = new URL(process.env.DATABASE_URL); } catch { throw new Error('DATABASE_URL is invalid.'); }
  if (process.env.DATABASE_URL !== url.href || /[\u0000-\u0020\u007f]/.test(process.env.DATABASE_URL) || process.env.DATABASE_URL.includes('?') || process.env.DATABASE_URL.includes('#')) throw new Error('Database URL must be canonical and contain no options.');
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) || url.search || url.hash) {
    throw new Error('Local migrations accept only a plain loopback PostgreSQL URL.');
  }
  if (!['/etail_depot_next_services_test', '/etail_depot_next_services_preview'].includes(url.pathname)) {
    throw new Error('Local migrations are restricted to the new Etail Depot Next local/test databases.');
  }
  if (process.env.CI === 'true') {
    if (url.pathname !== '/etail_depot_next_services_test' || url.username !== 'etail_ci') throw new Error('CI migrations require the explicit isolated test database and etail_ci role.');
  } else if (url.port !== '55439' || url.username !== 'etail_local' || url.password) {
    throw new Error('Local migrations require the guarded project-owned PostgreSQL runtime.');
  }
  return url.toString();
}

interface Migration { name: string; filename: string; sequence: bigint; sql: string; checksum: string }

async function loadMigrations(): Promise<Migration[]> {
  const rootStat = await fs.lstat(migrationsRoot);
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) throw new Error('Migration directory must be a real project directory.');
  const entries = await fs.readdir(migrationsRoot, { withFileTypes: true });
  const migrations: Migration[] = [];
  for (const entry of entries) {
    if (!/^\d+/.test(entry.name)) {
      if (entry.name.endsWith('.sql')) throw new Error('SQL migrations require a numeric ordering prefix.');
      continue;
    }
    const filename = path.join(migrationsRoot, entry.name, ...(entry.isDirectory() ? ['migration.sql'] : []));
    if (!entry.isDirectory() && !entry.name.endsWith('.sql')) continue;
    if (entry.isSymbolicLink()) throw new Error('Migration symlinks are not permitted.');
    const stat = await fs.lstat(filename);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Each migration must be an ordinary SQL file.');
    const sql = await fs.readFile(filename, 'utf8');
    if (!sql.trim()) throw new Error('Empty migrations are not accepted as executable evidence.');
    migrations.push({ name: path.relative(migrationsRoot, filename), filename, sequence: BigInt(entry.name.match(/^\d+/)![0]), sql, checksum: createHash('sha256').update(sql).digest('hex') });
  }
  migrations.sort((left, right) => left.sequence < right.sequence ? -1 : left.sequence > right.sequence ? 1 : left.name.localeCompare(right.name));
  if (!migrations.length) throw new Error('No executable SQL migrations were found.');
  if (new Set(migrations.map((migration) => migration.sequence.toString())).size !== migrations.length) {
    throw new Error('Migration ordering prefixes must be unique.');
  }
  return migrations;
}

async function migrate(): Promise<void> {
  const connectionString = databaseUrl();
  const targets = JSON.parse(await fs.readFile(path.join(projectRoot, 'project-targets.json'), 'utf8'));
  if (targets.project_key !== 'ETAIL_DEPOT_NEXT_GREENFIELD_2026' || targets.release?.real_money_allowed !== false) {
    throw new Error('Unexpected project target; refusing migration execution.');
  }
  if (process.env.CI !== 'true') {
    const { verifyPreviewRuntime } = await import(new URL('./clean-preview-target.mjs', import.meta.url).href) as { verifyPreviewRuntime: () => Promise<void> };
    await verifyPreviewRuntime();
  }
  const migrations = await loadMigrations();
  const client = new pg.Client({ connectionString, connectionTimeoutMillis: 5_000, application_name: 'etail-local-migrations' });
  let connected = false;
  let locked = false;
  try {
    try { await client.connect(); connected = true; } catch { throw new Error('Cannot connect to the isolated local PostgreSQL. Start db:start/db:serve and use matching process permissions.'); }
    const identity = await client.query<{ version: string; current_database: string; current_user: string; address: string; container_address: boolean }>(`SELECT version(), current_database(), current_user,
      inet_server_addr()::text AS address,
      (inet_server_addr() <<= inet '10.0.0.0/8' OR inet_server_addr() <<= inet '172.16.0.0/12' OR inet_server_addr() <<= inet '192.168.0.0/16') AS container_address`);
    if (!/^PostgreSQL 18\.6(?:\s|$)/.test(identity.rows[0]?.version ?? '') || /pglite/i.test(identity.rows[0].version)) {
      throw new Error('Migrations require PostgreSQL18.6.');
    }
    const actual = identity.rows[0];
    const allowedAddress = ['127.0.0.1/32', '::1/128'].includes(actual.address) || (process.env.CI === 'true' && actual.container_address === true);
    if (!allowedAddress || actual.current_database !== new URL(connectionString).pathname.slice(1) || actual.current_user !== (process.env.CI === 'true' ? 'etail_ci' : 'etail_local')) {
      throw new Error('PostgreSQL did not confirm the expected local database connection.');
    }
    const expectedMarker = `ETAIL_DEPOT_NEXT_GREENFIELD_2026:fresh-services-d69:${actual.current_database.endsWith('_preview') ? 'preview' : 'test'}`;
    const owned = await client.query("SELECT pg_get_userbyid(datdba) AS owner, shobj_description(oid, 'pg_database') AS marker FROM pg_database WHERE datname = current_database()");
    if (owned.rows[0]?.owner !== actual.current_user || owned.rows[0]?.marker !== expectedMarker) throw new Error('Fresh database ownership/generation was not confirmed; prepare it explicitly first.');
    await client.query('SET lock_timeout = \'20s\'');
    await client.query('SELECT pg_advisory_lock($1::bigint)', [migrationLock]);
    locked = true;
    await client.query(`CREATE TABLE IF NOT EXISTS public._etail_local_migrations (
      name text PRIMARY KEY,
      sha256 text NOT NULL CHECK (sha256 ~ '^[a-f0-9]{64}$'),
      applied_at timestamptz NOT NULL DEFAULT now()
    )`);
    const applied = await client.query<{ name: string; sha256: string }>('SELECT name, sha256 FROM public._etail_local_migrations ORDER BY applied_at, name');
    const known = new Map(migrations.map((migration) => [migration.name, migration]));
    for (const record of applied.rows) {
      const migration = known.get(record.name);
      if (!migration || migration.checksum !== record.sha256) throw new Error('An applied local migration is missing or changed. Add a corrective migration; do not rewrite history.');
    }
    const completed = new Set(applied.rows.map((record) => record.name));
    let pendingSeen = false;
    for (const migration of migrations) {
      if (!completed.has(migration.name)) pendingSeen = true;
      else if (pendingSeen) throw new Error('A migration was inserted before applied history. Add a new migration at the end.');
    }
    let appliedCount = 0;
    for (const migration of migrations) {
      if (completed.has(migration.name)) continue;
      await client.query('BEGIN');
      try {
        for (const statement of migration.sql.split('--> statement-breakpoint')) {
          if (statement.trim()) await client.query(statement);
        }
        await client.query('INSERT INTO public._etail_local_migrations (name, sha256) VALUES ($1, $2)', [migration.name, migration.checksum]);
        await client.query('COMMIT');
        appliedCount += 1;
        console.log(`Applied local migration ${migration.name}.`);
      } catch (error) {
        await client.query('ROLLBACK');
        const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : 'unknown';
        throw new Error(`Migration ${migration.name} rolled back (database code ${/^[A-Z0-9]{5}$/.test(code) ? code : 'unknown'}).`);
      }
    }
    console.log(`Local migrations verified: ${migrations.length} total, ${appliedCount} applied.`);
  } finally {
    try { if (locked) await client.query('SELECT pg_advisory_unlock($1::bigint)', [migrationLock]); }
    finally { if (connected) await client.end(); }
  }
}

migrate().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Local migration failed.');
  process.exitCode = 1;
});

// Fixed local generation. This module never creates, migrates, seeds or resets a database.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const testDatabase = 'etail_depot_next_services_test';
export const testDatabaseComment = 'ETAIL_DEPOT_NEXT_GREENFIELD_2026:fresh-services-v1:test';
export const previewDatabase = 'etail_depot_next_services_preview';
export const previewDatabaseComment = 'ETAIL_DEPOT_NEXT_GREENFIELD_2026:fresh-services-v1:preview';
export const previewSeedKey = 'fresh-services-v1';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function verifyPreviewRuntime() {
  const markerPath = path.join(projectRoot, '.local', 'postgres', 'runtime.json');
  for (const entry of [path.join(projectRoot, '.local'), path.dirname(markerPath), markerPath]) {
    const stat = await fs.lstat(entry);
    if (stat.isSymbolicLink()) throw new Error('Clean preview runtime paths cannot be symbolic links.');
  }
  const marker = JSON.parse(await fs.readFile(markerPath, 'utf8'));
  const targets = JSON.parse(await fs.readFile(path.join(projectRoot, 'project-targets.json'), 'utf8'));
  if (targets.project_key !== 'ETAIL_DEPOT_NEXT_GREENFIELD_2026' || targets.release?.real_money_allowed !== false ||
      marker.projectKey !== targets.project_key || marker.purpose !== 'synthetic-local-only' ||
      marker.version !== '18.6' || marker.nativeVersion !== 'postgres (PostgreSQL) 18.6' || marker.port !== 55439 || marker.username !== 'etail_local' || marker.database !== 'etail_depot_next') {
    throw new Error('Clean preview requires the marked project-owned native PostgreSQL runtime.');
  }
}

export async function verifyPreviewDatabase(client, { requireComplete = true } = {}) {
  const result = await client.query(`SELECT version(), current_database(), current_user,
    inet_server_addr()::text AS address, pg_get_userbyid(d.datdba) AS owner,
    shobj_description(d.oid, 'pg_database') AS marker
    FROM pg_database d WHERE d.datname = current_database()`);
  const actual = result.rows[0];
  if (!/^PostgreSQL 18\.6(?:\s|$)/.test(actual?.version ?? '') || /pglite/i.test(actual.version) ||
      actual.current_database !== previewDatabase || actual.current_user !== 'etail_local' ||
      actual.owner !== 'etail_local' || !['127.0.0.1/32', '::1/128'].includes(actual.address) ||
      actual.marker !== previewDatabaseComment) {
    throw new Error('PostgreSQL did not confirm the explicitly owned clean preview generation.');
  }
  if (requireComplete) {
    const table = await client.query("SELECT to_regclass('public._etail_preview_seed') AS name");
    if (!table.rows[0]?.name) throw new Error('Clean preview has not been explicitly prepared; startup never seeds data.');
    const seed = await client.query('SELECT state FROM public._etail_preview_seed WHERE key = $1', [previewSeedKey]);
    if (seed.rows[0]?.state !== 'COMPLETE') throw new Error('Clean preview preparation is incomplete; startup never resumes seeding.');
  }
}

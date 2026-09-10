#!/usr/bin/env node
// Native, project-owned PostgreSQL for synthetic local development and tests.
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runtimeRoot = path.join(projectRoot, '.local', 'postgres');
const nativeRoot = path.join(runtimeRoot, 'native');
const dataRoot = path.join(runtimeRoot, 'data');
const socketRoot = path.join(runtimeRoot, 'socket');
const markerPath = path.join(runtimeRoot, 'runtime.json');
const expectedProject = 'ETAIL_DEPOT_NEXT_GREENFIELD_2026';
const version = '18.6';
const port = 55439;
const database = 'etail_depot_next';
const username = 'etail_local';
const sha256 = '8f6ed6f38195b50a40712ada8b2a12060b6193c1a6977a6eb5cff053bb5a1b89';
const archiveUrl = 'https://repo1.maven.org/maven2/io/zonky/test/postgres/embedded-postgres-binaries-darwin-arm64v8/18.6.0/embedded-postgres-binaries-darwin-arm64v8-18.6.0.jar';
const pg = (name) => path.join(nativeRoot, 'bin', name);
process.umask(0o077);

async function exists(filename) {
  try { await fs.lstat(filename); return true; } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function rejectSymlink(filename) {
  if (await exists(filename)) {
    const stat = await fs.lstat(filename);
    if (stat.isSymbolicLink()) throw new Error(`Refusing symlink: ${filename}`);
  }
}

async function guard() {
  if (process.platform !== 'darwin' || process.arch !== 'arm64') {
    throw new Error('This pinned native runtime supports macOS arm64 only. CI must supply real PostgreSQL separately.');
  }
  if (process.getuid?.() === 0) throw new Error('Never run this local runtime as root.');
  const targets = JSON.parse(await fs.readFile(path.join(projectRoot, 'project-targets.json'), 'utf8'));
  if (targets.project_key !== expectedProject || targets.release?.real_money_allowed !== false) {
    throw new Error('This harness is restricted to the isolated Etail Depot Next synthetic sandbox.');
  }
  for (const entry of [path.join(projectRoot, '.local'), runtimeRoot, nativeRoot, dataRoot, socketRoot, markerPath]) {
    await rejectSymlink(entry);
  }
  if (await exists(markerPath)) {
    const marker = JSON.parse(await fs.readFile(markerPath, 'utf8'));
    if (marker.projectKey !== expectedProject || marker.archiveSha256 !== sha256 || marker.port !== port) {
      throw new Error('Runtime ownership/version mismatch; refusing to adopt existing files.');
    }
  } else if (await exists(runtimeRoot)) {
    const entries = await fs.readdir(runtimeRoot);
    if (entries.length) throw new Error('Unmarked runtime directory is not empty; refusing to adopt it.');
  }
}

function run(command, args, { input, allowedCodes = [0], timeoutMs = 30_000 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: runtimeRoot,
      env: { ...process.env, LC_ALL: 'C', LANG: 'C' },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => { child.kill('SIGTERM'); }, timeoutMs);
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', (error) => { clearTimeout(timer); reject(error); });
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      if (!allowedCodes.includes(code)) {
        reject(new Error(`${path.basename(command)} exited ${code ?? signal}: ${stderr.trim() || stdout.trim()}`));
      } else resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() });
    });
    child.stdin.end(input);
  });
}

async function download(url) {
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`Download failed with HTTP ${response.status}.`);
  return Buffer.from(await response.arrayBuffer());
}

// Validate the entire ZIP/TAR inventory before extracting any native file.
// Python's standard archive readers avoid shell expansion and preserve safe links.
const extractArchive = String.raw`
import io, os, pathlib, posixpath, shutil, sys, tarfile, zipfile
jar, destination = sys.argv[1:]
root = pathlib.Path(destination)
def safe_name(name):
    normalized = posixpath.normpath(name)
    if name.startswith('/') or normalized == '..' or normalized.startswith('../') or '\\' in name:
        raise ValueError('Unsafe archive path: ' + name)
    return normalized
with zipfile.ZipFile(jar) as zipped:
    for item in zipped.infolist():
        safe_name(item.filename)
    archives = [item for item in zipped.infolist() if item.filename.endswith('.txz')]
    if len(archives) != 1 or archives[0].file_size > 250_000_000:
        raise ValueError('Unexpected native archive inventory')
    payload = zipped.read(archives[0])
with tarfile.open(fileobj=io.BytesIO(payload), mode='r:xz') as archive:
    members = archive.getmembers()
    if sum(member.size for member in members) > 500_000_000:
        raise ValueError('Native archive exceeds size limit')
    seen = set()
    links = set()
    for member in members:
        normalized = safe_name(member.name)
        if normalized in seen:
            raise ValueError('Duplicate native archive path: ' + normalized)
        seen.add(normalized)
        if not (member.isfile() or member.isdir() or member.issym() or member.islnk()):
            raise ValueError('Unsupported archive member: ' + member.name)
        if member.issym():
            if member.linkname.startswith('/'):
                raise ValueError('Absolute native symlink')
            safe_name(posixpath.join(posixpath.dirname(normalized), member.linkname))
            links.add(normalized)
        elif member.islnk():
            safe_name(member.linkname)
    for member in members:
        normalized = safe_name(member.name)
        for parent in pathlib.PurePosixPath(normalized).parents:
            if str(parent) in links:
                raise ValueError('Archive writes through a symlink')
    root.mkdir(mode=0o700)
    for member in members:
        target = root / safe_name(member.name)
        if member.isdir():
            target.mkdir(mode=0o700, parents=True, exist_ok=True)
        elif member.isfile():
            target.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
            with archive.extractfile(member) as source, open(target, 'xb') as output:
                shutil.copyfileobj(source, output)
            target.chmod(0o700 if member.mode & 0o111 else 0o600)
    for member in members:
        target = root / safe_name(member.name)
        if member.issym():
            target.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
            target.symlink_to(member.linkname)
        elif member.islnk():
            target.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
            source = root / safe_name(member.linkname)
            if not source.is_file() or source.is_symlink():
                raise ValueError('Invalid native hardlink')
            os.link(source, target)
    for member in members:
        target = root / safe_name(member.name)
        if member.issym() and not target.resolve().is_relative_to(root.resolve()):
            raise ValueError('Native symlink chain escapes extraction root')
print('Validated native archive paths, types, links and extraction size.')
`;

async function nativeVersion() {
  const result = await run(pg('postgres'), ['--version']);
  if (result.stdout !== `postgres (PostgreSQL) ${version}`) throw new Error(`Unexpected native version: ${result.stdout}`);
  return result.stdout;
}

async function install() {
  if (await exists(nativeRoot)) {
    console.log(`Already installed: ${await nativeVersion()}`);
    return;
  }
  await fs.mkdir(runtimeRoot, { recursive: true, mode: 0o700 });
  await fs.chmod(runtimeRoot, 0o700);
  const marker = { projectKey: expectedProject, purpose: 'synthetic-local-only', version, port, database, username, archiveUrl, archiveSha256: sha256 };
  await fs.writeFile(markerPath, `${JSON.stringify(marker, null, 2)}\n`, { mode: 0o600 });
  const staging = await fs.mkdtemp(path.join(runtimeRoot, 'install-'));
  try {
    const published = (await download(`${archiveUrl}.sha256`)).toString().trim();
    if (published !== sha256) throw new Error('Published archive checksum differs from the reviewed pin.');
    const bytes = await download(archiveUrl);
    if (createHash('sha256').update(bytes).digest('hex') !== sha256) throw new Error('Native archive checksum mismatch.');
    const jar = path.join(staging, 'postgres.jar');
    const extracted = path.join(staging, 'native');
    await fs.writeFile(jar, bytes, { mode: 0o600 });
    const extraction = await run('python3', ['-c', extractArchive, jar, extracted], { timeoutMs: 60_000 });
    console.log(extraction.stdout);
    await fs.rename(extracted, nativeRoot);
    const actualVersion = await nativeVersion();
    marker.installedAt = new Date().toISOString();
    marker.nativeVersion = actualVersion;
    await fs.writeFile(markerPath, `${JSON.stringify(marker, null, 2)}\n`, { mode: 0o600 });
    console.log(`Installed ${actualVersion}; verified SHA-256 ${sha256}.`);
  } finally {
    await fs.rm(staging, { recursive: true, force: true });
  }
}

async function clusterStatus() {
  if (!(await exists(dataRoot))) return { code: 3, stdout: 'Cluster not initialized.' };
  const pidPath = path.join(dataRoot, 'postmaster.pid');
  if (await exists(pidPath)) {
    await rejectSymlink(pidPath);
    const [rawPid, recordedDirectory] = (await fs.readFile(pidPath, 'utf8')).split('\n');
    const pid = Number(rawPid);
    if (!Number.isSafeInteger(pid) || pid <= 0 || recordedDirectory !== dataRoot) {
      throw new Error('PostgreSQL PID file does not identify this project-owned cluster.');
    }
    try { process.kill(pid, 0); } catch (error) {
      if (error.code === 'EPERM') throw new Error('Cannot inspect the local PostgreSQL process (EPERM). Run status with the same process permissions used to start it; its state is unknown.');
      if (error.code !== 'ESRCH') throw error;
    }
  }
  return run(pg('pg_ctl'), ['status', '-D', dataRoot], { allowedCodes: [0, 3] });
}

async function requireFreePort() {
  await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', (error) => reject(new Error(error.code === 'EADDRINUSE'
      ? `Loopback port ${port} is occupied; refusing to connect to or replace another service.`
      : `Cannot bind the local test port (${error.code}); no database was started.`)));
    server.listen({ host: '127.0.0.1', port, exclusive: true }, () => server.close(resolve));
  });
}

async function prepareCluster() {
  if (!(await exists(nativeRoot))) throw new Error('Run install first.');
  await nativeVersion();
  if ((await clusterStatus()).code === 0) {
    return false;
  }
  await requireFreePort();
  await fs.mkdir(socketRoot, { mode: 0o700, recursive: true });
  await fs.chmod(socketRoot, 0o700);
  if (!(await exists(dataRoot))) {
    await run(pg('initdb'), ['-D', dataRoot, `--username=${username}`, '--auth-local=trust', '--auth-host=trust', '--encoding=UTF8', '--no-locale', '--no-instructions']);
    await fs.chmod(dataRoot, 0o700);
    await run(pg('postgres'), ['--single', '-D', dataRoot, 'template1'], { input: `CREATE DATABASE ${database};\n` });
  }
  await fs.writeFile(path.join(dataRoot, 'pg_hba.conf'), [
    '# Synthetic local tests only. Never copy into a hosted environment.',
    `local all ${username} trust`,
    `host all ${username} 127.0.0.1/32 trust`,
    'host all all 0.0.0.0/0 reject',
    'host all all ::/0 reject',
    '',
  ].join('\n'), { mode: 0o600 });
  return true;
}

async function start() {
  if (!(await prepareCluster())) {
    console.log('Project-owned native PostgreSQL is already running.');
    return;
  }
  const postgresOptions = `-h 127.0.0.1 -p ${port} -k '${socketRoot.replaceAll("'", "'\\''")}' -c unix_socket_permissions=0700 -c log_statement=none`;
  await run(pg('pg_ctl'), ['start', '-D', dataRoot, '-l', path.join(runtimeRoot, 'postgres.log'), '-o', postgresOptions, '-w', '-t', '20']);
  await status();
}

async function serve() {
  if (!(await prepareCluster())) throw new Error('Cluster already running. Stop it before starting a supervised foreground server.');
  const log = await fs.open(path.join(runtimeRoot, 'postgres.log'), 'a', 0o600);
  try {
    await new Promise((resolve, reject) => {
      const child = spawn(pg('postgres'), ['-D', dataRoot, '-h', '127.0.0.1', '-p', String(port), '-k', socketRoot, '-c', 'unix_socket_permissions=0700', '-c', 'log_statement=none'], {
        cwd: runtimeRoot,
        env: { ...process.env, LC_ALL: 'C', LANG: 'C' },
        stdio: ['ignore', log.fd, 'pipe'],
      });
      let buffer = '';
      let ready = false;
      let writes = Promise.resolve();
      const terminate = () => child.kill('SIGINT');
      process.on('SIGINT', terminate);
      process.on('SIGTERM', terminate);
      const timer = setTimeout(() => { terminate(); }, 20_000);
      const cleanup = () => {
        clearTimeout(timer);
        process.off('SIGINT', terminate);
        process.off('SIGTERM', terminate);
      };
      child.stderr.on('data', (chunk) => {
        writes = writes.then(() => log.write(chunk));
        buffer = (buffer + chunk.toString()).slice(-8192);
        if (!ready && buffer.includes('database system is ready to accept connections')) {
          ready = true;
          clearTimeout(timer);
          console.log(JSON.stringify({ state: 'running', mode: 'foreground', nativeVersion: `PostgreSQL ${version}`, host: '127.0.0.1', port, database, username, syntheticLocalOnly: true }));
        }
      });
      child.on('error', (error) => { cleanup(); reject(error); });
      child.on('close', (code, signal) => {
        cleanup();
        writes.then(() => {
          if (!ready || code !== 0) reject(new Error(`Foreground PostgreSQL stopped before successful completion (${code ?? signal}); inspect the project-local log.`));
          else { console.log('Stopped supervised project-owned PostgreSQL.'); resolve(); }
        }, reject);
      });
    });
  } finally {
    await log.close();
  }
}

async function stop() {
  if (!(await exists(nativeRoot)) || !(await exists(dataRoot))) {
    console.log('Project-owned native PostgreSQL is stopped.');
    return;
  }
  if ((await clusterStatus()).code !== 0) {
    console.log('Project-owned native PostgreSQL is stopped.');
    return;
  }
  await run(pg('pg_ctl'), ['stop', '-D', dataRoot, '-m', 'fast', '-w', '-t', '20']);
  console.log('Stopped project-owned native PostgreSQL.');
}

async function status() {
  if (!(await exists(nativeRoot))) {
    console.log('Native PostgreSQL is not installed.');
    return;
  }
  const state = await clusterStatus();
  console.log(JSON.stringify({ nativeVersion: await nativeVersion(), state: state.code === 0 ? 'running' : 'stopped', host: '127.0.0.1', port, database, username, dataDirectory: dataRoot, syntheticLocalOnly: true }, null, 2));
}

try {
  if (process.argv.length !== 3 || !['install', 'start', 'serve', 'stop', 'status'].includes(process.argv[2])) {
    throw new Error('Usage: node tools/postgres-runtime.mjs install|start|serve|stop|status');
  }
  await guard();
  await ({ install, start, serve, stop, status })[process.argv[2]]();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

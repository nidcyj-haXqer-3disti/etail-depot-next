#!/usr/bin/env node
/** Compile and inspect the approved public search release locally; never publish or contact a provider. */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targets = JSON.parse(readFileSync(path.join(root, "project-targets.json"), "utf8"));
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
assert.equal(process.version, `v${manifest.engines.node}`, "Use the pinned project Node.js runtime.");
assert.equal(targets.project_key, "ETAIL_DEPOT_NEXT_GREENFIELD_2026");
assert.equal(targets.netlify.site_id, "cbbb6c24-9dbc-43a2-9234-e4357b5b5280");
assert.equal(targets.netlify.canonical_origin, "https://etaildepot.com");
assert.equal(targets.release.real_money_allowed, false);

const canonicalOrigin = targets.netlify.canonical_origin;
const guidePaths = ["/guides/stripe-alternatives", "/guides/payment-processing-systems", "/guides/what-is-a-chargeback"];
const publicPaths = ["/", "/credit-card-services", "/payment-acceptance-service", "/help", ...guidePaths];
const port = 3101;
const localOrigin = `http://127.0.0.1:${port}`;
const buildScript = path.join(root, "tools/build-public-site.mjs");
const previewScript = path.join(root, "tools/preview-public-site.mjs");
const buildEnv = {
  ...process.env,
  NODE_ENV: "production", APP_ENV: "production", CONTEXT: "production",
  ETAIL_SEARCH_CONTEXT: "production", SITE_ID: targets.netlify.site_id,
  ETAIL_PUBLIC_ORIGIN: canonicalOrigin, NEXT_TELEMETRY_DISABLED: "1",
};
// The local harness models trusted Edge deployment context independently of build variables.
const runtimeEnv = { ...buildEnv, ETAIL_PREVIEW_DEPLOY_CONTEXT: "production" };
delete runtimeEnv.CONTEXT;
const children = new Set();
let interrupted = false;

function startNext(args, env) {
  const child = spawn(process.execPath, args, { cwd: root, env, stdio: "inherit", detached: process.platform !== "win32" });
  const job = { child, finished: false, result: null, done: null };
  job.done = new Promise(resolve => {
    const finish = result => { job.finished = true; job.result = result; children.delete(job); resolve(result); };
    child.once("error", error => finish({ error }));
    child.once("close", (code, signal) => finish({ code, signal }));
  });
  children.add(job);
  return job;
}
function signalJob(job, signal) {
  if (job.finished || !job.child.pid) return;
  try {
    if (process.platform === "win32") job.child.kill(signal);
    else process.kill(-job.child.pid, signal);
  } catch (error) { if (error.code !== "ESRCH") throw error; }
}
async function stopJob(job) {
  signalJob(job, "SIGTERM");
  const timeout = setTimeout(() => signalJob(job, "SIGKILL"), 5000);
  try { await job.done; } finally { clearTimeout(timeout); }
}
function interrupt() {
  interrupted = true;
  for (const job of children) signalJob(job, "SIGTERM");
}
process.once("SIGINT", interrupt);
process.once("SIGTERM", interrupt);

async function requireFreePort() {
  const probe = createServer();
  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(port, "127.0.0.1", () => probe.close(error => error ? reject(error) : resolve()));
  });
}
async function localFetch(route, { method = "GET" } = {}) {
  assert.ok(route.startsWith("/") && !route.startsWith("//"), "Only local paths may be requested.");
  assert.ok(["GET", "HEAD"].includes(method), "SEO verification only reads local responses.");
  return fetch(`${localOrigin}${route}`, { method, redirect: "manual", signal: AbortSignal.timeout(15000) });
}
async function waitForServer(job) {
  for (let attempt = 0; attempt < 180; attempt++) {
    assert.equal(interrupted, false, "Production SEO verification was interrupted.");
    assert.equal(job.finished, false, `Fresh SEO server exited before readiness: ${JSON.stringify(job.result)}`);
    try {
      const response = await fetch(`${localOrigin}/`, { redirect: "manual", signal: AbortSignal.timeout(1000) });
      await response.arrayBuffer();
      if (response.status === 200) return;
    } catch { /* A fresh server may still be binding its local port. */ }
    await delay(250);
  }
  throw new Error("Fresh production SEO server did not become ready.");
}
function decode(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, entity) => {
    if (entity[0] === "#") return String.fromCodePoint(entity[1].toLowerCase() === "x" ? Number.parseInt(entity.slice(2), 16) : Number.parseInt(entity.slice(1), 10));
    return { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" }[entity.toLowerCase()];
  });
}
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([^\s=<>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(match => [match[1].toLowerCase(), decode(match[2] ?? match[3])]));
}
function documentMetadata(html, route) {
  const head = html.match(/<head(?:\s[^>]*)?>([\s\S]*?)<\/head>/i)?.[1];
  assert.ok(head, `${route}: HTML head is missing.`);
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0]));
  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0]));
  const titles = [...head.matchAll(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/gi)].map(match => decode(match[1]).trim());
  const metaValues = (key, value) => metas.filter(meta => meta[key]?.toLowerCase() === value).map(meta => meta.content ?? "");
  return { metas, links, titles, metaValues };
}
function forbidsIndexing(value) { return /(?:^|[\s,:])(?:noindex|none)(?:$|[\s,])/i.test(value); }
function assertIndexable(response, metadata, route) {
  assert.equal(forbidsIndexing(response.headers.get("x-robots-tag") ?? ""), false, `${route}: HTTP header blocks indexing.`);
  for (const name of ["robots", "googlebot"]) {
    const values = metadata.metaValues("name", name);
    assert.equal(values.length, 1, `${route}: expected exactly one ${name} meta tag.`);
    const directives = values[0].toLowerCase().split(/\s*,\s*/);
    assert.ok(directives.includes("index") && directives.includes("follow"), `${route}: ${name} must allow index and follow.`);
    assert.equal(forbidsIndexing(values[0]), false, `${route}: ${name} blocks indexing.`);
  }
}
function schemaNodes(html) {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(match => attributes(match[1]).type === "application/ld+json")
    .flatMap(match => {
      const data = JSON.parse(match[2]);
      return Array.isArray(data) ? data : data["@graph"] ?? [data];
    });
}
function checkSchema(html, route, description) {
  const nodes = schemaNodes(html);
  const node = type => {
    const matches = nodes.filter(entry => entry["@type"] === type || (Array.isArray(entry["@type"]) && entry["@type"].includes(type)));
    assert.equal(matches.length, 1, `${route}: expected one ${type} schema node.`);
    return matches[0];
  };
  const organization = node("Organization"), website = node("WebSite"), page = node("WebPage");
  assert.equal(organization.name, "Etail Depot");
  assert.equal(organization.legalName, "Etail Depot US, Inc.");
  assert.equal(organization.url, `${canonicalOrigin}/`);
  assert.equal(new URL(organization.logo).origin, canonicalOrigin);
  assert.equal(website.name, "Etail Depot");
  assert.equal(website.url, `${canonicalOrigin}/`);
  assert.equal(website.publisher?.["@id"], organization["@id"]);
  assert.equal(page.url, new URL(route, canonicalOrigin).href);
  assert.equal(page.description, description);
  assert.equal(page.isPartOf?.["@id"], website["@id"]);
  if (route !== "/") {
    const crumbs = node("BreadcrumbList").itemListElement;
    assert.equal(crumbs.length, guidePaths.includes(route) ? 3 : 2, `${route}: breadcrumb must reflect its actual page hierarchy.`);
    for (const [index, crumb] of crumbs.entries()) {
      assert.equal(crumb["@type"], "ListItem");
      assert.equal(crumb.position, index + 1);
      assert.ok(typeof crumb.name === "string" && crumb.name.trim());
      const item = typeof crumb.item === "string" ? crumb.item : crumb.item?.["@id"];
      const expectedPath = index === 0 ? "/" : guidePaths.includes(route) && index === 1 ? "/payment-acceptance-service" : route;
      assert.equal(item, new URL(expectedPath, canonicalOrigin).href);
    }
  }
  assert.equal(nodes.some(entry => ["Offer", "AggregateRating", "Review", "ApplyAction"].includes(entry["@type"])), false, `${route}: unapproved offer or endorsement markup.`);
}

async function verifyResponses() {
  const titles = new Set(), descriptions = new Set();
  for (const route of publicPaths) {
    const response = await localFetch(route);
    assert.equal(response.status, 200, `${route}: public page must return 200 without a redirect.`);
    assert.equal(response.headers.has("set-cookie"), false, `${route}: public pages must not create sessions.`);
    const html = await response.text(), metadata = documentMetadata(html, route);
    assertIndexable(response, metadata, route);
    assert.equal(metadata.titles.length, 1, `${route}: expected one title.`);
    assert.ok(metadata.titles[0].trim(), `${route}: empty title.`);
    assert.equal(metadata.titles[0].match(/Etail Depot/g)?.length, 1, `${route}: title must identify Etail Depot exactly once, including Home.`);
    assert.deepEqual(metadata.metaValues("property", "og:title"), metadata.titles, `${route}: social and document titles must agree.`);
    assert.deepEqual(metadata.metaValues("name", "twitter:title"), metadata.titles, `${route}: social and document titles must agree.`);
    const description = metadata.metaValues("name", "description");
    assert.equal(description.length, 1, `${route}: expected one description.`);
    assert.ok(description[0].trim(), `${route}: empty description.`);
    titles.add(metadata.titles[0]); descriptions.add(description[0]);
    const canonicals = metadata.links.filter(link => link.rel === "canonical");
    assert.equal(canonicals.length, 1, `${route}: expected one canonical.`);
    assert.equal(new URL(canonicals[0].href).href, new URL(route, canonicalOrigin).href);
    assert.deepEqual(metadata.metaValues("property", "og:image"), [`${canonicalOrigin}/opengraph-image`]);
    assert.deepEqual(metadata.metaValues("name", "twitter:image"), [`${canonicalOrigin}/opengraph-image`]);
    checkSchema(html, route, description[0]);
  }
  assert.equal(titles.size, publicPaths.length, "Public titles must be distinct.");
  assert.equal(descriptions.size, publicPaths.length, "Public descriptions must be distinct.");

  for (const [oldPath, destination] of [["/card-services", "/credit-card-services"], ["/payment-services", "/payment-acceptance-service"]]) {
    for (const suffix of ["", "/", ".html", "/index.html"]) {
      for (const method of ["GET", "HEAD"]) {
        const response = await localFetch(`${oldPath}${suffix}?token=synthetic-test`, { method });
        assert.equal(response.status, 308, "Former product URLs must redirect permanently.");
        assert.equal(response.headers.get("location"), `${localOrigin}${destination}`);
        assert.equal(response.headers.get("cache-control"), "no-store");
        assert.equal(response.headers.has("x-robots-tag"), false, "Production migration redirects must remain crawlable.");
        assert.equal(await response.text(), "");
      }
    }
    const payload = await localFetch(`${oldPath}.txt`);
    assert.equal(payload.status, 404, "An old navigation payload must never redirect to HTML.");
    assert.ok(forbidsIndexing(payload.headers.get("x-robots-tag") ?? ""));
    await payload.arrayBuffer();
  }

  const sitemapResponse = await localFetch("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
  assert.deepEqual(locations.sort(), publicPaths.map(route => new URL(route, canonicalOrigin).href).sort(), "Sitemap must contain only the seven reviewed canonical pages.");
  const robotsResponse = await localFetch("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /^User-Agent:\s*\*\s*$/im);
  assert.match(robots, /^Allow:\s*\/\s*$/im);
  assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/im);
  assert.deepEqual([...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)].map(match => match[1]), [`${canonicalOrigin}/sitemap.xml`]);

  const image = await localFetch("/opengraph-image");
  assert.equal(image.status, 200);
  assert.match(image.headers.get("content-type") ?? "", /^image\/png(?:;|$)/i);
  assert.equal(forbidsIndexing(image.headers.get("x-robots-tag") ?? ""), false, "Approved social image must not carry noindex.");
  const bytes = Buffer.from(await image.arrayBuffer());
  assert.deepEqual(bytes.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  assert.equal(bytes.readUInt32BE(16), 1200); assert.equal(bytes.readUInt32BE(20), 630);

  for (const route of ["/privacy", "/terms", "/production-seo-missing-page", "/guides/unreviewed-missing-page"]) {
    const response = await localFetch(route);
    assert.equal(response.status, route.includes("missing-page") ? 404 : 200, `${route}: unexpected status.`);
    const metadata = documentMetadata(await response.text(), route);
    const values = [...metadata.metaValues("name", "robots"), ...metadata.metaValues("name", "googlebot"), response.headers.get("x-robots-tag") ?? ""];
    assert.ok(values.some(forbidsIndexing), `${route}: must remain noindex.`);
  }
  for (const route of ["/privacy.html", "/terms.html", "/privacy.txt", "/terms.txt", "/payment-acceptance-service.txt", ...guidePaths.map(route => `${route}.txt`)]) {
    const response = await localFetch(route);
    assert.equal(response.status, 200);
    assert.ok(forbidsIndexing(response.headers.get("x-robots-tag") ?? ""), `${route}: raw payloads and legal aliases must remain noindex.`);
    await response.arrayBuffer();
  }
  const redirectFamilies = ["cardholder-services", "cards", "merchant-services", "merchants", "login", "profile", "security", "shared-access", "invitations", "operations", "money-accounts", "accounts", "services"];
  for (const family of [...redirectFamilies, "api", "checkout", "pay", "payments"]) {
    const response = await localFetch(`/${family}/seo-test?token=synthetic-test`);
    assert.equal(response.status, redirectFamilies.includes(family) ? 307 : 410, `/${family}: retirement response changed.`);
    assert.ok(forbidsIndexing(response.headers.get("x-robots-tag") ?? ""), `/${family}: retired response must remain noindex.`);
    assert.equal(response.headers.has("set-cookie"), false);
    if (response.status === 307) {
      assert.ok(response.headers.get("location"), `/${family}: missing redirect destination.`);
      const destination = new URL(response.headers.get("location"), localOrigin);
      assert.equal(destination.origin, localOrigin); assert.equal(destination.search, "");
    }
    await response.arrayBuffer();
  }
  console.log("Production SEO passed: seven indexable public pages, canonical/schema/social metadata, exact sitemap, and noindex legal, 404 and 17 retired route families. Runtime CONTEXT was absent.");
}

try {
  await requireFreePort();
  console.log("Building the exact approved site in production mode for rendered SEO verification.");
  const build = startNext([buildScript], buildEnv);
  const result = await build.done;
  assert.equal(interrupted, false, "Production SEO verification was interrupted.");
  if (result.error) throw result.error;
  assert.equal(result.code, 0, `Production SEO build failed (${result.signal ?? result.code}).`);
  const server = startNext([previewScript, "--port", String(port)], runtimeEnv);
  await waitForServer(server);
  await verifyResponses();
  await stopJob(server);
  // Even production HTML must not become indexable on a preview or an unapproved site.
  for (const environment of [
    { ...runtimeEnv, ETAIL_PREVIEW_DEPLOY_CONTEXT: "deploy-preview" },
    { ...runtimeEnv, SITE_ID: "unapproved-local-test-site" },
  ]) {
    const privateServer = startNext([previewScript, "--port", String(port)], environment);
    await waitForServer(privateServer);
    for (const route of [...publicPaths, "/card-services", "/payment-services", "/privacy", "/terms", "/robots.txt", "/sitemap.xml", "/opengraph-image", "/production-seo-missing-page"]) {
      const response = await localFetch(route);
      assert.ok(forbidsIndexing(response.headers.get("x-robots-tag") ?? ""), `${route}: preview/wrong-site response must remain noindex.`);
      if (route === "/sitemap.xml") assert.doesNotMatch(await response.text(), /<loc>/);
      else if (route === "/robots.txt") assert.doesNotMatch(await response.text(), /^Sitemap:/im);
      else await response.arrayBuffer();
    }
    await stopJob(privateServer);
  }
  console.log("Host-context protection passed: production HTML remains noindex on preview and unapproved-site contexts, with no public sitemap entries.");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await Promise.all([...children].map(stopJob));
  process.removeListener("SIGINT", interrupt);
  process.removeListener("SIGTERM", interrupt);
}

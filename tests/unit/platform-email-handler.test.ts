import { spawnSync } from "node:child_process";
import { EventEmitter } from "node:events";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";
import { preparePlatformEmail, verifyPlatformEmail, verifyPlatformEmailConfiguration } from "../../tools/netlify-email-compat";

type EmailHandler = (request: Request) => Promise<Response>;
type EmailFactory = (loadHandler: () => Promise<EmailHandler>, readSecret: () => string | undefined) => EmailHandler;
const { createEmailHandler } = await import(new URL("../../netlify/email-compat/handler.mjs", import.meta.url).href) as { createEmailHandler: EmailFactory };
const secret = "fixture-secret";
const url = "https://example.invalid/.netlify/functions/emails/confirmation";

function protectedHeaders(response: Response): void {
  expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  expect(response.headers.get("x-frame-options")).toBe("DENY");
  expect(response.headers.get("referrer-policy")).toBe("no-referrer");
}

function post(supplied?: string): Request {
  return new Request(url, {
    method: "POST", body: JSON.stringify({ from: "sender@example.invalid", to: "recipient@example.invalid" }),
    headers: supplied === undefined ? {} : { "netlify-emails-secret": supplied },
  });
}

describe("platform email request guard", () => {
  it.each(["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "DELETE"])("rejects %s before reading secrets, bodies or loading the provider", async method => {
    const provider = vi.fn(async () => new Response("Must not run"));
    const loadHandler = vi.fn(async () => provider);
    const readSecret = vi.fn(() => secret);
    const request = new Request(url, { method, headers: { "netlify-emails-secret": secret } });
    const readBody = vi.spyOn(request, "text");
    const response = await createEmailHandler(loadHandler, readSecret)(request);
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST");
    protectedHeaders(response);
    expect(await response.text()).toBe(method === "HEAD" ? "" : JSON.stringify({ message: "Method not allowed." }));
    expect(readSecret).not.toHaveBeenCalled();
    expect(loadHandler).not.toHaveBeenCalled();
    expect(provider).not.toHaveBeenCalled();
    expect(readBody).not.toHaveBeenCalled();
    expect(request.bodyUsed).toBe(false);
  });

  it.each([undefined, ""])("fails closed when the configured secret is %s", async configured => {
    const loadHandler = vi.fn(async () => vi.fn(async () => new Response("Must not run")));
    const request = post(secret);
    const readBody = vi.spyOn(request, "text");
    const response = await createEmailHandler(loadHandler, () => configured)(request);
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ message: "Email service unavailable." });
    protectedHeaders(response);
    expect(loadHandler).not.toHaveBeenCalled();
    expect(readBody).not.toHaveBeenCalled();
    expect(request.bodyUsed).toBe(false);
  });

  it.each([undefined, "", "wrong", "fixture-secreu", "fixture-secret-extra"])("rejects an absent or incorrect credential (%s) before provider loading or body access", async supplied => {
    const loadHandler = vi.fn(async () => vi.fn(async () => new Response("Must not run")));
    const request = post(supplied);
    const readBody = vi.spyOn(request, "text");
    const response = await createEmailHandler(loadHandler, () => secret)(request);
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ message: "Not authorized." });
    protectedHeaders(response);
    expect(loadHandler).not.toHaveBeenCalled();
    expect(readBody).not.toHaveBeenCalled();
    expect(request.bodyUsed).toBe(false);
  });

  it.each([["é-x", "é-x", 202], ["é-x", "ë-x", 403], ["éé", "aa", 403]] as const)("compares UTF-8 bytes safely for %s and %s", async (configured, supplied, status) => {
    const provider = vi.fn(async () => new Response("Accepted", { status: 202 }));
    const loadHandler = vi.fn(async () => provider);
    const response = await createEmailHandler(loadHandler, () => configured)(post(supplied));
    expect(response.status).toBe(status);
    expect(loadHandler).toHaveBeenCalledTimes(status === 202 ? 1 : 0);
    protectedHeaders(response);
  });

  it("delegates the original authenticated request once, preserving the result and overriding unsafe response headers", async () => {
    const request = post(secret);
    const readBody = vi.spyOn(request, "text");
    const provider = vi.fn(async (received: Request) => {
      expect(received).toBe(request);
      expect(received.bodyUsed).toBe(false);
      await received.text();
      return new Response('{"message":"accepted"}', {
        status: 202,
        headers: { "Content-Type": "text/html", "Cache-Control": "public, max-age=3600", "X-Robots-Tag": "index, follow", "X-Frame-Options": "SAMEORIGIN", "X-Content-Type-Options": "unsafe", "Referrer-Policy": "unsafe-url", "X-Result": "preserved" },
      });
    });
    const loadHandler = vi.fn(async () => provider);
    const response = await createEmailHandler(loadHandler, () => secret)(request);
    expect(loadHandler).toHaveBeenCalledTimes(1);
    expect(provider).toHaveBeenCalledExactlyOnceWith(request);
    expect(readBody).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(202);
    expect(await response.text()).toBe('{"message":"accepted"}');
    expect(response.headers.get("x-result")).toBe("preserved");
    protectedHeaders(response);
  });

  it.each(["load", "request"])("redacts a provider %s failure", async phase => {
    const details = "fixture-private-credential provider configuration request-body";
    const provider = vi.fn(async () => { throw new Error(details); });
    const loadHandler = vi.fn(async () => {
      if (phase === "load") throw new Error(details);
      return provider;
    });
    const response = await createEmailHandler(loadHandler, () => secret)(post(secret));
    expect(response.status).toBe(500);
    expect(await response.text()).toBe(JSON.stringify({ message: "Email request could not be completed." }));
    protectedHeaders(response);
  });
});

/** Run the installed, unmodified handler only with synthetic configuration and in-memory I/O. */
function officialHandlerFixture(templatesExist: boolean) {
  const require = createRequire(import.meta.url);
  const source = readFileSync(require.resolve("@netlify/plugin-emails/lib/src/handler/index.js"), "utf8");
  const filesystem = {
    existsSync: vi.fn(() => templatesExist),
    readdirSync: vi.fn(() => ["index.html"]),
    readFileSync: vi.fn(() => "<html><body>Fixture template</body></html>"),
  };
  const outbound: Array<{ hostname: string; path: string; body: string }> = [];
  const https = {
    request: vi.fn((options: { hostname: string; path: string }, callback: (response: EventEmitter & { statusCode: number }) => void) => {
      const entry = { ...options, body: "" };
      outbound.push(entry);
      const stream = Object.assign(new EventEmitter(), {
        write: (chunk: string) => { entry.body += chunk; },
        end: () => queueMicrotask(() => {
          const response = Object.assign(new EventEmitter(), { statusCode: 200 });
          callback(response);
          response.emit("data", JSON.stringify(options.path.endsWith("/render") ? { html: "<p>Fixture rendered email</p>" } : { message: "Synthetic send result" }));
          response.emit("end");
        }),
      });
      return stream;
    }),
  };
  const loadHandler = vi.fn(async () => {
    const exports: { default?: EmailHandler } = {};
    runInNewContext(source, {
      exports, Response,
      process: { env: { NETLIFY_EMAILS_SECRET: secret, NETLIFY_EMAILS_PROVIDER: "postmark", NETLIFY_EMAILS_PROVIDER_API_KEY: "fixture-api-key", NETLIFY_EMAILS_DIRECTORY: "./emails", SITE_ID: "fixture-site", CONTEXT: "production" } },
      console: { log: vi.fn(), error: vi.fn() },
      require: (name: string) => {
        if (name === "fs") return filesystem;
        if (name === "path") return { join };
        if (name === "https") return https;
        throw new Error(`Unexpected handler import: ${name}`);
      },
    });
    if (!exports.default) throw new Error("The reviewed plugin must export its handler.");
    return exports.default;
  });
  return { filesystem, https, outbound, loadHandler, handle: createEmailHandler(loadHandler, () => secret) };
}

describe("unmodified platform Emails handler behind the guard", () => {
  it("cannot load the official handler or access a template or network before authentication", async () => {
    const fixture = officialHandlerFixture(true);
    const request = post("wrong");
    const readBody = vi.spyOn(request, "text");
    const response = await fixture.handle(request);
    expect(response.status).toBe(403);
    expect(fixture.loadHandler).not.toHaveBeenCalled();
    expect(readBody).not.toHaveBeenCalled();
    for (const method of Object.values(fixture.filesystem)) expect(method).not.toHaveBeenCalled();
    expect(fixture.https.request).not.toHaveBeenCalled();
    protectedHeaders(response);
  });

  it("preserves an authenticated missing-template response without attempting delivery", async () => {
    const fixture = officialHandlerFixture(false);
    const request = post(secret);
    const readBody = vi.spyOn(request, "text");
    const response = await fixture.handle(request);
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ message: "Email templates directory ./emails does not exist" });
    expect(fixture.loadHandler).toHaveBeenCalledTimes(1);
    expect(readBody).not.toHaveBeenCalled();
    expect(fixture.filesystem.existsSync).toHaveBeenCalledWith("./emails");
    expect(fixture.https.request).not.toHaveBeenCalled();
    protectedHeaders(response);
  });

  it("preserves authenticated template rendering and sending through in-memory HTTPS stubs only", async () => {
    const fixture = officialHandlerFixture(true);
    const request = post(secret);
    const readBody = vi.spyOn(request, "text");
    const response = await fixture.handle(request);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Synthetic send result" });
    expect(fixture.loadHandler).toHaveBeenCalledTimes(1);
    expect(readBody).toHaveBeenCalledTimes(1);
    expect(fixture.outbound.map(entry => [entry.hostname, entry.path])).toEqual([
      ["netlify-integration-emails.netlify.app", "/.netlify/functions/render"],
      ["netlify-integration-emails.netlify.app", "/.netlify/functions/send"],
    ]);
    expect(JSON.parse(fixture.outbound[1].body)).toMatchObject({ configuration: { providerName: "postmark", apiKey: "fixture-api-key" }, request: { from: "sender@example.invalid", to: "recipient@example.invalid", html: "<p>Fixture rendered email</p>" } });
    protectedHeaders(response);
  });
});

function withGeneratedFixture(check: (root: string) => void): void {
  const root = mkdtempSync(join(tmpdir(), "etail-email-entry-"));
  const require = createRequire(import.meta.url);
  const installed = dirname(require.resolve("@netlify/plugin-emails/package.json"));
  try {
    const pluginRoot = join(root, "node_modules/@netlify/plugin-emails");
    for (const file of ["package.json", "lib/src/index.js", "lib/src/handler/index.js"]) {
      mkdirSync(dirname(join(pluginRoot, file)), { recursive: true });
      cpSync(join(installed, file), join(pluginRoot, file));
    }
    writeFileSync(join(root, "package.json"), JSON.stringify({ private: true, type: "module", devDependencies: { "@netlify/plugin-emails": "2.0.1" } }));
    mkdirSync(join(root, "netlify/email-compat"), { recursive: true });
    cpSync(fileURLToPath(new URL("../../netlify/email-compat/handler.mjs", import.meta.url)), join(root, "netlify/email-compat/handler.mjs"));
    check(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe("generated platform email entry", () => {
  it("wraps the original generated handler once and loads its default CJS export in the real Node runtime", () => {
    withGeneratedFixture(root => {
      const directory = join(root, ".netlify/functions-internal/emails");
      mkdirSync(directory, { recursive: true });
      cpSync(join(root, "node_modules/@netlify/plugin-emails/lib/src/handler/index.js"), join(directory, "index.js"));
      const first = preparePlatformEmail(root, { requireGenerated: true });
      expect(first.present).toBe(true);
      expect(existsSync(join(directory, "index.js"))).toBe(false);
      const wrapper = readFileSync(join(directory, "index.mjs"));
      const vendor = readFileSync(join(directory, "vendor.cjs"));
      expect(preparePlatformEmail(root, { requireGenerated: true })).toEqual(first);
      expect(readFileSync(join(directory, "index.mjs"))).toEqual(wrapper);
      expect(readFileSync(join(directory, "vendor.cjs"))).toEqual(vendor);
      expect(readdirSync(directory).sort()).toEqual(["index.mjs", "vendor.cjs"]);
      const child = spawnSync(process.execPath, ["--input-type=module", "--eval", `
        import assert from 'node:assert/strict';
        import https from 'node:https';
        import {createRequire} from 'node:module';
        import {resolve} from 'node:path';
        import {pathToFileURL} from 'node:url';
        let networkCalls = 0;
        const forbiddenNetwork = () => { networkCalls++; throw new Error('Network is forbidden in this fixture.'); };
        https.request = forbiddenNetwork;
        globalThis.fetch = forbiddenNetwork;
        const entry = resolve('.netlify/functions-internal/emails/index.mjs');
        const vendor = resolve('.netlify/functions-internal/emails/vendor.cjs');
        const require = createRequire(pathToFileURL(entry));
        const loaded = await import(pathToFileURL(entry).href);
        assert.equal(typeof loaded.default, 'function');
        const get = await loaded.default(new Request('https://example.invalid/.netlify/functions/emails/confirmation'));
        assert.equal(get.status, 405);
        const unauthorized = new Request('https://example.invalid/.netlify/functions/emails/confirmation', {method:'POST',headers:{'netlify-emails-secret':'wrong'},body:'unused'});
        assert.equal((await loaded.default(unauthorized)).status, 403);
        assert.equal(unauthorized.bodyUsed, false);
        assert.equal(require.cache[vendor], undefined);
        const authorized = new Request('https://example.invalid/.netlify/functions/emails/confirmation', {method:'POST',headers:{'netlify-emails-secret':'fixture-secret'},body:'unused'});
        const result = await loaded.default(authorized);
        assert.equal(result.status, 404);
        assert.match((await result.json()).message, /Email templates directory .* does not exist/);
        assert.equal(authorized.bodyUsed, false);
        assert.ok(require.cache[vendor]);
        assert.equal(result.headers.get('cache-control'), 'no-store');
        assert.equal(result.headers.get('x-robots-tag'), 'noindex, nofollow');
        assert.equal(networkCalls, 0);
        console.log(JSON.stringify({defaultCallable:true,lazyCjsImport:true,authenticatedUpstreamStatus:404,networkCalls}));
      `], {
        cwd: root, encoding: "utf8", timeout: 10000,
        // No real environment values or credentials are inherited by the subprocess.
        env: { NODE_ENV: "test", NETLIFY_EMAILS_SECRET: secret, NETLIFY_EMAILS_PROVIDER: "postmark", NETLIFY_EMAILS_PROVIDER_API_KEY: "fixture-api-key", NETLIFY_EMAILS_DIRECTORY: join(root, "missing-templates"), CONTEXT: "production" },
      });
      expect(child.error).toBeUndefined();
      expect(child.status, child.stderr || child.stdout).toBe(0);
      expect(JSON.parse(child.stdout.trim().split("\n").at(-1)!)).toEqual({ defaultCallable: true, lazyCjsImport: true, authenticatedUpstreamStatus: 404, networkCalls: 0 });
    });
  });

  it.each(["index.mjs", "vendor.cjs"])("rejects changed generated %s bytes", filename => {
    withGeneratedFixture(root => {
      preparePlatformEmail(root);
      const file = join(root, ".netlify/functions-internal/emails", filename);
      writeFileSync(file, Buffer.concat([readFileSync(file), Buffer.from("\n// Unexpected changed source\n")]));
      expect(() => verifyPlatformEmail(root, { required: true })).toThrow();
      expect(() => preparePlatformEmail(root)).toThrow();
    });
  });

  it.each(["emails/helper.js", "another-function/index.js"])("rejects the unreviewed generated file %s", filename => {
    withGeneratedFixture(root => {
      preparePlatformEmail(root);
      const file = join(root, ".netlify/functions-internal", filename);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, "Unexpected fixture code");
      expect(() => verifyPlatformEmail(root, { required: true })).toThrow();
    });
  });

  it("rejects a symlink instead of following an apparently approved handler", () => {
    withGeneratedFixture(root => {
      preparePlatformEmail(root);
      const vendor = join(root, ".netlify/functions-internal/emails/vendor.cjs");
      rmSync(vendor);
      symlinkSync(join(root, "node_modules/@netlify/plugin-emails/lib/src/handler/index.js"), vendor);
      expect(() => verifyPlatformEmail(root, { required: true })).toThrow(/symbolic links/);
    });
  });

  it("rejects a symlink in a generated-directory ancestor", () => {
    withGeneratedFixture(root => {
      const target = join(root, "platform-generated");
      mkdirSync(target);
      symlinkSync(target, join(root, ".netlify"), "dir");
      expect(() => preparePlatformEmail(root)).toThrow(/symbolic links/);
    });
  });
});

describe("platform email file inclusion", () => {
  it("allows only the existing default template path without introducing templates", () => {
    withGeneratedFixture(root => {
      const config = { functions: { emails: { included_files: ["./emails/**"] } } };
      expect(() => verifyPlatformEmailConfiguration(root, config, { NODE_ENV: "test" })).not.toThrow();
      mkdirSync(join(root, "emails"));
      writeFileSync(join(root, "emails/unreviewed.html"), "Unreviewed template");
      expect(() => verifyPlatformEmailConfiguration(root, config, { NODE_ENV: "test" })).toThrow(/separate reviewed feature/);
    });
  });

  it.each(["**", "../**", "/**", "emails/../**", "./emails/**/../**", ".env"])("rejects the file inclusion pattern %s", pattern => {
    withGeneratedFixture(root => {
      expect(() => verifyPlatformEmailConfiguration(root, { functions: { emails: { included_files: [pattern] } } }, { NODE_ENV: "test" })).toThrow();
    });
  });

  it("rejects inherited wildcard file inclusions that could broaden the Emails bundle", () => {
    withGeneratedFixture(root => {
      const config = { functions: { "*": { included_files: ["**"] }, emails: { included_files: ["./emails/**"] } } };
      expect(() => verifyPlatformEmailConfiguration(root, config, { NODE_ENV: "test" })).toThrow();
    });
  });

  it.each(["..", "/", "./emails/../private"])("rejects an unsafe configured template directory %s", configured => {
    withGeneratedFixture(root => {
      expect(() => verifyPlatformEmailConfiguration(root, { functions: { emails: { included_files: ["./emails/**"] } } }, { NODE_ENV: "test", NETLIFY_EMAILS_DIRECTORY: configured })).toThrow();
    });
  });
});

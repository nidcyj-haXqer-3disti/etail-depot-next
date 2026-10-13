import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { platformEmailBundleDirectory, verifyBundledPlatformEmail, verifyPlatformEmailBundle } from "../../tools/netlify-email-compat.ts";

const root = process.cwd();
const compiled = readFileSync(path.join(root, "tests/fixtures/netlify-emails/index.mjs.txt"), "utf8");

describe("compiled platform Email boundary", () => {
  it("accepts the reviewed complete module with only checkout-path and formatting differences", () => {
    expect(() => verifyBundledPlatformEmail(root, compiled)).not.toThrow();
    const relocated = compiled.replaceAll("artifacts/d201-email-compat/bundle-fixture/.netlify/functions-internal/emails/vendor.cjs", "/opt/build/repo/.netlify/functions-internal/emails/vendor.cjs");
    expect(() => verifyBundledPlatformEmail(root, `// Platform compilation\n${relocated}\n`)).not.toThrow();
  });

  it.each([
    ["an added eager call", `${compiled}\nrequire_vendor();`],
    ["an altered upstream destination", compiled.replaceAll("netlify-integration-emails.netlify.app", "unexpected.example")],
    ["a removed authentication guard", compiled.replace("!timingSafeEqual(expectedBytes, suppliedBytes)", "false")],
    ["an inverted prefix authentication operator", compiled.replace("!timingSafeEqual(expectedBytes, suppliedBytes)", "+timingSafeEqual(expectedBytes, suppliedBytes)")],
    ["a changed negation operator", compiled.replace("if (!secret)", "if (~secret)")],
    ["a changed regular-expression flag", compiled.replace('/emails\\/([A-z-]*)[?]?/', '/emails\\/([A-z-]*)[?]?/i')],
    ["a changed template value", compiled.replace('`Error sending email: ${message}`', '`Error sending email: ${message + "changed"}`')],
    ["a changed security header", compiled.replace('"Cache-Control": "no-store"', '"Cache-Control": "public"')],
    ["a bypassing default export", compiled.replace("index_default as default", "require_vendor as default")],
    ["an additional export", `${compiled}\nexport { require_vendor };`],
  ])("rejects %s", (_reason, contents) => {
    expect(contents).not.toBe(compiled);
    expect(() => verifyBundledPlatformEmail(root, contents)).toThrow(/complete compiled Emails module/);
  });

  it("does not allow an alternate safe directory to hide the real Functions distribution", () => {
    // Directory validation precedes reading any bundle, preserving fail-closed path binding.
    expect(() => verifyPlatformEmailBundle(root, path.join(root, ".netlify/functions-safe"))).toThrow(/actual Functions distribution/);
  });
});

describe("platform Functions distribution binding", () => {
  const temporaryRoots: string[] = [];
  const trusted = {
    NETLIFY: "true", SITE_ID: "cbbb6c24-9dbc-43a2-9234-e4357b5b5280",
    DEPLOY_ID: "6ace765fe4fc10ba78325098", CONTEXT: "deploy-preview",
  };
  const hostedDirectory = `/tmp/zisi-${trusted.DEPLOY_ID}`;
  const fixtureRoot = () => {
    const directory = mkdtempSync(path.join(tmpdir(), "etail-email-distribution-"));
    temporaryRoots.push(directory);
    return directory;
  };
  afterEach(() => { for (const directory of temporaryRoots.splice(0)) rmSync(directory, { recursive: true, force: true }); });

  it("preserves the exact local fixture path without asserting a hosted identity", () => {
    const project = fixtureRoot();
    expect(platformEmailBundleDirectory(project, path.join(project, ".netlify/functions"), {})).toEqual({ directory: path.join(project, ".netlify/functions"), hosted: false });
  });

  it.each(["production", "deploy-preview", "branch-deploy"])("binds the hosted scratch path to the current %s deployment", context => {
    expect(platformEmailBundleDirectory(fixtureRoot(), hostedDirectory, { ...trusted, CONTEXT: context })).toEqual({ directory: hostedDirectory, hosted: true });
  });

  it.each([
    ["missing platform identity", { ...trusted, NETLIFY: undefined }],
    ["false platform identity", { ...trusted, NETLIFY: "false" }],
    ["another site", { ...trusted, SITE_ID: "7e49e5cf-5938-4e90-8c0e-026432311e0b" }],
    ["missing deployment", { ...trusted, DEPLOY_ID: undefined }],
    ["noncanonical deployment", { ...trusted, DEPLOY_ID: "../../other" }],
    ["untrusted context", { ...trusted, CONTEXT: "dev" }],
    ["missing context", { ...trusted, CONTEXT: undefined }],
  ])("rejects %s", (_reason, environment) => {
    expect(() => platformEmailBundleDirectory(fixtureRoot(), hostedDirectory, environment)).toThrow(/trusted build identity/);
  });

  it.each([
    "/tmp/zisi-000000000000000000000001", "/tmp/safe-functions", "/tmp/zisi-6ace765fe4fc10ba78325098/subdirectory",
    "/tmp/zisi-6ace765fe4fc10ba78325098/../zisi-6ace765fe4fc10ba78325098",
  ])("rejects unbound scratch output %s", directory => {
    expect(() => platformEmailBundleDirectory(fixtureRoot(), directory, trusted)).toThrow(/this exact deployment/);
  });

  it.each(["directory", "file"])("rejects a stale local Functions %s when the hosted output is selected", kind => {
    const project = fixtureRoot();
    mkdirSync(path.join(project, ".netlify"));
    const local = path.join(project, ".netlify/functions");
    if (kind === "directory") mkdirSync(local);
    else writeFileSync(local, "unexpected");
    expect(() => platformEmailBundleDirectory(project, hostedDirectory, trusted)).toThrow(/additional local Functions/);
  });

  it("rejects a dangling symlink used to hide local Functions output", () => {
    const project = fixtureRoot();
    mkdirSync(path.join(project, ".netlify"));
    symlinkSync(path.join(project, "absent"), path.join(project, ".netlify/functions"));
    expect(() => platformEmailBundleDirectory(project, hostedDirectory, trusted)).toThrow(/symbolic links/);
  });
});

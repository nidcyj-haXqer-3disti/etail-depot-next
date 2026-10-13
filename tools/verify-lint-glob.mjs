#!/usr/bin/env node
/** Verify the bounded Next lint root resolver without changing rule coverage. */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(root, "package.json"));
const fromConfig = createRequire(require.resolve("eslint-config-next"));
const pluginPath = fromConfig.resolve("@next/eslint-plugin-next");
// An isolated patched copy can be supplied before changing the lockfile.
const resolverPath = process.argv[2] ?? path.join(path.dirname(pluginPath), "utils/get-root-dirs.js");
const { getRootDirs } = require(resolverPath);
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "etail-lint-roots-"));
const slash = value => value.split(path.sep).join("/");
const relative = slash(path.relative(process.cwd(), fixture));
const context = rootDir => ({ cwd: fixture, settings: { next: { rootDir } } });
const resolved = values => values.map(value => path.resolve(value)).sort();
let cases = 0;
const check = (rootDir, expected) => {
  assert.deepEqual(resolved(getRootDirs(context(rootDir))), resolved(expected), JSON.stringify(rootDir));
  cases += 1;
};

try {
  for (const directory of ["alpha/src/app", "beta/pages", "gamma/src/pages", ".hidden/src/app"]) {
    fs.mkdirSync(path.join(fixture, directory), { recursive: true });
  }
  fs.writeFileSync(path.join(fixture, "beta/pages/proof.tsx"), "export default function Page() { return null; }\n");
  fs.writeFileSync(path.join(fixture, "not-a-directory.txt"), "Fixture file.\n");
  fs.symlinkSync("alpha", path.join(fixture, "linked-alpha"), "dir");
  const at = name => path.join(fixture, name);
  check(undefined, [fixture]);
  check(7, [fixture]);
  check(fixture, [fixture]);
  check(`${relative}/`, [fixture]);
  check(`${relative}/alpha`, [at("alpha")]);
  check(`${relative}/alpha`.replace(/\//g, "\\"), [at("alpha")]);
  check(`${relative}/not-a-directory.txt`, []);
  check(`${relative}/missing*`, []);
  check(`${relative}/*`, [at("alpha"), at("beta"), at("gamma"), at("linked-alpha")]);
  check(`${relative}/*/`, [at("alpha"), at("beta"), at("gamma"), at("linked-alpha")]);
  check(`${relative}/alph?`, [at("alpha")]);
  check(`${relative}/{alpha,beta}`, [at("alpha"), at("beta")]);
  check(`${relative}/.hidden`, [at(".hidden")]);
  check(`${relative}/linked-alpha`, [at("linked-alpha")]);
  check(`${relative}/linked-alpha/**`, [at("linked-alpha/src"), at("linked-alpha/src/app")]);
  check([`${relative}/alpha`, `${relative}/beta`, false], [at("alpha"), at("beta")]);
  check(`${relative}/**`, [
    "alpha", "alpha/src", "alpha/src/app", "beta", "beta/pages", "gamma", "gamma/src", "gamma/src/pages",
    "linked-alpha", "linked-alpha/src", "linked-alpha/src/app",
  ].map(at));
  for (const pattern of ["", `!${relative}/alpha`, `${relative}/!(alpha|beta)`, `${relative}/@(alpha|beta)`, `${relative}/+(alpha)`, `${relative}/[ab]*`, `${relative}/{a,{b,c}}`, `${relative}/{1..3}`, `${relative}/{alpha,}`]) {
    assert.throws(() => getRootDirs(context(pattern)), /Next\.js lint rootDir supports/, pattern);
    cases += 1;
  }
  const loaded = Object.keys(require.cache);
  assert.ok(!loaded.some(name => /\/(?:fast-glob|micromatch|braces)\//.test(slash(name))), "Root resolution must not load the removed glob dependency chain.");
  console.log(`Next lint root resolution: ${cases} cases passed; default root, supported directory globs, symlinks and fail-closed configuration checks verified.`);
  if (!process.argv[2]) {
    const { ESLint } = require("eslint");
    const eslint = new ESLint({ cwd: root, cache: false });
    const filePath = path.join(root, "src/app/lint-root-verification.tsx");
    const deliberate = '"use client"; export default async function Page() { return <><img src="/test.png" /><script src="/test.js" /></>; }';
    const [result] = await eslint.lintText(deliberate, { filePath });
    for (const ruleId of ["@next/next/no-async-client-component", "@next/next/no-img-element", "@next/next/no-sync-scripts", "jsx-a11y/alt-text"]) {
      assert.ok(result.messages.some(message => message.ruleId === ruleId), `Expected lint rule remains active: ${ruleId}`);
    }
    for (const rootDir of [`${relative}/beta`, `${relative}/*`, `${relative}/{alpha,beta}`, [`${relative}/alpha`, `${relative}/beta`]]) {
      const configured = new ESLint({ cwd: root, cache: false, overrideConfig: { settings: { next: { rootDir } } } });
      const [linkResult] = await configured.lintText('export default function Page() { return <a href="/proof">Proof</a>; }', { filePath });
      assert.ok(linkResult.messages.some(message => message.ruleId === "@next/next/no-html-link-for-pages"), `Root resolution must preserve internal-link checks: ${JSON.stringify(rootDir)}`);
    }
    const unsupported = new ESLint({ cwd: root, cache: false, overrideConfig: { settings: { next: { rootDir: `${relative}/!(alpha)` } } } });
    await assert.rejects(unsupported.lintText("export default function Page() { return null; }", { filePath }), /Next\.js lint rootDir supports/);
    assert.ok(!Object.keys(require.cache).some(name => /\/(?:fast-glob|micromatch|braces)\//.test(slash(name))), "The regular lint configuration must not load the removed glob dependency chain.");
    console.log("Next lint integration: four representative violations detected; internal-link checks retained for literal, wildcard, brace and array roots; unsupported root syntax fails closed.");
  }
} finally {
  fs.rmSync(fixture, { recursive: true, force: true });
}

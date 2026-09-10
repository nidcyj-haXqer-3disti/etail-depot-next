#!/usr/bin/env node
/** Scoped M0 source checks; dependency audit and runtime security tests are separate. */
import assert from "node:assert/strict";
import { promises as fs, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skipped = new Set(["node_modules", ".git", ".local", ".next", ".netlify", "coverage", "test-results", "playwright-report", "__pycache__"]);
const errors = [];
const relative = (filename) => path.relative(root, filename).split(path.sep).join("/");
const publicSecretName = /\bNEXT_PUBLIC_[A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|DATABASE|CONNECTION|DSN|ENCRYPT|PRIVATE|CREDENTIAL|API_KEY|AUTH_KEY)[A-Z0-9_]*\b/g;
const credentialSignatures = [
  ["PRIVATE_KEY", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ["GITHUB_TOKEN", /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{60,})\b/g],
  ["LIVE_PAYMENT_KEY", /\b(?:sk|rk)_live_[A-Za-z0-9]{16,}\b/g],
  ["CLOUD_ACCESS_KEY", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ["SLACK_TOKEN", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g],
];

async function walk(directory) {
  const result = [];
  try {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      if (skipped.has(entry.name) || entry.isSymbolicLink()) continue;
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) result.push(...await walk(filename));
      else if (entry.isFile() && /\.(?:tsx?|[cm]?js|jsx|json|ya?ml|toml|html|css|py|sql)$/.test(entry.name)) result.push(filename);
    }
  } catch (error) { if (error.code !== "ENOENT") throw error; }
  return result;
}

function sourceFindings(filename, text) {
  const findings = [];
  const add = (index, code) => findings.push({ line: text.slice(0, index).split("\n").length, code });
  for (const [code, expression] of credentialSignatures) {
    expression.lastIndex = 0;
    for (const match of text.matchAll(expression)) add(match.index, code);
  }
  publicSecretName.lastIndex = 0;
  for (const match of text.matchAll(publicSecretName)) add(match.index, "PUBLIC_SECRET_ENV_NAME");

  // Connection credentials are unsafe outside explicitly fictional loopback URLs.
  for (const match of text.matchAll(/\bpostgres(?:ql)?:\/\/[^\s"'`]+/g)) {
    try {
      const url = new URL(match[0]);
      if (url.password && !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) add(match.index, "DATABASE_CREDENTIAL_LITERAL");
    } catch { /* Dynamic templates are checked through runtime configuration instead. */ }
  }

  if (/\.(?:tsx?|[cm]?js|jsx)$/.test(filename)) {
    const tree = ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true, filename.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const applicationSource = relative(filename).startsWith("src/");
    function visit(node) {
      if (applicationSource && ts.isCallExpression(node)) {
        const callee = node.expression.getText(tree);
        if (/(?:localStorage|sessionStorage)\.setItem$/.test(callee)) {
          const key = node.arguments[0];
          const value = node.arguments[1];
          if (!key || !ts.isStringLiteralLike(key) || /(?:token|auth|identity|session|password|user)/i.test(key.text) || /(?:accessToken|refreshToken|password|credential|sessionCookie)/i.test(value?.getText(tree) ?? "")) {
            add(node.getStart(tree), "BROWSER_CREDENTIAL_STORAGE");
          }
        }
        if (/^(?:console|logger)\.(?:log|info|warn|error|debug|trace)$/.test(callee) && node.arguments.some((argument) => !ts.isStringLiteralLike(argument) && /(?:password|accessToken|refreshToken|credentials|authorization|cookieHeader|sessionCookie|identityConfig)/i.test(argument.getText(tree)))) {
          add(node.getStart(tree), "SECRET_LOGGING_ARGUMENT");
        }
      }
      if (applicationSource && ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken && node.left.getText(tree) === "document.cookie") {
        add(node.getStart(tree), "BROWSER_COOKIE_WRITE");
      }
      if (/next\.config\.[cm]?[jt]s$/.test(filename) && ts.isPropertyAssignment(node) && ["env", "publicRuntimeConfig"].includes(node.name.getText(tree).replace(/["']/g, ""))) {
        add(node.getStart(tree), "NEXT_BUILD_ENV_EXPOSURE");
      }
      ts.forEachChild(node, visit);
    }
    visit(tree);
  }
  return findings;
}

/** Execute the actual pure runtime configuration module with isolated env inputs. */
function loadConfiguration(filename, cache = new Map()) {
  if (cache.has(filename)) return cache.get(filename).exports;
  if (filename === path.join(root, "project-targets.json")) return JSON.parse(readFileSync(filename, "utf8"));
  if (!filename.startsWith(path.join(root, "src") + path.sep) || !filename.endsWith(".ts")) {
    throw new Error("CONFIGURATION_DEPENDENCY_NOT_PURE");
  }
  const source = readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const evaluatedModule = { exports: {} };
  cache.set(filename, evaluatedModule);
  const localRequire = (specifier) => {
    if (!specifier.startsWith(".")) throw new Error("CONFIGURATION_EXTERNAL_DEPENDENCY");
    const stem = path.resolve(path.dirname(filename), specifier);
    return loadConfiguration(path.extname(stem) ? stem : `${stem}.ts`, cache);
  };
  const context = vm.createContext({ module: evaluatedModule, exports: evaluatedModule.exports, require: localRequire, URL, process: { env: Object.freeze({}) } });
  new vm.Script(compiled, { filename: relative(filename) }).runInContext(context, { timeout: 1_000 });
  return evaluatedModule.exports;
}

function selfTest() {
  const example = path.join(root, "src/example.ts");
  assert.equal(sourceFindings(example, 'const credential = "' + "ghp_" + "A1".repeat(20) + '";')[0].code, "GITHUB_TOKEN");
  assert.equal(sourceFindings(example, 'process.env.' + ["NEXT", "PUBLIC", "DATABASE", "URL"].join("_") + ";")[0].code, "PUBLIC_SECRET_ENV_NAME");
  assert.equal(sourceFindings(example, 'localStorage.setItem("identity", JSON.stringify(user));')[0].code, "BROWSER_CREDENTIAL_STORAGE");
  assert.equal(sourceFindings(example, 'console.error(accessToken);')[0].code, "SECRET_LOGGING_ARGUMENT");
  assert.equal(sourceFindings(example, 'const testLabel = "server-only-test-token"; const endpoint = "http://127.0.0.1:3000";').length, 0);
  assert.equal(sourceFindings(example, 'localStorage.setItem("theme", "light");').length, 0);
  console.log("Security detector self-tests passed (credential signatures, public env exposure, browser storage, secret logging, fictional-label false positives).");
}

selfTest();
if (!process.argv.includes("--self-test")) {
  const filenames = (await Promise.all(["src", "tools", "tests", ".github", "public"].map((name) => walk(path.join(root, name))))).flat();
  for (const name of [".env.example", "next.config.ts", "next.config.mjs", "netlify.toml", "package.json"]) {
    try { await fs.access(path.join(root, name)); filenames.push(path.join(root, name)); } catch { /* Optional configuration file. */ }
  }
  for (const filename of filenames) {
    for (const finding of sourceFindings(filename, await fs.readFile(filename, "utf8"))) {
      errors.push(`${relative(filename)}:${finding.line} ${finding.code}: Review the credential/exposure boundary. Matched contents are redacted.`);
    }
  }
  let runtimeCases = 0;
  try {
    const config = loadConfiguration(path.join(root, "src/platform/config.ts"));
    assert.equal(config.ENABLE_REAL_MONEY, false);
    assert.equal(typeof config.getRuntimeConfig, "function");
    for (const flag of [undefined, "false"]) {
      const env = { APP_ENV: "test", ETAIL_PUBLIC_ORIGIN: "http://127.0.0.1:3000" };
      if (flag !== undefined) env.ENABLE_REAL_MONEY = flag;
      assert.equal(config.getRuntimeConfig(env).realMoney, false);
      runtimeCases++;
    }
    for (const flag of ["true", "TRUE", "1", "yes"]) {
      let rejected = false;
      try { config.getRuntimeConfig({ APP_ENV: "test", ETAIL_PUBLIC_ORIGIN: "http://127.0.0.1:3000", ENABLE_REAL_MONEY: flag }); }
      catch (error) { rejected = error?.code === "REAL_MONEY_DISABLED"; }
      assert.equal(rejected, true);
      runtimeCases++;
    }
  } catch {
    errors.push("src/platform/config.ts:1 REAL_MONEY_GUARD_FAILED: Actual runtime configuration must export false and reject every tested enabling value.");
  }
  console.log(`M0 security scope: ${filenames.length} source/configuration/test files inspected; ${runtimeCases} actual real-money configuration cases verified. Detected credential values are never printed.`);
  console.log("Excludes ignored local environments, build outputs, dependencies and original source archives. Dependency audit, hosted Identity lifecycle, penetration testing and later financial security remain separate required evidence.");
  if (errors.length) {
    errors.forEach((error) => console.error(error));
    process.exitCode = 1;
  } else console.log("M0 scoped security checks passed.");
}

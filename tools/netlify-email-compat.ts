import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { crc32, inflateRawSync } from "node:zlib";
import ts from "typescript";
import { forbiddenArtifact } from "./public-artifact-policy.ts";

export const platformEmailApproval = Object.freeze({
  package: "@netlify/plugin-emails",
  version: "2.0.1",
  pluginSha256: "0904dc7ea8236372593aed505b9b0e8c3f588c60fb896bec22df56aafae42110",
  handlerSha256: "8d2cd139e7a586f66809dea8dfa0bbb8a360b4792dcc97ed80a4f90f1578f6f3",
  compiledEmailSha256: "4cb879cd5a0136127b064001ee928e4ad2e58d6dfd123dcb24a862004c424983",
});
const generatedDirectory = ".netlify/functions-internal/emails";
const wrapperSource = "netlify/email-compat/handler.mjs";
const digest = (bytes: Buffer | string) => createHash("sha256").update(bytes).digest("hex");

function checkedPath(root: string, relative: string, kind?: "file" | "directory") {
  const absolute = path.resolve(root, relative);
  assert(absolute.startsWith(`${path.resolve(root)}${path.sep}`), "Email artifact must remain inside the project.");
  let current = path.resolve(root);
  for (const component of path.relative(current, absolute).split(path.sep)) {
    current = path.join(current, component);
    if (!existsSync(current)) {
      // existsSync follows symlinks, so a dangling link needs a separate lstat check.
      try { assert(!lstatSync(current).isSymbolicLink(), "Email artifacts cannot be symbolic links."); }
      catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
      continue;
    }
    assert(!lstatSync(current).isSymbolicLink(), "Email artifacts cannot be symbolic links.");
  }
  if (kind) assert(kind === "file" ? lstatSync(absolute).isFile() : lstatSync(absolute).isDirectory(), `Expected email ${kind}.`);
  return absolute;
}

function approvedInputs(root: string) {
  const projectManifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
  assert.equal(projectManifest.devDependencies?.[platformEmailApproval.package], platformEmailApproval.version, "Pin the reviewed Emails plugin version.");
  const require = createRequire(path.join(path.resolve(root), "package.json"));
  const pluginManifestPath = require.resolve(`${platformEmailApproval.package}/package.json`);
  const pluginRoot = path.dirname(pluginManifestPath);
  const pluginManifest = JSON.parse(readFileSync(pluginManifestPath, "utf8"));
  assert.equal(pluginManifest.name, platformEmailApproval.package);
  assert.equal(pluginManifest.version, platformEmailApproval.version);
  assert.equal(digest(readFileSync(path.join(pluginRoot, "lib/src/index.js"))), platformEmailApproval.pluginSha256, "The Emails build plugin needs a new source review.");
  const vendor = readFileSync(path.join(pluginRoot, "lib/src/handler/index.js"));
  assert.equal(digest(vendor), platformEmailApproval.handlerSha256, "The Emails handler needs a new source review.");
  const wrapper = readFileSync(checkedPath(root, wrapperSource, "file"));
  return { vendor, wrapper };
}

function generatedEntries(root: string) {
  const parent = checkedPath(root, ".netlify/functions-internal");
  if (!existsSync(parent)) return undefined;
  assert(lstatSync(parent).isDirectory(), "Generated function source must be a directory.");
  const namesInParent = readdirSync(parent).sort();
  if (namesInParent.length === 0) return undefined;
  assert.deepEqual(namesInParent, ["emails"], "Only the enabled platform Emails function may be generated.");
  const directory = checkedPath(root, generatedDirectory, "directory");
  const names = readdirSync(directory).sort();
  for (const name of names) checkedPath(root, `${generatedDirectory}/${name}`, "file");
  return { directory, names };
}

/** Validate existing platform output; never remove unrelated platform directories or settings. */
export function verifyPlatformEmail(root: string, { required = false } = {}) {
  const inputs = approvedInputs(root);
  const generated = generatedEntries(root);
  if (!generated) {
    assert(!required, "The enabled Emails integration did not generate its reviewed function.");
    return { present: false };
  }
  assert.deepEqual(generated.names, ["index.mjs", "vendor.cjs"], "The Emails function must contain only its reviewed wrapper and original handler.");
  assert.equal(digest(readFileSync(path.join(generated.directory, "vendor.cjs"))), platformEmailApproval.handlerSha256, "Generated email handler differs from the approved plugin.");
  assert.deepEqual(readFileSync(path.join(generated.directory, "index.mjs")), inputs.wrapper, "Generated email authentication wrapper differs from reviewed source.");
  return { present: true, vendorSha256: platformEmailApproval.handlerSha256, wrapperSha256: digest(inputs.wrapper) };
}

/** Run after the official plugin onBuild hook, or prepare the same source for offline review. */
export function preparePlatformEmail(root: string, { requireGenerated = false } = {}) {
  const { vendor, wrapper } = approvedInputs(root);
  const generated = generatedEntries(root);
  assert(generated || !requireGenerated, "Run the official Emails plugin before the compatibility hook.");
  if (generated?.names.includes("index.mjs")) return verifyPlatformEmail(root, { required: true });
  if (generated) {
    assert.deepEqual(generated.names, ["index.js"], "Unrecognized generated email function source.");
    assert.equal(digest(readFileSync(path.join(generated.directory, "index.js"))), platformEmailApproval.handlerSha256, "The hosted Emails handler does not match the reviewed pin.");
  }
  const directory = checkedPath(root, generatedDirectory);
  mkdirSync(directory, { recursive: true });
  writeFileSync(path.join(directory, "vendor.cjs"), vendor, { flag: "wx" });
  writeFileSync(path.join(directory, "index.mjs"), wrapper, { flag: "wx" });
  if (generated) unlinkSync(path.join(directory, "index.js"));
  return verifyPlatformEmail(root, { required: true });
}

/** The existing template setting is retained; arbitrary build-time file inclusion is forbidden. */
export function verifyPlatformEmailConfiguration(root: string, config: { functions?: Record<string, unknown> }, environment: NodeJS.ProcessEnv = process.env) {
  assert([undefined, "emails", "./emails"].includes(environment.NETLIFY_EMAILS_DIRECTORY), "The configured Emails directory needs review before packaging.");
  const functionConfig = config.functions?.emails as { included_files?: unknown; node_bundler?: unknown } | undefined;
  assert(functionConfig, "The official Emails plugin did not register its function configuration.");
  const wildcard = config.functions?.["*"] as Record<string, unknown> | undefined;
  for (const inherited of [config.functions, wildcard]) {
    for (const key of ["included_files", "external_node_modules"]) {
      const value = inherited?.[key];
      assert(value === undefined || (Array.isArray(value) && value.length === 0), "Inherited Functions file inclusion needs a separate review.");
    }
  }
  const patterns = functionConfig.included_files;
  assert(Array.isArray(patterns) && patterns.length === 1 && ["emails/**", "./emails/**"].includes(patterns[0]), "Only the approved Emails template path may be included.");
  const templates = checkedPath(root, "emails");
  if (existsSync(templates)) {
    assert(lstatSync(templates).isDirectory() && readdirSync(templates).length === 0, "Email templates require a separate reviewed feature change.");
  }
}

// Small, bounded ZIP reader for the platform's generated artifact, never public uploads.
function readBundleEntries(bytes: Buffer) {
  assert(bytes.length >= 22 && bytes.length <= 8 * 1024 * 1024, "Unexpected Emails archive size.");
  let end = -1;
  for (let offset = bytes.length - 22; offset >= Math.max(0, bytes.length - 65557); offset--) {
    if (bytes.readUInt32LE(offset) === 0x06054b50 && offset + 22 + bytes.readUInt16LE(offset + 20) === bytes.length) { end = offset; break; }
  }
  assert(end >= 0, "Emails archive has no ZIP directory.");
  assert.equal(bytes.readUInt32LE(end + 4), 0, "Multi-disk Emails archives are not accepted.");
  const count = bytes.readUInt16LE(end + 10);
  assert(count > 0 && count <= 24 && count === bytes.readUInt16LE(end + 8), "Unexpected Emails archive entry count.");
  const directorySize = bytes.readUInt32LE(end + 12);
  let cursor = bytes.readUInt32LE(end + 16);
  assert.equal(cursor + directorySize, end, "Unsupported Emails ZIP directory layout.");
  const entries = new Map<string, Buffer>();
  let expandedSize = 0;
  for (let index = 0; index < count; index++) {
    assert(cursor + 46 <= end && bytes.readUInt32LE(cursor) === 0x02014b50, "Invalid Emails archive entry.");
    const flags = bytes.readUInt16LE(cursor + 8);
    const method = bytes.readUInt16LE(cursor + 10);
    const expectedCrc = bytes.readUInt32LE(cursor + 16);
    const compressedSize = bytes.readUInt32LE(cursor + 20);
    const size = bytes.readUInt32LE(cursor + 24);
    const nameLength = bytes.readUInt16LE(cursor + 28);
    const extraLength = bytes.readUInt16LE(cursor + 30);
    const commentLength = bytes.readUInt16LE(cursor + 32);
    const externalMode = bytes.readUInt32LE(cursor + 38) >>> 16;
    const localOffset = bytes.readUInt32LE(cursor + 42);
    assert(!(flags & 1) && [0, 8].includes(method), "Encrypted or unsupported Emails archive.");
    assert((externalMode & 0xf000) !== 0xa000, "Email archive symlinks are forbidden.");
    assert(cursor + 46 + nameLength + extraLength + commentLength <= end, "Invalid Emails archive filename.");
    const name = bytes.subarray(cursor + 46, cursor + 46 + nameLength).toString("utf8");
    assert(name && !name.includes("\\") && !name.includes("\0") && !name.startsWith("/") && !name.split("/").includes("..") && !name.endsWith("/") && !entries.has(name), "Unsafe or duplicate Emails archive path.");
    expandedSize += size;
    assert(size <= 4 * 1024 * 1024 && expandedSize <= 8 * 1024 * 1024, "Emails archive exceeds its reviewed size bound.");
    assert(localOffset + 30 <= end && bytes.readUInt32LE(localOffset) === 0x04034b50, "Invalid Emails archive local header.");
    const localNameLength = bytes.readUInt16LE(localOffset + 26);
    const localExtraLength = bytes.readUInt16LE(localOffset + 28);
    assert.equal(bytes.subarray(localOffset + 30, localOffset + 30 + localNameLength).toString("utf8"), name, "Emails archive names disagree.");
    const start = localOffset + 30 + localNameLength + localExtraLength;
    assert(start + compressedSize <= bytes.readUInt32LE(end + 16), "Emails archive content overlaps its directory.");
    const compressed = bytes.subarray(start, start + compressedSize);
    const content = method === 0 ? Buffer.from(compressed) : inflateRawSync(compressed, { maxOutputLength: Math.max(1, size) });
    assert.equal(content.length, size, "Emails archive length mismatch.");
    assert.equal(crc32(content), expectedCrc, "Emails archive checksum mismatch.");
    entries.set(name, content);
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  assert.equal(cursor, end, "Unexpected trailing ZIP directory data.");
  return entries;
}

/** Ignore formatting only; retain every executable node, declaration flag and literal. */
function syntaxModel(node: ts.Node, sourceFile: ts.SourceFile): unknown {
  const children = node.getChildren(sourceFile).map(child => syntaxModel(child, sourceFile));
  let text = children.length === 0 && "text" in node && typeof node.text === "string" ? node.text : undefined;
  if (ts.isStringLiteral(node) && /^(?:.*\/)?\.netlify\/functions-internal\/emails\/vendor\.cjs$/.test(node.text)) {
    // The bundler uses this property key solely to identify its CJS module. Checkout paths vary.
    assert(ts.isMethodDeclaration(node.parent) && node.parent.name === node, "Unexpected source path outside the vendor module identifier.");
    text = ".netlify/functions-internal/emails/vendor.cjs";
  }
  return [node.kind, text, ts.isVariableDeclarationList(node) ? node.flags & ts.NodeFlags.BlockScoped : undefined, children];
}

/** Secondary source comparison permits optional commas while retaining unary semantics. */
function guardModel(node: ts.Node): unknown {
  const children: unknown[] = [];
  ts.forEachChild(node, child => { children.push(guardModel(child)); });
  const text = children.length === 0 && "text" in node && typeof node.text === "string" ? node.text : undefined;
  const unaryOperator = ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node) ? node.operator : undefined;
  return [node.kind, text, unaryOperator, ts.isVariableDeclarationList(node) ? node.flags & ts.NodeFlags.BlockScoped : undefined, children];
}

export function verifyBundledPlatformEmail(root: string, contents: string) {
  const source = ts.createSourceFile("handler.mjs", readFileSync(path.join(root, wrapperSource), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const bundled = ts.createSourceFile("index.mjs", contents, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const printer = ts.createPrinter({ removeComments: true });
  assert.equal(digest(JSON.stringify(syntaxModel(bundled, bundled))), platformEmailApproval.compiledEmailSha256, "The complete compiled Emails module differs from the reviewed wrapper and vendor build.");
  const body = (tree: ts.SourceFile) => {
    const functions = tree.statements.filter(node => ts.isFunctionDeclaration(node) && node.name?.text === "createEmailHandler") as ts.FunctionDeclaration[];
    assert.equal(functions.length, 1, "The bundled Emails authentication wrapper is missing or ambiguous.");
    assert(functions[0].body);
    return guardModel(functions[0].body);
  };
  assert.deepEqual(body(bundled), body(source), "The bundled authentication and method guards differ from reviewed source.");
  const defaults = bundled.statements.filter(ts.isExportDeclaration).flatMap(node => node.exportClause && ts.isNamedExports(node.exportClause) ? [...node.exportClause.elements] : []).filter(node => node.name.text === "default");
  assert.equal(defaults.length, 1, "Emails must expose only the reviewed default handler.");
  const defaultName = defaults[0].propertyName?.text;
  assert(defaultName, "Unexpected bundled Emails default export.");
  const declarations = bundled.statements.filter(ts.isVariableStatement).flatMap(node => [...node.declarationList.declarations]);
  const handler = declarations.find(node => ts.isIdentifier(node.name) && node.name.text === defaultName)?.initializer;
  assert(handler && ts.isCallExpression(handler) && ts.isIdentifier(handler.expression) && handler.expression.text === "createEmailHandler" && handler.arguments.length === 2, "The function entry must execute the reviewed authentication wrapper.");
  const readSecret = handler.arguments[1];
  assert(ts.isArrowFunction(readSecret) && readSecret.parameters.length === 0 && readSecret.body.getText(bundled) === "process.env.NETLIFY_EMAILS_SECRET", "The wrapper must use the existing platform email secret.");
  const loader = handler.arguments[0];
  assert(ts.isArrowFunction(loader) && loader.parameters.length === 0 && ts.isBlock(loader.body), "Upstream code must remain inside the authenticated deferred loader.");
  const loaderText = printer.printNode(ts.EmitHint.Unspecified, loader.body, bundled);
  assert.match(loaderText, /const vendor = await Promise\.resolve\(\)\.then\(\(\) => __toESM\(require_vendor\(\), 1\)\);/);
  assert.match(loaderText, /return vendor\.default\.default;/);
  assert.equal(loader.body.statements.length, 3, "Unreviewed code in the upstream loader.");
  for (const required of ["netlify-integration-emails.netlify.app", "netlify-emails-secret", "NETLIFY_EMAILS_PROVIDER", "getEmailFromPath"]) assert(contents.includes(required), "Bundled official email implementation is incomplete.");
}

/** Inspect the actual platform bundle after all onBuild hooks and Functions bundling. */
export function verifyPlatformEmailBundle(root: string, functionsDist: string) {
  const directory = path.resolve(functionsDist);
  assert.equal(directory, path.resolve(root, ".netlify/functions"), "The hosted verifier must inspect the platform's actual Functions distribution directory.");
  verifyPlatformEmail(root, { required: true });
  checkedPath(root, ".netlify/functions", "directory");
  assert.deepEqual(readdirSync(directory).sort(), ["emails.zip", "manifest.json"], "Only the reviewed platform Emails function may be published.");
  const manifest = JSON.parse(readFileSync(checkedPath(root, ".netlify/functions/manifest.json", "file"), "utf8"));
  assert.equal(manifest.version, 1, "Review the changed platform Functions manifest format.");
  assert(Array.isArray(manifest.functions) && manifest.functions.length === 1, "Exactly one platform email function is allowed.");
  const entry = manifest.functions[0];
  assert.equal(entry.name, "emails");
  assert.equal(entry.runtime, "js");
  assert.equal(entry.buildData?.runtimeAPIVersion, 2, "The Emails wrapper requires the modern Request/Response runtime.");
  assert.equal(entry.invocationMode, "stream");
  assert.equal(entry.bundler, "nft", "Review changes to the platform's modern-function bundler.");
  assert.equal(entry.schedule, undefined, "Email scheduling is outside this compatibility change.");
  for (const key of ["routes", "excludedRoutes"]) assert(entry[key] === undefined || (Array.isArray(entry[key]) && entry[key].length === 0), "Custom Emails routes are not approved.");
  assert.equal(path.resolve(entry.path), path.join(directory, "emails.zip"));
  assert.equal(path.resolve(entry.mainFile), path.resolve(root, generatedDirectory, "index.mjs"));
  const archive = readFileSync(checkedPath(root, ".netlify/functions/emails.zip", "file"));
  const entries = readBundleEntries(archive);
  const required = ["___netlify-bootstrap.mjs", "___netlify-entry-point.mjs", "___netlify-metadata.json", "index.mjs"];
  const allowed = new Set([...required, "___netlify-telemetry.mjs"]);
  for (const name of required) assert(entries.has(name), "The platform email bundle is incomplete.");
  for (const [name, bytes] of entries) {
    assert(allowed.has(name) && !forbiddenArtifact(name), "Unapproved file in the platform Emails bundle.");
    assert(!forbiddenArtifact(bytes.toString("utf8")), "Private or retired code in the platform Emails bundle.");
  }
  assert.equal(entries.get("___netlify-entry-point.mjs")!.toString("utf8"), "import * as bootstrap from './___netlify-bootstrap.mjs';export const handler = bootstrap.getLambdaHandler('./index.mjs')", "The Emails entry must load only the authenticated wrapper.");
  const metadata = JSON.parse(entries.get("___netlify-metadata.json")!.toString("utf8"));
  assert.equal(metadata.version, 1);
  assert.match(metadata.bootstrap_version, /^\d+\.\d+\.\d+$/);
  if (entry.buildData.bootstrapVersion) assert.equal(metadata.bootstrap_version, entry.buildData.bootstrapVersion);
  verifyBundledPlatformEmail(root, entries.get("index.mjs")!.toString("utf8"));
  return { functionName: "emails", archiveSha256: digest(archive), entryCount: entries.size, bootstrapVersion: metadata.bootstrap_version };
}

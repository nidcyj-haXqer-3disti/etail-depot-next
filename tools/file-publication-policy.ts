/** File placement is not a confidentiality review. GitHub source is public. */
export type FileDestination = "website-input" | "repository-only" | "local-only" | "unclassified";

const repositoryDirectories = new Set([
  ".github", "tools", "tests", "netlify", "patches", "docs", "planning",
  "archive", "assets", "contracts", "prompts", "sources", "templates",
]);
const repositoryFiles = new Set([
  ".env.example", ".gitignore", ".npmrc", ".nvmrc", "00_START_HERE.md",
  "01_PASTE_IN_CODEX.md", "02_MASTER_BUILD_PROMPT.md", "AGENTS.md", "CONTRIBUTING.md",
  "HANDOFF_VALIDATION.md", "PACKAGE_MANIFEST.json", "README.md", "eslint.config.mjs",
  "netlify.toml", "next-env.d.ts", "next.config.ts", "package.json", "playwright.config.ts",
  "pnpm-lock.yaml", "pnpm-workspace.yaml", "project-targets.json", "tsconfig.json", "vitest.config.ts",
]);
const localDirectories = new Set([
  ".git", ".local", ".private", ".next", ".netlify", ".pnpm-store", "node_modules",
  "out", "dist", "coverage", "outputs", "artifacts", "playwright-report", "test-results",
  "__pycache__", "__macosx",
]);
const sourceOnlyNames = new Set([...repositoryFiles, "reference-release.json", "public-build.json"].map(name => name.toLowerCase()));

function normalizedPath(filename: string): string | null {
  const name = filename.replaceAll("\\", "/");
  if (!name || name.startsWith("/") || /^[a-z]:/i.test(name) || name.split("/").some(part => !part || part === "." || part === "..")) return null;
  return name;
}

function localFile(name: string): boolean {
  const segments = name.toLowerCase().split("/");
  const leaf = segments.at(-1)!;
  return segments.some(part => localDirectories.has(part) || /^\.env(?:\.|$)/i.test(part)) ||
    /\.(?:p12|pfx|pem|key|jks|keystore|log|tsbuildinfo|pyc|bak|orig)$/i.test(leaf) ||
    [".ds_store", "deno.lock", "id_rsa", "id_ed25519"].includes(leaf) ||
    /^(?:docs\/content\/|planning\/content-production\/)/i.test(name) ||
    /^planning\/(?:VENDOR_JOURNEY_ACCEPTANCE\.json|release-scope-20261027\.json|(?:attention-stage|connected-workflows-stage|final-production-review-|qa-consolidation-).*\.json)$/i.test(name);
}

/** Classifies source files for a GitHub candidate; generated delivery output is checked separately. */
export function fileDestination(filename: string): FileDestination {
  const name = normalizedPath(filename);
  if (!name) return "unclassified";
  if (name === ".env.example" || name === "templates/.env.example") return "repository-only";
  if (localFile(name)) return "local-only";
  const directory = name.split("/")[0];
  if (directory === "src" || directory === "public") return "website-input";
  if (repositoryFiles.has(name) || repositoryDirectories.has(directory)) return "repository-only";
  return "unclassified";
}

/** Applies to paths relative to public/, out/ or the final static publish folder. */
export function sourceOnlyStaticFile(filename: string): boolean {
  const name = normalizedPath(filename);
  if (!name) return true;
  if (localFile(name)) return true;
  const segments = name.toLowerCase().split("/");
  // /docs contains real customer documentation routes, never the repository's Markdown files.
  if (segments.slice(0, -1).some(part => repositoryDirectories.has(part) && !["docs", "assets"].includes(part))) return true;
  if (segments.some(part => part === "src" || part === "public")) return true;
  const leaf = segments.at(-1)!;
  return sourceOnlyNames.has(leaf) || /\.(?:md|mdx|tsx?|mts|cts|map|toml|ya?ml|sh|py)$/i.test(leaf);
}

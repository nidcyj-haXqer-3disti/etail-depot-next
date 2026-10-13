import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

/** Content identity of every active build, runtime, test and packaging input. */
export function publicSourceFingerprint(root) {
  const files = [];
  function walk(relative) {
    const absolute = path.join(root, relative);
    if (!existsSync(absolute)) return;
    for (const entry of readdirSync(absolute, { withFileTypes: true })) {
      const name = `${relative}/${entry.name}`;
      if (entry.isSymbolicLink()) throw new Error(`Unexpected source symlink: ${name}`);
      if (entry.isDirectory()) walk(name);
      else if (entry.isFile()) files.push(name);
    }
  }
  for (const dir of ["src", "public", "tools", "tests", "patches", ".github", "netlify"]) walk(dir);
  for (const file of ["package.json", "pnpm-lock.yaml", "pnpm-workspace.yaml", "next.config.ts", "netlify.toml", "project-targets.json", "tsconfig.json", "playwright.config.ts", "vitest.config.ts", "eslint.config.mjs", ".nvmrc"]) {
    if (existsSync(path.join(root, file))) files.push(file);
  }
  const entries = files.sort().map(file => [file, createHash("sha256").update(readFileSync(path.join(root, file))).digest("hex")]);
  return createHash("sha256").update(JSON.stringify(entries)).digest("hex");
}

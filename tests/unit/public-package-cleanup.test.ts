import { mkdtempSync, mkdirSync, readFileSync, rmSync, existsSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { clearPublicPackageOutputs } from "../../tools/public-package-cleanup";

describe("public package cleanup", () => {
  it("rebuilds only owned outputs and preserves Netlify plugins, configuration and runtime evidence", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "etail-package-cleanup-"));
    const netlifyDirectory = path.join(directory, ".netlify");
    const owned = ["static/nested/index.html", "edge-functions-dist/old.eszip", "public-build.json"];
    const preserved = [
      "plugins/node_modules/@netlify/plugin-emails/package.json",
      "state.json", "netlify.toml", "edge-functions-import-map.json", "deploy/receipt.json",
      "functions/legacy.js", "functions-internal/server.js", "dist/adapter.js", "edge-functions/legacy.js",
    ];
    try {
      for (const file of [...owned, ...preserved]) {
        const filename = path.join(netlifyDirectory, file);
        mkdirSync(path.dirname(filename), { recursive: true });
        writeFileSync(filename, `Preserve original bytes: ${file}\n`);
      }
      clearPublicPackageOutputs(netlifyDirectory);
      for (const entry of ["static", "edge-functions-dist", "public-build.json"]) {
        expect(existsSync(path.join(netlifyDirectory, entry)), entry).toBe(false);
      }
      for (const file of preserved) {
        expect(readFileSync(path.join(netlifyDirectory, file), "utf8"), file).toBe(`Preserve original bytes: ${file}\n`);
      }
      expect(() => clearPublicPackageOutputs(netlifyDirectory)).not.toThrow();
      for (const file of preserved) {
        expect(readFileSync(path.join(netlifyDirectory, file), "utf8"), file).toBe(`Preserve original bytes: ${file}\n`);
      }
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { expect, test } from "vitest";
import { publicSourcePath } from "../../tools/public-artifact-policy";

const root = fileURLToPath(new URL("../../", import.meta.url));
function modules(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? modules(filename) : /\.tsx?$/.test(filename) ? [filename] : [];
  });
}

test("shared modules do not directly depend on a business feature", () => {
  const violations: string[] = [];
  for (const filename of modules(path.join(root, "src/shared"))) {
    const tree = ts.createSourceFile(filename, readFileSync(filename, "utf8"), ts.ScriptTarget.Latest, true);
    const visit = (node: ts.Node) => {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        const specifier = node.moduleSpecifier.text;
        const resolved = specifier.startsWith("@/") ? path.join(root, "src", specifier.slice(2)) : path.resolve(path.dirname(filename), specifier);
        if (resolved.startsWith(path.join(root, "src/features") + path.sep)) violations.push(`${path.relative(root, filename)} -> ${specifier}`);
      }
      ts.forEachChild(node, visit);
    };
    visit(tree);
  }
  expect(violations).toEqual([]);
});

test("the pilot allowlist admits reviewed components without opening a new runtime area", () => {
  expect(publicSourcePath("src/features/services/ach-payments/page-content.tsx")).toBe(true);
  expect(publicSourcePath("src/features/services/ach-payments/page-content")).toBe(true);
  expect(publicSourcePath("src/features/services/shared/service-detail.module.css")).toBe(true);
  for (const filename of ["src/features/services/ach-payments/server.ts", "src/features/services/shared/database.ts", "src/features/account/session.ts", "src/features/developers/api.ts"]) {
    expect(publicSourcePath(filename), filename).toBe(false);
  }
});

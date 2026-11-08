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

test("the exact feature allowlist admits reviewed components without opening a new runtime area", () => {
  expect(publicSourcePath("src/features/services/ach-payments/page-content.tsx")).toBe(true);
  expect(publicSourcePath("src/features/services/ach-payments/page-content")).toBe(true);
  expect(publicSourcePath("src/features/services/shared/service-detail.module.css")).toBe(true);
  for (const filename of ["src/ui/new-runtime.ts", "src/modules/public-site/new-runtime.ts", "src/features/services/ach-payments/server.ts", "src/features/services/shared/database.ts", "src/features/account/session.ts", "src/features/developers/api.ts"]) {
    expect(publicSourcePath(filename), filename).toBe(false);
  }
});

test("page modules do not load whole-site validation catalogs", () => {
  const catalogs = new Set([
    "src/features/metadata",
    "src/features/commercial-catalog",
    "src/features/services/catalog",
    "src/features/resources/documentation/articles",
  ]);
  const violations: string[] = [];
  for (const filename of modules(path.join(root, "src"))) {
    const tree = ts.createSourceFile(filename, readFileSync(filename, "utf8"), ts.ScriptTarget.Latest, true);
    for (const node of tree.statements) {
      if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) continue;
      const clause = node.importClause;
      if (clause?.isTypeOnly) continue;
      if (clause && !clause.name && clause.namedBindings && ts.isNamedImports(clause.namedBindings)
        && clause.namedBindings.elements.every(item => item.isTypeOnly)) continue;
      const specifier = node.moduleSpecifier.text;
      const resolved = specifier.startsWith("@/") ? path.join(root, "src", specifier.slice(2)) : path.resolve(path.dirname(filename), specifier);
      const relative = path.relative(root, resolved).replace(/\.tsx?$/, "");
      if (catalogs.has(relative)) violations.push(`${path.relative(root, filename)} -> ${relative}`);
    }
  }
  expect(violations).toEqual([]);
});

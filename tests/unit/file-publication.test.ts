import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { fileDestination } from "../../tools/file-publication-policy";
import { forbiddenStatic } from "../../tools/public-artifact-policy";
// The CLI is also used by builds; exercise its actual Git and public-directory scan.
// @ts-expect-error JavaScript build tooling does not have declaration files.
import { inspectFilePublication } from "../../tools/verify-file-publication.mjs";

const fixtures: string[] = [];
function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), "etail-publication-"));
  fixtures.push(root);
  execFileSync("git", ["init", "--quiet"], { cwd: root });
  return {
    root,
    write(filename: string, content = "example") {
      mkdirSync(path.dirname(path.join(root, filename)), { recursive: true });
      writeFileSync(path.join(root, filename), content);
    },
    git(...args: string[]) { execFileSync("git", args, { cwd: root }); },
  };
}
afterEach(() => { fixtures.splice(0).forEach(root => rmSync(root, { recursive: true, force: true })); });

describe("source and website publication destinations", () => {
  it("keeps the release manifest in public source without permitting a website download", () => {
    expect(fileDestination("tools/reference-release.json")).toBe("repository-only");
    for (const name of ["tools/reference-release.json", "reference-release.json", "downloads/reference-release.json", "docs/reference-release.json", "tools\\reference-release.json", "downloads/Reference-Release.JSON"]) {
      expect(forbiddenStatic(name), name).toBe(true);
    }
    expect(fileDestination("src/app/docs/page.tsx")).toBe("website-input");
    expect(fileDestination("public/help/shopify/settings.webp")).toBe("website-input");
    expect(fileDestination("tests/unit/example.test.ts")).toBe("repository-only");
    expect(fileDestination("docs/FILE_PUBLICATION_POLICY.md")).toBe("repository-only");
  });

  it("rejects raw configuration, developer notes, maps and certificates while preserving customer pages and notices", () => {
    for (const name of ["package.json", "downloads/project-targets.json", "docs/CURRENT_WORK_CONTEXT.md", "planning/STATUS.md", ".github/workflows/check.yml", "tests/sample.json", "_next/static/app.js.map", "downloads/store.p12", "private.key", "__MACOSX/._capture.png", "../../reference-release.json", "/tools/reference-release.json"]) {
      expect(forbiddenStatic(name), name).toBe(true);
    }
    for (const name of ["index.html", "docs.html", "docs/merchant-onboarding.html", "help/shopify/settings.webp", "licenses/moov-iso8583-Apache-2.0.txt", "_next/static/chunks/app.js"]) {
      expect(forbiddenStatic(name), name).toBe(false);
    }
  });

  it("does not treat credential samples or a known directory as permission for real credential files", () => {
    expect(fileDestination(".env.example")).toBe("repository-only");
    expect(fileDestination("templates/.env.example")).toBe("repository-only");
    expect(fileDestination("archive/retired-platform/templates/.env.example")).toBe("repository-only");
    expect(fileDestination("archive/retired-platform/templates/.env.production")).toBe("local-only");
    for (const name of [".env.production", "tools/store.p12", "public/help/store.pfx", ".local/review.json", "outputs/screenshot.png", "docs/content/research.md"]) {
      expect(fileDestination(name), name).toBe("local-only");
    }
    for (const name of ["new-directory/file.json", "C:\\secret.key", "tools/../secret.json"]) expect(fileDestination(name), name).toBe("unclassified");
  });

  it("reports new source files and fails an unknown new location without reading file contents", () => {
    const f = fixture();
    f.write("tools/reference-release.json", '{"scope":{"contentPages":3752}}');
    f.write("public/brand/logo.svg");
    f.write("unknown/report.txt", "do not include contents in the report");
    const report = inspectFilePublication(f.root);
    expect(report.counts).toEqual({ "website-input": 1, "repository-only": 1, "local-only": 0, unclassified: 1 });
    expect(report.findings).toEqual(["unknown/report.txt: FILE_DESTINATION_NOT_DEFINED"]);
    expect(JSON.stringify(report)).not.toContain("do not include contents");
  });

  it("catches an ignored certificate inside public even when Git omits it", () => {
    const f = fixture();
    f.write(".gitignore", "*.p12\n");
    f.write("public/downloads/store.p12");
    const report = inspectFilePublication(f.root);
    expect(report.entries).not.toContainEqual(expect.objectContaining({ path: "public/downloads/store.p12" }));
    expect(report.findings).toContain("public/downloads/store.p12: NON_WEBSITE_FILE_IN_PUBLIC_ASSETS");
  });

  it("catches forced tracked private material and rejects copied source files before building", () => {
    const f = fixture();
    f.write(".gitignore", ".local/\n");
    f.write(".local/notes.txt");
    f.write("public/reference-release.json");
    f.git("add", "--force", ".local/notes.txt");
    expect(inspectFilePublication(f.root).findings).toEqual([
      ".local/notes.txt: LOCAL_FILE_IN_GITHUB_CANDIDATE",
      "public/reference-release.json: NON_WEBSITE_FILE_IN_PUBLIC_ASSETS",
    ]);
  });

  it("rejects symlinks into private directories instead of following them", () => {
    const f = fixture();
    f.write(".gitignore", ".local/\n");
    f.write(".local/private.txt");
    mkdirSync(path.join(f.root, "public"));
    symlinkSync("../.local", path.join(f.root, "public", "download"));
    const report = inspectFilePublication(f.root);
    expect(report.findings).toContain("public/download: SYMLINK_IN_PUBLIC_ASSETS");
    expect(report.findings).toContain("public/download: SYMLINK_IN_GITHUB_CANDIDATE");
    expect(report.entries.map((entry: { path: string }) => entry.path)).not.toContain("public/download/private.txt");
  });

  it("rejects a broken source symlink before its private target could become available", () => {
    const f = fixture();
    mkdirSync(path.join(f.root, "tools"));
    symlinkSync("../.private/missing.json", path.join(f.root, "tools", "details.json"));
    expect(inspectFilePublication(f.root).findings).toContain("tools/details.json: SYMLINK_IN_GITHUB_CANDIDATE");
  });

  it("rejects an ignored public directory symlink without opening its private target", () => {
    const f = fixture();
    f.write(".gitignore", ".local/\npublic\n");
    f.write(".local/private.txt");
    symlinkSync(".local", path.join(f.root, "public"));
    const report = inspectFilePublication(f.root);
    expect(report.findings).toEqual(["public: SYMLINK_IN_PUBLIC_ASSETS"]);
    expect(report.entries.map((entry: { path: string }) => entry.path)).toEqual([".gitignore"]);
  });
});

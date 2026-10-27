import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { PUBLIC_CONTENT_PATHS, INDEXABLE_PUBLIC_PATHS } from "../src/shared/public-page-inventory.ts";
/** Fail closed when source data, provenance notices or the frozen inventory changes. */
export function verifyReferenceRelease(root) {
  const receipt = JSON.parse(readFileSync(path.join(root, "tools/reference-release.json"), "utf8"));
  assert.equal(receipt.scope.contentPages, PUBLIC_CONTENT_PATHS.length);
  assert.equal(receipt.scope.sitemapPages, INDEXABLE_PUBLIC_PATHS.length);
  assert.equal(PUBLIC_CONTENT_PATHS.filter(p => p.startsWith("/guides/iso-20022")).length, receipt.scope.iso20022Pages);
  assert.equal(PUBLIC_CONTENT_PATHS.filter(p => p.startsWith("/guides/iso-8583")).length, receipt.scope.independent8583Pages);
  assert.equal(existsSync(path.join(root, "src/modules/public-site/iso8583-data.json")), false, "Reproduced ISO tables are not part of this release.");
  for (const [file, expected] of Object.entries(receipt.files)) {
    assert.equal(createHash("sha256").update(readFileSync(path.join(root, file))).digest("hex"), expected, `${file}: reference source or notice changed; review and record the new source before packaging.`);
  }
  return receipt;
}

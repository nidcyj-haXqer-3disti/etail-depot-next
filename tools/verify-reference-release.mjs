import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { reviewedLegalPageSources } from "./public-artifact-policy.ts";
import { PUBLIC_CONTENT_PATHS, INDEXABLE_PUBLIC_PATHS } from "../src/shared/site/public-page-inventory.ts";
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
  const legal = receipt.legalPublication;
  assert(legal?.reviewed && legal?.basis, "Legal publication requires an explicit review record.");
  assert.deepEqual(legal.paths.map(route => `${route.slice(1)}/page.tsx`).sort(), [...reviewedLegalPageSources].sort(), "Legal publication paths must match the reviewed source allowlist.");
  const requiredLegalFiles = [
    "src/app/legal/page.tsx",
    "src/features/company/legal/legal-center/page-content.tsx",
    "src/features/company/legal/legal-center/metadata.ts",
    "src/features/company/legal/legal-center/content.ts",
    "src/features/company/legal/metadata.ts",
    "src/features/company/legal/merchant-legal-content.json",
    "src/shared/site/legal-paths.ts",
    "src/shared/site/legal-identity.ts",
    "src/features/company/legal/components/legal-service-document.tsx",
  ];
  assert.deepEqual(Object.keys(legal.files ?? {}).sort(), requiredLegalFiles.sort(), "The exact reviewed legal content and document definitions must be recorded.");
  for (const [file, expected] of Object.entries(legal.files)) {
    assert.equal(createHash("sha256").update(readFileSync(path.join(root, file))).digest("hex"), expected, `${file}: legal publication content changed; review and update its receipt before packaging.`);
  }
  return receipt;
}

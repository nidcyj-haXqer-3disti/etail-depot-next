import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import manifest from "../../tools/assets/guide-image-previews.json";

const digest = (value: Buffer) => createHash("sha256").update(value).digest("hex");

test("guide previews remain tied to the approved source images", () => {
  for (const item of manifest.receipts) {
    const source = readFileSync(new URL(`../../src/features/resources/integrations/${item.group}/assets/${item.source}`, import.meta.url));
    const preview = readFileSync(new URL(`../../src/features/resources/integrations/${item.group}/assets/${item.file}`, import.meta.url));
    expect(digest(source), item.source).toBe(item.sourceSha256);
    expect(digest(preview), item.file).toBe(item.sha256);
    expect(preview.length, item.file).toBe(item.bytes);
  }
});

test("WooCommerce native previews keep the large-screen image budget below 1.4 MB", () => {
  const files = new Map(manifest.receipts.filter(item => item.group === "woocommerce" && "height" in item).map(item => [item.file, item.bytes]));
  // Keep crisp native-size previews without downloading 2.3 MB of full-page captures.
  expect([...files.values()].reduce((sum, bytes) => sum + bytes, 0)).toBeLessThan(1_400_000);
});

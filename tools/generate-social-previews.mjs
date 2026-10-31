#!/usr/bin/env node
/** Regenerate local static sharing images. Does not publish or access external services. */
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { socialPreviews } from "../src/shared/social-preview.ts";
import { socialPreviewArt } from "../src/ui/social-preview-art.ts";
const { ImageResponse } = createRequire(import.meta.url)("next/og");
const destination = new URL("../public/brand/social/", import.meta.url);
await mkdir(destination, { recursive: true });
for (const key of Object.keys(socialPreviews).filter(key => key !== "brand")) {
  const response = new ImageResponse(socialPreviewArt(key), { width: 1200, height: 630 });
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(new URL(`${key}.png`, destination), bytes);
  console.log(`${key}: ${bytes.length} bytes`);
}
console.log(`Static previews saved to ${fileURLToPath(destination)}`);

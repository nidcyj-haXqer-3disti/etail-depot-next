import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

test("embedded marks preserve every byte of the original artwork and stay small", () => {
  const originals = {
    etail: "logo.png",
    ledgix: "ledgix-logo.png",
    visa: "networks/visa-blue.svg",
    mastercard: "networks/mastercard.svg",
    amex: "networks/american-express.svg",
  };
  const css = ["etail", "ledgix", "networks"].map(group => readFileSync(new URL(`../../src/ui/brand-images-${group}.css`, import.meta.url), "utf8")).join("\n");
  const images = Object.fromEntries([...css.matchAll(/\.brand-image-([a-z]+) \{ --brand-image: url\("([^"]+)"\); \}/g)].map(match => [match[1], match[2]]));
  expect(Object.keys(images).sort()).toEqual(Object.keys(originals).sort());
  let bytes = 0;
  for (const [name, file] of Object.entries(originals)) {
    const data = images[name]!;
    const mime = file.endsWith(".svg") ? "image/svg+xml" : "image/png";
    expect(data.startsWith(`data:${mime};base64,`)).toBe(true);
    const decoded = Buffer.from(data.split(",")[1]!, "base64");
    expect(decoded).toEqual(readFileSync(new URL(`../../public/brand/${file}`, import.meta.url)));
    bytes += decoded.length;
  }
  // Large artwork stays a separately cached resource rather than growing every HTML response.
  expect(bytes).toBeLessThan(32_768);
});

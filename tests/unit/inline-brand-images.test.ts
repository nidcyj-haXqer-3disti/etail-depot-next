import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { expect, test } from "vitest";

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");

async function expectSamePixels(embedded: Buffer, original: Buffer) {
  const [actual, source] = await Promise.all([embedded, original].map(bytes =>
    sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true })));
  expect(actual.info).toEqual(source.info);
  // Fully transparent RGB cannot affect any rendered pixel. Lossless WebP may
  // discard those unused color values; alpha and every visible channel must match.
  for (const { data } of [actual, source]) {
    for (let offset = 0; offset < data.length; offset += 4) {
      if (data[offset + 3] === 0) data.fill(0, offset, offset + 3);
    }
  }
  expect(createHash("sha256").update(actual.data).digest("hex")).toBe(createHash("sha256").update(source.data).digest("hex"));
}

test("embedded marks preserve original pixels and network artwork bytes while staying small", async () => {
  const originals = {
    etail: "logo.png",
    ledgix: "ledgix-logo.png",
    visa: "networks/visa-blue.svg",
    mastercard: "networks/mastercard.svg",
    amex: "networks/american-express.svg",
  };
  const css = ["etail", "ledgix", "networks"].map(group => readFileSync(new URL(`../../src/shared/brand/brand-images-${group}.css`, import.meta.url), "utf8")).join("\n");
  const images = Object.fromEntries([...css.matchAll(/\.brand-image-([a-z]+) \{ --brand-image: url\("([^"]+)"\); \}/g)].map(match => [match[1], match[2]]));
  expect(Object.keys(images).sort()).toEqual(Object.keys(originals).sort());
  let bytes = 0;
  for (const [name, file] of Object.entries(originals)) {
    const data = images[name]!;
    const mime = file.endsWith(".svg") ? "image/svg+xml" : "image/webp";
    expect(data.startsWith(`data:${mime};base64,`)).toBe(true);
    const decoded = Buffer.from(data.split(",")[1]!, "base64");
    const original = readFileSync(new URL(`../../public/brand/${file}`, import.meta.url));
    if (file.endsWith(".png")) {
      await expectSamePixels(decoded, original);
      expect(decoded.length).toBeLessThan(original.length * 0.6);
    } else expect(decoded).toEqual(original);
    bytes += decoded.length;
  }
  // Large artwork stays a separately cached resource rather than growing every HTML response.
  expect(bytes).toBeLessThan(20_480);
});


test("versioned artwork sources remain byte identical to the approved public originals", () => {
  const artwork = [
    "brand/symbol.png",
    "brand/wallets/apple-pay.svg",
    "brand/wallets/google-pay.svg",
    "brand/networks/visa-blue.svg",
    "brand/networks/mastercard.svg",
    "brand/networks/american-express.svg",
    "brand/networks/discover.jpg",
    "marketing/everyday-sneaker-v2.webp",
    "help/shopify/settings.webp",
    "help/shopify/payments.webp",
    "help/shopify/other-providers.webp",
    "help/shopify/choose-cybersource.webp",
    "help/shopify/install.webp",
    "help/shopify/permissions.webp",
    "help/shopify/business-center.webp",
    "help/shopify/agreement.webp",
    "help/shopify/activate.webp",
    "help/shopify/active.webp",
    "help/merchant-account/welcome.jpg",
    "help/merchant-account/registration.jpg",
    "help/merchant-account/blank-registration.jpg",
  ];
  for (const file of artwork) {
    const original = readFileSync(new URL(`../../public/${file}`, import.meta.url));
    const directory = file.startsWith("brand/") ? "shared/brand/assets" : file.startsWith("help/merchant-account/") ? "features/resources/merchant-account-setup/assets" : file.startsWith("help/shopify/") ? "features/resources/integrations/shopify/assets" : "shared/ui/artwork/assets";
    const imported = readFileSync(new URL(`../../src/${directory}/${file.split("/").at(-1)}`, import.meta.url));
    expect(imported, file).toEqual(original);
  }
});


test("Trolleys is losslessly embedded without changing its approved artwork", async () => {
  const css = readFileSync(new URL("../../src/shared/brand/brand-images-trolleys.css", import.meta.url), "utf8");
  const data = css.match(/data:image\/webp;base64,([^"]+)/)?.[1];
  expect(data).toBeDefined();
  const bytes = Buffer.from(data!, "base64");
  await expectSamePixels(bytes, readFileSync(new URL("../../src/shared/brand/assets/trolleys-portal-logo.png", import.meta.url)));
  expect(bytes.length).toBeLessThan(12_288);
});


test("opening checkout marks preserve their originals in a route scoped stylesheet", () => {
  const files = { "apple-pay": "wallets/apple-pay.svg", "google-pay": "wallets/google-pay.svg", visa: "networks/visa-blue.svg", mastercard: "networks/mastercard.svg", amex: "networks/american-express.svg", discover: "networks/discover.jpg" };
  const css = readFileSync(new URL("../../src/shared/brand/brand-images-checkout.css", import.meta.url), "utf8");
  const marks = [...css.matchAll(/\.brand-image-([a-z-]+) \{ --brand-image: url\("data:([^;]+);base64,([^\"]+)"\); \}/g)];
  expect(marks.map(mark => mark[1]).sort()).toEqual(Object.keys(files).sort());
  let bytes = 0;
  for (const [, name, mime, data] of marks) {
    const file = files[name as keyof typeof files];
    expect(mime).toBe(file.endsWith(".jpg") ? "image/jpeg" : "image/svg+xml");
    const original = readFileSync(new URL(`../../public/brand/${file}`, import.meta.url));
    expect(Buffer.from(data, "base64")).toEqual(original);
    bytes += original.length;
  }
  expect(bytes).toBeLessThan(65_536);
});


test("opening artwork symbol keeps the original pixels in its shared stylesheet", async () => {
  const css = readFileSync(new URL("../../src/shared/brand/brand-images-symbol.css", import.meta.url), "utf8");
  const encoded = css.match(/data:image\/webp;base64,([^"]+)/)?.[1];
  expect(encoded).toBeDefined();
  const bytes = Buffer.from(encoded!, "base64");
  await expectSamePixels(bytes, readFileSync(new URL("../../src/shared/brand/assets/symbol.png", import.meta.url)));
  expect(bytes.length).toBeLessThan(6_144);
});

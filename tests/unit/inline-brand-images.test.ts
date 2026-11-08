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
  const css = ["etail", "ledgix", "networks"].map(group => readFileSync(new URL(`../../src/shared/brand/brand-images-${group}.css`, import.meta.url), "utf8")).join("\n");
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
    const directory = file.startsWith("brand/") ? "shared/brand/assets" : "ui/assets";
    const imported = readFileSync(new URL(`../../src/${directory}/${file.split("/").at(-1)}`, import.meta.url));
    expect(imported, file).toEqual(original);
  }
});


test("Trolleys is embedded without changing its approved artwork", () => {
  const css = readFileSync(new URL("../../src/shared/brand/brand-images-trolleys.css", import.meta.url), "utf8");
  const data = css.match(/data:image\/png;base64,([^"]+)/)?.[1];
  expect(data).toBeDefined();
  const bytes = Buffer.from(data!, "base64");
  expect(bytes).toEqual(readFileSync(new URL("../../src/shared/brand/assets/trolleys-portal-logo.png", import.meta.url)));
  expect(bytes.length).toBeLessThan(24_576);
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


test("opening artwork symbol keeps the original bytes in its shared stylesheet", () => {
  const css = readFileSync(new URL("../../src/shared/brand/brand-images-symbol.css", import.meta.url), "utf8");
  const encoded = css.match(/data:image\/png;base64,([^"]+)/)?.[1];
  expect(encoded).toBeDefined();
  const bytes = Buffer.from(encoded!, "base64");
  expect(bytes).toEqual(readFileSync(new URL("../../src/shared/brand/assets/symbol.png", import.meta.url)));
  expect(bytes.length).toBeLessThan(16_384);
});

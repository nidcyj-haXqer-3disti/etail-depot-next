/** Keep small, frequently visible marks available with the page, without altering the originals. */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const groups = {
  etail: { etail: "brand/logo.png" },
  ledgix: { ledgix: "brand/ledgix-logo.png" },
  networks: {
    visa: "brand/networks/visa-blue.svg",
    mastercard: "brand/networks/mastercard.svg",
    amex: "brand/networks/american-express.svg",
  },
};
for (const [group, images] of Object.entries(groups)) {
  const lines = Object.entries(images).map(([name, file]) => {
    const bytes = readFileSync(new URL(`public/${file}`, root));
    const type = file.endsWith(".svg") ? "image/svg+xml" : "image/png";
    return `.brand-image-${name} { --brand-image: url("data:${type};base64,${bytes.toString("base64")}"); }`;
  });
  writeFileSync(new URL(`src/ui/brand-images-${group}.css`, root),
    "/* Generated from original public/brand assets. Regenerate: node tools/generate-inline-brand-images.mjs */\n" + lines.join("\n") + "\n");
}

// Preserve public compatibility URLs while giving rendered artwork versioned cache keys.
const artwork = [
  "brand/symbol.png",
  "brand/wallets/apple-pay.svg",
  "brand/wallets/google-pay.svg",
  "brand/networks/visa-blue.svg",
  "brand/networks/mastercard.svg",
  "brand/networks/american-express.svg",
  "brand/networks/discover.jpg",
  "marketing/everyday-sneaker-v2.webp",
];
mkdirSync(new URL("src/ui/assets/", root), { recursive: true });
for (const file of artwork) {
  copyFileSync(new URL(`public/${file}`, root), new URL(`src/ui/assets/${file.split("/").at(-1)}`, root));
}

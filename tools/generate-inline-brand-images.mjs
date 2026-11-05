/** Keep small, frequently visible marks available with the page, without altering the originals. */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const groups = {
  etail: { etail: "brand/logo.png" },
  ledgix: { ledgix: "brand/ledgix-logo.png" },
  checkout: {
    "apple-pay": "brand/wallets/apple-pay.svg",
    "google-pay": "brand/wallets/google-pay.svg",
    visa: "brand/networks/visa-blue.svg",
    mastercard: "brand/networks/mastercard.svg",
    amex: "brand/networks/american-express.svg",
    discover: "brand/networks/discover.jpg",
  },
  networks: {
    visa: "brand/networks/visa-blue.svg",
    mastercard: "brand/networks/mastercard.svg",
    amex: "brand/networks/american-express.svg",
  },
};
for (const [group, images] of Object.entries(groups)) {
  const lines = Object.entries(images).map(([name, file]) => {
    const bytes = readFileSync(new URL(`public/${file}`, root));
    const type = file.endsWith(".svg") ? "image/svg+xml" : file.endsWith(".jpg") ? "image/jpeg" : "image/png";
    return `.brand-image-${name} { --brand-image: url("data:${type};base64,${bytes.toString("base64")}"); }`;
  });
  writeFileSync(new URL(`src/ui/brand-images-${group}.css`, root),
    "/* Generated from original public/brand assets. Regenerate: node tools/generate-inline-brand-images.mjs */\n" + lines.join("\n") + "\n");
}

// The portal mark uses the same embedded delivery as the site wordmark.
const portalLogo = readFileSync(new URL("src/ui/assets/trolleys-portal-logo.png", root));
writeFileSync(new URL("src/ui/brand-images-trolleys.css", root),
  "/* Generated from src/ui/assets/trolleys-portal-logo.png. Regenerate: node tools/generate-inline-brand-images.mjs */\n" +
  `.brand-image-trolleys { --brand-image: url("data:image/png;base64,${portalLogo.toString("base64")}"); }\n`);

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
mkdirSync(new URL("src/ui/assets/", root), { recursive: true });
for (const file of artwork) {
  copyFileSync(new URL(`public/${file}`, root), new URL(`src/ui/assets/${file.split("/").at(-1)}`, root));
}

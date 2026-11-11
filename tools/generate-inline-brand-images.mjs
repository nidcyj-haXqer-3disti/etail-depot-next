/** Keep small, frequently visible marks available with the page, without altering the originals. */
import { createRequire } from "node:module";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
// Lossless encoding reduces render-blocking CSS while source originals remain intact.
const compactMark = bytes => sharp(bytes).webp({ lossless: true, effort: 6 }).toBuffer();
const groups = {
  etail: { etail: "brand/logo.png" },
  symbol: { symbol: "brand/symbol.png" },
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
  const lines = await Promise.all(Object.entries(images).map(async ([name, file]) => {
    const original = readFileSync(new URL(`public/${file}`, root));
    const bytes = file.endsWith(".png") ? await compactMark(original) : original;
    const type = file.endsWith(".svg") ? "image/svg+xml" : file.endsWith(".jpg") ? "image/jpeg" : "image/webp";
    return `.brand-image-${name} { --brand-image: url("data:${type};base64,${bytes.toString("base64")}"); }`;
  }));
  writeFileSync(new URL(`src/shared/brand/brand-images-${group}.css`, root),
    "/* Generated from original public/brand assets. Regenerate: node tools/generate-inline-brand-images.mjs */\n" + lines.join("\n") + "\n");
}

// Extract the existing portal-symbol window for a 14px mark at up to 3x density.
const portalSymbol = await sharp(new URL("src/shared/brand/assets/trolleys-portal-logo.png", root).pathname)
  .extract({ left: 127, top: 25, width: 66, height: 50 }).resize(28, 21)
  .png({ palette: true, colours: 64 }).toBuffer();
writeFileSync(new URL("src/shared/brand/brand-images-platforms.css", root),
  "/* Generated from src/shared/brand/assets/trolleys-portal-logo.png. Regenerate: node tools/generate-inline-brand-images.mjs */\n" +
  `.brand-image-trolleys-symbol { --brand-image: url("data:image/png;base64,${portalSymbol.toString("base64")}"); }\n`);

// Native SVG keeps the original vector paths crisp without additional image requests.
const platformMarks = { shopify: "shopify-bag.svg", woocommerce: "woocommerce.svg" };
const vectorBranches = Object.entries(platformMarks).map(([name, file]) => {
  const original = readFileSync(new URL(`src/shared/brand/assets/${file}`, root), "utf8");
  const viewBox = original.match(/viewBox="([^"]+)"/)[1];
  const fills = Object.fromEntries([...original.matchAll(/\.(st\d+)\{[^}]*?fill:(#[A-Fa-f0-9]+);?[^}]*\}/g)].map(match => [match[1], match[2]]));
  const paths = [...original.matchAll(/<path class="([^"]+)" d="([^"]+)"\s*\/>/g)].map(match =>
    `<path fill="${fills[match[1]]}" d="${match[2].replace(/\s+/g, " ").trim()}" />`).join("\n      ");
  if (!paths || paths.includes('fill="undefined"')) throw new Error(`Unrecognized platform artwork: ${file}`);
  return `  if (brand === "${name}") return <svg viewBox="${viewBox}" className={className} aria-hidden="true" focusable="false">\n      ${paths}\n    </svg>;`;
});
writeFileSync(new URL("src/shared/brand/platform-marks.tsx", root),
  '/** Original platform paths. Regenerate with tools/generate-inline-brand-images.mjs. */\n' +
  'export function PlatformMark({ brand, className }: { brand: "shopify" | "woocommerce"; className: string }) {\n' +
  vectorBranches.join("\n") + '\n  return null;\n}\n');

// The portal mark uses the same embedded delivery as the site wordmark.
const portalLogo = await compactMark(readFileSync(new URL("src/shared/brand/assets/trolleys-portal-logo.png", root)));
writeFileSync(new URL("src/shared/brand/brand-images-trolleys.css", root),
  "/* Generated from src/shared/brand/assets/trolleys-portal-logo.png. Regenerate: node tools/generate-inline-brand-images.mjs */\n" +
  `.brand-image-trolleys { --brand-image: url("data:image/webp;base64,${portalLogo.toString("base64")}"); }\n`);

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

for (const file of artwork) {
  const destination = file.startsWith("brand/") ? "src/shared/brand/assets" : file.startsWith("help/merchant-account/") ? "src/features/resources/merchant-account-setup/assets" : file.startsWith("help/shopify/") ? "src/features/resources/integrations/shopify/assets" : "src/shared/ui/artwork/assets";
  mkdirSync(new URL(`${destination}/`, root), { recursive: true });
  copyFileSync(new URL(`public/${file}`, root), new URL(`${destination}/${file.split("/").at(-1)}`, root));
}

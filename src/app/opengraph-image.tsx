import { ImageResponse } from "next/og";
import { brandWordmark } from "@/shared/brand-wordmark";
import { publicIndexingEnabled, publicSocialImage } from "@/modules/public-site/metadata";
import { cardProduct } from "@/shared/card-product";

export const alt = publicSocialImage.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Static image generation preserves the artwork; the hosted boundary controls indexing.
export const dynamic = "force-static";

/** Static brand image using the existing wordmark; no external request or customer information. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f7f6f2", padding: "64px 76px", color: "#183d35", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* ImageResponse renders this local asset into a PNG at build time. */}
        <img src={brandWordmark} alt="Etail Depot" width={320} height={60} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}><div style={{ display: "flex", flexDirection: "column", fontSize: 70, lineHeight: 1.08, letterSpacing: "-3px", fontWeight: 700 }}><span>Merchant services.</span><span>Card services.</span></div><div style={{ fontSize: 29, color: "#586960" }}>Payments for businesses and software platforms.</div></div>
      <div style={{ display: "flex", fontSize: 23, color: "#586960", borderTop: "1px solid #dce3dc", paddingTop: 23 }}>{`${cardProduct.name} · Applications are not open`}</div>
    </div>,
    { ...size, headers: publicIndexingEnabled() ? {} : { "X-Robots-Tag": "noindex, nofollow" } },
  );
}

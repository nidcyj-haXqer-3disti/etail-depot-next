import { ImageResponse } from "next/og";
import { publicIndexingEnabled, publicSocialImage } from "@/modules/public-site/metadata";
import { cardProduct } from "@/shared/card-product";

export const alt = publicSocialImage.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Static image generation preserves the artwork; the hosted boundary controls indexing.
export const dynamic = "force-static";

/** One generic brand image; no request parameters, external assets or customer information. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f4f5ee", padding: "64px 76px", color: "#153c31", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 32, fontWeight: 700 }}><span style={{ width: 14, height: 32, background: "#51764b", borderRadius: 7 }} />Etail Depot</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}><div style={{ display: "flex", flexDirection: "column", fontSize: 70, lineHeight: 1.08, letterSpacing: "-3px", fontWeight: 700 }}><span>Payment acceptance.</span><span>A credit card for what’s next.</span></div><div style={{ fontSize: 29, color: "#4b6358" }}>Trolleys payment acceptance · Available now</div></div>
      <div style={{ display: "flex", fontSize: 23, color: "#4b6358", borderTop: "1px solid #cad4c7", paddingTop: 23 }}>{`${cardProduct.name} · Coming soon`}</div>
    </div>,
    { ...size, headers: publicIndexingEnabled() ? {} : { "X-Robots-Tag": "noindex, nofollow" } },
  );
}

import { ImageResponse } from "next/og";
import { publicIndexingEnabled } from "@/modules/public-site/metadata";

export const alt = "Etail Depot — Card services and payment services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** One generic brand image; no request parameters, external assets or customer information. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f4f5ee", padding: "64px 76px", color: "#153c31", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 32, fontWeight: 700 }}><span style={{ width: 14, height: 32, background: "#51764b", borderRadius: 7 }} />Etail Depot</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}><div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.08, letterSpacing: "-3px", fontWeight: 700 }}><span>Cards and payments,</span><span>clearly managed.</span></div><div style={{ fontSize: 29, color: "#4b6358" }}>Card services · Payment services</div></div>
      <div style={{ display: "flex", fontSize: 23, color: "#4b6358", borderTop: "1px solid #cad4c7", paddingTop: 23 }}>Explore the demo. No real money moves.</div>
    </div>,
    { ...size, headers: publicIndexingEnabled() ? {} : { "X-Robots-Tag": "noindex, nofollow" } },
  );
}

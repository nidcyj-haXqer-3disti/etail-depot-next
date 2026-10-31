import { createElement as h, type CSSProperties } from "react";
import { brandWordmark } from "../shared/brand-wordmark.ts";
import { socialPreviews, type SocialPreviewKey } from "../shared/social-preview.ts";

/** Original code artwork rendered to static PNGs. No external assets or account records. */
export function socialPreviewArt(key: SocialPreviewKey) {
  const preview = socialPreviews[key];
  const box = (style: CSSProperties, ...children: Parameters<typeof h>[2][]) => h("div", { style: { display: "flex", ...style } }, ...children);
  return box({ width: "100%", height: "100%", position: "relative", background: "#f4f4ed", color: "#173f35", fontFamily: "sans-serif", padding: "58px 64px", flexDirection: "column", justifyContent: "space-between" },
    box({ alignItems: "center" }, h("img", { src: brandWordmark, alt: "Etail Depot", width: 266, height: 50 })),
    box({ width: 730, flexDirection: "column", gap: 25 },
      box({ flexDirection: "column", fontWeight: 700, fontSize: key === "brand" ? 56 : 62, letterSpacing: "-2px", lineHeight: 1.08 }, ...preview.lines.map(line => h("span", { key: line }, line))),
      box({ maxWidth: 675, fontSize: 24, color: "#4c6459", lineHeight: 1.4 }, preview.detail)),
    box({ fontSize: 20, color: "#4c6459" }, "etaildepot.com"),
    box({ position: "absolute", right: 0, top: 0, width: 380, height: 630, background: "#173f35", borderTopLeftRadius: 160, padding: "142px 30px 85px 38px", flexDirection: "column", justifyContent: "center", gap: 26 },
      ...preview.labels.map((label, i) => box({ flexDirection: "column", gap: 16, color: i === 1 ? "#173f35" : "#f6f7ef", background: i === 1 ? "#d5e8a3" : "#265044", border: "1px solid #537565", borderRadius: 16, padding: "22px 24px", marginLeft: i === 1 ? -20 : 8 },
        box({ width: 34, height: 4, background: i === 1 ? "#60804d" : "#b6d58b", borderRadius: 4 }),
        box({ fontSize: 24, fontWeight: 600 }, label)))))
}

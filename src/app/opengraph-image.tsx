import { ImageResponse } from "next/og";
import { publicIndexingEnabled, publicSocialImage } from "@/modules/public-site/metadata";
import { socialPreviewArt } from "@/ui/social-preview-art";

export const alt = publicSocialImage.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

/** Static brand artwork. The hosted boundary controls indexing. */
export default function OpenGraphImage() {
  return new ImageResponse(socialPreviewArt("brand"), {
    ...size, headers: publicIndexingEnabled() ? {} : { "X-Robots-Tag": "noindex, nofollow" },
  });
}

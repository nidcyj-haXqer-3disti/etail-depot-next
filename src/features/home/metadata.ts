import { publicPageMetadata } from "@/shared/seo/metadata";

export const pageDetails = { title: "Merchant Services for Businesses and Platforms", description: "Merchant services for US businesses and software platforms. Credit card processing, ACH payments, online checkout and payout reporting." } as const;
export const metadata = publicPageMetadata("/", pageDetails);
import { publicPageJsonLd } from "@/shared/seo/structured-data-builders";
export const pageJsonLd = () => publicPageJsonLd("/", pageDetails, pageDetails.description, undefined);

import type { Metadata } from "next";
import { canonicalOrigin, privateRobots, publicSocialImage } from "@/shared/seo/metadata";
const homeTitle = `${pageDetails.title} | Etail Depot`;
export const rootMetadata: Metadata = {
  metadataBase: new URL(canonicalOrigin),
  title: { default: homeTitle, template: "%s | Etail Depot" },
  description: pageDetails.description,
  applicationName: "Etail Depot",
  robots: privateRobots,
  icons: { icon: { url: "/brand/favicon-192.png", type: "image/png", sizes: "192x192" }, apple: { url: "/brand/apple-touch-icon.png", type: "image/png", sizes: "180x180" } },
  openGraph: { type: "website", siteName: "Etail Depot", locale: "en_US", title: homeTitle, description: pageDetails.description, images: [publicSocialImage] },
  twitter: { card: "summary_large_image", title: homeTitle, description: pageDetails.description, images: [publicSocialImage] },
};

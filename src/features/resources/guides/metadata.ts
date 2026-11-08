import { publicPageMetadata } from "@/shared/seo/metadata";

export const pageDetails = { title: "Merchant Setup Guides and Payment Code References", description: "Set up your merchant account, connect Shopify to Cybersource, and find ISO 20022 code definitions and independent ISO 8583 message and field explanations." } as const;
export const metadata = publicPageMetadata("/guides", pageDetails);
import { publicPageJsonLd } from "@/shared/seo/structured-data-builders";
import { pageDetails as homeDetails } from "@/features/home/metadata";
export const pageJsonLd = () => publicPageJsonLd("/guides", pageDetails, homeDetails.description, "Guides", {
  id: "reference-collections", name: "Setup guides and payment references", items: [
    { name: "Merchant account setup", path: "/docs/merchant-onboarding" },
    { name: "Shopify integration", path: "/resources/shopify-gateway-integration" },
    { name: "WooCommerce integration", path: "/resources/woocommerce-gateway-integration" },
    { name: "ISO 20022", path: "/guides/iso-20022" },
    { name: "ISO 8583", path: "/guides/iso-8583" },
  ],
});

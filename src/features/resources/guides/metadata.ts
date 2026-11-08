import { publicPageMetadata } from "@/shared/seo/metadata";

export const pageDetails = { title: "Payment Code Guides and References", description: "Find ISO 20022 code definitions and independent ISO 8583 message type, bitmap and field explanations." } as const;
export const metadata = publicPageMetadata("/resources/guides", pageDetails);
import { publicPageJsonLd } from "@/shared/seo/structured-data-builders";
import { pageDetails as homeDetails } from "@/features/home/metadata";
export const pageJsonLd = () => publicPageJsonLd("/resources/guides", pageDetails, homeDetails.description, "Guides", {
  id: "reference-collections", name: "Payment references", items: [
    { name: "ISO 20022", path: "/resources/guides/iso-20022" },
    { name: "ISO 8583", path: "/resources/guides/iso-8583" },
  ],
});

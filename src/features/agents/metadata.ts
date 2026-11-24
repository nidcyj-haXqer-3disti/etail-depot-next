import { publicPageMetadata } from "@/shared/seo/metadata";
import { publicPageJsonLd } from "@/shared/seo/structured-data-builders";
import { pageDetails as homeDetails } from "@/features/home/metadata";

export const pageDetails = {
  title: "Trolleys for Agents | Merchant Setup and Payment Guidance",
  description: "Build a Trolleys task plan for checkout setup, another store, payment questions or software. Follow the source guides and share the steps with your assistant or team.",
} as const;
export const metadata = publicPageMetadata("/agents", pageDetails);
export const pageJsonLd = () => publicPageJsonLd("/agents", pageDetails, homeDetails.description, "For agents");

import { publicPageMetadata } from "@/shared/seo/metadata";
import { publicPageJsonLd } from "@/shared/seo/structured-data-builders";
import { pageDetails as homeDetails } from "@/features/home/metadata";

export const pageDetails = {
  title: "Trolleys for Agents | Merchant Setup and Payment Guidance",
  description: "Plan your next merchant task with Trolleys. Find guidance for checkout, another store, payment questions or software, and prepare a brief for your AI assistant or team.",
} as const;
export const metadata = publicPageMetadata("/agents", pageDetails);
export const pageJsonLd = () => publicPageJsonLd("/agents", pageDetails, homeDetails.description, "For agents");

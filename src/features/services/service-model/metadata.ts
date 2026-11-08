import { servicePageMetadata } from "@/shared/seo/metadata";
import { serviceModelContent } from "./content";

export const pageDetails = serviceModelContent;
export const metadata = servicePageMetadata("/payment-facilitator", pageDetails);

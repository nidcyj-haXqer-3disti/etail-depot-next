import { servicePageMetadata } from "@/shared/seo/metadata";
import { switchMerchantServicesContent } from "./content";

export const pageDetails = switchMerchantServicesContent;
export const metadata = servicePageMetadata("/switch-payment-providers", pageDetails);

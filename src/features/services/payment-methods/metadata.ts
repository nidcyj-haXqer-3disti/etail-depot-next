import { servicePageMetadata } from "@/shared/seo/metadata";
import { paymentMethodsContent } from "./content";

export const pageDetails = paymentMethodsContent;
export const metadata = servicePageMetadata("/payment-methods", pageDetails);

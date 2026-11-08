import { servicePageMetadata } from "@/shared/seo/metadata";

export const pageDetails = { title: "Online Payments and Checkout", description: "Accept credit cards, digital wallets and ACH online. Connect checkout to orders and payment records using the methods enabled for your merchant account." } as const;
export const metadata = servicePageMetadata("/online-businesses", pageDetails);

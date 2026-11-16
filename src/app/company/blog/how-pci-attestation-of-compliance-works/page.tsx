import { articleMetadata } from "@/features/company/blog/metadata";
import { pciAttestationArticle } from "@/features/company/blog/pci-attestation-content";
export const metadata = articleMetadata(pciAttestationArticle);
export { PciAttestationPage as default } from "@/features/company/blog/pci-attestation-page";

import { legalPageMetadata } from "@/modules/public-site/legal-metadata";
import { LegalServiceDocument } from "@/ui/legal-service-document";
export const metadata = legalPageMetadata("/legal/software-platforms");
export default function Page() { return <LegalServiceDocument slug="software-platforms" />; }

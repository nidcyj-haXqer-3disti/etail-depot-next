import { servicePageMetadata } from "@/modules/public-site/metadata";
import { ContactPage } from "@/ui/contact-page";

export const metadata = servicePageMetadata("/contact");
export default function Page() { return <ContactPage />; }

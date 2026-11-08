import { CommercialPage } from "@/shared/ui/commercial-page";
import { trustContent as page } from "./content";
import { CompanyContextArt } from "@/shared/ui/artwork/company-context-art";

export default function Page() {
  return <CommercialPage path="/trust" page={page} artwork={<CompanyContextArt kind="trust" />} />;
}

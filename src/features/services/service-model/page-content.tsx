import { CommercialPage } from "@/shared/ui/commercial-page";
import { serviceModelContent as page } from "./content";
import { CompanyContextArt } from "@/shared/ui/artwork/company-context-art";

export default function Page() {
  return <CommercialPage path="/payment-facilitator" page={page} artwork={<CompanyContextArt kind="facilitator" />} source={<aside className="commercial-source container" aria-label="Model reference"><p>For the network’s description of participant roles, see <a href="https://usa.visa.com/content/dam/VCOM/global/support-legal/documents/visa-payment-facilitator-model.pdf">Visa’s payment facilitator model</a>. The service relationship follows the applicable network rules and account agreements.</p></aside>} />;
}

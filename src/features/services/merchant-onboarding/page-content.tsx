import { ServiceDetailLayout } from "../shared/service-detail-layout";
import { merchantOnboardingContent } from "./content";
import { MerchantOnboardingArt } from "./artwork";

export function MerchantOnboardingPage() {
  return <ServiceDetailLayout path="/merchant-onboarding" page={merchantOnboardingContent} artwork={<MerchantOnboardingArt title={merchantOnboardingContent.art.title} caption={merchantOnboardingContent.art.caption} />} />;
}

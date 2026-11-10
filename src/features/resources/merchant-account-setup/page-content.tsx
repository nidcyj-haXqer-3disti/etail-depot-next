import { ReadingGuide } from "@/shared/ui/reading-guide/reading-guide";
import { TrolleysBrand } from "@/shared/brand/trolleys-brand";
import { MerchantAccountGuide } from "./merchant-account-guide";
import { AdditionalLocationGuide } from "./application-guide-steps";
import { merchantOnboardingArticle } from "./content";
import { pageDetails, merchantAccountJsonLd } from "./metadata";

const contents = [
  { id: "create-account", title: "Create your login" },
  { id: "application-review", title: "Business and sales figures" },
  { id: "owners-and-contacts", title: "Owners and contacts" },
  { id: "bank-details", title: "Bank details" },
  { id: "review-and-submit", title: "Review and submit" },
  { id: "application-submitted", title: "Application status" },
  { id: "additional-mid", title: "Add another DBA" },
  { id: "sign-in", title: "Already have an account?" },
  { id: "registration-email", title: "Email blank or incorrect?" },
];

export function MerchantAccountSetupPage() {
  return <ReadingGuide
    title={pageDetails.title}
    article={merchantOnboardingArticle}
    jsonLd={merchantAccountJsonLd()}
    heading={<TrolleysBrand spacing="intro" />}
    contents={contents}
    illustrations={{
      registration: <MerchantAccountGuide kind="registration" />,
      "additional-location": <AdditionalLocationGuide />,
      "sign-in": <MerchantAccountGuide kind="sign-in" />,
      "email-recovery": <MerchantAccountGuide kind="email-recovery" />,
    }}
  />;
}

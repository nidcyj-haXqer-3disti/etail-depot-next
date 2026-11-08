import { ReadingGuide } from "@/shared/ui/reading-guide/reading-guide";
import { TrolleysBrand } from "@/shared/brand/trolleys-brand";
import { MerchantAccountGuide } from "./merchant-account-guide";
import { merchantOnboardingArticle } from "./content";
import { pageDetails,merchantAccountJsonLd } from "./metadata";
export function MerchantAccountSetupPage(){return <ReadingGuide title={pageDetails.title} article={merchantOnboardingArticle} jsonLd={merchantAccountJsonLd()} heading={<TrolleysBrand spacing="intro"/>} illustrations={{registration:<MerchantAccountGuide kind="registration"/>,"sign-in":<MerchantAccountGuide kind="sign-in"/>,"email-recovery":<MerchantAccountGuide kind="email-recovery"/>}}/>;}

import { merchantOnboardingArticle } from "@/features/resources/merchant-account-setup/content";
import { DocumentationArticle } from "@/features/resources/documentation/documentation";

export { metadata } from "@/features/resources/merchant-account-setup/metadata";
export default function Page() { return <DocumentationArticle article={merchantOnboardingArticle} slug="merchant-onboarding" />; }

import { documentationMetadata } from "@/features/resources/documentation/catalog";
import type { DocArticle } from "@/features/resources/documentation/types";

export const merchantOnboardingArticle: DocArticle = {
    "introduction": documentationMetadata["/docs/merchant-onboarding"].description,
    "prerequisites": [],
    "sections": [
      { "id": "create-account", "title": "Create your merchant login", "illustratedGuide": "registration" },
      { "id": "sign-in", "title": "Already have an account?", "illustratedGuide": "sign-in" },
      { "id": "registration-email", "title": "Email blank or incorrect?", "illustratedGuide": "email-recovery" }
    ]
  };

import type { DocArticle } from "@/shared/ui/reading-guide/types";

export const merchantOnboardingArticle: DocArticle = {
    "introduction": "Enter your email on Trolleys Welcome before choosing Register or Sign In. Follow the illustrated steps to create or access your merchant account.",
    "prerequisites": [],
    "sections": [
      { "id": "create-account", "title": "Create your merchant login", "illustratedGuide": "registration" },
      { "id": "sign-in", "title": "Already have an account?", "illustratedGuide": "sign-in" },
      { "id": "registration-email", "title": "Email blank or incorrect?", "illustratedGuide": "email-recovery" }
    ]
  };

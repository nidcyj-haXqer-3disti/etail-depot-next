import type { GuidanceSource } from "@/shared/site/guidance-source";
import type { DocArticle } from "@/shared/ui/reading-guide/types";

export const merchantOnboardingArticle: DocArticle = {
    "introduction": "Create your Trolleys login, complete your business application and follow its review. Enter your email on Welcome before choosing Register or Sign In.",
    "prerequisites": [],
    "sections": [
      { "id": "create-account", "title": "Set up your merchant account", "illustratedGuide": "registration" },
      { "id": "additional-mid", "title": "Add another DBA under the same company", "illustratedGuide": "additional-location" },
      { "id": "sign-in", "title": "Already have an account?", "illustratedGuide": "sign-in" },
      { "id": "registration-email", "title": "Email blank or incorrect?", "illustratedGuide": "email-recovery" }
    ]
  };

/** Review dependencies, not a second copy of the guide. Consumed only by engineering tools. */
export const additionalDbaSource = {
  "id": "additional-dba",
  "title": "Another DBA, website or legal company",
  "sourceFiles": [
    "src/features/resources/merchant-account-setup/content.ts",
    "src/features/resources/merchant-account-setup/application-guide-steps.tsx",
    "src/features/resources/merchant-account-setup/merchant-account-guide.tsx",
    "src/features/resources/merchant-account-setup/page-content.tsx",
    "src/features/company/blog/additional-domain-page.tsx"
  ],
  "guides": [
    "/resources/merchant-account-setup#additional-mid",
    "/company/blog/add-storefront-domain-payment-account"
  ],
  "reviewWith": [
    {
      "file": "src/features/developers/getting-started/content.ts",
      "guides": [
        "/developers/getting-started#integration-access"
      ]
    },
    {
      "file": "src/features/company/blog/merchant-id-page.tsx",
      "guides": [
        "/company/blog/merchant-id"
      ]
    },
    {
      "file": "src/features/resources/help/page-content.tsx",
      "guides": [
        "/resources/help#payments"
      ]
    }
  ]
} as const satisfies GuidanceSource;

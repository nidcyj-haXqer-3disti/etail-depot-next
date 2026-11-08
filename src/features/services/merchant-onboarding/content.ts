import { merchantAccountGuidance } from "../../../shared/site/merchant-account-guidance";
import { hostedServices } from "@/shared/site/hosted-services";
import type { ServiceDetailContent } from "@/features/services/shared/content-types";

export const merchantOnboardingContent = {
    "kind": "onboarding",
    "label": "Merchant onboarding",
    "title": "Merchant Onboarding and Account Setup",
    "description": "Apply for a merchant account with the right business records. Understand account review, service terms and payment setup before your first sale.",
    "heading": "Apply for your merchant account.",
    "intro": "Complete your business information and check your application status in one place.",
    "action": {
      "label": "Start now",
      "href": hostedServices.payments.registrationUrl
    },
    "secondaryAction": {
      "label": "Discuss your business first",
      "href": "/company/contact#payment-review"
    },
    "note": `${merchantAccountGuidance.application} Account approval and setup are required.`,
    "art": {
      "title": "Trolleys merchant application portal. Continue an incomplete application and begin with Company Profile.",
      "caption": "Application portal illustration",
      "steps": []
    },
    "sections": [
      {
        "id": "application-information",
        "title": "Start with your business.",
        "items": [
          {
            "title": "Business and ownership",
            "text": "Provide company records and details of the people who own or represent the business."
          },
          {
            "title": "Sales and delivery",
            "text": "Describe what you sell, where customers pay and when they receive their purchase."
          },
          {
            "title": "Processing needs",
            "text": "Include expected volume, refund terms and any restrictions with a previous provider."
          }
        ]
      },
      {
        "id": "payment-configuration",
        "title": "Keep your account current.",
        "items": [
          {
            "title": "Outstanding requirements",
            "text": "Follow up on requested information. An incomplete review can delay account activation."
          },
          {
            "title": "Changes to your business",
            "text": "Keep ownership, sales activity, website and receiving bank information current."
          },
          {
            "title": "Your checkout connection",
            "text": "Confirm checkout and software access separately. Account approval alone does not complete an integration."
          }
        ]
      }
    ],
    "workflow": {
      "title": "A clear path to account setup.",
      "intro": "Four steps through application, review and account setup.",
      "steps": [
        {
          "title": "Apply",
          "detail": "Submit business and ownership information through Trolleys."
        },
        {
          "title": "Complete the review",
          "detail": "Provide requested records and resolve any outstanding requirements."
        },
        {
          "title": "Review the agreement",
          "detail": "Understand fees, permitted activity, payout timing and reserve conditions."
        },
        {
          "title": "Complete account setup",
          "detail": "After approval, configure payment methods, account access and the receiving bank."
        }
      ],
      "note": "Submitting an application does not enable payments. Software connections may require separate configuration."
    }
  } as const satisfies ServiceDetailContent;

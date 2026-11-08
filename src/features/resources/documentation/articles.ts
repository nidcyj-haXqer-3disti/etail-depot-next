import { merchantOnboardingArticle } from "@/features/resources/merchant-account-setup/content";
import { integrationAccessArticle } from "@/features/resources/documentation/integration-access/content";
import { checkoutArticle } from "@/features/resources/documentation/checkout/content";
import { paymentRequestsArticle } from "@/features/resources/documentation/payment-requests/content";
import { paymentStatusArticle } from "@/features/resources/documentation/payment-status/content";
import { refundsAndDisputesArticle } from "@/features/resources/documentation/refunds-and-disputes/content";
import { payoutsArticle } from "@/features/resources/documentation/payouts/content";
import { webhooksArticle } from "@/features/resources/documentation/webhooks/content";
import { testingAndLaunchArticle } from "@/features/resources/documentation/testing-and-launch/content";
export type { DocSection, DocArticle } from "./types";

export const documentationArticles = {
  "merchant-onboarding": merchantOnboardingArticle,
  "integration-access": integrationAccessArticle,
  "checkout": checkoutArticle,
  "payment-requests": paymentRequestsArticle,
  "payment-status": paymentStatusArticle,
  "refunds-and-disputes": refundsAndDisputesArticle,
  "payouts": payoutsArticle,
  "webhooks": webhooksArticle,
  "testing-and-launch": testingAndLaunchArticle,
};

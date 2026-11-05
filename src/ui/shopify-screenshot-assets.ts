/** Versioned files reuse the existing immutable asset cache; public image links stay available. */
import settings from "./assets/settings.webp";
import payments from "./assets/payments.webp";
import otherProviders from "./assets/other-providers.webp";
import chooseCybersource from "./assets/choose-cybersource.webp";
import install from "./assets/install.webp";
import permissions from "./assets/permissions.webp";
import businessCenter from "./assets/business-center.webp";
import agreement from "./assets/agreement.webp";
import activate from "./assets/activate.webp";
import active from "./assets/active.webp";

export const shopifyScreenshotAssets = {
  "settings.webp": settings,
  "payments.webp": payments,
  "other-providers.webp": otherProviders,
  "choose-cybersource.webp": chooseCybersource,
  "install.webp": install,
  "permissions.webp": permissions,
  "business-center.webp": businessCenter,
  "agreement.webp": agreement,
  "activate.webp": activate,
  "active.webp": active,
} as const;

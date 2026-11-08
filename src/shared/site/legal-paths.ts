/** Reviewed merchant legal publication scope. All documents remain outside search discovery. */
export const LEGAL_CENTER_PATHS = [
  "/company/legal",
  "/company/legal/merchant-services",
  "/company/legal/fees",
  "/company/legal/payouts-and-reserves",
  "/company/legal/acceptable-use",
  "/company/legal/software-platforms",
  "/company/legal/acquirer-disclosure",
  "/company/legal/merchant-privacy",
  "/company/legal/data-processing",
  "/company/legal/security-policy"
] as const;
export const RETIRED_LEGAL_PATHS = ["/legal/marketplace", "/legal/buyer-terms", "/legal/intellectual-property"] as const;
export type LegalCenterPath = (typeof LEGAL_CENTER_PATHS)[number];
export const LEGAL_DOCUMENT_PATHS = ["/company/privacy", "/company/terms", ...LEGAL_CENTER_PATHS] as const;

/** Reviewed merchant legal publication scope. All documents remain outside search discovery. */
export const LEGAL_CENTER_PATHS = [
  "/legal",
  "/legal/merchant-services",
  "/legal/fees",
  "/legal/payouts-and-reserves",
  "/legal/acceptable-use",
  "/legal/software-platforms",
  "/legal/acquirer-disclosure",
  "/legal/merchant-privacy",
  "/legal/data-processing",
  "/legal/security-policy"
] as const;
export const RETIRED_LEGAL_PATHS = ["/legal/marketplace", "/legal/buyer-terms", "/legal/intellectual-property"] as const;
export type LegalCenterPath = (typeof LEGAL_CENTER_PATHS)[number];
export const LEGAL_DOCUMENT_PATHS = ["/privacy", "/terms", ...LEGAL_CENTER_PATHS] as const;

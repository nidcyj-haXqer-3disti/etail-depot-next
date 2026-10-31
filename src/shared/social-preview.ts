/** Static editorial previews. These labels describe page contents, not live account data. */
export const socialPreviews = {
  company: { lines: ["Merchant services", "for businesses and", "software platforms."], detail: "Merchant services, checkout and reporting", labels: ["Merchant services", "Software platforms", "Account support"] },
  brand: { lines: ["Merchant services.", "For your business."], detail: "Credit card processing, checkout and reporting", labels: ["Merchant accounts", "Online payments", "Software platforms"] },
  merchant: { lines: ["Merchant services.", "Connected payments."], detail: "Credit card and ACH processing for US businesses", labels: ["Account setup", "Payment acceptance", "Payout reporting"] },
  platforms: { lines: ["Your software.", "Your merchants.", "Their payments."], detail: "Merchant services for software platforms", labels: ["Merchant accounts", "Checkout integration", "Payment records"] },
  provider: { lines: ["A different provider.", "A fresh review."], detail: "Merchant account review after a provider change", labels: ["Business model", "Payment needs", "Account review"] },
  documentation: { lines: ["Connect checkout.", "Follow the payment."], detail: "Merchant and developer documentation", labels: ["Account setup", "Online checkout", "Payment events"] },
  references: { lines: ["Payment code", "references."], detail: "Look up a code in its source context", labels: ["ISO 20022", "ISO 8583", "Source notes"] },
  iso20022: { lines: ["ISO 20022", "external codes."], detail: "Definitions, code sets and source references", labels: ["Code set", "Code value", "Source definition"] },
  iso8583: { lines: ["ISO 8583", "implementation", "reference."], detail: "Independent explanations of messages and fields", labels: ["Message types", "Data fields", "Encoding"] },
  cards: { lines: ["Secured credit.", "Made for your wallet."], detail: "Virtual secured credit card", labels: ["Virtual Visa card", "Security deposit", "Monthly repayment"] },
} as const;
export type SocialPreviewKey = keyof typeof socialPreviews;
export function socialPreviewKey(path: string): SocialPreviewKey {
  if (path === "/company") return "company";
  if (path === "/guides/iso-20022" || path.startsWith("/guides/iso-20022/")) return "iso20022";
  if (path === "/guides/iso-8583" || path.startsWith("/guides/iso-8583/")) return "iso8583";
  if (path === "/guides") return "references";
  if (path === "/docs" || path.startsWith("/docs/")) return "documentation";
  if (path === "/credit-card-services") return "cards";
  if (path === "/switch-payment-providers") return "provider";
  if (["/software-partners", "/platform-payment-models", "/payment-partnerships"].includes(path)) return "platforms";
  if (["/payment-acceptance-service", "/online-businesses", "/payment-methods", "/merchant-onboarding", "/payouts-and-reconciliation", "/refunds-and-disputes", "/ach-payments", "/pricing"].includes(path)) return "merchant";
  return "brand";
}
export function socialPreviewImage(path: string, origin: string) {
  const key = socialPreviewKey(path), preview = socialPreviews[key];
  return { url: `${origin}${key === "brand" ? "/opengraph-image" : `/brand/social/${key}.png`}`, width: 1200, height: 630, alt: `Etail Depot. ${preview.lines.join(" ")} ${preview.detail}.` };
}

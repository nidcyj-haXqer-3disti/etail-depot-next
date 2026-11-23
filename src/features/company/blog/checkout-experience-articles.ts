import { checkoutLoginArticle } from "./checkout-login-content";
import { checkoutFieldPurposeArticle } from "./checkout-field-purpose-content";
import { addressSuggestionArticle } from "./address-suggestion-content";
import { customerNameArticle } from "./customer-name-content";
import { keyboardCheckoutArticle } from "./keyboard-checkout-content";
import { checkoutZoomArticle } from "./checkout-zoom-content";
import { paymentChoiceAccessArticle } from "./payment-choice-access-content";
import { checkoutExpiryArticle } from "./checkout-expiry-content";
import { splitShippingPriceArticle } from "./split-shipping-price-content";
import { couponConfidenceArticle } from "./coupon-confidence-content";
import { checkoutEmailArticle } from "./checkout-email-content";

/** Ninth local expansion batch. These articles remain in the single Blog collection. */
export const checkoutExperienceArticles = [
  checkoutLoginArticle,
  checkoutFieldPurposeArticle,
  addressSuggestionArticle,
  customerNameArticle,
  keyboardCheckoutArticle,
  checkoutZoomArticle,
  paymentChoiceAccessArticle,
  checkoutExpiryArticle,
  splitShippingPriceArticle,
  couponConfidenceArticle,
  checkoutEmailArticle,
] as const;

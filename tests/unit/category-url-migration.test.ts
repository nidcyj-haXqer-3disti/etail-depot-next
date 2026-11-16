import { readFileSync } from "node:fs";
import { expect,test,vi } from "vitest";
import { CORE_PAGE_MOVES,currentPublicHref } from "../../src/shared/site/page-url-migrations";
import { DOCUMENTATION_REDIRECTS } from "../../src/shared/site/developer-paths";
import { PUBLIC_CONTENT_PATHS,INDEXABLE_PUBLIC_PATHS,publicPayloadPath } from "../../src/shared/site/public-page-inventory";
import { publicPageRedirect,retiredRoute,retiredArticleRoute } from "../../src/shared/site/public-routes";
import { handlePublicRequest } from "../../netlify/edge-functions/public-boundary";
import { forbiddenStatic } from "../../tools/public-artifact-policy";
const map=JSON.parse(readFileSync("docs/plans/category-url-map.json","utf8")) as {pages:{from:string;to:string}[]};

test("every reviewed old page has one unique final address without redirect chains",()=>{
 expect(map.pages).toHaveLength(3751);
 expect(map.pages.filter(p=>p.from!==p.to)).toHaveLength(3738);
 // This dated map predates the separately added no-code use case and Company Blog.
 const laterPages = ["/company/blog/merchant-risk-questions-before-applying", "/company/blog/merchant-category-code-approval", "/company/blog/visa-vs-mastercard-for-merchants", "/company/blog/make-a-wish", "/company/blog/payment-gateway-vs-payfac", "/use-cases/no-code-checkout-experience", "/company/blog", "/company/blog/when-your-money-stops-moving", "/company/blog/payment-service-providers-holding-merchant-payouts", "/company/blog/payment-service-providers-freeze-funds-without-justification", "/company/blog/how-etail-depot-handles-risk", "/company/blog/when-your-payment-provider-freezes-your-funds", "/company/blog/why-instant-onboarding-is-a-trap", "/company/blog/riverside-payments-case-fine-print", "/company/blog/declined-for-payment-processing", "/company/blog/what-your-payment-provider-is-really-saying-yes-to", "/company/blog/reselling-payments-vs-running-a-payfac", "/company/blog/you-can-leave-that-is-the-point", "/company/blog/how-to-create-a-payment-link", "/company/blog/stripe-alternatives", "/company/blog/payment-processing-systems", "/company/blog/optimize-your-mobile-checkout-experience", "/company/blog/cart-abandonment-vs-checkout-abandonment", "/company/blog/merchant-accounts-and-acquiring", "/company/blog/credit-card-declines", "/company/blog/accelerated-guest-checkout", "/company/blog/card-authorization", "/company/blog/credit-card-networks", "/company/blog/credit-cards-vs-debit-cards", "/company/blog/hosted-payment-pages", "/company/blog/how-batch-payment-processing-works", "/company/blog/payment-analytics", "/company/blog/payment-settlement-and-payouts", "/company/blog/accept-apple-pay-as-a-business", "/company/blog/choose-a-merchant-services-provider", "/company/blog/evaluate-and-manage-multiple-payment-processors", "/company/blog/get-a-merchant-account", "/company/blog/switch-payment-processors", "/company/blog/merchant-category-codes", "/company/blog/merchant-id", "/company/blog/one-page-checkout-vs-multistep-checkout", "/company/blog/payment-capture", "/company/blog/payment-processing-rfp", "/company/blog/payment-processor-vs-merchant-acquirer", "/company/blog/payment-processors-vs-isos", "/company/blog/payment-service-providers", "/company/blog/transaction-details-reports", "/company/blog/card-verification-value", "/company/blog/card-on-file", "/company/blog/credit-card-account-updater", "/company/blog/interchange-plus-vs-flat-rate-pricing", "/company/blog/interchange-fees", "/company/blog/merchant-discount-rate", "/company/blog/ach-debit", "/company/blog/edi-payment-how-does-it-differ-from-ach-and-eft", "/company/blog/card-vs-ach-payments", "/company/blog/ach-payments", "/company/blog/ach-trace-number", "/company/blog/ach-vs-wire-transfers", "/company/blog/accepting-bank-transfers-for-business-payments", "/company/blog/ach-vs-eft", "/company/blog/customer-reference-in-credit-transfers", "/company/blog/fednow-vs-rtp", "/company/blog/how-long-do-ach-payments-take-to-process", "/company/blog/how-long-does-it-take-an-echeck-to-clear", "/company/blog/how-recurring-ach-payments-work", "/company/blog/ach-verification", "/company/blog/reduce-ach-payment-failures", "/company/blog/is-pay-by-bank-safe", "/company/blog/real-time-payments-vs-ach", "/company/blog/routing-number", "/company/blog/sort-code-vs-routing-number", "/company/blog/bank-account-number", "/company/blog/ach-credit", "/company/blog/nacha-and-ach-network", "/company/blog/b2b-payment-methods", "/company/blog/ecommerce-payment-processing", "/company/blog/saas-payment-processing", "/company/blog/accepting-donations-online-as-a-nonprofit", "/company/blog/choosing-an-ecommerce-shopping-cart-for-your-store", "/company/blog/create-an-online-shop", "/company/blog/ecommerce-vs-retail", "/company/blog/event-payment-processing", "/company/blog/ecommerce-discounts", "/company/blog/embedded-software-monetization", "/company/blog/ecommerce-shipping-efficiency", "/company/blog/choose-between-ecommerce-platforms", "/company/blog/start-a-digital-product-business", "/company/blog/net-revenue-retention-for-saas-businesses", "/company/blog/saas-renewal-rate", "/company/blog/write-delivery-promise", "/company/blog/profit-and-loss-statement", "/company/blog/read-a-balance-sheet", "/company/blog/accounts-payable-vs-accounts-receivable", "/company/blog/accounting-ledgers", "/company/blog/accounting-reconciliation", "/company/blog/accounts-payable-journal-entry", "/company/blog/accrued-expenses-vs-accounts-payable", "/company/blog/accrued-revenue-vs-deferred-revenue", "/company/blog/an-accounts-payable-internal-controls-checklist", "/company/blog/bank-reconciliation-statement", "/company/blog/cash-flow-statement", "/company/blog/cash-vs-accrual-accounting", "/company/blog/cogs-vs-operating-expenses", "/company/blog/contribution-margin", "/company/blog/credit-card-reconciliation", "/company/blog/expense-receipts", "/company/blog/fixed-vs-variable-expenses", "/company/blog/gross-profit", "/company/blog/gross-vs-net-profit", "/company/blog/calculate-working-capital", "/company/blog/calculate-net-cash-flow", "/company/blog/forecast-accounts-payable", "/company/blog/credit-card-interest", "/company/blog/secured-credit-cards", "/company/blog/credit-cards-and-digital-wallets", "/company/blog/virtual-credit-cards", "/company/blog/shared-company-credit-cards", "/company/blog/common-mistakes-when-building-business-credit", "/company/blog/business-credit-card-vs-personal", "/company/blog/can-you-use-a-personal-credit-card-for-business", "/company/blog/card-issuing-apis", "/company/blog/charge-cards", "/company/blog/cross-border-card-programs", "/company/blog/how-many-business-credit-cards-should-you-have", "/company/blog/check-your-business-credit-report", "/company/blog/create-a-corporate-credit-card-expense-policy", "/company/blog/increase-your-business-credit-limit", "/company/blog/launching-a-credit-card-program", "/company/blog/managing-corporate-credit-cards", "/company/blog/p-cards-vs-credit-cards", "/company/blog/single-use-credit-cards", "/company/blog/credit-card-float", "/company/blog/credit-card-lifecycle-management", "/company/blog/card-present-vs-card-not-present", "/company/blog/contactless-payments", "/company/blog/credit-card-swipes", "/company/blog/how-a-pin-pad-terminal-works-for-card-payments", "/company/blog/accept-payments-online-and-in-person", "/company/blog/add-in-person-payments-to-your-saas-platform", "/company/blog/offline-credit-card-processing", "/company/blog/point-of-sale", "/company/blog/pos-vs-card-readers", "/company/blog/tap-to-pay", "/company/blog/important-invoice-management-tips", "/company/blog/types-of-invoice-discrepancies", "/company/blog/writing-a-letter-for-outstanding-payment", "/company/blog/billing-models", "/company/blog/contract-invoices", "/company/blog/customer-billing-portals", "/company/blog/dunning-emails", "/company/blog/estimate-vs-invoice", "/company/blog/gross-churn", "/company/blog/accounts-receivable-turnover", "/company/blog/pay-invoice-by-credit-card", "/company/blog/create-an-invoice", "/company/blog/manage-expired-cards-for-recurring-payments", "/company/blog/set-up-recurring-invoices", "/company/blog/write-an-invoice-email", "/company/blog/invoice-reconciliation", "/company/blog/invoice-vs-receipt", "/company/blog/metered-billing", "/company/blog/monthly-recurring-revenue", "/company/blog/open-invoices", "/company/blog/payment-terms-and-conditions", "/company/blog/recurring-payments-vs-subscription-billing", "/company/blog/statement-vs-invoice", "/company/blog/annual-vs-monthly-billing", "/company/blog/billing-address", "/company/blog/credit-notes", "/company/blog/invoice-number", "/company/blog/consuming-webhooks", "/company/blog/payment-api-retries", "/company/blog/payment-gateway-vs-payment-processor", "/company/blog/crm-payment-processing", "/company/blog/erp-payment-system-integration", "/company/blog/intelligent-payment-routing", "/company/blog/mobile-app-payment-gateway-integration", "/company/blog/payment-gateway-testing", "/company/blog/payment-confirmation-pages", "/company/blog/testing-webhooks-on-localhost", "/company/blog/embedded-finance-vs-banking-as-a-service", "/company/blog/embedded-payments-for-online-marketplaces", "/company/blog/embedded-payments-for-saas-platforms", "/company/blog/embedded-payments-vs-integrated-payments", "/company/blog/isv-payments", "/company/blog/multivendor-marketplace-payments", "/company/blog/integrate-a-payment-gateway-into-a-website", "/company/blog/use-multiple-payment-gateways", "/company/blog/merchant-of-record-vs-payment-facilitator", "/company/blog/merchant-of-record-vs-seller-of-record", "/company/blog/open-banking-api", "/company/blog/payfac-as-a-service", "/company/blog/payfacs-vs-independent-sales-organizations", "/company/blog/payment-apis", "/company/blog/payment-failover", "/company/blog/payment-orchestration-vs-payment-gateway", "/company/blog/api-rate-limiting", "/company/blog/what-is-a-chargeback", "/company/blog/how-3d-secure-works", "/company/blog/account-takeover-fraud", "/company/blog/card-payment-refunds", "/company/blog/ach-rejection-codes", "/company/blog/ach-returns-and-ach-debit-return-charges", "/company/blog/chargeback-arbitration", "/company/blog/credit-card-vaulting", "/company/blog/data-masking-vs-encryption", "/company/blog/data-masking-vs-tokenization", "/company/blog/digital-wallet-fraud", "/company/blog/goods-not-received-chargeback-evidence", "/company/blog/fraud-detection-data-analytics", "/company/blog/fraud-liability-shift", "/company/blog/friendly-fraud", "/company/blog/high-risk-merchant-accounts", "/company/blog/how-pci-attestation-of-compliance-works", "/company/blog/storing-card-information", "/company/blog/partial-refunds", "/company/blog/refund-abuse", "/company/blog/chargeback-representment", "/company/blog/average-chargeback-rate", "/company/blog/digital-payment-security", "/company/blog/pick-the-right-payment-methods-in-a-new-country", "/company/blog/important-information-about-bic-and-swift-codes", "/company/blog/b2b-cross-border-payments", "/company/blog/cross-border-payments", "/company/blog/cross-border-ecommerce-businesses", "/company/blog/cross-border-payouts", "/company/blog/how-long-do-cross-border-payments-take", "/company/blog/how-multicurrency-ecommerce-payments-work", "/company/blog/send-and-accept-international-business-payments", "/company/blog/international-payment-gateways", "/company/blog/local-payments", "/company/blog/swift-payments", "/company/blog/foreign-transaction-fees", "/company/blog/reduce-intermediary-bank-fees", "/company/blog/how-multicurrency-bank-accounts-work", "/company/blog/international-travel-payments", "/company/blog/cross-border-payment-apis"];
 expect(map.pages.map(p=>p.to).sort()).toEqual(PUBLIC_CONTENT_PATHS.filter(path => !laterPages.includes(path)).sort());
 expect(new Set(map.pages.map(p=>p.to)).size).toBe(3751);
 expect(INDEXABLE_PUBLIC_PATHS).toHaveLength(3743);
 for(const {from,to} of map.pages){
  expect(publicPageRedirect(to)).toBeNull();
  expect(currentPublicHref(from+"#saved-section")).toBe(to+"#saved-section");
  if(from!==to)for(const suffix of ["","/",".html","/index.html"])expect(publicPageRedirect(from+suffix)).toBe(to);
 }
 for(const [from,to] of Object.entries(DOCUMENTATION_REDIRECTS)){expect(publicPageRedirect(from)).toBe(to);expect(publicPageRedirect(to)).toBeNull();}
});

test("legacy redirects never forward queries or submitted bodies",async()=>{
 for(const from of [...Object.keys(CORE_PAGE_MOVES),"/guides/iso-20022/payment-transaction-status/rcvd","/guides/iso-8583/messages/2100"]){
  const destination=publicPageRedirect(from);expect(destination).not.toBeNull();
  for(const method of ["GET","HEAD","POST","PUT"]){
   const request=new Request(`https://etaildepot.com${from}?email=do-not-forward`,{method,...(["POST","PUT"].includes(method)?{body:"do-not-read"}:{})});
   const next=vi.fn(async()=>new Response("unexpected"));const response=await handlePublicRequest(request,{next,deploy:{context:"dev"}},{});
   expect(response.status).toBe(["GET","HEAD"].includes(method)?308:405);
   expect(request.bodyUsed).toBe(false);expect(next).not.toHaveBeenCalled();
   if(["GET","HEAD"].includes(method)){expect(response.headers.get("location")).toBe(`https://etaildepot.com${destination}`);expect(await response.text()).toBe("");}
   else expect(response.headers.has("location")).toBe(false);
  }
 }
});

test("only exact public service exports are exempt from the retired account family",async()=>{
 for(const path of PUBLIC_CONTENT_PATHS.filter(p=>p.startsWith('/services/'))){
  for(const suffix of ['','.html','/index.html','.txt'])expect(retiredRoute(path+suffix)).toBeNull();
  expect(forbiddenStatic(path.slice(1)+'.html')).toBe(false);
  const response=await handlePublicRequest(new Request('https://etaildepot.com'+path,{method:'POST',body:'do-not-read'}),{next:async()=>new Response('unexpected')},{});expect(response.status).toBe(405);
 }
 for(const path of ['/services','/services/old-account','/services/payouts/transfer','/api/checkout'])expect(retiredRoute(path)).not.toBeNull();
 for(const file of ['services/old-account.html','services/payouts/transfer.html','services/payouts.json'])expect(forbiddenStatic(file)).toBe(true);
 for(const path of ['/guides/iso-20022/not-a-set','/guides/iso-8583/messages/9999','/docs/unknown','/merchant-onboarding/submit','/merchant-onboarding.txt'])expect(publicPageRedirect(path)).toBeNull();
});

test("nested reference payloads use the new resources route segments",()=>{
 expect(publicPayloadPath('/resources/guides/iso-20022/purpose/__next.resources.guides.iso-20022.$d$set.__PAGE__.txt')).toBe('/resources/guides/iso-20022/purpose');
 expect(publicPayloadPath('/resources/guides/iso-20022/purpose/sala/__next.resources.guides.iso-20022.$d$set.$d$code.__PAGE__.txt')).toBe('/resources/guides/iso-20022/purpose/sala');
 expect(publicPayloadPath('/guides/iso-20022/purpose/__next.guides.iso-20022.$d$set.__PAGE__.txt')).toBeNull();
});


test.each([
 ["/guides/how-to-create-a-payment-link", "/use-cases/no-code-checkout-experience"],
 ["/guides/consuming-webhooks", "/developers/webhooks"],
])("restores only reviewed HTML addresses for %s", async (from, destination) => {
 expect(PUBLIC_CONTENT_PATHS).toContain(destination);
 expect(INDEXABLE_PUBLIC_PATHS).not.toContain(destination);
 expect(publicPageRedirect(destination)).toBeNull();
 expect(currentPublicHref(from + "#saved-section")).toBe(destination + "#saved-section");
 for (const suffix of ["", "/", ".html", "/index.html"]) {
  const path = from + suffix;
  expect(retiredArticleRoute(path)).toBe(false);
  expect(forbiddenStatic(path.slice(1))).toBe(true);
  for (const method of ["GET", "HEAD"]) {
   const next = vi.fn(async () => new Response("unexpected"));
   const response = await handlePublicRequest(new Request(`https://preview.invalid${path}?token=do-not-forward`, { method }), { next }, {});
   expect(response.status).toBe(308);
   expect(response.headers.get("location")).toBe(`https://preview.invalid${destination}`);
   expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
   expect(response.headers.get("cache-control")).toBe("no-store");
   expect(next).not.toHaveBeenCalled();
  }
 }
 for (const suffix of [".txt", ".__next._tree.txt", "/__next._tree.txt", "/unrelated", "-other"]) {
  const next = vi.fn(async () => new Response("unexpected"));
  const response = await handlePublicRequest(new Request(`https://preview.invalid${from}${suffix}`), { next }, {});
  expect(response.status).toBe(404);
  expect(response.headers.has("location")).toBe(false);
  expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  expect(next).not.toHaveBeenCalled();
 }
});

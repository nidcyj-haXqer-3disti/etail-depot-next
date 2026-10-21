export const GUIDE_TOPICS = [
  { id: "payment-processing-checkout", label: "Payment processing and checkout" },
  { id: "ach-bank-transfers", label: "ACH payments and bank transfers" },
  { id: "payments-by-business", label: "Payments by business type" },
  { id: "business-finance-accounting", label: "Business finance and accounting" },
  { id: "credit-cards-issuing", label: "Credit cards and card issuing" },
  { id: "in-person-payments-pos", label: "In-person payments and POS" },
  { id: "invoicing-recurring-payments", label: "Invoicing and recurring payments" },
  { id: "gateways-apis-integrations", label: "Payment gateways, APIs and integrations" },
  { id: "chargebacks-refunds-fraud", label: "Chargebacks, refunds and fraud" },
  { id: "cross-border-merchant-infrastructure", label: "Cross-border merchant infrastructure" },
] as const;

export type GuideTopicId = typeof GUIDE_TOPICS[number]["id"];
export type GuideFormat = "How-to" | "Explainer" | "Comparison";
export type GuideSort = "recommended" | "title";

export interface GuideEntry {
  readonly path: `/guides/${string}`;
  readonly title: string;
  readonly description: string;
  readonly topic: GuideTopicId;
  readonly subtopic: string;
  readonly format: GuideFormat;
  readonly keywords: readonly string[];
}

/** Explicit published metadata only. Draft directories and proposed route registers are not catalog inputs. */
const GUIDE_ENTRIES = [
  {
    path: "/guides/how-to-create-a-payment-link",
    title: "Create a payment link",
    description: "Prepare your request, share a link or QR code and check your customer’s payment.",
    topic: "payment-processing-checkout",
    subtopic: "Payment links and QR codes",
    format: "How-to",
    keywords: ["pay by link", "payment-link", "payment request", "online payments", "checkout", "trolleys"],
  },
  {
    path: "/guides/stripe-alternatives",
    title: "Stripe alternatives",
    description: "Compare Stripe and Trolleys, work through processing fees and check what matters before switching.",
    topic: "payment-processing-checkout",
    subtopic: "Provider comparisons",
    format: "Comparison",
    keywords: ["payment processor", "processing fees", "pricing", "provider comparison", "switching providers"],
  },
  {
    path: "/guides/payment-processing-systems",
    title: "Payment processing systems",
    description: "Follow a credit card payment from checkout to payout, then match sales, fees and a refund to a bank deposit.",
    topic: "payment-processing-checkout",
    subtopic: "Payment processing",
    format: "Explainer",
    keywords: ["processor", "gateway", "merchant account", "online payments", "payment methods", "credit card processing", "technology"],
  },
  {
    path: "/guides/what-is-a-chargeback",
    title: "What is a chargeback?",
    description: "Understand the dispute, check the fees and use a worksheet to prepare your response.",
    topic: "chargebacks-refunds-fraud",
    subtopic: "Chargebacks and disputes",
    format: "Explainer",
    keywords: ["charge back", "chargebacks", "disputes", "evidence", "fraud prevention", "clarity"],
  },
  {"path":"/guides/optimize-your-mobile-checkout-experience","title":"How to improve a mobile checkout experience","description":"Run five mobile checkout tests to find form errors, confusing payment returns and duplicate-payment risks, then decide what to fix.","topic":"payment-processing-checkout","subtopic":"mobile checkout","format":"Explainer","keywords":["mobile checkout","mobile commerce","checkout testing","forms","payment experience"]},
  {"path":"/guides/cart-abandonment-vs-checkout-abandonment","title":"Cart abandonment vs. checkout abandonment","description":"See the difference between cart and checkout abandonment, calculate both from 100 shopping journeys and choose what to investigate.","topic":"payment-processing-checkout","subtopic":"cart abandonment","format":"Explainer","keywords":["cart abandonment","checkout abandonment","conversion funnel","checkout measurement"]},
  {"path":"/guides/consuming-webhooks","title":"Consuming webhooks reliably","description":"Verify and save payment webhooks, match them to the order and recover from duplicate or interrupted processing.","topic":"gateways-apis-integrations","subtopic":"webhooks","format":"Explainer","keywords":["webhooks","event processing","payment notifications","duplicate events"]},
  {"path":"/guides/designing-robust-and-predictable-apis-with-idempotency","title":"Designing payment API retries with idempotency","description":"For payment developers: handle a lost response, retain the original operation and decide whether to retry or investigate.","topic":"gateways-apis-integrations","subtopic":"idempotency","format":"Explainer","keywords":["idempotency","API retries","payment integration","network error","duplicate payment"]},
  {"path":"/guides/how-3d-secure-works","title":"How 3D Secure works","description":"Understand frictionless authentication, shopper challenges and the payment result you must check before fulfilling an order.","topic":"chargebacks-refunds-fraud","subtopic":"3D Secure","format":"Explainer","keywords":["3D Secure","3DS authentication","card authorization","payment challenge"]},
  {"path":"/guides/account-takeover-fraud","title":"Account takeover fraud: warning signs and response","description":"Recognize suspicious account changes, distinguish them from ordinary activity and respond through the account provider’s recovery process.","topic":"chargebacks-refunds-fraud","subtopic":"account takeover","format":"Explainer","keywords":["account takeover","ATO","fraud","MFA","account security"]},
  {"path":"/guides/important-invoice-management-tips","title":"Invoice management tips for small businesses","description":"Keep invoices, part-payments and reminders accurate, from agreeing the work to recording the final payment.","topic":"invoicing-recurring-payments","subtopic":"invoice management","format":"Explainer","keywords":["invoice management","small business invoicing","partial payments","overdue invoices","supplier invoices"]},
  {"path":"/guides/types-of-invoice-discrepancies","title":"Invoice discrepancies: find the mismatch and resolve it","description":"Match a disputed invoice to its supporting records, identify each error and agree on a documented correction before updating the amount.","topic":"invoicing-recurring-payments","subtopic":"invoice discrepancy","format":"Explainer","keywords":["invoice discrepancy","invoice errors","invoice dispute","quantity mismatch","duplicate invoice","invoice correction"]},
  {"path":"/guides/b2b-payment-methods","title":"B2B payment methods: choosing how to pay and get paid","description":"Compare business payment methods and follow a $2,400 supplier payment from approval to invoice matching.","topic":"payments-by-business","subtopic":"B2B payments","format":"Explainer","keywords":["B2B payments","business payments","supplier payments","ACH","wire","invoice reconciliation"]},
  {"path":"/guides/ach-debit","title":"What is an ACH debit?","description":"Understand who starts an ACH debit, what authorization covers and what to check before collecting a bank payment.","topic":"ach-bank-transfers","subtopic":"ACH debit","format":"Explainer","keywords":["ACH debit","bank payment","direct debit","ACH credit","authorization"]},
  {"path":"/guides/edi-payment-how-does-it-differ-from-ach-and-eft","title":"EDI payments: how EDI differs from ACH and EFT","description":"Separate EDI payment messages from ACH and EFT, then match a payment to the invoices it settles.","topic":"ach-bank-transfers","subtopic":"EDI payment","format":"Explainer","keywords":["EDI payment","electronic data interchange","ACH","EFT","remittance advice"]},
  {"path":"/guides/pick-the-right-payment-methods-in-a-new-country","title":"How to choose payment methods for a new country","description":"Match payment methods to customers in a new country, then check eligibility, recurring use, refunds and the full customer journey.","topic":"cross-border-merchant-infrastructure","subtopic":"international payments","format":"Explainer","keywords":["international payments","local payment methods","cross-border","new market","payment currencies"]},
  {"path":"/guides/important-information-about-bic-and-swift-codes","title":"BIC and SWIFT codes: what payment instructions mean","description":"Distinguish BIC, account and invoice fields, then verify a supplier’s changed bank instructions before sending payment.","topic":"cross-border-merchant-infrastructure","subtopic":"BIC","format":"Explainer","keywords":["BIC","SWIFT code","IBAN","supplier payment instructions"]},
  {"path":"/guides/profit-and-loss-statement","title":"What is a profit and loss statement?","description":"Read a monthly profit and loss statement, follow the calculation to $4,000 net profit and see why profit differs from cash.","topic":"business-finance-accounting","subtopic":"P&L","format":"Explainer","keywords":["P&L","profit and loss","income statement","revenue","gross profit","operating profit"]},
  {"path":"/guides/read-a-balance-sheet","title":"How to read a balance sheet","description":"Read assets, liabilities and equity through a $30,000 balance sheet, then distinguish working capital from available cash.","topic":"business-finance-accounting","subtopic":"balance sheet","format":"Explainer","keywords":["balance sheet","assets","liabilities","equity","financial statements","working capital"]},
  {"path":"/guides/credit-card-interest","title":"Credit card interest: how it is calculated and why it matters","description":"Follow a daily-balance interest calculation and see how payment timing, grace periods and account terms affect the cost.","topic":"credit-cards-issuing","subtopic":"credit card interest","format":"Explainer","keywords":["credit card interest","APR","daily periodic rate","average daily balance","grace period","business credit card"]},
] as const satisfies readonly GuideEntry[];
const GUIDE_ORDER: readonly string[] = ["/guides/how-to-create-a-payment-link","/guides/payment-processing-systems","/guides/stripe-alternatives","/guides/optimize-your-mobile-checkout-experience","/guides/cart-abandonment-vs-checkout-abandonment","/guides/consuming-webhooks","/guides/designing-robust-and-predictable-apis-with-idempotency","/guides/what-is-a-chargeback","/guides/how-3d-secure-works","/guides/account-takeover-fraud","/guides/important-invoice-management-tips","/guides/types-of-invoice-discrepancies","/guides/b2b-payment-methods","/guides/ach-debit","/guides/edi-payment-how-does-it-differ-from-ach-and-eft","/guides/pick-the-right-payment-methods-in-a-new-country","/guides/important-information-about-bic-and-swift-codes","/guides/profit-and-loss-statement","/guides/read-a-balance-sheet","/guides/credit-card-interest"];
export const PUBLISHED_GUIDES = [...GUIDE_ENTRIES].sort((a,b)=>GUIDE_ORDER.indexOf(a.path)-GUIDE_ORDER.indexOf(b.path));

export interface GuideSearchOptions {
  query?: string;
  // Native select values are strings; unknown filters safely match no entries.
  topic?: string;
  subtopic?: string;
  format?: string;
  sort?: GuideSort;
}

function normalizedText(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("en-US");
}

const titleOrder = new Intl.Collator("en", { sensitivity: "base", numeric: true });

/** Every search token must occur in the entry's explicit, public metadata. Input is never a regular expression. */
export function searchGuides(
  entries: readonly GuideEntry[],
  { query = "", topic = "all", subtopic = "all", format = "all", sort = "recommended" }: GuideSearchOptions = {},
): GuideEntry[] {
  const tokens = normalizedText(query.slice(0, 160)).trim().split(/\s+/u).filter(Boolean);
  const results = entries.filter(entry => {
    if (topic !== "all" && entry.topic !== topic) return false;
    if (subtopic !== "all" && entry.subtopic !== subtopic) return false;
    if (format !== "all" && entry.format !== format) return false;
    if (!tokens.length) return true;
    const topicLabel = GUIDE_TOPICS.find(candidate => candidate.id === entry.topic)?.label ?? "";
    const searchableText = normalizedText([entry.title, entry.description, topicLabel, entry.subtopic, entry.format, ...entry.keywords].join(" "));
    return tokens.every(token => searchableText.includes(token));
  });
  return sort === "title" ? results.sort((left, right) => titleOrder.compare(left.title, right.title)) : results;
}

/** Pagination works on a new slice and never changes catalog order or entry metadata. */
export function paginateGuides<T>(entries: readonly T[], page: number, pageSize = 12): {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
} {
  const size = Number.isFinite(pageSize) && Math.trunc(pageSize) > 0 ? Math.min(48, Math.trunc(pageSize)) : 12;
  const total = entries.length;
  const totalPages = Math.ceil(total / size);
  const requestedPage = Number.isFinite(page) ? Math.trunc(page) : 1;
  const currentPage = Math.min(Math.max(1, requestedPage), Math.max(1, totalPages));
  return {
    items: entries.slice((currentPage - 1) * size, currentPage * size),
    page: currentPage,
    totalPages,
    total,
  };
}

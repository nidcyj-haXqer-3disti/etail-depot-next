export const GUIDE_TOPICS = [
  { id: "taking-payments", label: "Taking payments" },
  { id: "fees-and-providers", label: "Fees and providers" },
  { id: "invoicing-and-billing", label: "Invoices and recurring billing" },
  { id: "disputes-and-fraud", label: "Refunds, disputes and fraud" },
  { id: "business-finances", label: "Cash flow and business finances" },
  { id: "running-a-business", label: "Starting and running a business" },
  { id: "cards-and-credit", label: "Cards and credit" },
  { id: "payment-technology", label: "Payment technology" },
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
export const PUBLISHED_GUIDES = [
  {
    path: "/guides/how-to-create-a-payment-link",
    title: "Create a payment link",
    description: "Prepare your request, share a link or QR code and check your customer’s payment.",
    topic: "taking-payments",
    subtopic: "Payment links and QR codes",
    format: "How-to",
    keywords: ["pay by link", "payment-link", "payment request", "online payments", "checkout", "trolleys"],
  },
  {
    path: "/guides/stripe-alternatives",
    title: "Stripe alternatives",
    description: "Compare Stripe and Trolleys on payment links, features and costs before switching.",
    topic: "fees-and-providers",
    subtopic: "Provider comparisons",
    format: "Comparison",
    keywords: ["payment processor", "processing fees", "pricing", "provider comparison", "switching providers"],
  },
  {
    path: "/guides/payment-processing-systems",
    title: "Payment processing systems",
    description: "Understand the parts of a payment system and choose how customers will pay.",
    topic: "taking-payments",
    subtopic: "Payment processing",
    format: "Explainer",
    keywords: ["processor", "gateway", "merchant account", "online payments", "payment methods", "credit card processing", "technology"],
  },
  {
    path: "/guides/what-is-a-chargeback",
    title: "What is a chargeback?",
    description: "Understand refunds, dispute fees, prevention and the records that help you respond.",
    topic: "disputes-and-fraud",
    subtopic: "Chargebacks and disputes",
    format: "Explainer",
    keywords: ["charge back", "chargebacks", "disputes", "evidence", "fraud prevention", "clarity"],
  },
] as const satisfies readonly GuideEntry[];

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

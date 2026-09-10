export const LEDGER_BUCKETS = ["PRACTICE_SOURCE", "CARD_AVAILABLE", "CARD_SPENT", "GATEWAY_CLEARING", "MERCHANT_AVAILABLE", "PAYOUT_CLEARING"] as const;
export const JOURNAL_KINDS = ["CARD_FUNDING", "CARD_PURCHASE", "CARD_REFUND", "MERCHANT_PAYMENT", "MERCHANT_REFUND", "MERCHANT_PAYOUT"] as const;
export type LedgerBucket = typeof LEDGER_BUCKETS[number];
export type JournalKind = typeof JOURNAL_KINDS[number];

export interface LedgerPosition {
  serviceId: string;
  bucket: LedgerBucket;
  cardId?: string | null;
  merchantUnitId?: string | null;
}
export interface JournalLine extends LedgerPosition { deltaMinor: bigint }
export interface PostJournalInput {
  businessKey: string;
  kind: JournalKind;
  referenceId: string;
  lines: readonly JournalLine[];
}

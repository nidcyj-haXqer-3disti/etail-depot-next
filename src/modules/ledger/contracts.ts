export const MONEY_BUCKETS = ["MONEY_SOURCE","MONEY_AVAILABLE","MONEY_WITHDRAWAL_PENDING","MONEY_WITHDRAWN"] as const;
export const LEDGER_BUCKETS = ["PRACTICE_SOURCE", "GROUP_AVAILABLE", "CARD_AVAILABLE", "CARD_SPENT", "GATEWAY_CLEARING", "MERCHANT_AVAILABLE", "MERCHANT_SETTLED", "MERCHANT_PAYOUT_PENDING", "PAYOUT_CLEARING",...MONEY_BUCKETS] as const;
export const JOURNAL_KINDS = ["GROUP_FUNDING", "CARD_FUNDING", "CARD_PURCHASE", "CARD_REFUND", "MERCHANT_PAYMENT", "MERCHANT_REFUND", "MERCHANT_PAYOUT", "MERCHANT_SETTLEMENT", "DEPOSIT_RESERVE", "DEPOSIT_RELEASE","MONEY_FUNDING","MONEY_WITHDRAWAL_RESERVE","MONEY_WITHDRAWAL_COMPLETE","MONEY_WITHDRAWAL_RELEASE","MONEY_CUTOVER"] as const;
export type LedgerBucket = typeof LEDGER_BUCKETS[number];
export type JournalKind = typeof JOURNAL_KINDS[number];

export interface LedgerPosition {
  serviceId: string | null;
  moneyAccountId?: string | null;
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
  occurredAt?: Date;
}

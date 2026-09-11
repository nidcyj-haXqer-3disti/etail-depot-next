import { z } from "zod";
import type { ServiceSummary } from "../services/service";

/** Server projections of explicitly fictional, local-only records; no live financial service. */
export interface Money { minor: string; currency: "USD"; formatted: string }
export interface WorkspaceCapability { action: string; allowed: boolean; reason: string; reasonCode: string }
export interface CardPurchaseAvailability {
  code: "READY" | "OTHER_CARDHOLDER" | "ACCESS_RESTRICTED" | "SETUP_REQUIRED" | "FROZEN" | "NO_FUNDS";
  title: string;
  description: string;
}
export interface WorkspaceCard {
  id: string; serviceId: string; holderId: string; holderName: string; nickname: string;
  relationship: "PRIMARY" | "SECONDARY";
  lastFour: string; format: "VIRTUAL" | "PHYSICAL"; status: "ACTIVE" | "FROZEN";
  version: number; limit: Money; available: Money;
  canFreeze: boolean; canUnfreeze: boolean; canPurchase: boolean; fictional: true;
  purchaseAvailability: CardPurchaseAvailability;
  freeze:{primary:boolean;holder:boolean;reviewRequired:boolean;description:string;freezeLabel:string;unfreezeLabel:string;unfreezeDescription:string};
}
export interface WorkspaceActivity {
  id: string; serviceId: string; cardId: string | null; title: string; category: string;
  occurredAt: string; status: "POSTED" | "PENDING" | "DECLINED";
  direction: "DEBIT" | "CREDIT"; amount: Money; description: string; fictional: true;
}
export interface CardPurchaseResult { card: WorkspaceCard; activity: WorkspaceActivity; journalId: string; fictional: true }
export interface WorkspacePerson {
  id: string; displayName: string; role: string; state: "ACCEPTED" | "REVOKED";
  permissions: string[]; isCurrentPerson: boolean;
}
export interface CardRequestProjection {
  id: string; serviceId: string; holderId: string; holderName: string; nickname: string;
  format: "VIRTUAL" | "PHYSICAL"; requestedLimitMinor: string; currency: "USD";
  status: "DRAFT" | "BLOCKED" | "CANCELED" | "ISSUED"; version: number; updatedAt: string;
  issuedCardId: string | null; canSubmit: boolean;
  prerequisites: { code: string; title: string; detail: string }[];
}
export interface NotificationPreferences {
  serviceActivity: boolean; cardControls: boolean; caseUpdates: boolean; version: number;
  delivery: "SAVED_ONLY";
}
export interface WorkspaceProjection {
  customerService?:{id:string;displayName:string;primaryName:string};
  service: ServiceSummary; member: { id: string; displayName: string }; services: ServiceSummary[];
  cardholderRole: "PRIMARY" | "SECONDARY" | "NONE";
  fictional: true; notice: string; capabilities: WorkspaceCapability[];
  cards: WorkspaceCard[]; cardRequests: CardRequestProjection[];
  cardholderOptions: { id: string; displayName: string; description: string }[];
  activity: WorkspaceActivity[]; people: WorkspacePerson[];
  preferences: NotificationPreferences;
}

export const versionSchema = z.int().positive();
export const cardControlCommandSchema = z.object({ commandId: z.uuid(), expectedVersion: versionSchema, action: z.enum(["freeze", "unfreeze"]) }).strict();
export const cardPurchaseCommandSchema = z.object({ commandId: z.uuid(), expectedVersion: versionSchema, amountMinor: z.string().regex(/^[1-9][0-9]{0,8}$/), description: z.string().trim().min(1).max(120) }).strict();
export type CardPurchaseCommand = z.infer<typeof cardPurchaseCommandSchema>;
export const startCardRequestSchema = z.object({ commandId: z.uuid() }).strict();
export const cardDraftCommandSchema = z.object({
  commandId: z.uuid(), expectedVersion: versionSchema, holderId: z.uuid(),
  nickname: z.string().trim().min(1).max(60), format: z.enum(["VIRTUAL", "PHYSICAL"]),
  requestedLimitMinor: z.string().regex(/^(0|[1-9][0-9]{0,8})$/),
}).strict();
export const versionedCommandSchema = z.object({ commandId: z.uuid(), expectedVersion: versionSchema }).strict();
export const notificationCommandSchema = z.object({
  commandId: z.uuid(), expectedVersion: versionSchema,
  serviceActivity: z.boolean(), cardControls: z.boolean(), caseUpdates: z.boolean(),
}).strict();
export type CardControlCommand = z.infer<typeof cardControlCommandSchema>;
export type StartCardRequestCommand = z.infer<typeof startCardRequestSchema>;
export type CardDraftCommand = z.infer<typeof cardDraftCommandSchema>;
export type VersionedCommand = z.infer<typeof versionedCommandSchema>;
export type NotificationCommand = z.infer<typeof notificationCommandSchema>;

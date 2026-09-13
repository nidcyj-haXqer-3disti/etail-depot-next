import { z } from "zod";
import type { Money } from "../workspace/contracts";

const plain = (max:number) => z.string().trim().max(max).refine(value=>!/[\u0000-\u001f\u007f-\u009f]/.test(value),"Use plain text");
export const legalEntityTypeSchema=z.enum(["INDIVIDUAL","SOLE_PROPRIETOR","BUSINESS"]);
export const merchantStatusSchema=z.enum(["NOT_STARTED","DRAFT","PENDING_LOCAL_REVIEW","APPROVED","RESTRICTED","DECLINED","CLOSED"]);
export const startMerchantSetupSchema=z.object({commandId:z.uuid()}).strict();
export const updateMerchantSetupSchema=z.object({commandId:z.uuid(),expectedVersion:z.int().positive(),legalEntityType:legalEntityTypeSchema.nullable(),sellingName:plain(80),legalName:plain(100),activityDescription:plain(500),country:z.literal("US"),fictionalDetailsConfirmed:z.boolean()}).strict();
export const submitMerchantSetupSchema=z.object({commandId:z.uuid(),expectedVersion:z.int().positive()}).strict();
export const paymentChannelFieldsSchema=z.object({description:plain(160).min(1),amountMinor:z.string().regex(/^[1-9][0-9]{0,11}$/),currency:z.literal("USD"),usage:z.enum(["ONE_TIME","REUSABLE"]),expiresAt:z.iso.datetime()}).strict();
export type StartMerchantSetupInput=z.infer<typeof startMerchantSetupSchema>;
export type UpdateMerchantSetupInput=z.infer<typeof updateMerchantSetupSchema>;
export type SubmitMerchantSetupInput=z.infer<typeof submitMerchantSetupSchema>;
export type MerchantStatus=z.infer<typeof merchantStatusSchema>;
export interface SetupRequirement {code:string;label:string;status:"COMPLETE"|"REQUIRED"|"UNAVAILABLE";detail:string}
export interface MerchantSetupProjection {
  id:string;serviceId:string;responsiblePersonId:string;responsiblePersonName:string;
  status:"DRAFT"|"PENDING_LOCAL_REVIEW";version:number;legalEntityType:z.infer<typeof legalEntityTypeSchema>|null;
  sellingName:string;legalName:string;activityDescription:string;country:"US";fictionalDetailsConfirmed:boolean;
  createdAt:string;updatedAt:string;submittedAt:string|null;canEdit:boolean;canSubmit:boolean;
  requirements:SetupRequirement[];timelineHasMore:boolean;timeline:{id:string;label:string;at:string}[];
}
export interface MerchantBusinessDetailsProjection {
  merchantId:string;name:string;ownerAccess:boolean;merchantStatus:MerchantStatus;statusDetail:string;
  canStartSetup:boolean;canManageSetup:boolean;setup:MerchantSetupProjection|null;
}

export const channelPresentationSchema=z.enum(["SMS","EMAIL","INVOICE","BILL","SOCIAL","QR","WEB"]);
export const channelVisibilitySchema=z.enum(["CREATOR_PRIVATE","ASSIGNED"]);
export const channelFieldsSchema=paymentChannelFieldsSchema.extend({
  presentations:z.array(channelPresentationSchema).min(1).max(7).refine(values=>new Set(values).size===values.length,"Choose each presentation once"),
  visibility:channelVisibilitySchema,
}).strict();
export const createChannelSchema=channelFieldsSchema.extend({commandId:z.uuid()});
export const updateChannelSchema=channelFieldsSchema.extend({commandId:z.uuid(),expectedVersion:z.int().positive()});
export const cancelChannelSchema=z.object({commandId:z.uuid(),expectedVersion:z.int().positive()}).strict();
export const createTerminalSchema=z.object({commandId:z.uuid(),displayName:plain(80).min(1),intendedUse:z.enum(["SELF","OTHER"]).optional()}).strict();
export type CreateTerminalInput=z.infer<typeof createTerminalSchema>;
export const pauseMerchantSchema=z.object({commandId:z.uuid(),expectedVersion:z.int().positive(),reason:plain(300).min(1)}).strict();
export type CreateChannelInput=z.infer<typeof createChannelSchema>;
export type UpdateChannelInput=z.infer<typeof updateChannelSchema>;
export type CancelChannelInput=z.infer<typeof cancelChannelSchema>;
export type PauseMerchantInput=z.infer<typeof pauseMerchantSchema>;
export type ChannelPresentation=z.infer<typeof channelPresentationSchema>;
export interface PaymentChannel {
  id:string;serviceId:string;description:string;amount:Money;usage:"ONE_TIME"|"REUSABLE";
  expiresAt:string;status:"DRAFT"|"EXPIRED"|"CANCELED";version:number;createdAt:string;updatedAt:string;
  canEdit:boolean;canCancel:boolean;canPublish:false;prerequisites:SetupRequirement[];
  merchantUnitId:string;creatorId:string;presentations:ChannelPresentation[];visibility:z.infer<typeof channelVisibilitySchema>;canShare:boolean;
}
export interface MerchantUnitSummary {
  id:string;displayName:string;intendedUse:"SELF"|"OTHER";
  merchant:{serviceId:string;displayName:string};
  status:"ACTIVE"|"PAUSED"|"CLOSED";version:number;createdAt:string;updatedAt:string;
  canPause:boolean;canResume:boolean;canOpen:boolean;href:string;
}
export interface MerchantReadiness {
  responsibility:"OWNER_RESPONSIBLE";verification:"NOT_VERIFIED";gateway:"NOT_CONNECTED";externalMid:null;
  paymentAcceptance:false;payouts:false;commercialSpending:"NOT_ASSESSED";requirements:SetupRequirement[];
}
export interface MerchantDirectoryProjection {units:MerchantUnitSummary[];hasMore:boolean}
export interface MerchantWorkspaceProjection {
  /** Selected merchant hierarchy; never an authorization grant. */
  serviceRole:"OWNER"|"TERMINAL_USER";
  /** Current actor has explicit oversight in the responsible primary merchant. */
  ownerAccess:boolean;
  allowedPresentations:ChannelPresentation[];merchant:MerchantUnitSummary;readiness:MerchantReadiness;channels:PaymentChannel[];channelsHasMore:boolean;
  canCreateChannel:boolean;canShareChannel:boolean;canReadPeople:boolean;canInvitePeople:boolean;
  setupHref:string|null;
  timeline:{id:string;label:string;at:string}[];timelineHasMore:boolean;
}

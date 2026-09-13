import {cardSpendingSchema,topupReceiptSchema,fundingIntentSchema} from "../../shared/funding-response";
import {notificationPreferencesSchema,notificationOverviewSchema,notificationSaveResponseSchema} from "../../shared/notification-response";
export {notificationPreferencesSchema} from "../../shared/notification-response";
export {cardSpendingSchema} from "../../shared/funding-response";
import {topupCommandSchema,spendingLimitCommandSchema} from "./funding-contracts";
import {cardCheckoutReviewSchema} from "../acquiring/card-checkout-contracts";
import { z } from "zod";
import { cardControlCommandSchema, startCardRequestSchema, cardDraftCommandSchema, versionedCommandSchema, notificationCommandSchema } from "./contracts";

const id=z.uuid();
const version=z.int().positive();
const money=z.object({minor:z.string().regex(/^-?(0|[1-9][0-9]*)$/),currency:z.literal("USD"),formatted:z.string()}).strict();
const service=z.object({id,kind:z.enum(["CARDHOLDER","MERCHANT"]),primaryPersonId:id,displayName:z.string(),role:z.enum(["OWNER","CARDHOLDER"]),status:z.enum(["DRAFT","ACTIVE","SUSPENDED","CLOSED"]),version,cardholderRole:z.enum(["OWNER","CARDHOLDER","NONE"])}).strict();
export const workspaceCardSchema=z.object({id,serviceId:id,holderId:id.nullable(),holderName:z.string(),assignmentState:z.enum(["UNASSIGNED","ACCEPTED","REVOKED"]),network:z.literal("VISA"),canInvite:z.boolean(),canRevokeAssignment:z.boolean(),relationship:z.enum(["OWNER","CARDHOLDER","UNASSIGNED"]),nickname:z.string(),lastFour:z.string().regex(/^[0-9]{4}$/),format:z.enum(["VIRTUAL","PHYSICAL"]),status:z.enum(["ACTIVE","FROZEN"]),version,spending:cardSpendingSchema,available:money,canPurchase:z.boolean(),purchaseAvailability:z.object({code:z.enum(["READY","UNASSIGNED","REVOKED","OTHER_CARDHOLDER","ACCESS_RESTRICTED","SETUP_REQUIRED","FROZEN","NO_FUNDS"]),title:z.string(),description:z.string()}).strict(),canFreeze:z.boolean(),canUnfreeze:z.boolean(),freeze:z.object({primary:z.boolean(),holder:z.boolean(),reviewRequired:z.boolean(),description:z.string(),freezeLabel:z.string(),unfreezeLabel:z.string(),unfreezeDescription:z.string()}).strict(),fictional:z.literal(true)}).strict();
export const workspaceActivitySchema=z.object({id,serviceId:id,cardId:id.nullable(),title:z.string(),category:z.string(),occurredAt:z.iso.datetime(),status:z.enum(["POSTED","PENDING","DECLINED"]),direction:z.enum(["DEBIT","CREDIT"]),amount:money,description:z.string(),fictional:z.literal(true)}).strict();
export const cardPurchaseResultSchema=z.object({card:workspaceCardSchema,activity:workspaceActivitySchema,journalId:id,fictional:z.literal(true)}).strict();
export const cardRequestProjectionSchema=z.object({id,serviceId:id,holderId:id.nullable(),holderName:z.string(),nickname:z.string(),format:z.enum(["VIRTUAL","PHYSICAL"]),currency:z.literal("USD"),allowance:money,status:z.enum(["DRAFT","BLOCKED","CANCELED","ISSUED"]),issuedCardId:id.nullable(),canSubmit:z.boolean(),version,updatedAt:z.iso.datetime(),prerequisites:z.array(z.object({code:z.string(),title:z.string(),detail:z.string()}).strict())}).strict();
export const workspaceProjectionSchema=z.object({
  customerService:z.object({id,displayName:z.string(),primaryName:z.string()}).strict().optional(),
  cardholderRole:z.enum(["OWNER","CARDHOLDER","NONE"]),service,member:z.object({id,displayName:z.string()}).strict(),services:z.array(service),fictional:z.literal(true),notice:z.string(),
  capabilities:z.array(z.object({action:z.string(),allowed:z.boolean(),reasonCode:z.string(),reason:z.string()}).strict()),
  cards:z.array(workspaceCardSchema),cardRequests:z.array(cardRequestProjectionSchema),
  cardholderOptions:z.array(z.object({id,displayName:z.string(),description:z.string()}).strict()),activity:z.array(workspaceActivitySchema),
  people:z.array(z.object({id,displayName:z.string(),role:z.string(),state:z.enum(["ACCEPTED","REVOKED"]),permissions:z.array(z.string()),isCurrentPerson:z.boolean()}).strict()),
  preferences:notificationPreferencesSchema,
}).strict();

const prefix="/api/v1/cardholder-services/{serviceId}";
const serviceProfile=z.object({id,primaryPersonId:id,primaryName:z.string(),displayName:z.string(),relationship:z.enum(["OWNER","CARDHOLDER"]),canAddCard:z.boolean(),canInvite:z.boolean()}).strict();
export const cardholderDashboardQuerySchema=z.object({cardScope:z.enum(["ALL","OWN","MANAGED"]).optional(),cardSearch:z.string().trim().max(100).optional(),page:z.string().regex(/^(0|[1-9][0-9]{0,4})$/).optional(),requestPage:z.string().regex(/^(0|[1-9][0-9]{0,4})$/).optional(),requestStatus:z.enum(["ALL","DRAFT","BLOCKED","ISSUED","CANCELED"]).optional(),requestSearch:z.string().trim().max(100).optional()}).strict();
export const cardholderDashboardSchema=z.object({person:z.object({id,displayName:z.string()}).strict(),canCreatePrimary:z.boolean(),profiles:z.array(serviceProfile),primaryService:serviceProfile.nullable(),accountOverview:z.object({serviceId:id,cardCount:z.int().nonnegative(),ownCardCount:z.int().nonnegative(),otherCardCount:z.int().nonnegative(),unassignedCardCount:z.int().nonnegative(),activity:z.array(workspaceActivitySchema.extend({cardNickname:z.string(),lastFour:z.string(),holderName:z.string()}))}).strict().nullable(),cards:z.array(workspaceCardSchema.extend({serviceId:id,primaryName:z.string(),accessRole:z.enum(["OWNER","CARDHOLDER"]),canManageAccess:z.boolean()})),cardCount:z.int().nonnegative(),ownCardCount:z.int().nonnegative(),managedCardCount:z.int().nonnegative(),cardMatchCount:z.int().nonnegative(),cardScope:z.enum(["ALL","OWN","MANAGED"]),cardSearch:z.string(),cardsPage:z.int().nonnegative(),cardsHasMore:z.boolean(),cardholders:z.array(z.object({id,displayName:z.string(),serviceId:id,cardCount:z.int().nonnegative().nullable(),canAddCard:z.boolean()}).strict()),cardholdersHasMore:z.boolean(),activity:z.array(workspaceActivitySchema.extend({cardNickname:z.string(),lastFour:z.string(),holderName:z.string()})),requests:z.array(cardRequestProjectionSchema),requestPage:z.int().nonnegative(),requestsHasMore:z.boolean(),requestCount:z.int().nonnegative(),unfinishedRequestCount:z.int().nonnegative(),requestStatus:z.enum(["ALL","DRAFT","BLOCKED","ISSUED","CANCELED"]),requestSearch:z.string(),fictional:z.literal(true)}).strict();
const fundsSchema=z.object({serviceId:id,moneyAccountId:id,serviceName:z.string(),available:money,source:z.literal("SANDBOX_BANK"),sourceLabel:z.string(),topups:z.array(topupReceiptSchema),page:z.int().min(0),hasMore:z.boolean(),cards:z.array(z.object({id,name:z.string(),holderName:z.string(),spending:cardSpendingSchema}).strict())}).strict();
const checkoutReviewSchema=cardCheckoutReviewSchema;
export const cardholderFundsQuerySchema=z.object({page:z.string().regex(/^(0|[1-9][0-9]{0,4})$/).optional()}).strict();
export const workspaceOperations=[
 {path:`${prefix}/funds`,method:"get",query:cardholderFundsQuerySchema,response:fundsSchema,status:200,authenticated:true},
 {path:`${prefix}/funds/top-ups/{topupId}`,method:"get",response:topupReceiptSchema,status:200,authenticated:true},
 {path:`${prefix}/funds/intents`,method:"post",request:topupCommandSchema,response:fundingIntentSchema,status:200,authenticated:true},
 {path:`${prefix}/funds/intents/{intentId}`,method:"get",response:fundingIntentSchema,status:200,authenticated:true},
 {path:`${prefix}/funds/intents/{intentId}`,method:"post",request:z.object({}).strict(),response:topupReceiptSchema,status:200,authenticated:true},
 {path:`${prefix}/cards/{cardId}/spending-limit`,method:"get",response:cardSpendingSchema,status:200,authenticated:true},
 {path:`${prefix}/cards/{cardId}/spending-limit`,method:"put",request:spendingLimitCommandSchema,response:cardSpendingSchema,status:200,authenticated:true},
 {path:"/api/v1/checkout/{publicationId}/card/{attemptId}",method:"get",response:checkoutReviewSchema,status:200,authenticated:true},
 {path:"/api/v1/checkout/{publicationId}/card/{attemptId}",method:"post",request:z.object({}).strict(),response:checkoutReviewSchema,status:200,authenticated:true},
  {path:"/api/v1/cardholder-services",method:"get",query:cardholderDashboardQuerySchema,response:cardholderDashboardSchema,status:200,authenticated:true},
  {path:`${prefix}/workspace`,method:"get",response:workspaceProjectionSchema,status:200,authenticated:true},
  {path:`${prefix}/cards/{cardId}/recipient/revoke`,method:"post",request:versionedCommandSchema,response:workspaceCardSchema,status:200,authenticated:true},
  {path:`${prefix}/cards/{cardId}/control`,method:"post",request:cardControlCommandSchema,response:workspaceCardSchema,status:200,authenticated:true},
  {path:`${prefix}/card-requests`,method:"post",request:startCardRequestSchema,response:cardRequestProjectionSchema,status:200,authenticated:true},
  {path:`${prefix}/card-requests/{requestId}`,method:"patch",request:cardDraftCommandSchema,response:cardRequestProjectionSchema,status:200,authenticated:true},
  {path:`${prefix}/card-requests/{requestId}/submit`,method:"post",request:versionedCommandSchema,response:cardRequestProjectionSchema,status:200,authenticated:true},
  {path:`${prefix}/card-requests/{requestId}/cancel`,method:"post",request:versionedCommandSchema,response:cardRequestProjectionSchema,status:200,authenticated:true},
  {path:`${prefix}/preferences/notifications`,method:"get",response:notificationOverviewSchema,status:200,authenticated:true},
  {path:`${prefix}/preferences/notifications`,method:"put",request:notificationCommandSchema,response:notificationSaveResponseSchema,status:200,authenticated:true},
  {path:`${prefix}/activity`,method:"get",response:z.array(workspaceActivitySchema),status:200,authenticated:true},
  {path:`${prefix}/activity/{activityId}`,method:"get",response:workspaceActivitySchema,status:200,authenticated:true},
] as const;

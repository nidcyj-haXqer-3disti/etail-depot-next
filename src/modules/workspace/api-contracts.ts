import { z } from "zod";
import { cardControlCommandSchema, cardPurchaseCommandSchema, startCardRequestSchema, cardDraftCommandSchema, versionedCommandSchema, notificationCommandSchema } from "./contracts";

const id=z.uuid();
const version=z.int().positive();
const money=z.object({minor:z.string().regex(/^-?(0|[1-9][0-9]*)$/),currency:z.literal("USD"),formatted:z.string()}).strict();
const service=z.object({id,kind:z.enum(["CARDHOLDER","MERCHANT"]),primaryPersonId:id,displayName:z.string(),role:z.enum(["PRIMARY","SECONDARY"]),status:z.enum(["DRAFT","ACTIVE","SUSPENDED","CLOSED"]),version,cardholderRole:z.enum(["PRIMARY","SECONDARY","NONE"])}).strict();
export const workspaceCardSchema=z.object({id,serviceId:id,holderId:id,holderName:z.string(),relationship:z.enum(["PRIMARY","SECONDARY"]),nickname:z.string(),lastFour:z.string().regex(/^[0-9]{4}$/),format:z.enum(["VIRTUAL","PHYSICAL"]),status:z.enum(["ACTIVE","FROZEN"]),version,limit:money,available:money,canPurchase:z.boolean(),canFreeze:z.boolean(),canUnfreeze:z.boolean(),fictional:z.literal(true)}).strict();
export const workspaceActivitySchema=z.object({id,serviceId:id,cardId:id.nullable(),title:z.string(),category:z.string(),occurredAt:z.iso.datetime(),status:z.enum(["POSTED","PENDING","DECLINED"]),direction:z.enum(["DEBIT","CREDIT"]),amount:money,description:z.string(),fictional:z.literal(true)}).strict();
export const cardPurchaseResultSchema=z.object({card:workspaceCardSchema,activity:workspaceActivitySchema,journalId:id,fictional:z.literal(true)}).strict();
export const cardRequestProjectionSchema=z.object({id,serviceId:id,holderId:id,holderName:z.string(),nickname:z.string(),format:z.enum(["VIRTUAL","PHYSICAL"]),requestedLimitMinor:z.string().regex(/^(0|[1-9][0-9]*)$/),currency:z.literal("USD"),status:z.enum(["DRAFT","BLOCKED","CANCELED","ISSUED"]),issuedCardId:id.nullable(),canSubmit:z.boolean(),version,updatedAt:z.iso.datetime(),prerequisites:z.array(z.object({code:z.string(),title:z.string(),detail:z.string()}).strict())}).strict();
export const notificationPreferencesSchema=z.object({serviceActivity:z.boolean(),cardControls:z.boolean(),caseUpdates:z.boolean(),version,delivery:z.literal("SAVED_ONLY")}).strict();
export const workspaceProjectionSchema=z.object({
  customerService:z.object({id,displayName:z.string(),primaryName:z.string()}).strict().optional(),
  cardholderRole:z.enum(["PRIMARY","SECONDARY","NONE"]),service,member:z.object({id,displayName:z.string()}).strict(),services:z.array(service),fictional:z.literal(true),notice:z.string(),
  capabilities:z.array(z.object({action:z.string(),allowed:z.boolean(),reasonCode:z.string(),reason:z.string()}).strict()),
  cards:z.array(workspaceCardSchema),cardRequests:z.array(cardRequestProjectionSchema),
  cardholderOptions:z.array(z.object({id,displayName:z.string(),description:z.string()}).strict()),activity:z.array(workspaceActivitySchema),
  people:z.array(z.object({id,displayName:z.string(),role:z.string(),state:z.enum(["ACCEPTED","REVOKED"]),permissions:z.array(z.string()),isCurrentPerson:z.boolean()}).strict()),
  preferences:notificationPreferencesSchema,
}).strict();

const prefix="/api/v1/cardholder-services/{serviceId}";
const serviceProfile=z.object({id,primaryPersonId:id,primaryName:z.string(),displayName:z.string(),relationship:z.enum(["PRIMARY","SECONDARY"]),canAddCard:z.boolean(),canInvite:z.boolean()}).strict();
export const cardholderDashboardQuerySchema=z.object({page:z.string().regex(/^(0|[1-9][0-9]{0,4})$/).optional()}).strict();
export const cardholderDashboardSchema=z.object({person:z.object({id,displayName:z.string()}).strict(),profiles:z.array(serviceProfile),primaryService:serviceProfile.nullable(),cards:z.array(workspaceCardSchema.extend({serviceId:id,primaryName:z.string(),accessRole:z.enum(["PRIMARY","SECONDARY"]),canManageAccess:z.boolean()})),cardCount:z.int().nonnegative(),cardsPage:z.int().nonnegative(),cardsHasMore:z.boolean(),activity:z.array(workspaceActivitySchema.extend({cardNickname:z.string(),lastFour:z.string(),holderName:z.string()})),requests:z.array(cardRequestProjectionSchema),fictional:z.literal(true)}).strict();
export const workspaceOperations=[
  {path:"/api/v1/cardholder-services",method:"get",query:cardholderDashboardQuerySchema,response:cardholderDashboardSchema,status:200,authenticated:true},
  {path:`${prefix}/workspace`,method:"get",response:workspaceProjectionSchema,status:200,authenticated:true},
  {path:`${prefix}/cards/{cardId}/control`,method:"post",request:cardControlCommandSchema,response:workspaceCardSchema,status:200,authenticated:true},
  {path:`${prefix}/cards/{cardId}/purchase`,method:"post",request:cardPurchaseCommandSchema,response:cardPurchaseResultSchema,status:200,authenticated:true},
  {path:`${prefix}/card-requests`,method:"post",request:startCardRequestSchema,response:cardRequestProjectionSchema,status:200,authenticated:true},
  {path:`${prefix}/card-requests/{requestId}`,method:"patch",request:cardDraftCommandSchema,response:cardRequestProjectionSchema,status:200,authenticated:true},
  {path:`${prefix}/card-requests/{requestId}/submit`,method:"post",request:versionedCommandSchema,response:cardRequestProjectionSchema,status:200,authenticated:true},
  {path:`${prefix}/card-requests/{requestId}/cancel`,method:"post",request:versionedCommandSchema,response:cardRequestProjectionSchema,status:200,authenticated:true},
  {path:`${prefix}/preferences/notifications`,method:"put",request:notificationCommandSchema,response:notificationPreferencesSchema,status:200,authenticated:true},
  {path:`${prefix}/activity`,method:"get",response:z.array(workspaceActivitySchema),status:200,authenticated:true},
  {path:`${prefix}/activity/{activityId}`,method:"get",response:workspaceActivitySchema,status:200,authenticated:true},
] as const;

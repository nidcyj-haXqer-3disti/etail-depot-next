import { z } from "zod";

export const supportTopicSchema = z.enum(["SERVICE","ACCESS","CARD","TRANSACTION"]);
export const supportStatusSchema = z.enum(["OPEN","WITHDRAWN","RESOLVED"]);
const commandId = z.uuid();
const expectedVersion = z.number().int().positive().max(2147483646);
const safeText = (max:number) => z.string().trim().min(1).max(max).refine(value => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value));
export const createSupportCaseSchema = z.object({commandId,topic:supportTopicSchema,subject:safeText(100),message:safeText(2000),transactionId:z.uuid().nullable().default(null)}).strict();
export const addSupportMessageSchema = z.object({commandId,expectedVersion,message:safeText(2000)}).strict();
export const withdrawSupportCaseSchema = z.object({commandId,expectedVersion,reason:safeText(500)}).strict();
export const supportCaseQuerySchema = z.object({q:z.string().trim().max(100).default(""),status:supportStatusSchema.optional(),cursor:z.uuid().optional()}).strict();
export type SupportTopic = z.infer<typeof supportTopicSchema>;
export type CreateSupportCaseCommand = z.infer<typeof createSupportCaseSchema>;
export type AddSupportMessageCommand = z.infer<typeof addSupportMessageSchema>;
export type WithdrawSupportCaseCommand = z.infer<typeof withdrawSupportCaseSchema>;
export type SupportCaseQuery = z.infer<typeof supportCaseQuerySchema>;
export interface SupportCaseSummary {id:string;serviceId:string;reference:string;topic:SupportTopic;subject:string;status:"OPEN"|"WITHDRAWN"|"RESOLVED";version:number;createdAt:string;updatedAt:string;canUpdate:boolean;nextActor:"SUPPORT"|"NONE";delivery:"SANDBOX_SUPPORT";privacy:"CUSTOMER_AND_ASSIGNED_SUPPORT"}
export interface SupportCaseDetail extends SupportCaseSummary {transaction:{id:string;title:string}|null;transactionUnavailable:boolean;messages:{id:string;kind:"OPENED"|"MESSAGE"|"WITHDRAWN"|"RESOLVED";body:string;sequence:number;createdAt:string;author:"YOU"|"SUPPORT"}[]}
export interface SupportCaseList {cases:SupportCaseSummary[];nextCursor:string|null;canCreate:boolean}

import {z} from "zod";
const id=z.uuid();
const money=z.object({minor:z.string().regex(/^-?(0|[1-9][0-9]*)$/),currency:z.literal("USD"),formatted:z.string()}).strict();
export const moneyTopupReceiptSchema=z.object({id,moneyAccountId:id,amount:money,source:z.literal("SANDBOX_BANK"),sourceLabel:z.string(),status:z.literal("COMPLETED"),createdAt:z.iso.datetime(),reference:z.string()}).strict();
export const moneyFundingIntentSchema=z.object({id,moneyAccountId:id,receiptId:id,amount:money,sourceLabel:z.string(),createdAt:z.iso.datetime(),receipt:moneyTopupReceiptSchema.nullable()}).strict().refine(intent=>!intent.receipt||(intent.receipt.id===intent.receiptId&&intent.receipt.moneyAccountId===intent.moneyAccountId&&intent.receipt.amount.minor===intent.amount.minor),{message:"The receipt must match its saved funding review",path:["receipt"]});
export const moneyWithdrawalReceiptSchema=z.object({id,intentId:id,moneyAccountId:id,amount:money,destinationLabel:z.string(),status:z.enum(["PENDING","COMPLETED","FAILED"]),createdAt:z.iso.datetime(),completedAt:z.iso.datetime().nullable(),reference:z.string()}).strict().refine(receipt=>receipt.status==="PENDING"?receipt.completedAt===null:receipt.completedAt!==null&&Date.parse(receipt.completedAt)>=Date.parse(receipt.createdAt),{message:"Withdrawal timing must match its processing status",path:["completedAt"]});
export const moneyWithdrawalIntentSchema=z.object({id,moneyAccountId:id,amount:money,destinationLabel:z.string(),createdAt:z.iso.datetime(),receipt:moneyWithdrawalReceiptSchema.nullable()}).strict().refine(intent=>!intent.receipt||(intent.receipt.intentId===intent.id&&intent.receipt.moneyAccountId===intent.moneyAccountId&&intent.receipt.amount.minor===intent.amount.minor),{message:"Withdrawal receipt must match its saved review",path:["receipt"]});
export const ownedMoneyAccountSchema=z.object({id,displayName:z.string(),serviceKind:z.enum(["CARDHOLDER","MERCHANT"]),currency:z.literal("USD"),status:z.enum(["ACTIVE","SUSPENDED","CLOSED"]),version:z.int().positive(),services:z.array(z.object({id,kind:z.enum(["CARDHOLDER","MERCHANT"]),displayName:z.string()}).strict()).max(1),available:money,pendingWithdrawals:money}).strict();
export const moneyOverviewSchema=ownedMoneyAccountSchema.extend({history:z.array(z.object({id,kind:z.string(),label:z.string(),amount:money,createdAt:z.iso.datetime(),referenceId:id,href:z.string().nullable()}).strict()),withdrawals:z.array(moneyWithdrawalReceiptSchema).max(50),withdrawalsHasMore:z.boolean(),page:z.int().nonnegative(),hasMore:z.boolean(),canAddMoney:z.boolean(),canWithdraw:z.boolean()}).superRefine((account,ctx)=>{
 if(account.serviceKind==="MERCHANT"&&account.canAddMoney)ctx.addIssue({code:"custom",path:["canAddMoney"],message:"Merchant balances are funded by received payments"});
 const withdrawalIds=new Set<string>();
 for(const [index,row] of account.withdrawals.entries()){
  if(row.moneyAccountId!==account.id||withdrawalIds.has(row.id))ctx.addIssue({code:"custom",path:["withdrawals",index],message:"Each payout must belong to this exact account and appear once"});
  withdrawalIds.add(row.id);
 }
 for(const [index,row] of account.history.entries()){
  if(row.href===null)continue;
  const task=row.kind==="MONEY_FUNDING"?"add":["MONEY_WITHDRAWAL_RESERVE","MONEY_WITHDRAWAL_RELEASE"].includes(row.kind)?"withdraw":null;
  const prefix=`/money-accounts/${account.id}/${task==="add"?"add-money":"withdraw"}?review=`;
  if(!task||!row.href.startsWith(prefix)||!z.uuid().safeParse(row.href.slice(prefix.length)).success)ctx.addIssue({code:"custom",path:["history",index,"href"],message:"Receipt link must refer to this account and saved review"});
 }
});

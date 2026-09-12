import {z} from "zod";
import {moneyCommandSchema,processMoneyWithdrawalSchema} from "./contracts";
export const moneyHistoryQuerySchema=z.object({page:z.string().regex(/^(0|[1-9][0-9]{0,4})$/).optional()}).strict();
import {moneyTopupReceiptSchema,moneyFundingIntentSchema,moneyWithdrawalReceiptSchema,moneyWithdrawalIntentSchema,ownedMoneyAccountSchema,moneyOverviewSchema} from "../../shared/money-response";
export {moneyTopupReceiptSchema,moneyFundingIntentSchema,moneyWithdrawalReceiptSchema,moneyWithdrawalIntentSchema,ownedMoneyAccountSchema,moneyOverviewSchema} from "../../shared/money-response";
const prefix="/api/v1/money-accounts/{moneyAccountId}";
const empty=z.object({}).strict();
export const moneyOperations=[
 {path:"/api/v1/money-accounts",method:"get",response:z.array(ownedMoneyAccountSchema),status:200,authenticated:true},
 {path:prefix,method:"get",query:moneyHistoryQuerySchema,response:moneyOverviewSchema,status:200,authenticated:true},
 {path:`${prefix}/funding/intents`,method:"post",request:moneyCommandSchema,response:moneyFundingIntentSchema,status:200,authenticated:true},
 {path:`${prefix}/funding/intents/{intentId}`,method:"get",response:moneyFundingIntentSchema,status:200,authenticated:true},
 {path:`${prefix}/funding/intents/{intentId}`,method:"post",request:empty,response:moneyTopupReceiptSchema,status:200,authenticated:true},
 {path:`${prefix}/withdrawals/intents`,method:"post",request:moneyCommandSchema,response:moneyWithdrawalIntentSchema,status:200,authenticated:true},
 {path:`${prefix}/withdrawals/intents/{intentId}`,method:"get",response:moneyWithdrawalIntentSchema,status:200,authenticated:true},
 {path:`${prefix}/withdrawals/intents/{intentId}`,method:"post",request:empty,response:moneyWithdrawalReceiptSchema,status:200,authenticated:true},
 {path:"/api/v1/operations/money-withdrawals/{withdrawalId}",method:"post",request:processMoneyWithdrawalSchema,response:moneyWithdrawalReceiptSchema,status:200,authenticated:true},
] as const;

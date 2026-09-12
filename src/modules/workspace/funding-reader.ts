import {and,eq,gte,lt,sql} from "drizzle-orm";
import {cards} from "../../platform/database/schema";
import {getBalance,type LedgerTransaction} from "../ledger/service";
import {ledgerEntries,ledgerJournals} from "../ledger/schema";
import {cardholderSpendingLimits} from "./funding-schema";

/** Financial primitives only. Callers must authorize the service/person before reading. */
export async function readPersonSpending(tx:LedgerTransaction,serviceId:string,personId:string,now:Date){
 const start=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),1)),end=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()+1,1));
 const [limit]=await tx.select().from(cardholderSpendingLimits).where(and(eq(cardholderSpendingLimits.serviceId,serviceId),eq(cardholderSpendingLimits.personId,personId)));
 const [usage]=await tx.select({total:sql<string>`coalesce(sum(${ledgerEntries.deltaMinor}),0)::text`}).from(ledgerEntries)
  .innerJoin(ledgerJournals,eq(ledgerJournals.id,ledgerEntries.journalId)).innerJoin(cards,and(eq(cards.id,ledgerEntries.cardId),eq(cards.serviceId,ledgerEntries.serviceId)))
  .where(and(eq(ledgerEntries.serviceId,serviceId),eq(cards.holderId,personId),eq(ledgerEntries.bucket,"CARD_SPENT"),eq(ledgerJournals.kind,"CARD_PURCHASE"),gte(ledgerJournals.createdAt,start),lt(ledgerJournals.createdAt,end),sql`${ledgerEntries.deltaMinor}>0`));
 const spent=BigInt(usage!.total),monthlyLimit=limit?.monthlyLimitMinor??0n,remaining=monthlyLimit>spent?monthlyLimit-spent:0n;
 const group=await getBalance(tx,{serviceId,bucket:"GROUP_AVAILABLE"});
 return {personId,monthlyLimit,spent,remaining,available:group<remaining?group:remaining,version:limit?.version??0,start,end};
}

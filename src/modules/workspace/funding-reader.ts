import {and,eq,sql} from "drizzle-orm";
import {cards} from "../../platform/database/schema";
import type {LedgerTransaction} from "../ledger/service";
import {readServiceMoneyAvailable} from "../money/service";
import {ledgerEntries,ledgerJournals} from "../ledger/schema";
import {cardSpendingLimits} from "./funding-schema";

/** Financial primitives only. Callers must authorize the service/person before reading. */
export async function readCardSpending(tx:LedgerTransaction,serviceId:string,cardId:string){
 const [limit]=await tx.select().from(cardSpendingLimits).where(and(eq(cardSpendingLimits.serviceId,serviceId),eq(cardSpendingLimits.cardId,cardId)));
 const [usage]=await tx.select({total:sql<string>`coalesce(sum(${ledgerEntries.deltaMinor}),0)::text`}).from(ledgerEntries)
  .innerJoin(ledgerJournals,eq(ledgerJournals.id,ledgerEntries.journalId)).innerJoin(cards,and(eq(cards.id,ledgerEntries.cardId),eq(cards.serviceId,ledgerEntries.serviceId)))
  .where(and(eq(ledgerEntries.serviceId,serviceId),eq(cards.id,cardId),eq(ledgerEntries.bucket,"CARD_SPENT"),eq(ledgerJournals.kind,"CARD_PURCHASE"),sql`${ledgerEntries.deltaMinor}>0`));
 const spent=BigInt(usage!.total),allowance=limit?.allowanceMinor??0n,remaining=allowance>spent?allowance-spent:0n;
 const group=await readServiceMoneyAvailable(tx,serviceId);
 return {cardId,reviewRequired:limit?.reviewRequired??false,allowance,spent,remaining,available:group<remaining?group:remaining,version:limit?.version??0};
}

import {getVerifiedEmails} from "../identity/contact-service";
import type {ScopedTransaction} from "./scope";
import type {serviceInvitations} from "./schema";
/** A share link is a locator. The current authenticated identity must prove the intended contact. */
export async function isInvitationRecipient(tx:ScopedTransaction,row:typeof serviceInvitations.$inferSelect,personId:string){
 if(row.recipientId)return row.recipientId===personId;
 return !!row.recipientEmail&&(await getVerifiedEmails(tx,personId)).includes(row.recipientEmail);
}

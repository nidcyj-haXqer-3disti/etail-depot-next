import {customerHref} from "../../shared/customer-routes";
import {getInvitationForPerson} from "./service";
import type {ResourceInvitationProjection} from "../../shared/resource-invitation-response";
/** Public UUID locates an invitation; the canonical reader proves recipient access first. */
export async function getResourceInvitation(personId:string,id:string):Promise<ResourceInvitationProjection>{
 const row=await getInvitationForPerson(personId,id);
 if(row.targetKind==="MERCHANT_TERMINAL")return {id:row.id,targetKind:row.targetKind,targetName:row.terminalName,inviterName:row.inviterName,status:row.status,version:row.version,expiresAt:row.expiresAt,canRespond:row.canRespond,hasAccess:row.hasMerchantAccess,href:customerHref(`/merchants/${row.terminalId}`,{tab:"payments"})};
 if(row.targetKind==="CARD")return {id:row.id,targetKind:row.targetKind,targetName:row.cardName,inviterName:row.inviterName,status:row.status,version:row.version,expiresAt:row.expiresAt,canRespond:row.canRespond,hasAccess:row.hasServiceAccess,href:customerHref("/cardholder-services",{view:"cards",card:row.cardId}),allowance:{amount:row.allowance.amount,currency:"USD"}};
 throw new Error("Historical invitations are available in the invitations inbox.");
}

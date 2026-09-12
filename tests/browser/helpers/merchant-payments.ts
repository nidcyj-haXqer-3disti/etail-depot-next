import {randomUUID} from "node:crypto";
import {expect,type Page} from "@playwright/test";
import {getDb} from "../../../src/platform/database/client";
import {operatorServiceAccess} from "../../../src/modules/operations/schema";
import {createChannel} from "../../../src/modules/acquiring/service";
import {setChannelActivation} from "../../../src/modules/acquiring/operations-service";
import {publishGuestChannel} from "../../../src/modules/acquiring/guest-service";
import {cardCheckoutReviewSchema} from "../../../src/modules/acquiring/card-checkout-contracts";
import {merchantOperationsProjectionSchema} from "../../../src/modules/acquiring/operations-api-contracts";
import {paymentInput} from "../../helpers/acquiring";
import {cardPerson} from "../../helpers/cardholder";
import {freshPrepaidCard,freshPublishedPayment,openSavedCardReview,signInPerson} from "./prepaid";

export type PublishedMerchant=Awaited<ReturnType<typeof freshPublishedPayment>>;
export type PrepaidPayer=Awaited<ReturnType<typeof freshPrepaidCard>>;

export async function merchantOperations(page:Page,merchantId:string){
 const response=await page.request.get(`/api/v1/merchants/${merchantId}/operations`);
 expect(response.status()).toBe(200);
 return merchantOperationsProjectionSchema.parse(await response.json());
}

export async function additionalPublishedPayment(m:PublishedMerchant,amountMinor:string){
 const channel=await createChannel(m.operator.personId,m.unit.id,{...paymentInput(),description:`Additional order ${randomUUID().slice(0,8)}`,amountMinor,usage:"ONE_TIME",presentations:["WEB"],visibility:"CREATOR_PRIVATE"});
 await setChannelActivation(m.operator.personId,m.unit.id,channel.id,{commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:channel.version,active:true});
 const publication=(await publishGuestChannel(m.operator.personId,m.unit.id,channel.id,{commandId:randomUUID(),expectedChannelVersion:channel.version})).publication;
 if(!publication)throw new Error("Expected the saved publication");
 return {...m,channel,publication};
}

export async function payPublishedMerchant(page:Page,m:PublishedMerchant,payer:PrepaidPayer){
 await signInPerson(page,payer.primary.personId);
 const saved=await openSavedCardReview(page,m.publication.id,payer.card.id);
 await page.getByRole("button",{name:`Pay ${m.publication.amount.formatted}`,exact:true}).click();
 await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();
 const response=await page.request.get(saved.confirmPath);
 expect(response.status()).toBe(200);
 const review=cardCheckoutReviewSchema.parse(await response.json());
 if(!review.receipt)throw new Error("Expected the authoritative payment receipt");
 await signInPerson(page,m.merchant.personId);
 const payment=(await merchantOperations(page,m.unit.id)).payments.find(row=>row.id===review.receipt!.paymentId);
 if(!payment)throw new Error("The merchant must read the exact connected payment");
 return {...saved,review,payment};
}

export async function freshConnectedPayment(page:Page,amountMinor="1250"){
 const merchant=await freshPublishedPayment(amountMinor),payer=await freshPrepaidCard("10000","10000");
 const paid=await payPublishedMerchant(page,merchant,payer);
 return {merchant,payer,...paid};
}

export async function explicitDepositOperator(serviceId:string,canProcessDeposits=true){
 const personId=await cardPerson(`Deposit operator ${randomUUID().slice(0,8)}`);
 await getDb().insert(operatorServiceAccess).values({serviceId,personId,state:"ACCEPTED",canRespond:true,canProcessDeposits});
 return personId;
}

import {z} from "zod";
import type {Money} from "../workspace/contracts";
export const prepareCardCheckoutSchema=z.object({commandId:z.uuid(),cardServiceId:z.uuid(),cardId:z.uuid(),expectedCardVersion:z.number().int().positive()}).strict();
export type PrepareCardCheckout=z.infer<typeof prepareCardCheckoutSchema>;
export interface CardCheckoutReview {id:string;publicationId:string;merchantName:string;description:string;amount:Money;cardName:string;lastFour:string;createdAt:string;receipt:{paymentId:string;reference:string;paidAt:string;refundedAt:string|null}|null}

export {cardCheckoutReviewSchema} from "../../shared/card-checkout-response";

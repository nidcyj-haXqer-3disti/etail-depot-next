"use client";
import Link from "next/link";
import {useRef,useState} from "react";
import type {CardCheckoutReview} from "@/modules/acquiring/card-checkout-contracts";
import {cardCheckoutReviewSchema} from "@/shared/card-checkout-response";
import {Button,Feedback} from "./workspace/primitives";
import "./guest-checkout.css";
const errors:Record<string,string>={
 SPENDING_LIMIT_EXCEEDED:"This payment exceeds what is left of this card’s total spending limit. Ask the account owner to review the limit.",
 INSUFFICIENT_PRACTICE_FUNDS:"There is not enough money in the card balance. Ask the account owner to add money.",
 CARD_FROZEN:"This card is frozen. Unfreeze it before paying.",
 STALE_VERSION:"Your card has changed since this review. Open the current payment request to continue.",
 CHANNEL_NOT_READY:"This payment link is no longer accepting payments. Ask the business for a current link.",
};
/** Recovery and receipts for already-saved internal card payments; no new checkout preparation. */
export function CardCheckout({review:initial}:{review:CardCheckoutReview}){
 const flight=useRef(false),[review,setReview]=useState(initial),[busy,setBusy]=useState(false),[error,setError]=useState(""),[uncertain,setUncertain]=useState(false),[accessDenied,setAccessDenied]=useState(false);
 async function submit(){
  if(flight.current)return;const recovering=uncertain;flight.current=true;setBusy(true);setError("");setUncertain(true);
  try{
   const response=await fetch(`/api/v1/checkout/${initial.publicationId}/card/${initial.id}`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:"{}",signal:AbortSignal.timeout(30_000)});
   if(!response.ok){const data=await response.json().catch(()=>null);if([401,403,404].includes(response.status))setAccessDenied(true);if(response.status<500&&!recovering)setUncertain(false);throw new Error(errors[data?.error?.code]??(response.status>=500||recovering?"We couldn’t confirm the result. Check this saved request again to find out whether it went through.":"You cannot use this checkout with your current access. Your original request is still saved."));}
   const saved=cardCheckoutReviewSchema.parse(await response.json());if(saved.id!==initial.id||saved.publicationId!==initial.publicationId||saved.amount.minor!==initial.amount.minor||!saved.receipt)throw new Error("We couldn’t confirm the result. Check this saved request again.");setReview(saved);setUncertain(false);setAccessDenied(false);
  }catch(failure){setError(failure instanceof Error&&failure.name==="Error"?failure.message:"We couldn’t confirm this result. Check the request again.");}finally{flight.current=false;setBusy(false);}
 }
 return <div className="gc-page"><section className="gc-card"><p className="gc-eyebrow">{review.merchantName}</p><h1>{accessDenied?"Card access unavailable":review.receipt?review.receipt.refundedAt?"Payment refunded":"Payment complete":"Review your payment"}</h1><p>{review.description}</p><p className="gc-amount">{review.amount.formatted}</p>
  {accessDenied?<><p>Your private card and receipt details are hidden. Restore access, then retry the original request to check its result.</p><Button busy={busy} onClick={submit}>Check request again</Button></>:<><p>{review.cardName} · Ending {review.lastFour}</p>{review.receipt?<><p>Reference {review.receipt.reference}</p><p>{review.receipt.refundedAt?"The refund has returned to the original card balance.":"Paid from the card balance linked to this card."}</p><Link className="consumer-button consumer-button-primary" href="/cardholder-services/activity">View card activity</Link>{!review.receipt.refundedAt&&<Link className="consumer-button consumer-button-secondary" href={`/payments/${review.receipt.paymentId}/dispute`}>Report a problem</Link>}</>:<><p>This saved payment comes from the card balance linked to this card and counts toward the card’s total spending limit.</p><Button busy={busy} onClick={submit}>{uncertain?"Check payment again":`Pay ${review.amount.formatted}`}</Button></>}</>}
  <Feedback kind="error" message={error}/>{error&&!busy&&!uncertain&&!accessDenied&&<Link className="gc-back" href={`/checkout/${review.publicationId}`}>Open current payment request</Link>}{uncertain&&<p className="gc-note">The result is not yet confirmed. Retrying checks this saved request; it does not create a second payment.</p>}
 </section></div>;
}

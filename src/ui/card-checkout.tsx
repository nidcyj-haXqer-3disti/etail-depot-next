"use client";
import Link from "next/link";
import {useRef,useState,useTransition} from "react";
import {useRouter} from "next/navigation";
import type {PublicGuestRequest} from "@/modules/acquiring/guest-contracts";
import type {CardCheckoutReview,PrepareCardCheckout} from "@/modules/acquiring/card-checkout-contracts";
import {cardCheckoutReviewSchema} from "@/shared/card-checkout-response";
import type {DashboardCard} from "@/modules/workspace/dashboard-contracts";
import {Button,Feedback} from "./workspace/primitives";
import "./guest-checkout.css";

const errors:Record<string,string> = {
  SPENDING_LIMIT_EXCEEDED:"This payment exceeds your remaining monthly limit. Ask your primary to review your limit.",
  INSUFFICIENT_PRACTICE_FUNDS:"Your card group needs more funds. Ask your primary to add money.",
  CARD_FROZEN:"This card is frozen. Unfreeze it before paying.",
  STALE_VERSION:"Your card has changed since this review. Reload your cards before continuing.",
  CHANNEL_NOT_READY:"This payment link is no longer accepting payments. Contact the merchant for a current link.",
};
export function CardCheckout({offer,cards,hasMore,page,search,review:initial}:{offer:PublicGuestRequest;cards:DashboardCard[];hasMore:boolean;page:number;search:string;review:CardCheckoutReview|null}) {
  const router=useRouter(), publication=offer.publication, flight=useRef(false);
  const [navigating,startNavigation]=useTransition();
  const [selected,setSelected]=useState(cards.length===1?cards[0]!.id:"");
  const [review,setReview]=useState(initial),[attempt,setAttempt]=useState<PrepareCardCheckout|null>(null);
  const [busy,setBusy]=useState(false),[error,setError]=useState(""),[uncertain,setUncertain]=useState(false),[accessDenied,setAccessDenied]=useState(false);
  const working=busy||navigating;
  const cardPage=(number:number)=>`/checkout/${publication.id}/card?page=${number}&q=${encodeURIComponent(search)}`;
  async function submit() {
    if(working||flight.current)return;
    let body:Record<string,unknown>={};
    if(!review) {
      const card=cards.find(card=>card.id===selected);
      if(!attempt&&!card){setError("Choose one of your cards.");return;}
      const input=attempt??{commandId:crypto.randomUUID(),cardId:card!.id,cardServiceId:card!.serviceId,expectedCardVersion:card!.version};
      setAttempt(input);body=input;
    }
    const recovering=uncertain;
    flight.current=true;setBusy(true);setError("");setUncertain(true);
    try {
      const response=await fetch(`/api/v1/checkout/${publication.id}/card${review?`/${review.id}`:""}`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(30_000)});
      if(!response.ok) {
        const data=await response.json().catch(()=>null);
        if([401,403,404].includes(response.status))setAccessDenied(true);
        // A later denial cannot prove whether an earlier lost response committed.
        if(response.status<500&&!recovering)setUncertain(false);
        throw new Error(errors[data?.error?.code]??(response.status>=500||recovering?"We couldn’t confirm the result. Retry the same saved request to recover it.":"This checkout is unavailable with your current access. Your saved request has not been replaced."));
      }
      const saved=cardCheckoutReviewSchema.parse(await response.json());
      const expectedId=review?.id??body.commandId;
      if(saved.id!==expectedId||saved.publicationId!==publication.id||saved.amount.minor!==publication.amount.minor)throw new Error("We couldn’t verify this response. Retry the same saved request.");
      setUncertain(false);setAccessDenied(false);setAttempt(null);setReview(saved);
      // The saved-review URL replaces this component. Keep confirmation locked
      // until its server projection owns the screen and the next payment.
      startNavigation(()=>router.replace(`/checkout/${publication.id}/card?review=${saved.id}`,{scroll:false}));
    } catch(error) {setError(error instanceof Error&&error.name!=="ZodError"?error.message:"We couldn’t confirm this request. Retry to check its saved result.");}
    finally {flight.current=false;setBusy(false);}
  }
  return <div className="gc-page"><section className="gc-card">
    <p className="gc-eyebrow">{publication.merchantName}</p>
    <h1>{accessDenied?"Card access unavailable":review?.receipt?review.receipt.refundedAt?"Payment refunded":"Payment complete":review?"Review your payment":"Pay with your Etail card"}</h1>
    <p>{publication.description}</p><p className="gc-amount">{publication.amount.formatted}</p>
    {accessDenied?<><p>Your private card and receipt details are hidden. Restore access, then retry the original request to check its result.</p><Button busy={working} onClick={submit}>Retry saved request</Button></>:review?<>
      <p>{review.cardName} · Ending {review.lastFour}</p>
      {review.receipt?<><p>Reference {review.receipt.reference}</p><p>{review.receipt.refundedAt?"The refund has returned to your original card group.":"Paid from your card group’s balance."}</p><Link className="consumer-button consumer-button-primary" href="/cardholder-services/activity">View card activity</Link></>:<><p>This payment uses your group funds and counts toward your monthly spending limit.</p><Button busy={working} onClick={submit}>{uncertain?"Retry saved payment":`Pay ${review.amount.formatted}`}</Button></>}
    </>:<>
      {!attempt&&<form className="gc-search" method="get"><label htmlFor="checkout-search">Find your card</label><input id="checkout-search" name="q" maxLength={100} defaultValue={search} placeholder="Card name or last four digits"/><Button type="submit" variant="secondary">Search</Button></form>}
      <label htmlFor="checkout-card">Your card</label><select id="checkout-card" value={selected} disabled={working||!!attempt} onChange={e=>setSelected(e.target.value)}><option value="">Choose a card</option>{cards.map(card=><option key={card.id} value={card.id}>{card.nickname} · {card.lastFour} · {card.available.formatted} available</option>)}</select>
      {!cards.length&&<p>No matching cards. <Link href={`/checkout/${publication.id}/card`}>Show all your cards</Link> or <Link href="/cardholder-services">open Cardholder services</Link>.</p>}
      {!attempt&&(page>0||hasMore)&&<nav className="gc-actions" aria-label="Your card pages">{page>0&&<Link href={cardPage(page-1)}>Previous cards</Link>}<span>Page {page+1}</span>{hasMore&&<Link href={cardPage(page+1)}>More cards</Link>}</nav>}
      <div className="gc-actions"><Button busy={working} disabled={(!offer.canStart||!cards.length)&&!attempt} onClick={submit}>{attempt?"Retry saved review":"Review payment"}</Button></div>
    </>}
    <Feedback kind="error" message={error}/>
    {error&&!working&&!uncertain&&!accessDenied&&<a className="gc-back" href={`/checkout/${publication.id}/card`}>Reload cards and choose again</a>}
    {uncertain&&<p className="gc-note">The result is not yet confirmed. Retrying checks this saved request; it does not create a second payment.</p>}
    <p className="gc-note">Sandbox · No real money moves.</p>
  </section></div>;
}

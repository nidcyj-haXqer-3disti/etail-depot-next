import Link from "next/link";
import type { WorkspaceProjection } from "@/modules/workspace/contracts";
import { WorkspaceIcon } from "./navigation";
import { SupportCases } from "./cases";
import { cardholderHomeHref } from "../cardholder-routing";
import "./help.css";
export function HelpWorkspace({workspace:w,selectedCardId}:{workspace:WorkspaceProjection;selectedCardId?:string}) {
 const can=(action:string)=>w.capabilities.some(item=>item.action===action&&item.allowed);
 const primary=w.cardholderRole==="OWNER";
 const items=[
  {title:"How do I manage a card?",answer:"Open Cards and choose a card to see its purchases, available amount and settings. Freeze a card when you need to pause it, then unfreeze it when you’re ready.",href:cardholderHomeHref(selectedCardId,{view:"cards"}),link:"Go to Cards",visible:can("cards.read")},
  {title:"How do I finish setting up a card?",answer:"Open Card history and choose a saved setup to review and finish.",href:cardholderHomeHref(selectedCardId,{view:"requests"}),link:"View card history",visible:primary&&can("cards.request")},
  {title:"What do my card amounts mean?",answer:"Each card has its own total spending limit. It stays in place until the account owner changes it. Available to spend is the lower of the limit remaining and the card balance. Refunds return money to the card balance but do not reduce spending counted toward the limit.",href:cardholderHomeHref(selectedCardId),link:"Review your card",visible:can("cards.read")},
  {title:"Who can see my cards?",answer:"The account owner can see all cards and purchases in the account and manage each card’s spending limit. Each person sees only their own cards and purchases.",href:cardholderHomeHref(selectedCardId,{manage:w.service.id}),link:"Manage people",visible:primary&&can("people.read")},
  {title:"How do I check a card purchase?",answer:"Open your card’s activity to see each purchase and its details. For a question about a purchase, start a support case below. The account owner manages the card balance and each card’s spending limit.",href:cardholderHomeHref(selectedCardId),link:"View your cards",visible:true},
 ];
 return <div className="ws-help"><div className="ws-help-grid"><section className="ws-help-questions">{items.filter(item=>item.visible).map(item=><details key={item.title}><summary>{item.title}<WorkspaceIcon name="chevron"/></summary><div><p>{item.answer}</p><Link className="ws-inline-button" href={item.href}>{item.link}<WorkspaceIcon name="arrow"/></Link></div></details>)}</section><aside className="ws-next-panel"><span className="ws-next-icon"><WorkspaceIcon name="help"/></span><h2>Need help with a card?</h2><Link className="ws-button ws-button-dark" href={cardholderHomeHref(selectedCardId)}>{selectedCardId?"Back to your card":"Back to your account"}<WorkspaceIcon name="arrow"/></Link><p className="ws-help-no-chat">Save a support request below and read replies here. Email updates are not available.</p></aside></div>{can("support.cases.read")&&<SupportCases key={w.service.id} workspace={w} selectedCardId={selectedCardId}/>}</div>;
}

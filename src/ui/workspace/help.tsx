import Link from "next/link";
import type { WorkspaceProjection } from "@/modules/workspace/contracts";
import { WorkspaceIcon } from "./navigation";
import { SupportCases } from "./cases";
import { cardholderHomeHref } from "../cardholder-routing";
export function HelpWorkspace({workspace:w,selectedCardId}:{workspace:WorkspaceProjection;selectedCardId?:string}) {
 const can=(action:string)=>w.capabilities.some(item=>item.action===action&&item.allowed);
 const primary=w.cardholderRole==="OWNER";
 const items=[
  {title:"How do I manage a card?",answer:"Open Cards and choose a card to see its purchases, available amount and settings. Freeze a card when you need to pause it, then unfreeze it when you’re ready.",href:cardholderHomeHref(selectedCardId,{view:"cards"}),link:"Go to Cards",visible:can("cards.read")},
  {title:"How do I continue a card request?",answer:"Open Card requests and choose your request. Your saved details will be ready to review and finish.",href:cardholderHomeHref(selectedCardId,{view:"requests"}),link:"View card requests",visible:primary&&can("cards.request")},
  {title:"What do my card amounts mean?",answer:"Each card has its own total spending limit. It stays in place until the account owner changes it. Available to spend is the lower of the limit remaining and the card balance. Refunds return money to the card balance but do not reduce spending counted toward the limit.",href:cardholderHomeHref(selectedCardId),link:"Review your card",visible:can("cards.read")},
  {title:"Who can see my cards?",answer:"The account owner can see all cards and purchases in the account and manage each card’s spending limit. Each person sees only their own cards and purchases.",href:cardholderHomeHref(selectedCardId,{manage:w.service.id}),link:"Manage people",visible:primary&&can("people.read")},
  {title:"How do I pay with my card?",answer:"Open an Etail Depot payment link, sign in and choose a card in your name at checkout. The card balance must have enough money and the card must have enough spending limit remaining.",href:cardholderHomeHref(selectedCardId),link:"View your cards",visible:true},
 ];
 return <div className="ws-help"><div className="ws-welcome"><div><p className="ws-kicker">HELP & SUPPORT</p><h2>A clear next step.</h2><p>Find answers and keep track of your questions.</p></div></div><div className="ws-help-grid"><section className="ws-help-questions">{items.filter(item=>item.visible).map(item=><details key={item.title}><summary>{item.title}<WorkspaceIcon name="chevron"/></summary><div><p>{item.answer}</p><Link className="ws-inline-button" href={item.href}>{item.link}<WorkspaceIcon name="arrow"/></Link></div></details>)}</section><aside className="ws-next-panel"><span className="ws-next-icon"><WorkspaceIcon name="help"/></span><p className="ws-kicker">CARDS & SPENDING</p><h3>Here when you need a hand</h3><p>Questions and updates for your cards.</p><Link className="ws-button ws-button-dark" href={cardholderHomeHref(selectedCardId)}>Back to your card<WorkspaceIcon name="arrow"/></Link><p className="ws-help-no-chat">Save a support request below and read replies here. Email updates are not available.</p></aside></div>{can("support.cases.read")&&<SupportCases key={w.service.id} workspace={w} selectedCardId={selectedCardId}/>}</div>;
}

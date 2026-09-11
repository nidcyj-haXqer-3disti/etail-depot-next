import Link from "next/link";
import type { WorkspaceProjection } from "@/modules/workspace/contracts";
import { WorkspaceIcon } from "./navigation";
import { SupportCases } from "./cases";
import { cardholderHomeHref, cardholderTaskHref } from "../cardholder-routing";
export function HelpWorkspace({workspace:w,selectedCardId}:{workspace:WorkspaceProjection;selectedCardId?:string}) {
 const can=(action:string)=>w.capabilities.some(item=>item.action===action&&item.allowed);
 const primary=w.cardholderRole==="PRIMARY";
 const items=[
  {title:"How do I manage a card?",answer:"Open Cards and choose a card to see its activity, available amount and controls. Freeze a card when you need to pause it, then unfreeze it when you’re ready.",href:cardholderHomeHref(selectedCardId,{view:"cards"}),link:"Go to Cards",visible:can("cards.read")},
  {title:"How do I continue a card request?",answer:"Open Saved requests and choose your request. Your saved details will be ready to review and finish.",href:cardholderHomeHref(selectedCardId,{view:"requests"}),link:"View saved requests",visible:primary&&can("cards.request")},
  {title:"What do my card amounts mean?",answer:"Available to spend is the smaller of your remaining monthly limit and the group’s available funds. All your cards share that limit. Purchases use group funds; refunds return funds without restoring monthly spending allowance. All amounts are sandbox money.",href:cardholderHomeHref(selectedCardId),link:"Review your card",visible:can("cards.read")},
  {title:"Who can see my cards?",answer:"The primary cardholder can manage the card group. A secondary cardholder can see only their own cards and activity.",href:cardholderHomeHref(selectedCardId,{manage:w.service.id}),link:"Review cardholder access",visible:primary&&can("people.read")},
  {title:"Can I send payments or messages here?",answer:"Open a merchant’s published payment link, sign in and choose your own Etail card at checkout. Your primary must first fund the group and set your monthly limit. The sandbox does not move real money or send payment messages.",href:cardholderTaskHref("settings",{cardId:selectedCardId,contextId:w.service.id}),link:"View preferences",visible:true},
 ];
 return <div className="ws-help"><div className="ws-welcome"><div><p className="ws-kicker">HELP & SUPPORT</p><h2>A clear next step.</h2><p>Find answers and keep track of your questions.</p></div></div><div className="ws-help-grid"><section className="ws-help-questions">{items.filter(item=>item.visible).map(item=><details key={item.title}><summary>{item.title}<WorkspaceIcon name="chevron"/></summary><div><p>{item.answer}</p><Link className="ws-inline-button" href={item.href}>{item.link}<WorkspaceIcon name="arrow"/></Link></div></details>)}</section><aside className="ws-next-panel"><span className="ws-next-icon"><WorkspaceIcon name="help"/></span><p className="ws-kicker">CARDHOLDER SERVICES</p><h3>Here when you need a hand</h3><p>Questions and updates for your cards.</p><Link className="ws-button ws-button-dark" href={cardholderHomeHref(selectedCardId)}>Back to your card<WorkspaceIcon name="arrow"/></Link><p className="ws-help-no-chat">Save a support request below and read replies here. No email is sent in the sandbox.</p></aside></div>{can("support.cases.read")&&<SupportCases key={w.service.id} workspace={w} selectedCardId={selectedCardId}/>}</div>;
}

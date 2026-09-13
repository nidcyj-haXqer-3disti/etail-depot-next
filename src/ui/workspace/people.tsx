"use client";
import {useRef,useState} from "react";
import Link from "next/link";
import {useRouter,useSearchParams} from "next/navigation";
import type {WorkspaceProjection} from "@/modules/workspace/contracts";
import type {AccessOverview,AccessPerson,InvitationProjection} from "@/modules/access/contracts";
import {accessOverviewSchema,accessPersonSchema,invitationProjectionSchema} from "@/shared/access-response";
import {WorkspaceDialog,WorkspaceCommandError,StatusBadge,Button,Feedback,formatDate} from "./primitives";
import {accessFetch} from "./access-client";
import {useServerProjection} from "./use-server-projection";
import "./access.css";

type Attempt={kind:"revoke-person"|"revoke-invitation";path:string;body:Record<string,unknown>;targetId:string};
export function PeopleWorkspace({workspace,access:initial,selectedPersonId,personUnavailable=false}:{workspace:WorkspaceProjection;access?:AccessOverview;selectedPersonId?:string;personUnavailable?:boolean}){
 const router=useRouter(),params=useSearchParams(),flight=useRef(false);
 const [access,setAccess]=useServerProjection(initial);
 const [query,setQuery]=useState(params.get("peopleSearch")??""),[tab,setTab]=useState(params.get("peopleTab")??"people");
 const [revoking,setRevoking]=useState<AccessPerson|InvitationProjection|null>(null),[attempt,setAttempt]=useState<Attempt|null>(null),[busy,setBusy]=useState(false),[unavailable,setUnavailable]=useState(false),[error,setError]=useState(""),[success,setSuccess]=useState("");
 const prefix=`/api/v1/cardholder-services/${workspace.service.id}`,locked=busy||!!attempt;
 const selected=access?.people.find(person=>person.id===selectedPersonId),canRead=workspace.capabilities.some(cap=>cap.action==="people.read"&&cap.allowed);
 async function reload(){
  const next=accessOverviewSchema.parse(await accessFetch<unknown>(`${prefix}/access`));
  if(next?.serviceId!==workspace.service.id||!Array.isArray(next.people)||!Array.isArray(next.invitations))throw new WorkspaceCommandError("We couldn’t verify your people. Retry the saved request.",null);
  setAccess(next);setUnavailable(false);router.refresh();
 }
 async function run(next:Attempt){
  if(flight.current)return;flight.current=true;setBusy(true);setError("");setAttempt(next);
  try{
   const response=await accessFetch<unknown>(next.path,"POST",next.body);
   const result=next.kind==="revoke-person"?accessPersonSchema.parse(response):invitationProjectionSchema.parse(response);
   const expectedVersion=Number(next.body.expectedVersion??0);
   const valid=result.id===next.targetId&&result.version>=expectedVersion+1&&(result.version>expectedVersion+1||("status" in result?result.status:result.state)==="REVOKED");
   if(!valid)throw new WorkspaceCommandError("We couldn’t verify this change. Retry the saved request.",null);
   setAttempt(null);setRevoking(null);setUnavailable(false);setSuccess("Access removed. Past records are kept.");await reload();
  }catch(e){
   if(e instanceof WorkspaceCommandError&&[401,403,404].includes(e.status??0))setUnavailable(true);
   setError(e instanceof Error?e.message:"We couldn’t confirm this change. Retry the saved request.");
  }finally{flight.current=false;setBusy(false);}
 }
 function remove(){if(!revoking||locked)return;const invitation="recipientId" in revoking;void run({kind:invitation?"revoke-invitation":"revoke-person",path:`${prefix}/${invitation?"invitations":"people"}/${revoking.id}/revoke`,targetId:revoking.id,body:{commandId:crypto.randomUUID(),expectedVersion:revoking.version}});}
 function href(personId?:string,extra:Record<string,string>={}){const search=new URLSearchParams({view:"cardholders",peopleTab:tab,...extra});if(personId)search.set("person",personId);if(query)search.set("peopleSearch",query);return `/cardholder-services?${search}`;}
 const recovery=attempt&&<div className="consumer-card-retry"><p>This change is unconfirmed. Retry the same request to check its saved result.</p><div className="consumer-action-row"><Button busy={busy} onClick={()=>void run(attempt)}>Retry this change</Button><Button variant="secondary" disabled={busy} onClick={()=>void reload().catch(e=>setError((e as Error).message))}>Refresh people</Button></div></div>;
 if(unavailable)return <section className="ws-panel"><h2>People are unavailable</h2><p>We couldn’t check your permission to view these details. They are hidden until we can confirm it.</p><Feedback kind="error" message={error}/>{recovery}</section>;
 if(!canRead)return <section className="ws-panel"><h2>Your cards stay private</h2><p>The account owner manages people and card limits. You can see your cards from Home.</p><Link href="/cardholder-services">Back to your cards</Link></section>;
 if(personUnavailable)return <section className="ws-panel"><h2>This person is unavailable</h2><Link href={href()}>Back to people</Link></section>;
 const directory=(access?.people??[]).filter(person=>person.displayName.toLowerCase().includes(query.toLowerCase()));
 const shown=selected?[selected]:directory;
 return <div className="ws-people">
  <Feedback kind="error" message={error}/><Feedback kind="success" message={success}/>{!revoking&&recovery}
  <div className="access-person-heading"><div><p className="access-role-label">YOUR PEOPLE</p><h2>{selected?selected.displayName:"Cards for people you trust"}</h2><p>You manage the card balance and each card’s total spending limit. Each person sees only their own cards and purchases.</p></div><div className="consumer-action-row">{selected&&<Link className="consumer-button consumer-button-secondary" href={href()}>All people</Link>}</div></div>
  {!selected&&<div className="access-directory-tabs" aria-label="People and invitations">{([['people','People'],['invitations',`Invitations (${access?.pendingInvitationCount??0})`],['history','History']] as const).map(([value,label])=><button type="button" aria-pressed={tab===value} key={value} onClick={()=>{setTab(value);router.replace(href(undefined,{peopleTab:value}),{scroll:false});}}>{label}</button>)}</div>}
  {(selected||tab==="people")&&<section className="ws-panel">{!selected&&<form action="/cardholder-services" className="consumer-action-row"><input type="hidden" name="view" value="cardholders"/><input type="hidden" name="peopleTab" value={tab}/><label>Search people<input type="search" name="peopleSearch" value={query} maxLength={100} onChange={e=>setQuery(e.target.value)} placeholder="Name"/></label><Button type="submit" variant="secondary">Search</Button></form>}<div className="access-cardholder-grid">{shown.map(person=>{
   const personCards=workspace.cards.filter(card=>card.holderId===person.id);
   return <article className="access-cardholder" key={person.id}><div className="access-cardholder-body"><h3><Link href={href(person.id)}>{person.displayName}{person.isCurrentPerson?" (you)":""}</Link></h3><p>{person.role==="OWNER"?"Account owner":"Cardholder"}</p><StatusBadge status={person.state}/><p>{person.role==="OWNER"?"Manages all cards, the card balance and spending limits.":"Only their own cards and activity."}</p>{personCards.length?<ul className="access-person-card-list">{personCards.map(card=><li key={card.id}><div><strong>{card.nickname}</strong><span>Ending {card.lastFour} · Total spending limit {card.spending.allowance.formatted}</span></div><Link className="consumer-text-link" href={href(person.id,{card:card.id})}>Card settings</Link></li>)}</ul>:<p>No cards yet. A person can hold as many cards as you need.</p>}<div className="consumer-action-row">{person.canRevoke&&<Button variant="quiet" onClick={()=>setRevoking(person)}>Remove access</Button>}</div></div></article>;
  })}</div>{!shown.length&&<p>No people match this name.</p>}</section>}
  {!selected&&tab==="invitations"&&<section className="ws-panel"><h3>Invitations</h3><p>Create a card first, then open that card to invite its recipient.</p>{access?.invitations.map(invitation=><article className="access-invitation-card" key={invitation.id}><h4>{invitation.recipientName}</h4><StatusBadge status={invitation.status}/><p>Own cards and activity · Expires {formatDate(invitation.expiresAt)}</p>{invitation.canRevoke&&<Button variant="secondary" onClick={()=>setRevoking(invitation)}>Cancel invitation</Button>}</article>)}{!access?.invitations.length&&<p>No invitations yet.</p>}{access?.invitationsTruncated&&<p>Showing the latest {access.invitations.length} invitations, with waiting invitations first.</p>}</section>}
  {!selected&&tab==="history"&&<section className="ws-panel access-history"><h3>Access history</h3>{access?.history.length?<ol>{access.history.map(event=><li key={event.id}><div><strong>{event.label}</strong><span>{event.personName} · by {event.actorName}</span></div><time dateTime={event.createdAt}>{formatDate(event.createdAt)}</time></li>)}</ol>:<p>No access changes yet.</p>}{access?.historyHasMore&&<p>Showing the latest 100 events.</p>}</section>}
  <WorkspaceDialog open={!!revoking} onClose={()=>{if(!locked)setRevoking(null);}} title={revoking&&"recipientId" in revoking?"Cancel invitation":"Remove card access"} serviceName="Cards & spending" footer={<><Button variant="secondary" disabled={locked} onClick={()=>setRevoking(null)}>Keep access</Button><Button variant="danger" busy={busy} disabled={!!attempt} onClick={remove}>Confirm removal</Button></>}><Feedback kind="error" message={error}/>{recovery}<p>{revoking&&("recipientName" in revoking?revoking.recipientName:revoking.displayName)} will no longer be able to {revoking&&"recipientId" in revoking?"accept this invitation":"use or view cards from this account"}. Past transactions are kept and the card balance stays in your account.</p></WorkspaceDialog>
 </div>;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cardholderTaskHref } from "../cardholder-routing";
import type { WorkspaceProjection } from "@/modules/workspace/contracts";
import type { SupportCaseDetail, SupportCaseList, SupportCaseSummary, SupportTopic } from "@/modules/cases/contracts";
import { Button, EmptyState, Feedback, StatusBadge, WorkspaceDialog, formatDate } from "./primitives";
import "./cases.css";

const topics:Record<SupportTopic,string>={SERVICE:"Cardholder question",ACCESS:"Access & permissions",CARD:"Card problem",TRANSACTION:"Transaction question"};
type Attempt={kind:"create"|"message"|"withdraw";caseId?:string;body:Record<string,unknown>};
class CaseError extends Error {constructor(public status:number,public code:string){super(code);}}
async function readResult<T>(response:Response):Promise<T> {if(!response.ok){const body=await response.json().catch(()=>null);throw new CaseError(response.status,body?.error?.code??"UNAVAILABLE");}return response.json() as Promise<T>;}
function errorMessage(error:unknown) {
  if(!(error instanceof CaseError))return "The connection was interrupted. We could not confirm the result. Retry the same request below; your text has been kept.";
  if(error.status===401)return "Your session has ended. Sign in again to continue. Your unsaved text is still here.";
  if(error.status===403||error.status===404)return "This case is no longer available to you. Your unsaved text has been kept.";
  if(error.status===409)return "This case changed while you were working. Refresh the case before continuing; your unsaved text will be kept.";
  if(error.code==="MESSAGE_LIMIT_REACHED")return "This case has reached its update limit. Its history remains available, and you can still withdraw it.";
  if(error.code==="INVALID_STATE")return "This case no longer accepts updates. Refresh to see its current status.";
  return "We could not save this request. Check the required fields and their length, then try again.";
}

export function SupportCases({workspace,selectedCardId}:{workspace:WorkspaceProjection;selectedCardId?:string}) {
  const params=useSearchParams(),router=useRouter();
  const serviceId=workspace.service.id,initialCase=params.get("case"),requestedTransaction=params.get("transaction");
  const caseHref=(extra:Record<string,string>)=>cardholderTaskHref("help",{cardId:selectedCardId,contextId:serviceId},extra);
  const linked=workspace.activity.find(item=>item.id===requestedTransaction);
  const requestedTopic=params.get("topic");
  const initialTopic:SupportTopic=requestedTopic&&Object.hasOwn(topics,requestedTopic)?requestedTopic as SupportTopic:linked?"TRANSACTION":"SERVICE";
  const [list,setList]=useState<SupportCaseList|null>(null),[detail,setDetail]=useState<SupportCaseDetail|null>(null);
  const [loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[creating,setCreating]=useState(params.get("new")==="1"),[review,setReview]=useState(false);
  const [search,setSearch]=useState(""),[status,setStatus]=useState("ALL");
  const [topic,setTopic]=useState<SupportTopic>(initialTopic),[subject,setSubject]=useState(""),[message,setMessage]=useState(""),[transaction,setTransaction]=useState(linked?.id??"");
  const [updates,setUpdates]=useState<Record<string,string>>({}),[withdrawOpen,setWithdrawOpen]=useState(false),[reason,setReason]=useState("");
  const [notice,setNotice]=useState<{kind:"error"|"success"|"info";message:string}|null>(null),[needsRefresh,setNeedsRefresh]=useState(false),[attempt,setAttempt]=useState<Attempt|null>(null);
  const requestSerial=useRef(0),listLoaded=useRef(false);
  const [opening,setOpening]=useState(Boolean(initialCase));
  const titleRef=useRef<HTMLHeadingElement>(null);
  const permitted=workspace.capabilities.some(item=>item.action==="support.cases.manage"&&item.allowed);
  const locked=busy||Boolean(attempt)||needsRefresh||opening;
  const draft=detail?updates[detail.id]??"":"";
  async function loadList(append=false) {
    const query=new URLSearchParams();if(search.trim())query.set("q",search.trim());if(status!=="ALL")query.set("status",status);if(append&&list?.nextCursor)query.set("cursor",list.nextCursor);
    try {const result=await readResult<SupportCaseList>(await fetch(`/api/v1/cardholder-services/${encodeURIComponent(serviceId)}/cases?${query}`,{cache:"no-store"}));setList(current=>append&&current?{...result,cases:[...current.cases,...result.cases.filter(row=>!current.cases.some(item=>item.id===row.id))]}:result);}
    catch(error){setNotice({kind:"error",message:errorMessage(error)});}
  }
  useEffect(()=>{
    const serial=++requestSerial.current;
    void(async()=>{
      try {
        const result=listLoaded.current?null:await readResult<SupportCaseList>(await fetch(`/api/v1/cardholder-services/${encodeURIComponent(serviceId)}/cases`,{cache:"no-store"}));
        const selected=initialCase?await readResult<SupportCaseDetail>(await fetch(`/api/v1/cardholder-services/${encodeURIComponent(serviceId)}/cases/${encodeURIComponent(initialCase)}`,{cache:"no-store"})):null;
        if(serial!==requestSerial.current)return;
        if(result){setList(result);listLoaded.current=true;}setDetail(selected);setLoading(false);setOpening(false);if(selected)setCreating(false);
        if(initialCase)requestAnimationFrame(()=>titleRef.current?.focus());
      } catch(error){if(serial===requestSerial.current){setLoading(false);setOpening(false);setNotice({kind:"error",message:errorMessage(error)});}}
    })();
    return()=>{requestSerial.current+=1;};
  },[serviceId,initialCase]);
  async function choose(item:SupportCaseSummary) {
    if(busy||attempt)return;if(item.id===detail?.id){setCreating(false);return;}setOpening(true);setCreating(false);setNotice(null);setNeedsRefresh(false);
    router.replace(caseHref({case:item.id}),{scroll:false});
  }
  async function refresh() {
    if(!detail)return;setBusy(true);
    try {setDetail(await readResult<SupportCaseDetail>(await fetch(`/api/v1/cardholder-services/${encodeURIComponent(serviceId)}/cases/${encodeURIComponent(detail.id)}`,{cache:"no-store"})));setNeedsRefresh(false);setNotice({kind:"info",message:"Case refreshed. Your unsaved text is still here; review the latest replies before saving."});await loadList();}
    catch(error){setNotice({kind:"error",message:errorMessage(error)});}finally{setBusy(false);}
  }
  async function send(command:Attempt) {
    if(busy)return;setBusy(true);setAttempt(command);setNotice(null);
    try {
      const init={method:"POST",credentials:"same-origin" as const,headers:{"Content-Type":"application/json"},body:JSON.stringify(command.body)};
      let response:Response;
      if(command.kind==="create")response=await fetch(`/api/v1/cardholder-services/${encodeURIComponent(serviceId)}/cases`,init);
      else if(command.kind==="message")response=await fetch(`/api/v1/cardholder-services/${encodeURIComponent(serviceId)}/cases/${encodeURIComponent(command.caseId!)}/messages`,init);
      else response=await fetch(`/api/v1/cardholder-services/${encodeURIComponent(serviceId)}/cases/${encodeURIComponent(command.caseId!)}/withdraw`,init);
      const saved=await readResult<SupportCaseDetail>(response);setDetail(saved);setAttempt(null);setCreating(false);setReview(false);setNeedsRefresh(false);setWithdrawOpen(false);
      if(command.kind==="create"){setSubject("");setMessage("");}else if(command.kind==="message")setUpdates(current=>({...current,[saved.id]:""}));else setReason("");
      setNotice({kind:"success",message:command.kind==="withdraw"?"Case withdrawn. Your messages and transactions are unchanged.":command.kind==="message"?"Your update is saved for support to review.":"Your question is saved for support to review."});
      await loadList();router.replace(caseHref({case:saved.id}),{scroll:false});
    } catch(error){setNotice({kind:"error",message:errorMessage(error)});if(error instanceof CaseError){setAttempt(null);if(error.status===409||error.code==="INVALID_STATE"||error.status===401||error.status===403||error.status===404)setNeedsRefresh(true);}}
    finally{setBusy(false);}
  }
  function startNew() {setOpening(false);setCreating(true);setReview(false);setNotice(null);setNeedsRefresh(false);setDetail(null);router.replace(caseHref({new:"1"}),{scroll:false});requestAnimationFrame(()=>titleRef.current?.focus());}
  function startCreate(){void send({kind:"create",body:{commandId:crypto.randomUUID(),topic,subject:subject.trim(),message:message.trim(),transactionId:transaction||null}});}
  return <section className="cases-workspace" aria-labelledby="support-cases-title">
    <header className="cases-heading"><div><p className="cases-eyebrow">YOUR SUPPORT</p><h2 id="support-cases-title" ref={titleRef} tabIndex={-1}>Keep the conversation together.</h2><p>Your questions about {(workspace.customerService?.displayName ?? "Cardholder services")}.</p></div>{permitted&&<Button disabled={busy||Boolean(attempt)} onClick={startNew}>Start a case</Button>}</header>
    <p className="cases-delivery-note">Only you and assigned support staff can read these conversations.</p>
    {notice&&<div className="cases-feedback"><Feedback kind={notice.kind} message={notice.message}/>{attempt&&!busy&&<Button variant="secondary" onClick={()=>void send(attempt)}>Retry same request</Button>}{needsRefresh&&detail&&<Button variant="secondary" busy={busy} onClick={()=>void refresh()}>Refresh case</Button>}</div>}
    <div className="cases-layout"><aside className="cases-list-panel" aria-label="Your support cases"><form className="cases-filters" onSubmit={event=>{event.preventDefault();void loadList();}}><label>Search your cases<input type="search" value={search} maxLength={100} onChange={event=>setSearch(event.target.value)} placeholder="Subject or reference"/></label><label>Support case status<select value={status} onChange={event=>setStatus(event.target.value)}><option value="ALL">All cases</option><option value="OPEN">Open</option><option value="WITHDRAWN">Withdrawn</option><option value="RESOLVED">Resolved</option></select></label><Button variant="secondary" type="submit">Apply filters</Button></form>
      {loading?<p className="cases-list-note" role="status">Loading your cases…</p>:!list?<div className="cases-list-note"><h3>Your cases could not be loaded</h3><Button variant="secondary" onClick={()=>void loadList()}>Try loading again</Button></div>:list.cases.length?<><div className="cases-list">{list.cases.map(item=><button key={item.id} type="button" className={`cases-list-item ${detail?.id===item.id&&!creating?"is-selected":""}`} onClick={()=>void choose(item)} disabled={busy||Boolean(attempt)} aria-pressed={detail?.id===item.id&&!creating}><span className="cases-list-meta">{topics[item.topic]}<StatusBadge status={item.status}/></span><strong>{item.subject}</strong><span className="cases-list-reference">{item.reference}</span><span>Opened {formatDate(item.createdAt)}</span></button>)}</div>{list.nextCursor&&<Button variant="quiet" onClick={()=>void loadList(true)}>Load older cases</Button>}</>:<div className="cases-list-note"><h3>{search||status!=="ALL"?"No matching cases":"No support cases yet"}</h3><p>{search||status!=="ALL"?"Try another subject or status.":"Start a case when you need to keep a question and its updates together."}</p></div>}</aside>
      <div className="cases-detail" aria-busy={busy}>
      {opening?<p role="status">Opening your case…</p>:creating?<form onSubmit={event=>{event.preventDefault();if(review)startCreate();else setReview(true);}}>
        <p className="cases-eyebrow">{review?"REVIEW YOUR CASE":"START A CASE"}</p><h3>{review?"Ready to save your question?":"What can we help with?"}</h3><p className="cases-context">{(workspace.customerService?.displayName ?? "Cardholder services")} · Your support case</p>
        {review?<><dl className="cases-review"><div><dt>Topic</dt><dd>{topics[topic]}</dd></div><div><dt>Subject</dt><dd>{subject}</dd></div>{transaction&&<div><dt>Related transaction</dt><dd>{workspace.activity.find(item=>item.id===transaction)?.title}</dd></div>}</dl><p className="cases-body-copy">{message}</p><div className="cases-next-step"><strong>What happens next</strong><p>Your question will be saved for support to review. Replies appear here; no email is sent in the sandbox.</p></div></>:<div className="cases-form-fields"><label>Topic<select value={topic} disabled={locked} onChange={event=>setTopic(event.target.value as SupportTopic)}>{Object.entries(topics).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label>Subject<input required maxLength={100} value={subject} disabled={locked} onChange={event=>setSubject(event.target.value)} placeholder="A short summary of your question"/></label><label>Related transaction (optional)<select value={transaction} disabled={locked} onChange={event=>setTransaction(event.target.value)}><option value="">No transaction</option>{workspace.activity.map(item=><option key={item.id} value={item.id}>{item.title} · {formatDate(item.occurredAt)}</option>)}</select></label>{requestedTransaction&&!linked&&<p className="cases-field-note">That transaction is no longer available. Choose another transaction or leave it blank.</p>}<label>Your explanation<textarea required maxLength={2000} rows={7} value={message} disabled={locked} onChange={event=>setMessage(event.target.value)} aria-describedby="case-sensitive-help"/></label><p className="cases-field-note" id="case-sensitive-help">Include the relevant details and what you need help with. Do not enter card numbers, passwords or bank details. {message.length}/2,000</p></div>}
        <div className="cases-actions"><Button variant="quiet" disabled={locked} onClick={()=>review?setReview(false):setCreating(false)}>{review?"Edit explanation":"Cancel"}</Button><Button type="submit" busy={busy} disabled={locked||!permitted||!subject.trim()||!message.trim()}>{review?"Create case":"Review case"}</Button></div>
      </form>:detail?<>
        <header className="cases-detail-heading"><div><p className="cases-eyebrow">{topics[detail.topic]}</p><h3>{detail.subject}</h3><p className="cases-reference">{detail.reference}</p></div><StatusBadge status={detail.status}/></header><p className="cases-context">{(workspace.customerService?.displayName ?? "Cardholder services")} · Opened {formatDate(detail.createdAt)}</p>
        {detail.transaction&&<Link className="cases-transaction" href={cardholderTaskHref("activity",{cardId:workspace.activity.find(item=>item.id===detail.transaction!.id)?.cardId??selectedCardId,contextId:serviceId},{transaction:detail.transaction.id})}>Related transaction: {detail.transaction.title}<span aria-hidden="true">↗</span></Link>}{detail.transactionUnavailable&&<p className="cases-field-note">The linked transaction is not available with your current access.</p>}
        <div className="cases-next-step"><strong>{detail.status==="OPEN"?"Next step: support review":detail.status==="RESOLVED"?"Resolved by support":"Withdrawn by you"}</strong><p>{detail.status==="OPEN"?"Your case is in the support queue. You can add information while it is open.":"This case no longer accepts updates. Your saved explanation and timeline remain available."}</p></div>
        <section className="cases-timeline-section"><h4>Case timeline</h4><ol className="cases-timeline">{detail.messages.map(item=><li key={item.id}><div className="cases-timeline-meta"><strong>{item.author==="SUPPORT"?(item.kind==="RESOLVED"?"Support resolved this case":"Support replied"):item.kind==="OPENED"?"You opened this case":item.kind==="WITHDRAWN"?"You withdrew this case":"You added an update"}</strong><time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time></div><p>{item.body}</p></li>)}</ol></section>
        {detail.canUpdate&&<><form className="cases-update-form" onSubmit={event=>{event.preventDefault();void send({kind:"message",caseId:detail.id,body:{commandId:crypto.randomUUID(),expectedVersion:detail.version,message:draft.trim()}});}}><label>Add an update<textarea rows={4} required maxLength={2000} value={draft} disabled={locked} onChange={event=>setUpdates(current=>({...current,[detail.id]:event.target.value}))} aria-describedby="case-update-help"/></label><p id="case-update-help" className="cases-field-note">Saved to your case only. Do not include sensitive information. {draft.length}/2,000</p><div className="cases-actions"><Button variant="quiet" disabled={locked} onClick={()=>setWithdrawOpen(true)}>Withdraw case</Button><Button type="submit" busy={busy} disabled={locked||!draft.trim()||detail.version>=100}>Save update</Button></div></form>{detail.version>=100&&<p className="cases-field-note">This case has reached its update limit. You can still view its history or withdraw it.</p>}</>}
      </>:<div className="cases-empty-detail"><EmptyState title="One place for your question" description="Choose a request to see its updates, or start a new one."/></div>}
      </div>
    </div>
    {withdrawOpen&&detail&&<WorkspaceDialog open title="Withdraw this case?" serviceName={(workspace.customerService?.displayName ?? "Cardholder services")} onClose={()=>{if(!locked)setWithdrawOpen(false);}}><h3>{detail.subject}</h3><p>This closes your support request to further updates. Your cards, transactions and saved messages stay unchanged.</p><label className="cases-withdraw-label">Reason for withdrawing<textarea required rows={4} maxLength={500} value={reason} disabled={locked} onChange={event=>setReason(event.target.value)}/></label><p className="cases-field-note">Your reason stays in the case timeline. {reason.length}/500</p>{notice?.kind==="error"&&<Feedback kind="error" message={notice.message}/>}<div className="cases-actions"><Button variant="secondary" disabled={locked} onClick={()=>setWithdrawOpen(false)}>Keep case open</Button><Button variant="danger" busy={busy} disabled={locked||!reason.trim()} onClick={()=>void send({kind:"withdraw",caseId:detail.id,body:{commandId:crypto.randomUUID(),expectedVersion:detail.version,reason:reason.trim()}})}>Withdraw case</Button></div>{attempt&&!busy&&<Button variant="secondary" onClick={()=>void send(attempt)}>Retry same request</Button>}{needsRefresh&&<Button variant="secondary" disabled={busy} onClick={()=>{setWithdrawOpen(false);void refresh();}}>Refresh case</Button>}</WorkspaceDialog>}
  </section>;
}

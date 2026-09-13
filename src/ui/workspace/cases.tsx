"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cardholderTaskHref } from "../cardholder-routing";
import type { WorkspaceProjection } from "@/modules/workspace/contracts";
import type { SupportCaseDetail, SupportCaseList, SupportCaseSummary, SupportPaymentContext, SupportTopic } from "@/modules/cases/contracts";
import { Button, EmptyState, Feedback, StatusBadge, WorkspaceDialog, formatDate } from "./primitives";
import { useServerProjection } from "./use-server-projection";
import { merchantActivityReturn, merchantRecordHref } from "@/shared/merchant-activity";
import { useMerchantNavigationLock } from "./merchant-navigation-state";
import "./cases.css";

const topicLabels:Record<SupportTopic,string>={SERVICE:"Service question",ACCESS:"Access & permissions",CARD:"Card problem",TRANSACTION:"Transaction question",PAYMENT:"Payment question"};
export type MerchantSupportContext={kind:"MERCHANT";merchantId:string;serviceId:string;merchantName:string;primaryName:string;initialCases:SupportCaseList;linkedPayment:SupportPaymentContext|null;paymentUnavailable:boolean};
type SupportContext=MerchantSupportContext|{kind:"CARDHOLDER";workspace:WorkspaceProjection;selectedCardId?:string};
type SupportCasesProps={workspace:WorkspaceProjection;selectedCardId?:string;context?:never}|{context:MerchantSupportContext;workspace?:never;selectedCardId?:never};
export function SupportCases(props:SupportCasesProps) {
  const context=useMemo<SupportContext>(()=>props.context??{kind:"CARDHOLDER",workspace:props.workspace!,selectedCardId:props.selectedCardId},[props.context,props.workspace,props.selectedCardId]);
  return <SupportCaseWorkspace key={context.kind==="MERCHANT"?`merchant:${context.merchantId}`:`cardholder:${context.workspace.service.id}`} context={context}/>;
}
export function SupportPaymentSummary({payment,showLink=true,receiptHref}:{payment:SupportPaymentContext;showLink?:boolean;receiptHref?:string}) {
  return <section className="cases-payment" aria-label="Related payment"><h3>Related payment</h3><StatusBadge status={payment.outcome}/><dl><div><dt>Merchant</dt><dd>{payment.merchantName}</dd></div><div><dt>Account owner</dt><dd>{payment.primaryName}</dd></div><div><dt>For</dt><dd>{payment.description}</dd></div><div><dt>Amount</dt><dd>{payment.amount.formatted}</dd></div><div><dt>Payment reference</dt><dd>{payment.reference}</dd></div><div><dt>{payment.outcome==="APPROVED"?"Payment received":"Payment attempted"}</dt><dd><time dateTime={payment.receivedAt}>{formatDate(payment.receivedAt)}</time></dd></div>{payment.refund&&<><div><dt>Full refund</dt><dd>{payment.refund.amount.formatted}</dd></div><div><dt>Refund completed</dt><dd><time dateTime={payment.refund.completedAt}>{formatDate(payment.refund.completedAt)}</time></dd></div><div><dt>Refund reference</dt><dd>{payment.refund.reference}</dd></div></>}</dl>{showLink&&<Link href={receiptHref??merchantRecordHref(payment.merchantId,{tab:"payments",payment:payment.id},null)}>View payment and receipt</Link>}</section>;
}
type Attempt={kind:"create"|"message"|"withdraw";caseId?:string;body:Record<string,unknown>};
class CaseError extends Error {constructor(public status:number,public code:string){super(code);}}
async function readResult<T>(response:Response):Promise<T> {if(!response.ok){const body=await response.json().catch(()=>null);throw new CaseError(response.status,body?.error?.code??"UNAVAILABLE");}return response.json() as Promise<T>;}
function errorMessage(error:unknown) {
  if(!(error instanceof CaseError)||error.status>=500||error.status===408)return "The connection was interrupted. We could not confirm the result. Retry the same request below; your text has been kept.";
  if(error.status===401)return "Your session has ended. Sign in again to continue.";
  if(error.status===403||error.status===404)return "This case is no longer available to you. Check your current access before continuing.";
  if(error.status===409)return "This case changed while you were working. Refresh the case before continuing; your unsaved text will be kept.";
  if(error.code==="MESSAGE_LIMIT_REACHED")return "This case has reached its update limit. Its history remains available, and you can still withdraw it.";
  if(error.code==="INVALID_STATE")return "This case no longer accepts updates. Refresh to see its current status.";
  return "We could not save this request. Check the required fields and their length, then try again.";
}

function SupportCaseWorkspace({context}:{context:SupportContext}) {
  const params=useSearchParams(),router=useRouter();
  const [, ,contextChanged,isCurrent]=useServerProjection(context);
  const merchant=context.kind==="MERCHANT"?context:null;
  const workspace=context.kind==="CARDHOLDER"?context.workspace:null;
  const selectedCardId=context.kind==="CARDHOLDER"?context.selectedCardId:undefined;
  const serviceId=merchant?.serviceId??workspace!.service.id;
  const contextName=merchant?.merchantName??workspace?.customerService?.displayName??"Cards & spending";
  const apiBase=merchant?`/api/v1/merchants/${encodeURIComponent(merchant.merchantId)}/cases`:`/api/v1/cardholder-services/${encodeURIComponent(serviceId)}/cases`;
  const caseValues=merchant&&params.get("tab")!=="help"?[]:params.getAll("case"),initialCase=caseValues.length===1?caseValues[0]:caseValues.length?"invalid-selection":null;
  const requestedTransaction=params.get("transaction"),requestedPayment=merchant&&params.get("tab")!=="help"?null:params.get("payment");
  const caseHref=(extra:Record<string,string|null>)=>{
    if(!merchant)return cardholderTaskHref("help",{cardId:selectedCardId,contextId:serviceId},Object.fromEntries(Object.entries(extra).filter((entry):entry is [string,string]=>entry[1]!==null)));
    const query=new URLSearchParams({tab:"help"});
    for(const key of ["payment","from","to","q","status","activity"]){const values=params.getAll(key);if(values.length===1)query.set(key,values[0]);}
    const back=params.getAll("returnTo").length===1?merchantActivityReturn(params.get("returnTo")):null;if(back)query.set("returnTo",back);
    for(const [key,value]of Object.entries(extra)){if(value===null)query.delete(key);else query.set(key,value);}
    return `/merchants/${merchant.merchantId}?${query}`;
  };
  const linked=workspace?.activity.find(item=>item.id===requestedTransaction);
  const topics=merchant?{SERVICE:"Merchant question",ACCESS:topicLabels.ACCESS,PAYMENT:topicLabels.PAYMENT}:{SERVICE:"Cardholder question",ACCESS:topicLabels.ACCESS,CARD:topicLabels.CARD,TRANSACTION:topicLabels.TRANSACTION};
  const requestedTopic=params.get("topic");
  const initialTopic:SupportTopic=requestedTopic&&Object.hasOwn(topics,requestedTopic)?requestedTopic as SupportTopic:merchant?.linkedPayment?"PAYMENT":linked?"TRANSACTION":"SERVICE";
  const [list,setList]=useState<SupportCaseList|null>(merchant?.initialCases??null),[detail,setDetail]=useState<SupportCaseDetail|null>(null);
  const [loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[creating,setCreating]=useState((!merchant||params.get("tab")==="help")&&params.get("new")==="1"||Boolean(merchant&&requestedPayment&&!initialCase)),[review,setReview]=useState(false);
  const [search,setSearch]=useState(""),[status,setStatus]=useState("ALL");
  const [topic,setTopic]=useState<SupportTopic>(initialTopic),[subject,setSubject]=useState(""),[message,setMessage]=useState(""),[transaction,setTransaction]=useState(linked?.id??"");
  const [includePayment,setIncludePayment]=useState(Boolean(merchant?.linkedPayment));
  const [updates,setUpdates]=useState<Record<string,string>>({}),[withdrawOpen,setWithdrawOpen]=useState(false),[reason,setReason]=useState("");
  const [notice,setNotice]=useState<{kind:"error"|"success"|"info";message:string}|null>(null),[needsRefresh,setNeedsRefresh]=useState(false),[attempt,setAttempt]=useState<Attempt|null>(null);
  const [accessUnavailable,setAccessUnavailable]=useState(false),[relatedContextAvailable,setRelatedContextAvailable]=useState(true),[leavingUnconfirmed,setLeavingUnconfirmed]=useState(false);
  const requestSerial=useRef(0),listLoaded=useRef(Boolean(merchant?.initialCases));
  const inFlight=useRef(false);
  const [opening,setOpening]=useState(Boolean(initialCase));
  const titleRef=useRef<HTMLHeadingElement>(null);
  const permitted=merchant?list?.canCreate===true:Boolean(workspace?.capabilities.some(item=>item.action==="support.cases.manage"&&item.allowed));
  if(contextChanged){setList(merchant?.initialCases??null);setDetail(null);setWithdrawOpen(false);setNotice(null);setLoading(true);setOpening(Boolean(initialCase));setBusy(false);setAccessUnavailable(false);setRelatedContextAvailable(true);setLeavingUnconfirmed(false);if(!attempt)setReview(false);}
  useMerchantNavigationLock(Boolean(merchant)&&(busy||(!!attempt&&!leavingUnconfirmed)));
  const linkedPayment=relatedContextAvailable?merchant?.linkedPayment:null;
  const shownPayment=includePayment?linkedPayment:null;
  const currentPayment=creating?shownPayment:detail?.payment;
  const paymentHref=merchant&&currentPayment?caseHref({payment:currentPayment.id}).replace("tab=help","tab=payments"):null;
  const locked=busy||Boolean(attempt)||needsRefresh||opening;
  const draft=detail?updates[detail.id]??"":"";
  function denyAccess(){setAccessUnavailable(true);setRelatedContextAvailable(false);setList(null);setDetail(null);setWithdrawOpen(false);setCreating(false);setReview(false);setSubject("");setMessage("");setUpdates({});setReason("");setTransaction("");setIncludePayment(false);}
  async function loadList(append=false) {
    const query=new URLSearchParams();if(search.trim())query.set("q",search.trim());if(status!=="ALL")query.set("status",status);if(append&&list?.nextCursor)query.set("cursor",list.nextCursor);
    try {const result=await readResult<SupportCaseList>(await fetch(`${apiBase}?${query}`,{cache:"no-store",signal:AbortSignal.timeout(30_000)}));if(!isCurrent())return;setList(current=>append&&current?{...result,cases:[...current.cases,...result.cases.filter(row=>!current.cases.some(item=>item.id===row.id))]}:result);}
    catch(error){if(!isCurrent())return;setNotice({kind:"error",message:errorMessage(error)});if(error instanceof CaseError&&[401,403,404].includes(error.status))denyAccess();}
  }
  useEffect(()=>{
    const serial=++requestSerial.current;
    void(async()=>{
      try {
        const result=merchant?.initialCases??(listLoaded.current?null:await readResult<SupportCaseList>(await fetch(apiBase,{cache:"no-store",signal:AbortSignal.timeout(30_000)})));
        const selected=initialCase?await readResult<SupportCaseDetail>(await fetch(`${apiBase}/${encodeURIComponent(initialCase)}`,{cache:"no-store",signal:AbortSignal.timeout(30_000)})):null;
        if(serial!==requestSerial.current||!isCurrent())return;
        if(result){setList(result);listLoaded.current=true;}setDetail(selected);setLoading(false);setOpening(false);if(selected)setCreating(false);
        if(initialCase)requestAnimationFrame(()=>titleRef.current?.focus());
      } catch(error){if(serial===requestSerial.current&&isCurrent()){setDetail(null);setWithdrawOpen(false);setLoading(false);setOpening(false);setNotice({kind:"error",message:errorMessage(error)});if(error instanceof CaseError&&[401,403,404].includes(error.status))denyAccess();}}
    })();
    return()=>{requestSerial.current+=1;};
  },[apiBase,context,initialCase,isCurrent,merchant?.initialCases]);
  async function choose(item:SupportCaseSummary) {
    if(busy||attempt)return;if(item.id===detail?.id){setCreating(false);return;}setOpening(true);setCreating(false);setNotice(null);setNeedsRefresh(false);
    router.replace(caseHref({case:item.id,payment:null}),{scroll:false});
  }
  async function refresh() {
    if(!detail||inFlight.current)return;setBusy(true);
    try {const fresh=await readResult<SupportCaseDetail>(await fetch(`${apiBase}/${encodeURIComponent(detail.id)}`,{cache:"no-store",signal:AbortSignal.timeout(30_000)}));if(!isCurrent())return;setDetail(fresh);setNeedsRefresh(false);setNotice({kind:"info",message:"Case refreshed. Your unsaved text is still here; review the latest replies before saving."});await loadList();}
    catch(error){if(isCurrent()){if(error instanceof CaseError&&[401,403,404].includes(error.status))denyAccess();setDetail(null);setWithdrawOpen(false);setNotice({kind:"error",message:errorMessage(error)});}}finally{if(isCurrent())setBusy(false);}
  }
  async function refreshAccess(){
    if(busy||inFlight.current)return;setBusy(true);setNotice(null);
    try{const next=await readResult<SupportCaseList>(await fetch(apiBase,{cache:"no-store",signal:AbortSignal.timeout(30_000)}));const selected=attempt?.caseId?await readResult<SupportCaseDetail>(await fetch(`${apiBase}/${encodeURIComponent(attempt.caseId)}`,{cache:"no-store",signal:AbortSignal.timeout(30_000)})):null;if(!isCurrent())return;setList(next);setDetail(selected);setAccessUnavailable(false);setNeedsRefresh(false);setLoading(false);setOpening(false);}
    catch(error){if(isCurrent()){if(error instanceof CaseError&&[401,403,404].includes(error.status))denyAccess();setNotice({kind:"error",message:errorMessage(error)});}}
    finally{if(isCurrent())setBusy(false);}
  }
  async function send(command:Attempt) {
    if(busy||inFlight.current)return;const retrying=attempt!==null;inFlight.current=true;setBusy(true);setAttempt(command);setLeavingUnconfirmed(false);setNotice(null);
    try {
      const init={method:"POST",credentials:"same-origin" as const,headers:{"Content-Type":"application/json"},body:JSON.stringify(command.body),signal:AbortSignal.timeout(30_000)};
      let response:Response;
      if(command.kind==="create")response=await fetch(apiBase,init);
      else if(command.kind==="message")response=await fetch(`${apiBase}/${encodeURIComponent(command.caseId!)}/messages`,init);
      else response=await fetch(`${apiBase}/${encodeURIComponent(command.caseId!)}/withdraw`,init);
      const saved=await readResult<SupportCaseDetail>(response);if(!isCurrent())return;if(saved.serviceId!==serviceId||command.caseId&&saved.id!==command.caseId)throw new Error("Unexpected case response");setDetail(saved);setAttempt(null);setAccessUnavailable(false);setCreating(false);setReview(false);setNeedsRefresh(false);setWithdrawOpen(false);
      if(command.kind==="create"){setSubject("");setMessage("");}else if(command.kind==="message")setUpdates(current=>({...current,[saved.id]:""}));else setReason("");
      setNotice({kind:"success",message:command.kind==="withdraw"?"Case withdrawn. Your messages and payment records are unchanged.":command.kind==="message"?"Your update is saved for support to review.":"Your question is saved for support to review."});
      await loadList();if(isCurrent())router.replace(caseHref({case:saved.id,payment:saved.payment?.id??null}),{scroll:false});
    } catch(error){
      if(!isCurrent())return;
      setNotice({kind:"error",message:errorMessage(error)});
      if(error instanceof CaseError){
        const definite=["STALE_VERSION","INVALID_STATE","INVALID_REQUEST","IDEMPOTENCY_CONFLICT","MESSAGE_LIMIT_REACHED"].includes(error.code);
        if(!retrying&&(definite||[401,403,404,422].includes(error.status)))setAttempt(null);
        if(error.status===409||error.code==="INVALID_STATE"||[401,403,404].includes(error.status))setNeedsRefresh(true);
        if([401,403,404].includes(error.status))denyAccess();
      }
    }
    finally{inFlight.current=false;if(isCurrent())setBusy(false);}
  }

  function startNew() {setOpening(false);setCreating(true);setReview(false);setNotice(null);setNeedsRefresh(false);setDetail(null);router.replace(caseHref({new:"1"}),{scroll:false});requestAnimationFrame(()=>titleRef.current?.focus());}
  function startCreate(){void send({kind:"create",body:{commandId:crypto.randomUUID(),topic,subject:subject.trim(),message:message.trim(),...(merchant?{paymentId:shownPayment?.id??null}:{transactionId:transaction||null})}});}
  if(accessUnavailable)return <section className="cases-workspace" aria-label="Support request recovery"><h2>Support access unavailable</h2>{notice&&<Feedback {...notice}/>}<p>Your current access no longer includes these case details.</p>{attempt&&<><p>The request is still unconfirmed. Its original details are retained for the same retry, which checks your current access.</p><p>Leaving does not cancel or confirm the request. Review your saved support history when access is available again.</p><Button variant="secondary" busy={busy} onClick={()=>void send(attempt)}>Retry same request</Button></>}<div className="cases-actions"><Button variant="secondary" disabled={busy} onClick={()=>void refreshAccess()}>Refresh access</Button>{attempt?<Button variant="quiet" disabled={busy} onClick={()=>{setLeavingUnconfirmed(true);router.push("/services");}}>Leave unconfirmed request</Button>:<Link href={merchant?"/merchant-services":"/cardholder-services"}>Back to your dashboard</Link>}</div></section>;
  return <section className="cases-workspace" aria-labelledby="support-cases-title">
    <header className="cases-heading"><div><p className="cases-eyebrow">YOUR SUPPORT</p><h2 id="support-cases-title" ref={titleRef} tabIndex={-1}>Keep the conversation together.</h2><p>Your questions about {contextName}.</p></div>{permitted&&<Button disabled={busy||Boolean(attempt)} onClick={startNew}>Start a case</Button>}</header>
    {merchant&&<p className="cases-context">Account owner: {merchant.primaryName}. {paymentHref&&<Link href={paymentHref}>Return to payment</Link>}</p>}
    <p className="cases-delivery-note">Only you and assigned support staff can read these conversations.</p>
    {(notice||attempt)&&<div className="cases-feedback">{notice?<Feedback kind={notice.kind} message={notice.message}/>:<Feedback kind="info" message="This request is still unconfirmed. Its saved details are kept for a safe retry."/>}{attempt&&!busy&&<Button variant="secondary" onClick={()=>void send(attempt)}>Retry same request</Button>}{needsRefresh&&detail&&<Button variant="secondary" busy={busy} onClick={()=>void refresh()}>Refresh case</Button>}{needsRefresh&&!detail&&<Button variant="secondary" disabled={busy} onClick={()=>void refreshAccess()}>Refresh access</Button>}</div>}
    <div className="cases-layout"><aside className="cases-list-panel" aria-label="Your support cases"><form className="cases-filters" onSubmit={event=>{event.preventDefault();void loadList();}}><label>Search your cases<input type="search" value={search} maxLength={100} onChange={event=>setSearch(event.target.value)} placeholder="Subject or reference"/></label><label>Support case status<select value={status} onChange={event=>setStatus(event.target.value)}><option value="ALL">All cases</option><option value="OPEN">Open</option><option value="WITHDRAWN">Withdrawn</option><option value="RESOLVED">Resolved</option></select></label><Button variant="secondary" type="submit">Apply filters</Button></form>
      {loading?<p className="cases-list-note" role="status">Loading your cases…</p>:!list?<div className="cases-list-note"><h3>Your cases could not be loaded</h3><Button variant="secondary" onClick={()=>void loadList()}>Try loading again</Button></div>:list.cases.length?<><div className="cases-list">{list.cases.map(item=><button key={item.id} type="button" className={`cases-list-item ${detail?.id===item.id&&!creating?"is-selected":""}`} onClick={()=>void choose(item)} disabled={busy||Boolean(attempt)} aria-pressed={detail?.id===item.id&&!creating}><span className="cases-list-meta">{topicLabels[item.topic]}<StatusBadge status={item.status}/></span><strong>{item.subject}</strong><span className="cases-list-reference">{item.reference}</span><span>Opened {formatDate(item.createdAt)}</span></button>)}</div>{list.nextCursor&&<Button variant="quiet" onClick={()=>void loadList(true)}>Load older cases</Button>}</>:<div className="cases-list-note"><h3>{search||status!=="ALL"?"No matching cases":"No support cases yet"}</h3><p>{search||status!=="ALL"?"Try another subject or status.":"Start a case when you need to keep a question and its updates together."}</p></div>}</aside>
      <div className="cases-detail" aria-busy={busy}>
      {opening?<p role="status">Opening your case…</p>:creating?<form onSubmit={event=>{event.preventDefault();if(review)startCreate();else setReview(true);}}>
        <p className="cases-eyebrow">{review?"REVIEW YOUR CASE":"START A CASE"}</p><h3>{review?"Ready to save your question?":"What can we help with?"}</h3><p className="cases-context">{contextName} · Your support case</p>
        {review?<><dl className="cases-review"><div><dt>Topic</dt><dd>{topicLabels[topic]}</dd></div><div><dt>Subject</dt><dd>{subject}</dd></div>{!merchant&&transaction&&<div><dt>Related transaction</dt><dd>{workspace?.activity.find(item=>item.id===transaction)?.title}</dd></div>}</dl>{shownPayment&&<SupportPaymentSummary payment={shownPayment} showLink={false}/>}<p className="cases-body-copy">{message}</p><div className="cases-next-step"><strong>What happens next</strong><p>Your question will be saved for support to review. Read replies here; email updates are not available.</p></div></>:<div className="cases-form-fields"><label>Topic<select value={topic} disabled={locked} onChange={event=>setTopic(event.target.value as SupportTopic)}>{Object.entries(topics).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label>Subject<input required maxLength={100} value={subject} disabled={locked} onChange={event=>setSubject(event.target.value)} placeholder="A short summary of your question"/></label>{merchant?<div className="cases-linked-payment">{linkedPayment?<><label className="cases-link-toggle"><input type="checkbox" checked={includePayment} disabled={locked} onChange={event=>setIncludePayment(event.target.checked)}/>Include this payment with my question</label>{includePayment&&<SupportPaymentSummary payment={linkedPayment} showLink={false}/>}</>:<p className="cases-field-note">{merchant.paymentUnavailable?"That payment is unavailable with your current access. It will not be attached to this case.":"For a payment question, open a payment and choose Get help with this payment."}</p>}</div>:<><label>Related transaction (optional)<select value={transaction} disabled={locked} onChange={event=>setTransaction(event.target.value)}><option value="">No transaction</option>{(relatedContextAvailable?workspace!.activity:[]).map(item=><option key={item.id} value={item.id}>{item.title} · {formatDate(item.occurredAt)}</option>)}</select></label>{requestedTransaction&&!linked&&<p className="cases-field-note">That transaction is no longer available. Choose another transaction or leave it blank.</p>}</>}<label>Your explanation<textarea required maxLength={2000} rows={7} value={message} disabled={locked} onChange={event=>setMessage(event.target.value)} aria-describedby="case-sensitive-help"/></label><p className="cases-field-note" id="case-sensitive-help">Include the relevant details and what you need help with. Do not enter card numbers, passwords or bank details. {message.length}/2,000</p></div>}
        <div className="cases-actions"><Button variant="quiet" disabled={locked} onClick={()=>review?setReview(false):setCreating(false)}>{review?"Edit explanation":"Cancel"}</Button><Button type="submit" busy={busy} disabled={locked||!permitted||!subject.trim()||!message.trim()}>{review?"Create case":"Review case"}</Button></div>
      </form>:detail?<>
        <header className="cases-detail-heading"><div><p className="cases-eyebrow">{topicLabels[detail.topic]}</p><h3>{detail.subject}</h3><p className="cases-reference">{detail.reference}</p></div><StatusBadge status={detail.status}/></header><p className="cases-context">{contextName} · Opened {formatDate(detail.createdAt)}</p>
        {workspace&&detail.transaction&&<Link className="cases-transaction" href={cardholderTaskHref("activity",{cardId:workspace.activity.find(item=>item.id===detail.transaction!.id)?.cardId??selectedCardId,contextId:serviceId},{transaction:detail.transaction.id})}>Related transaction: {detail.transaction.title}<span aria-hidden="true">↗</span></Link>}{detail.transactionUnavailable&&<p className="cases-field-note">The linked transaction is not available with your current access.</p>}
        {detail.payment&&<SupportPaymentSummary payment={detail.payment} receiptHref={paymentHref??undefined}/>} {detail.paymentUnavailable&&<p className="cases-field-note">The linked payment is not available with your current access.</p>}
        <div className="cases-next-step"><strong>{detail.nextActor==="CUSTOMER"?"Next step: review the support reply":detail.nextActor==="SUPPORT"?"Next step: support review":detail.status==="RESOLVED"?"Resolved by support":"Withdrawn by you"}</strong><p>{detail.nextActor==="CUSTOMER"?"Support has replied. Read the response below and add any information they need.":detail.nextActor==="SUPPORT"?"Your case is in the support queue. You can add information while it is open.":"This case no longer accepts updates. Your saved explanation and timeline remain available."}</p></div>
        <section className="cases-timeline-section"><h4>Case timeline</h4><ol className="cases-timeline">{detail.messages.map(item=><li key={item.id}><div className="cases-timeline-meta"><strong>{item.author==="SUPPORT"?(item.kind==="RESOLVED"?"Support resolved this case":"Support replied"):item.kind==="OPENED"?"You opened this case":item.kind==="WITHDRAWN"?"You withdrew this case":"You added an update"}</strong><time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time></div><p>{item.body}</p></li>)}</ol></section>
        {detail.canUpdate&&<><form className="cases-update-form" onSubmit={event=>{event.preventDefault();void send({kind:"message",caseId:detail.id,body:{commandId:crypto.randomUUID(),expectedVersion:detail.version,message:draft.trim()}});}}><label>Add an update<textarea rows={4} required maxLength={2000} value={draft} disabled={locked} onChange={event=>setUpdates(current=>({...current,[detail.id]:event.target.value}))} aria-describedby="case-update-help"/></label><p id="case-update-help" className="cases-field-note">Saved to your case only. Do not include sensitive information. {draft.length}/2,000</p><div className="cases-actions"><Button variant="quiet" disabled={locked} onClick={()=>setWithdrawOpen(true)}>Withdraw case</Button><Button type="submit" busy={busy} disabled={locked||!draft.trim()||detail.version>=100}>Save update</Button></div></form>{detail.version>=100&&<p className="cases-field-note">This case has reached its update limit. You can still view its history or withdraw it.</p>}</>}
      </>:<div className="cases-empty-detail"><EmptyState title="One place for your question" description="Choose a request to see its updates, or start a new one."/></div>}
      </div>
    </div>
    {withdrawOpen&&detail&&<WorkspaceDialog open title="Withdraw this case?" serviceName={contextName} onClose={()=>{if(!locked)setWithdrawOpen(false);}}><h3>{detail.subject}</h3><p>This closes your support request to further updates. Your cards, payments and saved messages stay unchanged.</p><label className="cases-withdraw-label">Reason for withdrawing<textarea required rows={4} maxLength={500} value={reason} disabled={locked} onChange={event=>setReason(event.target.value)}/></label><p className="cases-field-note">Your reason stays in the case timeline. {reason.length}/500</p>{notice?.kind==="error"&&<Feedback kind="error" message={notice.message}/>}<div className="cases-actions"><Button variant="secondary" disabled={locked} onClick={()=>setWithdrawOpen(false)}>Keep case open</Button><Button variant="danger" busy={busy} disabled={locked||!reason.trim()} onClick={()=>void send({kind:"withdraw",caseId:detail.id,body:{commandId:crypto.randomUUID(),expectedVersion:detail.version,reason:reason.trim()}})}>Withdraw case</Button></div>{attempt&&!busy&&<Button variant="secondary" onClick={()=>void send(attempt)}>Retry same request</Button>}{needsRefresh&&<Button variant="secondary" disabled={busy} onClick={()=>{setWithdrawOpen(false);void refresh();}}>Refresh case</Button>}</WorkspaceDialog>}
  </section>;
}

"use client";
import Link from "next/link";
import {useRef,useState,useTransition} from "react";
import {useRouter} from "next/navigation";
import type {MoneyAccountOverview,MoneyFundingIntent,MoneyWithdrawalIntent} from "@/modules/money/contracts";
import {moneyFundingIntentSchema,moneyTopupReceiptSchema,moneyWithdrawalIntentSchema,moneyWithdrawalReceiptSchema} from "@/shared/money-response";
import {Button,Feedback,StatusBadge,formatDate,WorkspaceCommandError} from "./workspace/primitives";
import {Shell} from "./shell";
import {CardholderNavigation,type CardholderView} from "./cardholder-navigation";
import {cardholderTaskHref,cardholderHomeHref} from "./cardholder-routing";
import {MerchantShell} from "./workspace/merchant-shell";
import {useMerchantNavigationLock} from "./workspace/merchant-navigation-state";
import {parseMerchantActivityFilters} from "@/shared/merchant-activity";
import type {MerchantWorkspaceProjection} from "@/modules/acquiring/contracts";
import type {MerchantOperationsProjection} from "@/modules/acquiring/operations-contracts";
import {MerchantOperations} from "./workspace/merchant-operations";
import {moneyAccountHref,moneyHistoryReceiptHref,type MoneyAccountHistory} from "./money-account-routing";
import "./cardholder-dashboard.css";
import "./money-account.css";

type Task="add"|"withdraw";
type Review=MoneyFundingIntent|MoneyWithdrawalIntent;
type Attempt={commandId:string;amountMinor:string;task:Task};
function minorAmount(value:string){const match=/^(0|[1-9]\d{0,9})(?:\.(\d{1,2}))?$/.exec(value.trim());return match?(BigInt(match[1]!)*100n+BigInt((match[2]??"").padEnd(2,"0"))).toString():null;}
export async function moneyRequest(path:string,body:unknown):Promise<unknown>{
 let response:Response;try{response=await fetch(path,{method:"POST",credentials:"same-origin",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(30000)});}catch{throw new WorkspaceCommandError("We couldn’t confirm the result. Retry this same request.",null);}
 if(!response.ok){let code="";try{code=(await response.json()).error?.code??"";}catch{}const message=code==="INSUFFICIENT_LEDGER_FUNDS"?"There isn’t enough available money. Review your balance before continuing.":[401,403,404].includes(response.status)?"This account is no longer available to you. Sign in again or return to your dashboard.":"We couldn’t complete this request. Review the details and try again.";throw new WorkspaceCommandError(message,response.status,code);}
 try{return await response.json();}catch{throw new WorkspaceCommandError("We couldn’t verify the result. Retry this same request.",null);}
}
type MoneyHomeProps={account:MoneyAccountOverview;returnTo?:string|null;settlementsUnavailable?:boolean;settlements?:{workspace:MerchantWorkspaceProjection;operations:MerchantOperationsProjection}[]};
type MoneyAccountProps=MoneyHomeProps&{task:Task|null;review:Review|null;showBackLink?:boolean;history?:MoneyAccountHistory};

/** The service overview owns the balance summary. Commands still use the saved money task below. */
export function MoneyAccountHome({account,returnTo=null,settlements=[],settlementsUnavailable=false}:MoneyHomeProps){
 const merchant=account.serviceKind==="MERCHANT",router=useRouter(),[refreshing,startRefresh]=useTransition();
 const href=(values:Record<string,string>={})=>moneyAccountHref(account.id,returnTo,values);
 return <section className="money-home" aria-label={merchant?`${account.displayName} balance`:"Card account balance"}>
  <div className="money-balance">
   <div><span>{merchant?account.displayName:"Available to spend"}</span><strong>{account.available.formatted}</strong><p>{merchant?"Available for payout · Current balance, across all dates":"One balance for your cards. Each card has its own spending limit."}</p></div>
   <div className="money-actions">
    {!merchant&&account.canAddMoney&&<Link className="consumer-button consumer-button-primary" href={href({task:"add"})}>Add money</Link>}
    {merchant&&account.canWithdraw&&<Link className="consumer-button consumer-button-primary" href={href({task:"withdraw"})}>Request payout</Link>}
    <Link className="money-activity-link" href={href(merchant?{history:"payouts"}:{})}>{merchant?"Payout history":"Money activity"}</Link>
    {(merchant||account.pendingWithdrawals.minor!=="0")&&<span>{merchant?"Payouts pending":"Returns in progress"}: {account.pendingWithdrawals.formatted}</span>}
   </div>
  </div>
  {merchant&&<details className="money-settlements money-incoming"><summary>Incoming payments <span>View settlements by terminal</span></summary><div>
   <p>Confirmed customer payments settle into your available balance before you request a payout.</p>
   {settlementsUnavailable?<><p role="status">Incoming payments are temporarily unavailable. Your available balance is shown above.</p><Button variant="secondary" busy={refreshing} onClick={()=>startRefresh(()=>router.refresh())}>Reload incoming payments</Button></>:settlements.length?settlements.map(terminal=><MerchantOperations key={terminal.workspace.merchant.id} workspace={terminal.workspace} initial={terminal.operations} section="balance" showAdministration returnTo={returnTo}/>):<p>No terminal settlements are available.</p>}
  </div></details>}
 </section>;
}
export function MoneyAccountPage(props:MoneyAccountProps){
 const {account,returnTo=null}=props;
 if(account.serviceKind==="MERCHANT"){
  const query=parseMerchantActivityFilters(returnTo?new URL(returnTo,"https://etail.invalid").searchParams:{});
  return <MerchantShell dashboardQuery={{...query,section:"overview"}} showMoney showSettings><MoneyAccountWorkspace {...props}/></MerchantShell>;
 }
 const services=account.services.filter(service=>service.kind==="CARDHOLDER");
 const contextId=services.length===1?services[0]!.id:undefined;
 const hrefFor=(view:CardholderView)=>view==="activity"?cardholderTaskHref("activity",{contextId}):cardholderHomeHref(null,view==="overview"?{}:{view});
 return <Shell authenticated activeService="CARDHOLDER"><div className="ch-dashboard"><CardholderNavigation active="overview" primary hrefFor={hrefFor} settingsHref={cardholderTaskHref("settings",{contextId})}/><div className="ch-content"><MoneyAccountWorkspace {...props}/></div></div></Shell>;
}
export function MoneyAccountWorkspace({account,task,review:initialReview,returnTo=null,showBackLink=true,history="payouts"}:MoneyAccountProps){
 const router=useRouter(),[transition,startTransition]=useTransition(),flight=useRef(false);
 const [amount,setAmount]=useState(""),[attempt,setAttempt]=useState<Attempt|null>(null),[review,setReview]=useState(initialReview),[receipt,setReceipt]=useState(initialReview?.receipt??null),[busy,setBusy]=useState(false),[error,setError]=useState(""),[unavailable,setUnavailable]=useState(false);
 const merchant=account.serviceKind==="MERCHANT",retiredFunding=merchant&&task==="add";
 const label=merchant?"Merchant available balance":"Card balance",back=returnTo??(account.serviceKind==="CARDHOLDER"?"/cardholder-services":"/merchant-services"),base=`/money-accounts/${account.id}`;
 const title=task==="add"?merchant?"Saved funding":"Add money":task==="withdraw"?merchant?"Request payout":"Return unused money":merchant?"Payouts & activity":"Account activity";
 const href=(values:Record<string,string>={})=>moneyAccountHref(account.id,returnTo,{...(merchant?{history,...(account.page>0?{page:String(account.page)}:{})}:{}),...values});
 function historyHref(path:string){
  return moneyHistoryReceiptHref(account.id,path,returnTo,merchant?history:undefined,account.page);
 }
 const locked=busy||transition;
 useMerchantNavigationLock(locked||!!attempt||!!error&&!!review&&!receipt);
 async function prepare(){if(!task||retiredFunding||flight.current||locked)return;const retrying=!!attempt;const value=minorAmount(amount);if(!attempt&&(!value||BigInt(value)<=0n)){setError("Enter an amount greater than $0, with up to two decimal places.");return;}const saved=attempt??{commandId:crypto.randomUUID(),amountMinor:value!,task};setAttempt(saved);setBusy(true);flight.current=true;setError("");try{const data=await moneyRequest(`/api/v1${base}/${saved.task==="add"?"funding":"withdrawals"}/intents`,{commandId:saved.commandId,amountMinor:saved.amountMinor});const next=saved.task==="add"?moneyFundingIntentSchema.parse(data):moneyWithdrawalIntentSchema.parse(data);if(next.id!==saved.commandId||next.moneyAccountId!==account.id||next.amount.minor!==saved.amountMinor)throw new WorkspaceCommandError("We couldn’t verify your review. Retry this same request.",null);setUnavailable(false);setReview(next);setReceipt(next.receipt);setAttempt(null);startTransition(()=>router.replace(href({task:saved.task,review:next.id}),{scroll:false}));}catch(e){if(e instanceof WorkspaceCommandError&&[401,403,404].includes(e.status??0))setUnavailable(true);else if(!retrying&&e instanceof WorkspaceCommandError&&!e.uncertain)setAttempt(null);setError(e instanceof WorkspaceCommandError?e.message:"We couldn’t verify the result. Retry this same request.");}finally{setBusy(false);flight.current=false;}}
 async function confirm(){if(!task||!review||retiredFunding||flight.current||locked)return;setBusy(true);flight.current=true;setError("");try{const data=await moneyRequest(`/api/v1${base}/${task==="add"?"funding":"withdrawals"}/intents/${review.id}`,{});const next=task==="add"?moneyTopupReceiptSchema.parse(data):moneyWithdrawalReceiptSchema.parse(data);if(next.moneyAccountId!==account.id||next.amount.minor!==review.amount.minor||task==="add"&&(!("receiptId" in review)||next.id!==review.receiptId)||task==="withdraw"&&(!("intentId" in next)||next.intentId!==review.id))throw new WorkspaceCommandError("We couldn’t verify this receipt. Retry this same request.",null);setUnavailable(false);setReceipt(next);router.refresh();}catch(e){if(e instanceof WorkspaceCommandError&&[401,403,404].includes(e.status??0))setUnavailable(true);setError(e instanceof WorkspaceCommandError?e.message:"We couldn’t verify the result. Retry this same request.");}finally{setBusy(false);flight.current=false;}}
 if(unavailable)return <section className="money-page"><h1>Account balance unavailable</h1><Feedback kind="error" message={error}/><p>Your previous account details are hidden. An unconfirmed request may already have been saved. Leaving does not cancel it.</p>{attempt?<Button busy={busy} onClick={prepare}>Retry the same review</Button>:review?<Button busy={busy} onClick={confirm}>Retry the same request</Button>:null}<Button variant="quiet" disabled={locked} onClick={()=>router.push("/services")}>Leave for now</Button></section>;
 return <section className="money-page">
 {showBackLink&&<Link className="money-back" href={back}>← {merchant?"Your payments":"Your cards"}</Link>}
 <header className="money-heading"><p className="eyebrow">{account.displayName}</p><h1>{title}</h1>{retiredFunding&&<p>Review a previously saved funding record.</p>}</header>
 <section className="money-balance money-task-balance" aria-label={label}><div><span>{merchant?"Available for payout":"Available to spend"}</span><strong>{account.available.formatted}</strong></div><div className="money-actions"><span>{merchant?"Payouts pending":"Returns in progress"}: {account.pendingWithdrawals.formatted}</span></div></section>
 {task&&!attempt&&!review&&!locked&&<Link className="money-cancel" href={back}>Cancel and return</Link>}
 {task&&<section className="money-task" aria-labelledby="money-task-title"><div><h2 id="money-task-title">{receipt?task==="add"?"Money added":merchant?"Payout requested":"Return requested":retiredFunding?"Funding review":review?task==="add"?"Review your top-up":merchant?"Review your payout":"Review your return":task==="add"?"How much would you like to add?":merchant?"How much would you like to pay out?":"How much would you like to return?"}</h2></div><Feedback kind="error" message={error}/>
 {receipt?<><div className="money-receipt-amount">{receipt.amount.formatted}</div><StatusBadge status={receipt.status}/><dl><dt>Reference</dt><dd>{receipt.reference}</dd><dt>{task==="withdraw"?"Requested":"Date"}</dt><dd>{formatDate(receipt.createdAt)}</dd>{"completedAt" in receipt&&receipt.completedAt&&<><dt>{receipt.status==="FAILED"?"Returned":"Completed"}</dt><dd>{formatDate(receipt.completedAt)}</dd></>}<dt>{task==="add"?"Added to":"From"}</dt><dd>{merchant?"Merchant available balance":label}</dd></dl>{task==="withdraw"&&<p>{receipt.status==="PENDING"?merchant?"This amount is reserved while your payout is processed. It is no longer available for another payout or refund.":"This money is set aside while your return is processed.":receipt.status==="FAILED"?merchant?"Your payout was returned to the available balance.":"This money is available to spend again.":merchant?"Your payout is complete.":"Your return is complete."}</p>}<Link className="consumer-button" href={href()}>{merchant?"Back to payout history":"View money activity"}</Link></>:retiredFunding?<><p>Merchant balances now receive settled customer payments. Adding money is no longer available.</p>{review&&<dl><dt>Saved amount</dt><dd>{review.amount.formatted}</dd><dt>Review saved</dt><dd>{formatDate(review.createdAt)}</dd></dl>}{review&&<p>This saved review has not added money to your balance.</p>}<Link className="consumer-button consumer-button-secondary" href={href()}>View payout history</Link></>:review?<><dl><dt>Amount</dt><dd>{review.amount.formatted}</dd><dt>{task==="add"?"To":"From"}</dt><dd>{merchant?"Merchant available balance":label}</dd><dt>{task==="add"?"From":"To"}</dt><dd>{merchant?"Payout processing":"sourceLabel" in review?review.sourceLabel:"Return processing"}</dd></dl><p>{task==="add"?"Confirm to add this amount to your available balance.":merchant?"Confirm to reserve this amount for your payout. It will no longer be available for refunds or another payout.":"Confirm to set this amount aside for return. It will no longer be available to spend."}</p><Button busy={locked} onClick={confirm}>{error?"Retry this same request":task==="add"?"Confirm and add money":merchant?"Confirm payout":"Confirm return"}</Button>{!error&&!locked&&<Link className="money-edit" href={href({task})}>Change amount</Link>}</>:<form onSubmit={event=>{event.preventDefault();void prepare();}}><label htmlFor="money-amount">Amount (USD)</label><input id="money-amount" value={amount} onChange={event=>setAmount(event.target.value)} inputMode="decimal" autoComplete="off" placeholder="0.00" disabled={locked||!!attempt}/><p>You’ll review the amount before confirming.</p><Button type="submit" busy={locked}>{attempt?"Retry the same review":"Continue"}</Button>{attempt&&<p>The original amount is kept until we can confirm its result.</p>}</form>}</section>}
 {merchant&&!task&&<nav className="money-history-tabs" aria-label="Balance history"><Link href={href({history:"payouts",page:"0"})} aria-current={history==="payouts"?"page":undefined}>Payout history</Link><Link href={href({history:"balance",page:"0"})} aria-current={history==="balance"?"page":undefined}>Balance activity</Link></nav>}
 {merchant&&!task&&history==="payouts"&&<section className="money-history money-payout-history" aria-labelledby="money-payouts-title"><h2 id="money-payouts-title">Payout history</h2>{account.withdrawals.length?<ul>{account.withdrawals.map(payout=><li key={payout.id}><div><strong><Link href={href({task:"withdraw",review:payout.intentId})}>{payout.reference}</Link></strong><span>Requested {formatDate(payout.createdAt)}{payout.completedAt?` · ${payout.status==="FAILED"?"Returned":"Completed"} ${formatDate(payout.completedAt)}`:""}</span></div><StatusBadge status={payout.status}/><strong>{payout.amount.formatted}</strong></li>)}</ul>:<p>No payouts on this page.</p>}{(account.page>0||account.withdrawalsHasMore)&&<nav aria-label="Payout history pages">{account.page>0&&<Link href={href({page:String(account.page-1)})}>Newer payouts</Link>}<span>Page {account.page+1}</span>{account.withdrawalsHasMore&&<Link href={href({page:String(account.page+1)})}>Older payouts</Link>}</nav>}</section>}
 {(!task&&(!merchant||history==="balance"))&&<section className="money-history" aria-labelledby="money-history-title"><h2 id="money-history-title">{merchant?"Balance activity":"Money activity"}</h2>{account.history.length?<ul>{account.history.map(item=>{const receiptHref=item.href?historyHref(item.href):null;return <li key={item.id}><div><strong>{receiptHref?<Link href={receiptHref}>{merchant?item.label.replace("Withdrawal","Payout"):item.label.replace("Withdrawal requested","Return requested").replace("Withdrawal returned","Return restored")}</Link>:item.label}</strong><span>{formatDate(item.createdAt)} · {item.id.slice(0,8).toUpperCase()}</span></div><strong>{item.amount.formatted}</strong></li>})}</ul>:<p>Your balance activity will appear here.</p>}{(account.page>0||account.hasMore)&&<nav aria-label="Money activity pages">{account.page>0&&<Link href={href({page:String(account.page-1)})}>Newer activity</Link>}<span>Page {account.page+1}</span>{account.hasMore&&<Link href={href({page:String(account.page+1)})}>Older activity</Link>}</nav>}</section>}</section>;
}

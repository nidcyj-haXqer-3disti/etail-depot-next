"use client";
import Link from "next/link";
import {useRef,useState} from "react";
import {useRouter} from "next/navigation";
import type {MoneyWithdrawalReceipt} from "@/modules/money/contracts";
import {moneyWithdrawalReceiptSchema} from "@/shared/money-response";
import {moneyRequest} from "./money-account";
import {Button,Feedback,formatDate,WorkspaceCommandError} from "./workspace/primitives";
export function MoneyWithdrawalProcessing({withdrawals}:{withdrawals:(MoneyWithdrawalReceipt&{accountName:string})[]}){
 return <section className="page-container"><p className="eyebrow">CUSTOMER CARE</p><h1>Withdrawal processing</h1><p>Review withdrawals for the accounts assigned to you.</p><Link href="/operations">Back to customer care</Link>{withdrawals.length?withdrawals.map(item=><WithdrawalRow key={item.id} withdrawal={item}/>):<p>No withdrawals are waiting for your review.</p>}</section>;
}
function WithdrawalRow({withdrawal}:{withdrawal:MoneyWithdrawalReceipt&{accountName:string}}){
 const router=useRouter(),flight=useRef(false),[choice,setChoice]=useState<"COMPLETED"|"FAILED"|null>(null),[commandId,setCommandId]=useState<string|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(""),[hidden,setHidden]=useState(false),[saved,setSaved]=useState<MoneyWithdrawalReceipt|null>(null);
 async function confirm(){if(!choice||busy||flight.current)return;flight.current=true;setBusy(true);setError("");const id=commandId??crypto.randomUUID();setCommandId(id);
 try{const data=await moneyRequest(`/api/v1/operations/money-withdrawals/${withdrawal.id}`,{commandId:id,outcome:choice});const parsed=moneyWithdrawalReceiptSchema.safeParse(data);if(!parsed.success||parsed.data.id!==withdrawal.id||parsed.data.intentId!==withdrawal.intentId||parsed.data.moneyAccountId!==withdrawal.moneyAccountId||parsed.data.amount.minor!==withdrawal.amount.minor||parsed.data.status!==choice)throw new WorkspaceCommandError("We couldn’t verify this result. Retry the saved request.",null);setHidden(false);setSaved(parsed.data);router.refresh();}
 catch(e){if(e instanceof WorkspaceCommandError&&[401,403,404].includes(e.status??0))setHidden(true);setError(e instanceof WorkspaceCommandError?e.message:"We couldn’t verify this result. Retry the saved request.");}finally{flight.current=false;setBusy(false);}}
 return <article className="money-task">{hidden?<h2>Withdrawal unavailable</h2>:<><h2>{withdrawal.accountName}</h2><p>{withdrawal.amount.formatted} · {withdrawal.reference} · {formatDate(withdrawal.createdAt)}</p></>}<Feedback kind="error" message={error}/>{saved?<p role="status">{saved.status==="COMPLETED"?"Withdrawal completed.":"Withdrawal returned to the available balance."}</p>:choice?<><p>{hidden?"Details are hidden while your access is unavailable.":choice==="COMPLETED"?"Record this withdrawal as completed?":"Return this withdrawal to the available balance?"}</p><Button busy={busy} onClick={confirm}>{commandId?"Retry the same result":"Confirm result"}</Button>{!commandId&&<Button variant="quiet" onClick={()=>setChoice(null)}>Cancel</Button>}</>:<div className="consumer-action-row"><Button onClick={()=>setChoice("COMPLETED")}>Complete withdrawal</Button><Button variant="secondary" onClick={()=>setChoice("FAILED")}>Return money</Button></div>}</article>;
}

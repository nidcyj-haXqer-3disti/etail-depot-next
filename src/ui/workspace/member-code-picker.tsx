"use client";
import {useEffect,useRef,useState} from "react";
import {Button,Feedback} from "./primitives";
import "../sandbox.css";
type Person={id:string;displayName:string};
/** Exact shared-code lookup only; no provider user directory is returned. */
export function MemberCodePicker({disabled=false,onSelect}:{disabled?:boolean;onSelect:(person:Person|null)=>void}) {
 const [code,setCode]=useState(""),[person,setPerson]=useState<Person|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const serial=useRef(0);useEffect(()=>()=>{serial.current++;},[]);
 async function find(){const request=++serial.current;setBusy(true);setError("");setPerson(null);onSelect(null);
  try{const response=await fetch(`/api/v1/sandbox/recipient?code=${encodeURIComponent(code.trim())}`,{credentials:"same-origin",cache:"no-store"});if(request!==serial.current)return;
   if(!response.ok)throw new Error(response.status===401?"Sign in again before inviting someone.":"No member found. Check the code with the person you want to invite.");
   const next=await response.json() as Person;if(request!==serial.current)return;setPerson(next);onSelect(next);
  }catch(e){if(request===serial.current)setError(e instanceof Error?e.message:"Please retry.");}finally{if(request===serial.current)setBusy(false);}
 }
 return <div className="sandbox-recipient"><label>Member code<input value={code} maxLength={23} placeholder="ED-…" disabled={disabled} autoComplete="off" spellCheck={false} onChange={e=>{serial.current++;setBusy(false);setCode(e.target.value.toUpperCase());setPerson(null);onSelect(null);setError("");}}/></label><p>Ask the person to open Your profile and share their member code.</p><Button variant="secondary" disabled={disabled||code.trim().length!==23} busy={busy} onClick={()=>void find()}>Find member</Button>{person&&<p role="status">Selected: <strong>{person.displayName}</strong></p>}<Feedback kind="error" message={error}/></div>;
}

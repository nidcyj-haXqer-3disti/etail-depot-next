"use client";
import Link from "next/link";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {displayNameSchema,personalProfileSchema,readProfileUpdate,type PersonalProfile} from "@/shared/personal-profile";
import {Button,Feedback} from "./workspace/primitives";
import {pendingProfiles,usePendingProfile} from "./pending-profile";
import {Icon} from "./icon";
import "./personal-profile.css";

export function PersonalProfileWorkspace({initial}:{initial:PersonalProfile}){
  const router=useRouter();
  const [profile,setProfile]=useState(initial),[name,setName]=useState(initial.displayName);
  const [loading,setLoading]=useState(false),[stale,setStale]=useState(false),[signInRequired,setSignInRequired]=useState(false);
  const [feedback,setFeedback]=useState<{kind:"success"|"error"|"info";message:string}|null>(null);
  const pending=usePendingProfile(initial.personId);
  const previousPending=useRef<string|null>(null),[source,setSource]=useState(initial);
  useEffect(()=>{
    if(previousPending.current&&!pending)router.refresh();
    previousPending.current=pending?.attempt.commandId??null;
  },[pending,router]);
  if(source!==initial){
    setSource(initial);
    if(initial.personId===profile.personId){
      if(!pending&&initial.version>profile.version){
        const untouched=name===profile.displayName;setProfile(initial);
        if(untouched)setName(initial.displayName);else setStale(true);
      }else if(initial.signInEmail?.address!==profile.signInEmail?.address||initial.signInEmail?.verifiedAt!==profile.signInEmail?.verifiedAt){
        // Verified contact has its own lifecycle; a name draft must not keep it stale.
        setProfile({...profile,signInEmail:initial.signInEmail});
      }
    }
  }
  const busy=loading||!!pending?.inFlight;
  const shownName=pending?.attempt.displayName??name;
  async function save(event:FormEvent){
    event.preventDefault();if(busy||stale||signInRequired)return;
    const parsed=displayNameSchema.safeParse(name);
    if(!pending&&!parsed.success){setFeedback({kind:"error",message:"Enter a display name between 1 and 80 characters."});return;}
    const attempt=pending?.attempt??{commandId:crypto.randomUUID(),expectedPersonId:profile.personId,expectedVersion:profile.version,displayName:parsed.data!};
    if(!pendingProfiles.begin(profile.personId,attempt))return;
    setFeedback(null);
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30_000);
    try{
      const response=await fetch("/api/v1/profile",{method:"PUT",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(attempt),signal:controller.signal});
      if(!response.ok){
        if(response.status===401||response.status===403){setSignInRequired(true);throw new Error("Sign in again to continue. Your original edit is kept for retry.");}
        if([400,409,422].includes(response.status)){
          pendingProfiles.finish(profile.personId,attempt.commandId);
          if(response.status===409)setStale(true);
          throw new Error(response.status===409?"Your profile changed in another session. Load the latest details before editing again.":"Check your display name and try again.");
        }
        throw new Error("We couldn’t confirm the save. Retry to check the same edit.");
      }
      const saved=readProfileUpdate(await response.json(),profile.personId,attempt);
      if(!saved)throw new Error("We couldn’t confirm the save. Retry to check the same edit.");
      pendingProfiles.finish(profile.personId,attempt.commandId);
      setProfile(saved.profile);setName(saved.profile.displayName);setStale(false);
      setFeedback({kind:"success",message:saved.profile.version>saved.savedVersion?"Your edit was saved. A newer change is now shown.":"Your profile is updated."});router.refresh();
    }catch(error){
      pendingProfiles.retain(profile.personId,attempt.commandId);
      setFeedback({kind:"error",message:error instanceof Error&&error.constructor===Error?error.message:"We couldn’t confirm the save. Retry to check the same edit."});
    }finally{clearTimeout(timer);}
  }
  async function reload(){
    if(busy||pending)return;setLoading(true);setFeedback(null);
    try{
      const response=await fetch("/api/v1/profile",{credentials:"same-origin",cache:"no-store"});
      if(response.status===401||response.status===403){setSignInRequired(true);throw new Error("Sign in again to load your profile.");}
      if(!response.ok)throw new Error("We couldn’t load your profile. Please retry.");
      const parsed=personalProfileSchema.safeParse(await response.json());
      if(!parsed.success||parsed.data.personId!==initial.personId||parsed.data.version<profile.version)throw new Error("We couldn’t confirm your latest profile. Please retry.");
      setProfile(parsed.data);setName(parsed.data.displayName);setStale(false);setSignInRequired(false);setFeedback({kind:"info",message:"Your latest details are loaded."});
    }catch(error){setFeedback({kind:"error",message:error instanceof Error?error.message:"We couldn’t load your profile."});}finally{setLoading(false);}
  }
  return <div className="personal-profile-workspace">
    <section className="personal-profile-identity" aria-label="Your details"><span className="personal-profile-avatar" aria-hidden="true">{profile.displayName.slice(0,1).toUpperCase()}</span><div><h2>{profile.displayName}</h2></div></section>
    <section className="personal-profile-panel" aria-labelledby="profile-details-heading"><div className="personal-profile-section-heading"><span className="personal-profile-icon"><Icon name="person"/></span><div><h2 id="profile-details-heading">Personal details</h2></div></div>
      <form onSubmit={save}><label htmlFor="personal-display-name">Display name</label><input id="personal-display-name" name="displayName" autoComplete="nickname" value={shownName} maxLength={80} required disabled={busy||!!pending||stale||signInRequired} onChange={event=>setName(event.target.value)} aria-describedby="profile-name-description"/><p id="profile-name-description" className="personal-profile-hint">You can use a preferred name. This does not change a card label or your business name.</p>
        {feedback&&<Feedback {...feedback}/>}{pending&&!feedback&&<Feedback kind="info" message="An earlier edit needs confirmation. Retry to check the same saved request."/>}
        <div className="personal-profile-actions">{stale?<Button variant="secondary" busy={loading} onClick={()=>void reload()}>Load latest details</Button>:<Button type="submit" busy={!!pending?.inFlight} disabled={signInRequired||loading||!pending&&(!name.trim()||name.trim()===profile.displayName)}>{pending?"Retry save":"Save changes"}</Button>}{signInRequired&&<Link className="consumer-button consumer-button-secondary" href="/login">Sign in to continue</Link>}</div>
      </form>
    </section>
    <section className="personal-profile-panel" aria-labelledby="profile-sign-in-heading"><div className="personal-profile-section-heading"><span className="personal-profile-icon"><Icon name="lock"/></span><div><h2 id="profile-sign-in-heading">Sign-in &amp; security</h2></div></div>
      <dl className="personal-profile-contact"><dt>Sign-in email</dt><dd>{profile.signInEmail?<><span>{profile.signInEmail.address}</span><span className="personal-profile-verified">Verified</span></>:"No verified email is available for this sign-in."}</dd></dl>
      <div className="personal-profile-security-action"><Link className="consumer-button consumer-button-secondary" href="/security">Manage sign-ins</Link></div>
    </section>
  </div>;
}

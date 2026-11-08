"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { DEVELOPER_NAVIGATION,type DeveloperSlug } from "@/shared/site/developer-paths";

export function DeveloperNavigation({current}:{current:DeveloperSlug}) {
 const root=useRef<HTMLElement>(null); const previous=useRef<HTMLElement|null>(null);
 useEffect(()=>{
  const query=window.matchMedia("(max-width: 1000px)");
  const restore=()=>{
   const el=root.current; if(!el)return;
   const active=document.activeElement;
   const focused=active instanceof HTMLElement && el.contains(active)?active:active===document.body?previous.current:null;
   if(!focused||focused.getClientRects().length)return;
   if(query.matches)el.closest(".docs-workspace")?.querySelector<HTMLElement>("h1")?.focus({preventScroll:true});
  };
  query.addEventListener("change",restore);return()=>query.removeEventListener("change",restore);
 },[]);
 const items=<div className="docs-nav-group"><p>Developers</p><ul>{DEVELOPER_NAVIGATION.map(page=><li key={page.slug}><Link prefetch={false} href={page.href} aria-current={current===page.slug?"page":undefined}>{page.label}</Link></li>)}</ul></div>;
 return <nav ref={root} className="docs-navigation" aria-label="Developer pages" onFocusCapture={e=>{if(e.target instanceof HTMLElement)previous.current=e.target;}} onBlur={e=>{if(e.relatedTarget&&!e.currentTarget.contains(e.relatedTarget))previous.current=null;}}>
  <div className="docs-nav-desktop">{items}</div>
 </nav>;
}

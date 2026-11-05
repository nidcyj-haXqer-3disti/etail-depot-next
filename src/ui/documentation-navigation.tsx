"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { documentationGroups, documentationPages, documentationPath, type DocumentationSlug } from "@/modules/public-site/documentation-catalog";

export function DocumentationNavigation({current}:{current?:DocumentationSlug}) {
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
 const items=<>
  <Link href="/docs" aria-current={!current?"page":undefined} className="docs-nav-overview">Overview</Link>
  {documentationGroups.map(group=><div className="docs-nav-group" key={group}><p>{group}</p><ul>{documentationPages.filter(p=>p.group===group).map(p=><li key={p.slug}><Link href={documentationPath(p.slug)} aria-current={current===p.slug?"page":undefined}>{p.title}</Link></li>)}</ul></div>)}
 </>;
 return <nav ref={root} className="docs-navigation" aria-label="Documentation topics" onFocusCapture={e=>{if(e.target instanceof HTMLElement)previous.current=e.target;}} onBlur={e=>{if(e.relatedTarget&&!e.currentTarget.contains(e.relatedTarget))previous.current=null;}}>
  <div className="docs-nav-desktop">{items}</div>
 </nav>;
}

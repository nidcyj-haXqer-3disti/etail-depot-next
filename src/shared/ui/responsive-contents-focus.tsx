"use client";

import { useEffect } from "react";

// Rendered after the article during SSR, so saved reloads align before hydration.
// Keeping this fixed initializer in the existing client island avoids adding the
// script text to every route's shared server payload. No extra script is fetched.
const restoreReadingSection = `(function(){
var nav=performance.getEntriesByType('navigation')[0],target;
if(!nav||nav.type!=='reload')return;
try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)))}catch(_){}
if(!target||!target.closest('.docs-article'))return;
var hash=location.hash,moved=false,events=['pointerdown','touchstart','wheel','keydown'];
function keep(){moved=true}
function align(){if(!moved&&location.hash===hash&&target.isConnected)target.scrollIntoView({behavior:'instant',block:'start'})}
function stop(){events.forEach(function(name){removeEventListener(name,keep,true)})}
events.forEach(function(name){addEventListener(name,keep,{capture:true,passive:true})});
align();
addEventListener('pageshow',function(event){
if(event.persisted||moved){stop();return}
requestAnimationFrame(function(){align();stop()})
},{once:true})
})();`;

/** Enhances native contents and saved reloads without client-rendering the article. */
export function ResponsiveContentsFocus({ rootSelector, desktopSelector, mobileSelector, breakpoint }: {
  rootSelector: string;
  desktopSelector: string;
  mobileSelector: string;
  breakpoint: number;
}) {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const query = window.matchMedia(`(max-width: ${breakpoint}px)`);
    let previous: HTMLElement | null = null;
    const inContents = (target: EventTarget | null): target is HTMLElement =>
      target instanceof HTMLElement && root.contains(target) && Boolean(target.closest(`${desktopSelector}, ${mobileSelector}`));
    const remember = (event: Event) => { previous = inContents(event.target) ? event.target : null; };
    const restore = () => {
      const active = document.activeElement;
      const focused = inContents(active) ? active : active === document.body ? previous : null;
      if (!focused?.isConnected || focused.getClientRects().length) return;
      const scope = root.querySelector(query.matches ? mobileSelector : desktopSelector);
      const links = [...(scope?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? [])];
      const target = links.find(link => link.getAttribute("href") === focused.getAttribute("href")) ?? links[0];
      if (scope instanceof HTMLDetailsElement) scope.open = true;
      target?.focus({ preventScroll: true });
    };
    document.addEventListener("focusin", remember);
    document.addEventListener("pointerdown", remember);
    query.addEventListener("change", restore);
    return () => {
      document.removeEventListener("focusin", remember);
      document.removeEventListener("pointerdown", remember);
      query.removeEventListener("change", restore);
    };
  }, [rootSelector, desktopSelector, mobileSelector, breakpoint]);
  return <script dangerouslySetInnerHTML={{ __html: restoreReadingSection }} />;
}

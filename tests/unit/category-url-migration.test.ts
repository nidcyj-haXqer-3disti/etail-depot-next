import { readFileSync } from "node:fs";
import { expect,test,vi } from "vitest";
import { CORE_PAGE_MOVES,currentPublicHref } from "../../src/shared/site/page-url-migrations";
import { DOCUMENTATION_REDIRECTS } from "../../src/shared/site/developer-paths";
import { PUBLIC_CONTENT_PATHS,INDEXABLE_PUBLIC_PATHS,publicPayloadPath } from "../../src/shared/site/public-page-inventory";
import { publicPageRedirect,retiredRoute } from "../../src/shared/site/public-routes";
import { handlePublicRequest } from "../../netlify/edge-functions/public-boundary";
import { forbiddenStatic } from "../../tools/public-artifact-policy";
const map=JSON.parse(readFileSync("docs/plans/category-url-map.json","utf8")) as {pages:{from:string;to:string}[]};

test("every reviewed old page has one unique final address without redirect chains",()=>{
 expect(map.pages).toHaveLength(3751);
 expect(map.pages.filter(p=>p.from!==p.to)).toHaveLength(3738);
 expect(map.pages.map(p=>p.to).sort()).toEqual([...PUBLIC_CONTENT_PATHS].sort());
 expect(new Set(map.pages.map(p=>p.to)).size).toBe(3751);
 expect(INDEXABLE_PUBLIC_PATHS).toHaveLength(3731);
 for(const {from,to} of map.pages){
  expect(publicPageRedirect(to)).toBeNull();
  expect(currentPublicHref(from+"#saved-section")).toBe(to+"#saved-section");
  if(from!==to)for(const suffix of ["","/",".html","/index.html"])expect(publicPageRedirect(from+suffix)).toBe(to);
 }
 for(const [from,to] of Object.entries(DOCUMENTATION_REDIRECTS)){expect(publicPageRedirect(from)).toBe(to);expect(publicPageRedirect(to)).toBeNull();}
});

test("legacy redirects never forward queries or submitted bodies",async()=>{
 for(const from of [...Object.keys(CORE_PAGE_MOVES),"/guides/iso-20022/payment-transaction-status/rcvd","/guides/iso-8583/messages/2100"]){
  const destination=publicPageRedirect(from);expect(destination).not.toBeNull();
  for(const method of ["GET","HEAD","POST","PUT"]){
   const request=new Request(`https://etaildepot.com${from}?email=do-not-forward`,{method,...(["POST","PUT"].includes(method)?{body:"do-not-read"}:{})});
   const next=vi.fn(async()=>new Response("unexpected"));const response=await handlePublicRequest(request,{next,deploy:{context:"dev"}},{});
   expect(response.status).toBe(["GET","HEAD"].includes(method)?308:405);
   expect(request.bodyUsed).toBe(false);expect(next).not.toHaveBeenCalled();
   if(["GET","HEAD"].includes(method)){expect(response.headers.get("location")).toBe(`https://etaildepot.com${destination}`);expect(await response.text()).toBe("");}
   else expect(response.headers.has("location")).toBe(false);
  }
 }
});

test("only exact public service exports are exempt from the retired account family",async()=>{
 for(const path of PUBLIC_CONTENT_PATHS.filter(p=>p.startsWith('/services/'))){
  for(const suffix of ['','.html','/index.html','.txt'])expect(retiredRoute(path+suffix)).toBeNull();
  expect(forbiddenStatic(path.slice(1)+'.html')).toBe(false);
  const response=await handlePublicRequest(new Request('https://etaildepot.com'+path,{method:'POST',body:'do-not-read'}),{next:async()=>new Response('unexpected')},{});expect(response.status).toBe(405);
 }
 for(const path of ['/services','/services/old-account','/services/payouts/transfer','/api/checkout'])expect(retiredRoute(path)).not.toBeNull();
 for(const file of ['services/old-account.html','services/payouts/transfer.html','services/payouts.json'])expect(forbiddenStatic(file)).toBe(true);
 for(const path of ['/guides/iso-20022/not-a-set','/guides/iso-8583/messages/9999','/docs/unknown','/merchant-onboarding/submit','/merchant-onboarding.txt'])expect(publicPageRedirect(path)).toBeNull();
});

test("nested reference payloads use the new resources route segments",()=>{
 expect(publicPayloadPath('/resources/guides/iso-20022/purpose/__next.resources.guides.iso-20022.$d$set.__PAGE__.txt')).toBe('/resources/guides/iso-20022/purpose');
 expect(publicPayloadPath('/resources/guides/iso-20022/purpose/sala/__next.resources.guides.iso-20022.$d$set.$d$code.__PAGE__.txt')).toBe('/resources/guides/iso-20022/purpose/sala');
 expect(publicPayloadPath('/guides/iso-20022/purpose/__next.guides.iso-20022.$d$set.__PAGE__.txt')).toBeNull();
});

import {PUBLIC_APP_URL} from "./public-origin";

/** Only a canonical checkout locator can leave the publication workspace. */
export function paymentPublicationUrl(value:string,publicationId:string,currentOrigin:string):string|null {
 try{const url=new URL(value,currentOrigin);const allowed=new Set([new URL(PUBLIC_APP_URL).origin,new URL(currentOrigin).origin]);
  if(!allowed.has(url.origin)||!["https:","http:"].includes(url.protocol)||url.username||url.password||url.search||url.hash||url.pathname!==`/checkout/${publicationId}`)return null;
  return url.href;
 }catch{return null;}
}
export function paymentShareMessage(business:string,description:string,amount:string,url:string){return `${business}: ${description} · ${amount}. Review your payment and pay by card: ${url}`;}
export function paymentWebsiteButton(url:string){const safe=url.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");return `<a href="${safe}" target="_blank" rel="noopener noreferrer">Pay by card</a>`;}

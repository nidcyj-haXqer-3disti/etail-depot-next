import {expect,test,type Page,type Request} from "@playwright/test";
import type {GuestPublication} from "../../../src/modules/acquiring/guest-contracts";

/** Explicit user handoffs are inspected locally; this helper never sends a message. */
export async function checkPublishedSharing(page:Page,publication:GuestPublication){
 const detail=page.getByRole("dialog",{name:"Payment request details",exact:true}),share=detail.getByRole("region",{name:"Customer payment link",exact:true});
 const originalViewport=page.viewportSize();
 async function capturePreview(name:string){
  await expect(share).toContainText("Ready for customers");
  await share.locator(".mcp-share-preview .channel-medium").scrollIntoViewIfNeeded();
  if(name==="Invoice"||name==="Bill"){
   const amount=share.locator(".mcp-share-preview .channel-document-item > strong");
   await expect(amount).toHaveText(publication.amount.formatted);
   const rendered=await amount.evaluate(element=>{
    const range=document.createRange();range.selectNodeContents(element);
    const lines=Array.from(range.getClientRects()).filter(rect=>rect.width>0&&rect.height>0),container=element.closest(".channel-medium")!.getBoundingClientRect();
    return {lines:new Set(lines.map(rect=>Math.round(rect.top))).size,inBounds:lines.every(rect=>rect.left>=container.left-1&&rect.right<=container.right+1)};
   });
   expect(rendered).toEqual({lines:1,inBounds:true});
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
  await page.screenshot({path:test.info().outputPath(`available-payment-${name.toLowerCase().replaceAll(" ","-")}-${page.viewportSize()!.width}.png`),fullPage:true,animations:"disabled"});
 }
 const writes:string[]=[],observe=(request:Request)=>{if(!["GET","HEAD","OPTIONS"].includes(request.method()))writes.push(request.method()+" "+new URL(request.url()).pathname);};
 await page.evaluate(()=>{
  const capture={copied:[] as string[],shared:[] as ShareData[],prints:0};
  Object.defineProperty(window,"etailSharingCheck",{configurable:true,value:capture});
  Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async(value:string)=>{capture.copied.push(value);}}});
  Object.defineProperty(navigator,"share",{configurable:true,value:async(value:ShareData)=>{capture.shared.push(value);}});
  window.print=()=>{capture.prints++;};
 });
 page.on("request",observe);
 try{
  const tabs=share.getByRole("tablist",{name:"Share this payment request",exact:true});
  const names=["Text","Email","Invoice","Bill","Social","QR code","Website"];
  await expect(tabs.getByRole("tab")).toHaveCount(7);
  for(const name of names){
   const tab=tabs.getByRole("tab",{name,exact:true});await tab.click();await expect(tab).toHaveAttribute("aria-selected","true");
   expect((await tab.boundingBox())!.height).toBeGreaterThanOrEqual(44);
   await expect(share.getByRole("link",{name:"Preview payment page",exact:true})).toHaveAttribute("href",publication.publicHref);
   await expect(share.locator(".mcp-share-preview")).toContainText(publication.description);
   await expect(share.locator(".mcp-share-preview")).toContainText(publication.amount.formatted);
   await expect(share.getByRole("group",{name:"Card networks",exact:true})).toContainText("American Express");
   await capturePreview(name);
   if(name==="Text"||name==="Email"||name==="Social"){
    const label=name==="Text"?"Open text message":name==="Email"?"Open email":"Open WhatsApp";
    const target=new URL((await share.getByRole("link",{name:label,exact:true}).getAttribute("href"))!);
    expect(target.protocol).toBe(name==="Text"?"sms:":name==="Email"?"mailto:":"https:");
    const message=target.searchParams.get(name==="Social"?"text":"body")!;
    expect(message).toContain(publication.publicHref);expect(message).toContain(publication.description);expect(message).toContain(publication.amount.formatted);
    if(name==="Social"){expect(target.origin).toBe("https://wa.me");await share.getByRole("button",{name:"More sharing options",exact:true}).click();}
   }else if(name==="Invoice"||name==="Bill")await share.getByRole("button",{name:"Print payment request",exact:true}).click();
   else if(name==="QR code"){
    const download=share.getByRole("link",{name:"Download QR code",exact:true});await expect(download).toHaveAttribute("href",`/api/v1/guest/publications/${publication.id}/qr`);
    const qr=await page.request.get((await download.getAttribute("href"))!);expect(qr.status()).toBe(200);expect(qr.headers()["content-type"]).toContain("image/");
   }else{
    await expect(share.getByRole("textbox",{name:"Website button code",exact:true})).toHaveValue(`<a href="${publication.publicHref}" target="_blank" rel="noopener noreferrer">Pay by card</a>`);
    await share.getByRole("button",{name:"Copy website button",exact:true}).click();
   }
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
  }
  if(originalViewport&&originalViewport.width>800){
   await page.setViewportSize({width:320,height:900});
   for(const name of names){
    const tab=tabs.getByRole("tab",{name,exact:true});await tab.click();
    await expect(tab).toHaveAttribute("aria-selected","true");
    await expect(share.getByRole("link",{name:"Preview payment page",exact:true})).toHaveAttribute("href",publication.publicHref);
    await capturePreview(name);
   }
   await page.setViewportSize(originalViewport);
  }
  await share.getByRole("button",{name:"Copy payment link",exact:true}).click();
  const captured=await page.evaluate(()=>(window as unknown as {etailSharingCheck:{copied:string[];shared:ShareData[];prints:number}}).etailSharingCheck);
  expect(captured.prints).toBe(2);expect(captured.shared).toHaveLength(1);expect(captured.shared[0].url).toBe(publication.publicHref);expect(captured.copied).toHaveLength(2);expect(captured.copied[1]).toBe(publication.publicHref);
  const last=tabs.getByRole("tab",{name:"Website",exact:true});await last.focus();await page.keyboard.press("Home");await expect(tabs.getByRole("tab",{name:"Text",exact:true})).toBeFocused();await page.keyboard.press("End");await expect(last).toBeFocused();
  expect(writes).toEqual([]);
 }finally{page.off("request",observe);if(originalViewport)await page.setViewportSize(originalViewport);}
}

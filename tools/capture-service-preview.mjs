#!/usr/bin/env node
/** Read-only fresh-preview visual audit. The only writes are fictional sign-ins. */
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {promises as fs} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
if(process.argv.slice(2).join(' ')!=='--local-preview-3100'||process.env.CI&&process.env.CI!=='false'||process.env.NETLIFY||process.env.SITE_ID||process.env.CONTEXT)throw new Error('Use --local-preview-3100 with the prepared local fresh preview only.');
const origin='http://127.0.0.1:3100',root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'artifacts/fresh-services/visual');
process.umask(0o077);await fs.mkdir(out,{recursive:true,mode:0o700});if((await fs.readdir(out)).length)throw new Error('Preserve existing visual evidence before another capture.');
const checks=[],errors=[],preserved=[];let current=null,assignedTerminalId=null;
const browser=await chromium.launch();
async function json(context,url){const r=await context.request.get(origin+url);if(!r.ok())throw new Error(`Scoped read failed: ${r.status()} ${url}`);return r.json();}
async function audit(page,role,width,name){
 current={role,width,name};await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const geometry=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),moneyBottom:document.querySelector('.ch-focus-balance')?.getBoundingClientRect().bottom??null,controlBottom:document.querySelector('.ch-focus-actions button')?.getBoundingClientRect().bottom??null}));
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 const violations=axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
 const file=`${role}-${name}-${width}.png`;await page.screenshot({path:path.join(out,file),fullPage:!(await page.getByRole('dialog').count()),animations:'disabled'});
 const failed=violations.length>0||geometry.scrollWidth>width+1||(name==='cardholder'&&width<600&&(geometry.moneyBottom===null||geometry.controlBottom===null||geometry.moneyBottom>geometry.height||geometry.controlBottom>geometry.height));
 checks.push({...current,url:new URL(page.url()).pathname+new URL(page.url()).search,geometry,violations,file,failed});console.log(JSON.stringify({role,width,name,failed}));
}
try{
 for(const [role,persona] of [['secondary','viewer'],['primary','owner'],['operator','operator']]){
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',serviceWorkers:'block'});
  try{
   const login=await context.request.post(origin+'/api/v1/auth/local-fixture',{headers:{Origin:origin},data:{persona}});expect(login.status()).toBe(200);
   const cards=await json(context,'/api/v1/cardholder-services'),merchants=await json(context,'/api/v1/merchants/dashboard');
   if(role==='secondary'){if(merchants.units.length!==1||merchants.units[0].ownerAccess)throw new Error('Expected one assigned viewer terminal.');assignedTerminalId=merchants.units[0].id;}
   const card=cards.cards.find(c=>c.holderId===cards.person.id),unit=merchants.units.find(u=>u.id===assignedTerminalId&&(role==='primary'?u.ownerAccess:!u.ownerAccess));
   if(role!=='operator'&&(!card||!unit||cards.cards.length!==(role==='primary'?2:1)||merchants.units.length!==(role==='primary'?3:1)))throw new Error('Expected fresh fictional preview is absent.');
   const ops=unit?await json(context,`/api/v1/merchants/${unit.id}/operations`):null,queue=role==='operator'?await json(context,'/api/v1/operations/cases'):null;
   const before=JSON.stringify({cards,ops,queue});const page=await context.newPage();page.setDefaultTimeout(15_000);
   page.on('pageerror',error=>errors.push({current,message:error.message}));
   await page.route('**/*',async route=>{const request=route.request(),url=new URL(request.url());if(url.origin!==origin||!['GET','HEAD','OPTIONS'].includes(request.method())){errors.push({current,message:'Blocked a non-read request',path:url.pathname,method:request.method()});await route.abort();}else await route.continue();});
   for(const width of [1440,390,320]){
    await page.setViewportSize({width,height:width===1440?1000:844});
    if(role==='operator'){
     await page.goto(origin+'/operations');await expect(page.getByRole('heading',{name:'Customer care',exact:true})).toBeVisible();await audit(page,role,width,'queue');
     const item=queue[0];if(!item)throw new Error('Fresh operator case is absent.');await page.goto(`${origin}/operations?case=${item.id}`);await expect(page.getByRole('region',{name:'Selected case'})).toContainText(item.subject);await expect(page.locator('.ops-detail-heading')).toContainText(item.customer);await audit(page,role,width,'case');continue;
    }
    await page.goto(`${origin}/cardholder-services?focus=${card.id}`);await expect(page.getByRole('region',{name:'Selected card overview'})).toContainText(card.nickname);await audit(page,role,width,'cardholder');
    await page.getByRole('region',{name:'Selected card overview'}).getByRole('button',{name:'Freeze card',exact:true}).click();await expect(page.getByRole('dialog',{name:'Freeze card?',exact:true})).toBeVisible();await audit(page,role,width,'card-control');await page.keyboard.press('Escape');
    for(const task of ['activity','reports','settings','help']){await page.goto(`${origin}/cardholder-services/${task}?focus=${card.id}`);await expect(page.getByRole('heading',{name:'Cards & spending',exact:true})).toBeVisible();await audit(page,role,width,task);}
    if(role==='primary'){await page.goto(`${origin}/cardholder-services?focus=${card.id}&manage=${cards.primaryService.id}`);await expect(page.getByRole('heading',{name:'People',level:2,exact:true})).toBeVisible();await audit(page,role,width,'cardholder-access');}
    await page.goto(`${origin}/merchant-services`);await expect(page.getByRole('heading',{name:role==='primary'?'Payments for your business':'Payments you collect',level:1,exact:true})).toBeVisible();await audit(page,role,width,'merchant-overview');
    for(const tab of ['channels','payments','people','verification']){await page.goto(`${origin}/merchants/${unit.id}?tab=${tab}`);await expect(page.getByRole('heading',{name:unit.name,level:1,exact:true})).toBeVisible();await audit(page,role,width,`merchant-${tab}`);}
    const payment=ops.payments[0];if(!payment)throw new Error('Expected saved payment is absent.');await page.goto(`${origin}/merchants/${unit.id}?tab=payments&payment=${payment.id}`);await expect(page.getByRole('dialog')).toContainText(payment.testReference);await audit(page,role,width,'payment-receipt');
   }
   const after=JSON.stringify({cards:await json(context,'/api/v1/cardholder-services'),ops:unit?await json(context,`/api/v1/merchants/${unit.id}/operations`):null,queue:queue?await json(context,'/api/v1/operations/cases'):null});preserved.push({role,unchanged:before===after});
  }finally{await context.close();}
 }
}catch(error){errors.push({current,message:error.message});}finally{await browser.close();}
const summary={checks:checks.length,failed:checks.filter(c=>c.failed).length,errors,preserved,result:checks.some(c=>c.failed)||errors.length||preserved.some(p=>!p.unchanged)?'FAIL':'PASS'};
await fs.writeFile(path.join(out,'checks.json'),JSON.stringify({summary,checks},null,2),{flag:'wx',mode:0o600});console.log(JSON.stringify(summary));if(summary.result!=='PASS')process.exitCode=1;

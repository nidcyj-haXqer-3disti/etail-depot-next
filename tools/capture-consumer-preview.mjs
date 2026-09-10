#!/usr/bin/env node
/** Read-only local consumer visual review; never signs in or changes domain data. */
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {promises as fs} from 'node:fs';
if(process.argv.slice(2).join(' ')!=='--local-preview-3100'||process.env.NETLIFY||process.env.SITE_ID||process.env.CONTEXT||process.env.CI&&process.env.CI!=='false')throw new Error('Use the prepared local preview on port3100 only.');
const out='artifacts/marketing-refresh/visual',origin='http://127.0.0.1:3100';
process.umask(0o077);await fs.mkdir(out,{recursive:true,mode:0o700});
if((await fs.readdir(out)).length)throw new Error('Preserve existing visual evidence before recapturing.');
const checks=[],errors=[],browser=await chromium.launch();
try{
 const context=await browser.newContext({reducedMotion:'reduce',serviceWorkers:'block'});
 const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/*',async route=>{const request=route.request();if(new URL(request.url()).origin!==origin||!['GET','HEAD','OPTIONS'].includes(request.method())){errors.push(`Unexpected request:${request.method()}`);await route.abort();}else await route.continue();});
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});
  for(const [name,path] of [['home','/'],['cards','/card-services'],['payments','/payment-services'],['help','/help'],['login','/login']]){
   const response=await page.goto(origin+path);if(!response?.ok())throw new Error(`Page did not open:${path}`);
   await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:`${out}/${name}-${width}-viewport.png`,animations:'disabled'});
   if(await page.locator('summary').count())await page.locator('summary').first().click();
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
   const overflow=await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth);
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   await page.screenshot({path:`${out}/${name}-${width}.png`,fullPage:true,animations:'disabled'});
   checks.push({path,width,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),overflow,title:await page.title(),failed:overflow>1||axe.violations.length>0});
   console.log(JSON.stringify(checks.at(-1)));
  }
  await page.goto(origin+'/login');
  for(const [name,action] of [['create-login','Create a login'],['confirm-email','I have a confirmation email'],['recover-password','Forgot your password?'],['reset-password','I have a reset email']]){
   if(name==='create-login'||name==='confirm-email'||name==='recover-password')await page.goto(origin+'/login');
   await page.getByRole('button',{name:action,exact:true}).click();
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
   const overflow=await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth);
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   await page.screenshot({path:`${out}/${name}-${width}.png`,fullPage:true,animations:'disabled'});
   checks.push({path:'/login',mode:name,width,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),overflow,failed:overflow>1||axe.violations.length>0});
   console.log(JSON.stringify(checks.at(-1)));
  }
 }
 await context.close();
}catch(error){errors.push(error.message);}finally{await browser.close();}
const summary={checks:checks.length,failed:checks.filter(c=>c.failed).length,errors,result:checks.length===27&&!checks.some(c=>c.failed)&&!errors.length?'PASS':'FAIL'};
await fs.writeFile(`${out}/checks.json`,JSON.stringify({summary,checks},null,2),{mode:0o600,flag:'wx'});console.log(JSON.stringify(summary));if(summary.result!=='PASS')process.exitCode=1;

#!/usr/bin/env node
/** Public consumer review: fresh anonymous context, local reads and sample previews only. */
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {constants,promises as fs} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const auditName=process.argv[3]??'consumer-entry-d71';
if(!/^[a-z0-9][a-z0-9-]{2,79}$/.test(auditName))throw new Error('Use a simple artifact directory name.');
if(![3,4].includes(process.argv.length)||process.argv[2]!=='--local-preview-3100'||process.env.NETLIFY||process.env.SITE_ID||process.env.CONTEXT||(process.env.CI&&process.env.CI!=='false')||process.env.ENABLE_REAL_MONEY==='true')throw new Error('Use the prepared local preview on port3100 only.');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'artifacts',auditName,'visual'),origin='http://127.0.0.1:3100';
const widths=[1440,390,320],expectedChecks=27,expectedScreenshots=42;
const run=promisify(execFile),sha=value=>createHash('sha256').update(value).digest('hex');
const checks=[],errors=[];let browser,beforeSource,afterSource,deadline,screenshots=0,current={screen:'setup',width:0};
process.umask(0o077);
function assert(value,code){if(!value)throw new Error(code);}
function failure(code,error){errors.push({...current,code,...(error?{diagnosticHash:sha(String(error.message??error))}:{})});}
async function git(args){const {stdout}=await run('git',args,{cwd:root,encoding:'utf8',timeout:15_000,maxBuffer:8*1024*1024,env:{...process.env,GIT_OPTIONAL_LOCKS:'0'}});return stdout;}
async function sourceSnapshot(){
 const tracked=(await git(['ls-files','-z','--','src'])).split('\0').filter(Boolean);
 const untracked=(await git(['ls-files','--others','--exclude-standard','-z','--','src'])).split('\0').filter(Boolean);
 const files=[...new Set([...tracked,...untracked])].sort(),hash=createHash('sha256');
 for(const file of files){
  assert(file.startsWith('src/')&&!file.split('/').includes('..'),'INVALID_SOURCE_PATH');
  let stat;try{stat=await fs.lstat(path.join(root,file));}catch(error){if(error.code==='ENOENT'){hash.update(`${file}\0MISSING\0`);continue;}throw error;}
  assert(stat.isFile()||stat.isSymbolicLink(),'INVALID_SOURCE_TYPE');
  const bytes=stat.isSymbolicLink()?await fs.readlink(path.join(root,file)):await fs.readFile(path.join(root,file));
  hash.update(`${file}\0${stat.mode}\0${sha(bytes)}\0`);
 }
 return {commit:(await git(['rev-parse','HEAD'])).trim(),tree:(await git(['rev-parse','HEAD^{tree}'])).trim(),trackedFiles:tracked.length,untrackedFiles:untracked.length,files:files.length,hash:hash.digest('hex')};
}
async function directory(relative){
 const target=path.join(root,relative);try{await fs.mkdir(target,{mode:0o700});}catch(error){if(error.code!=='EEXIST')throw error;}
 const stat=await fs.lstat(target);assert(stat.isDirectory()&&!stat.isSymbolicLink()&&(!process.getuid||stat.uid===process.getuid()),'INVALID_ARTIFACT_DIRECTORY');
}
async function writePrivate(filename,data){const handle=await fs.open(path.join(out,filename),constants.O_CREAT|constants.O_EXCL|constants.O_WRONLY|constants.O_NOFOLLOW,0o600);try{await handle.writeFile(data);}finally{await handle.close();}}
async function bounded(promise,ms){let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('AUDIT_TIMEOUT')),ms);})]);}finally{clearTimeout(timer);}}
async function ready(page){
 await bounded(page.evaluate(async()=>{
  await document.fonts.ready;
  await Promise.all([...document.images].filter(image=>image.getClientRects().length>0).map(image=>{image.loading='eager';return image.complete?Promise.resolve():new Promise(resolve=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',resolve,{once:true});});}));
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 }),15_000);
}
async function open(page,url){const response=await page.goto(origin+url,{waitUntil:'domcontentloaded'});assert(response?.ok(),'PAGE_OPEN_FAILED');assert(new URL(page.url()).origin===origin,'UNEXPECTED_PAGE_ORIGIN');}
async function capture(page,{screen,url,width,sampleData=false,viewport=true,fullPage=true}){
 current={screen,width};await ready(page);
 await expect(page.locator('.sandbox-badge')).toHaveText('Sandbox');await expect(page.locator('.sandbox-badge')).toHaveCount(1);
 assert(!/\b(sandbox|demo|practice|fixture)\b/i.test(await page.locator('main').innerText()),'CUSTOMER_ENVIRONMENT_COPY');
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 const files=[];
 if(viewport){const file=`${screen}-${width}-viewport.png`;await writePrivate(file,await page.screenshot({animations:'disabled',timeout:15_000}));files.push(file);screenshots++;}
 if(fullPage){
  const disclosure=page.locator('details > summary').first();if(await disclosure.count()&&await disclosure.isVisible())await disclosure.evaluate(element=>{element.parentElement.open=true;});
 }
 const axe=await bounded(new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze(),30_000);
 const overflow=await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth);
 if(fullPage){await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));const file=`${screen}-${width}-full.png`;await writePrivate(file,await page.screenshot({fullPage:true,animations:'disabled',timeout:15_000}));files.push(file);screenshots++;}
 const violations=axe.violations.map(item=>({id:item.id,nodes:item.nodes.map(node=>node.target)}));
 checks.push({screen,path:url,width,sampleData,files,violations,overflow,title:await page.title(),failed:overflow>1||violations.length>0});
 console.log(JSON.stringify({screen,width,sampleData,failed:checks.at(-1).failed}));
}

const targets=JSON.parse(await fs.readFile(path.join(root,'project-targets.json'),'utf8'));
assert(targets.project_key==='ETAIL_DEPOT_NEXT_GREENFIELD_2026'&&targets.github.repository_id===1361184741&&targets.netlify.site_id==='cbbb6c24-9dbc-43a2-9234-e4357b5b5280','WRONG_PROJECT_TARGET');
assert((await git(['rev-parse','--show-toplevel'])).trim()===root,'WRONG_REPOSITORY_ROOT');
for(const relative of ['artifacts',`artifacts/${auditName}`,`artifacts/${auditName}/visual`])await directory(relative);
assert((await fs.readdir(out)).length===0,'PRESERVE_EXISTING_VISUAL_EVIDENCE');
try{
 beforeSource=await sourceSnapshot();browser=await chromium.launch();
 deadline=setTimeout(()=>{failure('CAPTURE_DEADLINE');void browser.close().catch(()=>undefined);},6*60_000);
 const context=await browser.newContext({reducedMotion:'reduce',serviceWorkers:'block'});
 await context.route('**/*',async route=>{
  const request=route.request();
  if(new URL(request.url()).origin!==origin){failure('EXTERNAL_REQUEST_BLOCKED');await route.abort();return;}
  if(!['GET','HEAD','OPTIONS'].includes(request.method())){failure('MUTATION_BLOCKED');await route.abort();return;}
  await route.continue();
 });
 const page=await context.newPage();page.setDefaultTimeout(15_000);page.setDefaultNavigationTimeout(30_000);
 page.on('pageerror',error=>failure('BROWSER_RUNTIME_ERROR',error));
 page.on('console',message=>{if(message.type()==='error')failure('BROWSER_CONSOLE_ERROR',new Error(message.text()));});
 page.on('response',response=>{if(response.status()>=400)failure('HTTP_RESPONSE_ERROR',new Error(String(response.status())));});
 for(const width of widths){
  await page.setViewportSize({width,height:900});current={screen:'home-cardholder-sample-data',width};
  await open(page,'/');
  const preview=page.getByRole('group',{name:'Service dashboard preview',exact:true});
  await expect(preview).toBeVisible();await expect(page.getByRole('region',{name:'Cardholder dashboard example',exact:true})).toBeVisible();
  await expect(page.getByRole('tablist',{name:'Payment channel examples',exact:true}).getByRole('tab')).toHaveCount(7);
  await capture(page,{screen:'home-cardholder-sample-data',url:'/',width,sampleData:true});
  current={screen:'home-merchant-sample-data',width};await preview.getByRole('button',{name:'Merchant',exact:true}).click();
  await expect(page.getByRole('region',{name:'Merchant dashboard example',exact:true})).toBeVisible();
  await expect(page.getByRole('region',{name:'Cardholder dashboard example',exact:true})).toHaveCount(0);
  assert(new URL(page.url()).pathname==='/','SAMPLE_PREVIEW_NAVIGATED');
  await capture(page,{screen:'home-merchant-sample-data',url:'/',width,sampleData:true,fullPage:false});
  await preview.getByRole('button',{name:'Cardholder',exact:true}).click();
  await expect(page.getByRole('region',{name:'Cardholder dashboard example',exact:true})).toBeVisible();
  for(const [screen,url] of [['cards','/card-services'],['payments','/payment-services'],['help','/help'],['login','/login']]){
   current={screen,width};await open(page,url);if(screen==='login')await expect(page.getByRole('heading',{name:'Sign in with email',exact:true})).toBeVisible();
   await capture(page,{screen,url,width});
  }
  for(const [screen,action,title] of [['create-login','Create a login','Create your login'],['forgot-password','Forgot your password?','Reset your password']]){
   current={screen,width};await open(page,'/login');await page.getByRole('button',{name:action,exact:true}).click();await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
   await capture(page,{screen,url:'/login',width,viewport:false});
  }
  current={screen:'create-login-direct-link',width};await open(page,'/login?mode=register');await expect(page.getByRole('heading',{name:'Create your login',exact:true})).toBeVisible();
  await capture(page,{screen:'create-login-direct-link',url:'/login?mode=register',width,viewport:false});
 }
 await context.close();
}catch(error){failure('CAPTURE_FAILED',error);}finally{
 clearTimeout(deadline);if(browser)await browser.close();
 try{afterSource=await sourceSnapshot();}catch(error){failure('SOURCE_CHECK_FAILED',error);}
}
const source={before:beforeSource,after:afterSource,unchanged:Boolean(beforeSource&&afterSource&&JSON.stringify(beforeSource)===JSON.stringify(afterSource))};
if(!source.unchanged)failure('SOURCE_CHANGED_DURING_CAPTURE');
const summary={checks:checks.length,expectedChecks,screenshots,expectedScreenshots,failed:checks.filter(check=>check.failed).length,errors,source,scope:'Anonymous local public pages and illustrative sample data only; no sign-in, form submission, account read, or financial command.',result:checks.length===expectedChecks&&screenshots===expectedScreenshots&&!checks.some(check=>check.failed)&&!errors.length?'PASS':'FAIL'};
await writePrivate('checks.json',JSON.stringify({summary,checks},null,2));console.log(JSON.stringify(summary));if(summary.result!=='PASS')process.exitCode=1;

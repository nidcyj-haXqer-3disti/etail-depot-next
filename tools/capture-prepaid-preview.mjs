#!/usr/bin/env node
/** D69 visual evidence only: exact local preview, fixture sign-ins, GETs, private screenshots. */
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import pg from 'pg';
import {constants,promises as fs} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {previewDatabase,previewSeedKey,verifyPreviewRuntime,verifyPreviewDatabase} from './clean-preview-target.mjs';

const name=process.argv[2],origin='http://127.0.0.1:3100';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const connectionString=`postgres://etail_local@127.0.0.1:55439/${previewDatabase}`;
if(process.argv.length!==3||!/^[a-z0-9][a-z0-9-]{2,63}$/.test(name??'')||process.env.APP_ENV!=='local'||process.env.ENABLE_LOCAL_FIXTURE_IDENTITY!=='true'||process.env.ENABLE_REAL_MONEY!=='false'||process.env.DATABASE_URL!==connectionString||process.env.ETAIL_PUBLIC_ORIGIN!==origin||(process.env.CI&&process.env.CI!=='false')||process.env.NETLIFY||process.env.SITE_ID||process.env.CONTEXT)throw new Error('Use one fresh artifact directory name with the exact local D69 preview environment.');
const output=path.join(root,'artifacts',name),sha=value=>createHash('sha256').update(value).digest('hex');
const run=promisify(execFile),checks=[],errors=[],preserved=[];let current={role:'setup',screen:'verification',width:0},browser=null,outputReady=false,deadline=null,signIns=0;
process.umask(0o077);
function assert(value,code){if(!value)throw new Error(code);}
function failure(code,error){errors.push({...current,code,...(error?{diagnosticHash:sha(String(error.message??error))}:{})});}
async function sourceHash(){
 const {stdout}=await run('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'buffer',maxBuffer:8*1024*1024,timeout:15_000,env:{...process.env,GIT_OPTIONAL_LOCKS:'0'}});
 const files=[...new Set(stdout.toString('utf8').split('\0').filter(Boolean))].sort(),hash=createHash('sha256');
 for(const file of files){assert(!path.isAbsolute(file)&&!file.split('/').includes('..'),'INVALID_SOURCE_PATH');const absolute=path.join(root,file);let stat;try{stat=await fs.lstat(absolute);}catch(error){if(error.code==='ENOENT'){hash.update(`${file}\0MISSING\0`);continue;}throw error;}
  assert(stat.isFile()||stat.isSymbolicLink(),'INVALID_SOURCE_TYPE');const content=stat.isSymbolicLink()?await fs.readlink(absolute):await fs.readFile(absolute);hash.update(`${file}\0${stat.mode}\0${sha(content)}\0`);
 }return {files:files.length,hash:hash.digest('hex')};
}
async function ownedDirectory(directory,create=false){if(create)await fs.mkdir(directory,{mode:0o700});const stat=await fs.lstat(directory);assert(stat.isDirectory()&&!stat.isSymbolicLink()&&(!process.getuid||stat.uid===process.getuid()),'INVALID_ARTIFACT_DIRECTORY');}
async function writePrivate(filename,data){const handle=await fs.open(path.join(output,filename),constants.O_CREAT|constants.O_EXCL|constants.O_WRONLY|constants.O_NOFOLLOW,0o600);try{await handle.writeFile(data);}finally{await handle.close();}}
const normalize=value=>Array.isArray(value)?value.map(normalize):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([key])=>key!=='asOf').sort(([a],[b])=>a.localeCompare(b)).map(([key,child])=>[key,normalize(child)])):value;
async function read(page,endpoint){const result=await page.evaluate(async endpoint=>{const response=await fetch(endpoint,{credentials:'same-origin',cache:'no-store',redirect:'error',signal:AbortSignal.timeout(15_000)});return {status:response.status,data:response.ok?await response.json():null};},endpoint);assert(result.status===200,'PROJECTION_READ_FAILED');return result.data;}
async function snapshot(page,endpoints){const values=[];for(const endpoint of endpoints)values.push(await read(page,endpoint));return sha(JSON.stringify(normalize(values)));}
async function bounded(promise,ms){let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('AUDIT_TIMEOUT')),ms);})]);}finally{clearTimeout(timer);}}
async function capture(page,role,width,screen,url,ready){
 current={role,width,screen};const response=await page.goto(origin+url,{waitUntil:'domcontentloaded'});assert(response?.ok(),'PAGE_OPEN_FAILED');assert(new URL(page.url()).origin===origin,'UNEXPECTED_PAGE_ORIGIN');await ready(page);
 await bounded(page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(image=>image.getClientRects().length>0).map(image=>{image.loading='eager';return image.complete?Promise.resolve():new Promise(resolve=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',resolve,{once:true});});}));await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));}),15_000);
 const geometry=await page.evaluate(()=>({viewport:innerWidth,scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)}));
 const axe=await bounded(new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze(),30_000);
 const violations=axe.violations.map(item=>({id:item.id,nodes:item.nodes.length}));
 const file=`${role}-${screen}-${width}.png`,dialog=await page.getByRole('dialog').count();
 const pixels=await page.screenshot({fullPage:dialog===0,animations:'disabled',timeout:15_000});await writePrivate(file,pixels);
 const failed=geometry.scrollWidth>geometry.viewport+1||violations.length>0;checks.push({...current,file,geometry,violations,failed});console.log(JSON.stringify({...current,failed}));
}

let beforeSource,afterSource,ids;
try{
 await verifyPreviewRuntime();const client=new pg.Client({connectionString,connectionTimeoutMillis:5000,application_name:'etail-prepaid-visual-read',query_timeout:15_000,statement_timeout:10_000});
 try{await client.connect();await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');await verifyPreviewDatabase(client);const marker=await client.query('SELECT result FROM public._etail_preview_seed WHERE key=$1',[previewSeedKey]);ids=marker.rows[0]?.result;
  const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  assert(marker.rows.length===1&&ids?.realMoney===false&&['primaryId','secondaryId','operatorId','serviceId','merchantServiceId','primaryCardId','secondaryCardId','primaryMerchantId','supportCaseId'].every(key=>uuid.test(ids[key]))&&ids.channels?.length===3&&ids.channels.every(channel=>['primary','online','popup'].includes(channel.key)&&[channel.id,channel.unitId,channel.publicationId].every(id=>uuid.test(id))),'INVALID_D69_MARKER');
  const people=await client.query('SELECT id,"displayName" FROM public.people ORDER BY id');assert(people.rows.length===3&&people.rows.some(row=>row.id===ids.primaryId&&row.displayName==='Alex Morgan')&&people.rows.some(row=>row.id===ids.secondaryId&&row.displayName==='Jamie Morgan')&&people.rows.some(row=>row.id===ids.operatorId&&row.displayName==='Morgan Support'),'NON_FIXTURE_PREVIEW');await client.query('COMMIT');
 }finally{await client.end();}
 const artifacts=path.join(root,'artifacts');try{await ownedDirectory(artifacts);}catch(error){if(error.code==='ENOENT')await ownedDirectory(artifacts,true);else throw error;}await ownedDirectory(output,true);outputReady=true;beforeSource=await sourceHash();
 const online=ids.channels.find(channel=>channel.key==='online'),popup=ids.channels.find(channel=>channel.key==='popup');assert(online&&popup,'MISSING_CHANNEL_MARKER');
 browser=await chromium.launch();deadline=setTimeout(()=>{failure('CAPTURE_DEADLINE');void browser.close().catch(()=>undefined);},10*60_000);
 for(const [role,persona,personId] of [['primary','owner',ids.primaryId],['secondary','viewer',ids.secondaryId],['operator','operator',ids.operatorId]]){
  current={role,screen:'sign-in',width:1440};const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',serviceWorkers:'block'});let loginBudget=1;
  try{
   await context.route('**/*',async route=>{const request=route.request(),url=new URL(request.url());if(url.origin!==origin){failure('EXTERNAL_REQUEST_BLOCKED');await route.abort('blockedbyclient');return;}
    const login=request.method()==='POST'&&url.pathname==='/api/v1/auth/local-fixture'&&url.search===''&&request.postData()===JSON.stringify({persona})&&loginBudget===1;
    if(login){loginBudget--;await route.continue();return;}if(!['GET','HEAD','OPTIONS'].includes(request.method())){failure('BUSINESS_WRITE_BLOCKED');await route.abort('blockedbyclient');return;}await route.continue();
   });
   const page=await context.newPage();page.setDefaultTimeout(15_000);page.setDefaultNavigationTimeout(30_000);
   page.on('response',response=>{if(response.status()>=400)failure('HTTP_RESPONSE_ERROR',new Error(String(response.status())));});page.on('pageerror',error=>failure('BROWSER_RUNTIME_ERROR',error));page.on('console',message=>{if(message.type()==='error')failure('BROWSER_CONSOLE_ERROR',new Error(message.text()));});
   const loginPage=await page.goto(origin+'/login',{waitUntil:'domcontentloaded'});assert(loginPage?.ok(),'LOGIN_PAGE_UNAVAILABLE');
   const login=await page.evaluate(async persona=>{const response=await fetch('/api/v1/auth/local-fixture',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({persona}),redirect:'error',signal:AbortSignal.timeout(15_000)});return {status:response.status,authenticated:response.ok&&(await response.json()).authenticated};},persona);assert(login.status===200&&login.authenticated===true&&loginBudget===0,'FIXTURE_LOGIN_FAILED');signIns++;
   const cards=await read(page,'/api/v1/cardholder-services'),merchants=await read(page,'/api/v1/merchants/dashboard');assert(cards.person.id===personId,'WRONG_PREVIEW_PERSON');
   assert(cards.cards.length===(role==='primary'?2:role==='secondary'?1:0)&&merchants.units.length===(role==='primary'?3:role==='secondary'?1:0),'WRONG_PREVIEW_SCOPE');
   assert(cards.cards.every(card=>card.id===ids.primaryCardId&&card.nickname==='Everyday'||card.id===ids.secondaryCardId&&card.nickname==='Daily spending')&&merchants.units.every(unit=>unit.id===ids.primaryMerchantId&&unit.name==='Etail Studio'||unit.id===online.unitId&&unit.name==='Online store'||unit.id===popup.unitId&&unit.name==='Pop-up shop'),'NON_SEED_SCREEN_DATA');
   const endpoints=['/api/v1/services','/api/v1/cardholder-services','/api/v1/merchants/dashboard'];let deposit;
   if(role==='primary'){const funds=await read(page,`/api/v1/cardholder-services/${ids.serviceId}/funds`);assert(funds.available.minor==='46400'&&funds.topups.length===1&&funds.topups[0].amount.minor==='65000'&&funds.people.length===2&&funds.people.every(person=>person.id===ids.primaryId&&person.name==='Alex Morgan'||person.id===ids.secondaryId&&person.name==='Jamie Morgan'),'NON_SEED_FUNDING');const channelWorkspace=await read(page,`/api/v1/merchants/${online.unitId}`);assert(channelWorkspace.channels.length===1&&channelWorkspace.channels[0].id===online.id&&channelWorkspace.channels[0].description==='Online homewares order','NON_SEED_CHANNEL');endpoints.push(`/api/v1/merchants/${online.unitId}`, `/api/v1/cardholder-services/${ids.serviceId}/funds`,`/api/v1/merchants/${online.unitId}/operations`,`/api/v1/merchants/${online.unitId}/channels/${online.id}/publication`);const operations=await read(page,`/api/v1/merchants/${online.unitId}/operations`);deposit=operations.payouts.find(item=>item.status==='COMPLETED');assert(operations.payouts.length===1&&deposit?.amount.minor==='4800','WRONG_PREVIEW_DEPOSIT');}
   if(role==='secondary'){endpoints.push(`/api/v1/merchants/${popup.unitId}/operations`);assert(cards.cards[0]?.id===ids.secondaryCardId&&merchants.units[0]?.id===popup.unitId,'WRONG_SECONDARY_SCOPE');}
   if(role==='operator'){const queue=await read(page,'/api/v1/operations/cases');assert(queue.length===1&&queue[0].id===ids.supportCaseId&&queue[0].subject==='A question about my card','NON_SEED_SUPPORT');endpoints.push('/api/v1/operations/cases');}const before=await snapshot(page,endpoints);
   for(const width of [1440,390,320]){
    await page.setViewportSize({width,height:width===1440?1000:900});
    const heading=text=>page=>expect(page.getByRole('heading',{name:text,exact:true})).toBeVisible();
    if(role==='primary'){
     await capture(page,role,width,'services','/services',heading('Your services'));
     await capture(page,role,width,'card-home',`/cardholder-services?focus=${ids.primaryCardId}`,page=>expect(page.getByRole('region',{name:'Selected card overview'})).toBeVisible());
     await capture(page,role,width,'card-funds',`/cardholder-services/funds?service=${ids.serviceId}`,heading('Add money & spending limits'));
     await capture(page,role,width,'merchant-overview','/merchant-services',heading('Merchant overview'));
     await capture(page,role,width,'merchant-funds','/merchant-services?section=funds',heading('Funds & deposits'));
     await capture(page,role,width,'deposit',`/merchants/${online.unitId}?tab=payments&activity=transfers&transfer=${deposit.id}`,page=>expect(page.getByRole('dialog',{name:'Deposit details',exact:true})).toBeVisible());
     await capture(page,role,width,'published-channel',`/merchants/${online.unitId}?tab=channels&channel=${online.id}`,async page=>{const label=page.getByRole('heading',{name:'Customer payment link',exact:true});await expect(label).toBeVisible();await expect(page.getByRole('textbox',{name:'Customer payment URL',exact:true})).toHaveValue(`${origin}/checkout/${online.publicationId}`);await label.scrollIntoViewIfNeeded();});
    }else if(role==='secondary'){
     await capture(page,role,width,'own-card',`/cardholder-services?focus=${ids.secondaryCardId}`,page=>expect(page.getByRole('region',{name:'Selected card overview'})).toBeVisible());
     await capture(page,role,width,'merchant',`/merchants/${popup.unitId}?tab=payments`,page=>expect(page.getByRole('region',{name:'Payments',exact:true})).toBeVisible());
    }else{
     await capture(page,role,width,'support-queue','/operations',heading('Customer care'));
     await capture(page,role,width,'deposit-queue','/operations/deposits',async page=>{await expect(page.getByRole('heading',{name:'Deposit processing',exact:true})).toBeVisible();await expect(page.getByText('No pending deposits are available with your processing assignment.',{exact:true})).toBeVisible();});
    }
   }
   const after=await snapshot(page,endpoints);preserved.push({role,reads:endpoints.length,before,after,unchanged:before===after});
  }finally{await context.close();}
 }
}catch(error){failure('CAPTURE_FAILED',error);}finally{clearTimeout(deadline);if(browser){try{await browser.close();}catch(error){failure('BROWSER_CLOSE_FAILED',error);}}if(beforeSource){try{afterSource=await sourceHash();}catch(error){failure('SOURCE_HASH_FAILED',error);}}}
const summary={result:checks.length===33&&!checks.some(check=>check.failed)&&!errors.length&&preserved.length===3&&preserved.every(item=>item.unchanged)&&beforeSource?.hash===afterSource?.hash?'PASS':'FAIL',screens:checks.length,failed:checks.filter(check=>check.failed).length,runtimeOrGuardErrors:errors.length,fixtureSignIns:signIns,source:{before:beforeSource??null,after:afterSource??null,unchanged:!!beforeSource&&beforeSource.hash===afterSource?.hash},normalization:'Only projection asOf timestamps are omitted; all other fields and array order are compared.',preserved};
try{assert(outputReady,'ARTIFACT_DIRECTORY_NOT_CREATED');await writePrivate('checks.json',JSON.stringify({summary,checks,errors},null,2)+'\n');}catch{summary.result='FAIL';}
console.log(JSON.stringify({result:summary.result,screens:summary.screens,failed:summary.failed,runtimeOrGuardErrors:summary.runtimeOrGuardErrors,sourceUnchanged:summary.source.unchanged,artifactDirectory:path.relative(root,output)}));
if(summary.result!=='PASS')process.exitCode=1;

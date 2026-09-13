#!/usr/bin/env node
/** D81 read-only dashboard QA. Run through run-with-database.mjs --preview after starting the preserved preview. */
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
import {customerHref} from '../src/shared/customer-routes.ts';
import {personalProfileSchema} from '../src/shared/personal-profile.ts';
import {parseNotificationOverview} from '../src/shared/notification-response.ts';
import {merchantWorkspaceProjectionSchema} from '../src/shared/merchant-response.ts';
import {guestPublicationManagementSchema} from '../src/shared/merchant-publication-response.ts';

const origin='http://127.0.0.1:3100';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const name=process.argv[2],connectionString=`postgres://etail_local@127.0.0.1:55439/${previewDatabase}`;
if(process.argv.length!==3||!/^d81-dashboard-preview(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(name??'')||name.length>90||
 process.env.APP_ENV!=='local'||process.env.ENABLE_LOCAL_FIXTURE_IDENTITY!=='true'||process.env.ENABLE_REAL_MONEY!=='false'||
 process.env.DATABASE_URL!==connectionString||process.env.ETAIL_PUBLIC_ORIGIN!==origin||
 process.env.CI&&process.env.CI!=='false'||process.env.NETLIFY||process.env.SITE_ID||process.env.CONTEXT)
 throw new Error('Use a new d81-dashboard-preview directory name with the exact prepared local preview environment.');

const output=path.join(root,'artifacts',name),run=promisify(execFile);
const hash=value=>createHash('sha256').update(value).digest('hex');
const checks=[],errors=[],preserved=[];
let current={role:'setup',screen:'verification',width:0},browser=null,outputReady=false,deadline=null,signIns=0;
let beforeSource=null,afterSource=null;
process.umask(0o077);
function assert(condition,code){if(!condition)throw new Error(code);}
function failure(code,error){errors.push({...current,code,...(error?{diagnosticHash:hash(String(error.message??error)),sourceAt:String(error.stack??'').match(/capture-dashboard-preview\.mjs:\d+:\d+/)?.[0]??null}:{})});}
async function ownedDirectory(directory,create=false){
 if(create)await fs.mkdir(directory,{mode:0o700});
 const stat=await fs.lstat(directory);
 assert(stat.isDirectory()&&!stat.isSymbolicLink()&&(!process.getuid||stat.uid===process.getuid()),'INVALID_ARTIFACT_DIRECTORY');
}
async function writePrivate(filename,data){
 const handle=await fs.open(path.join(output,filename),constants.O_CREAT|constants.O_EXCL|constants.O_WRONLY|constants.O_NOFOLLOW,0o600);
 try{await handle.writeFile(data);}finally{await handle.close();}
}
async function sourceHash(){
 const {stdout}=await run('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'buffer',maxBuffer:8*1024*1024,timeout:15_000,env:{...process.env,GIT_OPTIONAL_LOCKS:'0'}});
 const files=[...new Set(stdout.toString('utf8').split('\0').filter(Boolean))].sort(),digest=createHash('sha256');
 for(const file of files){
  assert(!path.isAbsolute(file)&&!file.split('/').includes('..'),'INVALID_SOURCE_PATH');
  const absolute=path.join(root,file);let stat;
  try{stat=await fs.lstat(absolute);}catch(error){if(error.code==='ENOENT'){digest.update(`${file}\0MISSING\0`);continue;}throw error;}
  assert(stat.isFile()||stat.isSymbolicLink(),'INVALID_SOURCE_TYPE');
  const content=stat.isSymbolicLink()?await fs.readlink(absolute):await fs.readFile(absolute);
  digest.update(`${file}\0${stat.mode}\0${hash(content)}\0`);
 }
 return {files:files.length,hash:digest.digest('hex')};
}
// Omit only the documented projection clock; every business field and array order remains significant.
function normalize(value){
 if(Array.isArray(value))return value.map(normalize);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>key!=='asOf').sort(([a],[b])=>a.localeCompare(b)).map(([key,child])=>[key,normalize(child)]));
 return value;
}
async function read(page,endpoint){
 assert(endpoint.startsWith('/api/v1/')&&!endpoint.includes('#'),'INVALID_READ_PATH');
 const result=await page.evaluate(async endpoint=>{
  const response=await fetch(endpoint,{credentials:'same-origin',cache:'no-store',redirect:'error',signal:AbortSignal.timeout(15_000)});
  return {status:response.status,data:response.ok?await response.json():null};
 },endpoint);
 assert(result.status===200,`PROJECTION_READ_FAILED_${result.status}`);return result.data;
}
async function snapshot(page,endpoints){
 const records=[];for(const endpoint of endpoints)records.push([endpoint,await read(page,endpoint)]);
 return hash(JSON.stringify(normalize(records)));
}
async function bounded(promise,milliseconds){
 let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('CHECK_TIMEOUT')),milliseconds);})]);}finally{clearTimeout(timer);}
}
const ownerCardMenu=['Account home','Cards','Activity','Account settings'];
const holderCardMenu=['Account home','Cards','Activity','Preferences'];
const ownerMerchantMenu=['Overview','Terminals','Account settings'];
const holderMerchantMenu=['Overview','Terminals'];
const sharingNames=[['SMS','Text'],['EMAIL','Email'],['INVOICE','Invoice'],['BILL','Bill'],['SOCIAL','Social'],['QR','QR code'],['WEB','Website']];
function cardMenu(page){return page.getByRole('navigation',{name:'Cards and spending navigation',exact:true});}
function merchantMenu(page){return page.getByRole('navigation',{name:'Merchant account navigation',exact:true});}
async function capture(page,role,width,screen,url,ready){
 current={role,width,screen};
 const response=await page.goto(origin+url,{waitUntil:'domcontentloaded'});
 assert(response?.ok(),'PAGE_OPEN_FAILED');assert(new URL(page.url()).origin===origin,'UNEXPECTED_PAGE_ORIGIN');
 await ready(page);
 await bounded(page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));}),15_000);
 await expect(page.locator('footer')).toHaveCount(0);
 await expect(page.locator('.sandbox-badge')).toHaveCount(1);
 await expect(page.locator('.sandbox-badge')).toHaveText('Sandbox');
 const geometry=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)}));
 const axe=await bounded(new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze(),30_000);
 const violations=axe.violations.map(item=>({id:item.id,targets:item.nodes.map(node=>node.target)}));
 const file=`${role}-${screen}-${width}.png`;
 await writePrivate(file,await page.screenshot({fullPage:true,animations:'disabled',timeout:15_000}));
 const failed=geometry.scrollWidth>geometry.width+1||violations.length>0;
 checks.push({...current,file,geometry,violations,failed});
 console.log(JSON.stringify({...current,failed}));
}

try{
 await verifyPreviewRuntime();
 const client=new pg.Client({connectionString,connectionTimeoutMillis:5000,application_name:'etail-dashboard-visual-read',query_timeout:15_000,statement_timeout:10_000});
 let ids;
 try{
  await client.connect();await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');await verifyPreviewDatabase(client);
  const marker=await client.query('SELECT result FROM public._etail_preview_seed WHERE key=$1',[previewSeedKey]);ids=marker.rows[0]?.result;
  const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  assert(marker.rows.length===1&&ids?.realMoney===false&&['primaryId','secondaryId','serviceId','merchantServiceId','primaryCardId','secondaryCardId'].every(key=>uuid.test(ids[key])),'INVALID_PREVIEW_MARKER');
  const bindings=await client.query('SELECT subject,"personId" FROM public.identity_bindings WHERE issuer=$1 AND subject=ANY($2::text[])',['urn:etail:isolated-fixture',['owner','viewer']]);
  assert(bindings.rows.length===2&&bindings.rows.some(row=>row.subject==='owner'&&row.personId===ids.primaryId)&&bindings.rows.some(row=>row.subject==='viewer'&&row.personId===ids.secondaryId),'FICTIONAL_IDENTITIES_NOT_PREPARED');
  await client.query('COMMIT');
 }finally{await client.end();}
 const artifacts=path.join(root,'artifacts');
 try{await ownedDirectory(artifacts);}catch(error){if(error.code==='ENOENT')await ownedDirectory(artifacts,true);else throw error;}
 await ownedDirectory(output,true);outputReady=true;beforeSource=await sourceHash();
 browser=await chromium.launch();
 deadline=setTimeout(()=>{failure('CAPTURE_DEADLINE');void browser.close().catch(()=>undefined);},12*60_000);
 let assignedTerminalId=null;
 // Resolve the recipient's sole assigned terminal first; the owner must independently authorize that exact terminal.
 for(const [role,persona,personId] of [['holder','viewer',ids.secondaryId],['owner','owner',ids.primaryId]]){
  current={role,screen:'sign-in',width:1440};
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',serviceWorkers:'block'});
  let loginBudget=1;
  try{
   await context.route('**/*',async route=>{
    const request=route.request(),url=new URL(request.url());
    if(url.origin!==origin){failure('EXTERNAL_REQUEST_BLOCKED');await route.abort('blockedbyclient');return;}
    const login=request.method()==='POST'&&url.pathname==='/api/v1/auth/local-fixture'&&!url.search&&request.postData()===JSON.stringify({persona})&&loginBudget===1;
    if(login){loginBudget--;await route.continue();return;}
    if(!['GET','HEAD','OPTIONS'].includes(request.method())){failure('BUSINESS_WRITE_BLOCKED');await route.abort('blockedbyclient');return;}
    await route.continue();
   });
   await context.routeWebSocket('**/*',socket=>{failure('WEBSOCKET_BLOCKED');socket.close();});
   const page=await context.newPage();page.setDefaultTimeout(15_000);page.setDefaultNavigationTimeout(30_000);
   // Axe may create a temporary analysis page; context routing still blocks external and mutating requests.
   page.on('response',response=>{if(response.status()>=400)failure(`HTTP_RESPONSE_${response.status()}`);});
   page.on('pageerror',error=>failure('BROWSER_RUNTIME_ERROR',error));
   page.on('console',message=>{if(message.type()==='error')failure('BROWSER_CONSOLE_ERROR',new Error(message.text()));});
   const entry=await page.goto(origin+'/login',{waitUntil:'domcontentloaded'});assert(entry?.ok(),'LOGIN_PAGE_UNAVAILABLE');
   const login=await page.evaluate(async persona=>{
    const response=await fetch('/api/v1/auth/local-fixture',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({persona}),redirect:'error',signal:AbortSignal.timeout(15_000)});
    return {status:response.status,authenticated:response.ok&&(await response.json()).authenticated};
   },persona);
   assert(login.status===200&&login.authenticated===true&&loginBudget===0,'FIXTURE_LOGIN_FAILED');signIns++;
   const cards=await read(page,'/api/v1/cardholder-services'),merchants=await read(page,'/api/v1/merchants/dashboard'),accounts=await read(page,'/api/v1/money-accounts');
   assert(cards.person.id===personId,'WRONG_PREVIEW_PERSON');
   const selectedCardId=role==='owner'?ids.primaryCardId:ids.secondaryCardId;
   const card=cards.cards.find(item=>item.id===selectedCardId&&item.holderId===personId&&item.assignmentState==='ACCEPTED');
   assert(card&&card.serviceId===ids.serviceId,'PREPARED_CARD_NOT_AUTHORIZED');
   if(role==='holder'){
    assert(!cards.primaryService&&cards.cards.every(item=>item.holderId===personId)&&accounts.length===0,'UNEXPECTED_HOLDER_AUTHORITY');
    assert(merchants.units.length===1&&!merchants.units[0].ownerAccess,'EXPECTED_ONE_ASSIGNED_TERMINAL');assignedTerminalId=merchants.units[0].id;
   }
   const terminal=merchants.units.find(item=>item.id===assignedTerminalId&&item.merchantServiceId===ids.merchantServiceId&&item.ownerAccess===(role==='owner'));
   assert(terminal,'PREPARED_TERMINAL_NOT_AUTHORIZED');
   const terminalWorkspace=merchantWorkspaceProjectionSchema.parse(await read(page,`/api/v1/merchants/${terminal.id}`));
   assert(terminalWorkspace.merchant.id===terminal.id&&terminalWorkspace.merchant.merchant.serviceId===ids.merchantServiceId&&terminalWorkspace.ownerAccess===(role==='owner')&&terminalWorkspace.canCreateChannel&&terminalWorkspace.canShareChannel,'PREPARED_CHANNEL_ACCESS_NOT_AUTHORIZED');
   const markedChannels=Array.isArray(ids.channels)?ids.channels.filter(item=>item.unitId===terminal.id):[];
   assert(markedChannels.length===1,'EXPECTED_ONE_MARKED_TERMINAL_CHANNEL');
   const markedChannel=markedChannels[0],channel=terminalWorkspace.channels.find(item=>item.id===markedChannel.id&&item.merchantUnitId===terminal.id);
   assert(channel&&channel.presentations.length>0,'PREPARED_CHANNEL_NOT_AUTHORIZED');
   const management=guestPublicationManagementSchema.parse(await read(page,`/api/v1/merchants/${terminal.id}/channels/${channel.id}/publication`)),publication=management.publication;
   assert(management.channelId===channel.id&&publication&&(publication.state!=='AVAILABLE'||publication.description===channel.description&&publication.amount.minor===channel.amount.minor&&publication.amount.currency===channel.amount.currency&&publication.usage===channel.usage&&publication.expiresAt===channel.expiresAt),'PREPARED_PUBLICATION_NOT_AUTHORIZED');
   const checkout=new URL(publication.publicHref);
   assert(checkout.origin===origin&&checkout.pathname===`/checkout/${publication.id}`&&!checkout.search&&!checkout.hash&&!checkout.username&&!checkout.password,'PREPARED_PUBLICATION_WRONG_ORIGIN');
   const cardAccount=role==='owner'?accounts.find(item=>item.serviceKind==='CARDHOLDER'&&item.services.some(service=>service.id===ids.serviceId)):null;
   const merchantAccount=role==='owner'?accounts.find(item=>item.serviceKind==='MERCHANT'&&item.services.some(service=>service.id===ids.merchantServiceId)):null;
   if(role==='owner')assert(cards.primaryService?.id===ids.serviceId&&cardAccount&&merchantAccount&&cardAccount.id!==merchantAccount.id,'OWNER_ACCOUNTS_NOT_AUTHORIZED');
   const preferencesEndpoint=`/api/v1/cardholder-services/${ids.serviceId}/preferences/notifications`;
   const profile=personalProfileSchema.parse(await read(page,'/api/v1/profile'));
   assert(profile.personId===personId&&profile.displayName===cards.person.displayName,'WRONG_PREVIEW_PROFILE');
   const notifications=parseNotificationOverview(await read(page,preferencesEndpoint),{serviceId:ids.serviceId,personId});
   // Keep the original 19 comparisons, plus each persona's profile and narrow account preferences.
   const endpoints=['/api/v1/services','/api/v1/cardholder-services','/api/v1/merchants/dashboard','/api/v1/money-accounts',`/api/v1/cardholder-services/${ids.serviceId}/workspace`,`/api/v1/merchants/${terminal.id}`,`/api/v1/merchants/${terminal.id}/operations`,'/api/v1/profile',preferencesEndpoint];
   if(role==='owner')endpoints.push(`/api/v1/cardholder-services/${ids.serviceId}/funds`,`/api/v1/cardholder-services/${ids.serviceId}/access`,`/api/v1/merchants/${terminal.id}/access`,`/api/v1/money-accounts/${cardAccount.id}`,`/api/v1/money-accounts/${merchantAccount.id}`);
   const before=await snapshot(page,endpoints);
   const own=role==='owner',cardLinks=own?ownerCardMenu:holderCardMenu,merchantLinks=own?ownerMerchantMenu:holderMerchantMenu;
   for(const width of [1440,390,320]){
    await page.setViewportSize({width,height:width===1440?1000:900});
    await capture(page,role,width,'card-home','/cardholder-services',async page=>{
     await expect(page.getByRole('heading',{name:'Account home',level:1,exact:true})).toBeVisible();
     await expect(cardMenu(page).getByRole('link')).toHaveText(cardLinks);
     await expect(cardMenu(page).getByRole('link',{name:'Account home',exact:true})).toHaveAttribute('aria-current','page');
     await expect(page.getByRole('region',{name:'Selected card overview',exact:true})).toHaveCount(0);
     await expect(page.getByRole('link',{name:'Add money',exact:true})).toHaveCount(own?1:0);
     await expect(page.getByRole('region',{name:'Card account balance',exact:true})).toHaveCount(own?1:0);
     await expect(page.getByRole('link',{name:'Return unused money',exact:true})).toHaveCount(0);
     if(own){
      await expect(page.getByRole('link',{name:'Add money',exact:true})).toHaveAttribute('href',customerHref(`/money-accounts/${cardAccount.id}`,{task:'add'}));
      await expect(page.getByRole('region',{name:'Your card account',exact:true}).getByRole('heading',{level:2,exact:true})).toHaveText(cards.primaryService.displayName);
     }
     else await expect(page.locator('.money-home,.ch-account-counts')).toHaveCount(0);
    });
    await capture(page,role,width,'card-list',customerHref('/cardholder-services',{view:'cards'}),async page=>{
     await expect(cardMenu(page).getByRole('link')).toHaveText(cardLinks);
     await expect(cardMenu(page).getByRole('link',{name:'Cards',exact:true})).toHaveAttribute('aria-current','page');
     if(own)await expect(page.getByRole('navigation',{name:'Card management',exact:true}).getByRole('link')).toHaveText(['Card list','Cardholders','Card history']);
     else await expect(page.getByRole('navigation',{name:'Card management',exact:true})).toHaveCount(0);
     await expect(page.getByRole('navigation',{name:'Card ownership',exact:true})).toHaveCount(own?1:0);
     await expect(page.getByRole('link',{name:'Add card',exact:true})).toHaveCount(own?1:0);
     await expect(page.getByRole('link',{name:'Add money',exact:true})).toHaveCount(0);
     await expect(page.locator('.money-home')).toHaveCount(0);
    });
    if(own)for(const [scope,label,opposite,screen] of [['OWN','For your use','For others','cards-for-your-use'],['MANAGED','For others','For your use','cards-for-others']])await capture(page,role,width,screen,customerHref('/cardholder-services',{view:'cards',cardScope:scope}),async page=>{
     await expect(cardMenu(page).getByRole('link')).toHaveText(cardLinks);
     const categories=page.getByRole('navigation',{name:'Card ownership',exact:true});
     await expect(categories.getByRole('link')).toHaveText([/^All cards\s*\d+$/,/^For your use\s*\d+$/,/^For others\s*\d+$/]);
     await expect(categories.getByRole('link',{name:new RegExp(`^${label}\\s*\\d+$`)})).toHaveAttribute('aria-current','page');
     await expect(page.locator('.ch-list-card-name').filter({hasText:opposite})).toHaveCount(0);
     await expect(page.locator('.money-home')).toHaveCount(0);
    });
    await capture(page,role,width,'card-details',customerHref('/cardholder-services',{focus:card.id}),async page=>{
     await expect(page.getByRole('heading',{name:'Card details',level:1,exact:true})).toBeVisible();
     await expect(page.getByRole('region',{name:'Selected card overview',exact:true})).toContainText(card.nickname);
     await expect(cardMenu(page).getByRole('link',{name:'Cards',exact:true})).toHaveAttribute('aria-current','page');
    });
    await capture(page,role,width,'card-freeze-review',customerHref('/cardholder-services',{view:'cards',focus:card.id}),async page=>{
     await page.getByRole('region',{name:'Card controls',exact:true}).getByRole('button',{name:'Freeze card',exact:true}).click();
     await expect(page.getByRole('dialog',{name:'Freeze card?',exact:true})).toBeVisible();
    });
    if(own){
     await capture(page,role,width,'card-for-others-detail',customerHref('/cardholder-services',{view:'cards',focus:ids.secondaryCardId}),async page=>{
      const detail=page.getByRole('region',{name:'Card management details',exact:true});
      await expect(detail.getByRole('article',{name:'Card spending limit',exact:true})).toBeVisible();
      await expect(detail.getByRole('region',{name:'Cardholder',exact:true})).toBeVisible();
      await expect(page.getByRole('link',{name:/^(Manage card|Managed cards|Card settings)$/})).toHaveCount(0);
     });
     await capture(page,role,width,'card-create',customerHref('/cardholder-services',{view:'cards'}),async page=>{
      await page.getByRole('link',{name:'Add card',exact:true}).click();
      await expect(page).toHaveURL(origin+customerHref('/cardholder-services',{view:'cards',new:'1'}));
      const dialog=page.getByRole('dialog',{name:'Add card',exact:true});
      await expect(dialog.getByRole('radio',{name:/^For someone else/})).toBeChecked();
      await expect(dialog.getByRole('radio',{name:/^For your use/})).toBeVisible();
     });
    }
    await capture(page,role,width,'card-settings',customerHref('/cardholder-services/settings',{context:ids.serviceId}),async page=>{
     await expect(page.getByRole('heading',{name:own?'Account settings':'Preferences',level:1,exact:true})).toBeVisible();
     await expect(cardMenu(page).getByRole('link')).toHaveText(cardLinks);
     await expect(cardMenu(page).getByRole('link',{name:own?'Account settings':'Preferences',exact:true})).toHaveAttribute('aria-current','page');
     await expect(page.getByRole('link',{name:'Return unused money',exact:true})).toHaveCount(own?1:0);
     const details=page.getByRole('region',{name:own?'Account details':'Your card access',exact:true});
     await expect(details).toContainText('Account name');
     await expect(details).toContainText('Account owner');
     if(own)await expect(details).toContainText(cards.primaryService.displayName);
     await expect(page.getByRole('textbox',{name:'Display name',exact:true})).toHaveCount(0);
     const preferences=page.getByRole('region',{name:'Notification preferences',exact:true});
     for(const [key,label] of [['serviceActivity','Card activity'],['cardControls','Card controls'],['caseUpdates','Case updates']]){
      const checkbox=preferences.getByRole('checkbox',{name:new RegExp('^'+label)});
      await expect(checkbox).toBeChecked({checked:notifications.preferences[key]});
      if(notifications.canManage)await expect(checkbox).toBeEnabled();else await expect(checkbox).toBeDisabled();
     }
     await expect(preferences).toContainText('Notification delivery is not available yet.');
     if(own)await expect(page.getByRole('link',{name:'Return unused money',exact:true})).toHaveAttribute('href',customerHref(`/money-accounts/${cardAccount.id}`,{task:'withdraw'}));
     else await expect(page.locator('a[href^="/money-accounts/"]')).toHaveCount(0);
    });
    if(own)for(const [screen,task,title] of [['card-add-money','add','Add money'],['card-return-money','withdraw','Return unused money'],['card-money-activity',null,'Account activity']])await capture(page,role,width,screen,customerHref(`/money-accounts/${cardAccount.id}`,task?{task}:{}),async page=>{
     await expect(page.getByRole('heading',{name:title,level:1,exact:true})).toBeVisible();
     await expect(cardMenu(page).getByRole('link')).toHaveText(cardLinks);
     await expect(cardMenu(page).getByRole('link',{name:'Account home',exact:true})).toHaveAttribute('aria-current','page');
     await expect(page.getByRole('link',{name:'Add money',exact:true})).toHaveCount(0);
     await expect(page.getByRole('link',{name:'Return unused money',exact:true})).toHaveCount(0);
     if(task){await expect(page.getByLabel('Amount (USD)',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Continue',exact:true})).toBeVisible();}
     else await expect(page.getByRole('heading',{name:'Money activity',level:2,exact:true})).toBeVisible();
    });
    const merchantReturn=customerHref('/merchant-services',{view:own?'merchant:'+ids.merchantServiceId:'unit:'+terminal.id,section:'overview',activity:'payments',period:'all'});
    for(const [screen,section,label] of [['merchant-overview','overview','Overview'],['merchant-terminals','merchants','Terminals']])await capture(page,role,width,screen,customerHref('/merchant-services',{section,view:own?'merchant:'+ids.merchantServiceId:'unit:'+terminal.id}),async page=>{
     await expect(merchantMenu(page).getByRole('link')).toHaveText(merchantLinks);
     await expect(merchantMenu(page).getByRole('link',{name:label,exact:true})).toHaveAttribute('aria-current','page');
     await expect(page.getByRole('navigation',{name:'Payment terminal navigation',exact:true})).toHaveCount(0);
     if(section==='overview'){
      await expect(page.getByRole('heading',{name:'Account statement',exact:true})).toBeVisible();
      await expect(page.getByRole('form',{name:'Filter account statement',exact:true})).toBeVisible();
      await expect(page.getByRole('link',{name:'Request payout',exact:true})).toHaveCount(own?1:0);
      if(own)await expect(page.locator('details.money-incoming')).not.toHaveAttribute('open');
     }else await expect(page.getByRole('link',{name:terminal.name,exact:true})).toBeVisible();
     await expect(page.getByRole('link',{name:'Add money',exact:true})).toHaveCount(0);
     if(!own){await expect(page.locator('.money-home,.money-settlements')).toHaveCount(0);await expect(page.locator('a[href^="/money-accounts/"]')).toHaveCount(0);}
    });
    const terminalHref=customerHref(`/merchants/${terminal.id}`,{tab:'channels',returnTo:merchantReturn});
    await capture(page,role,width,'merchant-terminal-detail',terminalHref,async page=>{
     await expect(page.getByRole('heading',{name:terminal.name,level:1,exact:true})).toBeVisible();
     await expect(merchantMenu(page).getByRole('link')).toHaveText(merchantLinks);
     await expect(merchantMenu(page).getByRole('link',{name:'Terminals',exact:true})).toHaveAttribute('aria-current','page');
     await expect(page.getByRole('navigation',{name:'Payment terminal navigation',exact:true})).toHaveCount(0);
     for(const name of ['Payment channels','Terminal activity','Customer support'])await expect(page.getByRole('region',{name,exact:true})).toBeVisible();
     await expect(page.getByRole('region',{name:'People and sharing',exact:true})).toHaveCount(own?1:0);
     await expect(page.getByRole('region',{name:'Terminal controls',exact:true})).toHaveCount(own?1:0);
     await expect(page.getByRole('button',{name:'New payment request',exact:true})).toHaveCount(1);
     if(!own){await expect(page.getByRole('button',{name:'Invite a person',exact:true})).toHaveCount(0);await expect(page.locator('a[href^="/money-accounts/"]')).toHaveCount(0);}
    });
    await capture(page,role,width,'merchant-channel-create',terminalHref,async page=>{
     await page.getByRole('button',{name:'New payment request',exact:true}).click();
     await expect(page).toHaveURL(origin+customerHref(`/merchants/${terminal.id}`,{tab:'channels',new:'1',returnTo:merchantReturn}));
     const dialog=page.getByRole('dialog',{name:'New payment request',exact:true});
     await expect(dialog.getByRole('textbox',{name:'What is this payment for?',exact:true})).toHaveValue('');
     await expect(dialog.getByRole('textbox',{name:'Amount (USD)',exact:true})).toHaveValue('');
     await expect(dialog.getByRole('group',{name:'How will you share the payment request?',exact:true}).getByRole('checkbox')).toHaveCount(terminalWorkspace.allowedPresentations.length);
     await expect(dialog.getByRole('button',{name:'Review request',exact:true})).toBeVisible();
     await expect(dialog.getByRole('button',{name:'Save payment request',exact:true})).toHaveCount(0);
    });
    await capture(page,role,width,'merchant-channel-share',terminalHref,async page=>{
     await page.getByRole('button',{name:`View payment request ${channel.description}`,exact:true}).click();
     await expect(page).toHaveURL(origin+customerHref(`/merchants/${terminal.id}`,{tab:'channels',channel:channel.id,returnTo:merchantReturn}));
     const dialog=page.getByRole('dialog',{name:'Payment request details',exact:true}),sharing=dialog.getByRole('region',{name:'Customer payment link',exact:true});
     await expect(dialog.getByRole('heading',{name:channel.description,exact:true})).toBeVisible();
     await expect(sharing.getByRole('textbox',{name:'Payment link',exact:true})).toHaveValue(publication.publicHref);
     if(publication.state!=='AVAILABLE'){
      await expect(sharing).toContainText(publication.state==='REVOKED'?'Link turned off':'Link currently unavailable');
      await expect(sharing.getByRole('tablist',{name:'Share this payment request',exact:true})).toHaveCount(0);
      await expect(sharing.getByRole('button',{name:'Copy payment link',exact:true})).toHaveCount(0);
      await expect(sharing.getByRole('link',{name:'Preview payment page',exact:true})).toHaveCount(0);
      return;
     }
     await expect(sharing).toContainText('Ready for customers');
     const tabs=sharing.getByRole('tablist',{name:'Share this payment request',exact:true}).getByRole('tab');
     const expectedTabs=sharingNames.filter(([id])=>channel.presentations.includes(id)).map(([,label])=>label);
     await expect(tabs).toHaveText(expectedTabs);
     await tabs.first().focus();await page.keyboard.press('Home');
     for(let index=0;index<expectedTabs.length;index++){
      await expect(tabs.nth(index)).toHaveAttribute('aria-selected','true');
      await expect(sharing.getByRole('tabpanel')).toHaveCount(1);
      await expect(sharing.getByRole('link',{name:'Preview payment page',exact:true})).toHaveAttribute('href',publication.publicHref);
      if(index<expectedTabs.length-1)await page.keyboard.press('ArrowRight');
     }
     await page.keyboard.press('Home');await expect(tabs.first()).toHaveAttribute('aria-selected','true');
     await expect(sharing.getByRole('group',{name:'Card networks',exact:true})).toContainText('Visa');
     await expect(sharing.getByRole('group',{name:'Card networks',exact:true})).toContainText('Mastercard');
     await expect(sharing.getByRole('group',{name:'Card networks',exact:true})).toContainText('American Express');
     await expect(sharing.getByRole('button',{name:'Copy payment link',exact:true})).toBeVisible();
    });
    if(own){
     await capture(page,role,width,'merchant-terminal-invite',terminalHref,async page=>{
      await page.getByRole('button',{name:'Invite a person',exact:true}).click();
      const dialog=page.getByRole('dialog',{name:'Invite a person',exact:true});
      await expect(dialog.getByRole('textbox',{name:'Recipient email',exact:true})).toBeVisible();
      await expect(dialog.getByRole('button',{name:'Review invitation',exact:true})).toBeDisabled();
     });
     for(const [use,label] of [['self','For your use'],['others','For others']])await capture(page,role,width,`merchant-terminals-${use}`,customerHref('/merchant-services',{section:'merchants',view:'merchant:'+ids.merchantServiceId,terminalUse:use}),async page=>{
      await expect(page.getByRole('navigation',{name:'Terminal use',exact:true}).getByRole('link',{name:label,exact:true})).toHaveAttribute('aria-current','page');
     });
     await capture(page,role,width,'merchant-create-terminal',customerHref('/merchant-services',{section:'merchants',view:'merchant:'+ids.merchantServiceId}),async page=>{
      await page.getByRole('link',{name:'Create terminal',exact:true}).click();
      await expect(page).toHaveURL(origin+customerHref('/merchant-services',{section:'merchants',view:'merchant:'+ids.merchantServiceId,new:'1'}));
      const dialog=page.getByRole('dialog',{name:'Create terminal',exact:true});
      await expect(dialog.getByRole('radio',{name:/^For someone else/})).toBeChecked();
      await dialog.getByRole('radio',{name:/^For your use/}).check();
      await expect(dialog.getByRole('textbox',{name:'Payment terminal name',exact:true})).toBeVisible();
     });
     await capture(page,role,width,'merchant-settings',customerHref('/merchant-services',{section:'settings',view:'merchant:'+ids.merchantServiceId}),async page=>{
      await expect(page.getByRole('heading',{name:'Account settings',level:1,exact:true})).toBeVisible();
      await expect(merchantMenu(page).getByRole('link',{name:'Account settings',exact:true})).toHaveAttribute('aria-current','page');
      await expect(page.getByRole('region',{name:'Merchant account settings',exact:true})).not.toContainText('Sign-in');
     });
     await capture(page,role,width,'merchant-business-settings',customerHref(`/merchant-services/${ids.merchantServiceId}/settings`),async page=>{
      await expect(merchantMenu(page).getByRole('link',{name:'Account settings',exact:true})).toHaveAttribute('aria-current','page');
      await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
      await expect(page.getByRole('region',{name:'Business details',exact:true})).toBeVisible();
     });
    }
    if(own)await capture(page,role,width,'merchant-incoming',merchantReturn,async page=>{
     await expect(page.getByRole('heading',{name:'Overview',level:1,exact:true})).toBeVisible();
     await expect(merchantMenu(page).getByRole('link')).toHaveText(ownerMerchantMenu);
     await expect(merchantMenu(page).getByRole('link',{name:'Overview',exact:true})).toHaveAttribute('aria-current','page');
     const incoming=page.locator('details.money-incoming');
     await expect(incoming).not.toHaveAttribute('open');await expect(incoming.locator('summary')).toHaveText('Incoming payments View settlements by terminal');
     await incoming.locator('summary').focus();await page.keyboard.press('Enter');await expect(incoming).toHaveAttribute('open','');
     await expect(page.getByRole('region',{name:`Settlement for ${terminal.name}`,exact:true})).toBeVisible();
     await expect(page.getByRole('link',{name:'Add money',exact:true})).toHaveCount(0);
     await expect(page.getByRole('link',{name:'Withdraw',exact:true})).toHaveCount(0);
     await expect(page.getByRole('link',{name:'Request payout',exact:true})).toHaveCount(1);
    });
    if(own)for(const [screen,task,title] of [['merchant-payout-task','withdraw','Request payout'],['merchant-payout-history',null,'Payouts & activity']])await capture(page,role,width,screen,customerHref(`/money-accounts/${merchantAccount.id}`,{history:'payouts',...(task?{task}:{}),returnTo:merchantReturn}),async page=>{
     await expect(page.getByRole('heading',{name:title,level:1,exact:true})).toBeVisible();
     await expect(merchantMenu(page).getByRole('link')).toHaveText(ownerMerchantMenu);
     await expect(merchantMenu(page).getByRole('link',{name:'Overview',exact:true})).toHaveAttribute('aria-current','page');
     await expect(page.getByRole('link',{name:'Add money',exact:true})).toHaveCount(0);
     await expect(page.getByRole('link',{name:'Request payout',exact:true})).toHaveCount(0);
     await expect(page.locator('details.money-incoming')).toHaveCount(0);
     await expect(page.getByRole('link',{name:'← Your payments',exact:true})).toHaveAttribute('href',merchantReturn);
     if(task){await expect(page.getByLabel('Amount (USD)',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Continue',exact:true})).toBeVisible();}
     else await expect(page.getByRole('heading',{name:'Payout history',level:2,exact:true})).toBeVisible();
    });
    await capture(page,role,width,'profile','/profile',async page=>{
     await expect(page.getByRole('heading',{name:'Your profile',level:1,exact:true})).toBeVisible();
     await expect(page.getByRole('region',{name:'Your details',exact:true}).getByRole('heading',{level:2,exact:true})).toHaveText(profile.displayName);
     const details=page.getByRole('region',{name:'Personal details',exact:true});
     await expect(details.getByRole('textbox',{name:'Display name',exact:true})).toHaveValue(profile.displayName);
     await expect(details.getByRole('textbox',{name:'Display name',exact:true})).toBeEditable();
     await expect(details.getByRole('button',{name:'Save changes',exact:true})).toBeDisabled();
     const signIn=page.getByRole('region',{name:'Sign-in & security',exact:true});
     await expect(signIn).toContainText('Sign-in email');
     await expect(signIn.getByRole('textbox')).toHaveCount(0);
     if(profile.signInEmail){await expect(signIn).toContainText(profile.signInEmail.address);await expect(signIn).toContainText('Verified');}
     else await expect(signIn).toContainText('No verified email is available for this sign-in.');
     await expect(page.getByRole('link',{name:'Manage sign-ins',exact:true})).toHaveAttribute('href','/security');
     await expect(page.locator('a[href^="/money-accounts/"]')).toHaveCount(0);
    });
    await capture(page,role,width,'profile-help-menu','/cardholder-services',async page=>{
     const trigger=page.getByLabel('Profile and help',{exact:true});
     await trigger.focus();await page.keyboard.press('Enter');
     await expect(page.locator('details.account-menu')).toHaveAttribute('open','');
     await expect(page.getByRole('navigation',{name:'Your account',exact:true}).getByRole('link')).toHaveText(['Your profile','Sign-in & security','Help center']);
     await expect(page.getByRole('button',{name:'Sign out',exact:true})).toBeVisible();
    });
   }
   const after=await snapshot(page,endpoints);preserved.push({role,reads:endpoints.length,before,after,unchanged:before===after});
  }finally{await context.close();}
 }
}catch(error){failure(error instanceof Error&&/^[A-Z][A-Z0-9_]+$/.test(error.message)?error.message:'CAPTURE_FAILED',error);}
finally{
 clearTimeout(deadline);if(browser)try{await browser.close();}catch(error){failure('BROWSER_CLOSE_FAILED',error);}
 if(beforeSource)try{afterSource=await sourceHash();}catch(error){failure('SOURCE_HASH_FAILED',error);}
}
const projectionComparisons=preserved.reduce((total,item)=>total+item.reads,0);
const summary={result:checks.length===120&&!checks.some(item=>item.failed)&&!errors.length&&preserved.length===2&&projectionComparisons===23&&preserved.every(item=>item.unchanged)&&beforeSource?.hash===afterSource?.hash?'PASS':'FAIL',screens:checks.length,failed:checks.filter(item=>item.failed).length,runtimeOrGuardErrors:errors.length,fixtureSignIns:signIns,projectionComparisons,source:{before:beforeSource,after:afterSource,unchanged:!!beforeSource&&beforeSource.hash===afterSource?.hash},normalization:'Only projection asOf timestamps are omitted. No report endpoint is captured; all business fields and array order are compared.',preserved};
try{assert(outputReady,'ARTIFACT_DIRECTORY_NOT_CREATED');await writePrivate('checks.json',JSON.stringify({summary,checks,errors},null,2)+'\n');}catch{summary.result='FAIL';}
console.log(JSON.stringify({result:summary.result,screens:summary.screens,failed:summary.failed,runtimeOrGuardErrors:summary.runtimeOrGuardErrors,sourceUnchanged:summary.source.unchanged,artifactDirectory:path.relative(root,output)}));
if(summary.result!=='PASS')process.exitCode=1;

/** Opt-in D83 page-family coverage. Called only by the guarded preview capture. */
import {expect} from '@playwright/test';
import {customerHref} from '../src/shared/customer-routes.ts';

const missingId='00000000-0000-4000-8000-00000000d830';
const widths=[1440,390,320];
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const heading=name=>async page=>{await expect(page.getByRole('heading',{level:1})).toHaveCount(1);await expect(page.getByRole('heading',{level:1,name,exact:true})).toBeVisible();};
function gap(gaps,family,role,reason){if(!gaps.some(item=>item.family===family&&item.role===role&&item.reason===reason))gaps.push({family,role,reason});}

// This runs inside the caller's verified REPEATABLE READ, READ ONLY transaction.
// Read only fixture bindings, assigned scopes and IDs linked to marked cards/publications.
// No session, credential, guest-cookie or token values are selected.
export async function discoverAllPages(client,ids,assert){
 assert(uuid.test(ids.operatorId)&&uuid.test(ids.supportCaseId)&&Array.isArray(ids.channels)&&ids.channels.every(row=>uuid.test(row.id)&&uuid.test(row.unitId)&&uuid.test(row.publicationId)),'INVALID_EXTENDED_PREVIEW_MARKER');
 const binding=await client.query('SELECT "personId" FROM public.identity_bindings WHERE issuer=$1 AND subject=$2',['urn:etail:isolated-fixture','operator']);
 assert(binding.rows.length===1&&binding.rows[0].personId===ids.operatorId,'OPERATOR_FIXTURE_NOT_PREPARED');
 const assignments=await client.query('SELECT a."serviceId",a.state,a."canRespond",a."canProcessDeposits",a."canResolveDisputes",s.status FROM public.operator_service_access a JOIN public.services s ON s.id=a."serviceId" WHERE a."personId"=$1 ORDER BY a."serviceId"',[ids.operatorId]);
 assert(assignments.rows.length>0&&assignments.rows.every(row=>[ids.serviceId,ids.merchantServiceId].includes(row.serviceId)),'OPERATOR_SCOPE_NOT_PREPARED');
 const active=assignments.rows.filter(row=>row.state==='ACCEPTED'&&row.status!=='CLOSED');
 assert(active.length>0,'OPERATOR_ASSIGNMENT_UNAVAILABLE');
 const payments=await client.query('SELECT p.id,c.id AS "attemptId",c."publicationId",c."payerId",c."cardId",p."merchantUnitId",p."cardActivityId" FROM public.merchant_test_payments p JOIN public.card_checkout_attempts c ON c.id=p."cardCheckoutId" JOIN public.cards card ON card.id=c."cardId" AND card."serviceId"=c."cardServiceId" WHERE p."serviceId"=$1 AND c."cardServiceId"=$2 AND c."publicationId"=ANY($3::uuid[]) AND c."payerId"=ANY($4::uuid[]) AND c."cardId"=ANY($5::uuid[]) AND card."holderId"=c."payerId" AND p.outcome=$6 ORDER BY p."createdAt",p.id',[ids.merchantServiceId,ids.serviceId,ids.channels.map(row=>row.publicationId),[ids.primaryId,ids.secondaryId],[ids.primaryCardId,ids.secondaryCardId],'APPROVED']);
 return {payments:payments.rows,operator:{canProcess:active.some(row=>row.canProcessDeposits),canReviewDisputes:active.some(row=>row.canResolveDisputes)}};
}

export async function prepareCustomerPages({page,read,assert,ids,expanded,role,personId,cards,card,terminal,endpoints,coverageGaps}){
 const invitations=await read(page,'/api/v1/invitations');
 assert(Array.isArray(invitations)&&invitations.every(item=>uuid.test(item.id)),'INVALID_INVITATION_PROJECTION');
 const casesPath=`/api/v1/cardholder-services/${ids.serviceId}/cases`,cases=await read(page,casesPath);
 assert(Array.isArray(cases.cases)&&cases.cases.every(item=>item.serviceId===ids.serviceId),'INVALID_CASE_PROJECTION');
 const operatorPaths=['/api/v1/invitations','/api/v1/auth/sessions',casesPath,`/api/v1/merchants/${terminal.id}/cases`,`/api/v1/merchants/${terminal.id}/disputes`];
 endpoints.push(...operatorPaths);
 const operations=await read(page,`/api/v1/merchants/${terminal.id}/operations`);
 const funds=role==='owner'?await read(page,`/api/v1/cardholder-services/${ids.serviceId}/funds`):null;
 const invitation=invitations.find(item=>item.targetKind==='CARD'&&item.cardId===card.id)||invitations.find(item=>item.targetKind==='MERCHANT_TERMINAL'&&item.terminalId===terminal.id);
 if(invitation)endpoints.push(`/api/v1/invitations/${invitation.id}`);
 else gap(coverageGaps,'invitation-detail',role,'No current exact card/terminal invitation exists for the marked recipient. Inbox and unavailable invitation are captured; no invitation is created.');
 const payerPayment=expanded.payments.find(item=>item.payerId===personId&&item.cardId===card.id&&cards.activity.some(activity=>activity.id===item.cardActivityId));
 if(!payerPayment)gap(coverageGaps,'payer-dispute',role,'No currently readable prepared payment is linked to this person’s marked card. Only the unavailable payment state is captured.');
 const checkoutPath=payerPayment?`/api/v1/checkout/${payerPayment.publicationId}/card/${payerPayment.attemptId}`:null;
 const checkoutReview=checkoutPath?await read(page,checkoutPath):null;
 if(checkoutReview){assert(checkoutReview.id===payerPayment.attemptId&&checkoutReview.publicationId===payerPayment.publicationId&&checkoutReview.receipt?.paymentId===payerPayment.id&&checkoutReview.lastFour===card.lastFour,'SAVED_CHECKOUT_SCOPE_MISMATCH');endpoints.push(checkoutPath);}
 else gap(coverageGaps,'saved-card-checkout',role,'No currently authorized prepared saved card-payment review exists. No review or payment is created.');
 const supportCase=cases.cases.find(item=>item.id===ids.supportCaseId);
 if(supportCase)endpoints.push(`${casesPath}/${supportCase.id}`);
 const request=role==='owner'?cards.requests.find(item=>item.serviceId===ids.serviceId&&item.issuedCardId===card.id):null;
 if(role==='owner'&&!request)gap(coverageGaps,'card-request-detail',role,'The marked card’s setup is absent from the current authorized history page; no historical request is manufactured.');
 const inviteCard=role==='owner'?(cards.cards.find(item=>item.serviceId===ids.serviceId&&item.canInvite)||cards.cards.find(item=>item.id===ids.secondaryCardId)):null;
 if(inviteCard){
  // This command endpoint is POST-only. The page loader reads getCardInvitations
  // server-side; do not pretend that a GET invitation projection exists here.
  gap(coverageGaps,'card-invitation-projection','owner','The card invitation manager is server-rendered and has no read API. Its authorized page is captured with all writes blocked; existing card/account/access projections remain in the before/after digest.');
  if(!inviteCard.canInvite)gap(coverageGaps,'card-invitation-create','owner','Prepared cards are already assigned. The exact invitation manager is captured in its saved assigned state; no card is created.');
 }
 return {invitations,invitation,supportCase,payerPayment,checkoutReview,request,operations,funds,inviteCard};
}

export async function captureCustomerPages({page,capture,role,width,ids,cards,card,terminal,extra,coverageGaps}){
 const own=role==='owner';
 const shot=(screen,url,ready,family,state)=>capture(page,role,width,screen,url,ready,{family,state});
 await shot('service-hub','/services',async page=>{await heading('Your dashboard')(page);await expect(page.locator('a[href="/cardholder-services"]')).not.toHaveCount(0);await expect(page.locator('a[href="/merchant-services"]')).not.toHaveCount(0);},'services');
 await shot('security','/security',async page=>{await heading('Sign-in & security')(page);await expect(page.getByRole('heading',{name:'Active sign-ins',level:2,exact:true})).toBeVisible();await expect(page.getByText('This session',{exact:true})).toBeVisible();},'security');
 await shot('invitations','/shared-access',heading('Invitations'),'invitations',extra.invitations.length?'available':'empty');
 await shot('invitation-unavailable',`/invitations/${missingId}`,heading('This invitation isn’t available'),'invitations','denied');
 if(extra.invitation)await shot('invitation-detail',`/invitations/${extra.invitation.id}`,heading(extra.invitation.targetKind==='CARD'?'Your card invitation':'Your payment terminal invitation'),'invitations',extra.invitation.status.toLowerCase());
 for(const [task,title,family] of [['activity','Activity','card-activity'],['reports','Statements & reports','card-reports'],['help','Help & support','card-help'],['membership','Membership','membership']]){
  await shot(`card-${task}`,customerHref(`/cardholder-services/${task}`,{focus:card.id}),async page=>{
   await heading(title)(page);await expect(page.locator('.ch-heading')).toContainText(card.nickname);
   if(task==='activity')await expect(page.getByRole('region',{name:'Card activity',exact:true})).toBeVisible();
   if(task==='reports')await expect(page.getByRole('form',{name:'Statement filters',exact:true})).toBeVisible();
   if(task==='membership')await expect(page.getByRole('region',{name:'Membership plan comparison',exact:true})).toBeVisible();
  },family);
 }
 const transaction=cards.activity.find(item=>item.cardId===card.id);
 if(transaction)await shot('card-transaction',customerHref('/cardholder-services/activity',{focus:card.id,transaction:transaction.id}),async page=>{await expect(page.getByRole('dialog',{name:'Transaction details',exact:true})).toBeVisible();await expect(page.getByRole('dialog')).toContainText(card.nickname);},'card-activity');
 else gap(coverageGaps,'card-transaction',role,'No current prepared card transaction is available for a detail dialog.');
 if(extra.supportCase)await shot('card-support-case',customerHref('/cardholder-services/help',{focus:card.id,case:extra.supportCase.id}),async page=>{await heading('Help & support')(page);await expect(page.getByRole('heading',{name:extra.supportCase.subject,exact:true})).toBeVisible();},'card-help');
 if(own){
  await shot('cardholders',customerHref('/cardholder-services',{view:'cardholders'}),async page=>{await heading('Cardholders')(page);await expect(page.getByRole('region',{name:'Cardholder management',exact:true})).toBeVisible();},'card-history');
  await shot('card-history',customerHref('/cardholder-services',{view:'requests'}),async page=>{await heading('Card history')(page);await expect(page.getByRole('searchbox',{name:'Search card history',exact:true})).toBeVisible();},'card-history');
  if(extra.request)await shot('card-request-detail',customerHref('/cardholder-services',{request:extra.request.id}),async page=>{await expect(page.getByRole('dialog')).toHaveCount(1);await expect(page.getByRole('dialog')).toContainText(extra.request.nickname);},'card-history');
  if(extra.inviteCard)await shot('card-invitation-manager',customerHref('/cardholder-services',{focus:extra.inviteCard.id,invite:'1'}),async page=>{await expect(page.getByRole('dialog',{name:'Invite cardholder',exact:true})).toBeVisible();await expect(page.getByRole('dialog')).toContainText(extra.inviteCard.nickname);},'invitations',extra.inviteCard.canInvite?'available':'assigned');
  await shot('card-account-activity',customerHref('/cardholder-services/activity',{context:ids.serviceId}),async page=>{await heading('Activity')(page);await expect(page.getByRole('region',{name:'Card activity',exact:true})).toBeVisible();},'card-activity');
  await shot('historical-funding',`/cardholder-services/funds?service=${ids.serviceId}&page=0`,heading('Top-up history'),'funding-history',extra.funds.topups.length?'available':'empty');
  const receipt=extra.funds.topups[0];
  if(receipt)await shot('historical-funding-receipt',`/cardholder-services/funds/receipts/${receipt.id}?service=${ids.serviceId}`,async page=>{await heading('Money added')(page);await expect(page.getByRole('region',{name:'Top-up receipt',exact:true})).toContainText(receipt.reference);},'funding-history');
  else gap(coverageGaps,'funding-history','owner','No authorized historical top-up exists; history empty state is captured.');
 }
 await shot('payment-help',`/payments/${extra.payerPayment?.id??missingId}/dispute`,heading(extra.payerPayment?'Payment help':'Payment unavailable'),'payer-dispute',extra.payerPayment?'available':'denied');
 if(extra.checkoutReview)await shot('saved-card-checkout',`/checkout/${extra.checkoutReview.publicationId}/card?review=${extra.checkoutReview.id}`,async page=>{await heading(extra.checkoutReview.receipt.refundedAt?'Payment refunded':'Payment complete')(page);await expect(page.locator('.gc-card')).toContainText(extra.checkoutReview.receipt.reference);await expect(page.locator('.gc-card')).toContainText(card.lastFour);},'saved-card-checkout',extra.checkoutReview.receipt.refundedAt?'refunded':'paid');
 const returnTo=customerHref('/merchant-services',{view:own?'merchant:'+ids.merchantServiceId:'unit:'+terminal.id});
 const oldBusinessPath=`/merchants/${terminal.id}/business-details`,businessPath=customerHref(oldBusinessPath,{returnTo});
 await shot('terminal-business-details',`${oldBusinessPath}?${new URLSearchParams({returnTo})}`,async page=>{await expect(page).toHaveURL('http://127.0.0.1:3100'+businessPath);if(own){await expect(page.getByRole('heading',{level:1})).toHaveCount(1);await expect(page.getByRole('region',{name:'Business details',exact:true})).toBeVisible();}else await heading('Business details are unavailable')(page);},'terminal-business-details',own?'available':'denied');
 for(const [tab,screen,family] of [['payments','terminal-activity','terminal-activity'],['help','terminal-help','terminal-help'],['disputes','terminal-disputes','terminal-disputes']])await shot(screen,customerHref(`/merchants/${terminal.id}`,{tab,returnTo}),async page=>{
  await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
  if(tab==='payments')await expect(page.getByRole('navigation',{name:'Payment activity views',exact:true})).toBeVisible();
  if(tab==='help')await expect(page.getByRole('complementary',{name:'Your support cases',exact:true})).toBeVisible();
  if(tab==='disputes')await expect(page.getByRole('region',{name:'Disputes',exact:true})).toBeVisible();
 },family);
 const payment=extra.operations.payments.find(item=>item.merchantUnitId===terminal.id);
 if(payment)await shot('terminal-payment-receipt',customerHref(`/merchants/${terminal.id}`,{tab:'payments',payment:payment.id,returnTo}),async page=>{await expect(page.getByRole('dialog')).toHaveCount(1);await expect(page.getByRole('dialog')).toContainText(payment.testReference);},'terminal-activity');
 else gap(coverageGaps,'terminal-payment-receipt',role,'The assigned terminal has no currently readable payment receipt.');
 if(!own){
  await shot('operator-access-denied','/operations',heading('Customer care unavailable'),'operator','denied');
  await shot('other-card-unavailable',customerHref('/cardholder-services',{focus:ids.primaryCardId}),async page=>{await expect(page.getByRole('heading',{level:1})).toHaveCount(1);await expect(page.getByRole('region',{name:'Selected card overview',exact:true})).toHaveCount(0);await expect(page.locator('.money-home')).toHaveCount(0);},'card-access','denied');
 }
}

export async function captureOperatorPages({page,ids,expanded,capture,read,snapshot,preserved,coverageGaps,assert}){
 const profile=await read(page,'/api/v1/profile');assert(profile.personId===ids.operatorId,'WRONG_OPERATOR_PERSON');
 const queue=await read(page,'/api/v1/operations/cases');assert(Array.isArray(queue),'INVALID_OPERATOR_QUEUE');
 const selected=queue.find(item=>item.id===ids.supportCaseId);
 const endpoints=['/api/v1/profile','/api/v1/operations/cases'];
 if(selected)endpoints.push(`/api/v1/operations/cases/${selected.id}`);else gap(coverageGaps,'operator-case','operator','The marked support case is not in the current assigned queue.');
 let disputes=[];
 if(expanded.operator.canReviewDisputes){disputes=await read(page,'/api/v1/operations/disputes');assert(Array.isArray(disputes),'INVALID_OPERATOR_DISPUTES');endpoints.push('/api/v1/operations/disputes');}
 else gap(coverageGaps,'operator-disputes','operator','The prepared operator has no current dispute-review assignment. Access-required UI is captured without widening permission.');
 if(!disputes.length)gap(coverageGaps,'operator-dispute-detail','operator','No prepared readable dispute review exists; no customer report or review is created.');
 if(!expanded.operator.canProcess)gap(coverageGaps,'operator-withdrawals','operator','The prepared operator has no current withdrawal-processing assignment. Access-required UI is captured.');
 const before=await snapshot(page,endpoints);
 for(const width of widths){
  await page.setViewportSize({width,height:width===1440?1000:900});
  const shot=(screen,url,ready,state)=>capture(page,'operator',width,screen,url,ready,{family:'operator',state});
  await shot('care-queue','/operations',heading('Customer care'),queue.length?'available':'empty');
  if(selected)await shot('care-case',`/operations?case=${selected.id}`,async page=>{await heading('Customer care')(page);await expect(page.getByRole('region',{name:'Selected case',exact:true})).toContainText(selected.reference);},selected.status.toLowerCase());
  await shot('previous-deposits','/operations/deposits',async page=>{await heading('Deposit processing')(page);if(await page.getByText('No pending deposits for your assigned merchants.',{exact:true}).isVisible())gap(coverageGaps,'operator-deposit-detail','operator','No prepared pending deposit exists; the processing queue empty state is captured.');});
  await shot('withdrawal-processing','/operations/money-withdrawals',async page=>{await heading(expanded.operator.canProcess?'Withdrawal processing':'Access required')(page);if(await page.getByText('No withdrawals are waiting for your review.',{exact:true}).isVisible())gap(coverageGaps,'operator-withdrawal-detail','operator','No prepared pending withdrawal exists; the processing queue empty state is captured.');},expanded.operator.canProcess?'available':'denied');
  await shot('dispute-review','/operations/disputes',heading(expanded.operator.canReviewDisputes?'Dispute review':'Access required'),expanded.operator.canReviewDisputes?(disputes.length?'available':'empty'):'denied');
 }
 const after=await snapshot(page,endpoints);preserved.push({role:'operator',reads:endpoints.length,before,after,unchanged:before===after});
}

export async function capturePublicPages({page,capture,publications,coverageGaps,assert}){
 assert(publications.length>0,'PREPARED_PUBLIC_CHECKOUT_MISSING');
 const publication=publications.find(item=>item.state==='AVAILABLE')??publications[0];
 if(publication.state!=='AVAILABLE')gap(coverageGaps,'checkout','anonymous','The marked published request is not currently available. Its actual unavailable state is captured; no link is renewed.');
 gap(coverageGaps,'public-receipt','anonymous','A positive saved receipt requires its original browser-bound checkout session. This fresh anonymous context captures denial only; no guest cookie is fabricated and no payment is submitted.');
 gap(coverageGaps,'email-confirmation-recovery','anonymous','Email confirmation and new-password forms require real provider-issued links. Only sign-in, registration and request-reset modes are opened; no email is sent or token synthesized.');
 for(const width of widths){
  await page.setViewportSize({width,height:width===1440?1000:900});
  const shot=(screen,url,ready,family='public',state='available',status)=>capture(page,'anonymous',width,screen,url,ready,{family,state,public:true,status});
  await shot('home','/',async page=>{await expect(page.getByRole('heading',{level:1})).toHaveCount(1);await expect(page.getByRole('region',{name:'Cards dashboard',exact:true})).toBeVisible();});
  await shot('home-payments','/',async page=>{await page.getByRole('group',{name:'Cards and payments',exact:true}).getByRole('button',{name:'Payments',exact:true}).click();await expect(page.getByRole('region',{name:'Payments dashboard',exact:true})).toBeVisible();});
  await shot('cards','/card-services',async page=>{await expect(page.getByRole('heading',{level:1})).toHaveCount(1);await expect(page.getByRole('link',{name:'Open your cards',exact:true})).toBeVisible();});
  await shot('payments','/payment-services',async page=>{await expect(page.getByRole('heading',{level:1})).toHaveCount(1);await expect(page.getByRole('link',{name:'Open your payments',exact:true})).toBeVisible();});
  for(const label of ['Text','Email','Invoice','Bill','Social','QR code','Website'])await shot(`channel-${label.toLowerCase().replaceAll(' ','-')}`,'/',async page=>{const tabs=page.getByRole('tablist',{name:'Ways to share a payment request',exact:true});await expect(tabs).toBeVisible();const tab=tabs.getByRole('tab',{name:label,exact:true});await tab.click();await expect(tab).toHaveAttribute('aria-selected','true');await expect(page.getByRole('tabpanel')).toBeVisible();},'public-channels');
  await shot('help','/help',heading('Help center'));
  await shot('help-expanded','/help',async page=>{await heading('Help center')(page);await page.locator('.help-guide details').first().locator('summary').click();await expect(page.locator('.help-guide details').first()).toHaveAttribute('open','');});
  for(const [screen,mode] of [['login','login'],['register','register'],['password-recovery','recover']])await shot(screen,mode==='register'?'/login?mode=register':'/login',async page=>{
   if(mode==='recover')await page.getByRole('button',{name:'Forgot your password?',exact:true}).click();
   const title=mode==='register'?'Create your login':mode==='recover'?'Reset your password':'Sign in with email';
   await expect(page.getByRole('form',{name:title,exact:true})).toBeVisible();await expect(page.getByRole('textbox',{name:'Email address',exact:true})).toHaveValue('');
  },'auth');
  await shot('invitation-entry',`/invitations/${missingId}`,async page=>{await heading('You’ve been invited')(page);await expect(page.getByRole('link',{name:'Create a login',exact:true})).toHaveAttribute('href',`/login?next=${encodeURIComponent('/invitations/'+missingId)}&mode=register`);},'invitations','anonymous-entry');
  await shot('checkout',publication.path,async page=>{
   await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
   await heading(publication.description)(page);await expect(page.getByRole('group',{name:'Choose a sandbox card',exact:true})).toBeVisible();
   if(publication.state!=='AVAILABLE')await expect(page.getByRole('button',{name:/^Pay /})).toHaveCount(0);
  },'checkout',publication.state.toLowerCase());
  await shot('checkout-unavailable',`/checkout/${missingId}`,heading('This payment link isn’t available'),'checkout','unavailable');
  await shot('private-receipt-denied',`/checkout/orders/${missingId}`,heading('This order isn’t available in this browser'),'receipt-denied','denied');
  await shot('page-not-found','/d83-page-that-does-not-exist',heading('Page not found'),'not-found','expected404',404);
 }
}

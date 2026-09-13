import { describe, expect, it } from "vitest";
import { customerHref, customerRouteQuery } from "../../src/shared/customer-routes";
import { cardholderHomeHref, cardholderTaskHref } from "../../src/ui/cardholder-routing";
import { authNextPath, loginLocation } from "../../src/shared/auth-continuation";
import { merchantActivityReturn, merchantRecordHref } from "../../src/shared/merchant-activity";
import { transactionBelongsToCard } from "../../src/shared/cardholder-selection";
const card="10000000-0000-4000-8000-000000000001", other="10000000-0000-4000-8000-000000000002", terminal="10000000-0000-4000-8000-000000000003";
function split(href:string){const url=new URL(href,"https://etail.invalid");return {path:url.pathname,query:url.searchParams};}

describe("canonical customer page locators",()=>{
 it("rejects another readable card's transaction under an exact selected-card heading",()=>{
  const transaction="10000000-0000-4000-8000-000000000004";
  const ownerActivity=[{id:transaction,cardId:other}];
  expect(transactionBelongsToCard(ownerActivity,transaction,card)).toBe(false);
  expect(transactionBelongsToCard(ownerActivity,transaction,other)).toBe(true);
  expect(transactionBelongsToCard([{id:transaction,cardId:null}],transaction,card)).toBe(false);
 });
 it.each([
  ["/cardholder-services",{view:"cards"},"/cardholder-services/cards"],
  ["/cardholder-services",{new:"1"},"/cardholder-services/cards/new"],
  ["/cardholder-services",{view:"cards",focus:card},`/cardholder-services/cards/${card}`],
  ["/cardholder-services",{card},`/cardholder-services/cards/${card}`],
  ["/cardholder-services",{view:"cards",focus:card,invite:"1"},`/cardholder-services/cards/${card}/invite`],
  ["/cardholder-services",{view:"requests"},"/cardholder-services/card-requests"],
  ["/cardholder-services",{request:other,review:"1"},`/cardholder-services/card-requests/${other}?review=1`],
  ["/cardholder-services",{view:"cardholders"},"/cardholder-services/cardholders"],
  ["/cardholder-services",{activityCard:card,transaction:other},`/cardholder-services/cards/${card}/activity?transaction=${other}`],
  ["/merchant-services",{section:"merchants",view:`merchant:${other}`,terminalUse:"others"},`/merchant-services/terminals?view=merchant%3A${other}&terminalUse=others`],
  ["/merchant-services",{section:"settings"},"/merchant-services/settings"],
  ["/merchant-services",{section:"merchants",view:`merchant:${other}`,new:"1"},`/merchant-services/${other}/terminals/new`],
  [`/merchants/${terminal}`,{tab:"channels"},`/merchant-services/terminals/${terminal}`],
  [`/merchants/${terminal}`,{tab:"channels",new:"1"},`/merchant-services/terminals/${terminal}/channels/new`],
  [`/merchants/${terminal}`,{tab:"channels",channel:other},`/merchant-services/terminals/${terminal}/channels/${other}`],
  [`/merchants/${terminal}`,{tab:"payments",payment:other},`/merchant-services/terminals/${terminal}/payments?payment=${other}`],
  [`/merchants/${terminal}`,{tab:"verification"},`/merchant-services/terminals/${terminal}/controls`],
  [`/money-accounts/${other}`,{task:"add",review:card},`/money-accounts/${other}/add-money?review=${card}`],
 ] as const)("translates %s without duplicate renderers",(path,query,expected)=>{
  const canonical=customerHref(path,query);expect(canonical).toBe(expected);
  const next=split(canonical);expect(customerHref(next.path,next.query)).toBe(canonical);
 });
 it("retains exact card task, transaction and account context without choosing another card",()=>{
  const target=cardholderTaskHref("activity",{cardId:card},{transaction:other,q:"Shop & garden"});
  expect(target).toBe(`/cardholder-services/cards/${card}/activity?transaction=${other}&q=Shop+%26+garden`);
  const next=split(target),query=customerRouteQuery(next.path,next.query);
  expect(query.get("focus")).toBe(card);expect(query.get("transaction")).toBe(other);
  expect(cardholderTaskHref("settings",{contextId:other})).toBe(`/cardholder-services/settings?context=${other}`);
  expect(cardholderHomeHref()).toBe("/cardholder-services");
 });
 it("retains card list and setup history pagination independently of selected resource",()=>{
  const target=cardholderHomeHref(card,{view:"requests",requestPage:"2",requestSearch:"A & B"});
  expect(target).toBe(`/cardholder-services/card-requests?requestPage=2&requestSearch=A+%26+B&focus=${card}`);
  const query=customerRouteQuery(split(target).path,split(target).query);
  expect(query.get("view")).toBe("requests");expect(query.get("focus")).toBe(card);
 });
 it.each([
  [`/cardholder-services/cards/${card}`,{focus:other}],
  [`/cardholder-services/cards/${card}`,{card:other}],
  [`/cardholder-services/cards/${card}`,{request:other}],
  [`/cardholder-services/cards/${card}`,{new:"1"}],
  [`/cardholder-services/cards/${card}/activity`,{view:"cards"}],
  ["/cardholder-services/cards/new",{focus:card}],
  ["/cardholder-services",{view:"unknown"}],
  ["/cardholder-services",{view:"activity",new:"1"}],
  ["/cardholder-services",{view:"overview",focus:card}],
  ["/cardholder-services/cards",{card}],
  ["/cardholder-services/cards",{new:"1"}],
  ["/cardholder-services/card-requests",{card}],
  ["/cardholder-services/card-requests",{new:"1"}],
  ["/cardholder-services/cardholders",{card}],
  ["/cardholder-services/cardholders",{request:other}],
  ["/cardholder-services/activity",{request:other}],
  ["/cardholder-services/activity",{new:"1"}],
  ["/cardholder-services/settings",{view:"cards"}],
  ["/cardholder-services",{view:"requests",card}],
  ["/cardholder-services",{view:"cardholders",request:other}],
  ["/cardholder-services",{review:"1"}],
  ["/cardholder-services",{new:"1",review:"1"}],
  ["/cardholder-services",{invite:"1"}],
  [`/cardholder-services/cards/${card}/invite`,{transaction:other}],
  [`/cardholder-services/card-requests/${other}`,{card}],
  ["/merchant-services/terminals",{new:"1",view:`merchant:${other}`}],
  ["/merchant-services/settings",{new:"1"}],
  ["/merchant-services",{section:"overview",view:`merchant:${other}`,new:"1"}],
  ["/merchant-services",{section:"merchants",view:`merchant:${other}`,new:"2"}],
  [`/merchant-services/terminals/${terminal}/people`,{new:"1"}],
  [`/merchant-services/terminals/${terminal}/channels/${other}`,{payment:card}],
  [`/merchant-services/terminals/${terminal}/controls`,{channel:card}],
  [`/money-accounts/${other}`,{review:card}],
  ["/cardholder-services",{focus:card,activityCard:other}],
  ["/cardholder-services",{request:other,new:"1"}],
  ["/cardholder-services",{focus:[card,card]}],
  [`/merchant-services/terminals/${terminal}/channels/${card}`,{channel:other}],
  [`/merchant-services/terminals/${terminal}/channels/new`,{channel:other}],
  [`/merchant-services/terminals/${terminal}/payments`,{tab:"people"}],
  [`/merchant-services/${other}/terminals/new`,{view:`merchant:${card}`}],
  [`/money-accounts/${card}/add-money`,{task:"withdraw"}],
  [`/money-accounts/${card}/withdraw`,{review:[other,other]}],
 ] as const)("fails closed on conflicting or repeated resource state %#",(path,query)=>expect(()=>customerHref(path,query as Record<string,string|string[]>)).toThrow());
 it("retains exact support request and receipt context without confusing card creation",()=>{
  const help=cardholderTaskHref("help",{cardId:card},{new:"1",transaction:other,topic:"transaction"});
  const location=split(help),query=customerRouteQuery(location.path,location.query);
  expect(location.path).toBe(`/cardholder-services/cards/${card}/help`);
  expect(query.get("new")).toBe("1");expect(query.get("focus")).toBe(card);expect(query.get("transaction")).toBe(other);
  expect(customerHref(location.path,location.query)).toBe(help);
 });
 it("cleans redundant overview defaults without erasing saved payment-only scope",()=>{
  expect(customerHref("/merchant-services",{section:"overview",activity:"payments",period:"all"})).toBe("/merchant-services");
  expect(customerHref("/merchant-services",{activity:"payments",period:"all"})).toBe("/merchant-services?activity=payments&period=all");
  const overview=customerHref("/merchant-services",{section:"overview",q:"receipt",period:"last7"});
  expect(split(overview).query.get("section")).toBe("overview");
  expect(customerHref(split(overview).path,split(overview).query)).toBe(overview);
 });
 it("keeps a terminal investigation, receipt and independent money history pages",()=>{
  const back=`/merchant-services?view=unit%3A${terminal}&activity=refunds&period=all&page=3`;
  expect(merchantActivityReturn(back)).toBe(back);
  const record=merchantRecordHref(terminal,{tab:"payments",payment:card},back);
  expect(split(record).path).toBe(`/merchant-services/terminals/${terminal}/payments`);
  expect(split(record).query.get("returnTo")).toBe(back);
  const money=customerHref(`/money-accounts/${other}`,{task:"withdraw",history:"balance",page:"2",review:card,returnTo:back});
  expect(split(money).query.get("page")).toBe("2");expect(split(money).query.get("returnTo")).toBe(back);
  const directory=`/merchant-services/terminals?view=unit%3A${terminal}&activity=payments&period=all`;
  expect(merchantActivityReturn(directory)).toBe(directory);
 });
});

describe("clean sign-in locations",()=>{
 it("keeps exact safe destinations without adding authority to email enrollment",()=>{
  for(const href of [cardholderHomeHref(card),`/cardholder-services/cards/${card}/invite`,`/merchant-services/terminals/${terminal}/channels/${other}`,`/money-accounts/${other}/withdraw?review=${card}`,"/security","/profile"])expect(authNextPath(href)).toBe(href);
  expect(authNextPath(`/cardholder-services?view=cards&focus=${card}`)).toBe(cardholderHomeHref(card));
 });
 it("drops unrelated login state while retaining a valid invitation and registration mode",()=>{
  expect(loginLocation("?view=cards")).toBe("/login");
  expect(loginLocation(`?view=cards&mode=register&next=${encodeURIComponent(`/invitations/${other}`)}`)).toBe(`/login?mode=register&next=%2Finvitations%2F${other}`);
  expect(loginLocation("?next=https%3A%2F%2Fforeign.example&mode=register&mode=login")).toBe("/login");
  expect(loginLocation("?next=%2Fservices&next=%2Fprofile")).toBe("/login");
 });
 it.each([`/cardholder-services/cards/${card}?focus=${other}`,`/money-accounts/${other}/add-money?task=withdraw`,`/money-accounts/${other}/withdraw?returnTo=https://foreign.example`,"/merchant-services/terminals?view=unit:wrong","/cardholder-services?unknown=1","/merchant-services/../profile","//foreign.example","/cardholder-services/%63ards",`/merchant-services/terminals/${terminal}/channels/${other}#token`])("rejects a widened or conflicting sign-in destination %s",href=>expect(authNextPath(href)).toBeNull());
});

import {beforeEach,describe,expect,it,vi} from "vitest";
import type {MoneyAccountOverview} from "../../src/modules/money/contracts";
import {SecurityError} from "../../src/platform/security/origin";

const reads=vi.hoisted(()=>({getMerchantDashboard:vi.fn(),getMerchantWorkspace:vi.fn(),getMerchantOperations:vi.fn(),getMoneyAccountOverview:vi.fn()}));
vi.mock("../../src/modules/acquiring/dashboard-service",()=>({getMerchantDashboard:reads.getMerchantDashboard}));
vi.mock("../../src/modules/acquiring/service",()=>({getMerchantWorkspace:reads.getMerchantWorkspace}));
vi.mock("../../src/modules/acquiring/operations-service",()=>({getMerchantOperations:reads.getMerchantOperations}));
vi.mock("../../src/modules/money/service",()=>({getMoneyAccountOverview:reads.getMoneyAccountOverview}));
import {getMerchantMoneyWorkspace} from "../../src/modules/acquiring/money-workspace";

const owner="00000000-0000-4000-8000-000000000001",accountId="00000000-0000-4000-8000-000000000002",serviceId="00000000-0000-4000-8000-000000000003";
const money=(minor:string)=>({minor,currency:"USD" as const,formatted:`$${(Number(minor)/100).toFixed(2)}`});
const account:MoneyAccountOverview={id:accountId,displayName:"Owned business",serviceKind:"MERCHANT",currency:"USD",status:"ACTIVE",version:1,services:[{id:serviceId,kind:"MERCHANT",displayName:"Owned business"}],available:money("1200"),pendingWithdrawals:money("100"),history:[],withdrawals:[],withdrawalsHasMore:false,page:3,hasMore:false,canAddMoney:false,canWithdraw:true};
const terminal={id:"00000000-0000-4000-8000-000000000004",merchantServiceId:serviceId,ownerAccess:true};
beforeEach(()=>{
 Object.values(reads).forEach(mock=>mock.mockReset());
 reads.getMerchantDashboard.mockResolvedValue({units:[terminal]});
 reads.getMerchantWorkspace.mockResolvedValue({merchant:{id:terminal.id}});
 reads.getMerchantOperations.mockResolvedValue({merchantUnitId:terminal.id});
 reads.getMoneyAccountOverview.mockResolvedValue(account);
});

describe("merchant balance settlement-read containment",()=>{
 it("loads only terminals owned by the selected business account",async()=>{
  reads.getMerchantDashboard.mockResolvedValue({units:[terminal,{...terminal,id:"foreign-business-terminal",merchantServiceId:"foreign-service"},{...terminal,id:"assigned-only-terminal",ownerAccess:false}]});
  const result=await getMerchantMoneyWorkspace(owner,account);
  expect(result).toEqual({account,settlements:[{workspace:{merchant:{id:terminal.id}},operations:{merchantUnitId:terminal.id}}],settlementsUnavailable:false});
  expect(reads.getMerchantWorkspace.mock.calls).toEqual([[owner,terminal.id]]);expect(reads.getMerchantOperations.mock.calls).toEqual([[owner,terminal.id]]);
  expect(reads.getMoneyAccountOverview).not.toHaveBeenCalled();
 });

 it("reuses current discovery without repeating the full dashboard for each business",async()=>{
  const discovery={units:[terminal,{...terminal,id:"foreign-terminal",merchantServiceId:"foreign-service"},{...terminal,id:"delegated-terminal",ownerAccess:false}]};
  const result=await getMerchantMoneyWorkspace(owner,account,discovery);
  expect(reads.getMerchantDashboard).not.toHaveBeenCalled();
  expect(reads.getMerchantWorkspace.mock.calls).toEqual([[owner,terminal.id]]);
  expect(reads.getMerchantOperations.mock.calls).toEqual([[owner,terminal.id]]);
  expect(result.settlements).toHaveLength(1);
 });

 it("rechecks current ownership after reused discovery becomes stale",async()=>{
  reads.getMerchantWorkspace.mockRejectedValue(new SecurityError("MERCHANT_UNAVAILABLE",404));
  const denial=new SecurityError("MONEY_ACCOUNT_UNAVAILABLE",404);
  reads.getMoneyAccountOverview.mockRejectedValue(denial);
  await expect(getMerchantMoneyWorkspace(owner,account,{units:[terminal]})).rejects.toBe(denial);
  expect(reads.getMerchantDashboard).not.toHaveBeenCalled();
  expect(reads.getMoneyAccountOverview).toHaveBeenCalledExactlyOnceWith(owner,accountId,3);
 });

 it.each(["getMerchantDashboard","getMerchantWorkspace","getMerchantOperations"] as const)("keeps a reauthorized current balance and explicit unavailable state after %s fails",async failingRead=>{
  const current={...account,available:money("1300"),pendingWithdrawals:money("0"),status:"SUSPENDED" as const,canWithdraw:false};
  reads[failingRead].mockRejectedValue(new Error("Transient read interruption"));reads.getMoneyAccountOverview.mockResolvedValue(current);
  const result=await getMerchantMoneyWorkspace(owner,account);
  expect(reads.getMoneyAccountOverview).toHaveBeenCalledExactlyOnceWith(owner,accountId,3);
  expect(result).toEqual({account:current,settlements:[],settlementsUnavailable:true});expect(result.account).not.toBe(account);
 });

 it("never returns the earlier balance or partially read terminals when ownership is revoked during loading",async()=>{
  const second={...terminal,id:"00000000-0000-4000-8000-000000000005"};
  reads.getMerchantDashboard.mockResolvedValue({units:[terminal,second]});
  reads.getMerchantWorkspace.mockImplementation(async(_personId:string,id:string)=>{if(id===second.id)throw new SecurityError("MERCHANT_UNAVAILABLE",404);return {merchant:{id}};});
  const denial=new SecurityError("MONEY_ACCOUNT_UNAVAILABLE",404);reads.getMoneyAccountOverview.mockRejectedValue(denial);
  await expect(getMerchantMoneyWorkspace(owner,account)).rejects.toBe(denial);
  expect(reads.getMoneyAccountOverview).toHaveBeenCalledExactlyOnceWith(owner,accountId,3);
 });

 it("fails closed when account reauthorization itself is unavailable",async()=>{
  reads.getMerchantOperations.mockRejectedValue(new Error("Terminal read unavailable"));
  const failure=new Error("Current account access unavailable");reads.getMoneyAccountOverview.mockRejectedValue(failure);
  await expect(getMerchantMoneyWorkspace(owner,account)).rejects.toBe(failure);
 });

 it("distinguishes a successful empty terminal collection from a failed read",async()=>{
  reads.getMerchantDashboard.mockResolvedValue({units:[]});
  expect(await getMerchantMoneyWorkspace(owner,account)).toEqual({account,settlements:[],settlementsUnavailable:false});
  expect(reads.getMoneyAccountOverview).toHaveBeenCalledExactlyOnceWith(owner,accountId,3);
 });

 it("does not treat owner revocation hidden by terminal discovery as an authorized empty balance view",async()=>{
  reads.getMerchantDashboard.mockResolvedValue({units:[]});
  const denial=new SecurityError("MONEY_ACCOUNT_UNAVAILABLE",404);reads.getMoneyAccountOverview.mockRejectedValue(denial);
  await expect(getMerchantMoneyWorkspace(owner,account)).rejects.toBe(denial);
  expect(reads.getMoneyAccountOverview).toHaveBeenCalledExactlyOnceWith(owner,accountId,3);
 });

 it("does not load merchant records for a card account",async()=>{
  const card={...account,serviceKind:"CARDHOLDER" as const,services:[{...account.services[0],kind:"CARDHOLDER" as const}]};
  expect(await getMerchantMoneyWorkspace(owner,card)).toEqual({account:card,settlements:[],settlementsUnavailable:false});
  Object.values(reads).forEach(mock=>expect(mock).not.toHaveBeenCalled());
 });
});

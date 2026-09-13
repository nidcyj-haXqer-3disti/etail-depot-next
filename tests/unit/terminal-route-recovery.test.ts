import {Children,isValidElement,type ReactNode} from "react";
import {beforeEach,describe,expect,it,vi} from "vitest";

const reads=vi.hoisted(()=>({session:vi.fn(),workspace:vi.fn(),access:vi.fn(),cases:vi.fn(),payment:vi.fn(),disputes:vi.fn(),operations:vi.fn()}));
vi.mock("../../src/platform/http/context",()=>({getRequestSession:reads.session}));
vi.mock("../../src/modules/acquiring/service",()=>({getMerchantWorkspace:reads.workspace}));
vi.mock("../../src/modules/access/merchant-service",()=>({getMerchantAccessOverview:reads.access}));
vi.mock("../../src/modules/cases/service",()=>({listMerchantSupportCases:reads.cases,getMerchantSupportPaymentPreview:reads.payment}));
vi.mock("../../src/modules/disputes/service",()=>({listTerminalDisputes:reads.disputes}));
vi.mock("../../src/modules/acquiring/operations-service",()=>({getMerchantOperations:reads.operations}));
vi.mock("../../src/ui/workspace/merchant-workspace",()=>({MerchantWorkspace:()=>null}));
vi.mock("../../src/ui/workspace/merchant-shell",()=>({MerchantShell:()=>null}));
vi.mock("../../src/ui/workspace/primitives",()=>({EmptyState:()=>null}));
vi.mock("../../src/ui/shell",()=>({PageNotice:()=>null}));
import {renderMerchantTerminal} from "../../src/app/merchant-services/terminal-loader";

const ownerId="00000000-0000-4000-8000-000000000001",terminalId="00000000-0000-4000-8000-000000000002",recordId="00000000-0000-4000-8000-000000000003";
const receiptRoutes:Array<{suffix:string;record:Record<string,string>}>= [
 {suffix:"payments",record:{payment:recordId}},
 {suffix:"payments",record:{transfer:recordId}},
 {suffix:`channels/${recordId}`,record:{}},
];
function links(node:ReactNode):string[]{
 return Children.toArray(node).flatMap(child=>isValidElement<{href?:string;children?:ReactNode}>(child)?[...(child.props.href?[child.props.href]:[]),...links(child.props.children)]:[]);
}
beforeEach(()=>{
 Object.values(reads).forEach(read=>read.mockReset());
 reads.session.mockResolvedValue({personId:ownerId});
 reads.workspace.mockRejectedValue(new Error("Transient terminal read failure"));
});
describe("terminal route recovery preserves the current investigation",()=>{
 it.each(receiptRoutes)("reloads the exact $suffix destination after a transient workspace read failure",async({suffix,record})=>{
  const path=`/merchant-services/terminals/${terminalId}/${suffix}`;
  const returnTo=`/merchant-services?section=overview&view=unit%3A${terminalId}&period=custom&from=2026-09-01&to=2026-09-12&q=Garden&status=COLLECTED&page=2`;
  const query={...record,returnTo};
  const result=await renderMerchantTerminal(terminalId,Promise.resolve(query),path);
  expect(result.props.title).toBe("We couldn’t load this payment terminal");
  expect(links(result)).toEqual([`${path}?${new URLSearchParams(query)}`]);
  expect(reads.workspace).toHaveBeenCalledExactlyOnceWith(ownerId,terminalId);
  for(const read of [reads.access,reads.cases,reads.payment,reads.disputes,reads.operations])expect(read).not.toHaveBeenCalled();
 });
 it("rejects conflicting task selectors before reading any private terminal data",async()=>{
  const result=await renderMerchantTerminal(terminalId,Promise.resolve({tab:"people",payment:recordId}),`/merchant-services/terminals/${terminalId}/payments`);
  expect(result.props.title).toBe("This terminal view is unavailable");
  expect(links(result)).toEqual(["/merchant-services/terminals"]);
  Object.values(reads).forEach(read=>expect(read).not.toHaveBeenCalled());
 });
});

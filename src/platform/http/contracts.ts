import { sandboxOperations } from "../../modules/sandbox/contracts";
import { z } from "zod";
import { workspaceOperations } from "../../modules/workspace/api-contracts";
import { securityOperations } from "../../modules/identity/security-contracts";
import { reportOperations } from "../../modules/reports/api-contracts";
import { caseOperations } from "../../modules/cases/api-contracts";
import { membershipOperations } from "../../modules/membership/contracts";
import { accessOperations } from "../../modules/access/api-contracts";
import { merchantAccessOperations } from "../../modules/access/merchant-api-contracts";
import { merchantOperations } from "../../modules/acquiring/operations-api-contracts";
import { supportOperatorOperations } from "../../modules/operations/api-contracts";
import { createCardholderServiceSchema } from "../../modules/services/cardholder-contracts";
import { acquiringOperations } from "../../modules/acquiring/api-contracts";
import { emailAuthenticationOperations } from "../../modules/identity/email-contracts";
import {guestPaymentOperations} from "../../modules/acquiring/guest-api-contracts";

export const fixtureLoginSchema=z.object({persona:z.enum(["owner","viewer","operator"])}).strict();
export const passwordLoginSchema=z.object({email:z.email().max(254),password:z.string().min(1).max(1024)}).strict();
export const serviceIdSchema=z.uuid();
export const emptyCommandSchema=z.object({}).strict();
export const serviceSummarySchema=z.object({id:z.uuid(),primaryPersonId:z.uuid(),kind:z.enum(["CARDHOLDER","MERCHANT"]),displayName:z.string(),role:z.enum(["PRIMARY","SECONDARY"]),status:z.enum(["DRAFT","ACTIVE","SUSPENDED","CLOSED"]),version:z.int().positive(),cardholderRole:z.enum(["PRIMARY","SECONDARY","NONE"])}).strict();
export const capabilitySchema=z.object({action:z.string(),allowed:z.boolean(),reasonCode:z.string(),reason:z.string(),remediation:z.null(),scope:z.object({serviceId:z.uuid()}),policyVersion:z.int().positive()});
export const serviceProjectionSchema=serviceSummarySchema.extend({capabilities:z.array(capabilitySchema),peopleCount:z.int().nonnegative().nullable()});
export const serviceDirectorySchema=z.object({services:z.array(serviceSummarySchema)}).strict();
export const errorSchema=z.object({error:z.object({code:z.string(),requestId:z.uuid()})});

/** Executable foundation inventory. The larger planned inventory remains unimplemented. */
export const foundationOperations=[
  ...sandboxOperations,
  {path:"/api/v1/cardholder-services",method:"post",request:createCardholderServiceSchema,response:z.object({serviceId:z.uuid(),kind:z.literal("CARDHOLDER"),nextHref:z.literal("/cardholder-services")}).strict(),status:200,authenticated:true},
  {path:"/api/v1/services",method:"get",response:serviceDirectorySchema,status:200,authenticated:true},
  {path:"/api/v1/cardholder-services/{serviceId}",method:"get",response:serviceProjectionSchema,status:200,authenticated:true},
  {path:"/api/v1/auth/logout",method:"post",request:emptyCommandSchema,response:z.object({signedOut:z.literal(true)}),status:200,authenticated:false},
  {path:"/api/v1/auth/login",method:"post",request:passwordLoginSchema,response:z.object({authenticated:z.literal(true)}).strict(),status:200,authenticated:false},
  {path:"/api/v1/auth/local-fixture",method:"post",request:fixtureLoginSchema,response:z.object({authenticated:z.literal(true)}),status:200,authenticated:false},
] as const;

export function generateFoundationOpenApi() {
  const paths:Record<string,Record<string,unknown>>={};
  for(const operation of [...foundationOperations,...emailAuthenticationOperations,...workspaceOperations,...securityOperations,...reportOperations,...caseOperations,...membershipOperations,...accessOperations,...merchantAccessOperations,...acquiringOperations,...merchantOperations,...supportOperatorOperations,...guestPaymentOperations]) {
    const parameters:Record<string,unknown>[]=[...operation.path.matchAll(/\{([^}]+)\}/g)].map(match=>({in:"path",name:match[1],required:true,schema:{type:"string",format:"uuid"}}));
    if(operation.path.endsWith("/activity")) parameters.push({in:"query",name:"q",required:false,schema:{type:"string",maxLength:100}});
    if("query" in operation) {
      const query=z.toJSONSchema(operation.query,{target:"openapi-3.0"}) as {properties?:Record<string,unknown>};
      for(const [name,schema] of Object.entries(query.properties??{}))parameters.push({in:"query",name,required:false,schema,description:operation.path.includes("/reports")?"Omit all filters for the default period; otherwise supply source, from and to together. Unknown or duplicate parameters are rejected.":"Unknown or duplicate parameters are rejected."});
    }
    paths[operation.path]??={};
    if(paths[operation.path]![operation.method])throw new Error(`Duplicate executable operation: ${operation.method} ${operation.path}`);
    paths[operation.path]![operation.method]={
      operationId:operation.method+operation.path.replace(/[^a-z0-9]/gi,"_"),
      description:operation.path.endsWith("local-fixture")?"Isolated local/CI test only; unavailable on hosted deploys.":operation.path.endsWith("/login")?"Real email/password verification against the recorded new Identity provider from the isolated local app. Durable attempt limits; opaque HttpOnly session; no fixture mapping or automatic service access. Hosted rollout remains gated.":reportOperations.some(item=>item.path===operation.path)?"Scoped fictional historical reports, not official billing statements. Saved definitions contain creator-private filters; each run and export rechecks current access.":caseOperations.some(item=>item.path===operation.path)?"Customer and explicitly assigned support case with immutable timeline. Local operator responses use separate service authority; no external submission or financial decision is performed.":[...accessOperations,...merchantAccessOperations].some(item=>item.path===operation.path)?"Intended-person access and invitations under explicit delegation ceilings. Local invitations require existing fictional identities and do not send notifications or confer financial authority.":securityOperations.some(item=>item.path===operation.path)?"Current-person active session review and selected other-family revocation. Session credentials are never returned; current authentication is rechecked for revocation.":membershipOperations.some(item=>item.path===operation.path)?"Source-based annual planning estimate. No enrollment, financial posting or earned-reward calculation is performed; unknown brand costs remain unknown.":workspaceOperations.some(item=>item.path===operation.path)?"Scoped prepaid Cardholder services: saved funding review, confirmation, per-person monthly limits and connected merchant checkout use the common immutable ledger. Secondary cardholders receive only their own data. Issuance creates no money; no real-money execution.":acquiringOperations.some(item=>item.path===operation.path)?"Primary merchant and delegated submerchant hierarchy, scoped dashboards, payment channels and local verification readiness. The primary retains sales responsibility. No live MID, provider approval or public payment delivery occurs.":merchantOperations.some(item=>item.path===operation.path)?"Scoped gateway setup, channel activation, payment records, full refunds and exact reviewed deposits use the common immutable ledger. Deposit results require separate operator assignment. Real money and external processing are disabled.":supportOperatorOperations.some(item=>item.path===operation.path)?"Explicitly assigned local support queue, case detail and versioned response. Operator access is separate from customer membership and never authorizes money commands.":guestPaymentOperations.some(item=>item.path===operation.path)?"Explicit merchant publication, read-only public payment offers and retained private guest receipts. New customer payments use authenticated connected Cardholder checkout. Public locators contain no credential; historical receipt access rechecks its existing private guest authority. No real money or external delivery.":"Foundation service/session endpoint.",
      security:operation.authenticated?[{appSession:[]}]:"guestAuthenticated" in operation&&operation.guestAuthenticated?[{guestSession:[]}]:[],
      ...(parameters.length?{parameters}:{}),
      ...("request" in operation?{requestBody:{required:true,content:{"application/json":{schema:z.toJSONSchema(operation.request,{target:"openapi-3.0"})}}}}:{}),
      responses:{[operation.status]:{description:"Successful response",content:{["responseContentType" in operation?operation.responseContentType:"application/json"]:{schema:z.toJSONSchema(operation.response,{target:"openapi-3.0"})},...("additionalResponseContent" in operation?Object.fromEntries(Object.entries(operation.additionalResponseContent).map(([type,schema])=>[type,{schema:z.toJSONSchema(schema,{target:"openapi-3.0"})}])):{})}},default:{description:"Request rejected",content:{"application/json":{schema:z.toJSONSchema(errorSchema,{target:"openapi-3.0"})}}}},
    };
  }
  return {openapi:"3.0.3",info:{title:"Etail Depot Next — sandbox services API",version:"1.0.0-sandbox"},paths,components:{securitySchemes:{appSession:{type:"apiKey",in:"cookie",name:"__Host-etail_session",description:"Secure hosted cookie name; isolated HTTP tests use etail_session. Tokens are opaque and never returned in JSON."},guestSession:{type:"apiKey",in:"cookie",name:"__Host-etail_guest",description:"HttpOnly cookie authorizes only the guest's own orders. Local HTTP uses etail_guest. Publication locators are public; no guest credentials are returned in JSON or URLs."}}}};
}

import { z } from "zod";
import { sandboxOverviewSchema } from "../../shared/sandbox-response";
export { sandboxOverviewSchema } from "../../shared/sandbox-response";
export const startSandboxSchema = z.object({ commandId:z.uuid(), displayName:z.string().trim().min(1).max(80).regex(/^[^\u0000-\u001f\u007f-\u009f]+$/), acknowledged:z.literal(true) }).strict();
export type SandboxOverview = z.infer<typeof sandboxOverviewSchema>;
export const sandboxRecipientQuerySchema=z.object({code:z.string().trim().toUpperCase().regex(/^ED-[A-F0-9]{20}$/)}).strict();
export const sandboxOperations=[
 {path:"/api/v1/sandbox",method:"get",response:sandboxOverviewSchema,status:200,authenticated:true},
 {path:"/api/v1/sandbox",method:"post",request:startSandboxSchema,response:sandboxOverviewSchema,status:200,authenticated:true},
 {path:"/api/v1/sandbox/recipient",method:"get",query:sandboxRecipientQuerySchema,response:z.object({id:z.uuid(),displayName:z.string()}).strict(),status:200,authenticated:true},
] as const;

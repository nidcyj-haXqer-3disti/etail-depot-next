import { z } from "zod";
import { SecurityError } from "../../platform/security/origin";
import { merchantDirectoryQuerySchema } from "./api-contracts";
export function requireAcquiringRouteId(value:string) {if(!z.uuid().safeParse(value).success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return value.toLowerCase();}
export function readMerchantDirectoryQuery(params:URLSearchParams) {
  const values:Record<string,string>={};
  for(const [key,value] of params){if(Object.hasOwn(values,key))throw new SecurityError("INVALID_REQUEST",422);values[key]=value;}
  const parsed=merchantDirectoryQuerySchema.safeParse(values);if(!parsed.success)throw new SecurityError("INVALID_REQUEST",422);return parsed.data;
}

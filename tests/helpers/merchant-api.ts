import { expect, type APIRequestContext } from "@playwright/test";
import { randomUUID } from "node:crypto";
/** Public Merchant entry; financial scope is resolved from its exact authorized projection. */
export async function createMerchantViaApi(request:APIRequestContext,displayName:string) {
  const response=await request.post('/api/v1/merchants',{headers:{Origin:'http://127.0.0.1:3100'},data:{commandId:randomUUID(),displayName}});
  expect(response.status()).toBe(200);
  const {merchantId}=await response.json() as {merchantId:string};
  const workspace=await request.get(`/api/v1/merchants/${merchantId}`);expect(workspace.status()).toBe(200);
  const {merchant}=await workspace.json();
  return {merchantId,serviceId:merchant.master.serviceId as string};
}

import {randomUUID} from "node:crypto";
import {expect,type APIRequestContext} from "@playwright/test";
import {paymentChannelSchema} from "../../../src/modules/acquiring/api-contracts";
import {merchantOperationsProjectionSchema} from "../../../src/modules/acquiring/operations-api-contracts";
import {guestPublicationManagementSchema} from "../../../src/modules/acquiring/guest-contracts";
import {headers,merchantDashboard,signIn} from "./fresh";

export async function activeGuestChannel(request:APIRequestContext,usage:"ONE_TIME"|"REUSABLE"="ONE_TIME"){
 await signIn(request);const dashboard=await merchantDashboard(request);const merchant=dashboard.units.find(unit=>unit.ownerAccess)!;
 const response=await request.get(`/api/v1/merchants/${merchant.id}/operations`);expect(response.status()).toBe(200);const operations=merchantOperationsProjectionSchema.parse(await response.json());
 if(operations.gateway.mode!=="TEST_READY")expect((await request.put(`/api/v1/merchants/${merchant.id}/gateway`,{headers,data:{commandId:randomUUID(),expectedVersion:operations.gateway.version,enabled:true}})).status()).toBe(200);
 if(operations.enrollment.status!=="ENROLLED")expect((await request.put(`/api/v1/merchants/${merchant.id}/test-enrollment`,{headers,data:{commandId:randomUUID(),expectedVersion:operations.enrollment.version,enabled:true}})).status()).toBe(200);
 const description=`Guest order ${randomUUID().slice(0,8)}`;
 const created=await request.post(`/api/v1/merchants/${merchant.id}/channels`,{headers,data:{commandId:randomUUID(),description,amountMinor:"1840",currency:"USD",usage,expiresAt:new Date(Date.now()+86_400_000).toISOString(),presentations:["SMS","EMAIL","INVOICE","BILL","SOCIAL","QR","WEB"],visibility:"CREATOR_PRIVATE"}});expect(created.status()).toBe(200);const channel=paymentChannelSchema.parse(await created.json());
 expect((await request.put(`/api/v1/merchants/${merchant.id}/channels/${channel.id}/activation`,{headers,data:{commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:channel.version,active:true}})).status()).toBe(200);
 return {merchant,channel};
}
export async function publishedGuestChannel(request:APIRequestContext,usage:"ONE_TIME"|"REUSABLE"="ONE_TIME"){
 const prepared=await activeGuestChannel(request,usage);const response=await request.post(`/api/v1/merchants/${prepared.merchant.id}/channels/${prepared.channel.id}/publication`,{headers,data:{commandId:randomUUID(),expectedChannelVersion:prepared.channel.version}});expect(response.status()).toBe(200);return {...prepared,publication:guestPublicationManagementSchema.parse(await response.json()).publication!};
}

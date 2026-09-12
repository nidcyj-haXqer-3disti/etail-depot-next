import {expect,type APIRequestContext,type Page} from "@playwright/test";
import {cardholderDashboardSchema} from "../../../src/modules/workspace/api-contracts";
import {merchantDashboardProjectionSchema} from "../../../src/modules/acquiring/dashboard-contracts";
export const headers={Origin:"http://127.0.0.1:3100","Content-Type":"application/json"};
export async function signIn(request:APIRequestContext,persona:"owner"|"viewer"|"operator"="owner"){expect((await request.post("/api/v1/auth/local-fixture",{headers,data:{persona}})).status()).toBe(200);}
export async function cardDashboard(request:APIRequestContext,page=0){const response=await request.get(`/api/v1/cardholder-services?page=${page}`);expect(response.status()).toBe(200);return cardholderDashboardSchema.parse(await response.json());}
export async function merchantDashboard(request:APIRequestContext){const response=await request.get("/api/v1/merchants/dashboard");expect(response.status()).toBe(200);return merchantDashboardProjectionSchema.parse(await response.json());}
export async function openCardholder(page:Page,persona:"owner"|"viewer"="owner"){await signIn(page.request,persona);const data=await cardDashboard(page.request);const card=data.cards.find(row=>row.holderId===data.person.id)!;await page.goto(`/cardholder-services?focus=${card.id}`);await expect(page.getByRole("heading",{name:"Cards & spending",exact:true})).toBeVisible();return {data,card};}

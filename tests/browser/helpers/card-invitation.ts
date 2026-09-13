import {expect,type Page} from "@playwright/test";
import {eq} from "drizzle-orm";
import {getDb} from "../../../src/platform/database/client";
import {identityBindings} from "../../../src/platform/database/schema";
import {SessionService} from "../../../src/modules/identity/session";
import {sessionRepository} from "../../../src/platform/database/session-repository";
import {normalizeVerifiedEmail} from "../../../src/shared/verified-email";
import {cardholderDashboardSchema} from "../../../src/modules/workspace/api-contracts";
import type {WorkspaceCard} from "../../../src/modules/workspace/contracts";
/** Test provider observation goes through the canonical session/contact transaction. */
export async function signInVerified(page:Page,personId:string,email?:string){
 const [identity]=await getDb().select().from(identityBindings).where(eq(identityBindings.personId,personId));
 if(!identity)throw new Error("Expected the test person's actual identity binding");
 const session=await new SessionService(sessionRepository,{appEnv:"test",publicOrigin:"http://127.0.0.1:3100"}).issue({personId,identityId:identity.id},{issuer:identity.issuer,subject:identity.subject,...(email?{verifiedEmail:{emailNormalized:normalizeVerifiedEmail(email)!,provenance:"NETLIFY_USER_CONFIRMED" as const,verifiedAt:new Date(Date.now()-1000).toISOString()}}:{})});
 const pair=session.cookie.split(";",1)[0]!;
 await page.context().addCookies([{name:pair.slice(0,pair.indexOf("=")),value:pair.slice(pair.indexOf("=")+1),domain:"127.0.0.1",path:"/",httpOnly:true,sameSite:"Strict",expires:Math.floor(session.record.expiresAt.getTime()/1000)}]);
}
export async function createCardUI(page:Page,name:string,allowance="25.00",forMe=false):Promise<WorkspaceCard>{
 await page.goto("/cardholder-services?view=cards");
 await page.getByRole("link",{name:"Add card",exact:true}).click();const dialog=page.getByRole("dialog");
 await expect(dialog.getByRole("radio",{name:/Someone else/})).toBeChecked();
 if(forMe)await dialog.getByRole("radio",{name:/^Me /}).check();
 await dialog.getByRole("textbox",{name:"Card name",exact:true}).fill(name);
 await dialog.getByRole("textbox",{name:"Total spending limit (USD)",exact:true}).fill(allowance);
 await dialog.getByRole("button",{name:"Review card",exact:true}).click();await dialog.getByRole("button",{name:"Create card",exact:true}).click();
 await expect(dialog).toHaveCount(0);await expect(page.getByRole("region",{name:"Selected card overview",exact:true})).toContainText(name);
 const response=await page.request.get(`/api/v1/cardholder-services?cardSearch=${encodeURIComponent(name)}`);expect(response.status()).toBe(200);
 const card=cardholderDashboardSchema.parse(await response.json()).cards.find(card=>card.nickname===name);if(!card)throw new Error("Created card must be in its owner's authorized projection");return card;
}
export async function inviteCardUI(page:Page,cardId:string,email:string):Promise<string>{
 await page.goto(`/cards/${cardId}/invite`);await page.getByRole("textbox",{name:"Their email address",exact:true}).fill(email);
 await page.getByRole("button",{name:"Create invitation",exact:true}).click();
 const link=page.getByRole("textbox",{name:"Invitation link",exact:true});await expect(link).toBeVisible();
 const id=new URL(await link.inputValue()).pathname.split("/").at(-1)!;
 expect(id).toMatch(/^[0-9a-f-]{36}$/);return id;
}
export async function acceptCardUI(page:Page,invitationId:string){
 await page.goto(`/invitations/${invitationId}`);await expect(page.getByRole("heading",{name:"Your card invitation",exact:true})).toBeVisible();
 await page.getByRole("button",{name:"Accept invitation",exact:true}).click();await expect(page.getByRole("link",{name:"Open your card",exact:true})).toBeVisible();
}

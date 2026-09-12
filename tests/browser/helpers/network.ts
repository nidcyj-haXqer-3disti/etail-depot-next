import {expect,type Page} from "@playwright/test";
import type {GuestPublication} from "../../../src/modules/acquiring/guest-contracts";
import {networkCheckoutProjectionSchema} from "../../../src/shared/network-checkout-response";
/** Actual public UI checkout, using only a non-sensitive adapter-provided sample card. */
export async function payNetworkPublished(page:Page,publication:GuestPublication,network="Visa"){
 await page.goto(publication.publicHref);await page.getByRole("radio",{name:network,exact:true}).check();await page.getByRole("button",{name:`Pay ${publication.amount.formatted}`,exact:true}).click();await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();
 const id=new URL(page.url()).searchParams.get("payment")!;const response=await page.request.get(`/api/v1/guest/publications/${publication.id}/payments/${id}`);expect(response.status()).toBe(200);const result=networkCheckoutProjectionSchema.parse(await response.json());expect(result).toMatchObject({publicationId:publication.id,state:"PAID",amount:publication.amount,network,fee:{minor:"0"}});return {...result.receipt!,url:page.url()};
}

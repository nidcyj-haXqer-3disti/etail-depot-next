import {expect,test} from "@playwright/test";

test("a visitor can explore clear card and payment dashboards without account reads or changes",async({page})=>{
 const changes:string[]=[],privateReads:string[]=[],errors:string[]=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.route("**/*",async route=>{if(["GET","HEAD","OPTIONS"].includes(route.request().method()))await route.continue();else{changes.push(route.request().method());await route.abort();}});
 page.on("request",request=>{const path=new URL(request.url()).pathname;if(request.method()==="GET"&&/^\/api\/v1\/(?:cardholder-services|money-accounts|merchants)(?:\/|$)/.test(path))privateReads.push(path);});
 await page.goto("/");
 const services=page.getByRole("group",{name:"Cards and payments",exact:true});
 const cardholder=page.getByRole("region",{name:"Cards dashboard",exact:true});
 await expect(cardholder).toBeVisible();
 const showcase=page.locator(".service-showcase");
 await expect(showcase).not.toContainText(/preview|example|sample|illustrative|sandbox|no monthly reset|all terminals/i);
 await expect(page.getByText("Each cardholder sees only their own cards.",{exact:true})).toBeVisible();
 await expect(cardholder.getByText("Available to spend",{exact:true})).toBeVisible();
 const teamCard=cardholder.getByRole("button",{name:"Team supplies For your team",exact:true});
 await teamCard.focus();await page.keyboard.press("Enter");
 await expect(teamCard).toHaveAttribute("aria-pressed","true");
 await expect(cardholder.getByText("For your team",{exact:true})).toBeVisible();
 await expect(cardholder.getByText("$280.00",{exact:true})).toBeVisible();
 const merchant=services.getByRole("button",{name:"Payments",exact:true});
 await merchant.focus();await page.keyboard.press("Space");
 await expect(merchant).toHaveAttribute("aria-pressed","true");
 await expect(cardholder).toHaveCount(0);
 const example=page.getByRole("region",{name:"Payments dashboard",exact:true});
 await expect(example).toBeVisible();
 await expect(example.getByText("Ready to move",{exact:true})).toHaveCount(0);
 await expect(example.getByText("Available for payout",{exact:true})).toHaveCount(1);
 await expect(example.getByText("Flower shop · 2 terminals",{exact:true})).toBeVisible();
 await expect(example.getByText("Payments received",{exact:true})).toBeVisible();
 await expect(showcase).toContainText("Your card balance and payment balance stay separate.");
 await expect(showcase).not.toContainText(/preview|example|sample|illustrative|sandbox|no monthly reset|all terminals/i);
 expect(privateReads).toEqual([]);
 await expect(example.getByRole("listitem")).toHaveCount(3);
 await example.getByRole("link",{name:"Open your payments",exact:true}).click();
 await expect(page).toHaveURL(url=>url.pathname==="/login"&&url.searchParams.get("next")==="/merchant-services");
 expect(changes).toEqual([]);expect(errors).toEqual([]);
});

test("the home page leads directly to registration and the email-link entry stays out of the form",async({page})=>{
 await page.goto("/");
 await page.getByRole("link",{name:"Create your login",exact:true}).first().click();
 await expect(page).toHaveURL(/\/login\?mode=register$/);
 await expect(page.getByRole("form",{name:"Create your login",exact:true})).toBeVisible();
 await expect(page.getByLabel("Confirmation link",{exact:true})).toHaveCount(0);
 await expect(page.getByLabel("Password reset link",{exact:true})).toHaveCount(0);
});

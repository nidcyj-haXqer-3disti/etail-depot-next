import {expect,test} from "@playwright/test";

test("a visitor can explore both example dashboards without changing an account",async({page})=>{
 const changes:string[]=[],errors:string[]=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.route("**/*",async route=>{if(["GET","HEAD","OPTIONS"].includes(route.request().method()))await route.continue();else{changes.push(route.request().method());await route.abort();}});
 await page.goto("/");
 const services=page.getByRole("group",{name:"Service dashboard preview",exact:true});
 const cardholder=page.getByRole("region",{name:"Cardholder dashboard example",exact:true});
 await expect(cardholder).toBeVisible();
 await expect(page.getByText("Illustrative primary view · Sample figures, not your balance.",{exact:true})).toBeVisible();
 const liam=cardholder.getByRole("button",{name:"Liam’s card",exact:true});
 await liam.focus();await page.keyboard.press("Enter");
 await expect(liam).toHaveAttribute("aria-pressed","true");
 await expect(cardholder.getByText("Card you manage",{exact:true})).toBeVisible();
 await expect(cardholder.getByText("$280.00",{exact:true})).toBeVisible();
 const merchant=services.getByRole("button",{name:"Merchant",exact:true});
 await merchant.focus();await page.keyboard.press("Space");
 await expect(merchant).toHaveAttribute("aria-pressed","true");
 await expect(cardholder).toHaveCount(0);
 const example=page.getByRole("region",{name:"Merchant dashboard example",exact:true});
 await expect(example).toBeVisible();
 await expect(example.getByText("Awaiting settlement",{exact:true})).toBeVisible();
 await expect(example.getByText("Processing",{exact:true})).toBeVisible();
 await expect(example.getByRole("listitem")).toHaveCount(3);
 await example.getByRole("link",{name:"Open Merchant services",exact:true}).click();
 await expect(page).toHaveURL(/\/login$/);
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

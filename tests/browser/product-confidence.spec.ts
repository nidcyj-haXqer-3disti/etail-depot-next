import { test, expect } from "@playwright/test";

test("optional dispute readiness keeps price and Order Insight coverage limits visible", async ({page}) => {
  await page.goto("/payment-services");
  const network=page.locator("#dispute-readiness");
  await expect(network.locator(".dispute-price")).toContainText("Optional service");
  await expect(network.locator(".dispute-price")).toContainText("+0.4%");
  await expect(network.locator(".dispute-price")).toContainText("Plus vendor fees and processing");
  const limits=network.locator(".dispute-service-note");
  await expect(limits).toBeVisible();
  await expect(limits).toContainText("eligible enrolled payments");
  await expect(limits).toContainText("participating bank and available data");
  await expect(limits).toContainText("dispute outcomes are not guaranteed");
  await expect(network.locator(".dispute-benefits")).toContainText("Qualifying Visa online fraud disputes");
  await expect(network.locator(".dispute-benefits")).toContainText("required transaction history and evidence");
  await expect(network.getByRole("link",{name:"Explore Order Insight at Visa",exact:true})).toHaveAttribute("href","https://www.visa.com/en-us/products/order-insight");
  const coverage=page.locator("details").filter({has:page.locator("summary").filter({hasText:"Does it cover every dispute?"})});
  await coverage.locator("summary").click();
  await expect(coverage).toContainText("Automatic refund programs and managed chargeback responses are separate services");
  await expect(page.getByRole("checkbox",{name:"Dispute readiness",exact:true})).not.toBeChecked();
});

test("fees separate the 0.4 percent markup from unknown vendor charges and recover invalid input", async ({page}) => {
  const mutations:string[]=[];
  page.on("request",request=>{if(!["GET","HEAD","OPTIONS"].includes(request.method()))mutations.push(request.url());});
  await page.goto("/payment-services");
  const estimate=page.locator(".fee-estimate");
  await expect(estimate).toContainText("$96.80");
  await expect(estimate).not.toContainText("Additional · quote required");
  await estimate.locator("#addon-sale-records").check();
  await expect(estimate).toContainText("$96.40");
  await expect(estimate).toContainText("−$0.40");
  await expect(estimate).toContainText("Additional · quote required");
  await expect(estimate.locator(".fee-net")).toContainText("Before vendor charges");
  await expect(estimate).toContainText("Quoted vendor charges are not deducted from the amount shown");
  await expect(estimate).toContainText("Selecting this example does not enroll you or charge a fee");
  const amount=estimate.getByLabel("Payment amount USD");
  await amount.fill("1.001");
  await expect(amount).toHaveAttribute("aria-invalid","true");
  await expect(amount).toHaveAttribute("aria-describedby","fee-estimate-error fee-estimate-note");
  await expect(estimate).not.toContainText("$96.40");
  await amount.fill("480");
  await expect(amount).toHaveAttribute("aria-invalid","false");
  await expect(estimate).toContainText("$463.86");
  await amount.fill("1000");
  await expect(estimate).toContainText("−$4.00");
  await expect(estimate).toContainText("$966.70");
  await expect(page.locator("main")).not.toContainText(/Enhanced receipt|Invoice add-on|Agreement add-on|1.5% in document fees/);
  await estimate.locator("#addon-sale-records").uncheck();
  await expect(estimate).toContainText("$970.70");
  await expect(estimate).not.toContainText("Additional · quote required");
  await expect(page.locator("#payouts")).toContainText("First payouts");
  expect(mutations).toEqual([]);
  expect(await page.evaluate(()=>localStorage.length+sessionStorage.length)).toBe(0);
});

test("cards separate the deposit from debt and keep material terms outside disclosures", async ({page}) => {
  await page.goto("/card-services");
  const facts = page.locator("#card-details");
  await expect(facts).toContainText("$200");
  await expect(facts).toContainText("$0");
  await expect(facts).toContainText("Pay in full each month");
  await expect(page.locator(".secured-credit-art")).toBeVisible();
  await expect(page.getByRole("link", {name:"Contact Ledgix",exact:true}).first()).toHaveAttribute("href", "mailto:ledgix@etaildepot.com");
  await expect(page.getByRole("heading", {level:1})).toContainText("Secured credit");
  await expect(page.locator("main")).toContainText("Applications are not open yet");
  await expect(page.locator('form, input[type="email"]')).toHaveCount(0);
});

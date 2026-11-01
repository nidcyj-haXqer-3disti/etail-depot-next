import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const origin = "https://etaildepot.com";

test("Guides opens both ISO collections, preserves exact code identity and returns through breadcrumbs", async ({ page }) => {
  for (const [collection, table, code, identity] of [
    ["iso-20022", "payment-transaction-status", "acsp", "ExternalPaymentTransactionStatus1Code"],
    ["iso-8583", "fields", "39", "default_ascii"],
  ]) {
    await page.goto("/guides");
    const collectionPath = `/guides/${collection}`;
    const tablePath = `${collectionPath}/${table}`;
    const codePath = `${tablePath}/${code}`;
    await page.locator(`.standards-collections a[href="${collectionPath}"]`).click();
    await expect(page).toHaveURL(new URL(page.url()).origin + collectionPath);
    await page.locator(`main a[href="${tablePath}"]`).click();
    await page.getByRole("cell").locator(`a[href="${codePath}"]`).click();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", origin + codePath);
    await expect(page.getByRole("heading", {level:1})).toContainText(code.toUpperCase());
    await expect(page.getByRole("complementary")).toContainText(identity);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText())["@graph"];
    expect(graph.find((item: {"@type":string}) => item["@type"] === "WebPage").url).toBe(origin + codePath);
    const breadcrumb = page.getByRole("navigation", {name:"Breadcrumb", exact:true});
    await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText(code.toUpperCase());
    await breadcrumb.locator(`a[href="${tablePath}"]`).click();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", origin + tablePath);
    await page.goBack();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", origin + codePath);
    await breadcrumb.getByRole("link", {name:"Guides", exact:true}).click();
    await expect(page.getByRole("heading", {level:1})).toHaveText("Guides");
  }
});

test("implementation source limits and attribution stay visible; old code tables are unavailable", async ({ page, request }) => {
  await page.goto("/guides/iso-8583/messages/2100");
  await page.locator(".reference-notes summary").click();
  await expect(page.locator(".reference-notes")).toContainText("2007");
  await expect(page.locator(".reference-notes")).toContainText("2003");
  const sources=page.getByRole("complementary",{name:"Reference scope and sources"});
  await expect(sources.getByRole("link",{name:/Moov message type reference/})).toHaveAttribute("href", /^https:\/\/github.com\/moov-io\/iso8583\/blob\/[a-f0-9]{40}\//);
  for(const href of ["/licenses/moov-iso8583-Apache-2.0.txt","/licenses/pyiso8583-MIT.txt","/licenses/iso8583-reference-NOTICE.txt"]) expect((await request.get(href)).status()).toBe(200);
  await page.goto("/guides/iso-8583/fields/39");
  await expect(page.locator("#purpose")).toContainText("not the meaning of every response value");
  await expect(page.locator("#profile-comparison")).toContainText("Exactly 2 bytes");
  for(const suffix of ["messages/2100","message-reason-codes/4594","action-codes/0002","action-codes/9126"]) {
    const response=await request.get("/guides/iso-8583/2023/"+suffix);
    expect(response.status()).toBe(404); expect(response.headers()["x-robots-tag"]).toContain("noindex");
  }
});

test("replacement and shared-code meanings keep the correct ISO 20022 set", async ({ page }) => {
  await page.goto("/guides/iso-20022/cash-clearing-system/cad");
  await expect(page.locator("#source-notes")).toContainText("Do not use.");
  await expect(page.getByRole("complementary")).toContainText("Registered");
  await page.locator('#source-replacement a[href="/guides/iso-20022/cash-clearing-system/lvt"]').click();
  await expect(page.getByRole("heading", {level:1})).toContainText("LVT");
  await page.goto("/guides/iso-20022/payment-transaction-status/acsp");
  const otherSets = page.locator("#other-code-sets details");
  await otherSets.locator("summary").click();
  await otherSets.locator('a[href="/guides/iso-20022/payment-group-status/acsp"]').click();
  await expect(page.getByRole("complementary")).toContainText("ExternalPaymentGroupStatus1Code");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", origin + "/guides/iso-20022/payment-group-status/acsp");
});

for (const [interaction, reducedMotion] of [["keyboard", "no-preference"], ["pointer", "reduce"]] as const) {
  test(`both ISO collections and source disclosures work without JavaScript using ${interaction}`, async ({ browser, baseURL, viewport }) => {
  // Cover native keyboard navigation with normal motion, and stable pointer actions
  // with reduced motion (the same mode used by the other no-script journeys).
  const context = await browser.newContext({baseURL, viewport, javaScriptEnabled:false, reducedMotion});
  try {
    const page = await context.newPage();
    await page.goto("/guides");
    await page.locator('.standards-collections a[href="/guides/iso-20022"]').click();
    await page.locator('main a[href="/guides/iso-20022/payment-transaction-status"]').click();
    const messages = page.locator("#message-usage details");
    await messages.locator("summary").focus(); await page.keyboard.press("Enter");
    await expect(messages).toHaveAttribute("open", "");
    await expect(messages.locator("li").first()).toBeVisible();
    const status = page.getByRole("cell").getByRole("link", {name:"ACSP", exact:true});
    if (interaction === "keyboard") { await status.focus(); await page.keyboard.press("Enter"); }
    else await status.click();
    await expect(page.locator("#definition")).toBeVisible();
    await page.getByRole("navigation", {name:"Breadcrumb"}).getByRole("link", {name:"Guides", exact:true}).click();
    await page.locator('.standards-collections a[href="/guides/iso-8583"]').click();
    await page.locator('main a[href="/guides/iso-8583/messages"]').click();
    const message = page.getByRole("cell").getByRole("link", {name:"2100", exact:true});
    if (interaction === "keyboard") { await message.focus(); await page.keyboard.press("Enter"); }
    else await message.click();
    await expect(page.locator("#message-digits")).toContainText("2003");
    await page.locator(".reference-notes summary").click();
    await expect(page.locator(".reference-notes")).toContainText("2023");
    await expect(page.locator("form, input, textarea, iframe")).toHaveCount(0);
    expect(await context.cookies()).toEqual([]);
  } finally { await context.close(); }
});
}


test("long reference directories retain keyboard jumps without JavaScript and keep their destination clear", async ({ browser, baseURL, viewport }) => {
  const context = await browser.newContext({ baseURL, viewport, javaScriptEnabled: false, reducedMotion: "reduce" });
  try {
    const page = await context.newPage();
    for (const [path, label, minimumRows] of [
      ["/guides/iso-20022/purpose", "Codes by first character", 366],
      ["/guides/iso-8583/fields", "Field groups", 97],
    ] as const) {
      await page.goto(path);
      await expect(page.locator(".sr-table tbody tr")).toHaveCount(minimumRows);
      await page.evaluate(() => window.scrollTo(0, 1800));
      const index = page.locator(".reference-index");
      const initial = await index.boundingBox();
      expect(initial).not.toBeNull();
      expect(initial!.y).toBeGreaterThanOrEqual(0);
      expect(initial!.y).toBeLessThan(2);
      const finalJump = page.getByRole("navigation", { name: label, exact: true }).getByRole("link").last();
      const href = await finalJump.getAttribute("href");
      await finalJump.focus();
      await expect(finalJump).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      const target = await page.locator(href!).boundingBox();
      const bar = await index.boundingBox();
      expect(target).not.toBeNull();
      expect(bar).not.toBeNull();
      expect(target!.y).toBeGreaterThanOrEqual(bar!.y + bar!.height);
      expect(target!.y).toBeLessThan(180);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await index.getByRole("link", { name: "Sources", exact: true }).click();
      await expect(page).toHaveURL(/#reference-source$/);
      await expect(page.getByRole("complementary")).toBeInViewport();
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      await index.getByRole("link", { name: "Top", exact: true }).click();
      await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    }
    await page.setViewportSize({ width: 740, height: 400 });
    await page.goto("/guides/iso-20022/purpose");
    await page.evaluate(() => window.scrollTo(0, 1800));
    expect(await page.locator(".reference-index").evaluate(element => getComputedStyle(element).position)).toBe("static");
  } finally { await context.close(); }
});


test("reference filters keep code identity, source context and ordinary links", async ({ page, context }) => {
  for (const [path, label, code, noun] of [
    ["/guides/iso-20022/purpose", "Filter this code set", "SALA", "codes"],
    ["/guides/iso-8583/fields", "Filter data fields", "39", "fields"],
    ["/guides/iso-8583/messages", "Filter message types", "2100", "message types"],
  ]) {
    await page.goto(path);
    const total = await page.locator(".sr-table tbody tr").count();
    const input = page.getByRole("searchbox", { name: label });
    await input.fill("  " + code.toLowerCase() + "  ");
    await expect(page.getByRole("status")).toHaveText(`1 of ${total} ${noun}`);
    await expect(page.locator(".sr-table tbody tr:visible")).toHaveCount(1);
    await expect(page.getByRole("cell").getByRole("link", { name: code, exact: true })).toBeVisible();
    await expect(page.getByRole("complementary")).toBeVisible();
    await expect(page).toHaveURL(new RegExp(path + "$"));
    await input.fill("zznoentryexists");
    await expect(page.locator(".sr-table tbody tr:visible")).toHaveCount(0);
    await expect(page.getByText("No matching entries. Try another code or clear the filter.")).toBeVisible();
    await page.getByRole("button", { name: "Clear", exact: true }).click();
    await expect(input).toBeFocused();
    await expect(page.locator(".sr-table tbody tr:visible")).toHaveCount(total);
    await input.fill(code); await input.press("Escape");
    await expect(input).toHaveValue("");
    await expect(page.getByRole("status")).toHaveText(`All ${total} ${noun}`);
    const result = await new AxeBuilder({page}).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(result.violations.map(v => v.id)).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
  }
  expect(await context.cookies()).toEqual([]);
});

test("filtering by meaning preserves definitions and alphabet navigation", async ({ page, request }) => {
  const response = await request.get("/guides/iso-20022/purpose");
  expect(await response.text()).toContain('/guides/iso-20022/purpose/sala');
  await page.goto("/guides/iso-20022/purpose");
  const filter = page.getByRole("searchbox", { name: "Filter this code set" });
  await filter.fill("salary");
  await expect(page.locator("#code-sala")).toBeVisible();
  await page.locator("#code-sala summary").focus(); await page.keyboard.press("Enter");
  await expect(page.locator("#code-sala details p")).toBeVisible();
  await filter.fill("noentryhere");
  const jump = page.getByRole("navigation", {name:"Codes by first character"}).getByRole("link", {name:"S", exact:true});
  const href = await jump.getAttribute("href");
  await jump.click();
  await expect(filter).toHaveValue("");
  await expect(page.locator(href!)).toBeInViewport();
  await page.locator('#code-sala a').click();
  await expect(page).toHaveURL(/purpose\/sala$/);
  await expect(page.locator("#definition")).toContainText("Transaction is the payment of salaries.");
});

test("reference entries and definitions remain complete without JavaScript", async ({ browser, baseURL, viewport }) => {
  const context = await browser.newContext({baseURL,viewport,javaScriptEnabled:false,reducedMotion:"reduce"});
  try {
    const page = await context.newPage();
    await page.goto("/guides/iso-20022/purpose");
    await expect(page.getByRole("searchbox")).toHaveCount(0);
    await expect(page.locator(".sr-table tbody tr")).toHaveCount(366);
    await page.locator("#code-sala summary").focus(); await page.keyboard.press("Enter");
    await expect(page.locator("#code-sala details p")).toBeVisible();
    await page.locator("#code-sala a").click();
    await expect(page.locator("#definition")).toBeVisible();
    await page.goto("/guides/iso-8583/fields");
    await expect(page.getByRole("searchbox")).toHaveCount(0);
    await expect(page.locator(".sr-table tbody tr:visible")).toHaveCount(97);
  } finally { await context.close(); }
});

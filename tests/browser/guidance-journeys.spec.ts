import { expect, test, type Locator, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { setupPlan, setupScenarios } from "../../src/features/agents/setup-paths";
import { fileURLToPath } from "node:url";
import { loadGuidanceMap } from "../../tools/review-guidance";

const start = ["Start or connect checkout", "WooCommerce"];
const approved = [...start, "My account is approved", "Yes, the details match and I can sign in"];
const scenarios = [
  {
    name: "pending review stays with the existing application",
    choices: [...start, "My application is under review"],
    brief: ["Submitting an application does not confirm approval", "do not need another application"],
    link: "Check what happens after submission", href: "/resources/merchant-account-setup#application-submitted",
    section: "#application-submitted", guide: ["Wait for account approval", "confirmation that your payment setup is ready", "same email"],
  },
  {
    name: "approved account with missing access uses the correct portal credentials",
    choices: [...start, "My account is approved", "The email or access is missing, or I’m unsure"],
    brief: ["processing MID and gateway account pairing", "Back Office login and Cybersource gateway login are different"],
    link: "Which portal should I use?", href: "/developers/getting-started#portal-access",
    section: "#portal-access", guide: ["Back Office", "Business Center"],
  },
  {
    name: "documented WooCommerce setup keeps uploaded certificate and passwords distinct",
    choices: [...approved, "WordPress.com with Visa Acceptance Solutions (without SMB)"],
    brief: ["REST Key ID and Shared Secret are settings values", "without SMB", "certificate password is different from the SFTP password"],
    link: "Where each credential goes", href: "/resources/woocommerce-gateway-integration#enter-credentials",
    section: "#enter-credentials", guide: ["There is no second upload here", "full server path", "not your WordPress or SFTP password"],
  },
  {
    name: "another host or plugin requires matching instructions first",
    choices: [...approved, "Another host or plugin, or I’m not sure"],
    brief: ["exact plugin name and version", "do not apply to every host or plugin", "Do not upload a private certificate to the Media Library"],
    link: "Check the guide’s prerequisites", href: "/resources/woocommerce-gateway-integration#before-you-start",
    section: "#before-you-start", guide: ["WordPress.com", "certificate path depend on your host", "Ask Trolleys for the right setup"],
  },
  {
    name: "another website for the same DBA requires account and domain confirmation",
    choices: ["Add a store or brand", "Another website for the same DBA"],
    brief: ["does not automatically require another MID", "Do not submit an additional location application solely because a domain changed"],
    link: "Review another storefront under one account", href: "/company/blog/add-storefront-domain-payment-account",
    section: "#same-owner", guide: ["same legal seller", "additional domain should be recorded", "Do not treat a successful connection as that answer"],
  },
  {
    name: "a new DBA under the same company still needs its own approval",
    choices: ["Add a store or brand", "A new DBA under the same legal company"],
    brief: ["Keep the same legal company name", "additional MID is approved", "does not activate processing immediately"],
    link: "Follow the additional DBA steps", href: "/resources/merchant-account-setup#additional-mid",
    section: "#additional-mid", guide: ["same LLC or corporation", "different legal company", "Wait for the additional MID to be approved"],
  },
  {
    name: "a different company goes to the account team before choosing an application",
    choices: ["Add a store or brand", "A different legal company"],
    brief: ["confirm which application and account arrangement", "Do not use the same-company + Location process"],
    link: "Contact merchant support", href: "/company/contact#account-support",
    section: "#account-support", guide: ["support"],
  },
];

async function reveal(page: Page, target: Locator) {
  const parents = await target.evaluate(element => {
    const ids: string[] = [];
    for (let node: Element | null = element; node; node = node.parentElement) {
      if (node.tagName === "DETAILS" && node.id) ids.unshift(node.id);
    }
    return ids;
  });
  for (const id of parents) {
    const details = page.locator(`#${id}`);
    if (await details.getAttribute("open") === null) await details.locator(":scope > summary").click();
  }
}

for (const scenario of scenarios) test(`shared guidance: ${scenario.name}`, async ({ page }, testInfo) => {
  const errors: string[] = [], mutations: string[] = [];
  page.on("pageerror", error => errors.push(error.stack ?? error.message));
  await page.route("**/*", async route => {
    if (!["GET", "HEAD", "OPTIONS"].includes(route.request().method())) {
      mutations.push(`${route.request().method()} ${route.request().url()}`); await route.abort();
    } else await route.continue();
  });
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { configurable: true,
    value: { writeText: async (value: string) => { document.documentElement.dataset.reviewBrief = value; } } }));
  await page.goto("/agents#next-step");
  const helper = page.locator("#next-step");
  for (const choice of scenario.choices) await helper.getByRole("button", { name: choice, exact: true }).click();
  await expect(helper.locator("h2")).toBeFocused();
  await expect(helper.locator("h2")).toBeInViewport();
  await helper.getByRole("button", { name: "View your brief", exact: true }).click();
  const brief = helper.getByRole("textbox", { name: "Your next step brief" });
  await expect(brief).toHaveAttribute("readonly", "");
  const value = await brief.inputValue();
  for (const condition of scenario.brief) expect(value).toContain(condition);
  expect(value).toContain("not a verification of my account");
  expect(value).toContain("does not authorize signing in, changing accounts or running payments");
  expect(value).toContain(`https://etaildepot.com${scenario.href}`);
  await helper.getByRole("button", { name: "Copy brief", exact: true }).click();
  await expect(helper.getByRole("status")).toContainText("Copied");
  expect(await page.locator("html").getAttribute("data-review-brief")).toBe(value);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await helper.getByRole("button", { name: "Hide your brief", exact: true }).click();
  const link = helper.getByRole("link", { name: scenario.link, exact: true });
  await expect(link).toHaveAttribute("href", scenario.href);
  await link.click();
  await expect.poll(() => new URL(page.url()).pathname + new URL(page.url()).hash).toBe(scenario.href);
  const section = page.locator(scenario.section);
  await reveal(page, section);
  for (const condition of scenario.guide) await expect(section).toContainText(condition);
  await section.getByRole("heading").first().scrollIntoViewIfNeeded();
  await expect(section.getByRole("heading").first()).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({ path: testInfo.outputPath("human-guide.png") });
  expect(mutations).toEqual([]);
  expect(errors).toEqual([]);
});

test("shared guidance: Help gives separate next steps for a website and a DBA", async ({ page }) => {
  await page.goto("/resources/help#payments");
  const question = page.locator("summary").filter({ hasText: "Can I add another store or DBA under the same company?" });
  await question.click();
  const answer = question.locator("..");
  await expect(answer).toContainText("For a new DBA under the same company, use + Location");
  await expect(answer).toContainText("Another website for the same DBA does not automatically need another MID");
  await expect(answer.getByRole("link", { name: "additional DBA setup steps" })).toHaveAttribute("href", "/resources/merchant-account-setup#additional-mid");
  await answer.getByRole("link", { name: "additional storefront guidance" }).click();
  await expect(page).toHaveURL(/\/company\/blog\/add-storefront-domain-payment-account$/);
  await expect(page.locator("#same-owner")).toContainText("additional domain should be recorded");
});

test("shared guidance: every declared human section exists in the current export", async ({ request }) => {
  const map = loadGuidanceMap(fileURLToPath(new URL("../../", import.meta.url)));
  const cache = new Map<string, string>();
  for (const href of new Set(map.workflows.flatMap(workflow => workflow.guides))) {
    const [pathname, fragment] = href.split("#");
    if (!cache.has(pathname)) {
      const response = await request.get(pathname);
      expect(response.status(), href).toBe(200);
      cache.set(pathname, await response.text());
    }
    if (fragment) expect(cache.get(pathname), href).toContain(`id="${fragment}"`);
  }
});

test("agent task plans: every step source resolves to its actual exported section", async ({ request }) => {
  const links = new Set(setupScenarios().flatMap(item => setupPlan(item.result).steps.map(step => step.source.href)));
  const cache = new Map<string,string>();
  for (const href of links) {
    const [path, fragment] = href.split("#");
    if (!cache.has(path)) {
      const response = await request.get(path);
      expect(response.status(),href).toBe(200);
      cache.set(path,await response.text());
    }
    if (fragment) expect(cache.get(path),href).toContain(`id="${fragment}"`);
  }
});

test("agent task plans: all situations remain available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:720}});
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:3100/agents#task-reference");
    const reference = page.locator("#task-reference");
    const scenarios = setupScenarios();
    const referenceText = await reference.textContent();
    for (const {selections,result} of scenarios) {
      expect(referenceText).toContain(result.title);
      expect(referenceText).toContain(selections.at(-1)!.answer);
      for (const step of setupPlan(result).steps) expect(referenceText).toContain(step.complete);
    }
    const group = page.locator("#tasks-location");
    await group.locator(":scope > summary").focus();
    await page.keyboard.press("Enter");
    const entry = group.locator("details").filter({has:page.getByRole("heading",{name:"Request the additional DBA under the same company.",exact:true})});
    await entry.locator(":scope > summary").focus();
    await page.keyboard.press("Enter");
    await expect(entry.getByRole("heading",{name:"Wait for the separate account approval",exact:true})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  } finally { await context.close(); }
});

test("agent task plans: saved and copied briefs carry the same plan and reset without stale steps", async ({ page }) => {
  const mutations: string[] = [], errors: string[] = [];
  page.on("pageerror",error => errors.push(error.message));
  await page.route("**/*", async route => {
    if (!["GET","HEAD","OPTIONS"].includes(route.request().method())) {mutations.push(route.request().url()); await route.abort();}
    else await route.continue();
  });
  await page.addInitScript(() => Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async(value:string) => {document.documentElement.dataset.savedPlan=value;}}}));
  await page.goto("/agents");
  const helper=page.locator("#next-step");
  for (const label of ["Start or connect checkout","WooCommerce","My account is approved","Yes, the details match and I can sign in","WordPress.com with Visa Acceptance Solutions (without SMB)"]) await helper.getByRole("button",{name:label,exact:true}).click();
  await helper.locator("summary").filter({hasText:"View your action plan"}).click();
  const visibleSteps=helper.locator("ol > li");
  await expect(visibleSteps).toHaveCount(4);
  await helper.getByRole("button",{name:"View your brief",exact:true}).click();
  const brief=await helper.getByRole("textbox",{name:"Your next step brief"}).inputValue();
  for (const title of await visibleSteps.locator("h4").allTextContents()) expect(brief).toContain(title);
  await helper.getByRole("button",{name:"Copy brief",exact:true}).click();
  expect(await page.locator("html").getAttribute("data-saved-plan")).toBe(brief);
  const downloading=page.waitForEvent("download");
  await helper.getByRole("button",{name:"Save brief",exact:true}).click();
  const download=await downloading;
  expect(download.suggestedFilename()).toBe("trolleys-woocommerce-plan.txt");
  expect(await readFile((await download.path())!,"utf8")).toBe(brief);
  await expect(helper.getByRole("status")).toContainText("Download started");
  await helper.getByRole("button",{name:"Back",exact:true}).click();
  await helper.getByRole("button",{name:"Another host or plugin, or I’m not sure",exact:true}).click();
  await expect(helper.locator("details[open]")).toHaveCount(0);
  await expect(helper.getByRole("textbox")).toHaveCount(0);
  await helper.locator("summary").filter({hasText:"View your action plan"}).click();
  await expect(helper.locator("ol > li")).toHaveCount(2);
  await expect(helper).not.toContainText("Registered Webhooks");
  expect(await page.evaluate(() => ({local:localStorage.length,session:sessionStorage.length}))).toEqual({local:0,session:0});
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  expect(mutations).toEqual([]); expect(errors).toEqual([]);
});

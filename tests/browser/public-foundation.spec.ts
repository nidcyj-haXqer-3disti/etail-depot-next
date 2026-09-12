import { expect, test, type Page } from "@playwright/test";

async function preventMutationRequests(page: Page) {
  const mutations: string[] = [];
  await page.route("**/*", async route => {
    const request = route.request();
    if (["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      await route.continue();
    } else {
      mutations.push(`${request.method()} ${request.url()}`);
      await route.abort("blockedbyclient");
    }
  });
  return mutations;
}

test("a new visitor can compare services before signing in", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", {level:1})).toHaveText(/^Shared spending\.\s*Simple payments\.\s*You’re in control\.$/);
  const mainNavigation = page.getByRole("navigation", {name:"Main navigation"});
  await mainNavigation.getByRole("link", {name:"Cards for your people",exact:true}).click();
  await expect(page).toHaveURL(/\/card-services$/);
  await expect(page.getByRole("heading", {level:1})).toHaveText(/^Their own card\.\s*Your peace of mind\.$/);
  await expect(mainNavigation.getByRole("link",{name:"Cards for your people"})).toHaveAttribute("aria-current","page");
  await expect(page.getByRole("heading",{name:"Additional cardholder",exact:true})).toBeVisible();
  await mainNavigation.getByRole("link",{name:"Get paid together",exact:true}).click();
  await expect(page).toHaveURL(/\/payment-services$/);
  await expect(page.getByRole("heading", {level:1})).toHaveText(/^Get paid\.\s*Together\.$/);
  await expect(mainNavigation.getByRole("link",{name:"Get paid together",exact:true})).toHaveAttribute("aria-current","page");
  await expect(page.getByRole("heading",{name:"Primary merchant",exact:true})).toBeVisible();
  await page.getByRole("link",{name:"Open merchant services",exact:true}).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(errors).toEqual([]);
});

test("help topics and answers work with a keyboard without sign-in", async ({page}) => {
  await page.goto("/help");
  await page.getByRole("navigation",{name:"Help topics"}).getByRole("link",{name:"Cards & spending"}).click();
  await expect(page).toHaveURL(/\/help#cards$/);
  const question=page.locator("summary").filter({hasText:"How do I freeze a card?"});
  await question.focus();await page.keyboard.press("Enter");
  await expect(question.locator("..")).toHaveAttribute("open","");
  await expect(question.locator("..")).toContainText("Only controls available to you are shown.");
  await page.keyboard.press("Enter");
  await expect(question.locator("..")).not.toHaveAttribute("open","");
  await page.getByRole("link",{name:"Go to sign in",exact:true}).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("public pages have unique canonical metadata and no private data", async ({page,request}) => {
  const titles=new Set<string>();
  for (const route of ["/","/card-services","/payment-services","/help"]) {
    await page.goto(route);
    titles.add(await page.title());
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(new URL((await canonical.getAttribute("href"))!).href).toBe(`https://etail-depot-next.netlify.app${route}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content",/.{50,}/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
    await expect(page.getByRole("heading",{level:1})).toHaveCount(1);
    const data=JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
    expect(data["@graph"].at(-1).url).toBe(`https://etail-depot-next.netlify.app${route}`);
    await expect(page.locator("main")).not.toContainText(/Alex Morgan|Jamie Morgan|personId|cardId|canonical|projection|idempotency|sandbox|demo|practice|fixture/i);
    await expect(page.locator(".sandbox-badge")).toHaveCount(1);
    await expect(page.locator(".sandbox-badge")).toHaveText("Sandbox");
    await expect(page.getByRole("navigation", {name:"Footer support"}).getByRole("link", {name:"Help center"})).toBeVisible();
  }
  expect(titles.size).toBe(4);
  const sitemap=await request.get("/sitemap.xml");expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toContain("<loc>");
  const robots=await request.get("/robots.txt");expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("Disallow: /api/");
  await page.goto("/login");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  const image=await request.get("/opengraph-image");expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toBe("image/png");
});


test("all seven payment examples work by keyboard without sending changes", async ({page}) => {
  const mutations: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", async route => {
    const request = route.request();
    if (["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      await route.continue();
    } else {
      mutations.push(`${request.method()} ${request.url()}`);
      await route.abort("blockedbyclient");
    }
  });
  await page.goto("/");
  const tablist = page.getByRole("tablist", {name:"Payment channel examples"});
  const examples = [
    {name:"Text", context:/^Text message$/},
    {name:"Email", context:/^Email ·/},
    {name:"Invoice", context:/^Invoice ·/},
    {name:"Bill", context:/^Bill ·/},
    {name:"Social", context:/^Social post ·/},
    {name:"QR code", context:/^QR code ·/},
    {name:"Web link", context:/^Web link ·/},
  ];
  await expect(tablist.getByRole("tab")).toHaveCount(examples.length);
  await tablist.getByRole("tab", {name:"Text", exact:true}).focus();
  async function expectExample(index: number) {
    const example = examples[index]!;
    const tab = tablist.getByRole("tab", {name:example.name, exact:true});
    await expect(tab).toBeFocused();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(tab).toHaveAttribute("tabindex", "0");
    await expect(tablist.getByRole("tab", {selected:true})).toHaveCount(1);
    const panel = page.getByRole("tabpanel", {name:example.name, exact:true});
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("aria-labelledby", (await tab.getAttribute("id"))!);
    await expect(panel.getByText(example.context)).toBeVisible();
    await expect(panel.getByRole("heading", {level:3})).toBeVisible();
    for (const other of examples.filter((_, otherIndex) => otherIndex !== index)) {
      await expect(tablist.getByRole("tab", {name:other.name, exact:true})).toHaveAttribute("tabindex", "-1");
    }
  }
  await expectExample(0);
  for (let index=1; index<examples.length; index+=1) {
    await page.keyboard.press("ArrowRight");
    await expectExample(index);
  }
  await page.keyboard.press("ArrowRight");
  await expectExample(0);
  await page.keyboard.press("End");
  await expectExample(examples.length-1);
  await page.keyboard.press("Home");
  await expectExample(0);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("tabpanel", {name:"Text", exact:true})).toBeFocused();
  await expect(page.getByText("Examples only. No messages are sent or money collected.", {exact:true})).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  expect(mutations).toEqual([]);
  expect(errors).toEqual([]);
});

test("a first-time visitor uses emailed callbacks instead of manual link entry without sending email", async ({page}) => {
  const mutations = await preventMutationRequests(page);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/login");

  const signIn = page.getByRole("form", {name:"Sign in with email", exact:true});
  await expect(signIn).toBeVisible();
  await expect(signIn.getByLabel("Email address", {exact:true})).toBeDisabled();
  await expect(signIn.getByLabel("Password", {exact:true})).toBeDisabled();
  await expect(page.getByRole("button", {name:"I have a confirmation email", exact:true})).toHaveCount(0);
  await expect(page.locator('input[name="emailLink"]')).toHaveCount(0);

  await page.getByRole("button", {name:"Create a login", exact:true}).click();
  const register = page.getByRole("form", {name:"Create your login", exact:true});
  await expect(register).toBeVisible();
  for (const name of ["Email address", "Password", "Confirm password"]) {
    await expect(register.getByLabel(name, {exact:true})).toBeVisible();
    await expect(register.getByLabel(name, {exact:true})).toBeDisabled();
  }
  await expect(register.getByRole("button", {name:"Create login", exact:true})).toBeDisabled();
  await page.getByRole("button", {name:"Back to sign in", exact:true}).click();
  await expect(signIn).toBeVisible();
  await expect(page.getByLabel("Confirm password", {exact:true})).toHaveCount(0);

  await page.getByRole("button", {name:"Forgot your password?", exact:true}).click();
  const recover = page.getByRole("form", {name:"Reset your password", exact:true});
  await expect(recover).toBeVisible();
  await expect(recover.getByLabel("Email address", {exact:true})).toBeDisabled();
  await expect(recover.getByLabel("Password", {exact:true})).toHaveCount(0);
  await expect(recover.getByRole("button", {name:"Send reset email", exact:true})).toBeDisabled();
  await expect(page.getByRole("button", {name:"I have a reset email", exact:true})).toHaveCount(0);
  // A synthetic callback supplies the link privately; unavailable email access
  // still prevents confirmation/reset writes. Nothing is pasted or submitted.
  await page.goto("/login#recovery_token=synthetic-public-callback");
  const reset = page.getByRole("form", {name:"Choose a new password", exact:true});
  await expect(reset).toBeVisible();
  await expect(page).toHaveURL(url=>url.pathname==="/login"&&url.hash==="");
  await expect(reset.getByLabel("Password reset link", {exact:true})).toHaveCount(0);
  for (const name of ["New password", "Confirm password"]) {
    await expect(reset.getByLabel(name, {exact:true})).toBeVisible();
    await expect(reset.getByLabel(name, {exact:true})).toBeDisabled();
  }
  await expect(reset.getByRole("button", {name:"Save new password", exact:true})).toBeDisabled();
  await page.getByRole("button", {name:"Request a new reset email", exact:true}).click();
  await expect(recover).toBeVisible();
  await page.getByRole("button", {name:"Back to sign in", exact:true}).click();

  await page.goto("/login#confirmation_token=synthetic-public-callback");
  const confirmation = page.getByRole("form", {name:"Confirm your email", exact:true});
  await expect(confirmation).toBeVisible();
  await expect(page).toHaveURL(url=>url.pathname==="/login"&&url.hash==="");
  await expect(confirmation.getByLabel("Confirmation link", {exact:true})).toHaveCount(0);
  await expect(confirmation.getByRole("button", {name:"Confirm email", exact:true})).toBeDisabled();
  await page.getByRole("button", {name:"Back to registration", exact:true}).click();
  await expect(register).toBeVisible();
  await page.getByRole("button", {name:"Back to sign in", exact:true}).click();
  await expect(signIn).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
  expect(mutations).toEqual([]);
  expect(errors).toEqual([]);
});

test("an invalid email callback is removed before login and shows a recoverable error without authenticating", async ({page}) => {
  const mutations = await preventMutationRequests(page);
  const requests: string[] = [];
  const errors: string[] = [];
  page.on("request", request => requests.push(request.url()));
  page.on("pageerror", error => errors.push(error.message));
  // Deliberately invalid syntax: this is neither a real token nor valid input to the email-link parser.
  await page.goto("/#confirmation_token=%21invalid-public-test%21");
  await expect(page).toHaveURL(url => url.pathname === "/login" && url.hash === "");
  await expect(page.getByRole("form", {name:"Sign in with email", exact:true})).toBeVisible();
  const alert = page.getByRole("main").getByRole("alert");
  await expect(alert).toHaveText("This email link is not supported. Open the link in your latest confirmation or password reset email.");
  await expect(alert).toBeFocused();
  await page.getByRole("button", {name:"Forgot your password?", exact:true}).click();
  await expect(page.getByRole("form", {name:"Reset your password", exact:true})).toBeVisible();
  await expect(alert).toHaveCount(0);
  expect(requests.every(url => !url.includes("invalid-public-test") && !url.includes("confirmation_token"))).toBe(true);
  expect(mutations).toEqual([]);
  expect(errors).toEqual([]);
});

test("header sign-in and history update the idle registration form without authentication requests", async ({page}) => {
  const mutations = await preventMutationRequests(page);
  await page.goto("/login?mode=register");
  await expect(page.getByRole("form", {name:"Create your login", exact:true})).toBeVisible();
  await page.getByRole("banner").getByRole("link", {name:"Sign in", exact:true}).click();
  await expect(page).toHaveURL(url=>url.pathname==="/login"&&url.search==="");
  await expect(page.getByRole("form", {name:"Sign in with email", exact:true})).toBeVisible();
  await expect(page.getByRole("form", {name:"Create your login", exact:true})).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(url=>url.pathname==="/login"&&url.search==="?mode=register");
  await expect(page.getByRole("form", {name:"Create your login", exact:true})).toBeVisible();
  await page.goForward();
  await expect(page.getByRole("form", {name:"Sign in with email", exact:true})).toBeVisible();
  expect(mutations).toEqual([]);
});

test("registration links only choose the initial form and emailed callbacks take precedence", async ({page}) => {
  const mutations = await preventMutationRequests(page);
  await page.goto("/login?mode=register");
  await expect(page.getByRole("form", {name:"Create your login", exact:true})).toBeVisible();
  await expect(page.locator('input[name="emailLink"]')).toHaveCount(0);
  for (const query of ["mode=confirm", "mode=reset", "mode=unexpected", "mode=register&mode=register"]) {
    await page.goto(`/login?${query}`);
    await expect(page.getByRole("form", {name:"Sign in with email", exact:true})).toBeVisible();
  }
  await page.goto("/login?mode=register#confirmation_token=synthetic-public-mode-callback");
  await expect(page.getByRole("form", {name:"Confirm your email", exact:true})).toBeVisible();
  await expect(page).toHaveURL(url=>url.pathname==="/login"&&url.search==="?mode=register"&&url.hash==="");
  await expect(page.getByRole("form", {name:"Create your login", exact:true})).toHaveCount(0);
  await page.getByRole("banner").getByRole("link", {name:"Sign in", exact:true}).click();
  await expect(page).toHaveURL(url=>url.pathname==="/login"&&url.search===""&&url.hash==="");
  await expect(page.getByRole("form", {name:"Confirm your email", exact:true})).toBeVisible();
  await expect(page.getByRole("form", {name:"Sign in with email", exact:true})).toHaveCount(0);
  await page.getByRole("button", {name:"Back to sign in", exact:true}).click();
  await expect(page.getByRole("form", {name:"Sign in with email", exact:true})).toBeVisible();
  await expect(page.locator('input[name="emailLink"]')).toHaveCount(0);
  expect(await page.evaluate(()=>localStorage.length+sessionStorage.length)).toBe(0);
  expect(mutations).toEqual([]);
});

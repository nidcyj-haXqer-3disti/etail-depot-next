/** Customer locators only. This module never grants access or starts a command. */
export type CustomerQuery = Record<string, string | string[] | undefined> | URLSearchParams;
const uuid = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const idPattern = new RegExp(`^${uuid}$`, "i");
const cardTasks = ["activity", "reports", "settings", "help", "membership"];
const terminalTasks: Record<string, string> = { payments: "payments", people: "people", controls: "verification", disputes: "disputes", help: "help" };
export function customerQuery(input: CustomerQuery = {}): URLSearchParams {
  const query = input instanceof URLSearchParams ? new URLSearchParams(input) : new URLSearchParams();
  if (!(input instanceof URLSearchParams)) for (const [key, value] of Object.entries(input)) if (value !== undefined) for (const item of Array.isArray(value) ? value : [value]) query.append(key, item);
  for (const key of query.keys()) if (query.getAll(key).length !== 1 || /[\u0000-\u001f\u007f]/.test(query.get(key)!)) throw new Error("INVALID_CUSTOMER_ROUTE");
  return query;
}
export function customerQueryRecord(input: CustomerQuery): Record<string, string> { return Object.fromEntries(customerQuery(input)); }
function identifier(value: string) { if (!idPattern.test(value)) throw new Error("INVALID_CUSTOMER_ROUTE"); return value.toLowerCase(); }
function bind(query: URLSearchParams, key: string, value: string) {
  if (query.has(key) && query.get(key)!.toLowerCase() !== value.toLowerCase()) throw new Error("CONFLICTING_CUSTOMER_ROUTE");
  query.set(key, value);
}
function exclude(query: URLSearchParams, keys: string[]) { if (keys.some(key => query.has(key))) throw new Error("CONFLICTING_CUSTOMER_ROUTE"); }
function cleanPath(path: string) {
  if (!path.startsWith("/") || /[?#%\\\u0000-\u0020\u007f]/.test(path) || path.includes("//") || path.split("/").some(item => item === "." || item === "..")) throw new Error("INVALID_CUSTOMER_ROUTE");
  if(path.split("/").some(item=>item!==item.toLowerCase()&&!idPattern.test(item)))throw new Error("INVALID_CUSTOMER_ROUTE");
}

/** Restore the existing loader selectors from an explicit, validated pathname. */
export function customerRouteQuery(path: string, input: CustomerQuery = {}) {
  cleanPath(path);
  const query = customerQuery(input);
  let match: RegExpMatchArray | null;
  if (path === "/cardholder-services/cards") { exclude(query,["focus","activityCard","card","request","new","manage","transaction","invite"]); bind(query, "view", "cards"); }
  else if (path === "/cardholder-services/cards/new") { exclude(query,["focus","activityCard","card","request","manage"]); bind(query, "new", "1"); bind(query, "view", "cards"); }
  else if ((match = path.match(new RegExp(`^/cardholder-services/cards/(${uuid})(?:/(invite|${cardTasks.join("|")}))?$`, "i")))) {
    const id = identifier(match[1]!); bind(query, "focus", id);
    exclude(query,match[2]==="help"?["request","manage"]:["request","new","manage"]);
    if (query.has("card") && identifier(query.get("card")!) !== id) throw new Error("CONFLICTING_CUSTOMER_ROUTE");
    if (!match[2] || match[2] === "invite") bind(query, "view", "cards");
    if (match[2] === "invite") { exclude(query,["transaction"]); bind(query, "invite", "1"); }
    if (match[2] && match[2] !== "invite" && query.has("view") && query.get("view") !== match[2]) throw new Error("CONFLICTING_CUSTOMER_ROUTE");
  }
  else if (path === "/cardholder-services/card-requests") { exclude(query,["card","request","new","manage","transaction","invite"]); bind(query, "view", "requests"); }
  else if ((match = path.match(new RegExp(`^/cardholder-services/card-requests/(${uuid})$`, "i")))) { exclude(query,["card","new","manage"]); bind(query, "request", identifier(match[1]!)); bind(query, "view", "requests"); }
  else if (path === "/cardholder-services/cardholders") { exclude(query,["card","request","new","transaction","invite"]); bind(query, "view", "cardholders"); }
  else if (path === "/merchant-services/terminals") { exclude(query,["new"]); bind(query, "section", "merchants"); }
  else if (path === "/merchant-services/settings") { exclude(query,["new"]); bind(query, "section", "settings"); }
  else if ((match = path.match(new RegExp(`^/merchant-services/(${uuid})/terminals/new$`, "i")))) { bind(query, "view", `merchant:${identifier(match[1]!)}`); bind(query, "section", "merchants"); bind(query, "new", "1"); }
  else if ((match = path.match(new RegExp(`^/merchant-services/terminals/(${uuid})(?:/(channels/new|channels/${uuid}|${Object.keys(terminalTasks).join("|")}|business-details))?$`, "i")))) {
    const suffix = match[2];
    bind(query, "tab", suffix && terminalTasks[suffix] ? terminalTasks[suffix]! : "channels");
    if (suffix === "channels/new") bind(query, "new", "1");
    else if (suffix?.startsWith("channels/")) bind(query, "channel", identifier(suffix.slice(9)));
    if(suffix&&["payments","controls","disputes","business-details"].includes(suffix))exclude(query,["new","channel","invite"]);
    if(suffix==="people")exclude(query,["new","channel","payment","transfer"]);
    if(suffix?.startsWith("channels/"))exclude(query,["payment","transfer","invite","case"]);
  }
  else if ((match = path.match(new RegExp(`^/money-accounts/(${uuid})/(add-money|withdraw)$`, "i")))) bind(query, "task", match[2] === "add-money" ? "add" : "withdraw");
  else if (path !== "/cardholder-services" && path !== "/merchant-services" && !new RegExp(`^/cardholder-services/(?:${cardTasks.join("|")})$`).test(path) && !new RegExp(`^/merchants/${uuid}(?:/business-details)?$`, "i").test(path) && !new RegExp(`^/money-accounts/${uuid}$`, "i").test(path) && !new RegExp(`^/merchant-services/${uuid}/settings$`, "i").test(path)) throw new Error("INVALID_CUSTOMER_ROUTE");
  return query;
}

/** Translate saved selectors once; preserve filters, exact receipt IDs and return destinations. */
export function customerHref(path: string, input: CustomerQuery = {}) {
  const query = customerRouteQuery(path, input);
  let destination = path;
  if (path.startsWith("/cardholder-services")) {
    if(query.has("view")&&!["overview","cards","activity","cardholders","requests"].includes(query.get("view")!))throw new Error("INVALID_CUSTOMER_ROUTE");
    if(query.get("view")==="overview"&&["focus","card","request","new","manage","activityCard"].some(key=>query.has(key)))throw new Error("CONFLICTING_CUSTOMER_ROUTE");
    if(query.has("new")&&query.has("view")&&query.get("view")!=="cards")throw new Error("CONFLICTING_CUSTOMER_ROUTE");
    const task = path.split("/").at(-1)!;
    const taskRoute = cardTasks.includes(task);
    const activityRoute=query.get("view")==="activity"||(!query.has("view")&&query.has("activityCard"));
    if(taskRoute||activityRoute){
      exclude(query,task==="help"?["card","request","manage"]:["card","request","manage","new","invite","review"]);
      if(query.has("view")&&query.get("view")!==(taskRoute?task:"activity"))throw new Error("CONFLICTING_CUSTOMER_ROUTE");
    }else{
      if(["card","request","new","manage","transaction"].filter(key=>query.has(key)).length>1)throw new Error("CONFLICTING_CUSTOMER_ROUTE");
      if(query.get("view")==="requests")exclude(query,["card","new","manage","transaction","invite"]);
      if(query.get("view")==="cardholders")exclude(query,["card","request","new","transaction","invite"]);
      if(query.has("review")&&(query.get("review")!=="1"||!query.has("request")))throw new Error("CONFLICTING_CUSTOMER_ROUTE");
      if(query.has("invite")&&(query.get("invite")!=="1"||!query.has("focus")&&!query.has("card")))throw new Error("CONFLICTING_CUSTOMER_ROUTE");
    }
    const focus = query.get("focus") ?? query.get("activityCard") ?? query.get("card");
    if (query.has("focus") && query.has("card") && identifier(query.get("focus")!) !== identifier(query.get("card")!)) throw new Error("CONFLICTING_CUSTOMER_ROUTE");
    if (query.has("focus") && query.has("activityCard") && identifier(query.get("focus")!) !== identifier(query.get("activityCard")!)) throw new Error("CONFLICTING_CUSTOMER_ROUTE");
    if (taskRoute || query.get("view") === "activity" || (!query.has("view") && query.has("activityCard"))) {
      destination = focus ? `/cardholder-services/cards/${identifier(focus)}/${taskRoute ? task : "activity"}` : `/cardholder-services/${taskRoute ? task : "activity"}`;
      query.delete("focus"); query.delete("activityCard"); query.delete("view"); query.delete("card");
    } else if (query.has("new")) {
      if (query.get("new") !== "1" || ["focus","activityCard","request","card","manage"].some(key=>query.has(key)) || query.has("view")&&query.get("view")!=="cards") throw new Error("CONFLICTING_CUSTOMER_ROUTE");
      destination = "/cardholder-services/cards/new"; query.delete("new"); query.delete("view");
    } else if (query.has("request")) {
      if (query.has("card")) throw new Error("CONFLICTING_CUSTOMER_ROUTE");
      destination = `/cardholder-services/card-requests/${identifier(query.get("request")!)}`; query.delete("request"); query.delete("view");
    } else if (query.get("view") === "requests") { destination = "/cardholder-services/card-requests"; query.delete("view"); }
    else if (query.get("view") === "cardholders" || query.has("manage")) { destination = "/cardholder-services/cardholders"; query.delete("view"); }
    else if (focus) {
      destination = `/cardholder-services/cards/${identifier(focus)}${query.get("invite") === "1" ? "/invite" : ""}`;
      query.delete("focus"); query.delete("activityCard"); query.delete("card"); query.delete("view"); if (query.get("invite") === "1") query.delete("invite");
    } else if (query.get("view") === "cards" || query.has("page")) { destination = "/cardholder-services/cards"; query.delete("view"); }
    else if (query.get("view") === "overview") { destination = "/cardholder-services"; query.delete("view"); }
  } else if (path.startsWith("/money-accounts/")) {
    destination = `/money-accounts/${identifier(path.split("/")[2]!)}`;
    if(query.has("review")&&!query.has("task"))throw new Error("CONFLICTING_CUSTOMER_ROUTE");
    if (query.has("task")) { const task = query.get("task"); if (task !== "add" && task !== "withdraw") throw new Error("INVALID_CUSTOMER_ROUTE"); destination += task === "add" ? "/add-money" : "/withdraw"; query.delete("task"); }
  } else {
    const terminal = path.match(new RegExp(`^/(?:merchants|merchant-services/terminals)/(${uuid})(?:/.*)?$`, "i"));
    if (terminal) {
      destination = `/merchant-services/terminals/${identifier(terminal[1]!)}`;
      if (path.endsWith("/business-details")) destination += "/business-details";
      else if (query.get("tab") === "channels" || !query.has("tab")) {
        if (query.has("channel") && query.has("new")) throw new Error("CONFLICTING_CUSTOMER_ROUTE");
        if (query.has("channel")) { destination += `/channels/${identifier(query.get("channel")!)}`; query.delete("channel"); }
        else if (query.has("new")) { if (query.get("new") !== "1") throw new Error("INVALID_CUSTOMER_ROUTE"); destination += "/channels/new"; query.delete("new"); }
      } else { const suffix = Object.entries(terminalTasks).find(([, tab]) => tab === query.get("tab"))?.[0]; if (!suffix) throw new Error("INVALID_CUSTOMER_ROUTE"); destination += `/${suffix}`; }
      query.delete("tab");
    } else if (!new RegExp(`^/merchant-services/${uuid}/settings$`, "i").test(path)) {
      destination = "/merchant-services";
      if(query.has("new")&&(query.get("new")!=="1"||!["merchants","channels"].includes(query.get("section")??"")))throw new Error("CONFLICTING_CUSTOMER_ROUTE");
      if (query.get("new") === "1") { const service = query.get("view")?.match(new RegExp(`^merchant:(${uuid})$`, "i")); if (!service) throw new Error("INVALID_CUSTOMER_ROUTE"); destination += `/${identifier(service[1]!)}/terminals/new`; query.delete("view"); query.delete("new"); query.delete("section"); }
      else if (["channels", "merchants"].includes(query.get("section") ?? "")) { destination += "/terminals"; query.delete("section"); }
      else if (query.get("section") === "settings") { destination += "/settings"; query.delete("section"); }
      else if (["overview", "funds"].includes(query.get("section") ?? "")) {
        query.set("section", "overview");
        if(query.get("activity")==="payments")query.delete("activity");
        if(query.get("period")==="all")query.delete("period");
        if(!["activity","period","from","to","q","status","page"].some(key=>query.has(key)))query.delete("section");
      }
    }
  }
  return `${destination}${query.size ? `?${query}` : ""}`;
}

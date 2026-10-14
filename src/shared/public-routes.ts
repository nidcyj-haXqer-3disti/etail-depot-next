/** Fixed local destinations for bookmarks from the retired account application. */
const retiredDestinations: Record<string, string> = {
  "cardholder-services": "/credit-card-services",
  cards: "/credit-card-services",
  "merchant-services": "/payment-acceptance-service",
  merchants: "/payment-acceptance-service",
  login: "/help#access",
  profile: "/help#access",
  security: "/help#access",
  "shared-access": "/help#access",
  invitations: "/help#access",
  operations: "/help",
  "money-accounts": "/",
  accounts: "/",
  services: "/",
};

export function retiredRoute(pathname: string): { destination?: string } | null {
  const root = pathname.split("/")[1] ?? "";
  if (["api", "checkout", "pay", "payments"].includes(root)) return {};
  return Object.hasOwn(retiredDestinations, root) ? { destination: retiredDestinations[root] } : null;
}

/** Former public-page URLs. Match only known HTML aliases, never a nested service path. */
export function publicPageRedirect(pathname: string): string | null {
  const match = /^\/(card-services|payment-services)(?:\/|\.html|\/index\.html)?$/.exec(pathname);
  if (!match) return null;
  return match[1] === "card-services" ? "/credit-card-services" : "/payment-acceptance-service";
}

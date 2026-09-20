/** Fixed local destinations for bookmarks from the retired account application. */
const retiredDestinations: Record<string, string> = {
  "cardholder-services": "/card-services",
  cards: "/card-services",
  "merchant-services": "/payment-services",
  merchants: "/payment-services",
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

/** A task retains its exact card or account. Account home never inherits a card selection. */
export type CardholderTask = "activity" | "reports" | "settings" | "help" | "membership";
export function cardholderTaskHref(task: CardholderTask, selection: { cardId?: string | null; contextId?: string }, extra: Record<string, string> = {}) {
  const query = new URLSearchParams();
  if (selection.cardId) query.set("focus", selection.cardId.toLowerCase());
  else if (selection.contextId) query.set("context", selection.contextId.toLowerCase());
  for (const [key, value] of Object.entries(extra)) query.set(key, value);
  return `/cardholder-services/${task}${query.size ? `?${query}` : ""}`;
}
export function cardholderHomeHref(cardId?: string | null, extra: Record<string, string> = {}) {
  const query = new URLSearchParams(extra);
  if (cardId) { query.set("focus", cardId.toLowerCase()); if (!query.has("view")) query.set("view", "cards"); }
  return `/cardholder-services${query.size ? `?${query}` : ""}`;
}
